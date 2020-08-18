function createPropertyGrid(id, config, options, data) {
  var propertyGridWrapper = document.getElementById(id);
  let propertyGrid = document.createElement('property-grid');
  propertyGrid.id = 'pg' + id;
  propertyGrid.config = config;
  propertyGrid.options = options;
  propertyGrid.selectedObject = data;
  propertyGridWrapper.innerHTML = '';
  propertyGridWrapper.appendChild(propertyGrid);
}

function getValues(target) {
  var grid = document.getElementById(target);
  document.getElementById('txtValues').value = JSON.stringify(grid.getValues(), null, 2);
}

function updateOptions() {
  var options = document.getElementById('pgpropGridOptions').getValues();
  document.getElementById('pgpropertyGridWithConfig').options = options;
}

setTimeout(() => {
  var pgOptions = {
    preferredFormat: 'hex',
    showInput: true,
    showInitial: true,
    hasGroups: true,
    propertySort: true,
    toolbarVisible: true,
    onValueChange: (e) => {
      console.log(e);
      if (e.target.id == 'pgfilter2') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
  };

  var pgConfig = {
    dontShowMe: { browsable: false },
    filter: { group: 'Behavior', name: 'Filter', type: 'boolean' },
    filterSize: {
      group: 'Behavior',
      name: 'Filter size',
      type: 'number',
      options: { min: 0, max: 500, step: 10 },
    },
    accumulateTicks: {
      group: 'Behavior',
      name: 'Accumulate ticks',
      type: 'boolean',
    },
    buyColor: {
      group: 'Appearance',
      name: 'Buy color',
      type: 'color',
      options: {},
    },
    sellColor: {
      group: 'Appearance',
      name: 'Sell color',
      type: 'color',
      options: {
        preferredFormat: 'hex',
        showInput: true,
        showInitial: true,
      },
    },
    someOption: {
      name: 'Some option',
      type: 'options',
      items: ['Yes', 'No'],
    },
    readOnly: {
      name: 'Read Only',
      type: 'label',
      description: 'This is a label',
      showHelp: true,
    },
  };

  // var opts = {
  //   propertySort: (props) => props.sort().reverse(),
  // };

  var pgData = {
    accumulateTicks: true,
    filter: false,
    filterSize: 200,
    buyColor: '#00ff00',
    sellColor: '#ff0000',
    someOption: 'No',
    noGroup: 'I have no group',
    dontShowMe: 'please',
    readOnly: 'I am read only',
  };

  createPropertyGrid('propertyGridWithConfig', pgConfig, pgOptions, pgData);

  document.getElementById('pgpropertyGridWithConfig').addEventListener('valueChange', (v) => console.log(v));

  const pg1 = document.getElementById('pg1');
  pg1.selectedObject = pgData;

  // document.addEventListener('onValueChange', (v) => console.log(v));

  var pgOptionsConfig = {
    hasGroups: {
      group: 'Groups',
      name: 'Has Groups',
      type: 'boolean',
      description: 'Gets or sets a value indicating whether controls are groupped and if groups are visible.',
    },
    propertySort: {
      group: 'Controls',
      name: 'Properties sort',
      type: 'boolean',
      description: 'Gets or sets if PropertyGrid will sort properties by display name.',
    },
    toolbarVisible: {
      group: 'Controls',
      name: 'Is Toolbar Visible',
      type: 'boolean',
      description: 'Gets or sets a value indicating whether the toolbar is visible.',
    },
  };
  createPropertyGrid('propGridOptions', pgOptionsConfig, pgOptions, pgOptions);
}, 1000);
