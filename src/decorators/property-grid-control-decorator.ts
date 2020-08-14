import { FormEvent } from 'src/models/types';

import { EventDispatcherService } from 'src/services';

import { IFormControl } from '../controls';
import { PropertyGridOptions } from '../models';

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

  const interceptCtrlMethod = (ctrl, method, callback) => {
    return new Proxy(ctrl, {
      get: (target, name, receiver) => {
        const origMethod = target[name];

        if (typeof origMethod === 'function' && name == method) {
          return callback(target, name, receiver);
        } else {
          return origMethod;
        }
      },
    });
  };

  const proxyCtrl = interceptCtrlMethod(
    ctrl,
    'onValueChange',
    (target, name, receiver) => {
      const origMethod = target[name];
      return (event: FormEvent<HTMLInputElement>) => {
        let result;
        if (pgOptions.onValueChange) {
          result = pgOptions.onValueChange(event as any);

          if (result === false || event.defaultPrevented) {
            return false;
          }
        }

        return origMethod(event);
      };
    },
  );

  proxyCtrl.setValue = proxyMethod(proxyCtrl.setValue, (target, that, args) => {
    const data = {
      name: that.getName(),
      value: that.getValue(),
    };
    eventDispatcher.send('onValueChanged', data);
  });

  return proxyCtrl;
};
