'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import toast from 'react-hot-toast';
import { MedoraDatePicker } from '../MedoraDatePicker';

// Icons
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BadgeIcon from '@mui/icons-material/Badge';
import DomainIcon from '@mui/icons-material/Domain';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

type DemoUser = {
  id: string;
  name: string;
  role: string;
  department: string | null;
};

export default function PortalAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify' | 'forgot'>('signin');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'staff' | 'patient'>('student');

  // Sign in form state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpDob, setSignUpDob] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Verification & Reset states
  const [otpToken, setOtpToken] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  // Demo users state
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getRoleDestination = (role?: string) => {
    const r = (role || '').toLowerCase();
    if (r === 'student') return '/portal/student';
    if (r === 'faculty' || r === 'doctor') return '/portal/doctor';
    if (r === 'editor' || r === 'publisher') return '/portal/cms';
    if (r === 'finance') return '/portal/finance';
    return '/portal/dashboard';
  };

  // Check if already authenticated
  useEffect(() => {
    fetch('/api/v1/auth/me', { credentials: 'same-origin' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then((data) => {
        router.replace(getRoleDestination(data?.role));
      })
      .catch(() => { });
  }, [router]);

  // Fetch demo users for one-click development login
  useEffect(() => {
    fetch('/api/v1/auth/demo-users')
      .then((r) => r.json())
      .then((data) => {
        if (data?.users) {
          setDemoUsers(data.users);
        }
      })
      .catch(() => { });
  }, []);

  const handleDemoLogin = async (userId: string) => {
    setAuthLoading(true);
    setErrorMsg(null);
    try {
      const selected = demoUsers.find((u) => u.id === userId);
      const res = await fetch('/api/v1/auth/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'medora',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Login failed');
      toast.success(`Signed in as ${selected?.name || 'User'} (${selected?.role || 'Staff'})!`);
      router.push(getRoleDestination(selected?.role));
    } catch (err: any) {
      toast.error(err.message || 'Demo login failed');
      setErrorMsg(err.message || 'Demo login failed');
      setAuthLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'medora',
        },
        body: JSON.stringify({
          email: loginMethod === 'email' ? email : undefined,
          phone: loginMethod === 'phone' ? phone : undefined,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.code === 'UNVERIFIED') {
          toast.error('Email not verified. Please enter the OTP sent to your email.');
          setErrorMsg('Please verify your email before logging in.');
          setMode('verify');
          setAuthLoading(false);
          return;
        }
        throw new Error(data.error?.message || 'Invalid credentials');
      }

      let destination = '/portal/dashboard';
      try {
        const meRes = await fetch('/api/v1/auth/me', { credentials: 'same-origin' });
        if (meRes.ok) {
          const meData = await meRes.json();
          destination = getRoleDestination(meData?.role);
        }
      } catch {}

      toast.success('Welcome back! Loading your medical portal...');
      router.push(destination);
    } catch (err: any) {
      toast.error(err.message || 'Unable to sign in. Check credentials.');
      setErrorMsg(err.message || 'Unable to sign in. Check credentials or use Demo Login below.');
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== signUpConfirmPassword) {
      toast.error('Passwords do not match');
      setErrorMsg('Passwords do not match');
      return;
    }
    if (signUpPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }
    if (signUpDob && new Date(signUpDob) > new Date()) {
      toast.error('Date of birth cannot be in the future.');
      setErrorMsg('Date of birth cannot be in the future.');
      return;
    }
    if (!agreeTerms) {
      toast.error('You must agree to the Terms & Conditions');
      setErrorMsg('You must agree to the Terms & Conditions');
      return;
    }
    setAuthLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'medora',
        },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
          institution_id: 'Medora Medical College & Hospital',
          role: selectedRole,
          phone: signUpPhone,
          dob: signUpDob,
        }),
      });
      let data: any = {};
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (isJson) {
        data = await res.json();
      } else {
        const text = await res.text();
        if (!res.ok) throw new Error(text.slice(0, 100) || `Server error (${res.status})`);
      }
      if (!res.ok) throw new Error(data?.error?.message || 'Sign up failed');
      toast.success(data.message || 'Registration successful! Verification OTP sent to your email.');
      setSuccessMsg('A 6-digit OTP code has been sent to ' + signUpEmail + '. Please enter it below to activate your account.');
      setEmail(signUpEmail);
      setMode('verify');
      setAuthLoading(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account.');
      setErrorMsg(err.message || 'Failed to create account.');
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken.trim()) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }
    setAuthLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: otpToken.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Invalid or expired OTP');
      toast.success('Email successfully verified! You can now sign in.');
      setSuccessMsg('Email verified! Please enter your password to sign in.');
      setMode('signin');
      setOtpToken('');
      setAuthLoading(false);
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
      setErrorMsg(err.message || 'Invalid or expired verification code.');
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = (forgotEmail || email).trim();
    if (!targetEmail) {
      toast.error('Please enter your registered email address.');
      return;
    }
    setAuthLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to send reset link');
      toast.success(data.message || 'Password reset link sent to your email.');
      setSuccessMsg('If an account exists for ' + targetEmail + ', a reset link has been dispatched.');
      setMode('signin');
      setAuthLoading(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to request password reset.');
      setErrorMsg(err.message || 'Failed to request password reset.');
      setAuthLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      bgcolor: '#F8FAFC',
      color: '#1E293B',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* ─── Left Branding Banner ─── */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: { md: '45%', lg: '42%' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { md: 5, lg: 6 },
        position: 'relative',
        background: 'linear-gradient(rgba(10, 28, 42, 0.78), rgba(15, 76, 92, 0.88)), url(/images/campus-hero.jpg) center/cover no-repeat',
        color: '#FFFFFF',
        overflow: 'hidden',
      }}>
        {/* Brand Header */}
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </Box>
            <Box>
              <Typography sx={{ color: '#FFFFFF !important', fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                MedicaCare
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7) !important', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Medical College &amp; Hospital
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Hero Copy */}
        <Box sx={{ position: 'relative', zIndex: 2, my: 'auto', py: 4 }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: '16px !important', color: '#FACC15 !important' }} />}
            label="NAAC A+ Accredited Institution"
            sx={{
              bgcolor: 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.8125rem',
              mb: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(6px)',
            }}
          />
          <Typography sx={{
            color: '#FFFFFF !important',
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: { md: '2rem', lg: '2.5rem' },
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            mb: 2,
          }}>
            Excellence in <br />
            <Box component="span" sx={{ color: '#5EEAD4 !important' }}>Medical Education</Box> <br />
            &amp; Healthcare
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.82) !important', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 420 }}>
            Nurturing future doctors, advancing medical science, and serving the community with world-class clinical care and compassionate hospital governance.
          </Typography>

          {/* Quick Demo Switcher Prompt */}
          {demoUsers.length > 0 && (
            <Box sx={{
              mt: 4,
              p: 2,
              borderRadius: '12px',
              bgcolor: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(94,234,212,0.3)',
              backdropFilter: 'blur(8px)',
            }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#5EEAD4' }}>
                  ⚡ Quick Dev Demo Access
                </Typography>
                <Chip label="1-Click Login" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#0F766E', color: '#fff', fontWeight: 700 }} />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {demoUsers.slice(0, 4).map((u) => (
                  <Button
                    key={u.id}
                    size="small"
                    variant="outlined"
                    onClick={() => handleDemoLogin(u.id)}
                    disabled={authLoading}
                    sx={{
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.3)',
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      py: 0.5,
                      px: 1.2,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: 'rgba(94,234,212,0.2)', borderColor: '#5EEAD4' },
                    }}
                  >
                    {u.role === 'admin' ? '👑 Admin' : u.role === 'dean' ? '🎓 Dean' : u.role === 'faculty' ? '👨‍⚕️ Faculty' : '🧑‍🎓 Student'}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Stats Footer Badge */}
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={2} sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <Grid size={4}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#5EEAD4 !important' }}>
                25+
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#FFFFFF !important', fontWeight: 500 }}>
                Departments
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#5EEAD4  !important' }}>
                15+
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#FFFFFF !important', fontWeight: 500 }}>
                Years Excellence
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#5EEAD4  !important' }}>
                10K+
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#FFFFFF !important', fontWeight: 500 }}>
                Students &amp; Patients
              </Typography>
            </Grid>
          </Grid>
          <Typography sx={{ mt: 3, fontSize: '0.7rem', color: '#FFFFFF !important' }}>
            © {new Date().getFullYear()} MedicaCare Medical College &amp; Hospital. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* ─── Right Form Section ─── */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 3, sm: 5, md: 6 },
        overflowY: 'auto',
      }}>
        <Box sx={{ width: '100%', maxWidth: 480 }}>
          {/* Mobile Brand */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: '#0F766E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </Box>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F766E' }}>
              MedicaCare Portal
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', fontSize: '0.85rem' }} onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: '10px', fontSize: '0.85rem' }} onClose={() => setSuccessMsg(null)}>
              {successMsg}
            </Alert>
          )}

          {/* SIGN IN VIEW */}
          {mode === 'signin' && (
            <Box>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#0F172A', mb: 0.5 }}>
                Welcome Back
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.875rem', mb: 3 }}>
                Sign in to your account to access the medical portal
              </Typography>

              {/* Login Method Tabs */}
              <Tabs
                value={loginMethod}
                onChange={(_, v) => setLoginMethod(v)}
                sx={{
                  mb: 3,
                  minHeight: 40,
                  bgcolor: '#F1F5F9',
                  borderRadius: '10px',
                  p: 0.5,
                  '& .MuiTabs-indicator': { display: 'none' },
                }}
              >
                <Tab
                  value="email"
                  label="Email Login"
                  sx={{
                    flex: 1,
                    minHeight: 32,
                    py: 0.8,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'none',
                    color: '#64748B',
                    '&.Mui-selected': { bgcolor: '#FFFFFF', color: '#0F766E', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
                  }}
                />
                <Tab
                  value="phone"
                  label="Phone Login"
                  sx={{
                    flex: 1,
                    minHeight: 32,
                    py: 0.8,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'none',
                    color: '#64748B',
                    '&.Mui-selected': { bgcolor: '#FFFFFF', color: '#0F766E', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
                  }}
                />
              </Tabs>

              <form onSubmit={handleSignIn}>
                <Stack spacing={2.5}>
                  {loginMethod === 'email' ? (
                    <Box>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.8 }}>
                        Email Address
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '10px',
                            bgcolor: '#FFFFFF',
                          },
                        }}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.8 }}>
                        Phone Number
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '10px',
                            bgcolor: '#FFFFFF',
                          },
                        }}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Box>
                  )}

                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.8 }}>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 44,
                          borderRadius: '10px',
                          bgcolor: '#FFFFFF',
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} size="small" sx={{ color: '#0F766E', '&.Mui-checked': { color: '#0F766E' } }} />}
                      label={<Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Remember me</Typography>}
                    />
                    <Typography
                      onClick={() => { setErrorMsg(null); setSuccessMsg(null); setMode('forgot'); }}
                      sx={{ fontSize: '0.8125rem', color: '#0F766E', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Forgot password?
                    </Typography>
                  </Stack>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={authLoading}
                    endIcon={authLoading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#0F766E',
                      height: 46,
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(15,118,110,0.25)',
                      '&:hover': { bgcolor: '#0D6861' },
                    }}
                  >
                    {authLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Stack>
              </form>

              {/* OR Divider & Social OAuth Buttons (Matching Mockup 1) */}
              <Box sx={{ my: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>OR</Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>

              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleDemoLogin('1')}
                  sx={{
                    height: 44,
                    borderRadius: '10px',
                    borderColor: '#E2E8F0',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'none',
                    bgcolor: '#FFFFFF',
                    gap: 1.5,
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' },
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleDemoLogin('2')}
                  sx={{
                    height: 44,
                    borderRadius: '10px',
                    borderColor: '#E2E8F0',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'none',
                    bgcolor: '#FFFFFF',
                    gap: 1.5,
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' },
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                  </svg>
                  Continue with Microsoft
                </Button>
              </Stack>

              {/* Dev Fast Login */}
              {demoUsers.length > 0 && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #CBD5E1' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', mb: 1.5, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Or Fast Demo Sign In (Dev)
                  </Typography>
                  <Grid container spacing={1}>
                    {demoUsers.slice(0, 4).map((user) => (
                      <Grid size={6} key={user.id}>
                        <Paper
                          onClick={() => handleDemoLogin(user.id)}
                          elevation={0}
                          sx={{
                            p: 1.2,
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            cursor: 'pointer',
                            bgcolor: '#FFFFFF',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#0F766E',
                              bgcolor: '#F0FDFA',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 2px 6px rgba(15,118,110,0.12)',
                            },
                          }}
                        >
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                            {user.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#0F766E', fontWeight: 600, textTransform: 'capitalize' }}>
                            Role: {user.role}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Stack direction="row" sx={{ justifyContent: 'center', mt: 3 }} spacing={1}>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>
                  Don&apos;t have an account?
                </Typography>
                <Typography
                  onClick={() => { setErrorMsg(null); setMode('signup'); }}
                  sx={{ fontSize: '0.875rem', color: '#0F766E', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign Up
                </Typography>
              </Stack>
            </Box>
          )}

          {/* SIGN UP VIEW */}
          {mode === 'signup' && (
            <Box>
              {/* Brand Header for Sign Up View (Matching Mockup 1) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: '#0F766E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.15rem', color: '#0F766E', lineHeight: 1.1 }}>
                    MedicaCare
                  </Typography>
                  <Typography sx={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Medical College &amp; Hospital
                  </Typography>
                </Box>
              </Box>

              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => { setErrorMsg(null); setMode('signin'); }}
                sx={{ mb: 2, color: '#64748B', textTransform: 'none', fontSize: '0.8125rem', px: 0, '&:hover': { bgcolor: 'transparent', color: '#0F766E' } }}
              >
                Back to Login
              </Button>

              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#0F172A', mb: 0.5 }}>
                Create Your Account
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.875rem', mb: 3 }}>
                Join our medical education and healthcare platform
              </Typography>

              {/* Role Picker */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 1 }}>
                  I am registering as:
                </Typography>
                <Grid container spacing={1}>
                  {[
                    { id: 'student', label: 'Student', icon: <SchoolIcon fontSize="small" /> },
                    { id: 'faculty', label: 'Faculty', icon: <BadgeIcon fontSize="small" /> },
                    { id: 'staff', label: 'Staff', icon: <DomainIcon fontSize="small" /> },
                    { id: 'patient', label: 'Patient', icon: <LocalHospitalIcon fontSize="small" /> },
                  ].map((r) => {
                    const isSelected = selectedRole === r.id;
                    return (
                      <Grid size={3} key={r.id}>
                        <Paper
                          onClick={() => setSelectedRole(r.id as any)}
                          elevation={0}
                          sx={{
                            p: 1.2,
                            textAlign: 'center',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            border: '1.5px solid',
                            borderColor: isSelected ? '#0F766E' : '#E2E8F0',
                            bgcolor: isSelected ? '#F0FDFA' : '#FFFFFF',
                            color: isSelected ? '#0F766E' : '#64748B',
                            fontWeight: isSelected ? 700 : 500,
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#0F766E' },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.3, color: isSelected ? '#0F766E' : '#94A3B8' }}>
                            {r.icon}
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'inherit' }}>
                            {r.label}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              <form onSubmit={handleSignUp}>
                <Stack spacing={2}>
                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.6 }}>
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter your full name"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 44,
                          borderRadius: '10px',
                          bgcolor: '#FFFFFF',
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlinedIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.6 }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="name@medora.edu"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 44,
                          borderRadius: '10px',
                          bgcolor: '#FFFFFF',
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.6 }}>
                        Phone Number
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="+91 98765..."
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '10px',
                            bgcolor: '#FFFFFF',
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.6 }}>
                        Date of Birth
                      </Typography>
                      <MedoraDatePicker
                        label=""
                        size="small"
                        disableFuture
                        value={signUpDob}
                        onChange={(val) => setSignUpDob(val)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            minHeight: 44,
                            borderRadius: '10px',
                            bgcolor: '#FFFFFF',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.6 }}>
                        Password
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        placeholder="Create password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '10px',
                            bgcolor: '#FFFFFF',
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.6 }}>
                        Confirm Password
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        placeholder="Repeat password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '10px',
                            bgcolor: '#FFFFFF',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <FormControlLabel
                    control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} size="small" sx={{ color: '#0F766E', '&.Mui-checked': { color: '#0F766E' } }} />}
                    label={
                      <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                        I agree to the <Box component="span" sx={{ color: '#0F766E', fontWeight: 600 }}>Terms &amp; Conditions</Box> and <Box component="span" sx={{ color: '#0F766E', fontWeight: 600 }}>Privacy Policy</Box>
                      </Typography>
                    }
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={authLoading}
                    endIcon={authLoading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#0F766E',
                      height: 46,
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(15,118,110,0.25)',
                      '&:hover': { bgcolor: '#0D6861' },
                    }}
                  >
                    {authLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Stack>
              </form>

              <Stack direction="row" sx={{ justifyContent: 'center', mt: 2.5 }} spacing={1}>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>
                  Already have an account?
                </Typography>
                <Typography
                  onClick={() => { setErrorMsg(null); setMode('signin'); }}
                  sx={{ fontSize: '0.875rem', color: '#0F766E', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign In
                </Typography>
              </Stack>
            </Box>
          )}

          {/* OTP VERIFICATION VIEW */}
          {mode === 'verify' && (
            <Box>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#0F172A', mb: 0.5 }}>
                Verify Your Email
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.875rem', mb: 3 }}>
                Enter the 6-digit verification code sent to <strong>{signUpEmail || email || 'your email'}</strong>
              </Typography>

              <form onSubmit={handleVerifyOtp}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.6 }}>
                      6-Digit OTP Code
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. 123456"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                      required
                      autoFocus
                      slotProps={{ htmlInput: { style: { textAlign: 'center', letterSpacing: '0.4em', fontSize: '1.3rem', fontWeight: 700 } } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 52,
                          borderRadius: '10px',
                          bgcolor: '#FFFFFF',
                        },
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={authLoading || otpToken.length < 6}
                    endIcon={authLoading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#0F766E',
                      height: 46,
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(15,118,110,0.25)',
                      '&:hover': { bgcolor: '#0D6861' },
                    }}
                  >
                    {authLoading ? 'Verifying...' : 'Verify Email & Activate'}
                  </Button>
                </Stack>
              </form>

              <Stack direction="row" sx={{ justifyContent: 'center', mt: 3 }} spacing={1}>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>
                  Entered wrong email or already verified?
                </Typography>
                <Typography
                  onClick={() => { setErrorMsg(null); setSuccessMsg(null); setMode('signin'); }}
                  sx={{ fontSize: '0.875rem', color: '#0F766E', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Back to Sign In
                </Typography>
              </Stack>
            </Box>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {mode === 'forgot' && (
            <Box>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#0F172A', mb: 0.5 }}>
                Reset Password
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.875rem', mb: 3 }}>
                Enter your registered email and we will send you a secure password reset link.
              </Typography>

              <form onSubmit={handleForgotPassword}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.6 }}>
                      Institutional / Official Email
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="doctor@medora.edu"
                      value={forgotEmail || email}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      autoFocus
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 46,
                          borderRadius: '10px',
                          bgcolor: '#FFFFFF',
                        },
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={authLoading}
                    endIcon={authLoading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#0F766E',
                      height: 46,
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(15,118,110,0.25)',
                      '&:hover': { bgcolor: '#0D6861' },
                    }}
                  >
                    {authLoading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
                  </Button>
                </Stack>
              </form>

              <Stack direction="row" sx={{ justifyContent: 'center', mt: 3 }} spacing={1}>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>
                  Remembered your password?
                </Typography>
                <Typography
                  onClick={() => { setErrorMsg(null); setSuccessMsg(null); setMode('signin'); }}
                  sx={{ fontSize: '0.875rem', color: '#0F766E', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Back to Sign In
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
