import { Contact } from '../entities/contact.entity';

export class ContactResponse {
  id: number;

  fullname: string;

  email: string;

  content?: string;

  status: string;

  constructor(contact: Contact) {
    this.id = contact.id;
    this.fullname = contact.fullname;
    this.email = contact.email;
    this.content = contact.content;
    this.status = contact.status;
  }
}
