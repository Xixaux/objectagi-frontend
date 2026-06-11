// src/app/(control-panel)/pages/activities/InputOutput.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
} from '@mui/material';
import ObjectAGIPageSimple from '@objectagi/core/ObjectAGIPageSimple';
import useThemeMediaQuery from '@objectagi/hooks/useThemeMediaQuery';
import ActivitiesPageHeader from '../ActivitiesPageHeader';

export default function InputOutput() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const handleProcess = () => {
    if (!input.trim()) return;
    setOutput((prev) => [`→ ${input.trim()}`, ...prev]);
    setInput('');
  };

  return (
    <ObjectAGIPageSimple
      content={
        <div className="flex flex-col w-full h-full p-6 md:p-12">
          {/* Render the shared header with navigation buttons */}
          <ActivitiesPageHeader />

          {/* Main content */}
          <Box sx={{ maxWidth: 900, width: '100%', mx: 'auto', mt: 4 }}>
            <Typography variant="h5" fontWeight="medium" gutterBottom sx={{ mb: 4 }}>
              Input / Output Monitor
            </Typography>

            <Paper elevation={3} sx={{ p: 4, mb: 5 }}>
              <TextField
                label="Enter input (text, command, object...)"
                multiline
                rows={5}
                fullWidth
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or paste here..."
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleProcess}
                disabled={!input.trim()}
                fullWidth
              >
                Process Input
              </Button>
            </Paper>

            {output.length > 0 ? (
              <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Output Log
                </Typography>
                <Box sx={{ maxHeight: 400, overflowY: 'auto', pt: 1 }}>
                  {output.map((line, i) => (
                    <Typography
                      key={i}
                      variant="body1"
                      sx={{
                        mb: 1.5,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {line}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            ) : (
              <Typography
                color="text.secondary"
                align="center"
                sx={{ py: 8, fontStyle: 'italic' }}
              >
                No output yet — enter something above and press Process
              </Typography>
            )}
          </Box>
        </div>
      }
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}