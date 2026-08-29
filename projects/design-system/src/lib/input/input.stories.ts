import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Input } from './input';

const meta: Meta<Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
  label: {
    control: 'text',
  },
  placeholder: {
    control: 'text',
  },
  type: {
    control: 'select',
    options: ['text', 'email', 'password', 'search'],
  },
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'],
  },
  required: {
    control: 'boolean',
  },
  disabled: {
    control: 'boolean',
  },
  error: {
    control: 'text',
    description: 'Custom validation message and invalid state.',
    table: {
      type: {
        summary: 'string | null',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
  hint: {
    control: 'text',
    description: 'Supporting text below the input.',
    table: {
      type: {
        summary: 'string | null',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
},
};

export default meta;

type Story = StoryObj<Input>;

export const Default: Story = {
  args: {
    label: 'Display name',
    placeholder: 'Enter your name',
    type: 'text',
    size: 'medium',
    required: false,
    disabled: false,
    error: null,
    hint: null,
  },
};

export const Email: Story = {
  args: {
    label: 'Email',
    placeholder: 'name@example.com',
    type: 'email',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
  },
};

export const Search: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search tracks',
    type: 'search',
  },
};

export const Required: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    required: true,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    hint: 'Use between 3 and 30 characters.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'name@example.com',
    type: 'email',
    error: 'Enter a valid email address.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Account email',
    type: 'email',
    value: 'alexandra@example.com',
    disabled: true,
  },
};