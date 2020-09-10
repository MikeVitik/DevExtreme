import {
  JSXComponent, Component, ComponentBindings, OneWay, InternalState, Effect,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  items,
}: GroupingHeaderPanel) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div>
    { (items
      .map(({ caption, cssClass }) => (<div className={cssClass}>{caption}</div>))) }
  </div>
);
/* @ComponentBindings()
export class GroupingHeaderPanelProps extends DataGridViewProps {
  // @OneWay() items?: {type: 'before'|'after'; name?: string; template?: any}[];
} */

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupingHeaderPanel extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  @InternalState() groupingColumns;

  get items(): { caption: string; cssClass: string}[] {
    const groupColumns = this.groupingColumns || this.props.gridInstance.getController('columns').getGroupColumns();
    return groupColumns;
  }

  @Effect({ run: 'once' }) init() {
    const columnsController = this.props.gridInstance.getController('columns');
    columnsController.columnsChanged.add(() => {
      this.groupingColumns = this.props.gridInstance.getController('columns').getGroupColumns();
    });
  }
}
