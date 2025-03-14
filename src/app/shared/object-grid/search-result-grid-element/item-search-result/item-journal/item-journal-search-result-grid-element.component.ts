import { Component } from '@angular/core';
import { focusShadow } from '../../../../animations/focus';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultGridElementComponent } from '../../search-result-grid-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { getItemPageRoute } from '../../../../../item-page/item-page-routing-paths';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
// import { LinkService } from 'src/app/core/cache/builders/link.service';
import { LinkService } from '../../../../../core/cache/builders/link.service';
// import { LocaleService } from 'src/app/core/locale/locale.service';
import { LocaleService } from '../../../../../core/locale/locale.service';
// import { followLink } from 'src/app/shared/utils/follow-link-config.model';
import { followLink } from '../../../../utils/follow-link-config.model';

// import { hasValue } from 'app/shared/empty.util';
import { hasValue } from '../../../../../shared/empty.util';


@listableObjectComponent('JournalSearchResult', ViewMode.GridElement)
// @listableObjectComponent(ItemSearchResult, ViewMode.GridElement)
@Component({
  selector: 'ds-item-journal-search-result-grid-element',
  styleUrls: ['./item-journal-search-result-grid-element.component.scss'],
  templateUrl: './item-journal-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item search result of the type Organisation Unit
 */
export class ItemJournalSearchResultGridElementComponent extends  SearchResultGridElementComponent<ItemSearchResult, Item> {
  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  dsoTitle: string;


        //kware-edit
 keywords = [];  //subject
 title: string;  // title
 authors: any;  //authors
 abstract:any; //abstract

   //kware-edit check locale
   localeAr: boolean;
   localeEn: boolean;
   arabicLang: boolean;
   englishLang: boolean;

  constructor(
    public dsoNameService: DSONameService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    protected linkService: LinkService, //kware-edit
    public localeService: LocaleService, //kware-edit
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService ,linkService,localeService);
  }


  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.dsoTitle = this.dsoNameService.getName(this.dso);
    this.linkService.resolveLink<Item>(this.dso, followLink('thumbnail')); //kware-edit

         // this.keywords=this.dso.allMetadataValues('dc.subject').slice(0,3); //kwar-edit
         let  arabic = /[\u0600-\u06FF]/;
         let english = /[a-zA-Z]/;
         let arabicKeyswords = this.dso.allMetadataValues('dc.subject').filter(key=>arabic.test(key));
         let englishKeywords = this.dso.allMetadataValues('dc.subject').filter(key=>english.test(key));
       this.localeService.getCurrentLanguageCode() === 'ar' ? this.keywords = arabicKeyswords.slice(0,3) : this.keywords = englishKeywords.slice(0,3);


      // kware-edit replace title ith alternative-title of items based on langugae

      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode() === 'en';
      this.arabicLang = this.dso.firstMetadataValue('dc.language.iso') === 'Arabic | العربية';
      this.englishLang = this.dso.firstMetadataValue('dc.language.iso') === 'English | الإنجليزية';

       switch (true){
           case (this.localeAr && this.arabicLang):
              this.title = this.dso.firstMetadataValue('dc.title');
              break;
            case (this.localeAr && !this.arabicLang && !!this.dso.firstMetadataValue('dc.title.alternative')  ):
              this.title = this.dso.firstMetadataValue('dc.title.alternative');
              break;
            case (this.localeAr && !this.arabicLang  && !this.dso.firstMetadataValue('dc.title.alternative') ):
              this.title = this.dso.firstMetadataValue('dc.title');
              break;
            case (this.localeEn && this.englishLang) :
              this.title = this.dso.firstMetadataValue('dc.title');
              break;
             case (this.localeEn && !this.englishLang && !!this.dso.firstMetadataValue('dc.title.alternative')  ) :
                this.title = this.dso.firstMetadataValue('dc.title.alternative');
                break;
              case (this.localeEn && !this.englishLang && !this.dso.firstMetadataValue('dc.title.alternative') ) :
                this.title = this.dso.firstMetadataValue('dc.title');
                break;
       }
       //kware-edit end

     // kware-edit replace author ith alternative-author of items based on langugaee



     switch (true){
      case (this.localeAr && this.arabicLang):
        this.authors = this.dso.allMetadataValues(['dc.contributor.author', 'dc.creator']);
         break;
       case (this.localeAr && !this.arabicLang && this.dso.allMetadataValues(['dc.contributor.authoralternative']).length > 0   ):
       this.authors = this.dso.allMetadataValues(['dc.contributor.authoralternative',]);
         break;
       case (this.localeAr && !this.arabicLang  && this.dso.allMetadataValues(['dc.contributor.authoralternative']).length <= 0 ):
        this.authors = this.dso.allMetadataValues(['dc.contributor.author', 'dc.creator']);
         break;
       case (this.localeEn && this.englishLang) :
        this.authors = this.dso.allMetadataValues(['dc.contributor.author', 'dc.creator']);
         break;
        case (this.localeEn && !this.englishLang && this.dso.allMetadataValues(['dc.contributor.authoralternative']).length > 0  ) :
          this.authors = this.dso.allMetadataValues(['dc.contributor.authoralternative']);
           break;
         case (this.localeEn && !this.englishLang && this.dso.allMetadataValues(['dc.contributor.authoralternative']).length <= 0 ) :
          this.authors = this.dso.allMetadataValues(['dc.contributor.author', 'dc.creator']);
           break;
    }


    if(this.localeService.getCurrentLanguageCode() === 'ar' && this.dso.firstMetadataValue('dc.description.abstract') && this.dso.firstMetadataValue('dc.description.abstract').includes('|') === true )
        {
           this.abstract=this.dso.firstMetadataValue('dc.description.abstract').split('|')[1];
        }
        if(this.localeService.getCurrentLanguageCode() === 'en' && this.dso.firstMetadataValue('dc.description.abstract') && this.dso.firstMetadataValue('dc.description.abstract').includes('|') === true )
        {
           this.abstract=this.dso.firstMetadataValue('dc.description.abstract').split('|')[0];
        }
        if(this.dso.firstMetadataValue('dc.description.abstract') &&  this.dso.firstMetadataValue('dc.description.abstract').includes('|') === false  )
        {
           this.abstract=this.dso.firstMetadataValue('dc.description.abstract');
        }

    // kware-edit end
  }

  // replace comma ', or ;' to '،' if language  is Arabic
  convertComma(str: string): string{
    let newstr = '';
    if (this.localeService.getCurrentLanguageCode() === 'ar'){
      let regx = /;|,/gi;
     newstr = str.replace(regx, '،');
     return newstr;

    } else {
      return str;
    }
  }
  // replace comma ',' to '،' if language  is Arabic
  regxComma(): string{
    if (this.localeService.getCurrentLanguageCode() === 'ar') {return '،';} else {return ',';}
  }
     // replace comma ';' to '؛' if language  is Arabic
   regxColon(): string{
    if (this.localeService.getCurrentLanguageCode() === 'ar') {return '؛';} else {return ';';}
  }

  removeMarkdown(text: string):string{
    const mdRegx= text.replace(/__|\*|\#|\-|\!|(?:\[([^\]]*)\]\([^)]*\))/gm, '');
    return mdRegx;
       }

       translateDate():any{
        let date=new Date(this.dso.firstMetadataValue('dc.date.accessioned').split('T')[0]);
       if(date && this.localeService.getCurrentLanguageCode() === 'ar'){
         var months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
         "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
       ];
       var delDateString =date.getDate() + ' ' + months[date.getMonth()] + '، ' + date.getFullYear(); 
       
       return delDateString;
       }
       else return null;
       
         }
  // end kware edit
}
