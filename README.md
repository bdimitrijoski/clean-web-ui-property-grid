Property Grid
--------------------

Properties
--------------------------
CanFocus - Gets a value indicating whether the control can receive focus.
Controls - ?
Enabled - Gets or sets a value indicating whether the control can respond to user interaction.
Events - Gets the list of event handlers that are attached to this Component.
Focused - Gets a value indicating whether the control has input focus.
Font - Gets or sets the font of the text displayed by the control.
HasChildren - Gets a value indicating whether the control contains one or more child controls.
Height - Gets or sets the height of the control.
HelpVisible - Gets or sets a value indicating whether the Help text is visible.
PropertySort - Gets or sets the type of sorting the PropertyGrid uses to display properties.
SelectedGridItem - Gets or sets the selected grid item.
SelectedObject - Gets or sets the object for which the grid displays properties.
ToolbarVisible - Gets or sets a value indicating whether the toolbar is visible.
Visible - Gets or sets a value indicating whether the control and all its child controls are displayed.

Methods
--------------------
CollapseAllGridItems() - Collapses all the categories in the PropertyGrid.
Contains(Control)? - Retrieves a value indicating whether the specified control is a child of the control. 
CreateControl()?? - Forces the creation of the visible control, including the creation of the handle and any visible child controls.
CreatePropertyTab(Type)? - When overridden in a derived class, enables the creation of a PropertyTab.
Dispose() - Releases all resources used by the Component.
ExpandAllGridItems() - Expands all the categories in the PropertyGrid.
Focus() - Sets input focus to the control.
Hide() - Conceals the control from the user.
InitLayout() - Called after the control has been added to another container.
Invalidate() - Invalidates the entire surface of the control and causes the control to be redrawn.
Refresh() - Forces the control to invalidate its client area and immediately redraw itself and any child controls.
RefreshTabs(PropertyTabScope) - Refreshes the property tabs of the specified scope.
ResetBindings() - Causes a control bound to the BindingSource to reread all the items in the list and refresh their displayed values.
ResetSelectedProperty() - Resets the selected property to its default value.
Show() - Displays the control to the user.
Validate() - Verifies the value of the control losing focus by causing the Validating and Validated events to occur, in that order.

Events
---------------
ControlAdded - Occurs when a new control is added to the Control.ControlCollection.
ControlRemoved - Occurs when a control is removed from the Control.ControlCollection.
Disposed - Occurs when the component is disposed by a call to the Dispose() method.
EnabledChanged - Occurs when the Enabled property value has changed.
GotFocus - Occurs when the control receives focus.
Leave - Occurs when the input focus leaves the control.
LostFocus - Occurs when the control loses focus.
PropertySortChanged - Occurs when the sort mode is changed.
PropertyTabChanged - Occurs when a property tab changes.
PropertyValueChanged - Occurs when a property value changes.
SelectedGridItemChanged - Occurs when the selected GridItem is changed.
SelectedObjectsChanged - Occurs when the objects selected by the SelectedObjects property have changed.
VisibleChanged - Occurs when the Visible property value changes.