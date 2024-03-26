import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RelationshipDataService } from 'src/app/core/data/relationship-data.service';
import { FindListOptions } from 'src/app/core/data/find-list-options.model';
import { getFirstSucceededRemoteData, getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { ContentSourceSetSerializer } from 'src/app/core/shared/content-source-set-serializer';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { hasValue } from 'src/app/shared/empty.util';

@Component({
  selector: 'ds-tabbed-related-entities-search',
  templateUrl: './tabbed-related-entities-search.component.html'
})
/**
 * A component to show related items as search results, split into tabs by relationship-type
 * Related items can be facetted, or queried using an
 * optional search box.
 */
export class TabbedRelatedEntitiesSearchComponent implements OnInit {
  /**
   * The types of relationships to fetch items for
   * e.g. 'isAuthorOfPublication'
   */
  @Input() relationTypes: {
    label: string,
    filter: string,
    configuration?: string
  }[];

  /**
   * The item to render relationships for
   */
  @Input() item: Item;

  /**
   * Whether or not the search bar and title should be displayed (defaults to true)
   * @type {boolean}
   */
  @Input() searchEnabled = true;

  /**
   * The ratio of the sidebar's width compared to the search results (1-12) (defaults to 4)
   * @type {number}
   */
  @Input() sideBarWidth = 4;

  incrementBy = 5;
  // @Input() options = new FindListOptions();
  relationsCounter= new BehaviorSubject<number>(0);

  options = new FindListOptions();

  newRelationTypes: {
    label: string,
    filter: string,
    configuration?: string
  }[];

  newRelationships=new BehaviorSubject<any>([]);

  /**
   * The active tab
   */
  activeTab$: Observable<string>;

  constructor(
    protected relationshipService: RelationshipDataService,
    private route: ActivatedRoute,
              private router: Router) {
  }

  /**
   * If the url contains a "tab" query parameter, set this tab to be the active tab
   */
  ngOnInit(): void {
  //  this.newRelationTypes = this.relationTypes.filter((rlation=>{
  // return this.item.metadataAsList.filter((md)=>{
  //  return  md.key?.includes(`relation.is${rlation.filter.split('Of')[1]}Of`) && !md.key?.includes('latestForDiscovery')}).length > 5
    
  // }))


this.relationTypes.forEach((relationShip)=>{
  if((relationShip.label.includes('isPublicationOf') && this.getRelationsCounter('Publication') > 0) 
  || (relationShip.label.includes('isPersonOf') && this.getRelationsCounter('Person') > 0) ||
  (relationShip.label.includes('isOrgUnitOf') && ((this.getRelationsCounter('ArabicPublisher') + this.getRelationsCounter('Publisher') > 5)))
){
    this.newRelationships.next(this.newRelationships.getValue().concat([relationShip]))
  }
  this.getRelationshipsCounterByFilter(relationShip.label).pipe(getFirstSucceededRemoteDataPayload()).subscribe((data)=>{
    
   if((data && data.totalElements > 5) && (!(relationShip.label.includes('isPersonOf')) && !(relationShip.label.includes('isPublicationOf')) )){
   
    this.newRelationships.next(this.newRelationships.getValue().concat([relationShip]))
   }
  })
})

    this.activeTab$ = this.route.queryParams.pipe(
      map((params) => params.tab)
    );
  }

  getRelationshipsCounterByFilter(filterValue: any):Observable<RemoteData<PaginatedList<Item>>>{
   
  return  this.relationshipService.getRelatedItemsByLabel(this.item ,filterValue, Object.assign(this.options,
      { elementsPerPage: -1, currentPage: 1, fetchThumbnail: false }))
  }

  getRelationsCounter(label:string):any{
  return  this.item.metadataAsList.filter((md)=>{
      return  md.key?.includes(`relation.is${label}Of`) && !md.key?.includes('latestForDiscovery')}).length
       
  }


  updateUrl(event: any,filter: string) {
    if(hasValue(filter)){
     this.route.data.subscribe(res=>{
       res.breadcrumb.url
       window.history.replaceState({},'',`${res.breadcrumb.url}?tab=${filter}`);
       })
    }
 
     
   }

  /**
   * Add a "tab" query parameter to the URL when changing tabs
   * @param event
   */
  onTabChange(event) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tab: event.nextId
      },
      queryParamsHandling: 'merge',
    
    });
  }

}
