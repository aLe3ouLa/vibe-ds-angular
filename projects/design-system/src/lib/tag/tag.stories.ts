import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tag } from './tag';

const meta: Meta<Tag> = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    dismissed: fn(),
  },
};

export default meta;

type Story = StoryObj<Tag>;

export const Neutral: Story = {
  render: (args) => ({
    props: args,
    template: `<ds-tag>Beta</ds-tag>`,
  }),
};

export const Success: Story = {
  render: (args) => ({
    props: args,
    template: `<ds-tag variant="success">Active</ds-tag>`,
  }),
};

export const Error: Story = {
  render: (args) => ({
    props: args,
    template: `<ds-tag variant="error">Failed</ds-tag>`,
  }),
};

export const Warning: Story = {
  render: (args) => ({
    props: args,
    template: `<ds-tag variant="warning">Pending review</ds-tag>`,
  }),
};

export const Info: Story = {
  render: (args) => ({
    props: args,
    template: `<ds-tag variant="info">New</ds-tag>`,
  }),
};

export const Dismissible: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-tag
        variant="info"
        [dismissible]="true"
        dismissLabel="Remove filter: Beta"
        (dismissed)="dismissed()"
      >
        Beta
      </ds-tag>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dismissButton = await canvas.findByRole('button', {
      name: 'Remove filter: Beta',
    });

    await userEvent.click(dismissButton);

    await expect(args.dismissed).toHaveBeenCalledOnce();
  },
};
