import { Component, input, output } from '@angular/core';

type AlertBannerVariant = 'error' | 'warning' | 'success' | 'info';

const severityLabels: Record<AlertBannerVariant, string> = {
  error: 'Error',
  warning: 'Warning',
  success: 'Success',
  info: 'Info',
};

@Component({
  imports: [],
  selector: 'ds-alert-banner',
  styleUrl: './alert-banner.scss',
  templateUrl: './alert-banner.html',
})
export class AlertBanner {
  readonly variant = input.required<AlertBannerVariant>();
  readonly message = input.required<string>();
  readonly dismissible = input(false);
  readonly dismissLabel = input('Dismiss');

  readonly dismissed = output<void>();

  protected get role(): 'alert' | 'status' {
    return this.variant() === 'error' ? 'alert' : 'status';
  }

  protected get severityLabel(): string {
    return severityLabels[this.variant()];
  }

  protected handleDismiss(): void {
    this.dismissed.emit();
  }
}
