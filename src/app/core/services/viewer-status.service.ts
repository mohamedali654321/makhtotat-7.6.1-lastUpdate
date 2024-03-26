import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewerStatusService {
  private startPageNumber = new BehaviorSubject('');
  private isViewerOpen = new BehaviorSubject(false);

  currentStartPageNumber = this.startPageNumber.asObservable();
  currentIsViewerOpen= this.isViewerOpen.asObservable()

  ngOnDestroy(): void {
    return null;
  
  }

  setStartPageNumber (startPageNumber: any) {
    this.startPageNumber.next(startPageNumber);
  }
  
  setViewerstatus (isViewerOpen: any) {
    this.isViewerOpen.next(isViewerOpen);
  }
}
