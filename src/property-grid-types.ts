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
}

export interface PropertyGridConfigItem {
    name: string;
    type: string;
    description?: string;
    group?: string;
    browsable?: boolean;
    showHelp?: boolean;
    options: {
        [option: string]: string | number | boolean;
    };
}

export interface PropertyGridConfig {
    [name: string]: PropertyGridConfigItem;
}

export interface PropertyGridItem {
    id: string;
    name: string;
    title: string;
    type: string;
    description?: string;
    showHelp?: boolean;
    options: {
        [option: string]: string | number | boolean;
    };
}

export interface PropertyGridGroup {
    name: string;
    label: string;
    children: PropertyGridItem[];
}

export interface FormControlsMap {
    [controlName: string]: FormControl;
}

export interface IFormControl {
    
    getId(): string;

    getName(): string;

    getTitle(): string;

    setData(data): void;

    getData(): any;

    assignAttributes(el: any);

    render(): any;

    destroy(): void;
}

/**
 * The base Component class declares an interface for all concrete components,
 * both simple and complex.
 *
 */
export abstract class FormControl implements IFormControl
{
    protected id;
    protected name;
    protected title;
    protected data;
    protected attributes;

   constructor(id: string, name: string, title: string, attributes: any)
    {
        this.id = id;
        this.name = name;
        this.title = title;
        this.attributes = attributes;
    }

    public getName(): string
    {
        return this.name;
    }

    
    public getId(): string
    {
        return this.id;
    }

    public getTitle(): string
    {
        return this.name;
    }

    public setData(data): void
    {
        this.data = data;
    }

    public getData(): any
    {
        return this.data;
    }


    assignAttributes(el: any){
        if(!this.attributes){
            return;
        }

        for(let key in this.attributes){
            el[key] = this.attributes[key];
        }
    }
    /**
     * Each concrete DOM element must provide its rendering implementation, but
     * we can safely assume that all of them are returning strings.
     */
    abstract render(): any;

    abstract destroy(): void;
}

export class BaseFormControl extends FormControl {

    protected _type: string = 'text';
    protected _elementType: string = 'input';
    constructor(id: string, name: string, title: string, attributes: any)
    {
        super(id, name, title, attributes);
    }

    public setType(type): void
    {
        this._type = type;
    }

    public getType(): any
    {
        return this._type;
    }

    public setElementType(type): void
    {
        this._elementType = type;
    }

    public getElementType(): any
    {
        return this._elementType;
    }


    public render(): any
    {
        const el = <HTMLInputElement>document.createElement(this._elementType);
        el.type = this._type;
        el.title = this.title;
        el.id = this.id;
        el.name = this.name;

        super.assignAttributes(el);
        return el;
    }

    destroy(): void {

    }
}

export class InputFormControl extends BaseFormControl {

    constructor(id: string, name: string, title: string, attributes: any)
    {
        super(id, name, title, attributes);
        super._type = 'text';
    }
}

export class NumberFormControl extends BaseFormControl {

    constructor(id: string, name: string, title: string, attributes: any)
    {
        super(id, name, title, attributes);
        super.setType("number");
    }
}

export class CheckboxFormControl extends InputFormControl {
    constructor(id: string, name: string, title: string, attributes)
    {
        super(id, name, title, attributes);
        super.setType("checkbox");
    }

    public render(): any
    {
        const el = super.render();
        
        return el;
    }
}

/**
 * The base Composite class implements the infrastructure for managing child
 * objects, reused by all Concrete Composites.
 */
abstract class FormControlComposite extends FormControl
{
    protected controls: FormControlsMap = {};

    /**
     * The methods for adding/removing sub-objects.
     */
    public add(field: FormControl): void
    {
        let name = field.getName();
        this.controls[name] = field;
    }

    public remove(component: FormControl): void
    {
        delete this.controls[component.getName()];
    }

    /**
     * Whereas a Leaf's method just does the job, the Composite's method almost
     * always has to take its sub-objects into account.
     *
     * In this case, the composite can accept structured data.
     *
     * @param array $data
     */
    public setData(data): void
    {
        for(let name in this.controls){
            if(this.controls[name]){
                this.controls[name].setData(data[name]);
            }
        }
    }

    /**
     * The same logic applies to the getter. It returns the structured data of
     * the composite itself (if any) and all the children data.
     */
    public getData(): any
    {
        let data = {};

        for(let name in this.controls){
            if(this.controls[name]){
                data[name] = this.controls[name].getData();
            }
        }

        return data;
    }

    /**
     * The base implementation of the Composite's rendering simply combines
     * results of all children. Concrete Composites will be able to reuse this
     * implementation in their real rendering implementations.
     */
    public render(): any
    {
        let output = document.createDocumentFragment();

        Object.keys(this.controls).forEach((controlName)=>{
			output.appendChild(this.controls[controlName].render());
        });
        
        return output;
    }

    public destroy(): void {
        Object.keys(this.controls).forEach((controlName)=>{
			this.controls[controlName].destroy();
        });
    }
}

