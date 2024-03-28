export const isPincodeValid = (pincode: any): boolean => {
  return pincode && !isNaN(pincode) && pincode.length === 6;
};
