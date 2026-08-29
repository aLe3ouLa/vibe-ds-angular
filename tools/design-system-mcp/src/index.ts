import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const designSystemRoot = resolve(here, '../../../projects/design-system');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function loadRegistry(): any[] {
  return readJson(resolve(designSystemRoot, 'component-registry.json'))
    .components;
}

function loadCompodocComponents(): any[] {
  return readJson(resolve(designSystemRoot, 'documentation.json')).components;
}

function loadTokens(): { name: string; value: string }[] {
  const scss = readFileSync(
    resolve(designSystemRoot, 'src/lib/styles/_semantic.scss'),
    'utf-8',
  );
  const tokens: { name: string; value: string }[] = [];
  for (const match of scss.matchAll(/--(ds-[\w-]+):\s*([^;]+);/g)) {
    tokens.push({ name: `--${match[1]}`, value: match[2].trim() });
  }
  return tokens;
}

const server = new McpServer({
  name: 'design-system-discovery',
  version: '0.2.0',
});

server.registerTool(
  'list_components',
  {
    description:
      'List the public Angular components in the design system, with their governance status and documentation links. Sourced from component-registry.json, the governance-owned list of what is actually public.',
    inputSchema: z.object({}),
  },
  async () => ({
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          loadRegistry().map(({ compodocName: _compodocName, ...entry }) => entry),
          null,
          2,
        ),
      },
    ],
  }),
);

server.registerTool(
  'get_component_api',
  {
    description:
      'Get the real inputs, outputs, and types for a design system component, generated from its TypeScript source via compodoc. Call this before writing any usage of a ds-* component so prop names and types are never guessed.',
    inputSchema: z.object({
      name: z.string().describe('The component selector, e.g. "ds-button"'),
    }),
  },
  async ({ name }) => {
    const registryEntry = loadRegistry().find((c) => c.name === name);
    if (!registryEntry) {
      return {
        content: [
          {
            type: 'text',
            text: `"${name}" is not a public design system component. Call list_components for the current list.`,
          },
        ],
      };
    }

    const compodocEntry = loadCompodocComponents().find(
      (c) => c.name === registryEntry.compodocName,
    );
    const { compodocName: _compodocName, ...publicRegistryEntry } =
      registryEntry;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              ...publicRegistryEntry,
              selector: compodocEntry?.selector ?? registryEntry.name,
              inputs: (compodocEntry?.inputsClass ?? []).map((i: any) => ({
                name: i.name,
                type: i.type,
                default: i.defaultValue,
                description: i.description || undefined,
              })),
              outputs: (compodocEntry?.outputsClass ?? []).map((o: any) => ({
                name: o.name,
                type: o.type ?? o.eventType,
              })),
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.registerTool(
  'list_tokens',
  {
    description:
      "List the design system's semantic design tokens (CSS custom properties) with their resolved values — colors, spacing, radius, and typography. Generated from the DTCG token source in tokens/*.tokens.json. Use these instead of hardcoding raw hex/rem values.",
    inputSchema: z.object({}),
  },
  async () => ({
    content: [
      {
        type: 'text',
        text: JSON.stringify(loadTokens(), null, 2),
      },
    ],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
