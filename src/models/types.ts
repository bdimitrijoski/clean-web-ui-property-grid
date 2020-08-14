export interface Attributes {
  [attributeName: string]: string | number | boolean;
}

export interface Options {
  [attributeName: string]: string | number | boolean | string[];
}

export interface SortCallback {
  (properties: string[]): string[];
}

export type PrimitiveValue = string | number | boolean;

export interface DataObject {
  [property: string]: string | number | Date | boolean | any;
}

export interface FormEvent<T> extends Event {
  bubbles: boolean;
  currentTarget: EventTarget & T;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  nativeEvent: Event;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  target: EventTarget & T;
  type: string;
}

export interface EventHandler<E extends FormEvent<any>> {
  (event: E): void;
}

export type FormEventHandler<T> = EventHandler<FormEvent<T>>;

export interface EventListnerHandle {
  unsubscribe: () => any;
}

export interface OnValueChangeEvent {
  name: string;
  value: any;
}

export enum PropertyGridEvents {
  onValueChanged = 'onValueChanged',
}
