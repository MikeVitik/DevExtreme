import {
  Fragment, JSXComponent, Component, ComponentBindings, Nested,
} from 'devextreme-generator/component_declaration/common';
import { ToolboxItem } from './toolbox_item';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  beforeItems, afterItems,
}: Toolbox) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    <div style={{ float: 'left' }}>
      {(beforeItems.map(({ name, template: Template }) => (Template ? (
        <Template key={name} name={name} />
      ) : <span key={name}>{name}</span>))
    )}
    </div>
    <div style={{ float: 'right' }}>
      {(afterItems.map(({ name, template: Template }) => (Template ? (
        <Template key={name} name={name} />
      ) : <span key={name}>{name}</span>))
    )}
    </div>
  </Fragment>
);

@ComponentBindings()
export class ToolboxProps {
  @Nested() items?: ToolboxItem[];
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class Toolbox extends JSXComponent<ToolboxProps>() {
  get beforeItems() {
    return this.props.items?.filter(({ location, visible }) => visible && location === 'before') || [];
  }

  get afterItems() {
    return this.props.items?.filter(({ location, visible }) => visible && location === 'after') || [];
  }
}
