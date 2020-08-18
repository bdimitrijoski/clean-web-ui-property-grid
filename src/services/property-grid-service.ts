import { PropertyGridForm, PropertyGridRow, PropertyGridRowGroup } from '../controls';
import { PropertyGridGroup, PropertyGridItem, PropertyGridOptions } from '../models';

import { PropertyGridFactory } from './property-grid-factory';

export class PropertyGridService {
  constructor(private factory: PropertyGridFactory) {}

  build(config: PropertyGridGroup[], pgOptions: PropertyGridOptions): PropertyGridForm {
    const propGrid = new PropertyGridForm({
      id: 'pg',
      name: 'pg',
      label: '',
      description: '',
      attributes: {},
      options: {},
    });
    propGrid.init();

    config.forEach((group) => {
      propGrid.add(this.buildGridRowGroup(group, pgOptions));
    });

    return propGrid;
  }

  private buildGridRowGroup(item: PropertyGridGroup, pgOptions: PropertyGridOptions): PropertyGridRowGroup {
    const group = this.factory.create('row_group', item, pgOptions) as PropertyGridRowGroup;

    item.children.forEach((gridItem) => group.add(this.buildGridRow(gridItem, pgOptions)));

    return group;
  }

  private buildGridRow(gridItem: PropertyGridItem, pgOptions: PropertyGridOptions): PropertyGridRow {
    const row = this.factory.create('row', gridItem, pgOptions) as PropertyGridRow;
    row.add(this.factory.create(gridItem.type, gridItem, pgOptions));
    return row;
  }
}
