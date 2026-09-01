import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Tag } from '../tag/tag';

export interface DropdownOption<T> {
  value: T;
  label: string;
}

type DropdownSize = 'small' | 'medium' | 'large';

const TYPEAHEAD_RESET_MS = 500;

@Component({
  selector: 'ds-dropdown',
  imports: [Tag],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Dropdown),
      multi: true,
    },
  ],
})
export class Dropdown<T> implements ControlValueAccessor {
  readonly options = input.required<DropdownOption<T>[]>();
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly multiple = input(false);
  readonly searchable = input(false);
  readonly clearable = input(false);
  readonly size = input<DropdownSize>('medium');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly autoFocus = input(false);

  readonly ariaLabel = input<string | null>(null);
  readonly menuAriaLabel = input<string | null>(null);
  readonly clearAriaLabel = input('Clear selection');

  protected value: T | T[] | null = null;
  private formDisabled = false;
  private onChange: (value: T | T[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);
  protected readonly searchTerm = signal('');

  protected readonly triggerRef =
    viewChild<ElementRef<HTMLElement>>('trigger');
  protected readonly listboxRef =
    viewChild<ElementRef<HTMLElement>>('listbox');

  protected readonly listboxStyle = signal<{
    top: string;
    left: string;
    width: string;
  } | null>(null);

  protected readonly dropdownId = `ds-dropdown-${crypto.randomUUID()}`;
  protected readonly listboxId = `${this.dropdownId}-listbox`;
  protected readonly hintId = `${this.dropdownId}-hint`;
  protected readonly errorId = `${this.dropdownId}-error`;

  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);

