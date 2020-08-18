const propertyGridStyles = document.createElement('template');
propertyGridStyles.innerHTML = `
<style>
  :host {
    --property-grid-header-background: #E0ECFF;
    --property-grid-header-border: 1px dotted #95B8E7;
    --property-grid-table-row-group-background: #E0ECFF;
    --property-grid-table-row-group-font-weight: bold;
    --property-grid-table-row-hover: #f0f5fd;
    --property-grid-cell-border: 1px dotted #ccc;
  }


    .property-grid {
        border: solid 1px #95B8E7;
        border-spacing: 0;
        table-layout:fixed;
        width: 100%;
    }

    .property-grid-header {
      display: block;
      overflow: hidden;
      padding: 5px;
      border: var(--property-grid-header-border);
      background: var(--property-grid-header-background);
    }

    .property-grid-header.hidden {
      display: none;
    }


    ::slotted([slot="toolbar-buttons"]) {
      display: block;
      float: left;
      margin-right: 5px;
    }

    .search-wrapper {
      display: block;
      overflow:hidden;
    }

    .property-grid-header input {
      width: 100%;
      border: 1px solid #ccc;
      font-size: 12px;
      font-weight: normal;
      outline: 0;
    }

    .property-grid-form.no-groups .property-grid-group{
      display: none;
    }

    .property-grid-form fieldset {
      border: 0;
      outline: 0;
      padding: 0;
      margin: 0;
    }

    .property-grid-form fieldset[disabled]{
      opacity: 0.8;
      cursor: not-allowed;
    }

    .property-grid-row-group,
    .property-grid-row-group-wrapper,
    .property-grid-row-group table,
    .property-grid-row-group table tr {
      border:0;
      padding:0;
      margin:0;
      width: 100%;
      border-collapse: collapse;
      border-spacing: 2px;
    }



    .property-grid-group-content table {
      display: table;
      table-layout: fixed;
    }

    .property-grid-group-content.collapsed table {
      display: none;
    }

    .property-grid-group-content table tr:hover {
      background: var(--property-grid-table-row-hover, #f0f5fd);
    }


    .property-grid-group-content > td {
      padding:0;
    }

    .property-grid-group {
        background-color: var(--property-grid-table-row-group, #E0ECFF);
        font-weight: var(--property-grid-table-row-group-font-weight, bold);
        cursor: pointer;
    }

    .property-grid-group.collapsable {
        cursor: pointer;
    }

    .property-grid-group-cell {
        padding: 5px;
    }

    .property-grid-row.hidden {
      display: none;
    }

    .property-grid-cell {
        border: var(--property-grid-cell-border);
        padding: 5px;
        position:relative;
        width: auto;
        max-width: 50%;
    }
    .property-grid-cell > input:not([type=checkbox]),
    .property-grid-cell > select
    {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        box-sizing: border-box;
        bottom: 0;
        padding: 5px;
        border: 0;
        outline:0;
    }

    .property-grid-cell > input[type=color] {
      width: 50%;
    }

    .property-grid-tooltip {
        margin-left: 5px;
    }
</style>
`;

export { propertyGridStyles };
