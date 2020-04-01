import { Component, OnInit } from '@angular/core';

import { ToastController } from '@ionic/angular';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

	favorites: Array<any>;
	finisheds: Array<any>;

	selected: number = null;

  constructor(	private toastController: ToastController,
								private data: DataService) { }

	ngOnInit() {
		this.getFavorites();
	}

	getFavorites() {
		this.data.getFavorite()
							.subscribe(
								success => {
									this.favorites = success.body.filter(x => !x.state);
									this.finisheds = success.body.filter(x => x.state);
								},
								error => {
								}
							)
	}

	validateFavorites(favorite) {
		this.xpAnimation(favorite.challenge_id.xp);
		this.data.putFavorite(favorite.id)
							.subscribe(
								success => {
									this.favorites.splice(this.favorites.indexOf(favorite), 1);
									this.finisheds.splice(0, 0, favorite);
									this.selected = null;
									this.presentValidatedToast();
								},
								error => {
								}
							)
	}

	removeFavorites(favorite) {
		this.data.destroyFavorite(favorite.id)
							.subscribe(
								success => {
									this.favorites.splice(this.favorites.indexOf(favorite), 1);
									this.selected = null;
									this.presentRemovedToast();
								},
								error => {
								}
							)
	}

	xpAnimation(number) {
		document.getElementById("xp-container").style["display"] = "flex";
		document.getElementById("xp-label").innerText = "+ " + number + "xp";
	}

	xpAnimationClean() {
		let xpContainer = document.getElementById("xp-container");
		xpContainer.style["display"] = "none";
	}

	async presentRemovedToast() {
		const toast = await this.toastController.create({
			message: 'Challenge removed',
			duration: 1000,
			color: 'light',
		});
		toast.present();
	}

	async presentValidatedToast() {
		const toast = await this.toastController.create({
			message: 'Challenge validated',
			duration: 1000,
			color: 'light',
		});
		toast.present();
	}

}
