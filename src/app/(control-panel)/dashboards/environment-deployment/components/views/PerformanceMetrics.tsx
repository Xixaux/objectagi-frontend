'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  InputAdornment,
  Rating,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,           // ← Added this import
} from '@mui/material';
import {
  TrendingUp,
  Gavel,
  FlashOn,
  Timer,
  Shield,
  Add,
  DeleteOutline,
  Search,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function PerformanceProfileView() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/PerformanceMetrics', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      } catch (err: any) {
        console.error('Failed to fetch performance metrics:', err);
        setError(err.message || 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter for Censorship tab
  const filteredPolicies = useMemo(() => {
    return data.filter(item => 
      item.entityType === 'CensorshipPolicy' &&
      (item.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.policyCategory?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  // Agent performance data
  const agentData = useMemo(() => {
    return data.filter(item => item.entityType === 'Agent');
  }, [data]);

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
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}
        >
          <Tab label="Overview" />
          <Tab label="Censorship & Safety" />
        </Tabs>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          
          {/* TAB 0: OVERVIEW */}
          {tabValue === 0 && (
            <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.50' }}>
                    <FlashOn color="primary" sx={{ mb: 1, fontSize: 40 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {data.find(d => d.totalWillpowerForceKn)?.totalWillpowerForceKn || '—'} kN
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Total Willpower Force Usage</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'success.50' }}>
                    <TrendingUp color="success" sx={{ mb: 1, fontSize: 40 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {data.find(d => d.avgSurvivalRating)?.avgSurvivalRating?.toFixed(2) || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Avg Survival Rating</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.50' }}>
                    <Gavel color="warning" sx={{ mb: 1, fontSize: 40 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {data.find(d => d.totalOutstandingConflicts)?.totalOutstandingConflicts || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Outstanding Conflicts</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'info.50' }}>
                    <Timer color="info" sx={{ mb: 1, fontSize: 40 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {data.find(d => d.maxUptimeHours)?.maxUptimeHours || '—'}h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Max Uptime</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Card variant="outlined">
                <TableContainer>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>eHuman Name</strong></TableCell>
                        <TableCell><strong>Social Stability</strong></TableCell>
                        <TableCell><strong>Friendship Ratio</strong></TableCell>
                        <TableCell><strong>Willpower Force Usage</strong></TableCell>
                        <TableCell><strong>Outstanding Conflicts</strong></TableCell>
                        <TableCell><strong>Survival Rating</strong></TableCell>
                        <TableCell><strong>eHuman Collaborations</strong></TableCell>
                        <TableCell><strong>Uptime</strong></TableCell>
                        <TableCell><strong>Longest Effort</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {agentData.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell sx={{ fontWeight: 'bold' }}>{row.entityName}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{ flex: 1, height: 4, bgcolor: 'grey.200', borderRadius: 2 }}>
                                <Box sx={{ width: `${row.socialStability || 0}%`, height: '100%', bgcolor: 'success.main', borderRadius: 2 }} />
                              </Box>
                              <Typography variant="caption">{row.socialStability || '—'}%</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{row.friendshipRatio || '—'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${row.willpowerForceUsageKn || '—'} kN`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">{row.outstandingConflicts || 0}</TableCell>
                          <TableCell>
                            <Rating 
                              value={row.survivalRating ? row.survivalRating / 2 : 0} 
                              precision={0.1} 
                              size="small" 
                              readOnly 
                            />
                          </TableCell>
                          <TableCell align="center">{row.ehumanCollaborations || '—'}</TableCell>
                          <TableCell>{row.uptimeHours ? `${row.uptimeHours}h` : '—'}</TableCell>
                          <TableCell>{row.longestEffortHours ? `${row.longestEffortHours}h` : '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}

          {/* TAB 1: CENSORSHIP & SAFETY */}
          {tabValue === 1 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h6">Active Policies</Typography>
                        <TextField 
                          size="small" 
                          placeholder="Search flagged terms..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          InputProps={{ 
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search fontSize="small" />
                              </InputAdornment>
                            ) 
                          }}
                        />
                      </Stack>

                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>Flagged Term</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }} align="right">Hits</TableCell>
                              <TableCell align="center">Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredPolicies.map((policy) => (
                              <TableRow key={policy.id} hover>
                                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                  {policy.entityName || policy.flaggedTerm || '—'}
                                </TableCell>
                                <TableCell>
                                  <Chip label={policy.policyCategory || '—'} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" sx={{ 
                                    color: policy.severity === 'Critical' ? 'error.main' : 
                                           policy.severity === 'High' ? 'warning.main' : 'text.primary',
                                    fontWeight: 'bold' 
                                  }}>
                                    {policy.severity || '—'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ 
                                      width: 8, 
                                      height: 8, 
                                      borderRadius: '50%', 
                                      bgcolor: policy.policyStatus === 'Active' ? 'success.main' : 'warning.main' 
                                    }} />
                                    <Typography variant="body2">{policy.policyStatus || '—'}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="right">{policy.hits?.toLocaleString() || '—'}</TableCell>
                                <TableCell align="center">
                                  <IconButton size="small" color="error">
                                    <DeleteOutline fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack spacing={3}>
                    <Card sx={{ bgcolor: 'primary.dark', color: 'white' }}>
                      <CardContent>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Shield fontSize="small" />
                            <Typography variant="subtitle2" fontWeight="bold">QUICK POLICY ENFORCEMENT</Typography>
                          </Box>
                          <TextField fullWidth size="small" placeholder="Enter term..." variant="filled" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                          <Button variant="contained" color="secondary" startIcon={<Add />} fullWidth>
                            Add to Blacklist
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}