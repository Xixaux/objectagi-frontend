'use client';

import { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';

function SimpleChat() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const lowerInput = input.trim().toLowerCase();

    if (lowerInput === 'hello' || lowerInput === 'hi' || lowerInput === 'hey') {
      setOutput('hiya');
    } else {
      setOutput('I only understand "hello" for now 😄');
    }

    setInput(''); // clear input after sending
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 4,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Simple Input → Output
      </Typography>

      {/* Output area */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          flex: 1,
          minHeight: 200,
          bgcolor: 'grey.50',
          overflowY: 'auto',
          borderRadius: 2,
        }}
      >
        {output ? (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {output}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Type "hello" and press Enter or Send...
          </Typography>
        )}
      </Paper>

      {/* Input + send button */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          autoFocus
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </form>
    </Box>
  );
}

export default SimpleChat;