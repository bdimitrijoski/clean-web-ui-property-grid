import { FormControlsMap } from '../controls/form-controls-map';

import { FormEvent } from './types';

export interface PropertyGridOptions {
  /**
   * indicating whether the control can receive focus.
   */
  canFocus?: boolean;

  /** Set custom controls that will be used for rendering */
  controls?: FormControlsMap;

  /** Gets or sets a value indicating whether the control can respond to user interaction. */
  enabled?: boolean;

  /** Gets or sets a value indicating whether the Help text is visible. */
  helpVisible?: boolean;

  /** Gets or sets if PropertyGrid will sort properties by display name. */
  propertySort?: boolean | ((params: string[]) => string[]);

  /** Gets or sets a value indicating whether the toolbar is visible. */
  toolbarVisible?: boolean;

  /** Gets or sets a value indicating whether the control and all its child controls are displayed. */
  visible?: boolean;

  /** Gets or sets a value indicating whether controls are groupped and if groups are visible. */
  hasGroups?: boolean;

  /** Hook that is called when value is change in controls inside property grid */
  onValueChange?: <T>(event: FormEvent<T>) => void;
}
