# Property Grid

- [Overview](#Overview)
- [Installation](#Installation)
- [Usage](#Usage)
  - [Import](#Import)
  - [Getting Started](#Getting-Started)
    - [Basic](#Basic)
    - [Advanced](#Advanced)
- [API](#API)
  - [Properties](#Properties)
  - [Methods](#Methods)
  - [Events](#Events)
  - [Hooks](#Hooks)
  - [Styling](#Styling)

## Overview

A small and simple property grid, written in pure Vanilla JavaScript (web components), inspired by [jqPropertyGrid](https://github.com/ValYouW/jqPropertyGrid).

With this PropertyGrid control you can pass object and allow users to edit the properties with the data type-specific editors. The component offers the ability to group and sort its items, use custom editors per data type, work with and without configuration...etc.

![Property Grid](docs/images/pg.jpg?raw=true 'Property Grid')

## Installation

Install with npm:

`npm i clean-web-ui-property-grid --save`

## Usage

### Import

If you are using typescript:

`import {PropertyGrid} from 'clean-web-ui-property-grid';`

With JavaScript, just import the script in the html body:

`<script src="clean-web-ui-property-grid.js"></script>`

### Getting Started

#### Basic

You can use by inserting web component in html:

```html
<property-grid id="pg1"></property-grid>
```

With JS:

```JS
const pg1 = document.getElementById('pg1');
pg1.selectedObject = pgData;
```

#### Advanced

More complex example would be to pass config and options to the grid.

In HTML:

```html
<div id="propertyGridWithConfig"></div>
```

In Js/Typescript:

```JS
//If using Typescript
import {createPropertyGrid} from 'clean-web-ui-property-grid';

var pgOptions = {
  hasGroups: true,
  propertySort: true
};

var pgConfig = {
  filter: { group: 'Behavior', name: 'Filter', type: 'boolean' },
  filterSize: {
    group: 'Behavior',
    name: 'Filter size',
    type: 'number',
    options: { min: 0, max: 500, step: 10 },
  }
};

var pgData = {
  filter: true,
  filterSize: 200
};

createPropertyGrid('propertyGridWithConfig', pgConfig, pgOptions, pgData);

// To listen for events emmited from grid
 document.getElementById('pgpropertyGridWithConfig').addEventListener('valueChange', (v) => console.log(v));
```

## API

### Properties

**_config_** - PropertyGridConfig | null
This is the metadata object that describes the target object properties.
Here you can pass and configure how the property grid editors will work like: control type, min/max values...etc.

```JS
{
"browsable": boolean //  Whether this property should be included in the grid, default is true (can be omitted),
"group": string // The group this property belongs to
"name": string // The display name of the property in the grid
"type": 'text' | 'number' | 'boolean' | 'color' | 'options' | 'label' // The type of the property
"description": string // A description of the property, will be used as tooltip on an hint element (a span with text "[?]")
"showHelp": boolean // If set to false, will disable showing description's span with text "[?]" on property name.
"items": string[] // List of Dropdown Items used for select control
"options": Object // An extra options object per type (attributes per control)
}
```

**_options_** - PropertyGridOptions | null
The options that are passed to the property grid control to configure how the grid will work. Here you pass options that configure the grid itself, not the individual controls. You can pass options like: show/hide groups, sort method...etc.

```JS
{
"hasGroups": boolean //Gets or sets a value indicating whether controls are groupped and if groups are visible
"propertySort": boolean | Function //If and how to sort properties in the grid. Optionally you can pass callback functiom
"onValueChange": FormControl // Hook that is called before value is changed
"controls": Function // Set custom controls that will be used for rendering
"enabled": boolean // Gets or sets a value indicating whether the control can respond to user interaction.
"toolbarVisible": boolean // Gets or sets a value indicating whether the toolbar is visible.
}
```

**_selectedObject_** - Object
The is the object that you want to edit in the grid. If no config is passed to the grid, the grid will try to create config based on object properties and value type.

**_disabled_** - boolean
Gets or sets a value indicating whether the control can respond to user interaction.

### Methods

**_render()_** - void
Build the config for the grid, render controls on UI and attach event listeners. Called internally by the grid when selectedObject is changed.

**_getValues()_** - Object
Returns the current values for all properties in the grid.

**_destroy()_** - void
Destroys all elements and removes all event listners from elements.
Called internally by the grid when the component is about to be destroyed.

## Events

**_valueChanged_** - CustomEvent
Fired when the value is changed for some of controls in the property grid.

Event payload:

`{name: 'controlname', value: 'new value'}`

## Hooks

**_onValueChange(event)_** - Object | boolean | void
Hook that is called before value is changed. Usefull if you want to intercept the original valueChange event.

## Styling

Available CSS variables

```JS
--property-grid-header-background: #E0ECFF;
--property-grid-header-border: 1px dotted #95B8E7;
--property-grid-table-row-group-background: #E0ECFF;
--property-grid-table-row-group-font-weight: bold;
--property-grid-table-row-hover: #f0f5fd;
--property-grid-cell-border: 1px dotted #ccc;
```
