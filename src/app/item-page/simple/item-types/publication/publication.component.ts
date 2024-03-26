import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemComponent } from '../shared/item.component';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { Item } from 'src/app/core/shared/item.model';
import { BehaviorSubject ,Subscription,Observable, of as observableOf, map, catchError } from 'rxjs';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { hasValue } from 'src/app/shared/empty.util';
import { getItemPageRoute } from 'src/app/item-page/item-page-routing-paths';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';
import { AccessStatusObject } from 'src/app/shared/object-collection/shared/badges/access-status-badge/access-status.model';
/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent {

  groupItem : Observable<DSpaceObject>
startPage:string ='1';
endPage;
accessStatus$: Observable<string>;

  accessStatusConfigs={
    'access-status.unknown.listelement.badge':{ icon: 'fa-solid fa-question' , style:'background-color: #767676 !important;' },
    'access-status.restricted.listelement.badge':{ icon: 'fa-solid fa-ban' , style:'background-color: #d33b36 !important;' },
    'access-status.open.access.listelement.badge':{ icon: 'fa-solid fa-unlock' , style:'background-color: #3a833a !important;' },
    'access-status.metadata.only.listelement.badge':{ icon: 'fa-solid fa-file-invoice' , style:'background-color: #2f6fa7  !important;' },
    'access-status.embargo.listelement.badge':{ icon: 'fa-regular fa-clock' , style:'background-color: #eb9419 !important;' },
  }
  public subs: Subscription[] = [];
  ngOnInit(): void {

    this.linkService.resolveLink<Item>(this.object, followLink('accessStatus')); //kware-edit

    const item = this.object as Item;
    if (item.accessStatus == null) {
      // In case the access status has not been loaded, do it individually.
      item.accessStatus = this.accessStatusDataService.findAccessStatusFor(item);
    }
    this.accessStatus$ = item.accessStatus.pipe(
      map((accessStatusRD) => {
        if (accessStatusRD.statusCode !== 401 && hasValue(accessStatusRD.payload)) {
          return accessStatusRD.payload;
        } else {
          return [];
        }
      }),
      map((accessStatus: AccessStatusObject) => hasValue(accessStatus.status) ? accessStatus.status : 'unknown'),
      map((status: string) => `access-status.${status.toLowerCase()}.listelement.badge`),
      catchError(() => observableOf('access-status.unknown.listelement.badge'))
    );




   if(hasValue(this.object.firstMetadataValue('relation.isGroupOfPublication'))){
    this.groupItem= this.dsoService.findById(this.object.firstMetadataValue('relation.isGroupOfPublication')).pipe(getFirstSucceededRemoteDataPayload());
   if(hasValue(this.object.firstMetadataValue('dc.format.pagenumber')) ){
    this.startPage = this.object.firstMetadataValue('dc.format.pagenumber') ;

        }    else{
          this.startPage='1';
        }
   }
 


  }
  getItemPageRoute(object :any) :any{
    return getItemPageRoute(object)+ '/full';
   }
}
