import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
    /**
     * @docid dxCheckBoxOptions.activeStateEnabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxCheckBoxOptions.focusStateEnabled
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxCheckBoxOptions.hoverStateEnabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxCheckBoxOptions.name
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxCheckBoxOptions.text
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxCheckBoxOptions.value
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: boolean;
}
/**
 * @docid dxCheckBox
 * @isEditor
 * @inherits Editor
 * @module ui/check_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxCheckBox extends Editor {
    constructor(element: Element, options?: dxCheckBoxOptions)
    constructor(element: JQuery, options?: dxCheckBoxOptions)
}

declare global {
interface JQuery {
    dxCheckBox(): JQuery;
    dxCheckBox(options: "instance"): dxCheckBox;
    dxCheckBox(options: string): any;
    dxCheckBox(options: string, ...params: any[]): any;
    dxCheckBox(options: dxCheckBoxOptions): JQuery;
}
}
export type Options = dxCheckBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxCheckBoxOptions;