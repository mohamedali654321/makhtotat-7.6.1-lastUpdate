import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemComponent } from '../../../../item-page/simple/item-types/shared/item.component';
import { getItemPageRoute } from 'src/app/item-page/item-page-routing-paths';
@listableObjectComponent('Group', ViewMode.StandalonePage)
@Component({
  selector: 'ds-group',
  styleUrls: ['./group.component.scss'],
  templateUrl: './group.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Organisation Unit
 */
export class GroupComponent extends ItemComponent {

  relatedItems;


  getRelatedItems($event: any){
    this.relatedItems=$event;    
  }

  ngOnInit(): void {
    
  }

  getItemPageRoute(object :any) :any{
    return getItemPageRoute(object)+ '/full';
   }
}
