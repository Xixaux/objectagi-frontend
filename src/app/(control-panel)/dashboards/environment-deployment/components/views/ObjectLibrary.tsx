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

const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'biological': return 'success';
    case 'electronic': return 'info';
    case 'hybrid': return 'warning';
    case 'structural': return 'secondary';
    case 'fluidic': return 'error';
    default: return 'default';
  }
};

export default function ObjectLibrary() {
  const [objects, setObjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5275/api/ObjectLibrary', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log("Raw ObjectLibrary data received:", data);
        setObjects(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Failed to fetch ObjectLibrary:', err);
        setError(err.message || 'Failed to load physical entities');
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return objects;

    const term = searchTerm.toLowerCase();
    return objects.filter((row) =>
      row.objectName?.toLowerCase().includes(term) ||
      row.physicalObjectType?.toLowerCase().includes(term) ||
      row.existential_Status?.toLowerCase().includes(term)
    );
  }, [searchTerm, objects]);

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading Active Physical Entities...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 2 }}>
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
          <Typography variant="h6" fontWeight="bold">Active Physical Entities</Typography>
          <TextField
            size="small"
            placeholder="Search by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 350 }, bgcolor: 'white' }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>ObjectName</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Coordinates</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Existential_Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Create Date</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={row.oid || row.oID || index} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {row.objectName ? row.objectName.trim() : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.physicalObjectType ? row.physicalObjectType.trim() : 'Unknown'} 
                      color={getTypeColor(row.physicalObjectType ? row.physicalObjectType.trim() : '') as any} 
                      size="small" 
                      sx={{ fontWeight: 'bold', px: 1 }}
                    />
                  </TableCell>
                  <TableCell>{row.dimension ? row.dimension.trim() : (row.shapeDescriptor ? row.shapeDescriptor.trim() : '—')}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'info.main' }}>
                    {row.x_coordinates && row.y_coordinates && row.z_coordinates 
                      ? `X:${row.x_coordinates.trim()} Y:${row.y_coordinates.trim()} Z:${row.z_coordinates.trim()}` 
                      : '—'}
                  </TableCell>
                  <TableCell>{row.existential_Status ? row.existential_Status.trim() : '—'}</TableCell>
                  <TableCell>{row.createdBy ? row.createdBy.trim() : '—'}</TableCell>
                  <TableCell>
                    {row.system_Date_Time 
                      ? new Date(row.system_Date_Time).toISOString().split('T')[0] 
                      : '—'}
                  </TableCell>
                  <TableCell>{row.action ? row.action.trim() : '—'}</TableCell>
                </TableRow>
              ))}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No physical entities found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="caption" color="text.secondary">
            Showing {filteredData.length} physical records
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}