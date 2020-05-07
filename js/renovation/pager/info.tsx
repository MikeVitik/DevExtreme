import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { formatNumber } from '../../localization';
import { format } from '../../core/utils/string';

export const PAGER_INFO_CLASS = 'dx-info';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ Text }: InfoText) => (
  <div className={PAGER_INFO_CLASS}>{Text}</div>
);

@ComponentBindings()
export class InfoTextProps {
  @OneWay() infoTextMessageTemplate?: string;

  @OneWay() pageCount?: number = 10;

  @OneWay() pageIndex ? = 0;

  @OneWay() totalCount ? = 0;
}

// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class InfoText extends JSXComponent<InfoTextProps> {
  get Text(): string {
    const {
      infoTextMessageTemplate, pageIndex, pageCount, totalCount,
    } = this.props as Required<InfoTextProps>;
    return format(infoTextMessageTemplate,
      formatNumber(pageIndex + 1, ''),
      formatNumber(pageCount, ''),
      formatNumber(totalCount, ''));
  }
}
