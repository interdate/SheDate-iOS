import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
import {HomePage} from "../home/home";
import {Page} from "../page/page";

/*
 Generated class for the Subscription page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-subscription',
    templateUrl: 'subscription.html',
    providers: [InAppPurchase]
})
export class SubscriptionPage {

    public products: Array<{ productId: any, title: any, price: any, description: any }>;
    faq: Array<{ q: string, a: string }>;
    hightlightStatus: Array<boolean> = [];
    is_showed: Array<boolean> = [];
    text: any;

    constructor(public navCtrl: NavController, public http: Http, public navParams: NavParams, public api: ApiQuery, private iap: InAppPurchase) {

        this.getRestore();

        this.http.get(this.api.url + '/faq/payment', this.api.header).subscribe(data => {
            this.faq = data.json().faq;
            this.text = data.json().text;
        });

        this.api.showLoad();
        this.iap
            .getProducts(['shedate.oneMonth', 'shedate.threeMonths'])
            .then((products) => {
                this.products = products;
                this.api.hideLoad();
            })
            .catch((err) => {
                alert(JSON.stringify(err));
            });

    }

    subscribe(product) {
        this.api.showLoad();
        switch (product.productId) {
            case 'shedate.oneMonth':
                var monthsNumber = 1;
                break;

            case 'shedate.threeMonths':
                var monthsNumber = 3;
                break;

            case 'SixMon':
                var monthsNumber = 6;
                break;

            case 'OneY':
                var monthsNumber = 12;
                break;
        }
        this.iap
            .subscribe(product.productId)
            .then((data)=> {
                if (parseInt(data.transactionId) > 0) {
                    this.http.post(this.api.url + '/user/subscription/monthsNumber:' + monthsNumber, data, this.api.setHeaders(true)).subscribe(data => {
                        //this.api.presentToast('Congratulations on your purchase of a paid subscription to Dating4Disabled.com', 10000);
                        this.navCtrl.push(HomePage);
                    });
                }
                this.api.hideLoad();
            })
            .catch((err)=> {
                this.api.hideLoad();
                alert(JSON.stringify(err));
            });
    }

    showed(i, product) {
        //this.is_showed[i] = !this.is_showed[i];

        //if (this.is_showed[i] == false) {
            this.subscribe(product)
        //}
    }

    sendSubscribe(history) {
        //alert(JSON.stringify(history));
        this.http.post(this.api.url + '/user/subscription/restore', history, this.api.setHeaders(true)).subscribe(data => {
            //alert(JSON.stringify(data.json()));
            if (data.json().payment == 1) {
                this.navCtrl.push(HomePage);
            }

        }, err => {
            alert(JSON.stringify(err));
        });
    }

    getRestore() {
        var that = this;
        this.iap.restorePurchases().then(function (data) {
            //this.restore = data;
            console.log(data);
            /*
             [{
             transactionId: ...
             productId: ...
             state: ...
             date: ...
             }]
             */
            that.sendSubscribe(data);
        }).catch(function (err) {
            alert(JSON.stringify(err));
        });
    }

    safeHtml(el): any {
        if (this.text) {
            let html = this.text;
            let div: any = document.createElement('div');
            div.innerHTML = html;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('click');
                if (pageHref) {
                    a.removeAttribute('click');
                    a.onclick = () => this.getPage(pageHref);
                }
            });
            if (el.innerHTML == '' || typeof el.innerHTML == 'undefined') {
                el.appendChild(div);
            }
        }
    }

    getPage(id) {
        this.navCtrl.push(Page, {pageId: id});
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad SubscriptionPage');
    }

}
