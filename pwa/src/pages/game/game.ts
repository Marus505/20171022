import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/Rx";
//@IonicPage()
@Component({
    selector: 'page-game',
    templateUrl: 'game.html',
})
export class GamePage {
    public consoles: Array<any>;
    public input: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private http: Http) {
        this.consoles = [];
        this.input = {
            "cid": "",
            "title": ""
        }
    }
    ionViewDidEnter() {
        this.http.get("http://localhost:3000/consoles")
            .map(result => result.json())
            .subscribe(result => {
                for(let i = 0; i < result.length; i++) {
                    this.consoles.push(result[i]);
                }
            });
    }
    public save() {
        this.viewCtrl.dismiss(this.input);
    }
}