import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/Rx";
@Component({
  selector: 'page-consoles',
  templateUrl: 'consoles.html'
})
export class ConsolesPage {
    public consoles: Array<any>;
    public constructor(public navCtrl: NavController, private http: Http, private alertCtrl: AlertController) {
        this.consoles = [];
    }
    public ionViewDidEnter() {
        this.http.get("http://localhost:3000/consoles")
            .map(result => result.json())
            .subscribe(result => {
                this.consoles = result;
            });
    }
    public create() {
        let alert = this.alertCtrl.create({
            title: 'Add Console',
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Title'
                },
                {
                    name: 'year',
                    placeholder: 'Year'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        let headers = new Headers({ "Content-Type": "application/json" });
                        let options = new RequestOptions({ headers: headers });
                        this.http.post("http://localhost:3000/console", JSON.stringify(data), options)
                            .subscribe(result => {
                                this.consoles.push(data);
                            }, error => {});
                    }
                }
            ]
        });
        alert.present();
    }
}