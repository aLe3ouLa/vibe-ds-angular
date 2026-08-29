import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Card } from './card';

const meta: Meta<Card> = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<Card>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-card [variant]="variant" [padding]="padding">
        <h3>Plan usage</h3>
        <p>You've used 8 of 10 seats this month.</p>
      </ds-card>
    `,
  }),
  args: {
    variant: 'default',
    padding: 'md',
  },
};

export const Subtle: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-card [variant]="variant" [padding]="padding">
        <p>Quieter surface, more breathing room.</p>
      </ds-card>
    `,
  }),
  args: {
    variant: 'subtle',
    padding: 'lg',
  },
};
