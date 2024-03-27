import { AddressTypesEnum } from '../enums/address-types.enums';
import { DeliveryInstruction } from './deliveryInstruction.class';

export class Address {
  id?: string; // Auto generated Unique Id
  uid: string; // Unique Id of Customer/User
  addressType: AddressTypesEnum;
  firstName: string;
  lastName: string;
  company?: string; // Company Name if Address belong to a business
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string; // City from a cities list
  state: string; // State name from StateS list or table
  postalCode: string; // Postal code from list or Table
  countryCode: string; // Country Code from Countries List (id) / Table
  phoneNumber?: string; // phone number of reciver at address and NOTE: not neccssary of Customer itself.
  deliveryInstruction?: DeliveryInstruction;
  createTime?: Date | string;
  updateTime?: Date | string;

  constructor(data: any = null) {
    this.id = data?.id || '';
    this.uid = data?.uid || '';
    this.addressType = data?.addressType || AddressTypesEnum.House;
    this.firstName = data?.firstName || '';
    this.lastName = data?.lastName || '';
    this.company = data?.company || '';
    this.addressLine1 = data?.addressLine1 || '';
    this.addressLine2 = data?.addressLine2 || '';
    this.landmark = data?.landmark || '';
    this.city = data?.city || '';
    this.state = data?.state || '';
    this.postalCode = data?.postalCode || '';
    this.countryCode = data?.countryCode || '';
    this.phoneNumber = data?.phoneNumber || '';
    this.deliveryInstruction =
      data?.deliveryInstruction || new DeliveryInstruction();
    this.createTime = data?.createTime || '';
    this.updateTime = data?.updateTime || '';
  }
}
