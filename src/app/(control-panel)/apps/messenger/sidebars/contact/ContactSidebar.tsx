'use client';

import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns/format';
import { useContext } from 'react';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import UserAvatar from '../../components/UserAvatar';
import { useGetMessengerContactQuery } from '../../MessengerApi';
import MessengerAppContext from '@/app/(control-panel)/apps/messenger/contexts/MessengerAppContext';

function ContactSidebar() {
    const { contactSidebarOpen, setContactSidebarOpen } = useContext(MessengerAppContext);
    const contactId = contactSidebarOpen;

    const { data: contact } = useGetMessengerContactQuery(contactId, {
        skip: !contactId
    });

    if (!contact) return null;

    // Animation variants for section reveals
    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="flex flex-col flex-auto h-full bg-slate-50 dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800">
            {/* Header Area */}
            <Box className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                <Toolbar className="flex items-center px-4 min-h-16">
                    <IconButton
                        onClick={() => setContactSidebarOpen(null)}
                        className="text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                    >
                        <ObjectAGISvgIcon size={20}>heroicons-outline:x-mark</ObjectAGISvgIcon>
                    </IconButton>
                    <Typography className="ml-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Profile Intelligence
                    </Typography>
                </Toolbar>
            </Box>

            <div className="flex-auto overflow-y-auto custom-scrollbar p-8">
                {/* Hero Profile Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center mb-10"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl group-hover:bg-indigo-500/30 transition-all" />
                        <UserAvatar
                            className="w-32 h-32 ring-4 ring-white dark:ring-slate-900 shadow-xl relative"
                            user={contact}
                        />
                    </div>
                    <Typography className="mt-6 text-xl font-black text-slate-900 dark:text-white">
                        {contact.name}
                    </Typography>
                    <Typography className="text-sm font-mono text-indigo-500 dark:text-indigo-400 mt-1 uppercase tracking-wider font-bold">
                        {contact.about || 'External Entity'}
                    </Typography>
                </motion.div>

                <motion.div variants={itemVariants} initial="hidden" animate="show" className="space-y-10">
                    {/* Media Gallery Section */}
                    {contact.attachments?.media && (
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Typography className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Shared Intelligence
                                </Typography>
                                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {contact.attachments?.media.map((url, index) => (
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        key={index}
                                        className="h-20 w-full rounded-lg object-cover border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm"
                                        src={url}
                                        alt=""
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Technical Details Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Typography className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Data Points
                            </Typography>
                            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800" />
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Primary Node', value: contact.details.emails?.[0]?.email },
                                { label: 'Organization', value: contact.details.company },
                                { label: 'Designation', value: contact.details.title },
                                { label: 'Deployment Date', value: contact.details.birthday ? format(new Date(contact.details.birthday), 'P') : null },
                                { label: 'Location Node', value: contact.details.address },
                            ].map((detail, i) => detail.value && (
                                <div key={i} className="group">
                                    <Typography className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
                                        {detail.label}
                                    </Typography>
                                    <Typography className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">
                                        {detail.value}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}

export default ContactSidebar;