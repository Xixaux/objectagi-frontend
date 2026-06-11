'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import _ from 'lodash';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { useState, useEffect } from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material'; // Added new MUI components

/**
 * Data Management Settings Tab
 */

type FormType = {
  communication: boolean;
  comments: boolean;
  // New Data Management Fields
  autoDeletePeriod: 'never' | '30' | '90' | '365';
  dataVisibility: 'private' | 'team' | 'public';
  connectedAppsAlert: boolean;
  sessionTimeout: string;
  delegateUser: string;
};

const defaultValues: FormType = {
  communication: false,
  comments: false,
  // New Data Management Defaults
  autoDeletePeriod: 'never',
  dataVisibility: 'team',
  connectedAppsAlert: true,
  sessionTimeout: '24', // Default to 24 hours
  delegateUser: '',
};

/**
 * Form Validation Schema
 */
const schema = z
  .object({
    communication: z.boolean(),
    comments: z.boolean(),
    // New Data Management Schemas
    autoDeletePeriod: z.enum(['never', '30', '90', '365']),
    dataVisibility: z.enum(['private', 'team', 'public']),
    connectedAppsAlert: z.boolean(),
    sessionTimeout: z.string().regex(/^\d+$/, 'Must be a number of hours').min(1, 'Cannot be less than 1 hour'),
    delegateUser: z.string().optional(),
  })
  .refine(
    (data) => data.communication || data.comments,
    {
      message: 'At least one notification type must be enabled',
      path: ['communication'], // Pin error to a specific field for better UX, or keep empty for general
    }
  );

