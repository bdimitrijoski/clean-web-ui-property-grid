import { PropertyGridFormControlsMap } from '../controls/property-grid-form-controls-map';
import { DataObject } from '../models/types';

import { FormControlComposite } from './form-control-composite';
import { PropertyGridRowGroup } from './property-grid-row-group';

/**
 * The fieldset element is a Concrete Composite.
 */
export class PropertyGridForm extends FormControlComposite {
  private propertyGridFormCssClass = 'property-grid-form';
  private propertyGridTableCssClass = 'property-grid';
  protected controls: PropertyGridFormControlsMap = {};

  createNatveElement(): void {
    super.createNatveElement();
    const el = this.getNativeElement();
    el.classList.add(this.propertyGridFormCssClass);

    const pgTable = <HTMLTableElement>document.createElement('table');
    pgTable.classList.add(this.propertyGridTableCssClass);
    el.appendChild(pgTable);
  }

  public render(): any {
    const table = this.getNativeElement().querySelector('table');
    table.appendChild(super.render());
    return table;
  }

  public setData(data: DataObject): void {
    for (const name in this.controls) {
      if (this.controls[name] && this.isRowGroupCtrl(this.controls[name])) {
        this.controls[name].setValue(data);
      }
    }
  }

  public getData(): any {
    let response = {};
    for (const name in this.controls) {
      if (this.controls[name] && this.isRowGroupCtrl(this.controls[name])) {
        response = Object.assign(response, this.controls[name].getData());
      }
    }

    return response;
  }

  private isRowGroupCtrl(ctrl): boolean {
    return ctrl.constructor.name.toString() === PropertyGridRowGroup.name.toString();
  }

  getNativeElementType(): string {
    return 'form';
  }

  attachEventListeners(): void {}
  removeEventListeners(): void {}
}
