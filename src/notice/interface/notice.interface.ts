export interface INotice {
  sendFrom: string; // email | phone ...
  sendTo: string; // email | phone ...
  otherId: number;
  status: number;
  sendType: number;
  template: string;
  subject: string;
  dataJson: string;
  error: string;
}
