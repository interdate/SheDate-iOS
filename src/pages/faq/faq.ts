import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-faq',
    templateUrl: 'faq.html',
})
export class FaqPage {

    page: Array<{ name: string, faq: string }>;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public api: ApiQuery) {
        this.getPageData();
    }

    getPageData() {
        this.http.get(this.api.url + '/faq', this.api.header).subscribe(data => {
            this.page = data.json();
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FaqPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'FaqPage';
    }

}
