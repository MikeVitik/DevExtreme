import {
  OneWay, ComponentBindings, Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import { DataGridHeaderFilter } from '../../ui/data_grid/props';

import { allowHeaderFiltering as isHeaderFilteringAllow } from '../../../ui/grid_core/ui.grid_core.header_filter_core';

export const viewFunction = ({
  visible,
  changeFilter,
  filterState,
}: HeaderPanelGroupFilter): JSX.Element | null => (
  visible ? <div onClick={changeFilter} role="button" onKeyPress={changeFilter} tabIndex={0}>{filterState}</div> : null
);

@ComponentBindings()
export class HeaderPanelGroupFilterProps {
  @OneWay() index!: number;

  @OneWay() command?: boolean;

  @OneWay() filterValues?: [];

  @OneWay() allowHeaderFiltering?: boolean;

  @OneWay() allowFiltering?: boolean;

  @OneWay() headerFilterProps?: DataGridHeaderFilter;

  @OneWay() headerFilterController!: { showHeaderFilterMenu: any };
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class HeaderPanelGroupFilter extends JSXComponent<HeaderPanelGroupFilterProps, 'index' | 'headerFilterController'>() {
  get groupColumn() {
    const {
      index,
      command,
      filterValues,
      allowHeaderFiltering,
      allowFiltering,
    } = this.props;
    return {
      index,
      command,
      filterValues,
      allowHeaderFiltering,
      allowFiltering,
    };
  }

  get visible(): boolean {
    return !!(!this.groupColumn.command
    && isHeaderFilteringAllow(this.groupColumn)
    && this.props.headerFilterProps?.visible);
  }

  get isHeaderFilterEmpty(): boolean {
    return !this.groupColumn.filterValues || !this.groupColumn.filterValues.length;
  }

  get filterState(): string {
    return this.isHeaderFilterEmpty ? 'filterEmpty' : 'filter';
  }

  changeFilter(event): void {
    // const { event } = e;
    event.stopPropagation();
    this.props.headerFilterController.showHeaderFilterMenu(this.groupColumn.index, true);
  }
}
