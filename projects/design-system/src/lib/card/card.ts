import { Component, input } from '@angular/core';

type CardVariant = 'default' | 'subtle';
type CardPadding = 'sm' | 'md' | 'lg';

@Component({
  imports: [],
  selector: 'ds-card',
  styleUrl: './card.scss',
  templateUrl: './card.html',
})
export class Card {
  readonly variant = input<CardVariant>('default');
  readonly padding = input<CardPadding>('md');
}
