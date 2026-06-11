'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Paper,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';

export default function DeploymentConditionsView() {
  const [tabValue, setTabValue] = useState(0);
  const [deploymentMode, setDeploymentMode] = useState('Immediate');
  const [conditionals, setConditionals] = useState([
    { id: Date.now(), statement: '', target: '', action: '' }
  ]);

  // --- MODERN PROFESSIONAL SELECT STYLE ---
  const selectStyle = {
    bgcolor: 'white',
    color: '#1e293b', // Deep Slate Text
    fontWeight: 400,   // Lighter weight
    fontSize: '0.875rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '& .MuiSelect-icon': { color: '#64748b' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }, // Soft border
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6', borderWeight: '1px' },
  };

  const addConditional = () => {
    setConditionals([...conditionals, { id: Date.now(), statement: '', target: '', action: '' }]);
  };

  const removeConditional = (id: number) => {
    setConditionals(conditionals.filter(c => c.id !== id));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <Box sx={{ p: 4, pb: 2, bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h5" fontWeight="600" color="#0f172a">Deployment Conditions</Typography>
          <Typography variant="body2" color="text.secondary">Configure logic-based triggers for entity lifecycle.</Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ bgcolor: 'white' }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, v) => setTabValue(v)} 
            sx={{ 
              px: 3, 
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minHeight: 64 } 
            }}
          >
            <Tab label="Conditionals" />
            <Tab label="Deployment History" />
            <Tab label="Schedule" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
          {tabValue === 0 && (
            <Box sx={{ maxWidth: 1000 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                Core Deployment Trigger
              </Typography>
              
              <Card variant="outlined" sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ p: 4 }}>
                  <RadioGroup 
                    row 
                    value={deploymentMode} 
                    onChange={(e) => setDeploymentMode(e.target.value)} 
                    sx={{ mb: 4, gap: 6 }}
                  >
                    <FormControlLabel 
                      value="Immediate" 
                      control={<Radio size="small" />} 
                      label={<Typography variant="body1" fontWeight={500} color="#334155">Immediate</Typography>} 
                    />
                    <FormControlLabel 
                      value="Conditional" 
                      control={<Radio size="small" />} 
                      label={<Typography variant="body1" fontWeight={500} color="#334155">Conditional</Typography>} 
                    />
                  </RadioGroup>

                  {deploymentMode === 'Immediate' ? (
                    <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f0f9ff', borderColor: '#bae6fd', borderRadius: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 8, height: 8, bgcolor: '#0284c7', borderRadius: '50%' }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600" color="#0369a1">System Ready</Typography>
                          <Typography variant="body2" color="#0c4a6e">Entity will deploy instantly upon session start without further checks.</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ) : (
                    <Box>
                      {conditionals.map((cond) => (
                        <Grid container spacing={2} key={cond.id} sx={{ mb: 2 }} alignItems="center">
                          <Grid item xs={12} md={3.5}>
                            <FormControl fullWidth size="small">
                              <Select sx={selectStyle} defaultValue="" displayEmpty renderValue={(v) => v === "" ? <span style={{color: '#94a3b8'}}>Statement</span> : v}>
                                <MenuItem value="if">IF (Single Check)</MenuItem>
                                <MenuItem value="while">WHILE (Looping)</MenuItem>
                                <MenuItem value="when">WHEN (Event-driven)</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3.5}>
                            <FormControl fullWidth size="small">
                              <Select sx={selectStyle} defaultValue="" displayEmpty renderValue={(v) => v === "" ? <span style={{color: '#94a3b8'}}>Target Entity</span> : v}>
                                <MenuItem value="eHuman">eHuman_Primary</MenuItem>
                                <MenuItem value="drone">Drone_A1</MenuItem>
                                <MenuItem value="env">Global_Environment</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                              <Select sx={selectStyle} defaultValue="" displayEmpty renderValue={(v) => v === "" ? <span style={{color: '#94a3b8'}}>System Action</span> : v}>
                                <MenuItem value="strike">Strike Lightning</MenuItem>
                                <MenuItem value="counter">Deploy Countermeasure</MenuItem>
                                <MenuItem value="log">Log Interaction</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton 
                              onClick={() => removeConditional(cond.id)} 
                              size="small"
                              sx={{ color: '#cbd5e1', '&:hover': { color: '#ef4444' } }}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      
                      <Button 
                        startIcon={<AddIcon />} 
                        onClick={addConditional} 
                        sx={{ 
                          mt: 1, 
                          color: '#475569', 
                          textTransform: 'none', 
                          fontWeight: 600,
                          '&:hover': { bgcolor: '#f1f5f9' } 
                        }}
                      >
                        Add another condition
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="text" sx={{ color: '#64748b', textTransform: 'none' }}>Cancel</Button>
                <Button 
                  variant="contained" 
                  disableElevation 
                  sx={{ bgcolor: '#0f172a', textTransform: 'none', px: 4, borderRadius: 2 }}
                >
                  Save Deployment Settings
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}