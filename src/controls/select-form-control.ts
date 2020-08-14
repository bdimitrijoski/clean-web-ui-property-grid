import { FormEvent, Options } from '../models/types';

import { FormControl, FormControlParams } from './form-control';

export interface SelectFormControlOptions extends Options {
  items: string[];
}
export interface SelectFormControlParams extends FormControlParams {
  options: SelectFormControlOptions;
}

export class SelectFormControl extends FormControl {
  private items: string[];

  constructor(params: SelectFormControlParams) {
    super(params);
    this.items = params.options.items;

    this.onValueChange = this.onValueChange.bind(this);
  }

  getNativeElementType(): string {
    return 'select';
  }

  getNativeElement(): HTMLSelectElement {
    return super.getNativeElement() as HTMLSelectElement;
  }

  setValue(value: string | number): void {
    super.setValue(value);
    this.renderValue();
  }

  renderValue(): void {
    if (!this.value) {
      return;
    }
    this.getNativeElement().value = this.value.toString();
  }

  createNatveElement(): void {
    super.createNatveElement();
    this.getNativeElement().name = this.name;
  }

  render(): HTMLSelectElement {
    this.createOptions();

    return this.getNativeElement();
  }

  createOptions(): void {
    if (!this.options) {
      return;
    }

    this.items.forEach((item) => {
      const option = document.createElement('option') as HTMLOptionElement;
      option.innerHTML = item;
      option.value = item;
      this.getNativeElement().options.add(option);
    });
  }

  attachEventListeners(): void {
    this.nativeElement.addEventListener('change', this.onValueChange);
  }
  removeEventListeners(): void {
    this.nativeElement.removeEventListener('change', this.onValueChange);
  }

  protected onValueChange(event: FormEvent<HTMLSelectElement>): void {
    this.setValue(event.target.value);
  }
}
