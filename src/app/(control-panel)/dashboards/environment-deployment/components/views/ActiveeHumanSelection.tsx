'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
} from '@mui/material';

interface eHumanLibrary {
  aiLibraryID: number;
  aI_FirstName: string | null;
  aI_LastName: string | null;
  objectiveCategory?: string | null;
}

interface ActiveeHumanSelectionProps {
  selectedAgentId: string;
  onAgentChange: (agentId: string) => void;
}

export default function ActiveeHumanSelection({ 
  selectedAgentId, 
  onAgentChange 
}: ActiveeHumanSelectionProps) {
  const [eHumans, setEHumans] = useState<eHumanLibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5275/api/eHumanLibrary')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setEHumans(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
      <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
        Active eHuman
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Select eHuman</InputLabel>
        
        <Select
          value={selectedAgentId || ''}
          label="Select eHuman"
          onChange={(e) => onAgentChange(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="">— Select an Agent —</MenuItem>

          {loading && (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
            </MenuItem>
          )}

          {error && <MenuItem disabled>Error loading agents</MenuItem>}

          {!loading && !error && eHumans.map((human) => {
            const fullName = `${human.aI_FirstName?.trim() || ''} ${human.aI_LastName?.trim() || ''}`.trim();
            const displayName = fullName || `Agent #${human.aiLibraryID}`;

            return (
              <MenuItem 
                key={human.aiLibraryID} 
                value={human.aiLibraryID.toString()}
              >
                {displayName}
                {human.objectiveCategory && ` — ${human.objectiveCategory.trim()}`}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Divider sx={{ mb: 3 }} />
    </Box>
  );
}