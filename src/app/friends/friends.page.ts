import { Component } from '@angular/core';

import { NavController, ModalController, AlertController } from '@ionic/angular';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage {

	filter: any;

	friends: Array<any>;
	received: Array<any>;
	send: Array<any>;
	users: Array<any>;

	loader: boolean = false;

	me: boolean = false;
	alrdFriend: boolean = false;
	alrdSend: boolean = false;
	alrdReceived: boolean = false;

  constructor(public navCtrl: NavController,
							private modalCtrl: ModalController,
							private alertCtrl: AlertController,
							private data: DataService) {
		window.onclick = function(event) {
			var modal = document.getElementById('addFriendModal');
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}
  }

	async ionViewWillEnter() {
		await this.getData()
		.then((data) => {
		})
		.catch((error) => {
			console.log(error);
		})
	}

	getData() {
		return new Promise(async (resolve, reject) => {
			await Promise.all([this.getReceived(), this.getSend(), this.getFriends()])
			.then((data) => {
				resolve();
			})
			.catch((error) => {
				reject(error);
			})
		})
	}

	async doRefresh(refresher) {
		await this.getData()
		.then((data) => {
			refresher.target.complete();
		})
		.catch((error) => {
			console.log(error);
		})
	}

	closeModal() {
		var modal = document.getElementById('addFriendModal');
		modal.style.display = "none";
	}

	getReceived() {
		return new Promise((resolve, reject) => {
			this.data.getReceived(localStorage.getItem('id'))
					.subscribe (
						success => {
							this.received = success.body;
							resolve();
						},
						error => {
							reject(error);
						}
					)
		})
	}

	getSend() {
		return new Promise((resolve, reject) => {
			this.data.getSend(localStorage.getItem('id'))
								.subscribe (
									success => {
										this.send = success.body;
										resolve();
									},
									error => {
										reject(error);
									}
								)
		})
	}

	getFriends() {
		return new Promise((resolve, reject) => {
			this.data.getFriends(localStorage.getItem('id'))
								.subscribe(
									success => {
										this.friends = success.body;
										resolve();
									},
									error => {
										reject(error);
									}
								)
		})
	}

	AddFriend() {
		var modal = document.getElementById('addFriendModal');
		modal.style.display = "block";
		this.users = [];
	}

	resetBoolean() {
		this.me = false;
		this.alrdFriend = false;
		this.alrdSend = false;
		this.alrdReceived = false;
	}

	searchByPseudo(value) {
		if (!value || value.trim().length === 0)
			return;
		this.loader = true;
		this.resetBoolean();
		this.data.getPseudo(value)
							.subscribe(
								success => {
									this.users = success.body;
									this.itsMe();
									this.itsFriend();
									this.itsSend();
									this.itsReceived();
									this.loader = false;
								},
								error => {
									console.log(error);
								}
							)
	}

	itsMe() {
		if (this.users && this.users[0]) {
			if (this.users[0].id == localStorage.getItem('id'))
				this.me = true;
		}
	}

	itsFriend() {
		if (this.users && this.users[0]) {
			let id = this.users[0].id;
			var found = this.friends.find(function (element){
				return element.friend_id.id === id;
			});
			if (found)
				this.alrdFriend = true;
		}
	}

	itsSend() {
		if (this.users && this.users[0]) {
			let id = this.users[0].id;
			var found = this.send.find(function (element){
				return element.recipient_id.id === id;
			});
			if (found)
				this.alrdSend = true;
		}
	}

	itsReceived() {
		if (this.users && this.users[0]) {
			let id = this.users[0].id;
			var found = this.received.find(function (element){
				return element.user_id.id === id;
			});
			if (found)
				this.alrdReceived = true;
		}
	}

	sendFriendRequest(id, index) {
		this.data.postFriendsRequests(id, localStorage.getItem('id'))
							.subscribe(
								success => {
									this.send.push(success.body);
									var modal = document.getElementById('addFriendModal');
									modal.style.display = "none";
								},
								error => {
									console.log(error);
								}
							)
	}

	validateRequestFromModal(request) {
		var found = this.received.find(function (element){
			return element.user_id.id === request.id;
		});
		let index = this.received.indexOf(found);
		this.validateRequest(this.received[index].id, request.id, index);
		var modal = document.getElementById('addFriendModal');
		modal.style.display = "none";
	}

	validateRequest(id, friend_id, index) {
		this.data.postFriends(localStorage.getItem('id'), friend_id)
							.subscribe(
								success => {
									this.data.postFriends(friend_id, localStorage.getItem('id'))
									.subscribe(
										success => {
											this.deleteRequest(id, index, 'r');
											this.friends.push(success.body);
										},
										error => {
											console.log(error);
											alert(error);
										}
									)
								},
								error => {
									console.log(error);
									alert(error);
								}
							)
	}

	deleteRequest(id, index, arr) {
		this.data.destroyRequests(id)
							.subscribe(
								success => {
									if (arr === 's')
										this.send.splice(index, 1);
									else if (arr === 'r')
										this.received.splice(index, 1);
								},
								error => {
									console.log(error);
									alert(error);
								}
							)
	}

	async removeFriend(friend, index) {
		const alert = await this.alertCtrl.create({
			header: "Remove " + friend.friend_id.firstname + " " + friend.friend_id.lastname + " from this list ?",
			subHeader: "He will not receive a notification",
			buttons: [{
				text: 'Cancel',
				role: 'cancel'
			},
			{
				text: 'Continue',
				handler: () => this.deleteFriend(friend.id, index)
			}]
		});
		await alert.present();
	}

	deleteFriend(id, index) {
		this.data.destroyFriends(id)
							.subscribe(
								success => {
									this.friends.splice(index, 1);
								},
								error => {
									console.log(error);
									alert(error);
								}
							)
	}

}
