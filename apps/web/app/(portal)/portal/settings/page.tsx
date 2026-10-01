'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import { PageHeader } from '../../../PageHeader';
import { useAuth, api } from '../../PortalShell';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [instName, setInstName] = useState('MedicaCare Medical College & Hospital');
  const [email, setEmail] = useState('admissions@medcol.edu.in');
  const [phone, setPhone] = useState('1066 / +91-11-22334455');
  const [address, setAddress] = useState('Health City Campus, Green Valley, Kolkata, WB 700032');
  const [topBarText, setTopBarText] = useState('NMC Recognized • NAAC A+ University • NABH Teaching Hospital');
  const [heroHeading, setHeroHeading] = useState('Pioneering the Future of Healthcare & Medical Education');

  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  useEffect(() => {
    api('settings')
      .then((data) => {
        if (data) {
          if (data.college_name || data.college_subtitle) setInstName(`${data.college_name} ${data.college_subtitle}`);
          if (data.admissions_email) setEmail(data.admissions_email);
          if (data.emergency_phone) setPhone(data.emergency_phone);
          if (data.address) setAddress(data.address);
          if (data.top_bar_text) setTopBarText(data.top_bar_text);
          if (data.heading) setHeroHeading(data.heading);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        college_name: instName.split(' ')[0],
        college_subtitle: instName.split(' ').slice(1).join(' '),
        admissions_email: email,
        emergency_phone: phone,
        address,
        top_bar_text: topBarText,
        heading: heroHeading
      };
      await api('settings', 'PATCH', payload, user?.csrf);
      setSaved(true);
      toast.success('System settings saved successfully');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'System', href: '/portal/dashboard' },
          { label: 'Settings' },
        ]}
        category="System Administration"
        title="Platform & System Configuration"
        description="Institutional parameters, multi-tenant preferences, security policies and notification triggers."
        icon={<SettingsIcon />}
      />

      {saved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }} onClose={() => setSaved(false)}>
          Configuration changes saved successfully!
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Institutional Identity Card */}
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3.5, bgcolor: '#FFFFFF' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
            Institutional Profile
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', mb: 3 }}>
            Official name and branding displayed across invoices, student grade cards and public website.
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Institution Legal Name"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Official Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Helpdesk Telephone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Timezone &amp; Currency"
                value="Asia/Kolkata (IST • UTC+05:30) — INR (₹)"
                disabled
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Campus Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Public Website Customization Card */}
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3.5, bgcolor: '#FFFFFF' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
            Public Website Content
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', mb: 3 }}>
            Manage the content displayed on the public landing page.
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Top Bar Notice/Accreditations"
                value={topBarText}
                onChange={(e) => setTopBarText(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Hero Main Heading"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Security & Access Policies */}
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3.5, bgcolor: '#FFFFFF' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
            Security, MFA &amp; Authentication Rules
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', mb: 2 }}>
            Configure multi-factor authentication, session expiration thresholds and password complexity.
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={<Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} color="primary" />}
              label={
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>Mandatory 2FA for Medical Administrators &amp; Doctors</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Require OTP verification when logging in from new IP subnets or devices.</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} color="primary" />}
              label={
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>Automated Critical Clinical &amp; Academic Alerts</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Send immediate notification to HOD on patient casualty escalation or exam backlog.</Typography>
                </Box>
              }
            />
          </Stack>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              bgcolor: '#0F766E',
              fontWeight: 700,
              fontSize: '0.9375rem',
              borderRadius: '9px',
              textTransform: 'none',
              px: 4,
              py: 1.2,
              boxShadow: '0 2px 8px rgba(15,118,110,0.25)',
              '&:hover': { bgcolor: '#0D6861' },
            }}
          >
            Save Configuration Changes
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
