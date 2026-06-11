import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { motion } from 'motion/react';
import { memo, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import clsx from 'clsx';
import { Box, CircularProgress, Typography } from '@mui/material';
import { selectSelectedChatId, setSelectedChatId, openChatPanel } from './messengerPanelSlice';
import ContactButton from './ContactButton';
import {
    useCreateMessengerChatMutation,
    useGetMessengerChatsQuery,
    useGetMessengerContactQuery,
    useGetMessengerUserProfileQuery,
} from '../MessengerApi';

const Root = styled(ObjectAGIScrollbars)(({ theme }) => ({
    background: theme.palette.background.paper,
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
    const selectedChatId = useAppSelector(selectSelectedChatId);
    const contactListScroll = useRef<HTMLDivElement>(null);
    const { data: user, isLoading: isUserLoading, error: userError } = useGetMessengerUserProfileQuery();
    const [createChat] = useCreateMessengerChatMutation();
    const { data: chats, isLoading: isChatsLoading, error: chatsError } = useGetMessengerChatsQuery();

    // Debug logging
    console.log('User:', { data: user, isLoading: isUserLoading, error: userError });
    console.log('Chats:', { data: chats, isLoading: isChatsLoading, error: chatsError });

    // Extract unique contact IDs from chats, excluding the demo user
    const contactIds = useMemo(() => {
        const ids = new Set<string>();
        chats?.forEach((chat) => {
            chat.contactIds.forEach((id) => {
                if (id !== user?.id) ids.add(id);
            });
        });
        console.log('Contact IDs from Chats:', Array.from(ids));
        return Array.from(ids);
    }, [chats, user?.id]);

    // Fetch individual contacts
    const contactQueries = contactIds.map((contactId) => ({
        contactId,
        query: useGetMessengerContactQuery(contactId),
    }));

    const contacts = useMemo(() => {
        const result = contactQueries
            .filter(({ query }) => query.isSuccess && query.data)
            .map(({ query }) => query.data as Contact);
        console.log('Fetched Contacts:', result);
        return result;
    }, [contactQueries]);

    const chatListContacts = useMemo(() => {
        const result =
            contacts.length > 0 && chats?.length > 0
                ? chats.map((_chat) => {
                    const contact = contacts.find((_contact) => _chat.contactIds.includes(_contact.id));
                    console.log('Merging Chat:', _chat.id, 'with Contact:', contact?.id || 'none');
                    return { ..._chat, ...contact };
                })
                : [];
        console.log('ChatListContacts:', result);
        return result;
    }, [contacts, chats]);

    const scrollToTop = () => {
        if (!contactListScroll.current) {
            return;
        }
        contactListScroll.current.scrollTop = 0;
    };

    const handleContactClick = (contactId: string) => {
        dispatch(openChatPanel());
        const chat = chats?.find((chat) => chat.contactIds.includes(contactId));
        console.log('Clicked Contact:', contactId, 'Found Chat:', chat);

        if (chat) {
            dispatch(setSelectedChatId(chat.id));
            scrollToTop();
        } else if (user?.id) {
            console.log('Creating new chat with contactId:', contactId, 'userId:', user.id);
            createChat({ contactIds: [contactId, user.id] }).then((res) => {
                const chatId = (res as { data: Chat }).data?.id;
                console.log('Created Chat:', chatId);
                dispatch(setSelectedChatId(chatId));
                scrollToTop();
            });
        } else {
            console.log('Cannot create chat: user.id is undefined');
        }
    };

    if (isChatsLoading || isUserLoading || contactQueries.some(({ query }) => query.isLoading)) {
        return (
            <Box
                className="flex justify-center py-3"
                sx={{ width: 70, minWidth: 70 }}
            >
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (chatsError || userError || contactQueries.some(({ query }) => query.error)) {
        return (
            <Box className="flex flex-col justify-center py-3">
                <Typography color="error">Error loading data:</Typography>
                <Typography color="error">
                    {JSON.stringify(chatsError || userError || contactQueries.find(({ query }) => query.error)?.query.error)}
                </Typography>
            </Box>
        );
    }

    if (!contacts.length) {
        return (
            <Box className="flex justify-center py-3">
                <Typography>No contacts available</Typography>
            </Box>
        );
    }

    return (
        <Root
            className={clsx('flex shrink-0 flex-col overflow-y-auto py-2 overscroll-contain', className)}
            ref={contactListScroll}
            option={{ suppressScrollX: true, wheelPropagation: false }}
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col shrink-0"
            >
                {chatListContacts.map((contact) => (
                    <motion.div
                        variants={item}
                        key={contact.id}
                    >
                        <ContactButton
                            contact={contact}
                            selectedChatId={selectedChatId}
                            onClick={handleContactClick}
                        />
                    </motion.div>
                ))}
                <Divider className="mx-6 my-2" />
                {contacts.map((contact) => {
                    const chatContact = chats.find((_chat) => _chat.contactIds.includes(contact.id));
                    return !chatContact ? (
                        <motion.div
                            variants={item}
                            key={contact.id}
                        >
                            <ContactButton
                                contact={contact}
                                selectedChatId={selectedChatId}
                                onClick={handleContactClick}
                            />
                        </motion.div>
                    ) : null;
                })}
            </motion.div>
        </Root>
    );
}

export default memo(ContactList);