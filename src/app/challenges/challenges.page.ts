import { Component, OnInit } from '@angular/core';

import { AlertController, ToastController } from '@ionic/angular';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.page.html',
  styleUrls: ['./challenges.page.scss'],
})
export class ChallengesPage implements OnInit {

	challenges: Array<any>;

	selected: number = null;

  constructor(	private alertCtrl: AlertController,
								private toastController: ToastController,
								private data: DataService) { }

	ngOnInit() {
		this.getChallenges();
	}

	getChallenges() {
		this.data.getChallenges()
							.subscribe(
								success => {
									this.challenges = success.body;
								},
								error => {
									this.displayErrorMessage(error);
								}
							)
	}

	addToFavorites(challenge) {
		this.data.postFavorite(challenge.id)
							.subscribe(
								success => {
									this.challenges.splice(this.challenges.indexOf(challenge), 1);
									this.selected = null;
									this.presentToast();
								},
								error => {
									this.displayErrorMessage(error);
								}
							)
	}

	async presentToast() {
    const toast = await this.toastController.create({
      message: 'Challenge accepted',
      duration: 1000,
			color: 'light',
    });
    toast.present();
  }

	async displayErrorMessage(message) {
		console.log(message);
		const alert = await this.alertCtrl.create({
			header: 'Erreur',
			message: 'Une erreur est survenue, merci de réessayer ultérieurement',
			buttons: ['ok']
		});
		return await alert.present();
	}
}
