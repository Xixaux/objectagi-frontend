'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  Typography, 
  Box, 
  Paper, 
  CardContent, 
  Avatar, 
  AvatarGroup, 
  Alert, 
  Button, 
  TextField, 
  InputAdornment, 
  CircularProgress 
} from '@mui/material';
import { EmailOutlined, LockOutlined, Star } from '@mui/icons-material';
import Link from '@objectagi/core/Link';

const displayAvatars = [
  '/assets/images/avatars/male-01.jpg',
  '/assets/images/avatars/male-02.jpg',
  '/assets/images/avatars/male-03.jpg',
  '/assets/images/avatars/female-01.jpg',
];

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.replace('/apps/messenger');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT SECTION: AUTH FORM */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2 lg:px-20">
        <Paper elevation={0} className="w-full max-w-md bg-transparent">
          <CardContent className="space-y-8">
            <div className="text-left">
              <img
                className="h-10 w-auto mb-10"
                src="/assets/images/logo/logo.svg"
                alt="ObjectAGI Logo"
              />
              <Typography variant="h3" className="text-4xl font-black tracking-tight text-slate-900">
                Sign in
              </Typography>
              <div className="mt-3 flex items-center gap-1.5 text-sm">
                <Typography className="text-slate-500">Need an account?</Typography>
                <Link to="/sign-up" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  Sign up
                </Link>
              </div>
            </div>

            {error && (
              <Alert severity="error" variant="filled" className="rounded-xl font-medium shadow-sm">
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* ENHANCED GREEN VIP PILL */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-500/20 shadow-sm transition-all hover:border-emerald-500/40">
                <Star className="text-emerald-600 text-sm animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                  Early VIP Access Donor Login
                </span>
              </div>

              <TextField
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <div className="space-y-2">
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined className="text-slate-400" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <div className="flex justify-end">
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                size="large"
                sx={{ 
                  py: 2, 
                  borderRadius: 3, 
                  textTransform: 'none', 
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#ffffff', 
                  backgroundColor: '#2563eb',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                  '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign in to ObjectAGI'}
              </Button>
            </Box>
          </CardContent>
        </Paper>
      </div>

      {/* RIGHT SECTION: HERO VISUAL */}
      <Box
        className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden md:flex"
        sx={{ 
          background: 'linear-gradient(145deg, #020617 0%, #0f172a 100%)',
        }}
      >
        {/* Subtle SVG Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.2]"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2394a3b8' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            maskImage: 'radial-gradient(ellipse at center, black, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 85%)'
          }}
        />

        {/* Animated Background Glows */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-lg px-12 text-center">
          <Typography className="mb-10 text-5xl font-extrabold leading-tight text-white tracking-tighter">
            Sign in to <br /> 
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              ObjectAGI
            </span>
          </Typography>
          
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl">
            <div className="mb-8 flex justify-center">
              <AvatarGroup 
                max={4} 
                sx={{ 
                  '& .MuiAvatar-root': { 
                    width: 60, 
                    height: 60, 
                    border: '4px solid #0f172a',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)' 
                  } 
                }}
              >
                {displayAvatars.map((src, index) => (
                  <Avatar key={index} src={src} />
                ))}
              </AvatarGroup>
            </div>
            
            <Typography className="text-xl font-bold leading-relaxed text-white">
              Deploy ObjectAGI to meet a world of objectives.
            </Typography>
            
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <Typography className="text-xs font-black uppercase tracking-widest text-blue-400">
                Intelligence Control Panel
              </Typography>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;