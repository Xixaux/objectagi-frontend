'use client';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import _ from 'lodash';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import { Box, Avatar, Select, MenuItem, FormControl, InputLabel } from '@mui/material'; // Added Select, MenuItem, FormControl, InputLabel
import { styled } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// --- Avatar Component Styling and Logic (from previous step) ---

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const AvatarUploadContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: '50%',
    margin: '0 auto 20px auto',
    cursor: 'pointer',
    boxShadow: theme.shadows[4],
    transition: theme.transitions.create(['box-shadow'], { duration: 300 }),

    '&:hover': {
        boxShadow: theme.shadows[8],
    },
    
    '&:hover .avatar-overlay': {
        opacity: 1,
    },
}));

const Overlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
    color: 'white',
    pointerEvents: 'none',
}));

function ProfileAvatarUpload() {
    const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/150/0000FF/FFFFFF?text=P');
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if (file) {
            const newAvatarUrl = URL.createObjectURL(file);
            setAvatarUrl(newAvatarUrl);
            console.log("Image selected for upload:", file.name);
        }
    };

    return (
        <AvatarUploadContainer>
            <Button 
                component="label" 
                htmlFor="avatar-upload-input" 
                disableRipple 
                sx={{ p: 0, borderRadius: '50%', width: '100%', height: '100%' }}
            >
                <Avatar 
                    alt="Profile Avatar" 
                    src={avatarUrl} 
                    sx={{ width: 150, height: 150 }}
                >
                    P
                </Avatar>

                <Overlay className="avatar-overlay">
                    <PhotoCameraIcon sx={{ fontSize: 32, mb: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        CHANGE
                    </Typography>
                </Overlay>
            </Button>

            <VisuallyHiddenInput 
                id="avatar-upload-input" 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
            />
        </AvatarUploadContainer>
    );
}

// --- Form Definition Update ---

type FormType = {
    name: string;
    username: string;
    title: string;
    company: string;
    about: string;
    email: string;
    phone: string;
    country: string;
    language: string;
    // New Fields
    primaryUse: string;
    industry: string;
};

const defaultValues: FormType = {
    name: '',
    username: '',
    title: '',
    company: '',
    about: '',
    email: '',
    phone: '',
    country: '',
    language: '',
    // New Fields
    primaryUse: '',
    industry: ''
};

// Dummy data for select fields
const useOptions = ['Personal Project', 'Work/Company Project', 'Education/Learning', 'Other'];
const industryOptions = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Education', 'Other'];

/**
 * Form Validation Schema Update
 */
const schema = z.object({
    name: z.string().nonempty('Name is required'),
    username: z.string().nonempty('Username is required'),
    title: z.string().nonempty('Title is required'),
    company: z.string().nonempty('Company is required'),
    about: z.string().nonempty('About is required'),
    email: z.string().email('Invalid email').nonempty('Email is required'),
    phone: z.string().nonempty('Phone is required'),
    country: z.string().nonempty('Country is required'),
    language: z.string().nonempty('Language is required'),
    // New Fields
    primaryUse: z.string().nonempty('Primary Use is required'),
    industry: z.string().nonempty('Industry is required')
});

function AccountTab() {
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { control, reset, handleSubmit, formState } = useForm<FormType>({
        defaultValues,
        mode: 'all',
        resolver: zodResolver(schema)
    });

    const { isValid, dirtyFields, errors } = formState;

    // Static data for non-input field
    const accountCreationDate = '2024/05/15'; 

    /**
     * Form Submit Update
     */
    async function onSubmit(formData: FormType) {
        try {
            console.log('Submitting form data:', formData);
            const payload = {
                Name: formData.name,
                Username: formData.username,
                Title: formData.title,
                Company: formData.company,
                Notes: formData.about,
                Email: formData.email,
                PhoneNumber: formData.phone,
                Country: formData.country,
                Language: formData.language,
                // New Fields in Payload
                PrimaryUse: formData.primaryUse,
                Industry: formData.industry,
            };
            const response = await fetch('/api/GeneralSettings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Submission response:', result);
            setMessage({ type: 'success', text: 'Settings saved successfully! 🎉' });
        } catch (error) {
            console.error('Submission error:', error);
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again. 😞' });
        }
    }

    return (
        <div className="w-full max-w-5xl">
            {message && (
                <Alert severity={message.type} className="mb-4">
                    {message.text}
                </Alert>
            )}
            
            {/* AVATAR UPLOAD COMPONENT */}
            <ProfileAvatarUpload />
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full">
                    <Typography className="text-xl">Profile</Typography>
                    <Typography color="text.secondary">
                        Following information is publicly displayed, be careful!
                    </Typography>
                </div>
                
                {/* --- ACCOUNT CREATION DATE (Static Display) --- */}
                <div className="mt-8 grid w-full gap-6 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                        <Box sx={{ p: '14px', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Account Creation Date
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {accountCreationDate}
                            </Typography>
                        </Box>
                    </div>
                    {/* Empty space/offset for grid alignment */}
                    <div className="sm:col-span-2" />
                </div>
                
                <div className="mt-8 grid w-full gap-6 sm:grid-cols-4">
                    
                    {/* --- PRIMARY USE (Select Field) --- */}
                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="primaryUse"
                            render={({ field }) => (
                                <FormControl fullWidth variant="outlined" error={!!errors.primaryUse}>
                                    <InputLabel id="primary-use-label">Primary Use</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="primary-use-label"
                                        label="Primary Use"
                                        id="primary-use"
                                    >
                                        {useOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.primaryUse && (
                                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                            {errors.primaryUse.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            )}
                        />
                    </div>
                    
                    {/* --- SELECT INDUSTRY (Select Field) --- */}
                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="industry"
                            render={({ field }) => (
                                <FormControl fullWidth variant="outlined" error={!!errors.industry}>
                                    <InputLabel id="select-industry-label">Select Industry</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="select-industry-label"
                                        label="Select Industry"
                                        id="select-industry"
                                    >
                                        {industryOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.industry && (
                                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                            {errors.industry.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            )}
                        />
                    </div>
                    
                    {/* Existing TextFields follow here, starting with Name */}
                    <div className="sm:col-span-4">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    placeholder="Name"
                                    id="name"
                                    error={!!errors.name}
                                    helperText={errors?.name?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ObjectAGISvgIcon size={20}>heroicons-solid:user-circle</ObjectAGISvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="sm:col-span-4">
                        <Controller
                            control={control}
                            name="username"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Username"
                                    placeholder="Username"
                                    id="user-name"
                                    error={!!errors.username}
                                    helperText={errors?.username?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography color="text.secondary" className="italic">
                                                    objectagi.com/
                                                </Typography>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="title"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Title"
                                    placeholder="Job title"
                                    id="title"
                                    error={!!errors.title}
                                    helperText={errors?.title?.message}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ObjectAGISvgIcon size={20}>heroicons-solid:briefcase</ObjectAGISvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="company"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Company"
                                    placeholder="Company"
                                    id="company"
                                    error={!!errors.company}
                                    helperText={errors?.company?.message}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ObjectAGISvgIcon size={20}>heroicons-solid:building-office-2</ObjectAGISvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="sm:col-span-4">
                        <Controller
                            control={control}
                            name="about"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Notes"
                                    placeholder="Notes"
                                    id="notes"
                                    error={!!errors.about}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    minRows={5}
                                    maxRows={10}
                                    InputProps={{
                                        className: 'max-h-min h-min items-start',
                                        startAdornment: (
                                            <InputAdornment className="mt-4" position="start">
                                                <ObjectAGISvgIcon size={20}>heroicons-solid:bars-3-bottom-left</ObjectAGISvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                    helperText={
                                        <span className="flex flex-col">
                                            <span>Brief description for your profile. Basic HTML and Emoji are allowed.</span>
                                            <span>{errors?.about?.message}</span>
                                        </span>
                                    }
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="my-10 border-t" />
                <div className="w-full">
                    <Typography className="text-xl">Personal Information</Typography>
                    <Typography color="text.secondary">
                        Communication details in case we want to connect with you. These will be kept private.
                    </Typography>
                </div>
                <div className="grid w-full gap-6 sm:grid-cols-4 mt-8">
                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    placeholder="Email"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors?.email?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ObjectAGISvgIcon size={20}>heroicons-solid:envelope</ObjectAGISvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone Number"
                                    placeholder="Phone Number"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.phone}
                                    helperText={errors?.phone?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ObjectAGISvgIcon size={20}>heroicons-solid:phone</ObjectAGISvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Country"
                                    placeholder="Country"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.country}
                                    helperText={errors?.country?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ObjectAGISvgIcon size={20}>heroicons-solid:flag</ObjectAGISvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="language"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Language"
                                    placeholder="Language"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.language}
                                    helperText={errors?.language?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ObjectAGISvgIcon size={20}>heroicons-solid:globe-alt</ObjectAGISvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>

                <Divider className="mb-10 mt-11 border-t" />
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outlined"
                        disabled={_.isEmpty(dirtyFields)}
                        onClick={() => reset(defaultValues)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={_.isEmpty(dirtyFields) || !isValid}
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AccountTab;