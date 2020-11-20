/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, InternalState, Effect, Ref, ForwardRef,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { Toolbox } from './toolbox';
import { View } from './view';
import { RenovatedViewInstance } from './view_instance';
import { ToolboxItemPositionType } from './toolbox_item';
import { Button } from '../../ui/button';
// import { EditingHeaderPanelItems } from './editing_toolbar_item';
import { GroupingHeaderPanel, GroupingHeaderPropsType } from './grouping_header_panel';

export interface ToolbarItemType {
  location: ToolboxItemPositionType;
  name: string;
  templateProps?: any;// TODO { text: string; disabled?: boolean; onClick: any };
  templateType: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  items, isVisible,
  props: { gridInstance, gridProps },
}: HeaderPanelView) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <View isVisible={isVisible}>
    <Toolbox items={(items
      .map(({
        location, name, templateProps, templateType: ItemTemplate,
      }) => ({
        location,
        name,
        visible: true,
        template: templateProps
          // eslint-disable-next-line react/jsx-props-no-spreading
          ? () => (<ItemTemplate {...templateProps} />)
          : () => (<ItemTemplate gridInstance={gridInstance} gridProps={gridProps} />),
      }))
      )}
    />
    {/* <EditingHeaderPanelItems editingController={gridInstance.getController('editing')}
      editingOptions={gridProps.editing} /> */}
  </View>
);

const EDIT_MODE_BATCH = 'batch';

