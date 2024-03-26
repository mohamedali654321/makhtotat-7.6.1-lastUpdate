import { Component } from '@angular/core';
import { focusShadow } from '../../../../animations/focus';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../../core/shared/item.model';

@listableObjectComponent('Group', ViewMode.GridElement)
// @listableObjectComponent(Item, ViewMode.GridElement)
@Component({
  selector: 'ds-group-grid-element',
  styleUrls: ['./group-grid-element.component.scss'],
  templateUrl: './group-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item of the type Publication
 */
export class GroupGridElementComponent extends AbstractListableElementComponent<Item> {
}
