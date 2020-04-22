import { Component, ComponentBindings, JSXComponent, OneWay, TwoWay } from 'devextreme-generator/component_declaration/common';
import InfoText from './info';
import PageIndexSelector, { PageIndexSelectorProps } from './page-index-selector';
import PageSizeSelector, { PageSizeSelectorProps } from './page-size-selector';

// import { getFormatter } from '../../localization/message';

const PAGER_CLASS = 'dx-pager';
const PAGER_PAGES_CLASS = 'dx-pages';
export const viewFunction = ({ pageSizeSelectorProps, pageIndexSelectorProps, props }: Pager) => {
    return (<div className={PAGER_CLASS}>
        <PageSizeSelector {...pageSizeSelectorProps} />
        <div className={PAGER_PAGES_CLASS}>
            <InfoText {...props} />
            <PageIndexSelector {...pageIndexSelectorProps} />
        </div>
    </div>);
};

@ComponentBindings()
export class PagerProps {
    // TODO messageLocalization.getFormatter('dxPager-infoText'),
    @OneWay() infoTextMessageTemplate ? = 'Page {0} of {1} ({2} items)';
    @OneWay() lightModeEnabled ? = false;
    @OneWay() maxPagesCount ? = 10;
    @OneWay() pageCount ? = 10;
    // visible: true,
    // pagesNavigatorVisible: 'auto',
    @TwoWay() pageIndex ? = 0;
    // TODO messageLocalization.getFormatter('dxPager-pagesCountText');
    @OneWay() pagesCountText ? = 'Of';
    @TwoWay() pageSize ? = 5;    // showPageSizes: true,
    @OneWay() pageSizes ? = [5, 10];
    @OneWay() rtlEnabled ? = false;
    @OneWay() showNavigationButtons ? = false;
    @OneWay() totalCount ? = 0;
    // hasKnownLastPage: true,
    // showInfo: false,
    // messageLocalization.getFormatter('dxPager-infoText'),
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class Pager extends JSXComponent<PagerProps> {
    private pageSizeChanged(newPageSize: number) {
        this.props.pageSize = newPageSize;
    }
    get InfoText() {
        const { pageCount } = this.props;
        return `Page count:${pageCount}`;
    }
    get pageSizeSelectorProps(): PageSizeSelectorProps {
        const pageSize = this.props.pageSize;
        return {
            isLargeDisplayMode: !this.props.lightModeEnabled,
            ...this.props as any,
            pageSize,
            pageSizeChanged: this.pageSizeChanged,
        };
    }
    get pageIndexSelectorProps(): PageIndexSelectorProps {
        return {
            isLargeDisplayMode: !this.props.lightModeEnabled,
            ...this.props as any,
        };
    }
}
