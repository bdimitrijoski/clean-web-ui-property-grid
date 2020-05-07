import {PropertyGridOptions} from './property-grid-types';

const propertyGridTemplate = document.createElement('template');
const propertyGridTemplateContent = `
<style>
    .pgTable {
        border: solid 1px #95B8E7;
        border-spacing: 0;
    }

    .pgGroupRow {
        background-color: #E0ECFF;
        font-weight: bold;
    }

    .pgGroupRow.pgCollapsible {
        cursor: pointer;
    }

    .pgGroupCell {
        padding: 5px;
    }

    .pgRow{
    }

    .pgCell {
        border: dotted 1px #ccc;
        padding: 5px;
    }

    .pgTooltip {
        margin-left: 5px;
    }
</style>
<div id="propertyGrid" ></div>
`;
propertyGridTemplate.innerHTML = propertyGridTemplateContent;

export class PropertyGrid extends HTMLElement {

    _options: PropertyGridOptions;
    _value = {};
    _propertyGridEl;
    _gridReady = false;
    OTHER_GROUP_NAME = 'Other';
	GET_VALS_FUNC_KEY = 'pg.getValues';
    pgIdSequence = 0;
    getValueFuncs = {};
    eventListeners = {};

  constructor() {
    super();

    // Create a new shadow dom root.
    // The mode describes, if the node can be accessed from the outside.
    this.attachShadow({mode: 'open'});

    // Fill the shadow dom with the template by a deep clone.
    this.shadowRoot.appendChild(propertyGridTemplate.content.cloneNode(true));

   this._propertyGridEl = this.shadowRoot.querySelector('#propertyGrid');

    this.onPropertyGridItemValueChange = this.onPropertyGridItemValueChange.bind(this);
  }

  set options(opts: PropertyGridOptions) {
    // Normalize options
    opts = opts && typeof opts === 'object' ? opts : {};
    opts.meta = opts.meta && typeof opts.meta === 'object' ? opts.meta : {};
    opts.customTypes = opts.customTypes || {};
    opts.helpHtml = opts.helpHtml || '[?]';
    opts.sort = (typeof opts.sort === 'undefined') ? false : opts.sort;
    opts.isCollapsible = (typeof opts.isCollapsible === 'undefined') ? false : !!(opts.isCollapsible);
    opts.callback = (typeof opts.callback === 'function') ? opts.callback : null;

    this._options = opts;
    this._gridReady = true;
    console.log(this._options);
  }
  
  get options() {
    return this._options;
  }

  set value(obj) {
    if (typeof obj === 'string') {
        console.error('PropertyGrid got invalid option:', obj);
        return;
    } else if (typeof obj !== 'object' || obj === null) {
        console.error('PropertyGrid must get an object in order to initialize the grid.');
        return;
    }
    this._value = obj;
    console.log(this._value);
    console.log(this._gridReady);

    // if(this._gridReady){
    //     this.render();
    // }
  }
  
  get value() {
    return this._value;
  }

//   attributeChangedCallback(name, oldValue, newValue) {
//     if (name === 'value') {
//       this._value = parseInt(newValue, 10);
//     }
//   }

    connectedCallback(){

    }

    render(){
        var meta = this._options.meta;
		var propertyRowsHTML = {OTHER_GROUP_NAME: ''};
		var groupsHeaderRowHTML = {};
		var postCreateInitFuncs = [];
		var getValueFuncs = {};
		var pgId = 'pg' + (this.pgIdSequence++);
		var el = this._propertyGridEl;

		var currGroup;
		var properties = Object.keys(this._value);

		if (this._options.sort) {
			if (typeof this._options.sort === 'boolean') {
				properties = properties.sort();
			} else if (typeof this._options.sort === 'function') {
				properties = properties.sort(this._options.sort);
			}
        }
        
        properties.forEach((prop) => {
			// Skip if this is a function, or its meta says it's non browsable
			if (typeof this._value[prop] === 'function' || (meta[prop] && meta[prop].browsable === false)) {
				return;
			}

			// Check what is the group of the current property or use the default 'Other' group
			currGroup = (meta[prop] && meta[prop].group) || this.OTHER_GROUP_NAME;

			// If this is the first time we run into this group create the group row
			if (currGroup !== this.OTHER_GROUP_NAME && !groupsHeaderRowHTML[currGroup]) {
				groupsHeaderRowHTML[currGroup] = this.getGroupHeaderRowHtml(currGroup, this._options.isCollapsible);
			}

			// Initialize the group cells html
			propertyRowsHTML[currGroup] = propertyRowsHTML[currGroup] || '';

			// Append the current cell html into the group html
			propertyRowsHTML[currGroup] += this.getPropertyRowHtml(pgId, prop, this._value[prop], meta[prop], postCreateInitFuncs, getValueFuncs, this._options, el);
        });
        
        // Now we have all the html we need, just assemble it
		var innerHTML = '<form class="pgForm" ><table class="pgTable">';
		for (var group in groupsHeaderRowHTML) {
			// Add the group row
			innerHTML += groupsHeaderRowHTML[group];
			// Add the group cells
			innerHTML += propertyRowsHTML[group];
		}

		// Finally we add the 'Other' group (if we have something there)
		if (propertyRowsHTML[this.OTHER_GROUP_NAME]) {
			innerHTML += this.getGroupHeaderRowHtml(this.OTHER_GROUP_NAME, this._options.isCollapsible);
			innerHTML += propertyRowsHTML[this.OTHER_GROUP_NAME];
		}

		// Close the table and apply it to the div
        innerHTML += '</table></form>';
        el.innerHTML = innerHTML;
        // this.html(innerHTML);
        
        
    }

