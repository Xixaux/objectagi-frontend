'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Link from '@objectagi/core/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Alert, Button, TextField } from '@mui/material';
import { signIn } from 'next-auth/react'; 

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        throw new Error(data.message || 'Registration failed');
      }

      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error || 'Login failed after registration.');
      }
      
      router.push('/apps/messenger');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* FORM SECTION */}
      <Paper className="h-full w-full px-4 py-2 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-16 md:shadow-none">
        <div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
          <img className="w-12" src="/assets/images/logo/logo.svg" alt="logo" />
          <Typography className="mt-8 text-4xl font-extrabold leading-[1.25] tracking-tight">
            Sign up
          </Typography>
          <div className="mt-0.5 flex items-baseline font-medium">
            <Typography>Already have an account?</Typography>
            <Link className="ml-1 text-blue-600 font-bold" to="/sign-in">
              Sign in
            </Link>
          </div>
          <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required fullWidth />
            <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }}>
              Sign Up
            </Button>
          </Box>
        </div>
      </Paper>

      {/* THE BACKEND AREA (PATTERN & GRADIENT INTEGRATED) */}
      <Box
        className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden md:flex"
        sx={{ 
          background: 'linear-gradient(145deg, #020617 0%, #0f172a 100%)',
        }}
      >
        {/* The Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.2]"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2394a3b8' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            maskImage: 'radial-gradient(ellipse at center, black, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 85%)'
          }}
        />

        {/* The Glow Blobs */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-2xl px-16">
          <div className="text-7xl font-bold leading-none text-white">
            <div>Welcome to</div>
            <div className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              something new
            </div>
          </div>
          <div className="mt-6 text-lg leading-6 tracking-tight text-slate-400">
            This is how you harness the power of true AGI to conceptualize and realize an open world of endless possibilities.
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignUpPage;