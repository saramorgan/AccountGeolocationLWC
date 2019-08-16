import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';


export default class AccountMapLWC extends LightningElement {
    @track markers = [];

    @wire(CurrentPageReference) pageRef; 
        
    connectedCallback() {
        registerListener(
            'UpdateAccounts',
            this.handleAccountUpdate,
            this
        );
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleAccountUpdate(result) {    
        if (result) {
            this.markers = result.map(account => {

                return {
                    location: {
                        Street: account.BillingStreet,
                        State: account.BillingState,
                        City: account.BillingCity,
                        PostalCode: account.BillingPostalCode
                    },
                    title: account.Name,
                    description: {
                        Phone: account.Website
                    },
                    icon: 'utility:pinned'
                }
            });
        } 
    }
}