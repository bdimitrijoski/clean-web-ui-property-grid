import { EventListnerHandle } from '../models/types';

export class EventDispatcherService {
  private subscribers = {};

  hasEventListener(event: string): boolean {
    return this.subscribers.hasOwnProperty(event) && this.subscribers[event].length > 0;
  }

  /**
   * Removes all subscribers
   */
  reset(): void {
    for (const eventName in this.subscribers) {
      //clear array and event listeners
      this.subscribers[eventName].length = 0;
      this.subscribers[eventName] = null;
      delete this.subscribers[eventName];
    }
    this.subscribers = {};
  }

  /** Register (subscribe) to event */
  register(event: string, callback: (...args) => any): EventListnerHandle {
    if (!this.subscribers.hasOwnProperty(event)) {
      this.subscribers[event] = [];
    }
    const index = this.subscribers[event].push(callback) - 1;
    const subscription = {
      unsubscribe: () => {
        this.subscribers[event].splice(index, 1);

        if (this.subscribers[event].length === 0) {
          delete this.subscribers[event];
        }
      },
    };
    return subscription;
  }

  /** Broadcast event to all registered subscribers */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  send(event: string, data?: any): void {
    if (!this.subscribers[event]) return;

    this.subscribers[event].forEach((callback) => callback(data));
  }
}
