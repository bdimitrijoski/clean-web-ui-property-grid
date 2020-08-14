import { InputFormControl } from './input-form-control';

export class ColorPickerFormControl extends InputFormControl {
  getInputType(): string {
    return 'color';
  }
}
