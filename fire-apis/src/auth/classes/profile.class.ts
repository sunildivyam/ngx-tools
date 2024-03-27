export class Profile {
  id: string; // id = uid of users
  bio: string;
  createTime: Date | string;
  updateTime: Date | string;

  constructor(data: any = null) {
    this.id = data?.id || '';
    this.bio = data?.bio || '';
    this.createTime = data?.createTime || '';
    this.updateTime = data?.updateTime || '';
  }
}
