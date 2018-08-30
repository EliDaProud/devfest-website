import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormControl, Validators } from '@angular/forms';
import { Invoice } from '../../database/invoice';
import * as firebase from 'firebase';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

    countTickets = new FormControl('', [Validators.required]);
    email = new FormControl('', [Validators.required]);
    companyName = new FormControl('', [Validators.required]);
    street = new FormControl('', [Validators.required]);
    city = new FormControl('', [Validators.required]);
    zip = new FormControl('', [Validators.required]);
    registrationNumberIC = new FormControl('', [Validators.required]);
    registrationNumberDIC = new FormControl('', []);
    country = new FormControl('', [Validators.required]);
    loading = false;
    done = false;
    price: number;
    priceCompany: number;

    constructor(
        public dialogRef: MatDialogRef<InvoiceComponent>, public afStore: AngularFirestore) {
    }

    ngOnInit() {
        const getCurrentCompanyFundedPrice = firebase.functions().httpsCallable('invoiceGetCurrentCompanyFundedPrice');
        getCurrentCompanyFundedPrice({}).then((result) => {
            this.priceCompany = result.data.price;
        });
        const getCurrentExchangeRate = firebase.functions().httpsCallable('invoiceGetCurrentExchangeRate');
        getCurrentExchangeRate({ from: 'EUR', to: 'CZK' }).then((result) => {
           this.price = result.data.price;
        });
    }

    goToHome() {
        this.dialogRef.close();
    }

    sendInvoice() {
        const invoice: Invoice = {
            countTickets: this.countTickets.value,
            email: this.email.value,
            companyName: this.companyName.value,
            street: this.street.value,
            city: this.city.value,
            zip: this.zip.value,
            registrationNumberIC: this.registrationNumberIC.value,
            country: this.country.value
        };
        if (this.registrationNumberDIC.value.length > 0) {
            invoice.registrationNumberDIC = this.registrationNumberDIC.value;
        }
        this.loading = true;
        this.afStore.collection('invoices').add(invoice).then(() => {
            this.loading = false;
            this.done = true;
        });
    }

    getErrorMessage() {
        return 'You must enter a value';
    }

}
