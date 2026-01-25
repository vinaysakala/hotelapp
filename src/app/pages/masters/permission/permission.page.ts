import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-permission',
  templateUrl: './permission.page.html',
  styleUrls: ['./permission.page.scss'],
  standalone:false
})
export class PermissionPage implements OnInit {
  roleId: any;
  roleData: any = {};

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    this.roleId = this.route.snapshot.paramMap.get('id');
    const snap = await getDoc(doc(this.firestore, `roles/${this.roleId}`));
    this.roleData = snap.data();
  }

  async update(field: string, event: any) {
    await updateDoc(doc(this.firestore, `roles/${this.roleId}`), { [field]: event.detail.checked });
  }
}
