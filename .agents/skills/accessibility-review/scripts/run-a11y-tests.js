#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const args = process.argv.slice(2);

const url = args.find((arg) => !arg.startsWith("--"));

const outputArg = args.find((arg) => arg.startsWith("--output="));
const outputPath = outputArg
  ? outputArg.slice("--output=".length)
  : null;

if (!url) {
  console.error(`
Usage:

  node run-a11y-tests.js <url>

Example:

  node run-a11y-tests.js "http://localhost:6006/?path=/story/button--primary"

Optional:

  node run-a11y-tests.js <url> --output=a11y-results.json
`);

  process.exit(2);
}

const browser = await chromium.launch();

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  console.log(`Auditing ${url}`);

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  /*
   * Storybook renders the actual story inside an iframe.
   *
   * We need to run axe against that iframe, not against Storybook's
   * manager interface. Storybook's dev server keeps a persistent
   * WebSocket open for HMR, so "networkidle" never resolves here.
   */

  /*
   * Wait for the preview iframe to become available.
   */
  await page.locator("#storybook-preview-iframe").waitFor({
    state: "visible",
    timeout: 30000,
  });

  const iframe = page
    .frames()
    .find((frame) =>
      frame.url().includes("iframe.html")
    );

  if (!iframe) {
    throw new Error(
      "Could not find the Storybook preview iframe."
    );
  }

  /*
   * Wait for the story to render inside the preview iframe.
   */
  await iframe.locator("body").waitFor({
    state: "visible",
    timeout: 30000,
  });

  console.log(`Preview URL: ${iframe.url()}`);

  /*
   * Run axe against the Storybook preview iframe.
   *
   * AxeBuilder needs the top-level Page (it walks frames itself via
   * page.mainFrame()); a Frame errors with "page.mainFrame is not a
   * function". We scope the scan to the preview iframe with .include()
   * so we audit the component, not Storybook's manager chrome.
   */
  const results = await new AxeBuilder({ page })
    .include(["#storybook-preview-iframe", "body"])
    .analyze();

  const summary = {
    violations: results.violations.length,
    incomplete: results.incomplete.length,
    passes: results.passes.length,
    inapplicable: results.inapplicable.length,
  };

  const report = {
    url,
    previewUrl: iframe.url(),
    timestamp: new Date().toISOString(),
    summary,

    violations: results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,

      nodes: violation.nodes.map((node) => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary,
      })),
    })),

    incomplete: results.incomplete.map((item) => ({
      id: item.id,
      impact: item.impact,
      description: item.description,
      help: item.help,
      helpUrl: item.helpUrl,

      nodes: item.nodes.map((node) => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary,
      })),
    })),

    passes: results.passes.map((pass) => ({
      id: pass.id,
      impact: pass.impact,
      description: pass.description,
      help: pass.help,
    })),

    consoleErrors,
  };

  if (outputPath) {
    fs.writeFileSync(
      outputPath,
      JSON.stringify(report, null, 2),
      "utf8"
    );

    console.log(`\nReport written to ${outputPath}`);
  }

  console.log("\nAccessibility audit");
  console.log("-------------------");
  console.log(`Violations: ${summary.violations}`);
  console.log(`Incomplete: ${summary.incomplete}`);
  console.log(`Passes:     ${summary.passes}`);

  if (consoleErrors.length > 0) {
    console.log(`Console errors: ${consoleErrors.length}`);

    for (const message of consoleErrors) {
      console.log(`  ${message}`);
    }
  }

  if (results.violations.length > 0) {
    console.log("\nViolations:\n");

    for (const violation of results.violations) {
      console.log(
        `[${violation.impact ?? "unknown"}] ${violation.id}`
      );

      console.log(`  ${violation.help}`);
      console.log(`  ${violation.helpUrl}`);

      for (const node of violation.nodes) {
        console.log(`  Target: ${node.target.join(", ")}`);
        console.log(`  HTML:   ${node.html}`);
      }

      console.log("");
    }
  }

  /*
   * Fail in CI if axe finds violations.
   */
  if (results.violations.length > 0) {
    process.exitCode = 1;
  }

  await context.close();
} catch (error) {
  console.error("\nAccessibility audit failed:");
  console.error(error);

  process.exitCode = 2;
} finally {
  await browser.close();
}
