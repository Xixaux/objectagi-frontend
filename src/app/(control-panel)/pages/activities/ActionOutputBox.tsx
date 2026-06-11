// src/app/(control-panel)/pages/activities/ActionOutputBox.tsx
'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SectionHeader } from './ActivitiesPage'; // We'll export it or duplicate if preferred

interface ActionOutputBoxProps {
  actionResult: string[];
  userInput: string;
  setUserInput: (value: string) => void;
  handleUserInputSubmit: (e: React.FormEvent) => void;
  handleInitiateAction: () => void;
  canInitiate: boolean;
  currentOperation: 'none' | 'compare' | 'repeat' | 'stop';
  selectedItemsLength: number;
}

export default function ActionOutputBox({
  actionResult,
  userInput,
  setUserInput,
  handleUserInputSubmit,
  handleInitiateAction,
  canInitiate,
  currentOperation,
  selectedItemsLength,
}: ActionOutputBoxProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '6xl',
        height: '600px',
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'gray.300',
        borderRadius: 'lg',
        boxShadow: 'md',
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        mt: 6,
      }}
    >
      <SectionHeader accentColor="text-purple-800">Action Output</SectionHeader>

      {actionResult.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 italic">
          No output yet
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto space-y-2 mb-4">
          {actionResult.map((result, idx) => (
            <li key={idx} className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800">
              {result}
            </li>
          ))}
        </ul>
      )}

      <Box
        component="form"
        onSubmit={handleUserInputSubmit}
        sx={{ display: 'flex', gap: 2, mt: 2 }}
      >
        <TextField
          label="Add note / command / follow-up / trigger phrase"
          variant="outlined"
          size="medium"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          disabled={userInput.trim() === ''}
        >
          Submit
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleInitiateAction}
        size="large"
        disabled={!canInitiate}
        sx={{ opacity: canInitiate ? 1 : 0.6 }}
      >
        {canInitiate
          ? 'Initiate Action'
          : selectedItemsLength === 0
          ? 'Select at least 1 object'
          : 'Select an operation'}
      </Button>
    </Box>
  );
}