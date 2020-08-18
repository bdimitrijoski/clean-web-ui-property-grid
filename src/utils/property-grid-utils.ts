import { DataObject } from '../models/types';

export class PropertyGridUtils {
  static toBool(value: string | boolean): boolean {
    return value.toString() === 'true';
  }

  static camelize(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  static isColor(str: string): boolean {
    return str.toString().match(/^#[a-f0-9]{6}$/i) !== null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getDefaultVal(item: DataObject, property: string, defaultValue: any): any {
    return item.hasOwnProperty(property) ? item[property] : defaultValue;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static deepCopy(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static valueToControlType(value: any): string {
    let valueType = typeof value as string;

    if (valueType === 'undefined') {
      return;
    }

    if (PropertyGridUtils.isColor(value)) {
      valueType = 'color';
    }
    let controlType;
    switch (valueType) {
      case 'bigint':
      case 'number':
        controlType = 'number';
        break;
      case 'string':
        controlType = 'text';
        break;
      case 'boolean':
        controlType = 'boolean';
        break;
      case 'color':
        controlType = 'color';
        break;
      default:
        controlType = 'label';
    }

    return controlType;
  }
}
