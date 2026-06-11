'use client';

import ObjectAGIUtils from '@objectagi/utils';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useContext, useMemo, useState } from 'react';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import Box from '@mui/material/Box';
import UserAvatar from '../../components/UserAvatar';
import MainSidebarMoreMenu from './MainSidebarMoreMenu';
import ChatListItem from './ChatListItem';
import {
    useGetMessengerChatsQuery,
    useGetMessengerContactsQuery,
    useGetMessengerUserProfileQuery,
    useCreateMessengerChatMutation,
} from '../../MessengerApi';
import MessengerAppContext from '@/app/(control-panel)/apps/messenger/contexts/MessengerAppContext';
import { useRouter } from 'next/navigation';   // ← Added for navigation

function MainSidebar() {
    const router = useRouter();   // ← For navigating to /apps/messenger/[chatId]
    const { setUserSidebarOpen } = useContext(MessengerAppContext);

    const { data: contacts = [] } = useGetMessengerContactsQuery();
    const { data: user } = useGetMessengerUserProfileQuery();
    const { data: chatList = [] } = useGetMessengerChatsQuery();

    const [searchText, setSearchText] = useState('');
    const [createMessengerChat, { isLoading: isCreating }] = useCreateMessengerChatMutation();

    function handleSearchText(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchText(event.target.value);
    }

    const handleStartNewChat = async (contactId: string) => {
        try {
            // Check if chat already exists
            const existingChat = chatList.find((chat) =>
                chat.contactIds.includes(contactId)
            );

            let chatId: string;

            if (existingChat) {
                chatId = existingChat.id;
            } else {
                // Create new chat
                const newChat = await createMessengerChat({
                    contactIds: [contactId],
                }).unwrap();
                chatId = newChat.id;
            }

            // Navigate to the chat (this will make <Chat /> render in your MessengerApp)
            router.push(`/apps/messenger/${chatId}`);

            // Optional: clear search
            setSearchText('');
        } catch (error) {
            console.error('Failed to create or open chat:', error);
            alert('Failed to start new chat. Please try again.');
        }
    };

    // Animation variants (unchanged)
    const container = {
        show: { transition: { staggerChildren: 0.04 } }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="flex flex-col flex-auto bg-white dark:bg-[#0f172a] h-full">
            {/* Header / Search Section - unchanged except placeholder */}
            <Box className="py-5 px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col shrink-0 sticky top-0 z-10 backdrop-blur-md bg-white/75 dark:bg-slate-950/75">
                <div className="flex justify-between items-center mb-5">
                    {user && (
                        <div
                            className="flex items-center group cursor-pointer"
                            onClick={() => setUserSidebarOpen(true)}
                            role="button"
                            tabIndex={0}
                        >
                            <UserAvatar
                                className="relative ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"
                                user={user}
                            />
                            <div className="flex flex-col ml-4">
                                <Typography className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-0.5">
                                    {user?.name}
                                </Typography>
                                <Typography className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                    Online
                                </Typography>
                            </div>
                        </div>
                    )}
                    <MainSidebarMoreMenu className="text-slate-400 hover:text-indigo-500 transition-colors" />
                </div>

                <Paper
                    elevation={0}
                    className="flex items-center w-full px-3.5 py-2 bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg h-9 shadow-sm hover:shadow focus-within:shadow-md focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-150"
                >
                    <ObjectAGISvgIcon size={18} className="text-slate-400 dark:text-slate-500">
                        heroicons-solid:magnifying-glass
                    </ObjectAGISvgIcon>

                    <Input
                        placeholder="Search directory to start new chat"
                        className="flex flex-1 ml-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        disableUnderline
                        fullWidth
                        value={searchText}
                        onChange={handleSearchText}
                        inputProps={{
                            'aria-label': 'Search directory',
                            className: 'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                        }}
                    />
                </Paper>
            </Box>

            {/* Content Section - the rest is identical to previous version */}
            <div className="flex-auto overflow-y-auto custom-scrollbar">
                <List className="w-full p-0">
                    {useMemo(() => {
                        if (!contacts.length) return null;

                        const filteredContacts = searchText.length === 0
                            ? contacts
                            : ObjectAGIUtils.filterArrayByString([...contacts], searchText);

                        const filteredChatList = chatList.filter((chat) =>
                            filteredContacts.some((contact) => chat.contactIds.includes(contact.id))
                        );

                        return (
                            <motion.div
                                className="flex flex-col shrink-0"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {/* Active Chats */}
                                <motion.div variants={item} className="flex items-center gap-3 px-6 py-4">
                                    <Typography className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        Active Chats
                                    </Typography>
                                    <div className="h-px flex-grow bg-slate-100 dark:bg-slate-800" />
                                </motion.div>

                                {filteredChatList.length > 0 ? (
                                    filteredChatList.map((chat) => (
                                        <motion.div
                                            variants={item}
                                            key={chat.id}
                                            className="px-2"
                                        >
                                            <div className="rounded-xl overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <ChatListItem item={chat} />
                                            </div>
                                        </motion.div>
                                    ))
                                ) : searchText.length === 0 && (
                                    <motion.div variants={item} className="p-12 text-center">
                                        <ObjectAGISvgIcon size={48} className="text-slate-200 dark:text-slate-800 mx-auto mb-4">
                                            heroicons-outline:chat-bubble-left-right
                                        </ObjectAGISvgIcon>
                                        <Typography className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                                            No active chats
                                        </Typography>
                                    </motion.div>
                                )}

                                {/* All Contacts section when searching */}
                                {searchText.length > 0 && (
                                    <>
                                        <motion.div variants={item} className="flex items-center gap-3 px-6 py-4 mt-6">
                                            <Typography className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                All Contacts
                                            </Typography>
                                            <div className="h-px flex-grow bg-slate-100 dark:bg-slate-800" />
                                        </motion.div>

                                        {filteredContacts.map((contact) => {
                                            const hasActiveChat = chatList.some((chat) =>
                                                chat.contactIds.includes(contact.id)
                                            );

                                            if (hasActiveChat) return null;

                                            return (
                                                <motion.div
                                                    key={contact.id}
                                                    variants={item}
                                                    className="px-2"
                                                >
                                                    <div
                                                        onClick={() => handleStartNewChat(contact.id)}
                                                        className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer active:bg-slate-100 ${isCreating ? 'opacity-60 pointer-events-none' : ''}`}
                                                    >
                                                        <UserAvatar user={contact} />
                                                        <div className="flex-1 min-w-0">
                                                            <Typography className="font-medium text-slate-900 dark:text-white truncate">
                                                                {contact.name}
                                                            </Typography>
                                                            {contact.details?.emails?.[0]?.email && (
                                                                <Typography className="text-xs text-slate-400 truncate">
                                                                    {contact.details.emails[0].email}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                        <ObjectAGISvgIcon size={18} className="text-indigo-500">
                                                            heroicons-solid:plus-circle
                                                        </ObjectAGISvgIcon>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}

                                        {filteredContacts.filter(c => !chatList.some(chat => chat.contactIds.includes(c.id))).length === 0 && (
                                            <motion.div variants={item} className="p-8 text-center">
                                                <Typography className="text-xs text-slate-400">
                                                    No matching contacts found
                                                </Typography>
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        );
                    }, [contacts, chatList, searchText, isCreating])}
                </List>
            </div>
        </div>
    );
}

export default MainSidebar;