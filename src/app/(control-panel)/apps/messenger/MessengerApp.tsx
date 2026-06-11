'use client';

import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useEffect, useMemo, useState } from 'react';
import ObjectAGIPageSimple from '@objectagi/core/ObjectAGIPageSimple';
import useThemeMediaQuery from '@objectagi/hooks/useThemeMediaQuery';
import usePathname from '@objectagi/hooks/usePathname';
import MainSidebar from './sidebars/main/MainSidebar';
import ContactSidebar from './sidebars/contact/ContactSidebar';
import UserSidebar from './sidebars/user/UserSidebar';
import MessengerAppContext from './contexts/MessengerAppContext';
import Chat from './[chatId]/Chat';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 400;

/**
 * Styled Root to match the modern Slate/White aesthetics
 */
const Root = styled(ObjectAGIPageSimple)(({ theme }) => ({
    backgroundColor: 'transparent',
    '& .ObjectAGIPageSimple-content': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
    // Adding the border/glass effect to the sidebar containers if supported by the component
    '& .ObjectAGIPageSimple-sidebar': {
        borderRight: '1px solid var(--tw-slate-200)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        '.dark &': {
            borderRight: '1px solid var(--tw-slate-800)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
        }
    }
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        maxWidth: '100%',
        overflow: 'hidden',
        boxShadow: 'none',
        borderRight: '1px solid',
        borderColor: theme.palette.divider,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
}));

function MessengerApp(props: { children?: React.ReactNode }) {
    const { children } = props;
    const pathname = usePathname();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const params = useParams<{ chatId: string }>();
    const chatId = params?.chatId;

    const [mainSidebarOpen, setMainSidebarOpen] = useState(!isMobile);
    const [contactSidebarOpen, setContactSidebarOpen] = useState<string | null>(null);
    const [userSidebarOpen, setUserSidebarOpen] = useState(false);

    // Animation Variants (Matching FunctionTab)
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
    };

    useEffect(() => { setMainSidebarOpen(!isMobile); }, [isMobile]);

    useEffect(() => {
        if (isMobile) setMainSidebarOpen(false);
    }, [pathname, isMobile]);

    const MessengerAppContextData = useMemo(() => ({
        setMainSidebarOpen,
        setContactSidebarOpen,
        setUserSidebarOpen,
        contactSidebarOpen,
    }), [contactSidebarOpen]);

    return (
        <MessengerAppContext value={MessengerAppContextData}>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="h-full w-full bg-slate-50 dark:bg-[#0f172a]"
            >
                <Root
                    className="h-full"
                    content={
                        <motion.div 
                            variants={itemVariants}
                            className="h-full flex flex-col p-4 md:p-6"
                        >
                            <div className="flex-grow overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                                {chatId ? (
                                    <Chat className="h-full" />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 animate-pulse" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Select a conversation
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    }
                    leftSidebarContent={<MainSidebar />}
                    leftSidebarOpen={mainSidebarOpen}
                    leftSidebarOnClose={() => setMainSidebarOpen(false)}
                    leftSidebarWidth={400}
                    rightSidebarContent={<ContactSidebar />}
                    rightSidebarOpen={Boolean(contactSidebarOpen)}
                    rightSidebarOnClose={() => setContactSidebarOpen(null)}
                    rightSidebarWidth={400}
                    scroll="content"
                />

                <StyledSwipeableDrawer
                    className="h-full absolute z-9999"
                    variant="temporary"
                    anchor="left"
                    open={userSidebarOpen}
                    onOpen={() => {}}
                    onClose={() => setUserSidebarOpen(false)}
                    classes={{ paper: 'absolute left-0 border-r border-slate-200 dark:border-slate-800' }}
                    style={{ position: 'absolute' }}
                    ModalProps={{
                        keepMounted: false,
                        disablePortal: true,
                        BackdropProps: { classes: { root: 'absolute' } },
                    }}
                >
                    <UserSidebar />
                </StyledSwipeableDrawer>
            </motion.div>
        </MessengerAppContext>
    );
}

export default MessengerApp;