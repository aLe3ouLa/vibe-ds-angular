import { Component, input, output } from '@angular/core';

type TagVariant = 'neutral' | 'success' | 'error' | 'warning' | 'info';

@Component({
  imports: [],
  selector: 'ds-tag',
  styleUrl: './tag.scss',
  templateUrl: './tag.html',
})
export class Tag {
  readonly variant = input<TagVariant>('neutral');
  readonly dismissible = input(false);
  readonly dismissLabel = input('Remove tag');

  readonly dismissed = output<void>();

  protected handleDismiss(): void {
    this.dismissed.emit();
  }
}
