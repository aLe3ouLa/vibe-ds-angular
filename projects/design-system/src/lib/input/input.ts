import { Component, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'search';
type InputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'ds-input',
  imports: [FormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly type = input<InputType>('text');
  readonly size = input<InputSize>('medium');
  readonly placeholder = input('');
  readonly required = input(false);
  readonly disabled = input(false);
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);

  protected value = '';
  private formDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly inputId = `ds-input-${crypto.randomUUID()}`;
  protected readonly hintId = `${this.inputId}-hint`;
  protected readonly errorId = `${this.inputId}-error`;

  get describedBy(): string | null {
    if (this.error()) {
      return this.errorId;
    }

    if (this.hint()) {
      return this.hintId;
    }

    return null;
  }

  get isDisabled(): boolean {
    return this.disabled() || this.formDisabled;
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
  }

  protected handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }

  protected handleBlur(): void {
    this.onTouched();
  }
}