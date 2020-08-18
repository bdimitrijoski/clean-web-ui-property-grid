import {
  CheckboxFormControl,
  ColorPickerFormControl,
  DatePickerFormControl,
  FormControlsMap,
  IFormControl,
  LabelFormControl,
  NumberFormControl,
  PropertyGridForm,
  PropertyGridRow,
  PropertyGridRowGroup,
  SelectFormControl,
  TextboxFormControl,
} from '../controls';
import { propertyGridControlDecorator } from '../decorators';
import { PropertyGridOptions } from '../models';
import { PropertyGridGroup } from '../models/property-grid-group';
import { PropertyGridItem } from '../models/property-grid-item';

import { EventDispatcherService } from './event-dispatcher-service';

export const COMPONENTS_MAP = {
  text: TextboxFormControl,
  number: NumberFormControl,
  boolean: CheckboxFormControl,
  row: PropertyGridRow,
  row_group: PropertyGridRowGroup,
  form: PropertyGridForm,
  options: SelectFormControl,
  color: ColorPickerFormControl,
  date: DatePickerFormControl,
  label: LabelFormControl,
};

export class PropertyGridFactory {
  private customControls: FormControlsMap;
  constructor(private eventDispatcher: EventDispatcherService) {}

  registerControls(ctrls: FormControlsMap): void {
    this.customControls = {};
    this.customControls = ctrls;
  }

  create(type: string, data: PropertyGridGroup | PropertyGridItem, pgOptions: PropertyGridOptions): IFormControl {
    const gridItem = data as PropertyGridItem;
    const controls: any = Object.assign(COMPONENTS_MAP, this.customControls);
    const ctrl = propertyGridControlDecorator(
      new controls[type]({
        id: gridItem.id,
        name: gridItem.name,
        label: gridItem.label,
        description: gridItem.description,
        options: gridItem.options,
      }),
      pgOptions,
      this.eventDispatcher,
    );

    ctrl.init();
    return ctrl;
  }
}
