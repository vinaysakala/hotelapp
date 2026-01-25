import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  permissions: any = {};

  constructor(private permService: PermissionService) { }

  async ngOnInit() {
    this.permissions = await this.permService.getPermissions();
  }
}