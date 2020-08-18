import { Attributes, Options } from '../models/types';

import { IFormControl } from './iform-control';

export interface FormControlParams {
  id: string;
  name: string;
  label: string;
  description: string;
  attributes: Attributes;
  options: Options;
}

/**
 * The base Component class declares an interface for all concrete components,
 * both simple and complex.
 *
 */
export abstract class FormControl implements IFormControl {
  protected id: string;
  protected name: string;
  protected label: string;
  protected description: string;
  protected value: any;
  protected attributes: Attributes;
  protected options: Options;
  protected nativeElement: HTMLElement;

  constructor(params: FormControlParams) {
    Object.assign(this, params);
    this.options = params.options || { showHelp: true };
    this.attributes = params.attributes || {};
  }

  /**
   * Use to attach event listeners like click, change...etc.
   * It is called inside createNativeElement
   */
  abstract attachEventListeners(): void;

  /**
   * A callback method that is called before destory to remove all attached event listeners.
   */
  abstract removeEventListeners(): void;

  /**
   * Each concrete DOM element must provide its rendering implementation, but
   * we can safely assume that all of them are returning strings.
   */
  abstract render(): HTMLElement;

  /** Returns native element type. Ex: input, select */
  abstract getNativeElementType(): string;

  /**
   * Initialize component, creates native element, attach event listners
   */
  init(): void {
    if (this.nativeElement) {
      return;
    }
    this.createNatveElement();
    this.attachEventListeners();
  }

  /**
   * Cleanup form control and removes all event listeners
   */
  destroy(): void {
    if (!this.getNativeElement()) {
      return;
    }

    this.removeEventListeners();
    this.nativeElement = null;
  }

  /**
   * Creates native element and attach event listeners
   */
  createNatveElement(): void {
    if (this.nativeElement) {
      return;
    }

    this.nativeElement = document.createElement(this.getNativeElementType());

    this.nativeElement.id = this.id;
  }

  getAttributes(): Attributes {
    return this.attributes;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getNativeElement(): HTMLElement {
    if (!this.nativeElement) {
      throw Error('You can not use native element before is being initialized!');
    }

    return this.nativeElement;
  }

  getLabel(): string {
    return this.label;
  }

  getOptions(): Options {
    return this.options;
  }

  getValue(): any {
    return this.value;
  }

  setValue(value: any): void {
    this.value = value;
  }
}
