import { InputFormControl } from './input-form-control';

export class TextboxFormControl extends InputFormControl {
  getInputType(): string {
    return 'text';
  }
}
