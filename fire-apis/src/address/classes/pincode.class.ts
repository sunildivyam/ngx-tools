export class Pincode {
  id: string;
  city: string;
  state: string;
  createTime: Date | string;
  updateTime: Date | string;

  constructor(data: any = null) {
    this.id = data?.id || '';
    this.city = data?.city || '';
    this.state = data?.state || '';
    this.createTime = data?.createTime || '';
    this.updateTime = data?.updateTime || '';
  }
}
