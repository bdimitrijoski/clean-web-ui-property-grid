import { PropertyGridFormControlsMap } from '../controls/property-grid-form-controls-map';
import { DataObject, FormEvent } from '../models/types';

import { FormControlParams } from './form-control';
import { FormControlComposite } from './form-control-composite';
import { PropertyGridRowGroup } from './property-grid-row-group';

/**
 * The fieldset element is a Concrete Composite.
 */
export class PropertyGridForm extends FormControlComposite {
  private propertyGridFormCssClass = 'property-grid-form';
  private propertyGridTableCssClass = 'property-grid';
  protected controls: PropertyGridFormControlsMap = {};

  constructor(params: FormControlParams) {
    super(params);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  createNatveElement(): void {
    super.createNatveElement();
    const el = this.getNativeElement();
    el.classList.add(this.propertyGridFormCssClass);

    const toolbar = document.createElement('header');
    toolbar.classList.add('property-grid-header');
    toolbar.innerHTML = `<slot name='toolbar-buttons'></slot>
    <div class="search-wrapper"><input part="search-input" type="search" placeholder="Search..." /></div>`;
    el.appendChild(toolbar);

    const fieldset = <HTMLFieldSetElement>document.createElement('fieldset');
    const pgTable = <HTMLTableElement>document.createElement('table');
    pgTable.classList.add(this.propertyGridTableCssClass);

    fieldset.appendChild(pgTable);

    el.appendChild(fieldset);
  }

  public render(): any {
    const el = this.getNativeElement();
    const table = el.querySelector('table');
    table.appendChild(super.render());
    return el;
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

  setDisabled(isDisabled: boolean): void {
    this.getNativeElement().querySelector('fieldset').disabled = isDisabled;
  }

  toggleToolbar(isToolbarVisible: boolean): void {
    if (!isToolbarVisible) {
      this.getNativeElement().querySelector('.property-grid-header').classList.toggle('hidden');
    } else {
      this.getNativeElement().querySelector('.property-grid-header').classList.remove('hidden');
    }
  }

  attachEventListeners(): void {
    this.getNativeElement().addEventListener('submit', this.onFormSubmit);
    this.getNativeElement().querySelector('.property-grid-header input').addEventListener('input', this.onSearch);
  }
  removeEventListeners(): void {
    this.getNativeElement().removeEventListener('submit', this.onFormSubmit);
    this.getNativeElement().querySelector('.property-grid-header input').removeEventListener('input', this.onSearch);
  }

  onFormSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  onSearch(event: FormEvent<HTMLInputElement>): void {
    event.preventDefault();
    const value = event.target.value.toLowerCase();

    value ? this.getNativeElement().classList.add('no-groups') : this.getNativeElement().classList.remove('no-groups');
    this.getNativeElement()
      .querySelectorAll('.property-grid-row')
      .forEach((row) => row.classList.remove('hidden'));

    this.getNativeElement()
      .querySelectorAll('.property-grid-row td:first-of-type')
      .forEach((cell) => {
        if (!cell.textContent.toLowerCase().startsWith(value)) {
          cell.parentElement.classList.add('hidden');
        }
      });
  }
}
