import { Component, Input } from '@angular/core';
import { ViewerStatusService } from 'src/app/core/services/viewer-status.service';
import { MediaViewerService } from '../kware-media-viewer/services/media-viewer.service';

@Component({
  selector: 'ds-viewer-button',
  templateUrl: './viewer-button.component.html',
  styleUrls: ['./viewer-button.component.scss']
})
export class ViewerButtonComponent {
  @Input() startPage:string;

  constructor(
    protected viewerStatusService:ViewerStatusService,
    protected viewerService: MediaViewerService,
    
    ) { }

    setViewerData(){
      this.viewerStatusService.setStartPageNumber(this.startPage);
      this.viewerStatusService.setViewerstatus(true);
      this.goToPart()

 
    }

    goToPart(){
     
      document.getElementById("browseFile").scrollIntoView({behavior: "smooth"})
      }

    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      this.viewerStatusService.setStartPageNumber("1");
      this.viewerStatusService.setViewerstatus(false);
      
    }

}
