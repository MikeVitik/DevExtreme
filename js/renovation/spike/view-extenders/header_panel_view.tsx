/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Effect, InternalState, Method,
} from 'devextreme-generator/component_declaration/common';
import { string } from 'yargs';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { Toolbox } from './toolbox';
import { GroupingHeaderPanel } from './groupingHeaderPanelExtender';
import { ToolboxItemPositionType } from './toolbox_item';
import { ColumnsView } from './columnsView';
import { View } from './view';
import { RenovatedViewInstance } from './view_instance';
import { Button } from '../../ui/button';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  items, isVisible,
  props: { gridInstance, gridProps },
}: HeaderPanelView) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <View isVisible={isVisible}>
    <Toolbox items={(items
      .map(({
        location, name, props, templateType: ItemTemplate,
      }) => ({
        location,
        name,
        template: props
          // eslint-disable-next-line react/jsx-props-no-spreading
          ? () => (<ItemTemplate {...props} />)
          : () => (<ItemTemplate gridInstance={gridInstance} gridProps={gridProps} />),
      }))
      )}
    />
  </View>
);

/* @ComponentBindings()
export class HeaderPanelViewProps extends DataGridViewProps {
  @OneWay() items?: {type: 'before'|'after'; name: string; template: any}[];
} */

type ItemType = { name: string; props: {} }[] | null;

@Component({ defaultOptionRules: null, view: viewFunction })
export class HeaderPanelView extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  get viewInstance(): HeaderPanelViewInstance {
    const viewInstance = this.props.gridInstance.getView('headerPanel');
    return viewInstance;
  }

  @InternalState() cachedItems: { name: string; props: {} }[] | null = null;

  @InternalState() cachedHolder: { items: { name: string; props: {} }[] | null } = { items: null };

  get_items() {
    const items = this.viewInstance._getToolbarItems();
    const result = items.map(({
      location, name, options,
    }) => {
      if (name === 'groupPanel') {
        return { name, location: 'before' as ToolboxItemPositionType, templateType: GroupingHeaderPanel };
      }
      if (name === 'exportButton') {
        return {
          name, location: 'before' as ToolboxItemPositionType, templateType: Button, props: { text: 'export' },
        };
      }
      return {
        name, type: location, templateType: Button, props: options,
      };
    });
    return result;
  }

  get items() {
    if (!this.cachedItems) {
      const items = this.get_items();
      this.cachedItems = items as any;
      this.cachedHolder.items = items as any;
      return items;
    }
    return this.cachedItems;
  }

  get isVisible() {
    return (this.viewInstance as any).isVisible();
  }

  @Method() setToolbarItemDisabled(itemName: string, disabled: boolean) {
    const items = this.cachedHolder.items?.map((item) => {
      if (item.name === itemName) {
        return {
          ...item,
          props: { ...item.props, disabled },
        };
      }
      return item;
    }) || [];
    console.log('updated items', items);
    this.cachedHolder.items = items;
    this.cachedItems = items;
  }
}

export class HeaderPanelViewInstance extends RenovatedViewInstance {
  // constructor(component) {
  //   super(component);
  // }
  viewComponent: {
    setToolbarItemDisabled: (itemName: string, disabled: boolean) => void;
  } | null = null;

  setRefToComponent(viewComponent) {
    this.viewComponent = viewComponent;
  }

  // eslint-disable-next-line no-underscore-dangle
  _getToolbarItems() {
    return [];
  }

  setToolbarItemDisabled(name, disabled) {
    console.log('setToolbarItemDisabled', name, disabled);
    this.viewComponent?.setToolbarItemDisabled(name, disabled);
  }
}
