export interface Event {
  _id?: string;
  title: string;
  description: string;
  metaDescription: string;
  startDate: any;
  endDate: any;
  location?: string;
  formLink: string;
  cover: string;
  images?: string[];
  status: string;
}
