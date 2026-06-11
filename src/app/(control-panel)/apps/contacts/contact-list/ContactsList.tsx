// File: src/app/(control-panel)/apps/contacts/contact-list/ContactsList.tsx
'use client';

import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ObjectAGILoading from '@objectagi/core/ObjectAGILoading';
import { useState, useEffect } from 'react';
import { useAppSelector } from 'src/store/hooks';
import ContactListItem from './ContactListItem';
import { Contact, selectGroupedFilteredContacts, fetchContactsList } from '../ContactsApi';

function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const groupedFilteredContacts = useAppSelector(selectGroupedFilteredContacts(contacts));

  useEffect(() => {
    console.log('Loading contacts');
    async function loadContacts() {
      try {
        const data = await fetchContactsList();
        console.log('Setting contacts:', data);
        setContacts(data);
        setIsLoading(false);
      } catch (err: any) {
        setError('Failed to load contacts: ' + err.message);
        setIsLoading(false);
        console.error('Load contacts error:', err.message);
      }
    }
    loadContacts();
  }, []);

  if (isLoading) {
    return <ObjectAGILoading />;
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="error" variant="h5">
          {error}
        </Typography>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          There are no contacts!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full border-x-1"
    >
      {Object.entries(groupedFilteredContacts).map(([key, group]: [string, { group: string; children?: Contact[] }]) => (
        <div key={key} className="relative">
          <Typography color="text.secondary" className="px-8 py-1 text-base font-medium">
            {key}
          </Typography>
          <Divider />
          <List className="w-full m-0 p-0">
            {group?.children?.map((item: Contact) => (
              <ContactListItem key={item.id} contact={item} />
            ))}
          </List>
        </div>
      ))}
    </motion.div>
  );
}

export default ContactsList;