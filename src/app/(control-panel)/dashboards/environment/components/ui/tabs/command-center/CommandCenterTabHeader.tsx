'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

// Hardcoded eHuman list (moved from the other file)
/*
const eHumanDirectory = [
  { id: 1, name: "Kenneth Reyes" },
  { id: 2, name: "Silas Thorne" },
  { id: 3, name: "Lyra Belacqua" },
  { id: 4, name: "Luna Voss" },
  { id: 5, name: "Sable Quinn" },
  { id: 6, name: "Roger Synapsis" },
  { id: 7, name: "Jaxen Grey" },
];
*/

export default function CommandCenterTabHeader() {
  const theme = useTheme();
  
  /*
  const [selectedUser, setSelectedUser] = useState(eHumanDirectory[0].name);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = (name?: string) => {
    if (name) setSelectedUser(name);
    setAnchorEl(null);
  };
  */

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justify: 'flex-start',
        p: 2,
        bgcolor: 'transparent',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
      }}
    >
      {/* Left side - eHuman Selector (Commented out) */}
      {/* 
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 0.9,
          borderRadius: 999,
          background: 'rgba(46, 125, 50, 0.07)',
          border: '1px solid rgba(46, 125, 50, 0.16)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: '#1b5e20',
            textTransform: 'uppercase',
            fontSize: '0.74rem',
            letterSpacing: '0.4px',
          }}
        >
          eHuman
        </Typography>

        <Button
          variant="text"
          onClick={handleUserMenuOpen}
          endIcon={<MoreVertIcon fontSize="small" sx={{ color: '#2e7d32' }} />}
          disableRipple
          sx={{
            minWidth: 'auto',
            px: 1.2,
            py: 0.4,
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#0f172a',
            textTransform: 'none',
            borderRadius: 999,
            '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.12)' },
          }}
        >
          {selectedUser}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleUserMenuClose()}
          PaperProps={{ 
            sx: { 
              mt: 1, 
              borderRadius: '10px', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)' 
            } 
          }}
        >
          {eHumanDirectory.map((human) => (
            <MenuItem
              key={human.id}
              onClick={() => handleUserMenuClose(human.name)}
              sx={{ py: 1, px: 2.5 }}
            >
              {human.name}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      */}
    </Box>
  );
}