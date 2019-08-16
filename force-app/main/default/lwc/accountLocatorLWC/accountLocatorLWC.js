import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class AccountLocatorLWC extends LightningElement {
    @wire(CurrentPageReference) pageRef;
}