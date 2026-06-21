// @auth/AuthJsCredentialsSignUpForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { signIn } from '@auth/authJs';
import { Alert } from '@mui/material';
import signinErrors from './signinErrors';

const schema = z.object({
  email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
  password: z
    .string()
    .min(4, 'Password is too short - must be at least 4 chars.')
    .nonempty('Please enter your password.'),
  firstName: z.string().nonempty('Please enter your first name.'),
  lastName: z.string().nonempty('Please enter your last name.'),
});

type FormType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const defaultValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
};

function AuthJsCredentialsSignUpForm() {
  const { control, formState, handleSubmit, setError } = useForm<FormType>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const router = useRouter();

  async function onSubmit(formData: FormType) {
    const { email, password, firstName, lastName } = formData;

    try {
      const registerResponse = await fetch('/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        throw new Error(data.message || 'Registration failed');
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      console.log('signIn result:', result);

      if (result?.error) {
        setError('root', { type: 'manual', message: signinErrors[result.error] || result.error });
        return false;
      }

      router.replace('/apps/messenger');
      return true;
    } catch (err: any) {
      console.error('Signup error:', err);
      setError('root', { type: 'manual', message: err.message || 'Signup failed' });
      return false;
    }
  }

  return (
    <form
      name="registerForm"
      noValidate
      className="mt-8 flex w-full flex-col justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      {errors?.root?.message && (
        <Alert
          className="mb-8"
          severity="error"
          sx={(theme) => ({
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.dark,
          })}
        >
          {errors.root.message}
        </Alert>
      )}
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="First Name"
            autoFocus
            type="text"
            error={!!errors.firstName}
            helperText={errors?.firstName?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Last Name"
            type="text"
            error={!!errors.lastName}
            helperText={errors?.lastName?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors?.email?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors?.password?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Button
        variant="contained"
        color="secondary"
        className="mt-4 w-full"
        aria-label="Sign up"
        disabled={_.isEmpty(dirtyFields) || !isValid}
        type="submit"
        size="large"
      >
        Sign up
      </Button>
    </form>
  );
}

export default AuthJsCredentialsSignUpForm;