'use client';
import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { motion } from 'motion/react';
import { memo, useMemo, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import clsx from 'clsx';
import { Box, CircularProgress, Typography } from '@mui/material';
import { selectSelectedChatId, setSelectedChatId, openChatPanel, closeChatPanel } from './messengerPanelSlice';
import ContactButton from './ContactButton';
import {
    useCreateMessengerChatMutation,
    useGetMessengerChatsQuery,
    useGetMessengerContactsQuery,
    useGetMessengerUserProfileQuery,
} from '../MessengerApi';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';

const Root = styled(ObjectAGIScrollbars)(({ theme }) => ({
    background: theme.palette.background.paper,
    overflowY: 'auto',
}));

const container = {
    show: {
        transition: {
            staggerChildren: 0.025,
        },
    },
};
const item = {
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1 },
};

type ContactListProps = {
    className?: string;
};

function ContactList(props: ContactListProps) {
    const { className } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { data: session, status } = useSession();
    const selectedChatId = useAppSelector(selectSelectedChatId);
    const contactListScroll = useRef(null);
    const { data: user, error: userError, isLoading: isUserLoading } = useGetMessengerUserProfileQuery(undefined, {
        skip: status === 'unauthenticated',
    });
    const [createChat] = useCreateMessengerChatMutation();
    const { data: chats, isLoading: isChatsLoading, error: chatsError } = useGetMessengerChatsQuery(undefined, {
        skip: status === 'unauthenticated',
        refetchOnMountOrArgChange: true,
    });
    const { data: contacts, isLoading: isContactsLoading, error: contactsError } = useGetMessengerContactsQuery(undefined, {
        skip: status === 'unauthenticated',
    });

    useEffect(() => {
        console.log('[ContactList] Component rendered');
        console.log('[ContactList] Data:', {
            user: user ? { id: user.id, name: user.name } : 'undefined',
            contacts: contacts?.length || 'undefined',
            chats: chats?.length || 'undefined',
            selectedChatId,
            sessionStatus: status,
        });
    }, [user, contacts, chats, selectedChatId, status]);

    const chatListContacts = useMemo(() => {
        if (!contacts?.length || !chats?.length || !user?.id) {
            console.log('[ContactList] chatListContacts: Missing data', { contacts, chats, userId: user?.id });
            return [];
        }

        const seenContactIds = new Set();
        const uniqueContacts = [];

        for (const chat of chats) {
            const contact = contacts.find((c) => chat.contactIds.includes(c.id) && c.id !== user.id);
            if (contact && !seenContactIds.has(contact.id)) {
                seenContactIds.add(contact.id);
                uniqueContacts.push({ ...chat, ...contact, compositeKey: `${chat.id}-${contact.id}` });
            }
        }

        console.log('[ContactList] chatListContacts:', uniqueContacts.map((c) => ({ id: c.id, chatId: c.chatId, compositeKey: c.compositeKey })));
        return uniqueContacts;
    }, [contacts, chats, user?.id]);

    const nonChatContacts = useMemo(() => {
        if (!contacts?.length || !user?.id) {
            console.log('[ContactList] nonChatContacts: Missing data', { contacts, userId: user?.id });
            return [];
        }
        const chatContactIds = new Set(chatListContacts.map((c) => c.id));
        const filtered = contacts.filter((contact) => !chatContactIds.has(contact.id) && contact.id !== user.id);
        console.log('[ContactList] nonChatContacts:', filtered.map((c) => ({ id: c.id, name: c.name })));
        return filtered;
    }, [contacts, chatListContacts, user?.id]);

    const scrollToTop = () => {
        if (!contactListScroll.current) {
            console.log('[ContactList] scrollToTop: No contactListScroll ref');
            return;
        }
        console.log('[ContactList] scrollToTop: Scrolling to top');
        contactListScroll.current.scrollTop = 0;
    };

    const handleContactClick = debounce(async (contactId: string) => {
        console.log('[ContactList] handleContactClick: Contact clicked', { contactId, userId: user?.id, selectedChatId });
        
        try {
            const existingChat = chats?.find((chat) => chat.contactIds.includes(contactId) && chat.contactIds.includes(user?.id));
            let newChatId;

            if (existingChat) {
                newChatId = existingChat.id;
                console.log('[ContactList] handleContactClick: Using existing chat ID', newChatId);
            } else {
                const chat = await createChat({ contactId }).unwrap();
                newChatId = chat.id;
                console.log('[ContactList] handleContactClick: Created new chat with ID', newChatId);
            }

            dispatch(setSelectedChatId(newChatId));
            dispatch(openChatPanel());

            console.log('[ContactList] handleContactClick: Navigating to', `/apps/messenger/${newChatId}`);
            router.push(`/apps/messenger/${newChatId}`);
            scrollToTop();
        } catch (error) {
            console.error('[ContactList] handleContactClick: Failed to create or find chat', error);
            dispatch(setSelectedChatId(null));
            // Assuming you have a closeChatPanel action
            dispatch(closeChatPanel()); 
            router.push('/apps/messenger');
        }
    }, 300);

    if (status === 'loading') {
        return <Box>Loading...</Box>;
    }

    if (status === 'unauthenticated') {
        console.error('[ContactList] User not authenticated');
        return <Box>Please log in to view contacts</Box>;
    }

    if (isContactsLoading || isChatsLoading || isUserLoading) {
        console.log('[ContactList] Loading state', { isContactsLoading, isChatsLoading, isUserLoading });
        return (
            <Box className="flex justify-center py-3" sx={{ width: 70, minWidth: 70 }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (userError || chatsError || contactsError) {
        console.error('[ContactList] Data fetch errors', { userError, chatsError, contactsError });
        return (
            <Box className="flex justify-center py-3" sx={{ width: 70, minWidth: 70 }}>
                <Typography color="error">Error loading data</Typography>
            </Box>
        );
    }

    return (
        <Root
            className={clsx('flex shrink-0 flex-col py-2 overscroll-contain', className)}
            ref={contactListScroll}
            option={{ suppressScrollX: true, wheelPropagation: false, usePassive: true }}
        >
            {contacts?.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col shrink-0"
                >
                    {chatListContacts.map((contact) => (
                        <motion.div variants={item} key={contact.compositeKey}>
                            <ContactButton
                                contact={contact}
                                selectedChatId={selectedChatId}
                                onClick={handleContactClick}
                            />
                        </motion.div>
                    ))}
                    <Divider className="mx-6 my-2" />
                    {nonChatContacts.map((contact) => (
                        <motion.div variants={item} key={contact.id}>
                            <ContactButton
                                contact={contact}
                                selectedChatId={selectedChatId}
                                onClick={handleContactClick}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <Box className="flex justify-center py-3">
                    <Typography>No contacts available</Typography>
                </Box>
            )}
        </Root>
    );
}

export default memo(ContactList);