export interface PropertyGridConfigItem {
  id?: string;
  name: string;
  label: string;
  /** Type of control (text, checkbox...etc.) */
  type: string;
  /** Using for showing help */
  description?: string;
  /** The group where this control belongs */
  group?: string;
  /** Should be visible in the property grid */
  browsable?: boolean;
  /** Should show help for this item */
  showHelp?: boolean;
  items?: string[];
  options: {
    [option: string]: string | number | boolean;
  };
}
