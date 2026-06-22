'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function EHumanLibrary() {
  const [eHumans, setEHumans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEHumans = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/eHumanLibrary', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log("Raw eHumanLibrary data:", data);   // For debugging
        setEHumans(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Failed to fetch eHuman Library data:', err);
        setError(err.message || 'Failed to load eHuman library');
      } finally {
        setLoading(false);
      }
    };

    fetchEHumans();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return eHumans;

    const term = searchTerm.toLowerCase();
    return eHumans.filter((row) =>
      row.aI_FirstName?.toLowerCase().includes(term) ||
      row.aI_LastName?.toLowerCase().includes(term) ||
      row.skills?.toLowerCase().includes(term) ||
      row.protectionLevel?.toLowerCase().includes(term) ||
      row.objectiveCategory?.toLowerCase().includes(term)
    );
  }, [searchTerm, eHumans]);

  const getFullName = (row: any) => {
    const first = row.aI_FirstName?.trim() || '';
    const last = row.aI_LastName?.trim() || '';
    return [first, last].filter(Boolean).join(' ') || 'Unknown';
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading eHuman Library...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" fontWeight="bold">eHuman Library</Typography>
          <TextField
            size="small"
            placeholder="Search by name, skills, or protection level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 380 }, bgcolor: 'white' }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px' }}>NAME</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px' }}>SKILLS</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px' }}>SKILL LEVEL</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px' }}>CATEGORY</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px' }}>CAPABILITIES</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px' }}>PROTECTION LEVEL</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px' }}>DATE CREATED</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.aiLibraryID} hover>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 600 }}>
                    {getFullName(row)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>
                    {row.skills ? row.skills.trim() : '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>
                    {row.aggregated_Skill_Level ? row.aggregated_Skill_Level.trim() : 'Advanced'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>
                    {row.objectiveCategory ? row.objectiveCategory.trim() : 'Core'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>
                    {row.allowedActions ? row.allowedActions.trim() : 'Autonomous'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>
                    {row.protectionLevel ? row.protectionLevel.trim() : 'Level 3'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status ? row.status.trim() : 'Active'} 
                      size="small" 
                      sx={{ fontSize: '9px', fontWeight: 800 }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px' }}>
                    {row.dateCreated 
                      ? new Date(row.dateCreated).toISOString().split('T')[0] 
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No eHuman records found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="caption" color="text.secondary">
            Showing {filteredData.length} eHuman records
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}