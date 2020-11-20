import {
  Fragment, JSXComponent, Component, ComponentBindings, OneWay, Template, Method,
} from 'devextreme-generator/component_declaration/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = (/* { }: HeaderPanelToolboxItem */) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment />
);

@ComponentBindings()
export class HeaderPanelToolboxItemProps {
  @OneWay() name!: string;

  @Template() template?: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class HeaderPanelToolboxItem extends JSXComponent<HeaderPanelToolboxItemProps, 'name'>() {
  @Method() getTemplate() {
    return this.props.template;
  }
}
