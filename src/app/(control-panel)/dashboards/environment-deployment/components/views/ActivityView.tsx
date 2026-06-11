'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
  Chip,
  InputAdornment,
  Stack,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import LeftAppToolbar from '../../../components/LeftAppToolbar';

export default function ActivityView() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const eUniverseData = [
    { id: 1, eUniverseId: 'EU-001', environmentName: 'Primary Simulation', currentIncrement: 1428, totalIncrements: 5000, objects: 124587, eHumans: 8924, users: 312, presentIds: 'USR-001, USR-045, AI-007', createdDate: '2025-03-15', expirationDate: '2027-12-31', status: 'Active' },
    { id: 2, eUniverseId: 'EU-002', environmentName: 'Experimental Branch', currentIncrement: 876, totalIncrements: 2000, objects: 45678, eHumans: 2341, users: 89, presentIds: 'USR-112, AI-023', createdDate: '2025-08-01', expirationDate: '2026-08-01', status: 'Testing' },
    { id: 3, eUniverseId: 'EU-003', environmentName: 'Archive Mirror', currentIncrement: 5000, totalIncrements: 5000, objects: 98765, eHumans: 5678, users: 0, presentIds: 'None', createdDate: '2024-11-20', expirationDate: '2026-11-20', status: 'Archived' },
    { id: 4, eUniverseId: 'EU-004', environmentName: 'High-Intensity Test', currentIncrement: 215, totalIncrements: 1000, objects: 67890, eHumans: 1234, users: 156, presentIds: 'USR-003, USR-078, AI-015, AI-042', createdDate: '2026-01-01', expirationDate: '2026-12-31', status: 'Active' },
  ];

  const filteredData = useMemo(() => {
    if (!searchTerm) return eUniverseData;
    const lowerSearch = searchTerm.toLowerCase();
    return eUniverseData.filter(row => 
      Object.values(row).some(val => String(val).toLowerCase().includes(lowerSearch))
    );
  }, [searchTerm, eUniverseData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Testing': return 'warning';
      case 'Archived': return 'default';
      default: return 'primary';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        <LeftAppToolbar />

        <Box sx={{ flex: 1, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 2, md: 4 }, pb: 2 }}>
            <Typography variant="h5" fontWeight="600">Activity</Typography>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
              <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab label="Configurations" sx={{ textTransform: 'none', fontWeight: 500 }} />
            </Tabs>

            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
              {tabValue === 0 && (
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="500">eUniverse Summary</Typography>
                      <TextField
                        size="small"
                        placeholder="Search environments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ 
                          startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>),
                          sx: { borderRadius: 1.5 }
                        }}
                        sx={{ width: 300 }}
                      />
                    </Stack>

                    <TableContainer>
                      <Table size="medium">
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>eUniverse ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Environment Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569' }}>Current / Total</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569' }}>Objects</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569' }}>eHumans</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569' }}>Users</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Present IDs</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData.map((row, index) => (
                            <TableRow 
                              key={row.id} 
                              hover
                              sx={{ 
                                bgcolor: index % 2 === 1 ? '#f8fafc' : 'inherit',
                                '&:hover': { bgcolor: '#f1f5f9 !important' }
                              }}
                            >
                              <TableCell><Chip label={row.status} color={getStatusColor(row.status) as any} size="small" sx={{ fontWeight: 500 }} /></TableCell>
                              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{row.eUniverseId}</TableCell>
                              <TableCell>{row.environmentName}</TableCell>
                              <TableCell align="center">{row.currentIncrement} / {row.totalIncrements}</TableCell>
                              <TableCell align="right">{row.objects.toLocaleString()}</TableCell>
                              <TableCell align="right">{row.eHumans.toLocaleString()}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{row.users}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.presentIds}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}

              {/* Configurations Tab */}
              {tabValue === 1 && (
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="500" sx={{ mb: 4 }}>eUniverse Configurations</Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Intensity Control</Typography>
                        <Box sx={{ height: 200, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">Ready for backend configuration mapping...</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>System Parameters</Typography>
                        <Box sx={{ height: 200, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 2 }} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}