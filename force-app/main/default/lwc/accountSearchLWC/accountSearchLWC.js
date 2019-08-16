import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

/** The delay used when debouncing event handlers before a method call. */
const DELAY = 350;

export default class AccountSearchLWC extends LightningElement {
    @track accounts;
    @track searchTerm = 'San Francisco';

    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        this.fireChangeEvent();
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.detail.value;
        this.fireChangeEvent();
    }

    fireChangeEvent() {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        window.clearTimeout(this.delayTimeout);
        const searchTerm = this.searchTerm;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            fireEvent(this.pageRef, 'AccountSearchChange', searchTerm);
        }, DELAY);
    }

    
}