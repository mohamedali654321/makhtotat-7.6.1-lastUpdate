import { Component } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../../core/shared/item.model';

@listableObjectComponent('Series', ViewMode.ListElement)
// @listableObjectComponent(Item, ViewMode.ListElement)
@Component({
  selector: 'ds-series-list-element',
  styleUrls: ['./series-list-element.component.scss'],
  templateUrl: './series-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Publication
 */
export class SeriesListElementComponent extends AbstractListableElementComponent<Item> {
}
