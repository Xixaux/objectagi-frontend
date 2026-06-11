'use client';

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  FormHelperText,
  MenuItem,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Slider,
  Checkbox,
} from '@mui/material';
import _ from 'lodash';

// ------------------------------------------------------------------------------------------------
// Types and Schema
// ------------------------------------------------------------------------------------------------

type FormType = {
  username: string;
  currentPassword: string;
  newPassword: string;
  twoStepVerification: boolean;

  enforcePasswordHistory: boolean;
  geoLoginRestriction: boolean;
  notificationOnUnusualActivity: boolean;
  requireSessionReauth: boolean;
  forceLogoutOnIPChange: boolean;
  blockPublicAPIAccess: boolean;
  enableHardwareKey: boolean;
  autoLockScreen: boolean;
  dataEncryptionEnabled: boolean;
  ssoOnlyMode: boolean;
  passwordlessLogin: boolean;
  securityReportsEmail: string;
  maxFailedAttempts: string;
  passwordExpiryDays: string;
  auditLogRetention: '30' | '90' | '365' | 'infinity';
  dataLeakMonitoring: boolean;

  removeEhumansSocialProblems: boolean;
};

const defaultValues: FormType = {
  username: 'currentuser',
  currentPassword: '',
  newPassword: '',
  twoStepVerification: false,

  enforcePasswordHistory: true,
  geoLoginRestriction: false,
  notificationOnUnusualActivity: true,
  requireSessionReauth: false,
  forceLogoutOnIPChange: false,
  blockPublicAPIAccess: false,
  enableHardwareKey: false,
  autoLockScreen: true,
  dataEncryptionEnabled: true,
  ssoOnlyMode: false,
  passwordlessLogin: false,
  securityReportsEmail: 'alerts@userdomain.com',
  maxFailedAttempts: '5',
  passwordExpiryDays: '0',
  auditLogRetention: '365',
  dataLeakMonitoring: true,

  removeEhumansSocialProblems: true,
};

const schema = z.object({
  username: z.string().nonempty().min(4),
  currentPassword: z.string().nonempty(),
  newPassword: z.string().min(8).nonempty(),
  securityReportsEmail: z.string().email().nonempty(),
  maxFailedAttempts: z.string().regex(/^\d+$/).min(1).max(2),
  passwordExpiryDays: z.string().regex(/^\d+$/),
  auditLogRetention: z.enum(['30', '90', '365', 'infinity']),
});

// ------------------------------------------------------------------------------------------------
// Components
// ------------------------------------------------------------------------------------------------

