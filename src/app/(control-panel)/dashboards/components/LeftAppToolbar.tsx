'use client';

import React from 'react';
import {
  Box,
  Stack,
  Tooltip,
  IconButton,
  TooltipProps,
  tooltipClasses,
  styled
} from '@mui/material';
import {
  Public as EnvironmentIcon,
  AccountTree as HierarchyIcon,
  Flag as CheckpointsIcon,
  Chat as CommunicationIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Styled tooltip for a "pro" look
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} placement="right" arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '8px 12px',
    borderRadius: '8px',
    marginLeft: '10px !important'
  },
}));

export default function LeftAppToolbar() {
  const menuItems = [
    { icon: <EnvironmentIcon />, label: 'Environment Manager', color: '#4caf50' },
    { icon: <HierarchyIcon />, label: 'Object Hierarchy', color: '#2196f3' },
    { icon: <CheckpointsIcon />, label: 'Event Checkpoints', color: '#ff9800' },
    { icon: <CommunicationIcon />, label: 'Communication Log', color: '#00bcd4' },
  ];

  return (
    <Box
      sx={{
        width: 80,
        background: 'transparent',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        py: 4,
      }}
    >
      <Stack spacing={4} alignItems="center">
        {menuItems.map((item, index) => (
          <CustomTooltip key={index} title={item.label}>
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                sx={{
                  width: 56,
                  height: 56,
                  color: item.color,                    // ← Icons use their own color by default!
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: item.color,
                    boxShadow: `0 0 20px ${item.color}55`, // stronger glow on hover
                    transform: 'translateY(-2px)',
                    '& svg': {
                      color: item.color,              // ensure it stays colored
                      filter: 'brightness(1.15)',     // optional extra pop
                    }
                  },
                }}
              >
                {React.cloneElement(item.icon as React.ReactElement, { 
                  sx: { fontSize: 32 }
                })}
              </IconButton>
            </motion.div>
          </CustomTooltip>
        ))}
      </Stack>

      {/* Decorative Glow at bottom */}
      <Box sx={{ 
        mt: 'auto', 
        width: 4, 
        height: 40, 
        borderRadius: 2, 
        bgcolor: 'primary.main', 
        boxShadow: '0 0 10px #2196f3',
        opacity: 0.5 
      }} />
    </Box>
  );
}