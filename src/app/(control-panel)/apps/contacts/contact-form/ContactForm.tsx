'use client';

import Button from '@mui/material/Button';
import Link from '@objectagi/core/Link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ObjectAGILoading from '@objectagi/core/ObjectAGILoading';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@objectagi/core/ObjectAGIMessage/objectagiMessageSlice';
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@objectagi/hooks/useNavigate';
import ContactEmailSelector from './email-selector/ContactEmailSelector';
import PhoneNumberSelector from './phone-number-selector/PhoneNumberSelector';
import { Contact, Tag, fetchContactById, fetchTags } from '../ContactsApi';
import { ContactEmailModel, ContactPhoneModel } from '../models/ContactModel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function BirthdayIcon() {
    return <ObjectAGISvgIcon size={20}>heroicons-solid:cake</ObjectAGISvgIcon>;
}

type FormType = {
    avatar?: string;
    background?: string;
    name: string;
    emails?: { email: string; type?: string }[];
    phoneNumbers?: { number: string; type?: string; country?: string }[];
    title?: string;
    company?: string;
    birthday?: string;
    address?: string;
    notes?: string;
    tags?: string[];
};

const ContactEmailSchema = z.object({
    email: z.string().email().optional(),
    type: z.string().optional(),
});

const ContactPhoneNumberSchema = z.object({
    number: z.string().optional(),
    type: z.string().optional(),
    country: z.string().optional(),
});

