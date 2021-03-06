import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {Http} from '@angular/http';
import {AdminMessagesPage} from "../admin-messages/admin-messages";

/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-inbox',
    templateUrl: 'inbox.html',
})
export class InboxPage {

    users: Array<{ id: string, message: string, mainImage: string, nickName: string, newMessagesNumber: string, faceWebPath: string, noPhoto: string }>;
    texts: { no_results: string };
    adminMessagesCount: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public loadingCtrl: LoadingController,
                public api: ApiQuery) {

        let loading = this.loadingCtrl.create({
            content: 'אנא המתיני...'
        });
        loading.present();

        this.http.get(this.api.url + '/user/contacts/perPage:200/page:1', this.api.setHeaders(true)).subscribe(data => {
            this.users = data.json().allChats;
            this.adminMessagesCount = data.json().adminMessagesCount;
            loading.dismiss();
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InboxPage');
    }

    adminMessagesPage() {
        this.navCtrl.push(AdminMessagesPage, {
            user: this.users[0]
        });
    }

    ionViewWillEnter() {
        this.api.pageName = 'InboxPage';
    }

    toDialogPage(user) {
        this.navCtrl.push('DialogPage', {user: user.user});
    }

}
