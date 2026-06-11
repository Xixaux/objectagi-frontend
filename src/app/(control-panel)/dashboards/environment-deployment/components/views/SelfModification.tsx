// =============================================
// IMPORTANT: Backend Save Functionality Missing
// =============================================
//
// The toggle switches (Switch components) now correctly work with real boolean values 
// from the database (true / false / null).
//
// However, changes made to the toggles are currently stored ONLY in local React state.
//
// To make changes persistent:
//   1. Add a PATCH endpoint in SelfModificationController.cs 
//      (e.g. PATCH /api/SelfModification/{id})
//   2. Update this component to call the endpoint when user clicks "Save"
//   3. Optionally refresh the data after successful save
//
// Current state: UI toggles are functional but non-persistent (lost on refresh)
// =============================================
// 
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { motion } from 'framer-motion';

export default function SelfModification() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5275/api/SelfModification', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Failed to fetch SelfModification data:', err);
        setError(err.message || 'Failed to load self-modification properties');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Updated handler - now works with real boolean values
  const handleToggleChange = (id: number, field: string, checked: boolean) => {
    setProperties(prev =>
      prev.map(item =>
        item.selfModID === id 
          ? { ...item, [field]: checked } 
          : item
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
        Self-Modification Properties
      </Typography>

      <Grid container spacing={4}>
        {properties.map((prop, index) => (
          <Grid item xs={12} key={prop.selfModID}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      SM-{prop.selfModID} — {prop.self_Modification_Type?.trim() || 'Unnamed Modification'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {prop.category?.trim() || '—'} • Location: {prop.location?.trim() || '—'}
                    </Typography>
                  </Box>

                  <Chip
                    label={prop.execution_Attribute?.trim() || 'Unknown'}
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Boolean Toggles - Updated for real boolean values */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.is_Self_Aware === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'is_Self_Aware', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Is Self-Aware"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.can_Write_Source_Code === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'can_Write_Source_Code', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Can Write Source Code"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.can_Modify_Thought_Speed === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'can_Modify_Thought_Speed', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Can Modify Thought Speed"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.can_Modify_Thought_Storage_Space === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'can_Modify_Thought_Storage_Space', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Can Modify Thought Storage Space"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.can_Modify_Other_AI === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'can_Modify_Other_AI', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Can Modify Other AI"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.can_Modify_Memories === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'can_Modify_Memories', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Can Modify Memories"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.can_Modify_Skills_Learned === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'can_Modify_Skills_Learned', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Can Modify Skills Learned"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.can_View_Own_Design === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'can_View_Own_Design', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Can View Own Design"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prop.can_Modify_Own_Instincts === true}
                          onChange={(e) => handleToggleChange(prop.selfModID, 'can_Modify_Own_Instincts', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Can Modify Own Instincts"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Execution Information */}
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Execution Attribute
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {prop.execution_Attribute?.trim() || '—'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Condition To Execute
                    </Typography>
                    <Typography variant="body2">
                      {prop.condition_To_Execute?.trim() || '—'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Revoke Condition
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      {prop.revoke_SelfModification_Condition?.trim() || '—'}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Note: Saving not yet implemented */}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  * Toggle changes are local only. Backend save functionality not yet added.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}