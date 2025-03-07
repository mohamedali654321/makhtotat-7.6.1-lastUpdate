import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { focusShadow } from '../../../../../shared/animations/focus';
import { ItemSearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { hasValue } from 'src/app/shared/empty.util'; // kware-edit

@listableObjectComponent('GroupSearchResult', ViewMode.GridElement)
@Component({
  selector: 'ds-group-search-result-grid-element',
  styleUrls: ['./group-search-result-grid-element.component.scss'],
  templateUrl: './group-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item search result of the type Organisation Unit
 */
export class GroupSearchResultGridElementComponent extends ItemSearchResultGridElementComponent {
    // kware-edit
    // put comma ',' to '،' if language  is Arabic
   regxComma(): string{
    if ((typeof window === 'object' && hasValue(window.localStorage)) && window.localStorage.getItem('selectedLangCode')  === 'ar') {return '،';} else {return ',';}
  }
  // kware-edit end
}