  constructor() {
    /*
     * Move the listbox to a direct child of <body> once it renders.
     * A plain child element can get trapped inside an ancestor's
     * `overflow: hidden`/`auto` (position: absolute) or an ancestor's
     * `transform` (position: fixed — any transform, even the identity
     * matrix, creates a new containing block per the CSS spec). Storybook's
     * own docs-page zoom wrapper does exactly that. Re-parenting to <body>
     * removes every such ancestor from the equation. Angular tracks this
     * view by its own internal view refs, not by DOM parentage, so this
     * is safe to do manually without @angular/cdk's Overlay/portal.
     */
    effect(() => {
      const listbox = this.listboxRef()?.nativeElement;

      if (listbox && listbox.parentElement !== this.document.body) {
        this.renderer.appendChild(this.document.body, listbox);
      }
    });
  }

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private typeaheadBuffer = '';
  private typeaheadTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly filteredOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.options();
    }

    return this.options().filter((option) =>
      option.label.toLowerCase().includes(term)
    );
  });

  protected readonly activeOptionId = computed(() => {
    const index = this.activeIndex();
    const opts = this.filteredOptions();

    if (index < 0 || index >= opts.length) {
      return null;
    }

    return this.optionId(opts[index]);
  });

  protected get describedBy(): string | null {
    if (this.error()) {
      return this.errorId;
    }

    if (this.hint()) {
      return this.hintId;
    }

    return null;
  }

  protected get isDisabled(): boolean {
    return this.disabled() || this.formDisabled;
  }

  writeValue(value: T | T[] | null): void {
    this.value = value ?? (this.multiple() ? [] : null);
  }

  registerOnChange(onChange: (value: T | T[] | null) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
  }

  protected optionId(option: DropdownOption<T>): string {
    return `${this.dropdownId}-option-${this.options().indexOf(option)}`;
  }

  protected selectedOptions(): DropdownOption<T>[] {
    if (this.multiple()) {
      const values = (this.value as T[] | null) ?? [];
      return this.options().filter((option) => values.includes(option.value));
    }

    const value = this.value as T | null;

    if (value === null || value === undefined) {
      return [];
    }

    return this.options().filter((option) => option.value === value);
  }

  protected isSelected(option: DropdownOption<T>): boolean {
    if (this.multiple()) {
      return ((this.value as T[] | null) ?? []).includes(option.value);
    }

    return this.value === option.value;
  }

  protected hasValue(): boolean {
    return this.selectedOptions().length > 0;
  }

  protected triggerLabel(): string {
    const selected = this.selectedOptions();

    if (selected.length === 0) {
      return this.placeholder();
    }

    if (this.multiple()) {
      return `${selected.length} selected`;
    }

    return selected[0].label;
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  protected open(): void {
    if (this.isDisabled || this.readonly() || this.isOpen()) {
      return;
    }

    this.isOpen.set(true);
    this.updatePosition();

    const opts = this.filteredOptions();

    if (opts.length === 0) {
      this.activeIndex.set(-1);
      return;
    }

    if (!this.multiple() && this.value !== null) {
      const index = opts.findIndex((option) => option.value === this.value);
      this.activeIndex.set(index >= 0 ? index : 0);
    } else {
      this.activeIndex.set(0);
    }
  }

  protected close(): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.searchTerm.set('');
    this.onTouched();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  protected handleViewportChange(): void {
    if (this.isOpen()) {
      this.updatePosition();
    }
  }

  /**
   * Positions the listbox with `position: fixed` from the trigger's
   * viewport coordinates, rather than `position: absolute` relative to
   * the host. Fixed positioning escapes any ancestor's `overflow: hidden`
   * or `overflow: auto` (e.g. Storybook's docs-page story preview box),
   * which absolute positioning does not.
   */
  private updatePosition(): void {
    const trigger = this.triggerRef()?.nativeElement;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();

    this.listboxStyle.set({
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    });
  }

  protected toggleOpen(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  protected commitActive(): void {
    const opts = this.filteredOptions();
    const index = this.activeIndex();

    if (index < 0 || index >= opts.length) {
      return;
    }

    this.selectOption(opts[index]);
  }

  protected selectOption(option: DropdownOption<T>): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    if (this.multiple()) {
      const current = (this.value as T[] | null) ?? [];
      const next = current.includes(option.value)
        ? current.filter((value) => value !== option.value)
        : [...current, option.value];

      this.value = next;
      this.onChange(next);
      return;
    }

    this.value = option.value;
    this.onChange(option.value);
    this.close();
  }

  protected removeOption(option: DropdownOption<T>): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    const current = (this.value as T[] | null) ?? [];
    const next = current.filter((value) => value !== option.value);

    this.value = next;
    this.onChange(next);
  }

  protected clear(): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    this.value = this.multiple() ? [] : null;
    this.onChange(this.value);
  }

  protected handleSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.activeIndex.set(0);

    if (!this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.isOpen()) {
          this.moveActive(1);
        } else {
          this.open();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.moveActive(-1);
        } else {
          this.open();
        }
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(0);
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(this.filteredOptions().length - 1);
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.isOpen()) {
          this.commitActive();
        } else if (!this.searchable()) {
          this.open();
        }
        break;

      case ' ':
        if (!this.searchable()) {
          event.preventDefault();
          if (this.isOpen()) {
            this.commitActive();
          } else {
            this.open();
          }
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
        }
        break;

      default:
        if (!this.searchable() && event.key.length === 1) {
          this.handleTypeahead(event.key);
        }
        break;
    }
  }

  private moveActive(delta: number): void {
    const opts = this.filteredOptions();

    if (opts.length === 0) {
      return;
    }

    const next = this.activeIndex() + delta;
    this.activeIndex.set(Math.min(Math.max(next, 0), opts.length - 1));
  }

  private handleTypeahead(char: string): void {
    this.typeaheadBuffer += char.toLowerCase();

    if (this.typeaheadTimeout) {
      clearTimeout(this.typeaheadTimeout);
    }

    this.typeaheadTimeout = setTimeout(() => {
      this.typeaheadBuffer = '';
    }, TYPEAHEAD_RESET_MS);

    const opts = this.filteredOptions();
    const matchIndex = opts.findIndex((option) =>
      option.label.toLowerCase().startsWith(this.typeaheadBuffer)
    );

    if (matchIndex >= 0) {
      if (!this.isOpen()) {
        this.open();
      }
      this.activeIndex.set(matchIndex);
    }
  }
}
