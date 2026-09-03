import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EmptyState } from './empty-state';

const meta: Meta<EmptyState> = {
  title: 'Data Display/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<EmptyState>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ds-empty-state title="No data" />`,
  }),
};

export const WithMessage: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-empty-state
        title="No results"
        message="Try adjusting your filters or search terms."
      />
    `,
  }),
};

export const WithProjectedIcon: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-empty-state title="No results" message="Try a different search.">
        <span slot="icon" aria-hidden="true" style="font-size: 2rem;">🔍</span>
      </ds-empty-state>
    `,
  }),
};
