import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-table-cell',
  imports: [],
  template: `<ng-content />`,
  styleUrl: './table-cell.scss',
  host: {
    '[attr.role]': 'header() ? "columnheader" : "cell"',
    '[class.table-cell--header]': 'header()',
  },
})
export class TableCell {
  readonly header = input(false);
}
