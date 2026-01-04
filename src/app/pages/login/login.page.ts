import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  login = {
    email: '',
    password: ''
  }
  defaultlogin = JSON.parse(JSON.stringify(this.login));
  errormessage = {
    emailReq: '',
    passwordReq: ''
  };
  deafultErrormessage = JSON.parse(JSON.stringify(this.errormessage));


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
  onBlur(ctrl: any) {
    switch (ctrl) {
      case 'email':
        if (this.login.email == '') {
          this.errormessage.emailReq = 'Email or username is required';
        } else {
          this.errormessage.emailReq = '';
        }
        break;
      case 'password':
        if (this.login.password == '') {
          this.errormessage.passwordReq = 'Password is required';
        } else {
          this.errormessage.passwordReq = '';
        }
        break;
    }
  }

  passwordType: string = 'password';
  passwordIcon: string = 'eye-outline';

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-off-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-outline';
    }
  }
  constructor(
    private auth: Auth,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: Firestore
  ) { }

  async onLogin() {
  const loading = await this.loadingCtrl.create({ message: 'Logging in...' });
  
  // Basic Validation
  if (!this.login.email || !this.login.password) {
    this.showToast('Please enter both email/username and password', 'warning');
    return;
  }

  await loading.present();

  let loginEmail = this.login.email.trim();

  try {
    if (!loginEmail.includes('@')) {
      const userData: any = await this.checkUser(loginEmail.toLowerCase());
      if (userData && userData.email) {
        loginEmail = userData.email; 
      } else {
        throw new Error('User not found'); 
      }
    }
    await signInWithEmailAndPassword(this.auth, loginEmail, this.login.password);
    await loading.dismiss();
    await this.showToast('Logged in successfully!', 'success');
    this.clearForm();
    this.router.navigate(['/tabs'], { replaceUrl: true });

  } catch (error: any) {
    await loading.dismiss();
    let errorMessage = 'Invalid username or password.';
    if (error.message === 'User not found') {
      errorMessage = 'Username does not exist.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    }

    const toast = await this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }
}

  clearForm() {
    this.login = JSON.parse(JSON.stringify(this.defaultlogin));
    this.errormessage = JSON.parse(JSON.stringify(this.deafultErrormessage));
  }


  async checkUser(username: string) {
    const userRef = doc(this.firestore, `users/${username}`);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data(); // Returns the { email, uid... } object
    } else {
      return null;
    }
  }
}
