'use client';

import React, { use } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import toast from 'react-hot-toast';

// Icons
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import SecurityUpdateWarningOutlinedIcon from '@mui/icons-material/SecurityUpdateWarningOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import ReplayIcon from '@mui/icons-material/Replay';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

type StatusConfig = {
  title: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  isRetry?: boolean;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  '401': {
    title: '401 - Unauthorized Access',
    badge: 'Security Authentication Required',
    badgeColor: '#B45309',
    badgeBg: '#FEF3C7',
    icon: <LockPersonOutlinedIcon sx={{ fontSize: 48, color: '#D97706' }} />,
    headline: 'Your Medical Portal Session Has Expired',
    description:
      'Access to electronic health records, student academic files, and clinical systems requires active credential verification. Please authenticate through the institutional portal to continue.',
    primaryActionLabel: 'Sign In to Portal',
    primaryActionHref: '/portal',
  },
  '403': {
    title: '403 - Forbidden Access',
    badge: 'Restricted Clinical Zone',
    badgeColor: '#B91C1C',
    badgeBg: '#FEE2E2',
    icon: <SecurityUpdateWarningOutlinedIcon sx={{ fontSize: 48, color: '#DC2626' }} />,
    headline: 'Access Denied / Insufficient Permissions',
    description:
      'Your assigned institutional role does not carry authorization clearance to view this patient dossier, audit ledger, or administrative configuration module. If you require privilege elevation, contact the Dean of Academics or Hospital Administration.',
    primaryActionLabel: 'Return to Safe Dashboard',
    primaryActionHref: '/portal/dashboard',
  },
  '404': {
    title: '404 - Resource Not Found',
    badge: 'Clinical Archive Missing',
    badgeColor: '#1D4ED8',
    badgeBg: '#DBEAFE',
    icon: <FindInPageOutlinedIcon sx={{ fontSize: 48, color: '#2563EB' }} />,
    headline: 'Requested Record or Page Unavailable',
    description:
      'The patient UHID, academic curriculum document, or portal endpoint you navigated to does not exist, has been archived, or was moved during hospital data migration.',
    primaryActionLabel: 'Return to Clinical Portal',
    primaryActionHref: '/portal',
  },
  '500': {
    title: '500 - System Exception',
    badge: 'Backend Service Error',
    badgeColor: '#6D28D9',
    badgeBg: '#EDE9FE',
    icon: <DnsOutlinedIcon sx={{ fontSize: 48, color: '#7C3AED' }} />,
    headline: 'Hospital Information System Internal Error',
    description:
      'An unexpected database transaction or microservice processing failure occurred while fulfilling this clinical request. The error has been captured and routed to the Hospital IT Engineering desk.',
    primaryActionLabel: 'Retry Operation',
    primaryActionHref: '#retry',
    isRetry: true,
  },
  '503': {
    title: '503 - Service Unavailable',
    badge: 'Scheduled Maintenance / Health Check',
    badgeColor: '#0F766E',
    badgeBg: '#CCFBF1',
    icon: <HandymanOutlinedIcon sx={{ fontSize: 48, color: '#0F766E' }} />,
    headline: 'System Under Active Maintenance',
    description:
      'Our medical database clusters and high-availability servers are currently undergoing routine maintenance or failover synchronization. Normal clinical services will resume shortly.',
    primaryActionLabel: 'Refresh & Check Health',
    primaryActionHref: '#retry',
    isRetry: true,
  },
};

