import { PropertyGridGroup, PropertyGridItem } from '../models';
import { PropertyGridConfig, PropertyGridConfigItem } from '../models';
import { PropertyGridUtils } from '../utils/property-grid-utils';

export class PropertyGridGroupsBuilderService {
  private OTHER_GROUP_KEY = 'other';
  private OTHER_GROUP_NAME = 'Other';

  buildGroups(config: PropertyGridConfig, sortProperties: boolean | ((params: string[]) => string[])): PropertyGridGroup[] {
    const groupsMap = {};
    const otherGroup = <PropertyGridGroup>{
      label: this.OTHER_GROUP_NAME,
      name: this.OTHER_GROUP_KEY,
      children: [],
    };

    const properties = this.sortProperties(Object.keys(config), sortProperties);

    properties.forEach((prop) => {
      const item = config[prop];
      if (this.isNotBrowsable(item)) {
        return;
      }

      const itemGroupLabel = item.group;
      const itemGroupKey = PropertyGridUtils.camelize(itemGroupLabel);

      if (!groupsMap.hasOwnProperty(itemGroupKey)) {
        groupsMap[itemGroupKey] = this.createGroup(itemGroupLabel, itemGroupKey);
      }

      if (itemGroupKey === 'other') {
        otherGroup.children.push(this.createGridItem(item));
      } else {
        groupsMap[itemGroupKey].children.push(item);
      }
    });
    groupsMap[this.OTHER_GROUP_KEY] = otherGroup;
    const groups = this.sortProperties(Object.keys(groupsMap), sortProperties).map((key) => groupsMap[key]);

    return groups;
  }

  private createGridItem(configItem: PropertyGridConfigItem): PropertyGridItem {
    return <PropertyGridItem>{
      id: configItem.id,
      name: configItem.name,
      type: configItem.type,
      description: configItem.description,
      label: configItem.label,
      attributes: configItem.options,
      options: {
        group: configItem.group,
        browsable: configItem.browsable,
        showHelp: configItem.showHelp,
        items: configItem.items || [],
      },
    };
  }

  private createGroup(groupLabel, groupKey): PropertyGridGroup {
    return <PropertyGridGroup>{
      name: groupKey,
      label: groupLabel,
      children: [],
    };
  }

  private isNotBrowsable(item: PropertyGridConfigItem): boolean {
    return item.hasOwnProperty('browsable') && item.browsable === false;
  }

  private sortProperties(properties: string[], sortMethod?: boolean | ((params: string[]) => string[])): string[] {
    if (sortMethod === false) {
      return properties;
    }
    return sortMethod instanceof Function ? sortMethod(properties) : properties.sort();
  }
}
