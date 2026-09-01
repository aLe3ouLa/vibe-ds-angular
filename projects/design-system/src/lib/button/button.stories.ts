import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent } from 'storybook/test';

import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<Button>;

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-button [variant]="variant" [disabled]="disabled">
        Play
      </ds-button>
    `,
  }),
  args: {
    variant: 'primary',
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (!button) {
      throw new Error('Button not found');
    }
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
  },
};

export const Secondary: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-button [variant]="variant" [disabled]="disabled">
        Cancel
      </ds-button>
    `,
  }),
  args: {
    variant: 'secondary',
    disabled: false,
  },
};

export const Ghost: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-button [variant]="variant" [disabled]="disabled">
        Edit
      </ds-button>
    `,
  }),
  args: {
    variant: 'ghost',
    disabled: false,
  },
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-button [variant]="variant" [disabled]="disabled">
        Unavailable
      </ds-button>
    `,
  }),
  args: {
    variant: 'primary',
    disabled: true,
  },
};