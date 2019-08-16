import { LightningElement, wire, track } from 'lwc';
import { registerListener, unregisterAllListeners} from 'c/pubsub';
import searchAccounts from '@salesforce/apex/AccountSearchController.searchAccounts';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

const cols = [
    {
        label: 'Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone'
    },
    {
        label: 'Website',
        fieldName: 'Website',
        type: 'url'
    },
    {
        label: 'View',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            title: 'View Details',
            alternativeText: 'View Details',
            iconName: 'action:info'

        }
    }
];

export default class AccountListLWC extends NavigationMixin(LightningElement) {
    @track searchTerm = '';
    @track error;
    @track cols = cols;
    @track record = {};
    @track accounts = [];

    connectedCallback() {
        
        registerListener(
            'AccountSearchChange',
            this.handleSearchChange,
            this
        );
    }
    
    @wire(searchAccounts,   {
        searchTerm: '$searchTerm'
    })
    loadAccounts(result) {
        if (result.data) {
            this.accounts = result.data;
            fireEvent(this.pageRef, 'UpdateAccounts', result.data);
            this.error = undefined;
        } else if (result.error) {
            //handle error
            this.error = result.error;
            this.accounts = undefined;
        }
     }

    @wire(CurrentPageReference) pageRef;

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleSearchChange(searchTerm) {
        this.searchTerm = searchTerm;
    }

    handleRowAction(event) {
        const row = event.detail.row;
        this.record = row;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                actionName: 'view',
            },
        });
    }

    
}