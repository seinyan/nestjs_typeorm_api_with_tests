export interface INotice {
  sendFrom: string; // email | phone ...
  sendTo: string; // email | phone ...
  otherId: number;
  status: number;
  type: string;
  template: string;
  subject: string;
  dataJson: string;
  error: string;
}
