import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ContactsService } from '../providers/contact.service';
import { SearchContactRequest } from '../requests/search-contact-request';
import { CreateContactRequest } from '../requests/create-contact-request';
import { UpdateContactRequest } from '../requests/update-contact-request';

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  async index(@Query() searchRequest: SearchContactRequest) {
    return await this.contactsService.search(
      searchRequest.keyword,
      searchRequest.page,
      searchRequest.limit,
    );
  }

  @Post()
  @HttpCode(201)
  async create(@Body() requestBody: CreateContactRequest) {
    await this.contactsService.create(requestBody);
  }

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return await this.contactsService.find(id);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateContactRequest,
  ) {
    return await this.contactsService.update(id, requestBody);
  }

  @Delete('/:id')
  @HttpCode(204)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    await this.contactsService.delete(id);
  }
}
