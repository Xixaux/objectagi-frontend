'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Avatar,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LogoutIcon from '@mui/icons-material/Logout';

import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';

import { SwipeableHandlers } from 'react-swipeable';
import { useTheme } from '@mui/material/styles';
import useUser from '@auth/useUser';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    position: 'fixed',
    width: 380,
    maxWidth: '90vw',
    backgroundColor: theme.palette.background.paper,
    top: 0,
    height: '100%',
    minHeight: '100%',
    bottom: 0,
    right: 0,
    margin: 0,
    zIndex: 1000,
    borderRadius: 0,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
}));

type TransitionProps = {
  children?: React.ReactElement;
  ref?: React.RefObject<HTMLDivElement>;
};

function Transition(props: TransitionProps) {
  const { children, ref, ...other } = props;
  const theme = useTheme();
  return (
    <Slide direction={theme.direction === 'ltr' ? 'left' : 'right'} ref={ref} {...other}>
      {children}
    </Slide>
  );
}

type SettingsPanelProps = {
  settingsHandlers: SwipeableHandlers;
  onClose: () => void;
  open: boolean;
};

export default function SettingsPanel({ settingsHandlers, onClose, open }: SettingsPanelProps) {
  const [planOpen, setPlanOpen] = useState(false);
  const { data: user, logout } = useUser();

  const togglePlanDropdown = () => setPlanOpen(!planOpen);

  const handleLogout = async () => {
    try {
      if (typeof logout === 'function') {
        await logout();
      }
      window.location.replace('/sign-in');
    } catch (error) {
      console.error("Logout error:", error);
      window.location.replace('/sign-in');
    }
  };

  // Dynamic name from real user data
  const displayName = user?.displayName || 
                     (user?.firstName && user?.lastName 
                       ? `${user.firstName} ${user.lastName}`.trim() 
                       : user?.name) || 
                     'User';

  return (
    <StyledDialog
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      BackdropProps={{ invisible: true }}
      {...settingsHandlers}
    >
      <ObjectAGIScrollbars className="p-6 space-y-6">
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          size="large"
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
        >
          <ObjectAGISvgIcon>heroicons-outline:x-mark</ObjectAGISvgIcon>
        </IconButton>

        {/* Header */}
        <Box sx={{ pt: 2 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Account
          </Typography>
        </Box>

        {/* MOVED TO TOP: Avatar + Name + Email + Sign Out */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar 
              src={user?.photoURL || ''} 
              sx={{ width: 56, height: 56 }}
            >
              {displayName[0] || '?'}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || ''}
              </Typography>
            </Box>

            <IconButton 
              onClick={handleLogout} 
              color="error" 
              size="large"
              title="Sign Out"
            >
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Box>

        <Divider />

        {/* Account Menu */}
        <List sx={{ py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="My eHumans" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Account Settings" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Renewals & Billing" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={togglePlanDropdown}>
              <ListItemText primary="Change ObjectAGI Plan" />
              {planOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>

          <Collapse in={planOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              {['Personal', 'Professional', 'Enterprise'].map((plan) => (
                <ListItemButton
                  key={plan}
                  sx={{ pl: 3, py: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => {
                    alert(`Switched to ${plan} plan`);
                    setPlanOpen(false);
                  }}
                >
                  <ListItemText primary={plan} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </ObjectAGIScrollbars>
    </StyledDialog>
  );
}