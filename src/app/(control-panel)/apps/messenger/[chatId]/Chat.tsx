'use client';
import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { useContext, useEffect, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import Toolbar from '@mui/material/Toolbar';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Error404Page from 'src/app/(public)/404/Error404Page';
import ChatMoreMenu from './ChatMoreMenu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import {
  Message,
  useGetMessengerChatQuery,
  useGetMessengerContactQuery,
  useGetMessengerUserProfileQuery,
  useSendMessengerMessageMutation,
  useGetMessengerChatsQuery,
  useGetCognitiveSummaryQuery,
  useGetThoughtStreamQuery,
  useGetProcessOutputQuery,
  useGetProcessOutputStatusQuery,
} from '../MessengerApi';
import UserAvatar from '../components/UserAvatar';
import MessengerAppContext from '../contexts/MessengerAppContext';
import { keyframes } from '@mui/material/styles';

// Pulse animation
const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(46, 125, 50, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
`;

// Smooth fade-in
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const MainContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
}));

const ChatArea = styled('div')(({ theme }) => ({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: '4px',
  minHeight: '50vh',
}));

const ProcessOutput = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: '0 0 4px 4px',
  backgroundColor: '#000000',
  color: '#ffffff',
  fontFamily: '"Consolas", "Courier New", monospace',
  fontSize: '12px',
  lineHeight: '1.5',
  '&::-webkit-scrollbar': { width: '8px' },
  '&::-webkit-scrollbar-track': { background: '#2e2e2e' },
  '&::-webkit-scrollbar-thumb': { background: '#4a4a4a', borderRadius: '4px' },
  '&::-webkit-scrollbar-thumb:hover': { background: '#6a6a6a' },
  scrollbarWidth: 'thin',
  scrollbarColor: '#4a4a4a #2e2e2e',
}));

const StyledMessageRow = styled('div')(({ theme }) => ({
  opacity: 0,
  animation: `${fadeIn} 380ms ease-out forwards`,
  animationDelay: '80ms',

  '&.contact': {
    alignSelf: 'flex-start',
    '& .bubble': {
      backgroundColor: '#f0f2f5',
      color: '#111111',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    '&.first-of-group .bubble': { borderTopLeftRadius: 12 },
    '&.last-of-group .bubble': { borderBottomLeftRadius: 12 },
  },
  '&.me': {
    alignSelf: 'flex-end',
    paddingLeft: 36,
    '& .bubble': {
      marginLeft: 'auto',
      backgroundColor: '#e8ecef',
      color: '#111111',
      boxShadow: '0 2px 10px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)',
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    '&.first-of-group .bubble': { borderTopRightRadius: 12 },
    '&.last-of-group .bubble': { borderBottomRightRadius: 12 },
  },
  '&.contact + .me, &.me + .contact': {
    paddingTop: 20,
    marginTop: 30,
  },
  '&.first-of-group': { '& .bubble': { paddingTop: 8 } },
  '&.last-of-group': {
    '& .bubble': { paddingBottom: 8 },
    '& .timestamp': {
      display: 'block',
      marginTop: 4,
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
      opacity: 0.9,
    },
  },
}));

type ChatProps = { className?: string };

function Chat(props: ChatProps) {
  const { className } = props;
  const { setMainSidebarOpen, setContactSidebarOpen } = useContext(MessengerAppContext);

  const chatRef = useRef<HTMLDivElement>(null);
  const processOutputRef = useRef<HTMLPreElement>(null);
  const thoughtRef = useRef<HTMLPreElement>(null);
  const reasoningRef = useRef<HTMLPreElement>(null);

  const [message, setMessage] = useState('');
  const [lastUserMessage, setLastUserMessage] = useState<string | undefined>(undefined);
  const [shouldFetchProcessOutput, setShouldFetchProcessOutput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [thoughtCopied, setThoughtCopied] = useState(false);
  const [reasoningCopied, setReasoningCopied] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [thoughtExpanded, setThoughtExpanded] = useState(false);
  const [reasoningExpanded, setCognitiveSummaryExpanded] = useState(false);

  // New: store detailed send error
  const [sendErrorDetails, setSendErrorDetails] = useState<any>(null);

  const [sendMessage, { isLoading: isSending, error }] = useSendMessengerMessageMutation();

  const routeParams = useParams<{ chatId: string }>();
  const { chatId } = routeParams;

  // Polling disabled by default to reduce race conditions on backend
  const { data: cogData } = useGetCognitiveSummaryQuery(undefined, { pollingInterval: 0 });
  const { data: thoughtData } = useGetThoughtStreamQuery(undefined, { pollingInterval: 0 });

  const { data: chatList, isLoading: isLoadingChats } = useGetMessengerChatsQuery();
  const { data: user, isLoading: isLoadingUser } = useGetMessengerUserProfileQuery();
  const { data: messages, isLoading: isLoadingMessages, refetch } = useGetMessengerChatQuery(chatId, { skip: !chatId });

  const chat = chatList?.find((c) => c.id === chatId);
  const contactId = chat?.contactIds?.find((id) => id !== user?.id);
  const { data: selectedContact, isLoading: isLoadingContact } = useGetMessengerContactQuery(contactId, { skip: !contactId });

  const { data: processOutputData, isLoading: isLoadingProcessOutput, error: processOutputError } = useGetProcessOutputQuery(lastUserMessage, {
    skip: !shouldFetchProcessOutput || !lastUserMessage,
  });

  const { data: processOutputStatus, isLoading: isLoadingProcessOutputStatus } = useGetProcessOutputStatusQuery(undefined, {
    skip: !messages || messages.length === 0 || !lastUserMessage,
    pollingInterval: 1000,
  });

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (processOutputError) {
      console.error('Process output error:', processOutputError);
    }
  }, [processOutputError]);

  useEffect(() => {
    if (messages && messages.length > 0 && lastUserMessage && processOutputStatus?.isReady) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.contactId !== user?.id) {
        console.log('Bot reply detected → fetching process output');
        setShouldFetchProcessOutput(true);
      }
    }
  }, [messages, user?.id, lastUserMessage, processOutputStatus]);

  useEffect(() => {
    if (processOutputData?.output && processOutputData.output !== 'Waiting for eHuman response...') {
      setOutputExpanded(true);
    }
  }, [processOutputData?.output]);

  const errorMessage = error
    ? `Error sending message for: "${message}". Details: ` + ('data' in error && error.data
      ? JSON.stringify(error.data)
      : error.message || 'Unknown error')
    : null;

  function scrollToBottom() {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }

  function isFirstMessageOfGroup(item: Message, i: number) {
    if (!messages) return false;
    return i === 0 || (messages[i - 1] && messages[i - 1].contactId !== item.contactId);
  }

  function isLastMessageOfGroup(item: Message, i: number) {
    if (!messages) return false;
    return i === messages.length - 1 || (messages[i + 1] && messages[i + 1].contactId !== item.contactId);
  }

  function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
    setMessage(ev.target.value);
  }

  function onMessageSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (message === '' || !contactId) return;

    const payload = { message, chatId, contactId };

    console.group('🚀 Message Send Attempt');
    console.log('Payload:', payload);
    console.log('chatId:', chatId, 'contactId:', contactId);

    setLastUserMessage(message);
    setShouldFetchProcessOutput(false);
    setSendErrorDetails(null);   // clear previous error

    sendMessage(payload)
      .unwrap()
      .then((response) => {
        console.log('✅ Message sent successfully:', response);
        setMessage('');
        refetch();
        console.groupEnd();
      })
      .catch((sendError: any) => {
        console.error('❌ sendMessage failed:', sendError);
        setSendErrorDetails(sendError);
        setMessage('');                    // clear input so user can retry
        setLastUserMessage(undefined);
        setShouldFetchProcessOutput(false);
        console.groupEnd();
      });
  }

  const copyToClipboard = () => {
    const text = processOutputRef.current?.innerText || '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const copyThoughtStream = () => {
    const text = thoughtRef.current?.innerText || '';
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setThoughtCopied(true);
        setTimeout(() => setThoughtCopied(false), 1500);
      });
    }
  };

  const copyCognitiveSummary = () => {
    const text = reasoningRef.current?.innerText || '';
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setReasoningCopied(true);
        setTimeout(() => setReasoningCopied(false), 1500);
      });
    }
  };

  const outputText = isLoadingProcessOutput || isLoadingProcessOutputStatus
    ? 'Loading process output...'
    : processOutputError
    ? `Error loading process output: ${JSON.stringify(processOutputError)}`
    : processOutputData?.output || 'Waiting for eHuman response...';

  // Loading state
  if (isLoadingUser || isLoadingChats || isLoadingMessages || isLoadingContact) {
    return (
      <MainContainer>
        <ChatArea>
          <div className="flex flex-1 flex-col items-center justify-center p-24">
            <Typography variant="h6">Loading chat...</Typography>
          </div>
        </ChatArea>
      </MainContainer>
    );
  }

  if (!user || !chat) {
    return (
      <MainContainer>
        <ChatArea>
          <Error404Page />
        </ChatArea>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <ChatArea>
        <Box className="w-full border-b-1" sx={(theme) => ({ backgroundColor: lighten(theme.palette.background.default, 0.02) })}>
          <Toolbar className="flex items-center justify-between px-4 w-full">
            <div className="flex items-center">
              <IconButton aria-label="Open drawer" onClick={() => setMainSidebarOpen(true)} className="border border-divider flex lg:hidden">
                <ObjectAGISvgIcon>heroicons-outline:chat-bubble-left-right</ObjectAGISvgIcon>
              </IconButton>
              <div className="flex items-center cursor-pointer" onClick={() => setContactSidebarOpen(contactId)} role="button" tabIndex={0}>
                <UserAvatar className="relative mx-2" user={selectedContact} />
                <Typography color="inherit" className="text-lg font-semibold px-1">
                  {selectedContact?.name}
                </Typography>
              </div>
            </div>
            <ChatMoreMenu className="-mx-2" />
          </Toolbar>
        </Box>

        <div className="flex flex-auto h-full min-h-0 w-full">
          <div className={clsx('flex flex-1 z-10 flex-col relative', className)}>
            <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto">
              {/* Improved Error Display */}
              {sendErrorDetails && (
                <div style={{
                  color: 'red',
                  margin: '16px',
                  padding: '14px',
                  border: '2px solid red',
                  borderRadius: '8px',
                  backgroundColor: '#fff0f0',
                  fontSize: '0.95rem'
                }}>
                  <strong>❌ Could not send message</strong><br /><br />
                  Server error: <strong>{sendErrorDetails?.data?.errors?.message || 'Unknown server error'}</strong>

                  <details style={{ marginTop: '12px' }}>
                    <summary style={{ cursor: 'pointer', color: '#666' }}>Show full technical details</summary>
                    <pre style={{
                      fontSize: '0.85rem',
                      marginTop: 8,
                      padding: '10px',
                      backgroundColor: '#f8f8f8',
                      borderRadius: '4px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {JSON.stringify(sendErrorDetails, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {messages?.length > 0 ? (
                <div className="flex flex-col pt-4 px-4 pb-10">
                  {messages.map((item, i) => (
                    <StyledMessageRow
                      key={i}
                      className={clsx(
                        'flex flex-col grow-0 shrink-0 items-start justify-end relative px-4 pb-1',
                        user && item.contactId === user.id ? 'me' : 'contact',
                        { 'first-of-group': isFirstMessageOfGroup(item, i) },
                        { 'last-of-group': isLastMessageOfGroup(item, i) },
                        i + 1 === messages.length && 'pb-18'
                      )}
                    >
                      <div className="bubble flex items-center px-4 py-2.5 max-w-[75%] min-w-[60px] rounded-2xl">
                        <Typography sx={{ fontSize: '0.95rem', whiteSpace: 'pre-line', wordWrap: 'break-word', lineHeight: 1.4, width: '100%' }}>
                          {item.value}
                        </Typography>
                      </div>
                      {isLastMessageOfGroup(item, i) && (
                        <Typography className="timestamp text-xs mt-1 opacity-80" sx={{ color: 'text.secondary', alignSelf: user && item.contactId === user.id ? 'flex-end' : 'flex-start' }}>
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </Typography>
                      )}
                    </StyledMessageRow>
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center p-24">
                  <Typography color="text.secondary">Start a conversation!</Typography>
                </div>
              )}
            </div>

            {/* Message Input */}
            {messages && (
              <Paper square component="form" onSubmit={onMessageSubmit} className="absolute border-t-1 bottom-0 right-0 left-0 py-4 px-4"
                sx={(theme) => ({ backgroundColor: lighten(theme.palette.background.default, 0.02) })}>
                <div className="flex items-center relative">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', animation: `${pulse} 2s infinite cubic-bezier(0.4, 0, 0.6, 1)` }} />
                  </Box>

                  <IconButton type="submit">
                    <ObjectAGISvgIcon className="text-3xl" color="action">heroicons-outline:paper-clip</ObjectAGISvgIcon>
                  </IconButton>

                  <InputBase
                    autoFocus={false}
                    id="message-input"
                    className="flex-1 flex grow shrink-0 mx-2 border-2"
                    placeholder="Send to eHuman"
                    onChange={onInputChange}
                    value={message}
                    sx={{ backgroundColor: 'background.paper' }}
                    disabled={isSending}
                  />

                  <IconButton type="submit" disabled={isSending}>
                    <ObjectAGISvgIcon color="action">heroicons-outline:paper-airplane</ObjectAGISvgIcon>
                  </IconButton>
                </div>
              </Paper>
            )}
          </div>
        </div>
      </ChatArea>

      {/* Collapsible Panels */}
      <Box sx={{ width: '100%' }}>
        {/* Thought Stream */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, backgroundColor: '#1e1e1e', borderTop: '1px solid #444', borderBottom: thoughtExpanded ? 'none' : '1px solid #444', borderRadius: thoughtExpanded ? '4px 4px 0 0' : '4px', cursor: 'pointer' }}
            onClick={() => setThoughtExpanded(!thoughtExpanded)}>
            <Typography variant="caption" sx={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: 1, fontFamily: '"Consolas", monospace' }}>
              {thoughtExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              Thought Stream {thoughtExpanded ? '(click to collapse)' : '(click to expand)'}
            </Typography>
          </Box>
          <Collapse in={thoughtExpanded} timeout={400} unmountOnExit>
            <ProcessOutput sx={{ height: 'auto', maxHeight: '80vh', minHeight: '300px', borderTop: 'none', mt: 0 }}>
              <IconButton size="small" onClick={copyThoughtStream} sx={{ position: 'absolute', top: 8, right: 8, color: '#888' }}>
                {thoughtCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
              <pre ref={thoughtRef} style={{ margin: 0, whiteSpace: 'pre-wrap', padding: '32px 16px 16px', fontSize: '13px' }}>
                {thoughtData?.stream || "Awaiting thought stream..."}
              </pre>
            </ProcessOutput>
          </Collapse>
        </Box>

        {/* Cognitive Summary */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, backgroundColor: '#1e1e1e', borderTop: '1px solid #444', borderBottom: reasoningExpanded ? 'none' : '1px solid #444', borderRadius: reasoningExpanded ? '4px 4px 0 0' : '4px', cursor: 'pointer' }}
            onClick={() => setCognitiveSummaryExpanded(!reasoningExpanded)}>
            <Typography variant="caption" sx={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: 1, fontFamily: '"Consolas", monospace' }}>
              {reasoningExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              Cognitive Summary {reasoningExpanded ? '(click to collapse)' : '(click to expand)'}
            </Typography>
          </Box>
          <Collapse in={reasoningExpanded} timeout={400} unmountOnExit>
            <ProcessOutput sx={{ height: 'auto', maxHeight: '80vh', minHeight: '300px', borderTop: 'none', mt: 0 }}>
              <IconButton size="small" onClick={copyCognitiveSummary} sx={{ position: 'absolute', top: 8, right: 8, color: '#888' }}>
                {reasoningCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
              <pre ref={reasoningRef} style={{ margin: 0, whiteSpace: 'pre-wrap', padding: '32px 16px 16px', fontSize: '13px' }}>
                {cogData?.summary || "No cognitive summary available."}
              </pre>
            </ProcessOutput>
          </Collapse>
        </Box>

        {/* System Output */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, backgroundColor: '#1e1e1e', borderTop: '1px solid #444', borderBottom: outputExpanded ? 'none' : '1px solid #444', borderRadius: outputExpanded ? '4px 4px 0 0' : '4px', cursor: 'pointer' }}
            onClick={() => setOutputExpanded(!outputExpanded)}>
            <Typography variant="caption" sx={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: 1, fontFamily: '"Consolas", monospace' }}>
              {outputExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              System Output {outputExpanded ? '(click to collapse)' : '(click to expand)'}
            </Typography>
          </Box>
          <Collapse in={outputExpanded} timeout={400} unmountOnExit>
            <ProcessOutput sx={{ height: 'auto', maxHeight: '80vh', minHeight: '300px', borderTop: 'none', mt: 0 }}>
              <IconButton size="small" onClick={copyToClipboard} sx={{ position: 'absolute', top: 8, right: 8, color: '#888' }}>
                {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
              <pre ref={processOutputRef} style={{ margin: 0, whiteSpace: 'pre-wrap', padding: '32px 16px 16px', fontSize: '13px' }}>
                {outputText}
              </pre>
            </ProcessOutput>
          </Collapse>
        </Box>
      </Box>
    </MainContainer>
  );
}

export default Chat;