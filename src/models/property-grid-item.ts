import { Attributes } from './types';

export interface PropertyGridItem {
  id?: string;
  name: string;
  label?: string;
  type: string;
  description?: string;
  attributes: Attributes;
  options: {
    description?: string;
    showHelp?: boolean;
  };
}
