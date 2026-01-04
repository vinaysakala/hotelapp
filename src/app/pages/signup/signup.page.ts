import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage {
  signup = {
    username: "",
    name: '',
    email: '',
    password: ''
  }

  defaultsignup = JSON.parse(JSON.stringify(this.signup));

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: color,
      position: 'top',
      buttons: [
        {
          icon: 'close-outline', // Adds the "X" icon
          role: 'cancel',
          handler: () => {
            console.log('Toast dismissed');
          }
        }
      ]
    });
    await toast.present();
  }
  passwordType = 'password';
  passwordIcon = 'eye-outline';

  errormessage = {
    usernameReq: '',
    nameReq: '',
    emailReq: '',
    passwordReq: ''
  };
  deafultErrormessage = JSON.parse(JSON.stringify(this.errormessage));

  constructor(
    private auth: Auth,
    private router: Router,
    private toastCtrl: ToastController,
    private firestore: Firestore,
    private loadingCtrl: LoadingController
  ) { }

  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  onBlur(ctrl: string) {
    switch (ctrl) {
      case 'username':
        this.errormessage.usernameReq = this.signup.username.trim() === '' ? 'User Name is required' : '';
        break;
      case 'name':
        this.errormessage.nameReq = this.signup.name.trim() === '' ? 'Full Name is required' : '';
        break;
      case 'email':
        this.errormessage.emailReq = this.signup.email.trim() === '' ? 'Email is required' : '';
        break;
      case 'password':
        this.errormessage.passwordReq = this.signup.password.trim() === '' ? 'Password is required' : '';
        break;
    }
  }

  async onSignup() {
    this.onBlur('username');
    this.onBlur('name');
    this.onBlur('email');
    this.onBlur('password');

    if (!this.errormessage.nameReq && !this.errormessage.emailReq && !this.errormessage.passwordReq) {
      const loading = await this.loadingCtrl.create({
        message: 'Creating your account...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, this.signup.email, this.signup.password);
        const uid = userCredential.user.uid;
        const usernameId = this.signup.username.toLowerCase();

        await setDoc(doc(this.firestore, 'users', usernameId), {
          uid: uid,
          username: this.signup.username, // Keep original casing for display
          fullname: this.signup.name,
          email: this.signup.email,
          createdAt: new Date()
        });
        await loading.dismiss();
        await this.showToast('Account created successfully!', 'success');
        this.clearForm();
        this.router.navigate(['/login'], { replaceUrl: true });

      } catch (error: any) {
        await loading.dismiss();
        let msg = 'Registration failed. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
          msg = 'This email is already registered.';
        } else if (error.code === 'auth/invalid-email') {
          msg = 'The email address is not valid.';
        } else if (error.code === 'auth/weak-password') {
          msg = 'The password is too weak.';
        }
        this.showToast(msg, 'danger');
      }
    } else {
      this.showToast('provide mandatory Feilds', 'danger');
    }
  }

  clearForm() {
    this.signup = JSON.parse(JSON.stringify(this.defaultsignup));
    this.errormessage = JSON.parse(JSON.stringify(this.deafultErrormessage));
  }

}
