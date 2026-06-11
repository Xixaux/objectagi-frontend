'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import {
  AddCircle,
  PauseCircle,
  StopCircle,
} from '@mui/icons-material';

interface LifecycleEntry {
  lifecycleID: number;
  agentID: string | null;
  triggerCondition: string | null;
  currentStatus: string | null;
  lastAction: string | null;
  actionTimestamp: string | null;
  reason: string | null;
  initiatedBy: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function LifeCycleManagement() {
  const [triggerCondition, setTriggerCondition] = useState('');
  const [lifecycleEntries, setLifecycleEntries] = useState<LifecycleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchLifecycleData = async () => {
      try {
        const response = await fetch('http://localhost:5275/api/LifecycleManagement');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data: LifecycleEntry[] = await response.json();
        setLifecycleEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lifecycle data');
      } finally {
        setLoading(false);
      }
    };

    fetchLifecycleData();
  }, []);

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Loading lifecycle history...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
          AI Management & Termination
        </Typography>

        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Grid container spacing={6} alignItems="start">
            
            {/* Schedule Conditional Termination */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Schedule Conditional Termination
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Schedule automatic termination based on specific conditions
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Trigger Condition</InputLabel>
                <Select 
                  value={triggerCondition} 
                  onChange={(e) => setTriggerCondition(e.target.value)}
                  label="Trigger Condition"
                >
                  <MenuItem value="">Select condition...</MenuItem>
                  <MenuItem value="noncompliance">When AI Refuses to Comply</MenuItem>
                  <MenuItem value="ethics">Ethics Violation Detected</MenuItem>
                  <MenuItem value="resource">Excessive Resource Usage</MenuItem>
                  <MenuItem value="anomaly">Behavioral Anomaly</MenuItem>
                  <MenuItem value="manual">Manual Override</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Immediate Actions */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
                Immediate Actions
              </Typography>
              <Stack spacing={3}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="success" 
                  startIcon={<AddCircle />} 
                  sx={{ py: 2 }}
                >
                  Promote Agent
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="warning" 
                  startIcon={<PauseCircle />} 
                  sx={{ py: 2 }}
                >
                  Suspend Agent
                </Button>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="error" 
                  startIcon={<StopCircle />} 
                  sx={{ py: 2 }}
                >
                  Terminate Agent
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6 }} />

          {/* Lifecycle History */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Lifecycle History
          </Typography>

          <Grid container spacing={3}>
            {lifecycleEntries.map((entry) => (
              <Grid item xs={12} md={6} lg={4} key={entry.lifecycleID}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                        LC-{String(entry.lifecycleID).padStart(4, '0')}
                      </Typography>
                      <Chip 
                        label={entry.currentStatus || 'Unknown'} 
                        color={
                          entry.currentStatus === 'Active' ? 'success' :
                          entry.currentStatus === 'Suspended' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </Stack>

                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Agent: {entry.agentID || '—'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Trigger: <strong>{entry.triggerCondition || '—'}</strong>
                    </Typography>

                    {entry.lastAction && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Last Action: <strong>{entry.lastAction}</strong>
                      </Typography>
                    )}

                    {entry.reason && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Reason: {entry.reason}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                      Initiated by: {entry.initiatedBy || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Updated: {entry.actionTimestamp || entry.updatedAt || '—'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {lifecycleEntries.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary" align="center">
                  No lifecycle records found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}