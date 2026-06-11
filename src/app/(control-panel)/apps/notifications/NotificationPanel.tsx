'use client';

import { useState, useEffect } from 'react';
import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { Box, CircularProgress } from '@mui/material';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import NotificationCard from './NotificationCard';
import {
  closeNotificationPanel,
  selectNotificationPanelState,
  toggleNotificationPanel
} from './notificationPanelSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    width: 320
  }
}));

export default function NotificationPanel() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectNotificationPanelState);

  // Live data state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch data from your ASP.NET Web API (Port 5275)
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5275/api/UI_Notifications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchNotifications();
    }
  }, [state]);

  // 2. Handle Dismiss (Delete from DB)
  const handleDismiss = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5275/api/UI_Notifications/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Refresh local state after successful delete
        setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
      }
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
    }
  };

  const handleDismissAll = async () => {
    // Basic loop for dismiss all functionality
    for (const n of notifications) {
      await handleDismiss(n.notificationId);
    }
  };

  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={() => {}}
      onClose={() => dispatch(toggleNotificationPanel())}
      disableSwipeToOpen
    >
      <IconButton
        className="absolute right-0 top-0 z-999 m-1"
        onClick={() => dispatch(closeNotificationPanel())}
        size="large"
      >
        <ObjectAGISvgIcon color="action">heroicons-outline:x-mark</ObjectAGISvgIcon>
      </IconButton>

      <ObjectAGIScrollbars className="flex flex-col p-4 h-full">
        <div className="mb-9 flex items-end justify-between pt-34">
          <Typography className="text-4xl font-semibold leading-none">
            Activity
          </Typography>
          {notifications.length > 0 && (
            <Typography
              className="cursor-pointer text-md underline"
              color="secondary"
              onClick={handleDismissAll}
            >
              dismiss all
            </Typography>
          )}
        </div>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error" variant="caption" className="text-center">
            Failed to load feed: {error}
          </Typography>
        ) : notifications.length > 0 ? (
          <div className="flex flex-auto flex-col">
            {_.orderBy(notifications, ['initiateDate'], ['desc']).map((item) => (
              <NotificationCard
                key={item.notificationId}
                className="mb-4"
                item={{
                  id: item.notificationId,
                  title: item.eHumanFullName, // Mapped from your DB column
                  description: item.eHumanAction, // Mapped from your DB column
                  time: item.initiateDate,
                  status: item.status
                }}
                onClose={() => handleDismiss(item.notificationId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4">
            <Typography className="text-center text-xl" color="text.secondary">
              No recent actions.
            </Typography>
          </div>
        )}
      </ObjectAGIScrollbars>
    </StyledSwipeableDrawer>
  );
}