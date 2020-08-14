import { InputFormControl } from './input-form-control';

export class NumberFormControl extends InputFormControl {
  getValue(): number {
    return +super.getValue();
  }

  setValue(value: string | number): void {
    super.setValue(+value.toString());
  }

  getInputType(): string {
    return 'number';
  }
}
