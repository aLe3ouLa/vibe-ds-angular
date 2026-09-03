import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';

import { EmptyState } from '../empty-state/empty-state';
import { Tag } from '../tag/tag';
import { TableCell } from './table-cell';
import { TableRow } from './table-row';
import { Table } from './table';

const meta: Meta<Table> = {
  title: 'Data Display/Table',
  component: Table,
  decorators: [
    moduleMetadata({ imports: [TableRow, TableCell, Tag, EmptyState] }),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<Table>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-table [caption]="caption">
        <thead>
          <ds-table-row>
            <ds-table-cell [header]="true">Order</ds-table-cell>
            <ds-table-cell [header]="true">Customer</ds-table-cell>
            <ds-table-cell [header]="true">Status</ds-table-cell>
          </ds-table-row>
        </thead>
        <tbody>
          <ds-table-row>
            <ds-table-cell>#1001</ds-table-cell>
            <ds-table-cell>Ada Lovelace</ds-table-cell>
            <ds-table-cell><ds-tag variant="success">Shipped</ds-tag></ds-table-cell>
          </ds-table-row>
          <ds-table-row>
            <ds-table-cell>#1002</ds-table-cell>
            <ds-table-cell>Grace Hopper</ds-table-cell>
            <ds-table-cell><ds-tag variant="info">Processing</ds-tag></ds-table-cell>
          </ds-table-row>
          <ds-table-row>
            <ds-table-cell>#1003</ds-table-cell>
            <ds-table-cell>Katherine Johnson</ds-table-cell>
            <ds-table-cell><ds-tag variant="error">Cancelled</ds-tag></ds-table-cell>
          </ds-table-row>
        </tbody>
      </ds-table>
    `,
  }),
  args: {
    caption: 'Recent orders',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('columnheader', { name: 'Order' }),
    ).toBeInTheDocument();
    await expect(canvas.getAllByRole('row')).toHaveLength(4); // 1 header + 3 data rows
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
  },
};

export const Striped: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ds-table caption="Recent orders" [striped]="true">
        <thead>
          <ds-table-row>
            <ds-table-cell [header]="true">Order</ds-table-cell>
            <ds-table-cell [header]="true">Customer</ds-table-cell>
          </ds-table-row>
        </thead>
        <tbody>
          <ds-table-row>
            <ds-table-cell>#1001</ds-table-cell>
            <ds-table-cell>Ada Lovelace</ds-table-cell>
          </ds-table-row>
          <ds-table-row>
            <ds-table-cell>#1002</ds-table-cell>
            <ds-table-cell>Grace Hopper</ds-table-cell>
          </ds-table-row>
          <ds-table-row>
            <ds-table-cell>#1003</ds-table-cell>
            <ds-table-cell>Katherine Johnson</ds-table-cell>
          </ds-table-row>
          <ds-table-row>
            <ds-table-cell>#1004</ds-table-cell>
            <ds-table-cell>Margaret Hamilton</ds-table-cell>
          </ds-table-row>
        </tbody>
      </ds-table>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <ds-table caption="Small" size="small">
          <thead>
            <ds-table-row>
              <ds-table-cell [header]="true">Order</ds-table-cell>
              <ds-table-cell [header]="true">Customer</ds-table-cell>
            </ds-table-row>
          </thead>
          <tbody>
            <ds-table-row>
              <ds-table-cell>#1001</ds-table-cell>
              <ds-table-cell>Ada Lovelace</ds-table-cell>
            </ds-table-row>
          </tbody>
        </ds-table>
        <ds-table caption="Medium (default)">
          <thead>
            <ds-table-row>
              <ds-table-cell [header]="true">Order</ds-table-cell>
              <ds-table-cell [header]="true">Customer</ds-table-cell>
            </ds-table-row>
          </thead>
          <tbody>
            <ds-table-row>
              <ds-table-cell>#1001</ds-table-cell>
              <ds-table-cell>Ada Lovelace</ds-table-cell>
            </ds-table-row>
          </tbody>
        </ds-table>
        <ds-table caption="Large" size="large">
          <thead>
            <ds-table-row>
              <ds-table-cell [header]="true">Order</ds-table-cell>
              <ds-table-cell [header]="true">Customer</ds-table-cell>
            </ds-table-row>
          </thead>
          <tbody>
            <ds-table-row>
              <ds-table-cell>#1001</ds-table-cell>
              <ds-table-cell>Ada Lovelace</ds-table-cell>
            </ds-table-row>
          </tbody>
        </ds-table>
      </div>
    `,
  }),
};

export const HiddenCaption: Story = {
  render: () => ({
    template: `
      <h2>Recent orders</h2>
      <ds-table caption="Recent orders" [captionVisible]="false">
        <thead>
          <ds-table-row>
            <ds-table-cell [header]="true">Order</ds-table-cell>
            <ds-table-cell [header]="true">Customer</ds-table-cell>
          </ds-table-row>
        </thead>
        <tbody>
          <ds-table-row>
            <ds-table-cell>#1001</ds-table-cell>
            <ds-table-cell>Ada Lovelace</ds-table-cell>
          </ds-table-row>
        </tbody>
      </ds-table>
    `,
  }),
};

export const EmptyDefault: Story = {
  render: () => ({
    template: `
      <ds-table caption="Recent orders">
        <thead>
          <ds-table-row>
            <ds-table-cell [header]="true">Order</ds-table-cell>
            <ds-table-cell [header]="true">Customer</ds-table-cell>
          </ds-table-row>
        </thead>
        <tbody></tbody>
      </ds-table>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const status = await canvas.findByRole('status');
    await expect(status).toHaveTextContent('No data');
  },
};

export const EmptyCustom: Story = {
  render: () => ({
    template: `
      <ds-table caption="Search results">
        <thead>
          <ds-table-row>
            <ds-table-cell [header]="true">Order</ds-table-cell>
            <ds-table-cell [header]="true">Customer</ds-table-cell>
          </ds-table-row>
        </thead>
        <tbody></tbody>
        <ds-empty-state
          slot="empty"
          title="No results"
          message="Try a different search term."
        />
      </ds-table>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const status = await canvas.findByRole('status');
    await expect(status).toHaveTextContent('No results');
    await expect(status).toHaveTextContent('Try a different search term.');
    await expect(canvas.queryByText('No data')).not.toBeInTheDocument();
  },
};
