import { Attributes, FormEvent, Options } from '../models/types';

export interface IFormControl {
  /**
   * Method called from init to attach event listeners like click, change..etc.
   */
  attachEventListeners(): void;

  /**
   * A callback method that is called only once during init.
   * Return the DOM element of your component, this is what the property grid puts into the DOM.
   * Creates the native element based on props.
   */
  createNatveElement(): void;

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a component instance is destroyed.
   */
  destroy(): void;

  /**
   * Returns Component Attributes
   */
  getAttributes(): Attributes;

  /**
   * Returns Component Id
   */
  getId(): string;

  /**
   * Returns component name
   */
  getName(): string;

  /**
   * Returns the Native Element
   */
  getNativeElement(): HTMLElement;

  /**
   * Returns Native Element type. For ex: input, select...etc.
   */
  getNativeElementType(): string;

  /**
   * Returns component label (title).
   */
  getLabel(): string;
  /**
   * Returns component label (title).
   */
  getDescription(): string;

  /**
   * Returns component options
   */
  getOptions(): Options;

  /**
   * Returns Component Value
   */
  getValue(): any;

  /**
   * A callback method that is invoked only once when the component is instantiated.
   */
  init(): void;

  /**
   * A callback method that is called before destory to remove all attached event listeners.
   */
  removeEventListeners(): void;

  /**
   * A callback function that is called when the native element should be rendered on UI.
   * Could be called multiple times to reflect component state.
   */
  render(): HTMLElement;

  /**
   * A callback function that is called to set the component value
   * @param value
   */
  setValue(value: any): void;

  /**
   * Optional on Value change event handler, that will be used by hooks and handlers.
   */
  onValueChange?: <T>(event: FormEvent<T>) => void;
}
