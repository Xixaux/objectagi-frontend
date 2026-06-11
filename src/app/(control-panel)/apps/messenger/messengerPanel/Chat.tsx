'use client';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import { useAppSelector } from 'src/store/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { selectSelectedChatId } from './messengerPanelSlice';
import {
    Message,
    useGetMessengerChatQuery,
    useGetMessengerUserProfileQuery,
    useSendMessengerMessageMutation
} from '../MessengerApi';

const StyledMessageRow = styled(motion.div)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    '& .bubble': {
        maxWidth: '85%',
        padding: '10px 16px',
        borderRadius: '18px',
        fontSize: '14px',
        lineHeight: '1.5',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
    },
    '&.contact': {
        alignItems: 'flex-start',
        '& .bubble': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9', // Slate 800/100
            color: theme.palette.text.primary,
            borderBottomLeftRadius: '4px',
        }
    },
    '&.me': {
        alignItems: 'flex-end',
        '& .bubble': {
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            borderBottomRightRadius: '4px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
        }
    }
}));

function Chat({ className }: { className?: string }) {
    const selectedChatId = useAppSelector(selectSelectedChatId);
    const { data: chat, isLoading: isChatLoading } = useGetMessengerChatQuery(selectedChatId, { skip: !selectedChatId });
    const { data: user, isLoading: isUserLoading } = useGetMessengerUserProfileQuery();
    const [sendMessage] = useSendMessengerMessageMutation();
    const [messageText, setMessageText] = useState('');
    const chatScroll = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatScroll.current) {
            chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
        }
    }, [chat]);

    const onMessageSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (messageText.trim() === '') return;
        sendMessage({ message: messageText, chatId: selectedChatId });
        setMessageText('');
    };

    if (isChatLoading || isUserLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-[#0f172a]">
                <CircularProgress size={24} thickness={5} className="text-indigo-500" />
            </div>
        );
    }

    return (
        <Paper className={clsx('flex flex-col relative h-full shadow-none border-0 overflow-hidden bg-slate-50 dark:bg-[#0f172a]', className)}>
            {/* Messages Area */}
            <div ref={chatScroll} className="flex-1 overflow-y-auto custom-scrollbar px-6">
                <div className="flex flex-col py-8 space-y-4">
                    <AnimatePresence initial={false}>
                        {chat?.map((item, i) => {
                            const isMe = item.contactId === user?.id;
                            const isFirst = i === 0 || chat[i - 1].contactId !== item.contactId;

                            return (
                                <StyledMessageRow
                                    key={item.id || i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={clsx(isMe ? 'me' : 'contact', isFirst && 'mt-6')}
                                >
                                    {isFirst && (
                                        <Typography className="text-[10px] font-mono font-bold tracking-tighter text-slate-400 mb-1 px-1 uppercase">
                                            {isMe ? 'Local Node' : 'Remote Entity'} — {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                        </Typography>
                                    )}
                                    <div className="bubble shadow-sm">
                                        <Typography className="text-sm leading-relaxed">{item.value}</Typography>
                                    </div>
                                </StyledMessageRow>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gradient-to-t from-slate-50 dark:from-[#0f172a] via-slate-50/80 dark:via-[#0f172a]/80 to-transparent">
                <form onSubmit={onMessageSubmit} className="max-w-4xl mx-auto">
                    <Paper 
                        elevation={0}
                        className="flex items-center p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl focus-within:border-indigo-500/50 transition-all"
                    >
                        <IconButton size="small" className="text-slate-400 mx-1">
                            <ObjectAGISvgIcon size={20}>heroicons-outline:plus-circle</ObjectAGISvgIcon>
                        </IconButton>
                        
                        <InputBase
                            multiline
                            maxRows={4}
                            autoFocus
                            placeholder="TRANSMIT MESSAGE..."
                            className="flex-1 px-2 text-sm font-mono tracking-tight"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    onMessageSubmit(e);
                                }
                            }}
                        />

                        <IconButton 
                            type="submit" 
                            disabled={!messageText.trim()}
                            className={clsx(
                                "ml-2 p-2 rounded-xl transition-all",
                                messageText.trim() ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "text-slate-300"
                            )}
                        >
                            <ObjectAGISvgIcon size={20}>heroicons-solid:paper-airplane</ObjectAGISvgIcon>
                        </IconButton>
                    </Paper>
                    <Typography className="text-center text-[9px] text-slate-400 mt-2 font-mono uppercase tracking-[0.2em]">
                        Secure Channel — End-to-End Encrypted
                    </Typography>
                </form>
            </div>
        </Paper>
    );
}

export default Chat;