import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { AlertBanner } from './alert-banner';
import { Button } from '../button/button';

const meta: Meta<AlertBanner> = {
  title: 'Feedback/Alert Banner',
  component: AlertBanner,
  decorators: [moduleMetadata({ imports: [Button] })],
  tags: ['autodocs'],
  args: {
    dismissed: fn(),
  },
};

export default meta;

type Story = StoryObj<AlertBanner>;

export const Announcement: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-alert-banner [variant]="variant" [message]="message" />
    `,
  }),
  args: {
    variant: 'info',
    message: 'Scheduled maintenance this Saturday, 10pm–12am UTC.',
  },
};

export const UpgradeOpportunity: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-alert-banner [variant]="variant" [message]="message">
        <ds-button slot="primary-action" variant="secondary">Upgrade now</ds-button>
        <ds-button slot="secondary-action" variant="ghost">Not now</ds-button>
      </ds-alert-banner>
    `,
  }),
  args: {
    variant: 'warning',
    message: 'Your trial ends in 3 days.',
  },
};

export const Error: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-alert-banner [variant]="variant" [message]="message">
        <ds-button slot="primary-action" variant="secondary">Try again</ds-button>
      </ds-alert-banner>
    `,
  }),
  args: {
    variant: 'error',
    message: "We couldn't save your changes.",
  },
};

export const Success: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-alert-banner [variant]="variant" [message]="message" />
    `,
  }),
  args: {
    variant: 'success',
    message: 'Your export is ready to download.',
  },
};

export const Dismissible: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-alert-banner
        [variant]="variant"
        [message]="message"
        [dismissible]="true"
        (dismissed)="dismissed()"
      />
    `,
  }),
  args: {
    variant: 'info',
    message: 'New comment on your post.',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(args.dismissed).toHaveBeenCalledOnce();
  },
};

export const LongMessageOverflow: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 420px">
        <ds-alert-banner [variant]="variant" [message]="message" />
      </div>
    `,
  }),
  args: {
    variant: 'info',
    message:
      'This is a deliberately long system announcement used to verify that the banner truncates its message with an ellipsis instead of wrapping or overflowing its container.',
  },
};
