import { PropertyGridForm } from './controls';
import { PropertyGridConfig, PropertyGridOptions } from './models';
import { PropertyGridEvents } from './models/types';
import { propertyGridTemplate } from './property-grid-template';
import {
  EventDispatcherService,
  InjectorService,
  Logger,
  PropertyGridGroupsBuilderService,
  PropertyGridService,
} from './services';
import { ConfigParserService } from './services/config-parser-service';
import { PropertyGridFactory } from './services/property-grid-factory';
import { propertyGridStyles } from './styles/property-grid-base-style';

export class PropertyGrid extends HTMLElement {
  private _defaultOptions: PropertyGridOptions = {
    canFocus: true,
    controls: {},
    enabled: true,
    helpVisible: true,
    propertySort: true,
    toolbarVisible: true,
    visible: true,
  };
  private _options: PropertyGridOptions;
  private _config: PropertyGridConfig;
  private _root;
  private _propertyGridEl: HTMLDivElement;
  private _gridReady = false;
  private _selectedObject;
  private readonly _selectedGridItem;
  private groupsBuilder: PropertyGridGroupsBuilderService;
  private pgBuilder: PropertyGridService;
  private configParser: ConfigParserService;
  private propertyGridForm: PropertyGridForm;
  private injector: InjectorService;
  private eventListeners = {};

  constructor() {
    super();

    // Create a new shadow dom root.
    // The mode describes, if the node can be accessed from the outside.
    this.attachShadow({ mode: 'open' });

    this._root = this.shadowRoot;

    // Fill the shadow dom with the template by a deep clone.
    this._root.appendChild(propertyGridStyles.content.cloneNode(true));
    this._root.appendChild(propertyGridTemplate.content.cloneNode(true));

    this._options = this._defaultOptions;

    this._propertyGridEl = this.shadowRoot.querySelector('#propertyGrid');
    this.injector = new InjectorService();
    this.injector.register(
      'groupsBuilder',
      new PropertyGridGroupsBuilderService(),
    );

    this.injector.register('configParser', new ConfigParserService());
    this.injector.register('eventDispatcher', new EventDispatcherService());
    this.injector.register(
      'factory',
      new PropertyGridFactory(this.injector.get('eventDispatcher')),
    );
    this.injector.register(
      'pgBuilder',
      new PropertyGridService(this.injector.get('factory')),
    );

    this.onValueChanged = this.onValueChanged.bind(this);

    this.eventListeners['onValueChanged'] = this.injector
      .get<EventDispatcherService>('eventDispatcher')
      .register(PropertyGridEvents.onValueChanged, this.onValueChanged);
  }

  set config(opts: PropertyGridConfig) {
    this._config = Object.assign({}, opts);
  }

  get config(): PropertyGridConfig {
    return this._config;
  }

  set options(opts: PropertyGridOptions) {
    this._options = Object.assign(this._defaultOptions, opts);

    this._options = opts;

    if (this._gridReady) {
      this.render();
    }
  }

  get options(): PropertyGridOptions {
    return this._options;
  }

  set selectedObject(obj) {
    if (typeof obj === 'string') {
      Logger.getInstance().error('PropertyGrid got invalid option:', obj);
      return;
    } else if (typeof obj !== 'object' || obj === null) {
      Logger.getInstance().error(
        'PropertyGrid must get an object in order to initialize the grid.',
      );
      return;
    }
    this._selectedObject = obj;

    this.render();
  }

  get selectedObject(): any {
    return this.selectedObject;
  }

  get selectedGridItem(): any {
    return this._selectedGridItem;
  }

  connectedCallback(): void {}

  /**
   * Forces the control to invalidate its client area and immediately redraw itself and any child controls.
   */
  render(): void {
    const origConfig = this._config
      ? JSON.parse(JSON.stringify(Object.assign({}, this._config)))
      : null;
    const config = (this.injector.get(
      'configParser',
    ) as ConfigParserService).parse(this._selectedObject, origConfig);

    const groups = (this.injector.get(
      'groupsBuilder',
    ) as PropertyGridGroupsBuilderService).buildGroups(
      config,
      this.options.propertySort,
    );
    this.propertyGridForm = (this.injector.get(
      'pgBuilder',
    ) as PropertyGridService).build(groups, this._options);
    this._propertyGridEl.innerHTML = '';
    this._propertyGridEl.appendChild(this.propertyGridForm.render());

    this.propertyGridForm.setData(this._selectedObject);
    this._gridReady = true;
  }

  getValues(): Object {
    return this.propertyGridForm.getData();
  }

  disableLog() {
    Logger.getInstance().logEnabled = false;
  }

  destroy(): void {
    this.injector.clear();
    for (const key in this.eventListeners) {
      this.eventListeners[key].unsubscribe();
    }

    this.propertyGridForm.destroy();
  }

  private onValueChanged(data) {
    if (!this._gridReady) {
      return;
    }

    this.dispatchEvent(new CustomEvent('valueChanged', { detail: data }));
  }
}
customElements.define('property-grid', PropertyGrid);
