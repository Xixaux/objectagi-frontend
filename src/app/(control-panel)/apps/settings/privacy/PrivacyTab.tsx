'use client';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Box, Chip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

type Visibility = 'Public' | 'Me Only' | 'Invite';
type ObjectItem = {
    id: string;
    name: string;
    icon: string;
    visibility: Visibility;
    invitedUsers: string[];
};

type SettingsFormType = {
    isAgiPublic: boolean;
    allowEhumansPublic: boolean;
    hideCreatedObjects: boolean;
    hideTerminatedUsers: boolean;
    hideCreatedUsers: boolean;
};

const defaultValues: SettingsFormType = {
    isAgiPublic: false,
    allowEhumansPublic: false,
    hideCreatedObjects: false,
    hideTerminatedUsers: true,
    hideCreatedUsers: false,
};

const schema = z.object({
    isAgiPublic: z.boolean(),
    allowEhumansPublic: z.boolean(),
    hideCreatedObjects: z.boolean(),
    hideTerminatedUsers: z.boolean(),
    hideCreatedUsers: z.boolean(),
});

function PrivacyTab() {
    const [objects, setObjects] = useState<ObjectItem[]>([]);
    const [userToInvite, setUserToInvite] = useState('');
    const [selectedObjectForInvite, setSelectedObjectForInvite] = useState<ObjectItem | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { control, getValues } = useForm<SettingsFormType>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const handleVisibilityChange = (id: string, event: SelectChangeEvent<Visibility>) => {
        // This function is kept for now since the list logic still exists below
        console.log("Visibility changed for", id, event.target.value);
    };
    
    const handleAddInvite = () => {
        if (!selectedObjectForInvite || !userToInvite.trim()) return;
        console.log("Adding invite:", userToInvite);
        setUserToInvite('');
    };

    const handleRemoveInvite = (user: string) => {
        console.log("Removing invite:", user);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setUserToInvite('');
        setSelectedObjectForInvite(null);
    };
    
    const handleSaveAll = () => {
        const formData = getValues();
        console.log("Saving all privacy settings:", formData);
        alert("Settings saved!");
    }
    
    return (
        <div className="flex flex-col p-16 sm:p-24 w-full max-w-5xl">
            <Typography variant="h4" className="mb-10">
                Privacy and Sharing Controls
            </Typography>
            
            <Typography variant="h5" className="mb-4">
                Global Visibility Toggles
            </Typography>

            <Box className="flex flex-col border p-4 rounded-lg mb-4">
                <Controller
                    name="isAgiPublic"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label={<Typography variant="body1" className="font-medium">Make AGI Environment Public</Typography>}
                        />
                    )}
                />
                <Typography variant="body2" color="text.secondary" className="pl-4">
                    If enabled, other users can view your core AGI environment configuration.
                </Typography>
            </Box>

            <Box className="flex flex-col border p-4 rounded-lg">
                <Controller
                    name="allowEhumansPublic"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label={<Typography variant="body1" className="font-medium">Allow eHumans to be Public</Typography>}
                        />
                    )}
                />
                <Typography variant="body2" color="text.secondary" className="pl-4">
                    If enabled, the eHumans you create can be shared and discovered by others.
                </Typography>
            </Box>

            <Divider className="my-12" />

            <Button variant="contained" color="secondary" onClick={handleSaveAll} className="w-full sm:w-auto self-end">
                Save All Privacy Settings
            </Button>

            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Invite Users to {selectedObjectForInvite?.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText className="mb-4">
                        Enter the email address of the user you wish to invite to view this object.
                    </DialogContentText>
                    
                    <Box className="flex gap-2 mb-4">
                        <TextField
                            autoFocus
                            label="User Email"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={userToInvite}
                            onChange={(e) => setUserToInvite(e.target.value)}
                        />
                        <Button onClick={handleAddInvite} color="primary" variant="contained" disabled={!userToInvite.includes('@')}>
                            Add
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="inherit">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PrivacyTab;