export default function ErrorStatusCodePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = (params?.code as string) || '500';
  const customMessage = searchParams?.get('message');
  const fromUrl = searchParams?.get('from');
  const correlationId = searchParams?.get('correlation_id') || `TRACE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const config: StatusConfig = STATUS_MAP[code] || {
    title: `${code} - Unexpected Response`,
    badge: `HTTP Status ${code}`,
    badgeColor: '#475569',
    badgeBg: '#F1F5F9',
    icon: <DnsOutlinedIcon sx={{ fontSize: 48, color: '#64748B' }} />,
    headline: `Request Interrupted (Code ${code})`,
    description: customMessage || 'An unexpected server condition occurred while processing this hospital portal operation.',
    primaryActionLabel: 'Return to Portal',
    primaryActionHref: '/portal',
  };

  const copyIncidentId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(correlationId);
      toast.success('Incident Trace ID copied to clipboard!');
    }
  };

  const handlePrimaryClick = () => {
    if (config.isRetry) {
      if (fromUrl) {
        router.push(fromUrl);
      } else {
        router.refresh();
      }
    } else {
      router.push(fromUrl && code === '401' ? `/portal?returnUrl=${encodeURIComponent(fromUrl)}` : config.primaryActionHref);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0A1926',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(15,118,110,0.25) 0%, rgba(10,25,38,0.98) 75%)',
      }}
    >
      {/* Background aesthetic glow circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Hospital Branding Header */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: '#0F766E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(15,118,110,0.4)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Medora Medical College
            </Typography>
            <Typography sx={{ color: '#5EEAD4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Hospital Information Management System
            </Typography>
          </Box>
        </Stack>

        {/* Central Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5, md: 6 },
            borderRadius: '24px',
            bgcolor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
            textAlign: 'center',
          }}
        >
          {/* Status Badge & Icon */}
          <Box sx={{ mb: 2.5 }}>
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                bgcolor: config.badgeBg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                boxShadow: `0 8px 24px ${config.badgeBg}`,
              }}
            >
              {config.icon}
            </Box>
            <div>
              <Chip
                label={config.badge}
                sx={{
                  bgcolor: config.badgeBg,
                  color: config.badgeColor,
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  px: 1,
                  height: 28,
                }}
              />
            </div>
          </Box>

          {/* Big Error Code Number */}
          <Typography
            sx={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: { xs: '3.5rem', sm: '5rem' },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(180deg, #FFFFFF 30%, rgba(255,255,255,0.4) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1.5,
            }}
          >
            {code}
          </Typography>

          {/* Headline */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: { xs: '1.35rem', sm: '1.75rem' },
              color: '#FFFFFF',
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            {config.headline}
          </Typography>

          {/* Contextual Description */}
          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: { xs: '0.92rem', sm: '1rem' },
              maxWidth: 640,
              mx: 'auto',
              lineHeight: 1.65,
              mb: 4,
            }}
          >
            {customMessage || config.description}
          </Typography>

          {/* Diagnostic Incident Trace Box */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxWidth: 520,
              mx: 'auto',
              mb: 4.5,
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  System Incident Identifier
                </Typography>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#5EEAD4', fontWeight: 700 }}>
                  {correlationId}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                onClick={copyIncidentId}
                sx={{
                  color: '#94A3B8',
                  borderColor: 'rgba(255,255,255,0.15)',
                  fontSize: '0.72rem',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#5EEAD4', color: '#5EEAD4' },
                }}
              >
                Copy Trace ID
              </Button>
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handlePrimaryClick}
              startIcon={config.isRetry ? <ReplayIcon /> : <LoginIcon />}
              sx={{
                bgcolor: '#0F766E',
                px: 3.5,
                py: 1.3,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(15,118,110,0.35)',
                '&:hover': { bgcolor: '#0D6861' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {config.primaryActionLabel}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/')}
              startIcon={<HomeIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                px: 3.5,
                py: 1.3,
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: '#FFFFFF' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Medical College Homepage
            </Button>

            {typeof window !== 'undefined' && window.history.length > 1 && (
              <Button
                variant="text"
                size="large"
                onClick={() => router.back()}
                startIcon={<ArrowBackIcon />}
                sx={{
                  color: '#94A3B8',
                  px: 2,
                  py: 1.3,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  '&:hover': { color: '#FFFFFF' },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Go Back
              </Button>
            )}
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />

          {/* Hospital Helpdesk Contact */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'center', alignItems: 'center', color: '#64748B', fontSize: '0.8125rem' }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <ContactSupportIcon sx={{ fontSize: 16, color: '#0F766E' }} />
              <span>Hospital Technical Desk: <strong>Ext. 4401</strong></span>
            </Stack>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>Emergency IT: <strong>it-support@medora.edu</strong></span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>NMC IT Compliance &amp; Security</span>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
