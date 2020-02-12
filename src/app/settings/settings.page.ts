import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { NavController, LoadingController, AlertController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

	private user: FormGroup;

	password: any = '';
	password_confirmation: any = '';
	passwordIcon: any = ["eye-off", "eye-off"];

	alrd_use: boolean = false;
	request: boolean = false;

  constructor(private formBuilder: FormBuilder,
							private navCtrl: NavController,
							private alertCtrl: AlertController,
							private loadingCtrl: LoadingController,
							private auth: AuthService,
							private data: DataService) { }

	ngOnInit() {
		this.getMe();
	}

	updateForm(infos) {
		this.user = this.formBuilder.group({
			id: [infos.id],
			email: [infos.email, Validators.compose([Validators.email, Validators.required])],
			firstname: [infos.firstname, Validators.compose([Validators.pattern(/^([a-zA-Z-]{2,50})$/), Validators.required])],
			lastname: [infos.lastname, Validators.compose([Validators.pattern(/^([a-zA-Z-]{2,50})$/), Validators.required])],
			pseudo: [infos.pseudo, Validators.compose([Validators.pattern(/^(([0-9_.-]*[a-z]){4,}[0-9_.-]*)$/), Validators.required])],
		});
	}

	getMe() {
		this.data.getUser(localStorage.getItem('client_id'))
							.subscribe(
								success => {
									this.updateForm(success.body);
								},
								error => {
									console.log(error);
									alert(error);
								}
							)
	}

	putUser() {
		this.data.putUser(this.user.value)
							.subscribe(
								success => {
									this.updateForm(success.body);
									this.putInfosSuccess("General Account Settings has been successfully updated");
								},
								error => {
									console.log(error);
									alert(error);
								}
							)
	}

	putPassword() {
		this.auth.putPassword(this.password, this.password_confirmation)
							.subscribe(
								success => {
									this.putInfosSuccess("Password has successfully changed");
									console.log(success.body);
								},
								error => {
									console.log(error);
									alert(error);
								}
							)
	}

	checkPseudo() {
		this.request = true;
		this.data.getPseudo(this.user.value.pseudo)
							.subscribe(
								success => {
									if (success.body.length != 0 && success.body[0].id != this.user.value.id)
										this.alrd_use = true;
									else
										this.alrd_use = false;
									this.request = false;
								},
								error => {
									console.log(error);
								}
							)
	}

	async putInfosSuccess(message) {
		const alert = await this.alertCtrl.create({
			header: message,
			buttons: [{
				text: 'Ok',
				role: 'cancel'
			}]
		});
		await alert.present();
	}

	validPassword() {
		if (this.password_confirmation.trim().length < 4)
			return false;
		else if (this.password_confirmation.trim() != this.password.trim())
			return false;
		return true;
	}

	viewPass(field, index) {
		var passLog = document.getElementById(field);
		if (passLog.attributes[4].value === "text") {
			passLog.setAttribute('type', 'password');
			this.passwordIcon[index] = "eye-off";
		} else if (passLog.attributes[4].value === "password") {
			passLog.setAttribute('type', 'text');
			this.passwordIcon[index] = "eye"
		}
	}

}
