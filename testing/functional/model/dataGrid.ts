import { ClientFunction } from "testcafe";
import Widget from "./internal/widget";

const CLASS = {
    headers: 'dx-datagrid-headers',
    headerRow: 'dx-header-row',
    filterRow: 'dx-datagrid-filter-row',
    filterMenu: 'dx-filter-menu',
    dataRow: 'dx-data-row',
    groupRow: 'dx-group-row',
    commandEdit: 'dx-command-edit',
    commandExpand: 'dx-command-expand',
    commandLink: 'dx-link',
    focused: 'dx-focused',
    focusedState: 'dx-state-focused',
    hiddenFocusedState: 'dx-cell-focus-disabled',
    focusedRow: 'dx-row-focused',
    editCell: 'dx-editor-cell',
    rowRemoved: 'dx-row-removed',
    editorInput: 'dx-texteditor-input',
    filterPanel: 'dx-datagrid-filter-panel',
    filterPanelIcon: 'dx-icon-filter',
    filterPanelText: 'dx-datagrid-filter-panel-text',
    pager: 'dx-datagrid-pager',
    pagerPageSize: 'dx-page-size',
    pagerPrevNavButton: 'dx-prev-button',
    pagerNextNavButton: 'dx-next-button',
    pagerPage: 'dx-page',
    groupExpanded: 'dx-datagrid-group-opened'
};

class DxElement {
    element: Selector;
    hasFocusedState: Promise<boolean>;
    hasHiddenFocusState: Promise<boolean>;

    constructor(element: Selector) {
        this.element = element;
        this.hasFocusedState = this.element.hasClass(CLASS.focusedState);
        this.hasHiddenFocusState = this.element.hasClass(CLASS.hiddenFocusedState);
    }
}

class Headers extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getHeaderRow(index: number): HeaderRow {
        return new HeaderRow(this.element.find(`.${CLASS.headerRow}:nth-child(${++index})`));
    }

    getFilterRow(): FilterRow {
        return new FilterRow(this.element.find(`.${CLASS.filterRow}`));
    }
}

class FilterRow extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getFilterCell(index: number): FilterCell {
        return new FilterCell(this.element.find(`.${CLASS.editCell}:nth-child(${index + 1})`));
    }
}

class FilterCell extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getSearchIcon(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.filterMenu}`));
    }

    getEditor(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.editorInput}`));
    }
}

class HeaderCell extends DxElement {
    constructor(headerRow: Selector, index: number) {
        super(headerRow.find(`td:nth-child(${++index})`));
    }

    getFilterIcon(): Selector {
        return this.element.find(`.dx-column-indicators > .dx-header-filter`);
    }
}

class HeaderRow extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getHeaderCell(index: number): HeaderCell {
        return new HeaderCell(this.element, index);
    }
}

class DataCell extends DxElement {
    isFocused: Promise<boolean>;
    isEditCell: Promise<boolean>;

    constructor(dataRow: Selector, index: number) {
        super(dataRow.find(`td:nth-child(${++index})`));
        this.isFocused = this.element.hasClass(CLASS.focused);
        this.isEditCell = this.element.hasClass(CLASS.editCell);
    }
}

class CommandCell extends DxElement {
    constructor(dataRow: Selector, index: number) {
        super(dataRow.find(`td:nth-child(${++index}).${CLASS.commandEdit}`));
    }

    getButton(index: number) {
        return this.element.find(`.${CLASS.commandLink}:nth-child(${index + 1})`);
    }
}

class DataRow extends DxElement {
    isRemoved: Promise<boolean>;
    isFocusedRow: Promise<boolean>;

    constructor(element: Selector) {
        super(element);
        this.isRemoved = this.element.hasClass(CLASS.rowRemoved);
        this.isFocusedRow = this.element.hasClass(CLASS.focusedRow);
    }

    getDataCell(index: number): DataCell {
        return new DataCell(this.element, index);
    }

    getCommandCell(index: number): CommandCell {
        return new CommandCell(this.element, index);
    }
}

class GroupRow extends DxElement {
    widgetName: string;
    isFocusedRow: Promise<boolean>;
    isFocused: Promise<boolean>;
    isExpanded: Promise<boolean>;

    constructor(element: Selector, widgetName: string) {
        super(element);
        this.widgetName = widgetName;
        this.isFocusedRow = this.element.hasClass(CLASS.focusedRow);
        this.isFocused = this.element.hasClass(CLASS.focused);
        this.isExpanded = this.element.find(`.${CLASS.commandExpand} .${CLASS.groupExpanded}`).exists
    }

    getCell(index: number): DataCell {
        return new DataCell(this.element, index);
    }
}

class FilterPanel extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getIconFilter(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.filterPanelIcon}`));
    }

    getFilterText(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.filterPanelText}`));
    }
}

class Pager extends DxElement {
    constructor(element: Selector) {
        super(element);
    }

    getPageSize(index: number): DxElement {
        return new DxElement(this.element.find(`.${CLASS.pagerPageSize}:nth-child(${index + 1})`));
    }

    getPrevNavButton(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.pagerPrevNavButton}`));
    }

    getNextNavButton(): DxElement {
        return new DxElement(this.element.find(`.${CLASS.pagerNextNavButton}`));
    }

    getNavPage(index: number): DxElement {
        return new DxElement(this.element.find(`.${CLASS.pagerPage}`).nth(index));
    }
}

export default class DataGrid extends Widget {
    dataRows: Selector;
    getGridInstance: ClientFunction<any>;

    name: string = 'dxDataGrid';

    constructor(id: string) {
        super(id);

        this.dataRows = this.element.find(`.${CLASS.dataRow}`);

        const dataGrid =  this.element;

        this.getGridInstance = ClientFunction(
            () => $(dataGrid())["dxDataGrid"]("instance"),
            { dependencies: { dataGrid }}
        );
    }

    getHeaders(): Headers {
        return new Headers(this.element.find(`.${CLASS.headers}`));
    }

    getDataRow(index: number): DataRow {
        return new DataRow(this.element.find(`.${CLASS.dataRow}:nth-child(${++index})`));
    }

    getDataCell(rowIndex: number, columnIndex: number): DataCell {
        return this.getDataRow(rowIndex).getDataCell(columnIndex);
    }

    getGroupRow(index: number): GroupRow {
        return new GroupRow(this.element.find(`.${CLASS.groupRow}`).nth(index), this.name);
    }

    getFocusedRow(): Selector {
        return this.dataRows.filter(`.${CLASS.focusedRow}`);
    }

    getFilterPanel(): FilterPanel {
        return new FilterPanel(this.element.find(`.${CLASS.filterPanel}`));
    }

    getPager(): Pager {
        return new Pager(this.element.find(`.${CLASS.pager}`));
    }

    scrollTo(options): Promise<void> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().getScrollable().scrollTo(options),
            { dependencies: { getGridInstance, options } }
        )();
    }

    getScrollLeft() : Promise<number> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().getScrollable().scrollLeft(),
            { dependencies: { getGridInstance: this.getGridInstance } }
        )();
    }

    getScrollbarWidth(isHorizontal: boolean) : Promise<number> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().getView('rowsView').getScrollbarWidth(isHorizontal),
            { dependencies: { getGridInstance, isHorizontal } }
        )();
    }
}
