'use client';

import { Box } from '@mui/material';
import { useEffect, useRef, Fragment } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { Person as AdminIcon, SmartToy as EHumanIcon } from '@mui/icons-material';

interface ChatViewProps {
  chatMessages: any[];
  selectedUser: string;
}

function ChatView({ chatMessages, selectedUser }: ChatViewProps) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const bubbleStyle = (isUser: boolean) => ({
    p: '12px 18px',
    borderRadius: '1.75rem',
    backgroundColor: isUser ? '#1e40af' : '#312e81',
    color: 'white',
    boxShadow: isUser
      ? '0 6px 20px rgba(30, 64, 175, 0.28)'
      : '0 6px 20px rgba(49, 46, 129, 0.28)',
    border: isUser
      ? '1px solid rgba(99, 102, 241, 0.4)'
      : '1px solid rgba(129, 140, 248, 0.35)',
    backdropFilter: 'blur(4px)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    width: 'fit-content',              // Shrinks to content
    maxWidth: '70%',                   // Caps long messages
    minWidth: '80px',                  // Prevents tiny bubbles
    display: 'inline-block',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: isUser
        ? '0 12px 32px rgba(30, 64, 175, 0.38)'
        : '0 12px 32px rgba(49, 46, 129, 0.38)',
    },
  });

  return (
    <Paper
      variant="outlined"
      sx={{ height: '100%', p: 3, overflowY: 'auto', bgcolor: 'grey.50' }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#00A4EF',
          mb: 2,
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 229, 255, 0.2)',
          fontWeight: 700,
          letterSpacing: '0.05rem',
          textTransform: 'uppercase',
          fontSize: '0.85rem',
        }}
      >
        Conversation with: {selectedUser}
      </Typography>

      <List
        ref={chatRef}
        sx={{
          overflowY: 'auto',
          height: 'calc(100% - 60px)',
          p: 0,
        }}
      >
        {chatMessages.map((msg, index) => {
          const isUserMessage = msg.isUser === true;

          return (
            <Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  justifyContent: isUserMessage ? 'flex-end' : 'flex-start',
                  py: 0.5,
                  px: 2, // Slight padding so bubbles don't touch screen edge
                }}
              >
                {/* eHuman avatar on left */}
                {!isUserMessage && (
                  <ListItemAvatar sx={{ minWidth: 40, mr: 1 }}>
                    <Avatar sx={{ bgcolor: '#312e81' }}>
                      <EHumanIcon />
                    </Avatar>
                  </ListItemAvatar>
                )}

                <Box
                  sx={{
                    maxWidth: '70%',
                    width: 'fit-content',
                    textAlign: isUserMessage ? 'right' : 'left',
                  }}
                >
                  <ListItemText
                    primary={msg.content || msg.sentQuery || msg.response || 'No content'}
                    secondary={new Date(msg.timestamp).toLocaleString()}
                    sx={{
                      m: 0,
                      '& .MuiListItemText-primary': bubbleStyle(isUserMessage),
                      '& .MuiListItemText-secondary': {
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: '0.73rem',
                        mt: 0.75,
                        textAlign: isUserMessage ? 'right' : 'left',
                      },
                    }}
                  />
                </Box>

                {/* User avatar on right */}
                {isUserMessage && (
                  <ListItemAvatar sx={{ minWidth: 40, ml: 1 }}>
                    <Avatar sx={{ bgcolor: '#1e40af' }}>
                      <AdminIcon />
                    </Avatar>
                  </ListItemAvatar>
                )}
              </ListItem>
            </Fragment>
          );
        })}
      </List>
    </Paper>
  );
}

export default ChatView;