import { FormControlComposite } from './form-control-composite';
import { IFormControl } from './iform-control';

export class PropertyGridRow extends FormControlComposite {
  private propertyGridRowCssClass = 'property-grid-row';
  private propertyGridCellCssClass = 'property-grid-cell';
  public render(): HTMLTableRowElement {
    const el = this.getNativeElement();
    el.innerHTML = '';

    Object.keys(this.controls).forEach((controlName) => {
      el.appendChild(this.createLabelCell(this.controls[controlName]));
      el.appendChild(this.createControls(this.controls[controlName]));
    });

    return el;
  }

  getNativeElement(): HTMLTableRowElement {
    return super.getNativeElement() as HTMLTableRowElement;
  }

  getNativeElementType(): string {
    return 'tr';
  }

  createNatveElement(): void {
    super.createNatveElement();
    this.nativeElement.id = this.nativeElement.id + 'Row';
    this.getNativeElement().classList.add(this.propertyGridRowCssClass);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  attachEventListeners(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeEventListeners(): void {}

  private createLabelCell(control: IFormControl): HTMLTableCellElement {
    const cell = this.createGridCell();
    cell.appendChild(document.createTextNode(control.getLabel()));

    if (control.getDescription() && control.getOptions().showHelp) {
      const helpTooltip = document.createElement('span');
      helpTooltip.innerHTML = ' [?]';
      helpTooltip.title = control.getDescription();

      cell.appendChild(helpTooltip);
    }

    return cell;
  }

  private createControls(control: IFormControl): HTMLTableCellElement {
    const cell = this.createGridCell();

    cell.appendChild(control.render());
    return cell;
  }

  private createGridCell(): HTMLTableCellElement {
    const el = <HTMLTableCellElement>document.createElement('td');
    el.classList.add(this.propertyGridCellCssClass);
    return el;
  }
}
