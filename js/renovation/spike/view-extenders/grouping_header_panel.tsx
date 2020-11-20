import {
  JSXComponent, Component, InternalState, Effect, ComponentBindings, OneWay, ForwardRef, Ref,
} from 'devextreme-generator/component_declaration/common';
import { HeaderPanelGroupFilterProps } from './header_panel_group_filter';
import { GroupingHeaderColumnPanel } from './grouping_header_panel_column';

interface ColumnWithFilterType {
  index: number;
  command?: boolean;
  filterValues?: [];
  allowHeaderFiltering?: boolean;
  allowFiltering?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  props: { groupPanelRef, headerFilterController, headerFilterProps },
  items,
}: GroupingHeaderPanel) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div ref={groupPanelRef as any} className="dx-datagrid-group-panel">
    { (items
      .map((groupColumn) => {
        const {
          caption, cssClass,
          index, command, filterValues, allowHeaderFiltering, allowFiltering,
        } = groupColumn;
        return (
          <GroupingHeaderColumnPanel
            key={index}
            caption={caption}
            cssClass={cssClass}
            // props for filter indicator
            index={index}
            command={command}
            filterValues={filterValues}
            allowHeaderFiltering={allowHeaderFiltering}
            allowFiltering={allowFiltering}
            headerFilterController={headerFilterController}
            headerFilterProps={headerFilterProps}
          />
        );
      })) }
  </div>
);

@ComponentBindings()
export class GroupingHeaderProps {
  @ForwardRef() groupPanelRef?: HTMLElement;

  @OneWay() columnsController!: { getGroupColumns: () => any; columnsChanged: any };
}

export type GroupingHeaderPropsType = GroupingHeaderProps & Pick<HeaderPanelGroupFilterProps, 'headerFilterController' | 'headerFilterProps'>;

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupingHeaderPanel extends JSXComponent<GroupingHeaderPropsType, 'columnsController' | 'headerFilterController'>() {
  @InternalState() groupingColumns;

  get items(): ({ headerId: string; caption: string; cssClass: string} & ColumnWithFilterType)[] {
    const groupColumns = this.groupingColumns || this.props.columnsController.getGroupColumns();
    if (this.groupingColumns !== groupColumns) {
      this.groupingColumns = groupColumns;
    }
    return groupColumns;
  }

  @Effect({ run: 'once' }) init() {
    const { columnsController } = this.props;
    columnsController.columnsChanged.add(() => {
      // TODO Vitik It's not good because we re-render all group header panel.
      // But columnsController.getGroupColumns() isn't immutable structure.
      // To solve it desctuct all groupingColumn into simple props
      // instead of <GroupingHeaderColumnPanel groupColumn={groupColumn} />
      this.groupingColumns = columnsController.getGroupColumns();
    });
  }
}
