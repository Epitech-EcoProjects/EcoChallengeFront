import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class DataService {

	headers: Headers;

  constructor (private http:Http) {
		this.setHeaders();
	}

	setHeaders() {
		this.headers = new Headers(
			{
				'Content-Type': 'application/json',
				'access_token': localStorage.getItem('access_token'),
				'client': localStorage.getItem('client'),
				'uid': localStorage.getItem('uid'),
				'expiry': localStorage.getItem('expiry'),
				'token-type': localStorage.getItem('token-type'),
			}
		);
	}

	private baseURL = 'https://prod-betwfriends-api.herokuapp.com/api/v1/';
	// private baseURL = 'http://localhost:3000/api/v1/';

	/* Users */

	getUser(id) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.get(this.baseURL + 'users/' + id, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	getPseudo(pseudo) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.get(this.baseURL + 'users?pseudo=' + pseudo, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	putUser(user) {
		let body = JSON.stringify({ user: user })
		let options = new RequestOptions({ headers: this.headers });
		return this.http.put(this.baseURL + 'users/' + user.id, body, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	/* Friends */

	getFriends(id) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.get(this.baseURL + 'friends?user_id=' + id, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	getReceived(id) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.get(this.baseURL + 'friends_requests?recipient_id=' + id, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	getSend(id) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.get(this.baseURL + 'friends_requests?user_id=' + id, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	postFriends(friend_id, user_id) {
		let body = JSON.stringify({ user_id: user_id, friend_id: friend_id })
		let options = new RequestOptions({ headers: this.headers });
		return this.http.post(this.baseURL + 'friends', body, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	postFriendsRequests(recipient_id, sender_id) {
		let body = JSON.stringify({ user_id: sender_id, recipient_id: recipient_id })
		let options = new RequestOptions({ headers: this.headers });
		return this.http.post(this.baseURL + 'friends_requests', body, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	destroyRequests(id) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.delete(this.baseURL + 'friends_requests/' + id, options)
										.map(this.extractData)
										.catch(this.handleError);
	}

	destroyFriends(id) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.delete(this.baseURL + 'friends/' + id, options)
										.map(this.extractData)
										.catch(this.handleError);
	}

	/* Bets */

	getBets(id) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.get(this.baseURL + 'bets?user_id=' + id, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	postBets(bet) {
		let body = JSON.stringify({ bet })
		let options = new RequestOptions({ headers: this.headers });
		return this.http.post(this.baseURL + 'bets', body, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	postParticipants(bet_id, user_id) {
		let body = JSON.stringify({ bet_id: bet_id, user_id: user_id })
		let options = new RequestOptions({ headers: this.headers });
		return this.http.post(this.baseURL + 'participants', body, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	putParticipants(id, state) {
		let body = JSON.stringify({ state: state })
		let options = new RequestOptions({ headers: this.headers });
		return this.http.put(this.baseURL + 'participants/' + id, body, options)
		.map(this.extractData)
		.catch(this.handleError);
	}

	/* Handle response */

	private extractData(res: Response) {
		let headers = res.headers
		let body = res.json();
		return {body: body, headers: headers} || { };
	}

	private handleError (error: any) {
		let errMsg = (error.message) ? error.message :
		error._body ? `${error._body}` : 'Server error';
		return Observable.throw(errMsg);
	}

}
