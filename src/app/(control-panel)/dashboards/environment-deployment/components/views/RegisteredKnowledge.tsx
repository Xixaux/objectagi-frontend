'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Chip,                    // ← Added this (was missing)
} from '@mui/material';

interface KnowledgePackage {
  id: number;
  category: string;
  packageName: string | null;
  version: string | null;
  author: string | null;
  fileSize: string | null;
  acquireDate: string | null;
  status: string | null;
}

export default function CheckpointsView() {
  const [packages, setPackages] = useState<KnowledgePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [installedPackages, setInstalledPackages] = useState<Set<string>>(new Set());
  const [installingPackages, setInstallingPackages] = useState<Set<string>>(new Set());

  // Fetch data from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/RegisteredKnowledge');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data: KnowledgePackage[] = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleInstall = (pkgName: string) => {
    if (installedPackages.has(pkgName) || installingPackages.has(pkgName)) return;

    setInstallingPackages(prev => new Set([...prev, pkgName]));

    // Simulate installation time
    const installTime = (1800 + Math.random() * 3200) * 1.8;

    setTimeout(() => {
      setInstalledPackages(prev => new Set([...prev, pkgName]));
      setInstallingPackages(prev => {
        const next = new Set(prev);
        next.delete(pkgName);
        return next;
      });
    }, installTime);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc', 
      py: 6, 
      px: { xs: 3, md: 5 }
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.07)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Package Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Version</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Size</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => {
                const pkgKey = pkg.packageName || `pkg-${pkg.id}`;
                const isInstalled = installedPackages.has(pkgKey);
                const isInstalling = installingPackages.has(pkgKey);

                return (
                  <TableRow key={pkg.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {pkg.packageName || '—'}
                    </TableCell>
                    <TableCell>
                      {pkg.version ? (
                        <Chip 
                          label={`v${pkg.version}`} 
                          size="small" 
                          sx={{ fontWeight: 600, bgcolor: '#e0f2fe', color: '#0369a1' }}
                        />
                      ) : '—'}
                    </TableCell>
                    <TableCell>{pkg.author || '—'}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', color: '#475569' }}>
                      {pkg.fileSize || '—'}
                    </TableCell>
                    <TableCell align="right">
                      {isInstalled ? (
                        <Button 
                          variant="contained" 
                          disableElevation 
                          size="small" 
                          disabled 
                          sx={{ bgcolor: '#4b5563', color: 'white' }}
                        >
                          INSTALLED
                        </Button>
                      ) : isInstalling ? (
                        <Button 
                          variant="contained" 
                          disableElevation 
                          size="small" 
                          disabled 
                          startIcon={<CircularProgress size={18} />}
                        >
                          Installing…
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          disableElevation 
                          size="small" 
                          onClick={() => handleInstall(pkgKey)}
                          sx={{ bgcolor: '#00A4EF' }}
                        >
                          INSTALL PACKAGE
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {packages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    No knowledge packages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
    </Box>
  );
}