// File: ContactModel.ts
import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Contact } from './ContactsApi';

const ContactModel = (data: PartialDeep<Contact>): Contact =>
  _.defaults(data || {}, {
    id: _.uniqueId(),
    avatar: '',
    background: '',
    name: '',
    about: '',
    status: '',
  });

export default ContactModel;