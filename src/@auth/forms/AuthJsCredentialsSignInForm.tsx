// @auth/AuthJsCredentialsSignInForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@objectagi/core/Link';
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
});

type FormType = {
  email: string;
  password: string;
  remember?: boolean;
};

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

function AuthJsCredentialsSignInForm() {
  const { control, formState, handleSubmit, setError } = useForm<FormType>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const router = useRouter();

  async function onSubmit(formData: FormType) {
    const { email, password } = formData;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      console.log('[SignInForm] signIn result:', result);
      console.log('[SignInForm] Session after signIn:', await fetch('/auth/session').then(res => res.json()));

      if (result?.error) {
        console.error('[SignInForm] signIn error:', result.error);
        setError('root', { type: 'manual', message: signinErrors[result.error] || result.error });
        return false;
      }

      router.replace('/apps/messenger');
      return true;
    } catch (err: any) {
      console.error('[SignInForm] Error:', err);
      setError('root', { type: 'manual', message: err.message || 'Login failed' });
      return false;
    }
  }

  return (
    <form
      name="loginForm"
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
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Email"
            autoFocus
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
      <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControlLabel
                label="Remember me"
                control={<Checkbox size="small" {...field} />}
              />
            </FormControl>
          )}
        />
        <Link className="text-md font-medium" to="/forgot-password">
          Forgot password?
        </Link>
      </div>
      <Button
        variant="contained"
        color="secondary"
        className="mt-4 w-full"
        aria-label="Sign in"
        disabled={_.isEmpty(dirtyFields) || !isValid}
        type="submit"
        size="large"
      >
        Sign in
      </Button>
    </form>
  );
}

export default AuthJsCredentialsSignInForm;