function ChangeCredentialsForm() {
  const { control, formState, handleSubmit, reset } = useForm<Pick<FormType, 'username' | 'currentPassword' | 'newPassword'>>({
    defaultValues: _.pick(defaultValues, ['username', 'currentPassword', 'newPassword']),
    resolver: zodResolver(schema.pick({ username: true, currentPassword: true, newPassword: true })),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onSubmit = (data: any) => {
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', text: 'Credentials updated successfully.' });
      reset({ ...data, currentPassword: '', newPassword: '' });
    }, 1500);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Credentials</Typography>
      {message && <Alert severity={message.type} sx={{ mb: 4 }}>{message.text}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Controller name="username" control={control} render={({ field }) => (
          <TextField {...field} fullWidth label="Username" required error={!!errors.username} helperText={errors.username?.message}
            InputProps={{ startAdornment: <InputAdornment position="start">👤</InputAdornment> }}
          />
        )} />

        <Controller name="currentPassword" control={control} render={({ field }) => (
          <TextField {...field} fullWidth label="Current Password" type="password" required error={!!errors.currentPassword} helperText={errors.currentPassword?.message}
            InputProps={{ startAdornment: <InputAdornment position="start">🔒</InputAdornment> }}
          />
        )} />

        <Controller name="newPassword" control={control} render={({ field }) => (
          <TextField {...field} fullWidth label="New Password" type="password" required error={!!errors.newPassword} helperText={errors.newPassword?.message}
            InputProps={{ startAdornment: <InputAdornment position="start">🔑</InputAdornment> }}
          />
        )} />

        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </form>
    </Box>
  );
}

function TwoFactorAuthSection() {
  const { control, watch } = useForm<Pick<FormType, 'twoStepVerification' | 'enableHardwareKey'>>({
    defaultValues: _.pick(defaultValues, ['twoStepVerification', 'enableHardwareKey']),
  });

  const twoFA = watch('twoStepVerification');
  const hardwareKey = watch('enableHardwareKey');

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Multi-Factor Authentication</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Two-step verification adds a critical layer of security.</Typography>

      <Grid container spacing={3} maxWidth="xl">
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Controller name="twoStepVerification" control={control} render={({ field }) => (
              <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Standard 2FA (App / SMS)" />
            )} />
            <FormHelperText>Requires a one-time code.</FormHelperText>
            <Button variant="outlined" size="small" disabled={!twoFA} sx={{ mt: 1 }}>Setup</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Controller name="enableHardwareKey" control={control} render={({ field }) => (
              <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Security Key (FIDO)" />
            )} />
            <FormHelperText>Physical key — strongest protection.</FormHelperText>
            <Button variant="outlined" size="small" disabled={!hardwareKey} sx={{ mt: 1 }}>Register</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function AdvancedSecurityControls() {
  const { control, formState, handleSubmit } = useForm<Omit<FormType, 'username' | 'currentPassword' | 'newPassword' | 'twoStepVerification'>>({
    defaultValues: _.omit(defaultValues, ['username', 'currentPassword', 'newPassword', 'twoStepVerification']),
    resolver: zodResolver(schema.partial()),
  });

  const { isValid, dirtyFields } = formState;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const toggles = [
    { name: 'enforcePasswordHistory', label: 'Enforce Password History', help: 'Prevent reuse of last 5 passwords' },
    { name: 'notificationOnUnusualActivity', label: 'Unusual Activity Alerts', help: 'Notify on new device/location' },
    { name: 'requireSessionReauth', label: 'Require Re-authentication', help: 'Password for sensitive actions' },
    { name: 'geoLoginRestriction', label: 'Geographic Restrictions', help: 'Approved regions only' },
    { name: 'forceLogoutOnIPChange', label: 'Logout on IP Change', help: 'End session on IP change' },
    { name: 'blockPublicAPIAccess', label: 'Block Public API Access', help: 'Disable unsecured endpoints' },
    { name: 'autoLockScreen', label: 'Auto Lock Screen', help: 'After 5 min inactivity' },
    { name: 'dataEncryptionEnabled', label: 'Data Encryption (AES-256)', help: 'At rest & in transit', disabled: true },
    { name: 'ssoOnlyMode', label: 'SSO Only Mode', help: 'Disable local login' },
    { name: 'passwordlessLogin', label: 'Passwordless Login', help: 'Magic link via email' },
    { name: 'dataLeakMonitoring', label: 'Data Leak Monitoring', help: 'Scan dark web' },
  ] as const;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" gutterBottom>Advanced Security Settings</Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {toggles.map((item) => (
          <Grid item xs={12} sm={6} lg={4} key={item.name}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Controller
                name={item.name}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} disabled={!!item.disabled} />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight="medium">{item.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.help}</Typography>
                      </Box>
                    }
                  />
                )}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 6 }} />

      <Typography variant="h6" gutterBottom>Security Policies</Typography>
      <Grid container spacing={4} sx={{ mb: 6, maxWidth: '4xl' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="passwordExpiryDays" control={control} render={({ field }) => (
            <TextField {...field} fullWidth label="Password Expiry (Days)" helperText="0 = never" />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="maxFailedAttempts" control={control} render={({ field }) => (
            <TextField {...field} fullWidth label="Max Failed Logins" helperText="Lock after N attempts" />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="auditLogRetention" control={control} render={({ field }) => (
            <TextField {...field} select fullWidth label="Audit Log Retention">
              <MenuItem value="30">30 Days</MenuItem>
              <MenuItem value="90">90 Days</MenuItem>
              <MenuItem value="365">1 Year</MenuItem>
              <MenuItem value="infinity">Forever</MenuItem>
            </TextField>
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="securityReportsEmail" control={control} render={({ field }) => (
            <TextField {...field} fullWidth label="Security Alert Email" />
          )} />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 4, mb: 6 }}>
        <Typography variant="h6" gutterBottom>AI-Specific Security Rules</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControlLabel 
                control={
                  <Controller 
                    name="removeEhumansSocialProblems" 
                    control={control} 
                    render={({ field }) => <Checkbox {...field} checked={field.value} />} 
                  />
                } 
                label="Remove eHumans Who Initiate Social Problems After 3 offenses" 
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Button type="submit" variant="contained" color="secondary" size="large" disabled={_.isEmpty(dirtyFields) || !isValid || isLoading} sx={{ mb: 8 }}>
        {isLoading ? <CircularProgress size={24} /> : 'Save All Settings'}
      </Button>

      {/* === FAILSAFE CONTROLS - RESTORED === */}
      <Paper elevation={3} sx={{ p: 6, bgcolor: 'error.50', border: '2px solid', borderColor: 'error.main' }}>
        <Typography variant="h5" gutterBottom color="error" fontWeight="bold">
          FAILSAFE CONTROLS
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          These actions immediately revoke critical AI capabilities. Use only in emergency situations.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="error" size="large" sx={{ py: 2, color: 'white' }}>
              Revoke All Self Modification
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="error" size="large" sx={{ py: 2, color: 'white' }}>
              Revoke All Elevated Access
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="error" size="large" sx={{ py: 2, color: 'white' }}>
              Disconnect All AI-to-AI Access
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="error" size="large" sx={{ py: 2, color: 'white' }}>
              Remove From All Environments
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="error" size="large" sx={{ py: 2, color: 'white' }}>
              Remove From All Conversations
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="error" size="large" sx={{ py: 2, color: 'white' }}>
              Revoke Access From Specific AI
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Button fullWidth variant="contained" color="error" size="large" sx={{ py: 2, color: 'white' }}>
              Revoke All Self-Awareness
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Button fullWidth variant="contained" color="error" size="large" sx={{ py: 2, color: 'white' }}>
              Suspend All eHumans
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, pt: 4, borderTop: '2px dashed', borderColor: 'error.main' }}>
          <Typography variant="h6" color="error" gutterBottom fontWeight="bold">
            ULTIMATE EMERGENCY FAILSAFE
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            This action terminates all AI control permanently and switches to human-only mode.
          </Typography>
          <Button variant="contained" color="error" size="large" sx={{ px: 8, py: 3, fontSize: '1.1rem' }}>
            Activate Full Failsafe: Revoke All AI Control
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

// ------------------------------------------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------------------------------------------

export default function SecurityTab() {
  return (
    <Box sx={{ p: { xs: 4, md: 8 }, maxWidth: '5xl', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Security Settings & Permissions
      </Typography>

      <ChangeCredentialsForm />
      <Divider sx={{ my: 10 }} />

      <TwoFactorAuthSection />
      <Divider sx={{ my: 10 }} />

      <AdvancedSecurityControls />
    </Box>
  );
}