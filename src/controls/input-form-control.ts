import { FormEvent } from '../models/types';

import { FormControl, FormControlParams } from './form-control';

export abstract class InputFormControl extends FormControl {
  constructor(params: FormControlParams) {
    super(params);
    this.onValueChange = this.onValueChange.bind(this);
  }

  /**
   * Set input type (checkbox, text, number)
   * @param type
   */
  abstract getInputType(): string;

  getNativeElementType(): string {
    return 'input';
  }

  getNativeElement(): HTMLInputElement {
    return super.getNativeElement() as HTMLInputElement;
  }

  renderValue(): void {
    if (!this.value) {
      return;
    }
    this.getNativeElement().value = this.value.toString();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setValue(value: any): void {
    super.setValue(value);
    this.renderValue();
  }

  render(): HTMLInputElement {
    this.assignAttributes();
    this.renderValue();
    return this.getNativeElement();
  }

  createNatveElement(): void {
    super.createNatveElement();
    this.getNativeElement().type = this.getInputType();
    this.getNativeElement().name = this.getName();
  }

  private assignAttributes() {
    if (!this.attributes) {
      return;
    }

    Object.keys(this.attributes).forEach((attr) => {
      this.getNativeElement().setAttribute(attr, this.attributes[attr].toString());
    });
  }

  attachEventListeners(): void {
    this.getNativeElement().addEventListener('change', this.onValueChange);
  }

  removeEventListeners(): void {
    this.getNativeElement().removeEventListener('change', this.onValueChange);
  }

  protected onValueChange(event: FormEvent<HTMLInputElement>): void {
    this.setValue(event.target.value);
  }
}
