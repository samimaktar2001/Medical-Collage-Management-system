'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import { PageHeader } from '../../../PageHeader';
import { StatusBadge } from '../../../StatusBadge';
import { useAuth } from '../../PortalShell';
import toast from 'react-hot-toast';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DevicesIcon from '@mui/icons-material/Devices';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export default function UserProfilePage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(0);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Ahmed Rahman',
    email: 'ahmed.rahman@medcol.edu.in',
    phone: '+91 98765 43210',
    department: user?.department || 'Cardiology & General Medicine',
    designation: 'Senior Consultant & Clinical Administrator',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology), FACC',
    registrationNumber: 'WB-MCI-2016-8842',
    bio: 'Senior faculty and consultant specializing in interventional cardiology and medical college administration with over 14 years of clinical & academic leadership.',
    bloodGroup: 'B+ Positive',
    address: 'Faculty Enclave, Campus Quarter 4B, Medical College Campus, Kolkata 700073',
  });

  // Password State
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Security Toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [statPushAlerts, setStatPushAlerts] = useState(true);

  // Active Sessions Mock
  const activeSessions = [
    {
      id: 'sess-1',
      device: 'Chrome on Windows 11',
      location: 'Kolkata, WB (Current Session)',
      ip: '192.168.1.104',
      lastActive: 'Just Now',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'Safari on iPhone 15 Pro',
      location: 'Kolkata, WB',
      ip: '103.21.144.22',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: 'sess-3',
      device: 'Edge on Hospital Workstation (OPD-102)',
      location: 'Campus Intranet',
      ip: '10.0.4.15',
      lastActive: 'Yesterday at 05:40 PM',
      isCurrent: false,
    },
  ];

  // Role Permissions based on user role
  const permissionsList = [
    { name: 'Patient OPD & IPD Clinical Charting', granted: true, scope: 'Full Access' },
    { name: 'Electronic Prescription & Rx Dispense Writer', granted: true, scope: 'Full Access' },
    { name: 'NMC Statutory MSR Inspection Verification', granted: true, scope: 'Institutional Scope' },
    { name: 'Hospital Bed Occupancy & Admission Registry', granted: true, scope: 'Campus-wide' },
    { name: 'Civil Registration (Birth & Death Form 1/2)', granted: true, scope: 'Authorized Signatory' },
    { name: 'Student Academic Dossiers & Logbook Audit', granted: true, scope: 'Academic Faculty' },
    { name: 'Cashless Scheme Pre-Auth Approvals (PM-JAY)', granted: true, scope: 'Supervisory Level' },
    { name: 'System Roles & Institutional Configuration', granted: user?.role === 'super_admin' || user?.role === 'admin' || !user?.role, scope: 'Administrative Scope' },
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile details updated successfully!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    toast.success('Password changed successfully. Please keep it safe.');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleTerminateSession = (id: string) => {
    toast.success('Session terminated successfully.');
  };

  const isFemale =
    user?.name &&
    /ananya|priyanka|sunita|sadia|farzana|fatima|meera|neha|shireen/i.test(user.name);

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Page Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/portal/dashboard' },
          { label: 'My Account' },
          { label: 'User Profile' },
        ]}
        category="Account & Security"
        title="My Profile & Account Settings"
        description="Manage your institutional identity, clinical qualifications, security credentials, and system role privileges."
        icon={<PersonIcon />}
        badge={<StatusBadge status={user?.role?.toUpperCase() || 'SUPER ADMIN'} tone="teal" />}
      />

      {/* ─── Profile Hero Banner Card ─── */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          p: { xs: 2.5, md: 3.5 },
          mb: 3.5,
          bgcolor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}
        >
          {/* Avatar & Core Bio */}
          <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={isFemale ? '/images/doctor-female-placeholder.svg' : '/images/doctor-placeholder.svg'}
                alt={formData.name}
                sx={{
                  width: { xs: 80, sm: 96 },
                  height: { xs: 80, sm: 96 },
                  bgcolor: '#F0FDFA',
                  border: '3px solid #0F766E',
                  boxShadow: '0 4px 14px rgba(15,118,110,0.25)',
                }}
              />
              <Tooltip title="Update Profile Picture">
                <IconButton
                  size="small"
                  onClick={() => toast('Avatar photo upload is active.', { icon: '📷' })}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#0F766E',
                    color: '#FFFFFF',
                    border: '2px solid #FFFFFF',
                    width: 32,
                    height: 32,
                    '&:hover': { bgcolor: '#0D6861' },
                  }}
                >
                  <CameraAltIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: '1.4rem', sm: '1.75rem' },
                    color: '#0F172A',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {formData.name}
                </Typography>
                <StatusBadge status="Verified Staff" tone="success" />
                <StatusBadge status={user?.role?.toUpperCase() || 'SUPER ADMIN'} tone="teal" />
              </Stack>

              <Typography sx={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600, mb: 0.5 }}>
                {formData.designation} • {formData.department}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1.5, color: '#64748B', fontSize: '0.8125rem' }}>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <BadgeIcon sx={{ fontSize: 16, color: '#0F766E' }} /> ID: <strong>MED-ADM-2026</strong>
                </Box>
                <Box component="span">•</Box>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 16, color: '#0F766E' }} /> {formData.email}
                </Box>
                <Box component="span">•</Box>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: '#0F766E' }} /> {formData.phone}
                </Box>
              </Stack>
            </Box>
          </Stack>

          {/* Quick Metrics Pills */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              flexWrap: 'wrap',
              gap: 1.5,
              width: { xs: '100%', md: 'auto' },
              pt: { xs: 2, md: 0 },
              borderTop: { xs: '1px solid #F1F5F9', md: 'none' },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                px: 2,
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                bgcolor: '#F8FAFC',
                minWidth: 120,
              }}
            >
              <Typography sx={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Account Health
              </Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 18 }} /> 100% Active
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                px: 2,
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                bgcolor: '#F8FAFC',
                minWidth: 120,
              }}
            >
              <Typography sx={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                2FA Protection
              </Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F766E', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VerifiedUserIcon sx={{ fontSize: 18 }} /> Enabled
              </Typography>
            </Paper>
          </Stack>
        </Stack>
      </Card>

      {/* ─── Profile Navigation Tabs ─── */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: '#FAFCFD', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                minHeight: 52,
                color: '#64748B',
                '&.Mui-selected': { color: '#0F766E' },
              },
            }}
          >
            <Tab icon={<PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Personal & Professional Profile" />
            <Tab icon={<SecurityIcon sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Security & Password" />
            <Tab icon={<AdminPanelSettingsIcon sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Role & Access Privileges" />
            <Tab icon={<NotificationsActiveIcon sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Notification Settings" />
          </Tabs>
        </Box>

        {/* ─── TAB 0: PERSONAL & CLINICAL DETAILS ─── */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleProfileSave} sx={{ p: { xs: 2.5, md: 4 } }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
                Personal & Clinical Credentials
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                These details are officially recorded in clinical discharge summaries, prescription headers, and administrative documents.
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Official Email Address"
                  value={formData.email}
                  disabled
                  helperText="Managed by institutional Google Workspace / Active Directory"
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CheckCircleIcon sx={{ color: '#059669', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Department / Unit"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Designation / Official Title"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="State Medical Council / Institutional Reg. No."
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Academic Degrees & Fellowships"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Professional Bio & Clinical Scope"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Residential / Campus Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  size="small"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                sx={{ borderColor: '#CBD5E1', color: '#475569', textTransform: 'none', fontWeight: 600 }}
                onClick={() => toast('Reverted unsaved changes.')}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  bgcolor: '#0F766E',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
                  '&:hover': { bgcolor: '#0D6861' },
                }}
              >
                Save Profile Changes
              </Button>
            </Stack>
          </Box>
        )}

        {/* ─── TAB 1: SECURITY & PASSWORD ─── */}
        {activeTab === 1 && (
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Grid container spacing={4}>
              {/* Left Column: Password Update */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box component="form" onSubmit={handlePasswordUpdate}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
                    Change Account Password
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mb: 3 }}>
                    Ensure your account is using a strong password with letters, numbers, and symbols.
                  </Typography>

                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth
                      type={showCurrent ? 'text' : 'password'}
                      label="Current Password"
                      size="small"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowCurrent(!showCurrent)} size="small">
                                {showCurrent ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      type={showNew ? 'text' : 'password'}
                      label="New Password"
                      size="small"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowNew(!showNew)} size="small">
                                {showNew ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      type={showConfirm ? 'text' : 'password'}
                      label="Confirm New Password"
                      size="small"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirm(!showConfirm)} size="small">
                                {showConfirm ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<LockResetIcon />}
                      sx={{
                        bgcolor: '#0F766E',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        textTransform: 'none',
                        py: 1,
                        mt: 1,
                        '&:hover': { bgcolor: '#0D6861' },
                      }}
                    >
                      Update Password
                    </Button>
                  </Stack>
                </Box>
              </Grid>

              {/* Right Column: 2FA & Security Policies */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
                  Two-Factor Authentication (2FA)
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mb: 2 }}>
                  Enforce an additional layer of security on login via Google Authenticator or statutory SMS OTP.
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '12px',
                    border: '1px solid #CCFBF1',
                    bgcolor: '#F0FDFA',
                    mb: 3,
                  }}
                >
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0F766E', fontSize: '0.925rem' }}>
                        Authenticator App / OTP
                      </Typography>
                      <Typography sx={{ color: '#475569', fontSize: '0.8125rem' }}>
                        Required for high-privilege hospital operations
                      </Typography>
                    </Box>
                    <Switch
                      checked={twoFactorEnabled}
                      onChange={(e) => {
                        setTwoFactorEnabled(e.target.checked);
                        toast.success(`Two-factor authentication ${e.target.checked ? 'enabled' : 'disabled'}.`);
                      }}
                      color="primary"
                    />
                  </Stack>
                </Paper>

                <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 1 }}>
                  Security Verification Stamp
                </Typography>
                <Alert severity="info" sx={{ borderRadius: '10px', fontSize: '0.8125rem' }}>
                  Institutional audits require password rotation every 90 days. Next review is scheduled on <strong>Nov 15, 2026</strong>.
                </Alert>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Active Sessions */}
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
                Active Login Sessions
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mb: 2 }}>
                Devices and browsers that are currently signed into your account.
              </Typography>

              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B' }}>DEVICE / BROWSER</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B' }}>LOCATION</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B' }}>IP ADDRESS</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B' }}>LAST ACTIVE</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B' }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeSessions.map((sess) => (
                      <TableRow key={sess.id}>
                        <TableCell>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <DevicesIcon sx={{ fontSize: 18, color: sess.isCurrent ? '#0F766E' : '#94A3B8' }} />
                            <Box>
                              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                                {sess.device}
                              </Typography>
                              {sess.isCurrent && (
                                <Chip label="Current Device" size="small" sx={{ bgcolor: '#CCFBF1', color: '#0F766E', fontSize: '0.65rem', height: 18, fontWeight: 700 }} />
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem', color: '#475569' }}>{sess.location}</TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: '#64748B' }}>{sess.ip}</TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem', color: '#475569' }}>{sess.lastActive}</TableCell>
                        <TableCell align="right">
                          {sess.isCurrent ? (
                            <Typography sx={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                              Active Now
                            </Typography>
                          ) : (
                            <Button
                              size="small"
                              onClick={() => handleTerminateSession(sess.id)}
                              sx={{ textTransform: 'none', color: '#DC2626', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              Sign Out
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}

        {/* ─── TAB 2: ROLE PRIVILEGES & PERMISSIONS ─── */}
        {activeTab === 2 && (
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
                Assigned Role: {user?.role?.toUpperCase() || 'SUPER ADMIN'}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                Your account is provisioned with institutional governance credentials regulated under NMC compliance and hospital administration protocols.
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {permissionsList.map((perm, idx) => (
                <Grid size={{ xs: 12, md: 6 }} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      bgcolor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleIcon sx={{ color: perm.granted ? '#059669' : '#94A3B8', fontSize: 20 }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                          {perm.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                          Scope: {perm.scope}
                        </Typography>
                      </Box>
                    </Box>
                    <StatusBadge status={perm.granted ? 'Granted' : 'Restricted'} tone={perm.granted ? 'success' : 'neutral'} />
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Alert severity="success" sx={{ borderRadius: '10px', fontSize: '0.85rem' }}>
              <strong>RBAC Audit Status:</strong> All role permissions are mapped directly to your user token session. If you require higher privilege elevations, contact the Principal or IT Director console.
            </Alert>
          </Box>
        )}

        {/* ─── TAB 3: NOTIFICATION SETTINGS ─── */}
        {activeTab === 3 && (
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
                Notification Channels & Clinical Dispatch
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                Customize how you receive critical STAT medical alerts, circulars, and departmental updates.
              </Typography>
            </Box>

            <Stack spacing={2.5}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.925rem' }}>
                      STAT Emergency & Bedside Call Alerts
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
                      Immediate high-priority browser audio chimes and mobile push notifications for critical patient vitals.
                    </Typography>
                  </Box>
                  <Switch
                    checked={statPushAlerts}
                    onChange={(e) => {
                      setStatPushAlerts(e.target.checked);
                      toast.success(`STAT call notifications ${e.target.checked ? 'activated' : 'muted'}.`);
                    }}
                    color="primary"
                  />
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.925rem' }}>
                      Official Circulars & Exam Gazettes via Email
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
                      Receive daily digest of institutional notices, curriculum rosters, and University circulars.
                    </Typography>
                  </Box>
                  <Switch
                    checked={emailAlerts}
                    onChange={(e) => {
                      setEmailAlerts(e.target.checked);
                      toast.success(`Email notices ${e.target.checked ? 'enabled' : 'disabled'}.`);
                    }}
                    color="primary"
                  />
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.925rem' }}>
                      Duty Roaster & Shift Change SMS Alerts
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
                      Direct SMS to your registered mobile number for emergency shift rotations or on-call duties.
                    </Typography>
                  </Box>
                  <Switch
                    checked={smsAlerts}
                    onChange={(e) => {
                      setSmsAlerts(e.target.checked);
                      toast.success(`SMS duty alerts ${e.target.checked ? 'enabled' : 'disabled'}.`);
                    }}
                    color="primary"
                  />
                </Stack>
              </Paper>
            </Stack>
          </Box>
        )}
      </Card>
    </Box>
  );
}