export class PropertyGridRow extends FormControlComposite {
    private propertyGridRowCssClass = "property-grid-row";
    private propertyGridCellCssClass = "property-grid-cell";
    public render(): any
    {
        const el = <HTMLTableRowElement>document.createElement("tr");
        el.classList.add(this.propertyGridRowCssClass);
        super.assignAttributes(el);

        Object.keys(this.controls).forEach((controlName)=>{
            el.appendChild(this.createLabelCell(this.controls[controlName]));
            el.appendChild(this.createControls(this.controls[controlName]));
        });

        return el;
    }

    private createLabelCell(control: FormControl){
        const cell = this.createGridCell();
        cell.appendChild(document.createTextNode(control.getTitle()));
        return cell;
    }

    private createControls(control: FormControl){
        const cell = this.createGridCell();
        
        cell.appendChild(control.render());
        return cell;
    }

    private createGridCell() {
        const el = <HTMLTableCellElement>document.createElement("td");
        el.classList.add(this.propertyGridCellCssClass);
        return el;
    }
}

export class PropertyGridGroup extends FormControlComposite {
    private propertyGridRowGroupCssClass = "property-grid-group";
    private propertyGridCellCssClass = "property-grid-cell";
    public render(): any
    {
        let output = document.createDocumentFragment();
        const el = <HTMLTableRowElement>document.createElement("tr");
        el.classList.add(this.propertyGridRowGroupCssClass);
        super.assignAttributes(el);

        const tdEl = this.createGridCell();
        tdEl.colSpan = 2;
        tdEl.appendChild(document.createTextNode(this.getTitle()));
        el.appendChild(tdEl);
        output.appendChild(el);
        

        Object.keys(this.controls).forEach((controlName)=>{
            output.appendChild(this.controls[controlName].render());
        });

        return output;
    }


    private createGridCell() {
        const el = <HTMLTableCellElement>document.createElement("td");
        el.classList.add(this.propertyGridCellCssClass);
        return el;
    }
}

/**
 * The fieldset element is a Concrete Composite.
 */
export class PropertyGridForm extends FormControlComposite
{
    private propertyGridFormCssClass = "property-grid-form";
    private propertyGridTableCssClass = "property-grid";

    public render(): any
    {
        const el = <HTMLFormElement>document.createElement("form");
        el.classList.add(this.propertyGridFormCssClass);
        super.assignAttributes(el);

        const pgTable = <HTMLTableElement>document.createElement("table");
        pgTable.classList.add(this.propertyGridTableCssClass);
        pgTable.appendChild(super.render());
        el.appendChild(pgTable);

        return el;
    }
}

/**
 * The fieldset element is a Concrete Composite.
 */
export class Fieldset extends FormControlComposite
{

    public render(): string
    {
        // Note how the combined rendering result of children is incorporated
        // into the fieldset tag.
        const output = super.render();
        
        return `<fieldset><legend>${this.title}</legend>\n${output}</fieldset>\n`;
    }
}

export abstract class Middleware {

    protected next: Middleware;

    /**
     * This method can be used to build a chain of middleware objects.
     */
    linkWith(next: Middleware): Middleware
    {
        this.next = next;

        return next;
    }

    build(formControl: FormControl): any {
        return this.build(formControl);
    }
}

export class FormControlDecorator implements IFormControl {
    protected component: FormControl;

    constructor(component: FormControl){
        this.component = component;
    }

    getId(){
        return this.component.getId();
    }

    getName(): string {
        return this.component.getName();
    }    

    getTitle(): string {
        return this.component.getTitle();
    }
    setData(data: any): void {
        this.component.setData(data);
    }
    getData() {
        return this.component.getData();
    }
    assignAttributes(el: any) {
        this.component.assignAttributes(el);
    }
    render() {
        return this.component.render();
    }

    destroy(){
        this.component.destroy();
    }

}

export interface FormControlValueHandler {
    render(): any;
    attachEventListeners(el): void;
    removeEventListeners(el): void;
    destroy(): void;
}

export class FormInputComponentDecorator extends FormControlDecorator implements FormControlValueHandler {

    private el;
    private mediator: Mediator;
    constructor(formControl: FormControl){
        super(formControl);
        this.onPropertyGridItemValueChange = this.onPropertyGridItemValueChange.bind(this);
        this.onChangeListener = this.onChangeListener.bind(this);
    }

    render() {
        console.log("Render method called!");
        this.el =  this.component.render();
        this.attachEventListeners(this.el);
        this.mediator.register('change', this.onChangeListener);
        return this.el;
    }    
    attachEventListeners(el: any): void {
        console.log("Attach Event listeners method called!");
        el.addEventListener('change', this.onPropertyGridItemValueChange);
    }
    removeEventListeners(): void {
        console.log("Remove Event listeners method called!");
    }
    destroy(): void {
        console.log("Destroy method called!");
    
        console.log(this.el);
        this.el.removeEventListener('change', this.onPropertyGridItemValueChange);
    }

    onPropertyGridItemValueChange(e){
        console.log(e.target.id+" "+e.target.value);
        this.mediator.send('change', e);
    }

    setMediator(mediator: Mediator){
        this.mediator = mediator;
    }

