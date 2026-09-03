import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  host: { role: 'status' },
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input<string | null>(null);
}
