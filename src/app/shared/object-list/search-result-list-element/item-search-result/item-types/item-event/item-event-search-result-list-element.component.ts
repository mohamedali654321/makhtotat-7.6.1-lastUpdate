import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { hasValue } from 'src/app/shared/empty.util';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';

@listableObjectComponent('EventSearchResult', ViewMode.ListElement)
// @listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-item-event-search-result-list-element',
  styleUrls: ['./item-event-search-result-list-element.component.scss'],
  templateUrl: './item-event-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class EventSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
  relationShips;
  relationShipsCounter:number;
  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.linkService.resolveLink<Item>(this.dso, followLink('thumbnail')); //kware-edit
    this.linkService.resolveLink<Item>(this.dso, followLink('relationships')); 
    this.relationShips=[this.dso.metadata]
  //   console.log(this.dso)
  //   // console.log(this.dso.metadata['relation.isPublicationOfJournalIssue'] ? this.dso.metadata['relation.isPublicationOfJournalIssue'].length : 0 );
  // this.dso.relationships.subscribe(rel=>{console.log(rel.payload.page)})
  }

   // kware edit

    // replace comma ', or ;' to '،' if language  is Arabic
    convertComma(str: string): string{
      let newstr = '';
      if ((typeof window === 'object' && hasValue(window.localStorage)) && window.localStorage.getItem('selectedLangCode')  === 'ar'){
        let regx = /;|,/gi;
       newstr = str.replace(regx, '،');
       return newstr;

      } else {
        return str;
      }
    }
    // put comma ',' to '،' if language  is Arabic
    regxComma(): string{
      if ((typeof window === 'object' && hasValue(window.localStorage)) && window.localStorage.getItem('selectedLangCode')  === 'ar') {return '،';} else {return ',';}
    }
       // replace comma ';' to '؛' if language  is Arabic
     regxColon(): string{
      if ((typeof window === 'object' && hasValue(window.localStorage)) && window.localStorage.getItem('selectedLangCode')  === 'ar') {return '؛';} else {return ';';}
    }

    removeMarkdown(text: string):string{
      const mdRegx= text.replace(/__|\*|\#|\-|\!|(?:\[([^\]]*)\]\([^)]*\))/gm, '');
      return mdRegx;
         }
}