    attachEventListeners(){
        //attach event listners
        var elements = (<any>this.shadowRoot.querySelector('.pgForm')).elements;
        for(var i=0; i<elements.length; i++){
            elements[i].addEventListener('change', this.onPropertyGridItemValueChange);
        }
    }

    // Create a function that will return tha values back from the property grid
	getValues() {
        
			var result = {};
			for (var prop in this.getValueFuncs) {
				if (typeof this.getValueFuncs[prop] !== 'function') {
					continue;
				}

				result[prop] = this.getValueFuncs[prop]();
			}

			return result;
		};

    /**
	 * Gets the html of a group header row
	 * @param {string} displayName - The group display name
	 * @param {boolean} isCollapsible - Whether the group should support expand/collapse
	 */
	getGroupHeaderRowHtml(displayName, isCollapsible) {
		return '<tr class="pgGroupRow ' + (isCollapsible ? 'pgCollapsible' : '') + '"><td colspan="2" class="pgGroupCell">' + (isCollapsible ? '- ' : '') + displayName + '</td></tr>';
    }
    
    /**
	 * Gets the html of a specific property row
	 * @param {string} pgId - The property-grid id being rendered
	 * @param {string} name - The property name
	 * @param {*} value - The current property value
	 * @param {object} meta - A metadata object describing this property
	 * @param {function[]} [postCreateInitFuncs] - An array to fill with functions to run after the grid was created
	 * @param {object.<string, function>} [getValueFuncs] - A dictionary where the key is the property name and the value is a function to retrieve the property selected value
	 * @param {object} options - top level options object for propertyGrid containing all options
     * @param {object} el - the container for the property grid
	 */
	getPropertyRowHtml(pgId, name, value, meta, postCreateInitFuncs, getValueFuncs, options, el) {
		if (!name) {
			return '';
		}

		var changedCallback = options.callback;
		meta = meta || {};
		// We use the name in the meta if available
		var displayName = meta.name || name;
		var type = meta.type || '';
		var elemId = pgId + name;

		var valueHTML;

		// check if type is registered in customTypes
		var customTypes = options.customTypes;
		var customType;
		for (var ct in customTypes) {
			if (type === ct) {
				customType = customTypes[ct];
				break;
			}
		}

		// If custom type found use it
		if (customType) {
			// valueHTML = customType.html(elemId, name, value, meta);
			// if (getValueFuncs) {
			// 	if (customType.hasOwnProperty('makeValueFn')) {
			// 		getValueFuncs[name] = customType.makeValueFn(elemId, name, value, meta);
			// 	} else if (customType.hasOwnProperty('valueFn')) {
			// 		getValueFuncs[name] = customType.valueFn;
			// 	} else {
			// 		getValueFuncs[name] = function() {
			// 			return $('#' + elemId).val();
			// 		};
			// 	}
			// }
		}

		// If boolean create checkbox
		else if (type === 'boolean' || (type === '' && typeof value === 'boolean')) {
			valueHTML = '<input type="checkbox" id="' + elemId + '" value="' + name + '"' + (value ? ' checked' : '') + ' />';

            this.getValueFuncs[name] = ()=> {
                return (<any>this.shadowRoot.querySelector('#' + elemId)).checked;
            };
			

			// if (changedCallback) {
			// 	$(el).on('change', '#' + elemId, function changed() {
			// 		changedCallback(this, name, $('#' + elemId).is(':checked'));
			// 	});
			// }

			// If options create drop-down list
		} else if (type === 'options' && Array.isArray(meta.options)) {
            valueHTML = this.getSelectOptionHtml(elemId, value, meta.options);
            this.getValueFuncs[name] = ()=> {
                return (<any>this.shadowRoot.querySelector('#' + elemId)).value;
            };

			// if (changedCallback) {
			// 	$(el).on('change', '#' + elemId, function changed() {
			// 		changedCallback(this, name, $('#' + elemId).val());
			// 	});
			// }

			// If number and a jqueryUI spinner is loaded use it
        } 
        else if ( (type === 'number' || (type === '' && typeof value === 'number'))) {
			valueHTML = '<input type="number" id="' + elemId + '" value="' + value + '"  />';
			this.getValueFuncs[name] = ()=> {
                return (<any>this.shadowRoot.querySelector('#' + elemId)).value;
            };

			// if (getValueFuncs) {
			// 	getValueFuncs[name] = function() {
			// 		return $('#' + elemId).spinner('value');
			// 	};
			// }

			// If color and we have the spectrum color picker use it
        } 
        else if (type === 'color' ) {
            valueHTML = '<input type="color" id="' + elemId + '" value="' + value + '"</input>';
            this.getValueFuncs[name] = ()=> {
                return (<any>this.shadowRoot.querySelector('#' + elemId)).value;
            };

        } 
        else if (type === 'label') {
			if (typeof meta.description === 'string' && meta.description) {
				valueHTML = '<label for="' + elemId + '" title="' + meta.description + '">' + value + '</label>';
			} else {
				valueHTML = '<label for="' + elemId + '">' + value + '</label>';
			}

			// Default is textbox
		} else {
			valueHTML = '<input type="text" id="' + elemId + '" value="' + value + '"</input>';
			this.getValueFuncs[name] = ()=> {
                return (<any>this.shadowRoot.querySelector('#' + elemId)).value;
            };

			// if (changedCallback) {
			// 	$(el).on('propertychange change keyup paste input', '#' + elemId, function changed() {
			// 		changedCallback(this, name, $('#' + elemId).val());
			// 	});
			// }
		}

		if (typeof meta.description === 'string' && meta.description &&
			(typeof meta.showHelp === 'undefined' || meta.showHelp)) {
			displayName += '<span class="pgTooltip" title="' + meta.description + '">' + options.helpHtml + '</span>';
		}

		if (meta.colspan2) {
			return '<tr class="pgRow"><td colspan="2" class="pgCell">' + valueHTML + '</td></tr>';
		} else {
			return '<tr class="pgRow"><td class="pgCell">' + displayName + '</td><td class="pgCell">' + valueHTML + '</td></tr>';
		}
    }
    

