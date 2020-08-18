import { FormEvent } from '../models/types';

import { FormControl, FormControlParams } from './form-control';

export class LabelFormControl extends FormControl {
  constructor(params: FormControlParams) {
    super(params);
    this.onValueChange = this.onValueChange.bind(this);
  }

  getNativeElementType(): string {
    return 'label';
  }

  getNativeElement(): HTMLLabelElement {
    return super.getNativeElement() as HTMLLabelElement;
  }

  getValue(): boolean {
    return this.value as boolean;
  }

  setValue(value: string): void {
    super.setValue(value);
    this.getNativeElement().innerHTML = value;
  }

  render(): HTMLLabelElement {
    this.getNativeElement().innerHTML = this.value;
    return this.getNativeElement();
  }

  protected onValueChange(event: FormEvent<HTMLLabelElement>): void {
    this.setValue(event.target.innerText);
  }

  attachEventListeners(): void {}
  removeEventListeners(): void {}
}
