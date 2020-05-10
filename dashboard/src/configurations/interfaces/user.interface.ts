export interface User {
  _id?: string;
  password: string;
  username: string;
  type: string;
  committee?: string;
}
