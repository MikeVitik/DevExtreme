import {
  JSXComponent, Component, ComponentBindings, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { HeaderPanelGroupFilter, HeaderPanelGroupFilterProps } from './header_panel_group_filter';
import { combineClasses } from '../../utils/combine_classes';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  cssClass,
  props: {
    headerFilterController, headerFilterProps,
    caption,
    index, command, filterValues, allowHeaderFiltering, allowFiltering,
  },
}: GroupingHeaderColumnPanel) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div className={cssClass}>
    {caption}
    <HeaderPanelGroupFilter
      // groupColumn={groupColumn as any}
      index={index}
      command={command}
      filterValues={filterValues}
      allowHeaderFiltering={allowHeaderFiltering}
      allowFiltering={allowFiltering}
      headerFilterController={headerFilterController}
      headerFilterProps={headerFilterProps}
    />
  </div>
);

@ComponentBindings()
export class GroupingHeaderColumnProps {
  @OneWay() caption = '';

  @OneWay() cssClass = '';
}

export type GroupingHeaderColumnPropsType = GroupingHeaderColumnProps &
Pick<HeaderPanelGroupFilterProps, 'headerFilterController' | 'index' | 'command' | 'filterValues' | 'allowHeaderFiltering' | 'allowFiltering' | 'headerFilterProps'>;

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupingHeaderColumnPanel extends JSXComponent<GroupingHeaderColumnPropsType, 'index' | 'headerFilterController' | 'headerFilterProps'>() {
  get cssClass(): string {
    return combineClasses({ 'dx-datagrid-group-panel-item': true, [this.props.cssClass]: true });
  }
}