const schema = z.object({
    avatar: z.string().optional(),
    background: z.string().optional(),
    name: z.string().min(1, { message: 'Name is required' }),
    emails: z.array(ContactEmailSchema).optional(),
    phoneNumbers: z.array(ContactPhoneNumberSchema).optional(),
    title: z.string().optional(),
    company: z.string().optional(),
    birthday: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

type ContactFormProps = {
    isNew?: boolean;
};

function ContactForm(props: ContactFormProps) {
    const { isNew = true } = props;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const routeParams = useParams<{ contactId: string }>();
    const { contactId } = routeParams;

    const [contact, setContact] = useState<Contact | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            avatar: '',
            background: '',
            name: '',
            emails: [ContactEmailModel({})],
            phoneNumbers: [ContactPhoneModel({})],
            title: '',
            company: '',
            birthday: '',
            address: '',
            notes: '',
            tags: [],
        },
    });

    const { isValid, dirtyFields, errors } = formState;

    useEffect(() => {
        async function loadData() {
            try {
                const tagsData = await fetchTags();
                setTags(tagsData);

                if (!isNew && contactId && contactId !== 'new') {
                    const contactData = await fetchContactById(contactId);
                    setContact(contactData);
                    reset({
                        avatar: contactData.avatar || '',
                        background: contactData.background || '',
                        name: contactData.name || '',
                        emails: contactData.emails?.$values?.map((e) => ({ email: e.email || '', type: e.label || '' })) || [ContactEmailModel({})],
                        phoneNumbers: contactData.phoneNumbers?.$values?.map((p) => ({ number: p.phoneNumber || '', type: p.label || '', country: p.country || 'US' })) || [ContactPhoneModel({})],
                        title: contactData.title || '',
                        company: contactData.company || '',
                        birthday: contactData.birthday || '',
                        address: contactData.address || '',
                        notes: contactData.notes || '',
                        tags: contactData.contactTags?.$values?.map((ct) => ct.tagId) || [],
                    });
                } else {
                    reset({
                        avatar: '',
                        background: '',
                        name: '',
                        emails: [ContactEmailModel({})],
                        phoneNumbers: [ContactPhoneModel({})],
                        title: '',
                        company: '',
                        birthday: '',
                        address: '',
                        notes: '',
                        tags: [],
                    });
                }
                setLoading(false);
            } catch (err: any) {
                setError('Failed to load data: ' + err.message);
                setLoading(false);
            }
        }
        loadData();
    }, [contactId, isNew, reset]);

    const onSubmit = useCallback(
        async (data: FormType) => {
            try {
                const payload = {
                    id: isNew ? crypto.randomUUID() : contactId,
                    avatar: data.avatar || '',
                    background: data.background || '',
                    name: data.name || '',
                    emails: data.emails?.filter((e) => e.email).map((e) => ({
                        id: crypto.randomUUID(),
                        contactId: isNew ? crypto.randomUUID() : contactId,
                        email: e.email,
                        label: e.type || '',
                    })) || [],
                    phoneNumbers: data.phoneNumbers?.filter((p) => p.number).map((p) => ({
                        id: crypto.randomUUID(),
                        contactId: isNew ? crypto.randomUUID() : contactId,
                        phoneNumber: p.number,
                        label: p.type || '',
                        country: p.country || 'US',
                    })) || [],
                    title: data.title || '',
                    company: data.company || '',
                    birthday: data.birthday || '',
                    address: data.address || '',
                    notes: data.notes || '',
                    contactTags: data.tags?.map((tagId) => ({
                        contactId: isNew ? crypto.randomUUID() : contactId,
                        tagId,
                    })) || [],
                };

                console.log('Submitting payload:', JSON.stringify(payload, null, 2));

                const method = isNew ? 'POST' : 'PUT';
                const url = isNew
                    ? 'http://localhost:5275/api/MessengerContacts'
                    : `http://localhost:5275/api/MessengerContacts/${contactId}`;

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
                }

                navigate('/apps/contacts');
            } catch (err: any) {
                console.error('Submit error:', err);
                dispatch(showMessage({ message: `Failed to ${isNew ? 'create' : 'update'} contact: ${err.message}` }));
            }
        },
        [contactId, isNew, navigate, dispatch]
    );

    const handleRemoveContact = async () => {
        if (!contactId || contactId === 'new') return;
        try {
            const response = await fetch(`http://localhost:5275/api/MessengerContacts/${contactId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            navigate('/apps/contacts');
        } catch (err: any) {
            dispatch(showMessage({ message: 'Failed to delete contact: ' + err.message }));
        }
    };

    const background = watch('background');
    const name = watch('name');

    if (loading) {
        return <ObjectAGILoading className="min-h-screen" />;
    }

    if (error && !isNew) {
        setTimeout(() => {
            navigate('/apps/contacts');
            dispatch(showMessage({ message: 'NOT FOUND' }));
        }, 0);
        return null;
    }

    return (
        <>
            <Box
                className="relative w-full h-40 sm:h-48 px-8 sm:px-12"
                sx={{ backgroundColor: 'background.default' }}
            >
                {background && (
                    <img className="absolute inset-0 object-cover w-full h-full" src={background} alt="user background" />
                )}
            </Box>

            {/* MAIN CONTENT - Now limited to ~half screen width */}
            <div className="relative flex flex-col flex-auto items-center px-6 sm:px-12 max-w-4xl w-full mx-auto">
                <div className="w-full">
                    <div className="flex flex-auto items-end -mt-16">
                        <Controller
                            control={control}
                            name="avatar"
                            render={({ field: { onChange, value } }) => (
                                <Box
                                    sx={{ borderWidth: 4, borderStyle: 'solid', borderColor: 'background.paper' }}
                                    className="relative flex items-center justify-center w-32 h-32 rounded-full overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-black/50 z-10" />
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div>
                                            <label htmlFor="button-avatar" className="flex p-2 cursor-pointer">
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-avatar"
                                                    type="file"
                                                    onChange={async (e) => {
                                                        function readFileAsync() {
                                                            return new Promise((resolve, reject) => {
                                                                const file = e?.target?.files?.[0];
                                                                if (!file) return;
                                                                const reader = new FileReader();
                                                                reader.onload = () => {
                                                                    if (typeof reader.result === 'string') {
                                                                        resolve(`data:${file.type};base64,${btoa(reader.result)}`);
                                                                    } else {
                                                                        reject(new Error('File reading did not result in a string.'));
                                                                    }
                                                                };
                                                                reader.onerror = reject;
                                                                reader.readAsBinaryString(file);
                                                            });
                                                        }
                                                        const newImage = await readFileAsync();
                                                        onChange(newImage);
                                                    }}
                                                />
                                                <ObjectAGISvgIcon className="text-white">heroicons-outline:camera</ObjectAGISvgIcon>
                                            </label>
                                        </div>
                                        <div>
                                            <IconButton
                                                onClick={() => {
                                                    onChange('');
                                                }}
                                            >
                                                <ObjectAGISvgIcon className="text-white">heroicons-solid:trash</ObjectAGISvgIcon>
                                            </IconButton>
                                        </div>
                                    </div>
                                    <Avatar
                                        sx={{ backgroundColor: 'background.default', color: 'text.secondary' }}
                                        className="object-cover w-full h-full text-16 font-bold"
                                        src={value}
                                        alt={name}
                                    >
                                        {name?.charAt(0)}
                                    </Avatar>
                                </Box>
                            )}
                        />
                    </div>
                </div>

                {/* AI Name field */}
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <TextField
                            className="mt-8"
                            {...field}
                            label="AI Name"
                            placeholder="Enter AI name"
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
                                ),
                            }}
                        />
                    )}
                />

                {/* AI-Specific Metadata - Cosmetic & Disabled */}
                <Grid container spacing={3} className="mt-8">
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Assigned Environment"
                            value="Default Simulation"
                            fullWidth
                            disabled
                            variant="filled"
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="AI Author"
                            value="System Administrator"
                            fullWidth
                            disabled
                            variant="filled"
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            label="AI X Location"
                            value="0.00"
                            fullWidth
                            disabled
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="AI Y Location"
                            value="0.00"
                            fullWidth
                            disabled
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="AI Z Location"
                            value="0.00"
                            fullWidth
                            disabled
                            variant="filled"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Activated AI Status"
                            value="Inactive (Pending Creation)"
                            fullWidth
                            disabled
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Runtime Selected AI"
                            value="Not Assigned"
                            fullWidth
                            disabled
                            variant="filled"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DateTimePicker
                            label="AI Creation Date"
                            value={new Date()}
                            disabled
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: "filled",
                                    InputProps: { readOnly: true },
                                },
                            }}
                        />
                    </Grid>
                </Grid>


                {/* Existing form fields */}
                <Controller
                    control={control}
                    name="tags"
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            multiple
                            id="tags"
                            className="mt-8"
                            options={tags}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.title}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                                    {option.title}
                                </li>
                            )}
                            value={value ? value.map((id) => tags.find((t) => t.id === id) || { id, title: '' }) : []}
                            onChange={(_event, newValue) => {
                                onChange(newValue.map((item) => item.id));
                            }}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} label="Tags" placeholder="Tags" />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                        <TextField
                            className="mt-8"
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
                                ),
                            }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="company"
                    render={({ field }) => (
                        <TextField
                            className="mt-8"
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
                                ),
                            }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="emails"
                    render={({ field }) => (
                        <ContactEmailSelector
                            className="mt-8"
                            {...field}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="phoneNumbers"
                    render={({ field }) => (
                        <PhoneNumberSelector
                            className="mt-8"
                            {...field}
                            error={!!errors.phoneNumbers}
                            helperText={errors?.phoneNumbers?.message}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                        <TextField
                            className="mt-8"
                            {...field}
                            label="Address"
                            placeholder="Address"
                            id="address"
                            error={!!errors.address}
                            helperText={errors?.address?.message}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ObjectAGISvgIcon size={20}>heroicons-solid:map-pin</ObjectAGISvgIcon>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="birthday"
                    render={({ field: { value, onChange } }) => (
                        <DateTimePicker
                            value={value ? new Date(value) : null}
                            onChange={(val) => onChange(val?.toISOString())}
                            className="mt-8 mb-4 w-full"
                            slotProps={{
                                textField: {
                                    id: 'birthday',
                                    label: 'Birthday',
                                    InputLabelProps: { shrink: true },
                                    fullWidth: true,
                                    variant: 'outlined',
                                    error: !!errors.birthday,
                                    helperText: errors?.birthday?.message,
                                },
                                actionBar: { actions: ['clear', 'today'] },
                            }}
                            slots={{ openPickerIcon: BirthdayIcon }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="notes"
                    render={({ field }) => (
                        <TextField
                            className="mt-8"
                            {...field}
                            label="Notes"
                            placeholder="Notes"
                            id="notes"
                            error={!!errors.notes}
                            helperText={errors?.notes?.message}
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
                                ),
                            }}
                        />
                    )}
                />
            </div>

            {/* Bottom action buttons */}
            <Box className="flex items-center mt-10 py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9 border-t" sx={{ backgroundColor: 'background.default' }}>
                {!isNew && (
                    <Button color="error" onClick={handleRemoveContact}>
                        Delete
                    </Button>
                )}
                <Button component={Link} className="ml-auto" to="/apps/contacts">
                    Cancel
                </Button>
                <Button
                    className="ml-2"
                    variant="contained"
                    color="secondary"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    onClick={handleSubmit(onSubmit)}
                >
                    Create eHuman
                </Button>
            </Box>
        </>
    );
}

export default ContactForm;