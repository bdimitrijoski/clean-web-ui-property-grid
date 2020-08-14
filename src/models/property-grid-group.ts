import { PropertyGridItem } from './property-grid-item';

export interface PropertyGridGroup {
  name: string;
  label: string;
  children: PropertyGridItem[];
}
