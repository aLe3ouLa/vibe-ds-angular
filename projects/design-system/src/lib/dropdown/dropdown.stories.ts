import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { expect, userEvent, within } from 'storybook/test';

import { Dropdown } from './dropdown';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const meta: Meta<Dropdown<string>> = {
  title: 'Forms/Dropdown',
  component: Dropdown,
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<Dropdown<string>>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown
        [options]="options"
        [label]="label"
        [placeholder]="placeholder"
      />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruit',
    placeholder: 'Select a fruit',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Favorite fruit' });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Enter}');

    await expect(trigger).toHaveTextContent('Apple');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Searchable: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown
        [options]="options"
        [label]="label"
        [placeholder]="placeholder"
        [searchable]="true"
      />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruit',
    placeholder: 'Search a fruit',
  },
};

export const Multiple: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown
        [options]="options"
        [label]="label"
        [placeholder]="placeholder"
        [multiple]="true"
        [(ngModel)]="value"
      />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruits',
    placeholder: 'Select fruits',
    value: ['apple', 'banana'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('button', { name: /^Remove/ })).toHaveLength(2);

    await userEvent.click(canvas.getByRole('button', { name: 'Remove Apple' }));

    await expect(canvas.getAllByRole('button', { name: /^Remove/ })).toHaveLength(1);
  },
};

export const Small: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown [options]="options" [label]="label" [placeholder]="placeholder" size="small" />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruit',
    placeholder: 'Select a fruit',
  },
};

export const Large: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown [options]="options" [label]="label" [placeholder]="placeholder" size="large" />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruit',
    placeholder: 'Select a fruit',
  },
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown
        [options]="options"
        [label]="label"
        [placeholder]="placeholder"
        [disabled]="true"
      />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruit',
    placeholder: 'Select a fruit',
  },
};

export const ErrorState: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown
        [options]="options"
        [label]="label"
        [placeholder]="placeholder"
        [error]="error"
      />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruit',
    placeholder: 'Select a fruit',
    error: 'Please select a fruit.',
  },
};

export const Readonly: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown
        [options]="options"
        [label]="label"
        [readonly]="true"
        [(ngModel)]="value"
      />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruit',
    value: 'cherry',
  },
};

export const Clearable: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-dropdown
        [options]="options"
        [label]="label"
        [placeholder]="placeholder"
        [clearable]="true"
        clearAriaLabel="Clear favorite fruit"
        [(ngModel)]="value"
      />
    `,
  }),
  args: {
    options: fruitOptions,
    label: 'Favorite fruit',
    placeholder: 'Select a fruit',
    value: 'banana',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Favorite fruit' });

    await expect(trigger).toHaveTextContent('Banana');

    await userEvent.click(canvas.getByRole('button', { name: 'Clear favorite fruit' }));

    await expect(trigger).toHaveTextContent('Select a fruit');
  },
};