    onChangeListener(event){
        console.log(event);
    }
    

}

export class Mediator {
    private participants = {};
 
 
    register(event, callback) {
        console.log("Mediator, register "+event);
        if(!this.participants.hasOwnProperty(event)){
            this.participants[event] = [];
        }
        this.participants[event].push(callback);
        // this.participant.chatroom = this;
    }

    send(event, data) {
        console.log("Mediator, emmit "+event);
        this.participants[event].forEach((callback)=>callback(data));
        // if (to) {                      // single message
        //     to.receive(message, from);    
        // } else {                       // broadcast message
        //     for (var key in this.participants) {   
        //         if (this.participants[key] !== from) {
        //             this.participants[key].receive(message, from);
        //         }
        //     }
        // }
    }
}


export const COMPONENTS_MAP = {
    'text': InputFormControl,
    'number': NumberFormControl,
    'boolean': CheckboxFormControl,
    'row': PropertyGridRow,
    'form': PropertyGridForm
};

export class PropertyGridTableBuilder {
    private mediator: Mediator;
    constructor(){
        this.mediator = new Mediator();
    }

    build(config: PropertyGridGroup[]): any {
        const propGrid = new PropertyGridForm("","","", {});

        config.forEach((group)=>{
            propGrid.add(this.renderPropertyGridGroup(group));
        });

        return propGrid;
    }

    private renderPropertyGridGroup(item: PropertyGridGroup): PropertyGridGroup {
        const group = new PropertyGridGroup(item.name, item.name, item.label, {});
        
        item.children.forEach((gridItem)=>{

            if(this.isKnownControl(gridItem.type)){
                const row = new PropertyGridRow(gridItem.id, gridItem.name, gridItem.title, {});
                row.add(this.createFormControl(gridItem));
                group.add(row);
            }
            
        });
        console.log(group);
        return group;
    }

    private isKnownControl(itemType): boolean {
        return COMPONENTS_MAP.hasOwnProperty(itemType);
    }

    private createFormControl(gridItem: PropertyGridItem): FormControl {
        const ctrl:any = new FormInputComponentDecorator(
         new COMPONENTS_MAP[gridItem.type](gridItem.name, gridItem.title, gridItem.options));
         ctrl.setMediator(this.mediator);
        return ctrl;
    }
}


export class PropertyGridGroupsBuilder {

    private OTHER_GROUP_KEY = "other";
    private OTHER_GROUP_NAME = "Other";
    private ID_COUNTER = 1;

    buildGroups(config: PropertyGridConfig, sortProperties: boolean | ((params: string[]) => string[])): PropertyGridGroup[]{
        const groupsMap = {};
        const otherGroup = <PropertyGridGroup>{
            label: this.OTHER_GROUP_NAME,
            name: this.OTHER_GROUP_KEY,
            children:[]
        };

        console.group("PropertyGrid Build Groups");
        let properties = Object.keys(config);
		if(sortProperties){
			properties = this.sortProperties(properties);
		}
		console.log(properties);
		console.log("PropertyGrid Init End");
		
        properties.forEach((prop)=>{
            const item = config[prop];
            if(this.isNotBrowsable(item)){
                return;
            }

            const itemGroupLabel = item.hasOwnProperty("group")?item.group: this.OTHER_GROUP_KEY;
            const itemGroupKey = this.camelize(itemGroupLabel);

            if(!groupsMap.hasOwnProperty(itemGroupKey)){
                groupsMap[itemGroupKey] = this.createGroup(itemGroupLabel, itemGroupKey);
            }

            const propItem = this.createPropertyGridItem(item);
            if(itemGroupKey === 'other'){
                otherGroup.children.push(propItem);
            } else {
                groupsMap[itemGroupKey].children.push(this.createPropertyGridItem(item));
                this.ID_COUNTER++;
            }
            
            
        });
        groupsMap[this.OTHER_GROUP_KEY] = otherGroup;
        const groups = Object.keys(groupsMap).map((key)=>groupsMap[key])
        console.log(groups);
        console.groupEnd();

        return groups;
    }

    private createPropertyGridItem(item: PropertyGridConfigItem): PropertyGridItem {
        return <PropertyGridItem>{
            id: `pg${this.camelize(item.name)}${this.ID_COUNTER}`,
            name: this.camelize(item.name),
            title: item.name,
            type: (item.hasOwnProperty("type"))?item.type:"text",
            options: (item.hasOwnProperty("options"))?item.options:{},
            description: (item.hasOwnProperty("description"))?item.description:"",
            showHelp: (item.hasOwnProperty("showHelp"))?item.showHelp:false
        };
    }

    private createGroup(groupLabel, groupKey): PropertyGridGroup {
        return <PropertyGridGroup>{
            name: groupKey,
            label: groupLabel,
            children: []
        };
    }

    private isNotBrowsable(item: PropertyGridConfigItem): boolean {
        return item.hasOwnProperty("browsable") && item.browsable === false;
    }

    private sortProperties(properties: string[], sortMethod?: any): string[] {
		return (sortMethod instanceof Function)? sortMethod(properties) : properties.sort();
	}

    private camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

}