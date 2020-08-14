import { InputFormControl } from './input-form-control';

export class DatePickerFormControl extends InputFormControl {
  getValue(): string {
    return super.getValue();
  }

  setValue(value: string | Date): void {
    super.setValue(value);
  }

  getInputType(): string {
    return 'date';
  }
}
