import { PropertyGridFormControlsMap } from '../controls/property-grid-form-controls-map';
import { DataObject } from '../models/types';

import { FormControlParams } from './form-control';
import { FormControlComposite } from './form-control-composite';

export class PropertyGridRowGroup extends FormControlComposite {
  protected controls: PropertyGridFormControlsMap = {};

  constructor(params: FormControlParams) {
    super(params);
    this.onToggleGroupVisibility = this.onToggleGroupVisibility.bind(this);
  }

  public render(): any {
    const el = this.getNativeElement();

    el.querySelector('.property-grid-group-content table').appendChild(super.render());
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
    const el = <HTMLTableRowElement>document.createElement(this.getNativeElementType());
    el.classList.add('property-grid-row-group');

    const innerHTML = `
      <td colspan="2" class="property-grid-row-group-wrapper">
        <table>
          <tr class="property-grid-group"><td class="property-grid-cell" colspan="2">${this.getLabel()}</td></tr>
          <tr class="property-grid-group-content"><td colspan="2">
            <table></table>
          </td></tr>
        </table>
      </td>
    `;
    el.innerHTML = innerHTML;
    this.nativeElement = el;
  }
  attachEventListeners(): void {
    this.getNativeElement()
      .querySelector('.property-grid-row-group-wrapper .property-grid-group')
      .addEventListener('click', this.onToggleGroupVisibility, false);
  }
  removeEventListeners(): void {
    this.getNativeElement()
      .querySelector('.property-grid-row-group-wrapper .property-grid-group')
      .removeEventListener('click', this.onToggleGroupVisibility);
  }

  protected onToggleGroupVisibility(): void {
    this.getNativeElement().querySelector('.property-grid-group-content').classList.toggle('collapsed');
  }
}