@Component({ defaultOptionRules: null, view: viewFunction })
export class HeaderPanelView extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
/* Editing start */
  private get editingProps() {
    return this.props.gridProps.editing;
  }

  private get editingVisible(): boolean {
    const editingOptions = this.editingProps;
    return !!(editingOptions
      && (editingOptions.allowAdding
        || ((editingOptions.allowUpdating || editingOptions.allowDeleting)
            && editingOptions.mode === EDIT_MODE_BATCH))
    );
  }

  private get editingController() {
    return this.props.gridInstance.getController('editing');
  }

  private get editingItems(): ToolbarItemType[] {
    if (this.editingVisible) {
      return this.editingController
        .prepareEditButtons(this)
        .map((item) => ({
          ...item,
          templateProps: { disabled: false, ...item.options },
          templateType: Button,
        }));
    }
    return [];
  }

  /* Editing end */

  /* Export start */
  private get exportProps() {
    return this.props.gridProps.export;
  }

  private get exportController() {
    return this.props.gridInstance.getController('export');
  }

  private get exportVisible(): boolean {
    return this.exportProps?.enabled || false;
  }

  private get exportItems(): ToolbarItemType[] {
    if (this.exportVisible) {
      return [{
        name: 'exportButton',
        location: 'after' as ToolboxItemPositionType,
        templateType: Button,
        templateProps: {
          disabled: false,
          text: 'Export',
          onClick: (): void => {
            this.exportController.exportToExcel();
          },
        },
      }];
    }
    return [];
  }

  /* Export end */

  /* GroupColumns start */
  private get groupProps() {
    return this.props.gridProps.groupPanel;
  }

  private get groupVisible(): boolean {
    let isVisible;
    if (this.groupProps) {
      isVisible = this.groupProps.visible;

      if (isVisible === 'auto') {
        // TODO Vitik partial implementation
        // isVisible = devices.current().deviceType === 'desktop' ? true : false;
        isVisible = true;
      }
    }
    return isVisible;
  }

  private get groupItems(): ToolbarItemType[] {
    if (this.groupVisible) {
      return [{
        name: 'groupPanel',
        location: 'before' as ToolboxItemPositionType,
        templateProps: {
          groupPanelRef: this.groupPanelRef as any,
          columnsController: this.props.gridInstance.getController('columns'),
          headerFilterController: this.props.gridInstance.getController('headerFilter'),
          headerFilterProps: this.props.gridProps.headerFilter,
        } as GroupingHeaderPropsType,
        templateType: GroupingHeaderPanel,
      }];
    }
    return [];
  }

  allowDragging(column) {
    return this.groupVisible && this.groupProps?.allowColumnDragging
    && column && column.allowGrouping;
  }

  // TODO Vitik generator bug @ForwardRef() groupPanelRef?: HTMLElement;
  // Workaround only for react;
  @InternalState() groupPanelRef: { current?: HTMLElement} = { };

  getColumnElements() {
    // TODO Vitik use ref instead of querySelectorAll;
    // const $element = this.element();
    // return $element?.find(`.${DATAGRID_GROUP_PANEL_ITEM_CLASS}`);
    return this.groupPanelRef.current?.querySelectorAll('.dx-datagrid-group-panel-item');
  }

  getColumns() {
    return this.props.gridInstance.getController('columns').getGroupColumns();
  }

  getBoundingRect() {
    if (this.groupPanelRef.current) {
      const top = this.groupPanelRef.current?.offsetTop;
      return { top, bottom: top + this.groupPanelRef.current?.offsetHeight };
    }
    return null;
    /* const $element = that.element();

    if ($element?.find(`.${DATAGRID_GROUP_PANEL_CLASS}`).length) {
      const offset = $element.offset();

      return {
        top: offset.top,
        bottom: offset.top + $element.height(),
      };
    }
    return null; */
  }

  getName() {
    return 'group';
  }

  /* GroupColumns end */
  private getUpdateItemsMap(items: ToolbarItemType[]): {[key: string]: ToolbarItemType } {
    const updatedItemsMap = {};
    items.forEach((item) => {
      if (!this.itemsMap || this.itemsMap[item.name] !== item) {
        updatedItemsMap[item.name] = { ...(updatedItemsMap[item.name] || {}), ...item };
      }
    });
    const names = Object.keys(updatedItemsMap);
    const result = { ...(this.itemsMap || {}), ...updatedItemsMap };
    if (names.length > 0) {
      return result;
    }
  }

  private updateItemsMap(items: ToolbarItemType[]): {[key: string]: ToolbarItemType } {
    const updatedItemsMap = {};
    items.forEach((item) => {
      if (!this.itemsMap || this.itemsMap[item.name] !== item) {
        updatedItemsMap[item.name] = { ...(updatedItemsMap[item.name] || {}), ...item };
      }
    });
    const names = Object.keys(updatedItemsMap);
    const result = { ...(this.itemsMap || {}), ...updatedItemsMap };
    if (names.length > 0) {
      this.itemsMap = result;
    }
    return result;
  }

  private updateMapItem(itemName: string, updatedItem: ToolbarItemType):
  { [key: string]: ToolbarItemType } {
    return {
      ...this.itemsMap,
      [itemName]: {
        ...updatedItem,
      },
    };
  }

  @InternalState() itemsMap!: {[key: string]: ToolbarItemType };

  get items(): ToolbarItemType[] {
    // TODO Vitik reset this.itemsMap after gridProps changed
    const itemsMap = this.itemsMap
    || this.updateItemsMap([...this.exportItems, ...this.editingItems, ...this.groupItems]);
    return Object.keys(itemsMap).map((name) => itemsMap[name]);
  }

  get isVisible() {
    return this.items.length > 0;
  }

  setToolbarItemDisabled(itemName: string, disabled: boolean) {
    const itemMap = this.itemsMap[itemName];
    if (itemMap?.templateProps?.disabled !== disabled) {
      this.itemsMap = this.updateMapItem(itemName, {
        ...itemMap,
        templateProps: { ...itemMap.templateProps, disabled },
      });
    }
  }

  get viewInstance(): RenovatedViewInstance & { setToolbarItemDisabled: (i, b) => void} {
    const viewInstance = this.props.gridInstance.getView('headerPanel');
    return viewInstance;
  }

  @Effect() extendViewInstance() {
    // eslint-disable-next-line prefer-destructuring
    const viewInstance: any = this.viewInstance;
    viewInstance.allowDragging = this.allowDragging;
    viewInstance.getColumnElements = this.getColumnElements;
    viewInstance.getColumns = this.getColumns;
    viewInstance.getBoundingRect = this.getBoundingRect;
    viewInstance.getName = this.getName;
    viewInstance.setToolbarItemDisabled = this.setToolbarItemDisabled;
  }
}
