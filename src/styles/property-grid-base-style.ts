const propertyGridStyles = document.createElement('template');
propertyGridStyles.innerHTML = `
<style>
    .property-grid {
        border: solid 1px #95B8E7;
        border-spacing: 0;
        table-layout:fixed;
    }

    .property-grid-group {
        background-color: #E0ECFF;
        font-weight: bold;
    }

    .property-grid-group.collapsable {
        cursor: pointer;
    }

    .property-grid-group-cell {
        padding: 5px;
    }

    .property-grid-row {
    }

    .property-grid-cell {
        border: dotted 1px #ccc;
        padding: 5px;
        position:relative;
        width: 50%;
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
