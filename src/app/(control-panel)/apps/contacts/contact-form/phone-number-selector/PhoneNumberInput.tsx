import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CountryCodeSelector from './CountryCodeSelector';
import { ContactPhoneNumber } from '../../ContactsApi';

// Zod schema for ContactPhoneNumber
const schema = z.object({
    country: z.string().optional(),
    number: z.string().optional(), // Changed to match FormType
    type: z.string().optional(), // Changed to match FormType
});

const defaultValues = {
    country: 'US',
    number: '',
    type: '',
};

type PhoneNumberInputProps = {
    value: { number: string; type: string; country: string };
    onChange: (T: { number: string; type: string; country: string }) => void;
    onRemove: (T: { number: string; type: string; country: string }) => void;
    hideRemove?: boolean;
    error?: boolean;
};

/**
 * The phone number input.
 */
function PhoneNumberInput(props: PhoneNumberInputProps) {
    const { value, hideRemove = false, onChange, onRemove } = props;

    const { control, formState, handleSubmit, reset } = useForm<{
        country: string;
        number: string;
        type: string;
    }>({
        mode: 'all',
        defaultValues,
        resolver: zodResolver(schema),
    });

    const { errors } = formState;

    useEffect(() => {
        reset({
            country: value.country || 'US',
            number: value.number || '',
            type: value.type || '',
        });
    }, [reset, value]);

    function onSubmit(data: { country: string; number: string; type: string }) {
        onChange(data);
    }

    return (
        <form
            className="flex space-x-4 mb-4"
            onChange={handleSubmit(onSubmit)}
        >
            <Controller
                control={control}
                name="number"
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Phone Number"
                        placeholder="Phone Number"
                        variant="outlined"
                        fullWidth
                        error={!!errors.number}
                        helperText={errors?.number?.message}
                        InputProps={{
                            startAdornment: (
                                <Controller
                                    control={control}
                                    name="country"
                                    render={({ field: _field }) => (
                                        <InputAdornment position="start">
                                            <CountryCodeSelector {..._field} />
                                        </InputAdornment>
                                    )}
                                />
                            ),
                        }}
                    />
                )}
            />
            <Controller
                control={control}
                name="type"
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Label"
                        placeholder="Label"
                        variant="outlined"
                        fullWidth
                        error={!!errors.type}
                        helperText={errors?.type?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <ObjectAGISvgIcon size={20}>heroicons-solid:tag</ObjectAGISvgIcon>
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />
            {!hideRemove && (
                <IconButton
                    onClick={(ev) => {
                        ev.stopPropagation();
                        onRemove(value);
                    }}
                >
                    <ObjectAGISvgIcon size={20}>heroicons-solid:trash</ObjectAGISvgIcon>
                </IconButton>
            )}
        </form>
    );
}

export default PhoneNumberInput;