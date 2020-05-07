const propertyGridStyles = document.createElement('template');
propertyGridStyles.innerHTML = `
<style>
    .property-grid {
        border: solid 1px #95B8E7;
        border-spacing: 0;
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
    }

    .property-grid-tooltip {
        margin-left: 5px;
    }
</style>
`;

export {propertyGridStyles};