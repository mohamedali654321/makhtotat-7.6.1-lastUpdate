import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { Version } from '../../core/shared/version.model';
import { RemoteData } from '../../core/data/remote-data';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { VersionHistory } from '../../core/shared/version-history.model';
import {
  getAllSucceededRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { map, mergeMap, startWith, switchMap, take, tap } from 'rxjs/operators';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { VersionHistoryDataService } from '../../core/data/version-history-data.service';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { DSpaceObjectDataService } from 'src/app/core/data/dspace-object-data.service';
import { ViewMode } from 'src/app/core/shared/view-mode.model';
import { hasValue } from '../empty.util';
import { VersionDataService } from 'src/app/core/data/version-data.service';

@Component({
  selector: 'ds-versions-counter',
  templateUrl: './versions-counter.component.html',
  styleUrls: ['./versions-counter.component.scss']
})
export class VersionsCounterComponent {

  @Input() item: Item;
  @Input() showViewModes = true; //kware-edit
  @Input() viewModeList: ViewMode[]; //kware-edit

      /**
   * The item's version
   */
      versionRD$: Observable<RemoteData<Version>>;

      /**
       * The item's full version history (remote data)
       */
      versionHistoryRD$: Observable<RemoteData<VersionHistory>>;
    
      /**
       * The item's full version history
       */
      versionHistory$: Observable<VersionHistory>;
    
      /**
       * The version history's list of versions
       */
      versionsRD$: BehaviorSubject<RemoteData<PaginatedList<Version>>> = new BehaviorSubject<RemoteData<PaginatedList<Version>>>(null);
  
    /**
     * The amount of versions to display per page
     */
    pageSize = 10;


    countLength = new BehaviorSubject<number>(0);
  
    /**
     * The page options to use for fetching the versions
     * Start at page 1 and always use the set page size
     */
    options = Object.assign(new PaginationComponentOptions(), {
      id: 'ivo',
      currentPage: 1,
      pageSize: this.pageSize
    });
  
    constructor(protected versionHistoryService: VersionHistoryDataService,
      private paginationService: PaginationService,
      protected dsoService: DSpaceObjectDataService,
      protected versionDataService:VersionDataService
  
  ) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (hasValue(this.item.version)){
      this.versionRD$ = this.item.version;
    
      this.versionRD$.pipe(getFirstSucceededRemoteDataPayload()).subscribe(data=>{
        this.versionHistory$= this.versionDataService.getHistoryFromVersion(data, true,true);
        this.versionHistory$.subscribe(history=>{
          this.versionHistoryService.getVersions(history.id).pipe(getFirstSucceededRemoteDataPayload()).subscribe(versions=>{
           this.countLength.next( versions.page.length -1)
          })
          
        })
        
        
        // this.versionHistoryService.getVersionHistoryFromVersion$(data.payload)
        // this.getAllVersions(this.versionHistoryService.getVersionHistoryFromVersion$(data.payload));

      })
      // this.getAllVersions(this.versionHistory$)
      
    }
    
  }

    /**
   * Get all versions for the given version history and store them in versionRD$
   * @param versionHistory$
   */
    getAllVersions(versionHistory$: Observable<VersionHistory>): void {
      const currentPagination = this.paginationService.getCurrentPagination(this.options.id, this.options);
      combineLatest([versionHistory$, currentPagination]).pipe(
        switchMap(([versionHistory, options]: [VersionHistory, PaginationComponentOptions]) => {
          return this.versionHistoryService.getVersions(versionHistory.id,
            new PaginatedSearchOptions({pagination: Object.assign({}, options, {currentPage: options.currentPage})}),
            false, true, followLink('item'), followLink('eperson'));
        }),
        getFirstCompletedRemoteData(),
      ).subscribe((res: RemoteData<PaginatedList<Version>>) => {
  
        this.versionsRD$.next(res);
  
      });
    }

}
