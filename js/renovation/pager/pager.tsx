import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import ResizableContainer from './resizable-container';
import PagerProps from './pager-props';
// import { getFormatter } from '../../localization/message';
import PagerContent from './pager-content';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  pageSizeChange,
  pageIndexChange,
  props,
}: Pager) => (
  <ResizableContainer
    pageSizeChange={pageSizeChange}
    pageIndexChange={pageIndexChange}
    content={PagerContent}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...props as PagerProps}
  />
);

// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Pager extends JSXComponent<PagerProps> {
  pageIndexChange(newPageIndex: number): void {
    this.props.pageIndex = newPageIndex;
  }

  pageSizeChange(newPageSize: number): void {
    this.props.pageSize = newPageSize;
  }
}
