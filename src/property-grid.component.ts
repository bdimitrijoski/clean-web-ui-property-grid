import { PropertyGridForm } from './controls';
import { PropertyGridConfig, PropertyGridOptions } from './models';
import { DataObject, PropertyGridEvents } from './models/types';
import { propertyGridTemplate } from './property-grid-template';
import { EventDispatcherService, Logger, PropertyGridGroupsBuilderService, PropertyGridService } from './services';
import { ConfigParserService } from './services/config-parser-service';
import { PropertyGridFactory } from './services/property-grid-factory';
import { propertyGridStyles } from './styles/property-grid-base-style';
import { PropertyGridUtils } from './utils/property-grid-utils';

export class PropertyGrid extends HTMLElement {
  private _defaultOptions: PropertyGridOptions = {
    canFocus: true,
    controls: {},
    helpVisible: true,
    propertySort: true,
    toolbarVisible: true,
  };

  private _options: PropertyGridOptions;
  private _config: PropertyGridConfig;
  private _root;
  private _propertyGridEl: HTMLDivElement;
  private _gridReady = false;
  private _selectedObject;
  private readonly _selectedGridItem;
  private propertyGridForm: PropertyGridForm;
  private eventListeners = {};
  private groupsBuilder: PropertyGridGroupsBuilderService;
  private configParser: ConfigParserService;
  private eventDispatcher: EventDispatcherService;
  private factory: PropertyGridFactory;
  private pgBuilder: PropertyGridService;

  static get observedAttributes(): string[] {
    return ['disabled'];
  }

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
    this.groupsBuilder = new PropertyGridGroupsBuilderService();
    this.configParser = new ConfigParserService();
    this.eventDispatcher = new EventDispatcherService();
    this.factory = new PropertyGridFactory(this.eventDispatcher);
    this.pgBuilder = new PropertyGridService(this.factory);

    this.onValueChanged = this.onValueChanged.bind(this);

    this.eventListeners['onValueChanged'] = this.eventDispatcher.register(PropertyGridEvents.onValueChanged, this.onValueChanged);
  }

  set config(opts: PropertyGridConfig) {
    this._config = Object.assign({}, opts);
  }

  get config(): PropertyGridConfig {
    return this._config;
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(val: boolean) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
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

  set selectedObject(obj: DataObject) {
    if (typeof obj === 'string') {
      Logger.getInstance().error('PropertyGrid got invalid option:', obj);
      return;
    } else if (typeof obj !== 'object' || obj === null) {
      Logger.getInstance().error('PropertyGrid must get an object in order to initialize the grid.');
      return;
    }
    this._selectedObject = obj;
    this.render();
  }

  get selectedObject(): DataObject {
    return this.selectedObject;
  }

  get selectedGridItem(): any {
    return this._selectedGridItem;
  }

  connectedCallback(): void {
    this.render();
  }
  disconnectedCallback(): void {
    this.destroy();
  }

  attributeChangedCallback(name, oldValue, newValue): void {
    if (oldValue === newValue) {
      return;
    }
    if (name === 'disabled') {
      if (this.disabled) {
        this.setAttribute('tabindex', '-1');
        this.setAttribute('aria-disabled', 'true');
      } else {
        this.setAttribute('tabindex', '0');
        this.setAttribute('aria-disabled', 'false');
      }

      if (this._gridReady) {
        this.propertyGridForm.setDisabled(this.disabled);
      }
    }
  }

  /**
   * Forces the control to invalidate its client area and immediately redraw itself and any child controls.
   */
  render(): void {
    if (!this._selectedObject) {
      return;
    }

    if (this._options && this._options.controls) {
      this.factory.registerControls(this._options.controls);
    }

    const origConfig = this._config ? PropertyGridUtils.deepCopy(this._config) : null;
    const config = this.configParser.parse(this._selectedObject, origConfig);

    if (this.options.hasGroups === false) {
      this.configParser.assignToGroup(config);
    }

    const groups = this.groupsBuilder.buildGroups(config, this.options.propertySort);
    this.propertyGridForm = this.pgBuilder.build(groups, this._options);
    this._propertyGridEl.innerHTML = '';
    this._propertyGridEl.appendChild(this.propertyGridForm.render());

    this.propertyGridForm.setData(this._selectedObject);

    this.propertyGridForm.setDisabled(this.disabled);
    this.propertyGridForm.toggleToolbar(this.options.toolbarVisible);
    if (this.options.hasGroups === false) {
      this.propertyGridForm.getNativeElement().classList.add('no-groups');
    }

    this._gridReady = true;
  }

  getValues(): DataObject {
    return Object.assign(this._selectedObject, this.propertyGridForm.getData());
  }

  destroy(): void {
    for (const key in this.eventListeners) {
      this.eventListeners[key].unsubscribe();
    }
    this.eventDispatcher.reset();
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
