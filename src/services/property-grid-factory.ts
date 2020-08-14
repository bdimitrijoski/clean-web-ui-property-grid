import {
  CheckboxFormControl,
  ColorPickerFormControl,
  DatePickerFormControl,
  IFormControl,
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
};

export class PropertyGridFactory {
  constructor(private eventDispatcher: EventDispatcherService) {}

  isKnownControl(itemType: string): boolean {
    return COMPONENTS_MAP.hasOwnProperty(itemType);
  }

  create(type: string, data: PropertyGridGroup | PropertyGridItem, pgOptions: PropertyGridOptions): IFormControl {
    const gridItem = data as PropertyGridItem;
    const ctrl = propertyGridControlDecorator(
      new COMPONENTS_MAP[type]({
        id: gridItem.id,
        name: gridItem.name,
        label: gridItem.label,
        options: gridItem.options,
      }),
      pgOptions,
      this.eventDispatcher,
    );

    ctrl.init();
    return ctrl;
  }
}