    /**
	 * Gets a select-option (dropdown) html
	 * @param {string} id - The select element id
	 * @param {string} [selectedValue] - The current selected value
	 * @param {*[]} options - An array of option. An element can be an object with value/text pairs, or just a string which is both the value and text
	 * @returns {string} The select element html
	 */
	getSelectOptionHtml(id, selectedValue, options) {
		id = id || '';
		selectedValue = selectedValue || '';
		options = options || [];

		var html = '<select';
		if (id) {
			html += ' id="' + id + '"';
		}

		html += '>';

		var text;
		var value;
		for (var i = 0; i < options.length; i++) {
			value = typeof options[i] === 'object' ? options[i].value : options[i];
			text = typeof options[i] === 'object' ? options[i].text : options[i];
			html += '<option value="' + value + '"' + (selectedValue === value ? ' selected>' : '>');
			html += text + '</option>';
		}

		html += '</select>';
		return html;
    }
    
    disconnectedCallback(){
        
    }

    onPropertyGridItemValueChange(e){
        if(this._options.callback){
			// changedCallback(e.target.id, e.target.value);
			console.log('callback should be called!')
        }
    }

    removeEventListeners(){
        //attach event listners
        var elements = (<any>this.shadowRoot.querySelector('.pgForm')).elements;
        for(var i=0; i<elements.length; i++){
            elements[i].removeEventListener('change', this.onPropertyGridItemValueChange);
        }
    }
}
customElements.define('property-grid', PropertyGrid);