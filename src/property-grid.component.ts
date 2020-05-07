import { PropertyGridOptions, PropertyGridConfig, PropertyGridGroupsBuilder, PropertyGridTableBuilder, PropertyGridForm } from './property-grid-types';
import { propertyGridTemplate } from './property-grid-template';
import { propertyGridStyles } from './styles/property-grid-base-style';



export class PropertyGrid extends HTMLElement {

	private _defaultOptions: PropertyGridOptions = {
		canFocus: true,
		controls: {},
		enabled: true,
		helpVisible: true,
		propertySort: true,
		toolbarVisible: true,
		visible: true
	}
	private _options: PropertyGridOptions;
	private _config: PropertyGridConfig;
	private _root;
	private _propertyGridEl: HTMLDivElement;
	private _gridReady = false;
	private _selectedObject;
	private readonly _selectedGridItem;
	private groupsBuilder: PropertyGridGroupsBuilder;
	private pgBuilder: PropertyGridTableBuilder;
	private propertyGridForm: PropertyGridForm;

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
		this.groupsBuilder = new PropertyGridGroupsBuilder();
		this.pgBuilder = new PropertyGridTableBuilder();
		// this.onPropertyGridItemValueChange = this.onPropertyGridItemValueChange.bind(this);
	}

	set config(opts: PropertyGridConfig) {
		this._config = Object.assign({}, opts);
		this._gridReady = true;
	}

	get config() {
		return this._config;
	}

	set options(opts: PropertyGridOptions) {
		this._options = Object.assign(this._defaultOptions, opts);

		this._options = opts;
		this._gridReady = true;
	}

	get options() {
		return this._options;
	}

	set selectedObject(obj) {
		if (typeof obj === 'string') {
			console.error('PropertyGrid got invalid option:', obj);
			return;
		} else if (typeof obj !== 'object' || obj === null) {
			console.error('PropertyGrid must get an object in order to initialize the grid.');
			return;
		}
		this._selectedObject = obj;

		if(this._gridReady){
		    this.render();
		}
	}

	get selectedObject() {
		return this.selectedObject;
	}

	get selectedGridItem(){
		return this._selectedGridItem;
	}


	connectedCallback(){

	}

	/**
	 * Forces the control to invalidate its client area and immediately redraw itself and any child controls.
	 */
	render(){
		console.group("PropertyGrid Init");
		console.log(this._selectedObject);
		console.log(this._options);
		console.log(this._config);
		console.log(this._gridReady);

		const groups = this.groupsBuilder.buildGroups(this._config, this.options.propertySort);
		this.propertyGridForm = this.pgBuilder.build(groups);
		this._propertyGridEl.innerHTML = "";
		this._propertyGridEl.appendChild(this.propertyGridForm.render());

	}

	destroy(){
		this.propertyGridForm.destroy();
	}

}
customElements.define('property-grid', PropertyGrid);