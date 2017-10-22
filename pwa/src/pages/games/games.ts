import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/Rx";
import { GamePage } from "../game/game";
@Component({
    selector: 'page-games',
    templateUrl: 'games.html'
})
export class GamesPage {
    public games: Array<any>;
    public constructor(public navCtrl: NavController, private http: Http, private modalCtrl: ModalController) {
        this.games = [];
    }
    public ionViewDidEnter() {
        this.http.get("http://localhost:3000/games")
            .map(result => result.json())
            .subscribe(result => {
                this.games = result;
            });
    }
    public create() {
        let gameModal = this.modalCtrl.create(GamePage);
        gameModal.onDidDismiss(data => {
            let headers = new Headers({ "Content-Type": "application/json" });
            let options = new RequestOptions({ headers: headers });
            this.http.post("http://localhost:3000/game", JSON.stringify(data), options)
                .subscribe(result => {
                    this.games.push({ "game_title": data.title, "console_title": ""});
                });
        });
        gameModal.present();
    }
}