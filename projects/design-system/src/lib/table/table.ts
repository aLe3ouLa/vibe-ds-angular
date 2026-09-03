import { Component, computed, contentChild, contentChildren, input } from '@angular/core';

import { EmptyState } from '../empty-state/empty-state';
import { TableRow } from './table-row';

type TableSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'ds-table',
  imports: [EmptyState],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  readonly caption = input<string | null>(null);
  readonly captionVisible = input(true);
  readonly ariaLabel = input<string | null>(null);
  readonly striped = input(false);
  readonly size = input<TableSize>('medium');

  private readonly rows = contentChildren(TableRow, { descendants: true });
  protected readonly customEmptyState = contentChild(EmptyState);

  protected readonly scrollRegionLabel = computed(
    () => this.ariaLabel() ?? this.caption() ?? null,
  );

  protected readonly isEmpty = computed(
    () => !this.rows().some((row) => !row.isHeaderRow),
  );
}
