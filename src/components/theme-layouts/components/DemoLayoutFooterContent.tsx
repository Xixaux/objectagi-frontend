'use client';

import { Box, IconButton, Tooltip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useGetMessengerContactsQuery } from '@/app/(control-panel)/apps/messenger/MessengerApi';
import { useAppDispatch } from 'src/store/hooks';

// FIXED IMPORT – added /messengerPanel/ subfolder
import {
  openChatPanel,
  // Try uncommenting ONE of these based on what your slice exports:
  // selectChat,
  // setSelectedChatId,
  // openConversation,
  // startChatWithContact,
  // ... look inside messengerPanelSlice.ts for the real action names
} from '@/app/(control-panel)/apps/messenger/messengerPanel/messengerPanelSlice';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ActivitiesPageHeader() {
  const dispatch = useAppDispatch();
  const { data: contacts = [] } = useGetMessengerContactsQuery();

  // Limit visible avatars (adjust as needed)
  const visibleContacts = contacts.slice(0, 6);

  const handleAvatarClick = (contactId: string) => {
    // Always open the panel
    dispatch(openChatPanel());

    // Select / activate the specific chat – try ONE line at a time:
    // dispatch(selectChat(contactId));
    // dispatch(setSelectedChatId(contactId));
    // dispatch(startConversation(contactId));
    // dispatch(openConversation(contactId));

    // Debug log – keep temporarily
    console.log('Footer avatar clicked → trying to open chat for contact:', contactId);
  };

  return (
    <Box
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="show"
      className="flex items-center gap-1 md:gap-2"
      sx={{ bgcolor: 'transparent' }}
    >


      {/* Contact Avatars – clickable */}
      {visibleContacts.map((contact) => (
        <Tooltip key={contact.id} title={contact.name || 'Contact'} placement="top">
          <IconButton
            component={motion.button}
            variants={item}
            onClick={() => handleAvatarClick(contact.id)}
            sx={{
              p: 0.5,
              borderRadius: '50%',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Avatar
              src={contact.avatar}
              alt={contact.name || 'User avatar'}
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>
        </Tooltip>
      ))}

      {/* +more if too many contacts */}
      {contacts.length > visibleContacts.length && (
        <Tooltip title={`+${contacts.length - visibleContacts.length} more`} placement="top">
          <Box
            component={motion.div}
            variants={item}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 'medium',
              color: 'text.secondary',
            }}
          >
            +{contacts.length - visibleContacts.length}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}