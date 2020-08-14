import { FormEvent } from '../models/types';

import { PropertyGridUtils } from '../utils/property-grid-utils';

import { InputFormControl } from './input-form-control';

export class CheckboxFormControl extends InputFormControl {
  getInputType(): string {
    return 'checkbox';
  }

  getValue(): boolean {
    return this.value as boolean;
  }

  setValue(value: string | boolean): void {
    const val = PropertyGridUtils.toBool(value);
    super.setValue(val);
    this.getNativeElement().checked = val;
  }

  protected onValueChange(event: FormEvent<HTMLInputElement>): void {
    this.setValue(event.target.checked);
  }
}
