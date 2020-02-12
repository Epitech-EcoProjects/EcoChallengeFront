import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Platform, ModalController, AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	private log: FormGroup;

	config: number = 0;
	passwordIcon: any = ["eye-off", "eye-off", "eye-off"];

  constructor(private alertCtrl: AlertController,
							private loadingCtrl: LoadingController,
							private formBuilder: FormBuilder,
							private auth: AuthService
							) { }

  ngOnInit() {
		this.createForm();
  }

	createForm() {
		this.log = this.formBuilder.group({
			email: ['axel.vandenabeele@gmail.com', Validators.compose([Validators.email, Validators.required])],
			password: ['password', Validators.compose([Validators.minLength(4), Validators.required])],
			password_confirmation: [''],
		});
	}

	showForm(value) {
		setTimeout(() => {
			var input = document.getElementById('inputLogin');
			input.className = 'inputsslidein post-title-form';
		}, 10);
		this.config = value;
	}

	viewPass(field, index) {
		var passLog = document.getElementById(field);
		if (passLog.attributes[5].value === "text") {
			passLog.setAttribute('type', 'password');
			this.passwordIcon[index] = "eye-off";
		} else if (passLog.attributes[5].value === "password") {
			passLog.setAttribute('type', 'text');
			this.passwordIcon[index] = "eye"
		}
	}

	validPassword() {
		if (this.log.value.password_confirmation.trim().length < 4)
			return false;
		else if (this.log.value.password_confirmation.trim() != this.log.value.password.trim())
			return false;
		return true;
	}

	register() {
		this.auth.createAccount(this.log.value)
							.subscribe(
								success => {
									console.log("registered !");
								},
								error => {
									alert("error");
								}
							)
	}

	login() {
		this.auth.login(this.log.value)
							.subscribe(
								success => {
									console.log("logged in !");
								},
								error => {
									alert("error");
								}
							)
	}

}
