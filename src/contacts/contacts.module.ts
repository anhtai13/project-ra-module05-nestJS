import { Module } from '@nestjs/common';
import { ContactsController } from './controllers/contact.controller';
import { ContactsService } from './providers/contact.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
