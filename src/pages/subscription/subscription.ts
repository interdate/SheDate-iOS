import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {ApiQuery} from "../../library/api-query";
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

    public products: any = ['shedate.oneWeek','shedate.oneMonth', 'shedate.threeMonths', 'shedate.sixMonth', 'shedate.oneYear'];
    faq: Array<{ q: string, a: string }>;
    hightlightStatus: Array<boolean> = [];
    is_showed: Array<boolean> = [];
    text: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiQuery, private iap: InAppPurchase) {

        this.getRestore();

        this.api.http.get(this.api.url + '/faq/payment', this.api.header).subscribe(data => {
            this.faq = data.json().faq;
            this.text = data.json().text;
        });

        this.api.showLoad();
        this.iap.getProducts(['shedate.oneWeek','shedate.oneMonth', 'shedate.threeMonths', 'shedate.sixMonth', 'shedate.oneYear'])
            .then((products) => {
                console.log(JSON.stringify(products));
                products.forEach(product => {

                    if (product.productId == 'shedate.oneWeek') {
                        product.id = 0;
                        product.title = 'מנוי מתחדש לשבוע בשידייט';
                        product.description = 'מנוי מתחדש כל שבוע המאפשר לך לקרוא הודעות ללא הגבלה';
                    }
                    if (product.productId == 'shedate.oneMonth') {
                        product.id = 1;
                        product.title = 'מנוי חודשי מתחדש בשידייט';
                        product.description = 'מנוי מתחדש כל חודש המאפשר לך לקרוא הודעות ללא הגבלה';
                    }
                    if (product.productId == 'shedate.threeMonths') {
                        product.id = 2;
                        product.title = 'מנוי מתחדש ל3 חודשים בשידייט';
                        product.description = 'מנוי מתחדש כל 3 חודשים המאפשר לך לקרוא הודעות ללא הגבלה';
                    }
                    if (product.productId == 'shedate.sixMonth') {
                        product.id = 3;
                        product.title = 'מנוי מתחדש ל6 חודשים בשידייט';
                        product.description = 'מנוי מתחדש כל 6 חודשים המאפשר לך לקרוא הודעות ללא הגבלה';
                    }
                    if (product.productId == 'shedate.oneYear') {
                        product.id = 4;
                        product.title = 'מנוי מתחדש לשנה אחת בשידייט';
                        product.description = 'מנוי מתחדש כל שנה המאפשר לך לקרוא הודעות ללא הגבלה';
                    }

                    this.products[product.id] = product;
                });
                console.log(JSON.stringify(this.products));
                //this.products = products;
                this.api.hideLoad();
            })
            .catch((err) => {
                this.api.hideLoad();
                console.log(JSON.stringify(err));
            });

    }

    subscribe(product) {
        this.api.showLoad();
        var monthsNumber = 1;
        switch (product.productId) {
            case 'shedate.oneWeek':
                monthsNumber = 7;
                break;

            case 'shedate.oneMonth':
                monthsNumber = 1;
                break;

            case 'shedate.threeMonths':
                monthsNumber = 3;
                break;

            case 'shedate.sixMonth':
                monthsNumber = 6;
                break;

            case 'shedate.oneYear':
                monthsNumber = 12;
                break;
        }
        console.log('Subscribe: ' + monthsNumber);
        var that = this;
        this.iap
            .subscribe(product.productId)
            .then((data)=> {
                console.log(JSON.stringify(data));
                if (parseInt(data.transactionId) > 0) {
                    console.log(that.api.setHeaders(true));
                    that.api.http.post(that.api.url + '/user/subscription/monthsNumber:' + monthsNumber, data, that.api.setHeaders(true)).subscribe(subscr => {
                        //this.api.presentToast('Congratulations on your purchase of a paid subscription to Dating4Disabled.com', 10000);
                        that.navCtrl.push(HomePage);
                        console.log(JSON.stringify(subscr));
                    },error => {
                        console.log(JSON.stringify(error));
                    });
                }
                that.api.hideLoad();
            })
            .catch((err)=> {
                that.api.hideLoad();
                //alert(JSON.stringify(err));
                console.log(JSON.stringify(err));
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
        console.log('Restore send: ' + JSON.stringify(history));
        this.api.http.post(this.api.url + '/user/subscription/restore', history, this.api.setHeaders(true)).subscribe(data => {
            //alert(JSON.stringify(data.json()));
            console.log(JSON.stringify(data.json()));
            if (data.json().payment == 1) {
                this.navCtrl.push(HomePage);
            }

        }, err => {
            //alert(JSON.stringify(err));
            console.log('Restore send: ' + JSON.stringify(err));
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
            this.api.hideLoad();
            //alert(JSON.stringify(err));
            console.log(JSON.stringify(err));
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

    ionViewWillEnter() {
        this.api.pageName = 'SubscriptionPage';
    }

}
