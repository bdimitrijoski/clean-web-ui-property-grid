import { PropertyGridConfig, PropertyGridConfigItem } from '../models';
import { PROPERTY_GRID_CONSTANTS } from '../models/property-grid-constants';
import { DataObject } from '../models/types';
import { PropertyGridUtils } from '../utils/property-grid-utils';

export class ConfigParserService {
  parse(selectedObject: DataObject, config?: PropertyGridConfig): PropertyGridConfig {
    config = config || {};
    return this.createConfigItem(selectedObject, config);
  }

  /** Assigns property grid config items to same group */
  assignToGroup(config: PropertyGridConfig, groupName = PROPERTY_GRID_CONSTANTS.OTHER_GROUP_NAME): void {
    Object.keys(config).forEach((key) => {
      config[key].group = groupName;
    });
  }

  private createConfigItem(selectedObject: DataObject, configObject: PropertyGridConfig): PropertyGridConfig {
    const pgConfig = Object.keys(configObject).length ? configObject : selectedObject;
    let ID_COUNTER = 1;
    const config = {};
    Object.keys(pgConfig).forEach((propertyName) => {
      const item = pgConfig[propertyName];
      config[propertyName] = Object.assign(item, <PropertyGridConfigItem>{
        id: `pg${PropertyGridUtils.camelize(propertyName)}${ID_COUNTER}`,
        name: PropertyGridUtils.camelize(propertyName),
        type: this.defaultVal(item, 'type', PropertyGridUtils.valueToControlType(selectedObject[propertyName])),
        label: this.defaultVal(item, 'name', propertyName),
        browsable: this.defaultVal(item, 'browsable', true),
        description: this.defaultVal(item, 'description', ''),
        group: this.defaultVal(item, 'group', PROPERTY_GRID_CONSTANTS.OTHER_GROUP_NAME),
        showHelp: this.defaultVal(item, 'showHelp', false),
        options: this.defaultVal(item, 'options', {}),
      });
      ID_COUNTER++;
    });

    return config;
  }

  private defaultVal(item: DataObject, property: string, defaultValue: any): any {
    return PropertyGridUtils.getDefaultVal(item, property, defaultValue);
  }
}
