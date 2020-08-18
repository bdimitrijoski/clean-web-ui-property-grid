import { DataObject } from '../models/types';

import { FormControl } from './form-control';
import { FormControlsMap } from './form-controls-map';
import { IFormControl } from './iform-control';

export abstract class FormControlComposite extends FormControl {
  protected controls: FormControlsMap = {};

  add(field: IFormControl): void {
    const name = field.getName();
    this.controls[name] = field;
  }

  remove(component: IFormControl): void {
    delete this.controls[component.getName()];
  }

  setValue(data: DataObject): void {
    const setDataCallback = (control: IFormControl) => {
      const val = data.hasOwnProperty(control.getName()) ? data[control.getName()] : data;
      control.setValue(val);
    };
    this.iterateControls(setDataCallback);
  }

  getData(): any {
    const data = {};
    const getDataCallback = (control: IFormControl) => {
      data[control.getName()] = control.getValue();
    };
    this.iterateControls(getDataCallback);

    return data;
  }

  render(): any {
    const output = document.createDocumentFragment();
    const renderCallback = (control: IFormControl) => output.appendChild(control.render());
    this.iterateControls(renderCallback);
    return output;
  }

  destroy(): void {
    const destroyCallback = (control: IFormControl) => control.destroy();
    this.iterateControls(destroyCallback);

    this.controls = {};
    super.destroy();
  }

  private iterateControls(callback: (control: IFormControl) => void): void {
    Object.keys(this.controls).forEach((controlName) => {
      callback(this.controls[controlName]);
    });
  }
}
