import AppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import keycode from 'keycode';
import { useCallback, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import _ from 'lodash';
import Chat from './Chat';
import ContactList from './ContactList';
import { selectSelectedChatId, closeChatPanel, openChatPanel, selectChatPanelOpen } from './messengerPanelSlice';
import {
    useGetMessengerChatsQuery,
    useGetMessengerContactsQuery,
    useGetMessengerUserProfileQuery
} from '../MessengerApi';

const Root = styled('div')<{ opened: number }>(({ theme }) => ({
    position: 'sticky',
    display: 'flex',
    top: 0,
    width: 70,
    maxWidth: 70,
    minWidth: 70,
    height: '100vh',
    zIndex: 1000,
    borderLeft: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('lg')]: {
        position: 'fixed',
        height: '100%',
        width: 0,
        maxWidth: 0,
        minWidth: 0
    },
    '& > .panel': {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: 360,
        minWidth: 360,
        height: '100%',
        margin: 0,
        overflow: 'hidden',
        zIndex: 1000,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: 'translate3d(0,0,0)',
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard
        }),
        [theme.breakpoints.down('lg')]: {
            left: 'auto',
            position: 'fixed',
            transform: theme.direction === 'rtl' ? 'translate3d(-360px,0,0)' : 'translate3d(360px,0,0)',
            boxShadow: 'none',
            width: 320,
            minWidth: 320,
            maxWidth: '100%'
        }
    },
    '@keyframes hide-panel': {
        '0%': { overflow: 'visible' },
        '99%': { overflow: 'visible' },
        '100%': { overflow: 'hidden' }
    },
    variants: [
        {
            props: ({ opened }) => opened,
            style: { overflow: 'visible' }
        },
        {
            props: ({ opened }) => !opened,
            style: {
                overflow: 'hidden',
                animation: `hide-panel 1ms linear ${theme.transitions.duration.standard}`,
                animationFillMode: 'forwards'
            }
        },
        {
            props: ({ opened }) => opened,
            style: {
                '& > .panel': {
                    transform: theme.direction === 'rtl' ? 'translate3d(290px,0,0)' : 'translate3d(-290px,0,0)'
                }
            }
        },
        {
            props: ({ opened }) => opened,
            style: {
                '& > .panel': {
                    [theme.breakpoints.down('lg')]: {
                        transform: 'translate3d(0,0,0)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    ]
}));

/**
 * The chat panel component.
 */
function MessengerPanel() {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const selectedChatId = useAppSelector(selectSelectedChatId);
    const { data: contacts, error: contactsError } = useGetMessengerContactsQuery();
    const { data: chatList, error: chatListError } = useGetMessengerChatsQuery();
    const { data: user, error: userError } = useGetMessengerUserProfileQuery();
    const open = useAppSelector(selectChatPanelOpen);

    // Debug: Log state and data
    useEffect(() => {
        console.log('MessengerPanel State:', {
            open,
            selectedChatId,
            user: user ? { id: user.id, name: user.name } : 'undefined',
            userError,
            contacts: contacts?.length || 'undefined',
            contactsError,
            chatList: chatList?.length || 'undefined',
            chatListError
        });
    }, [open, selectedChatId, user, userError, contacts, contactsError, chatList, chatListError]);

    const chat = chatList?.find((chat) => chat.id === selectedChatId);
    const contactId = chat?.contactIds?.find((id) => id !== user?.id);
    const selectedContact = contactId ? _.find(contacts, { id: contactId }) : null;

    const handlers = useSwipeable({
        onSwipedLeft: { handler: () => open && theme.direction === 'rtl' && dispatch(closeChatPanel()), passive: true },
        onSwipedRight: { handler: () => open && theme.direction === 'ltr' && dispatch(closeChatPanel()), passive: true },
    });

    const handleDocumentKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (keycode(event) === 'esc') {
                console.log(' MessengerPanel: ESC key pressed, closing panel');
                dispatch(closeChatPanel());
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleDocumentKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown);
        };
    }, [handleDocumentKeyDown, open]);

    useEffect(() => {
        function handleDocumentClick(ev: MouseEvent) {
            if (ref.current && !ref.current.contains(ev.target as Node)) {
                console.log('MessengerPanel: Clicked outside, closing panel');
                dispatch(closeChatPanel());
            }
        }

        if (open) {
            document.addEventListener('click', handleDocumentClick, true);
        }
        return () => {
            document.removeEventListener('click', handleDocumentClick, true);
        };
    }, [open, dispatch]);

    if (userError || contactsError || chatListError) {
        console.error('MessengerPanel: Data fetch errors', { userError, contactsError, chatListError });
        return <Typography color="error">Error loading messenger data</Typography>;
    }

    return (
        <Root
            opened={open ? 1 : 0}
            {...handlers}
        >
            <div
                className="panel flex flex-col max-w-full"
                ref={ref}
            >
<AppBar
    position="static"
    className="shadow-md"
    // Use sx to ensure text and icons are dark against the light grey
    sx={{ 
        backgroundColor: '#FAFAFA', 
        color: '#111827' // Dark near-black color
    }}
>
    <Toolbar className="px-1">
        {(!open || selectedChatId === '') && (
            <div className="flex flex-1 items-center px-0.75 space-x-3">
                <IconButton
                    className="w-14 h-14"
                    // Overriding "inherit" with the dark color
                    sx={{ color: '#111827' }}
                    onClick={() => {
                        console.log('MessengerPanel: Opening chat panel via icon');
                        dispatch(openChatPanel());
                    }}
                    size="large"
                >
                    <ObjectAGISvgIcon size={24}>heroicons-outline:chat-bubble-left-right</ObjectAGISvgIcon>
                </IconButton>
                {selectedChatId === '' && (
                    <Typography
                        className="text-lg font-semibold"
                        // Specifically setting the text color
                        sx={{ color: '#111827' }}
                    >
                        Group Chat
                    </Typography>
                )}
            </div>
        )}
        {open && selectedContact && (
            <div className="flex flex-1 items-center px-3">
                <Avatar src={selectedContact.avatar} />
                <Typography
                    className="mx-4 text-lg font-semibold"
                    sx={{ color: '#111827' }}
                >
                    {selectedContact.name}
                </Typography>
            </div>
        )}
        <div className="flex px-1">
            <IconButton
                onClick={() => {
                    console.log('MessengerPanel: Closing chat panel');
                    dispatch(closeChatPanel());
                }}
                sx={{ color: '#111827' }} // Dark close icon
                size="large"
            >
                <ObjectAGISvgIcon>heroicons-outline:x-mark</ObjectAGISvgIcon>
            </IconButton>
        </div>
    </Toolbar>
</AppBar>
                <Paper className="flex flex-1 flex-row min-h-px shadow-0">
                    <ContactList className="flex shrink-0" />
                    {open && selectedChatId ? (
                        <Chat className="flex flex-1 z-10" />
                    ) : (
                        <div className="flex flex-col flex-1 items-center justify-center p-6">
                            <ObjectAGISvgIcon
                                size={128}
                                color="disabled"
                            >
                                heroicons-outline:chat-bubble-left-right
                            </ObjectAGISvgIcon>
                            <Typography
                                className="px-4 pb-6 mt-6 text-center"
                                color="text.secondary"
                            >
                                Select an eHuman to start a conversation.
                            </Typography>
                        </div>
                    )}
                </Paper>
            </div>
        </Root>
    );
}

export default MessengerPanel;