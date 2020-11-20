import {
  Fragment, OneWay, ComponentBindings, Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import { DataGridEditing } from '../../ui/data_grid/props';
import { Button, ButtonProps } from '../../ui/button';
import { HeaderPanelToolboxItem } from './header_panel_toolbox_item';

export const viewFunction = ({
  items,
}: EditingHeaderPanelItems): any => (
  <Fragment>
    {items.map(({ name, templateProps }) => (
      <HeaderPanelToolboxItem
        name={name}
        template={
        // eslint-disable-next-line react/jsx-props-no-spreading
          <Button {...templateProps} />
    }
      />
    ))}
  </Fragment>
);

@ComponentBindings()
export class EditingHeaderPanelItemsProps {
  @OneWay() editingOptions?: DataGridEditing;

  @OneWay() editingController!: { prepareEditButtons: (boolean) => any };
}

const EDIT_MODE_BATCH = 'batch';

@Component({ defaultOptionRules: null, view: viewFunction })
export class EditingHeaderPanelItems extends JSXComponent<EditingHeaderPanelItemsProps, 'editingController'>() {
  get visible(): boolean {
    const { editingOptions } = this.props;
    return !!(editingOptions
      && (editingOptions.allowAdding
        || ((editingOptions.allowUpdating || editingOptions.allowDeleting)
            && editingOptions.mode === EDIT_MODE_BATCH))
    );
  }

  get items(): {name: string; templateProps: ButtonProps }[] {
    if (this.visible) {
      return this.props.editingController
        .prepareEditButtons(this)
        .map((item) => ({ ...item, props: item.options, templateType: Button }));
    }
    return [];
  }
}
