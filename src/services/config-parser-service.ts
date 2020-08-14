import { PropertyGridConfig, PropertyGridConfigItem } from '../models';
import { PROPERTY_GRID_CONSTANTS } from '../models/property-grid-constants';
import { DataObject } from '../models/types';
import { PropertyGridUtils } from '../utils/property-grid-utils';

export class ConfigParserService {
  parse(selectedObject: DataObject, config?: PropertyGridConfig): PropertyGridConfig {
    if (!config) {
      return this.createConfigFromData(selectedObject);
    }

    return this.parseExistingConfig(selectedObject, config);
  }

  private parseExistingConfig(selectedObject: DataObject, config: PropertyGridConfig): PropertyGridConfig {
    let ID_COUNTER = 1;
    Object.keys(config).forEach((propertyName) => {
      const item = config[propertyName];
      config[propertyName] = Object.assign(item, <PropertyGridConfigItem>{
        id: `pg${PropertyGridUtils.camelize(propertyName)}${ID_COUNTER}`,
        name: PropertyGridUtils.camelize(propertyName),
        type: PropertyGridUtils.getDefaultVal(item, 'type', PropertyGridUtils.valueToControlType(selectedObject[propertyName])),
        label: PropertyGridUtils.getDefaultVal(item, 'name', propertyName),
        browsable: PropertyGridUtils.getDefaultVal(item, 'browsable', true),
        description: PropertyGridUtils.getDefaultVal(item, 'description', ''),
        group: PropertyGridUtils.getDefaultVal(item, 'group', PROPERTY_GRID_CONSTANTS.OTHER_GROUP_NAME),
        showHelp: PropertyGridUtils.getDefaultVal(item, 'showHelp', false),
        options: PropertyGridUtils.getDefaultVal(item, 'options', {}),
      });
      ID_COUNTER++;
    });

    return config;
  }

  private createConfigFromData(selectedObject: DataObject): PropertyGridConfig {
    const config: PropertyGridConfig = {};

    let ID_COUNTER = 1;
    for (const propertyName in selectedObject) {
      config[propertyName] = <PropertyGridConfigItem>{
        id: `pg${PropertyGridUtils.camelize(propertyName)}${ID_COUNTER}`,
        name: propertyName,
        label: PropertyGridUtils.getDefaultVal(selectedObject, 'name', propertyName),
        type: PropertyGridUtils.valueToControlType(selectedObject[propertyName]),
        browsable: true,
        description: '',
        group: PROPERTY_GRID_CONSTANTS.OTHER_GROUP_NAME,
        showHelp: false,
        options: {},
      };
      ID_COUNTER++;
    }
    return config;
  }
}
