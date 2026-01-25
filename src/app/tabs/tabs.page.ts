import { Component,OnInit } from '@angular/core';
import { PermissionService } from '../services/permission';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {
  permissions: any = {};

  constructor(private permService: PermissionService) {}

  async ngOnInit() {
    this.permissions = await this.permService.getPermissions();
  }
}