function DataTab() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{ title: string; text: string; type: 'success' | 'error' }>({
    title: '',
    text: '',
    type: 'success',
  });
  
  // Dummy data for data/security displays
  const accountHistoryLastChecked = '2025/10/18 10:30 AM';
  const connectedAppsCount = 3;
  const activeSessions = 1;

  const { control, reset, handleSubmit, formState, trigger, setError } = useForm<FormType>({
    defaultValues,
    mode: 'all',
    resolver: zodResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  // Clear alert after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmitClick = async (e: React.MouseEvent) => {
    const isValid = await trigger();
    if (!isValid) {
      setMessage({ type: 'error', text: errors._form?.message || 'Form validation failed. Please check all fields.' });
      return;
    }
    if (_.isEmpty(dirtyFields)) {
      setMessage({ type: 'error', text: 'No changes made to data management settings.' });
      return;
    }
    handleSubmit(onSubmit)();
  };
  
  // Example security action handlers
  const handleViewHistory = () => {
    setDialogContent({
        title: 'Account Access History',
        text: 'Showing last 5 logins: 2025/10/18 (New York, Chrome), 2025/10/17 (London, Firefox).',
        type: 'success',
    });
    setDialogOpen(true);
  }

  const handleReviewApps = () => {
    setDialogContent({
        title: 'Connected Applications',
        text: `You have ${connectedAppsCount} apps connected: Slack, Google Drive, and API Connector.`,
        type: 'success',
    });
    setDialogOpen(true);
  }

  async function onSubmit(formData: FormType) {
    setIsLoading(true);
    setMessage(null);

    try {
      // NOTE: I am keeping the original `communication` and `comments` in the payload 
      // since the original onSubmit was related to notifications. You should adjust 
      // this payload to match your actual 'DataTab' API endpoint needs.
      const payload = {
        Communication: formData.communication,
        Comments: formData.comments,
        AutoDeleteAfterDays: formData.autoDeletePeriod,
        DefaultDataVisibility: formData.dataVisibility,
        AlertOnNewAppConnection: formData.connectedAppsAlert,
        SessionTimeoutHours: formData.sessionTimeout,
        AccountDelegate: formData.delegateUser,
      };

      // Simulating API call for data management settings
      const response = await fetch('http://localhost:5275/api/SetDataManagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();
      setDialogContent({
        title: 'Success',
        text: 'Data Management settings saved successfully!',
        type: 'success',
      });
      setDialogOpen(true);
      reset(formData); // Use formData to reset to the saved values instead of defaultValues
    } catch (error: any) {
      const errorMessage = error.message.includes('HTTP error')
        ? `Failed to save settings: ${error.message}`
        : 'Failed to save settings. Please check your network or server status.';
      setDialogContent({
        title: 'Error',
        text: errorMessage,
        type: 'error',
      });
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Only show a temporary alert if the dialog was not for an error
    if (dialogContent.type === 'success') {
        setMessage({ type: 'success', text: dialogContent.text });
    }
  };

  return (
    <div className="w-full max-w-5xl">
      {message && (
        <Alert severity={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}
      
      <form onSubmit={(e) => e.preventDefault()}>
        
        {/* ========================================================================= */}
        {/* DATA RETENTION AND VISIBILITY */}
        {/* ========================================================================= */}
        <Typography className="w-full text-xl mb-1">Data Retention & Privacy</Typography>
        <Typography color="text.secondary" className="mb-6">
            Configure how long your data is kept and who can access it by default.
        </Typography>

        {/* Auto Delete Data Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Controller
                name="autoDeletePeriod"
                control={control}
                render={({ field }) => (
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="auto-delete-label">Delete Data After</InputLabel>
                        <Select
                            {...field}
                            labelId="auto-delete-label"
                            label="Delete Data After"
                        >
                            <MenuItem value="never">Never (Manual Deletion)</MenuItem>
                            <MenuItem value="30">30 Days</MenuItem>
                            <MenuItem value="90">90 Days</MenuItem>
                            <MenuItem value="365">1 Year</MenuItem>
                        </Select>
                        <FormHelperText>Automatically delete raw usage data to comply with policies.</FormHelperText>
                    </FormControl>
                )}
            />

            {/* Default Data Visibility Dropdown */}
            <Controller
                name="dataVisibility"
                control={control}
                render={({ field }) => (
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="data-visibility-label">Default Data Visibility</InputLabel>
                        <Select
                            {...field}
                            labelId="data-visibility-label"
                            label="Default Data Visibility"
                        >
                            <MenuItem value="private">Private (Only Me)</MenuItem>
                            <MenuItem value="team">Team (Colleagues)</MenuItem>
                            <MenuItem value="public">Public (Everyone)</MenuItem>
                        </Select>
                        <FormHelperText>Default access level for new data entries.</FormHelperText>
                    </FormControl>
                )}
            />
        </div>

        {/* Session Timeout Field */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
             <Controller
                name="sessionTimeout"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Session Timeout (Hours)"
                        placeholder="e.g., 24"
                        variant="outlined"
                        fullWidth
                        error={!!errors.sessionTimeout}
                        helperText={errors.sessionTimeout?.message || 'Set how long you stay logged in without activity.'}
                        InputProps={{
                            endAdornment: <Typography color="text.secondary">hours</Typography>
                        }}
                    />
                )}
            />
        </Box>
        
        <Divider className="my-10 border-t" />

        {/* ========================================================================= */}
        {/* ACCOUNT SECURITY & AUDIT */}
        {/* ========================================================================= */}
        <Typography className="w-full text-xl mb-1">Account Security & Audit</Typography>
        <Typography color="text.secondary" className="mb-6">
            Review and manage devices, third-party applications, and access history.
        </Typography>

        <div className="grid grid-cols-1 gap-4">
            {/* View Access History Button */}
            <Box className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <Box>
                    <Typography variant="body1" fontWeight="medium">Account Access History</Typography>
                    <Typography variant="caption" color="text.secondary">
                        See information about when and where you logged into your account. Last checked: {accountHistoryLastChecked}
                    </Typography>
                </Box>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={handleViewHistory}
                    sx={{ flexShrink: 0, ml: 2 }}
                >
                    View Log
                </Button>
            </Box>

            {/* Connected Apps Button */}
            <Box className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <Box>
                    <Typography variant="body1" fontWeight="medium">Connected Apps & Services</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Review and revoke access for {connectedAppsCount} third-party applications.
                    </Typography>
                </Box>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={handleReviewApps}
                    sx={{ flexShrink: 0, ml: 2 }}
                >
                    Review Apps
                </Button>
            </Box>
            
            {/* Active Sessions Button (Simulated Action) */}
            <Box className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <Box>
                    <Typography variant="body1" fontWeight="medium">Active Sessions</Typography>
                    <Typography variant="caption" color="text.secondary">
                        You currently have {activeSessions} active session(s). Log out from other devices.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="warning" 
                    onClick={() => setDialogOpen(true)} // Use dialog to simulate action
                    sx={{ flexShrink: 0, ml: 2 }}
                >
                    Log Out All
                </Button>
            </Box>

            {/* Alert on New App Connection Switch */}
            <Box className="flex items-center justify-between p-4 border rounded-lg">
                <Controller
                    name="connectedAppsAlert"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <div className="flex flex-col w-full">
                            <FormControlLabel
                                classes={{ root: 'm-0', label: 'flex flex-1' }}
                                labelPlacement="start"
                                label="Alert on New App Connection"
                                control={<Switch onChange={(ev) => onChange(ev.target.checked)} checked={value} name="connectedAppsAlert" />}
                            />
                            <FormHelperText>
                                Receive an email alert whenever a new third-party application requests access to your data.
                            </FormHelperText>
                        </div>
                    )}
                />
            </Box>
            
            {/* Delegate Account Control (TextField for selecting user) */}
            <Box className="flex items-center justify-between p-4 border rounded-lg">
                <Controller
                    name="delegateUser"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Delegate Account Control"
                            placeholder="Search user to delegate..."
                            variant="outlined"
                            fullWidth
                            helperText="Grant temporary control of your data management settings to another user."
                            sx={{ mt: 1 }}
                        />
                    )}
                />
            </Box>
        </div>

        <Divider className="my-10 border-t" />

        {/* ========================================================================= */}
        {/* OLD NOTIFICATIONS SECTION (KEEPING FOR ORIGINAL FORM STRUCTURE) */}
        {/* ========================================================================= */}
        <Typography className="w-full text-xl">Alerts (Existing Settings)</Typography>
        <div className="mt-2 grid w-full grid-cols-1 gap-1.5">
          <div className="flex items-center justify-between">
            <Controller
              name="communication"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col w-full">
                  <FormControlLabel
                    classes={{ root: 'm-0', label: 'flex flex-1' }}
                    labelPlacement="start"
                    label="Communication"
                    control={<Switch onChange={(ev) => onChange(ev.target.checked)} checked={value} name="communication" />}
                  />
                  <FormHelperText error={!!errors.communication}>
                    {errors.communication?.message || 'Get news, announcements, and product updates.'}
                  </FormHelperText>
                </div>
              )}
            />
          </div>
        </div>
        
        <Typography className="mt-6 w-full font-medium">Email me when:</Typography>
        <div className="mt-3 grid w-full grid-cols-1 gap-1">
          <div className="flex items-center justify-between">
            <Controller
              name="comments"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col w-full">
                  <FormControlLabel
                    classes={{ root: 'm-0', label: 'flex flex-1' }}
                    labelPlacement="start"
                    label="Someone comments on one of my items"
                    control={<Switch onChange={(ev) => onChange(ev.target.checked)} checked={value} name="comments" />}
                  />
                  <FormHelperText error={!!errors.comments}>{errors.comments?.message}</FormHelperText>
                </div>
              )}
            />
          </div>
        </div>
        
        <Divider className="mb-10 mt-11 border-t" />
        
        {/* ========================================================================= */}
        {/* ACTION BUTTONS */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outlined" disabled={_.isEmpty(dirtyFields)} onClick={() => reset(defaultValues)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
            onClick={handleSubmitClick}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </div>
      </form>

      {/* GLOBAL DIALOG */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DataTab;