'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';

interface MemoryEntry {
  memoryID: number;
  aI_Mindstate_Type: string | null;
  mindstate_Reason: string | null;
  mindstate_Data_Item: string | null;
  mindstate_Source_Identity: string | null;
  mindstate_Duration: string | null;
  mindstate_Absolve_Rate: number | null;
  mindstate_Intensity: number | null;
  emotion_Type: string | null;
  emotion_Reason: string | null;
  emotion_Data_Item: string | null;
  emotion_Source_Identity: string | null;
  emotion_Duration: string | null;
  emotion_Absolve_Rate: number | null;
  emotion_Intensity: number | null;
  wordObjectStringMemory: string | null;
  word_Count: number | null;
  partOfSentence: string | null;
  typeCategory: string | null;
  memoryOf_Statementofsentence: string | null;
  memoryOf_Sel_Physical_Feeling: string | null;
  memoryOf_Sel_Emotion: string | null;
  memoryOf_Sel_Mindstate: string | null;
  memoryOf_LocationofEvent: string | null;
  memoryOf_ThoughtOfbject: string | null;
  memoryOf_IdentityofPerception: string | null;
  memoryOf_Size: string | null;
  memoryOf_Shape: string | null;
  memoryOf_Dimension: string | null;
  memoryOf_Length: string | null;
  memoryOf_Width: string | null;
  memoryOf_Height: string | null;
  memoryOf_Texture: string | null;
  memoryOf_Speed: string | null;
  memoryOf_Direction: string | null;
  memoryOf_Location: string | null;
  memoryOf_Color: string | null;
  memoryOf_Sound: string | null;
  memoryOf_Taste: string | null;
  memoryOf_Scent: string | null;
  memoryOf_Touch: string | null;
  memoryOf_AssociatedEvent: string | null;
  isMemory_Internal_External: string | null;
  value: number | null;
  timestamp: string | null;
}

export default function MemoryAdministration() {
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const response = await fetch('http://localhost:5275/api/MemoryManagement');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data: MemoryEntry[] = await response.json();
        setMemoryEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load memory entries');
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading cognitive memories...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
        Memory Management
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 5 }}>
        Active cognitive memories and emotional states across AGI entities
      </Typography>

      <Grid container spacing={3}>
        {memoryEntries.map((entry) => (
          <Grid item xs={12} key={entry.memoryID}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 4 }}>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                    MEM-{String(entry.memoryID).padStart(4, '0')}
                  </Typography>
                  <Chip 
                    label={entry.typeCategory || 'Uncategorized'} 
                    size="small" 
                    sx={{ fontWeight: 600 }} 
                  />
                </Stack>

                {/* Mindstate */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary">MINDSTATE</Typography>
                  <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 0.5 }}>
                    {entry.aI_Mindstate_Type || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.mindstate_Reason || '—'}
                  </Typography>
                </Box>

                {/* Emotion */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary">EMOTION</Typography>
                  <Typography variant="subtitle1" fontWeight="600" color="primary.main" sx={{ mt: 0.5 }}>
                    {entry.emotion_Type || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.emotion_Reason || '—'}
                  </Typography>
                </Box>

                {/* Stored Memory Content */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="caption" color="text.secondary">STORED MEMORY</Typography>
                  <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
                    {entry.wordObjectStringMemory || '—'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Intensity Bars */}
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Mindstate Intensity</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={entry.mindstate_Intensity || 0} 
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        color="primary"
                      />
                      <Typography fontWeight="bold">{entry.mindstate_Intensity || 0}%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Emotion Intensity</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={entry.emotion_Intensity || 0} 
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        color="secondary"
                      />
                      <Typography fontWeight="bold">{entry.emotion_Intensity || 0}%</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* All Remaining Fields */}
                <Grid container spacing={2} sx={{ mt: 5 }}>
                  {Object.entries(entry)
                    .filter(([key]) => !['memoryID', 'aI_Mindstate_Type', 'mindstate_Reason', 
                                         'emotion_Type', 'emotion_Reason', 'wordObjectStringMemory', 
                                         'mindstate_Intensity', 'emotion_Intensity', 'typeCategory'].includes(key))
                    .map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {value !== null && value !== undefined ? String(value) : '—'}
                        </Typography>
                      </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Timestamp: {entry.timestamp || '—'}
                  </Typography>
                  <Chip 
                    label={`Value: ${entry.value ?? '—'}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {memoryEntries.length === 0 && (
          <Grid item xs={12}>
            <Typography>No memory entries found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}