import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FaqComponent} from '../faq/faq.component';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private isMobile: boolean;

  constructor(private matDialog: MatDialog, private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
  }

  openFAQ() {
    this.matDialog.open(FaqComponent, {
      width: this.isMobile ? '370px' : '700px'
    });
  }

}
