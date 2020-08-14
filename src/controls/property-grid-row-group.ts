import { PropertyGridFormControlsMap } from '../controls/property-grid-form-controls-map';

import { DataObject } from '../models/types';

import { FormControlComposite } from './form-control-composite';

export class PropertyGridRowGroup extends FormControlComposite {
  protected controls: PropertyGridFormControlsMap = {};
  private propertyGridRowGroupCssClass = 'property-grid-group';
  private propertyGridCellCssClass = 'property-grid-cell';
  public render(): any {
    const el = this.getNativeElement();
    el.appendChild(super.render());
    return el;
  }

  private createGridCell() {
    const el = <HTMLTableCellElement>document.createElement('td');
    el.classList.add(this.propertyGridCellCssClass);
    return el;
  }

  public getData(): DataObject {
    let result = {};
    for (const name in this.controls) {
      if (this.controls[name]) {
        result = Object.assign(result, this.controls[name].getData());
      }
    }

    return result;
  }

  getNativeElementType(): string {
    return 'tr';
  }

  createNatveElement(): void {
    const output = document.createDocumentFragment();
    const el = <HTMLTableRowElement>document.createElement('tr');
    el.classList.add(this.propertyGridRowGroupCssClass);

    const tdEl = this.createGridCell();
    tdEl.colSpan = 2;
    tdEl.appendChild(document.createTextNode(this.getLabel()));
    el.appendChild(tdEl);
    output.appendChild(el);

    this.nativeElement = output as any;
  }
  attachEventListeners(): void {}
  removeEventListeners(): void {}
}
