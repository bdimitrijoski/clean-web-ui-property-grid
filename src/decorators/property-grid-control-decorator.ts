import { IFormControl } from '../controls';
import { PropertyGridOptions } from '../models';
import { EventDispatcherService } from '../services';

export const propertyGridControlDecorator = (
  ctrl: IFormControl,
  pgOptions: PropertyGridOptions,
  eventDispatcher: EventDispatcherService,
): IFormControl => {
  const proxyMethod = (method, callback) => {
    return new Proxy(method, {
      apply: (target, that, args) => {
        callback(target, that, args);
        return target.apply(that, args);
      },
    });
  };

  if (typeof ctrl.onValueChange === 'function') {
    ctrl.onValueChange = proxyMethod(ctrl.onValueChange, (target, that, args) => {
      if (pgOptions.onValueChange) {
        const event = args[0];
        const result = pgOptions.onValueChange(event);
        if (result === false || event.defaultPrevented) {
          return false;
        }
      }
    });
  }

  if (typeof ctrl.setValue === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ctrl.setValue = proxyMethod(ctrl.setValue, (target, that, args) => {
      const data = {
        name: that.getName(),
        value: that.getValue(),
      };
      eventDispatcher.send('onValueChanged', data);
    });
  }

  return ctrl;
};
