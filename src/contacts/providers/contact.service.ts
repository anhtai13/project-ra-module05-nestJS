import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../entities/contact.entity';
import { CreateContactRequest } from '../requests/create-contact-request';
import { ContactResponse } from '../responses/contact.response';
import { UpdateContactRequest } from '../requests/update-contact-request';

// Tài liệu: https://docs.nestjs.com/providers#services
@Injectable()
export class ContactsService {
  private static contacts: Array<Contact> = [];

  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async search(
    keyword?: string,
    page?: number,
    limit?: number,
  ): Promise<[Contact[], number]> {
    return await this.contactRepository.findAndCount({
      relations: {},
      where: {
        fullname: ILike(`%${keyword || ''}%`),
      },
      order: { id: 'DESC' }, // ORDER BY
      take: 5, // Tương đương LIMIT
      skip: 0, // Tương đương OFFSET
    });
  }

  async create(createContact: CreateContactRequest): Promise<void> {
    const contact: Contact = new Contact();
    contact.fullname = createContact.fullname;
    contact.email = createContact.email;
    contact.content = createContact.content;
    contact.status = createContact.status;
    // TODO: mã hóa

    await this.contactRepository.save(contact);
  }

  async find(id: number): Promise<ContactResponse> {
    const contact: Contact = await this.contactRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!contact) {
      throw new NotFoundException();
    }

    return new ContactResponse(contact);
  }

  async update(
    id: number,
    updateContact: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const contact: Contact = await this.contactRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!contact) {
      throw new NotFoundException();
    }

    await this.contactRepository.update({ id: id }, updateContact);

    return await this.find(id);
  }

  async delete(id: number): Promise<void> {
    const contact: Contact = await this.contactRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!contact) {
      throw new NotFoundException();
    }

    this.contactRepository.softRemove({ id });
  }
}
