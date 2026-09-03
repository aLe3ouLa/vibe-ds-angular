import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'ds-table-row',
  imports: [],
  template: `<ng-content />`,
  styleUrl: './table-row.scss',
  host: { role: 'row' },
})
export class TableRow {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Rows inside `<thead>` are the header row; rows inside `<tbody>` hold data. */
  get isHeaderRow(): boolean {
    return this.elementRef.nativeElement.closest('thead') !== null;
  }
}
