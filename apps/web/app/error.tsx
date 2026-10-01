'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import toast from 'react-hot-toast';

import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import HomeIcon from '@mui/icons-material/Home';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ErrorBoundaryPage({
  error,
  reset,
}: {
  error: Error & { digest?: string; correlation_id?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const traceId = error.digest || error.correlation_id || `ERR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  useEffect(() => {
    console.error('Hospital Portal Runtime Exception:', error);
  }, [error]);

  const copyIncidentId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(traceId);
      toast.success('Incident Digest ID copied to clipboard!');
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
        background: 'radial-gradient(ellipse at 50% 10%, rgba(220,38,38,0.18) 0%, rgba(10,25,38,0.98) 75%)',
      }}
    >
      <Container maxWidth="md">
        {/* Brand Header */}
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
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              bgcolor: '#EDE9FE',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2.5,
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)',
            }}
          >
            <DnsOutlinedIcon sx={{ fontSize: 48, color: '#7C3AED' }} />
          </Box>

          <div>
            <Chip
              label="500 · Server Runtime Exception"
              sx={{
                bgcolor: '#EDE9FE',
                color: '#6D28D9',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                px: 1,
                height: 28,
                mb: 1.5,
              }}
            />
          </div>

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
            500
          </Typography>

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
            Internal Medical Information System Error
          </Typography>

          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: { xs: '0.92rem', sm: '1rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.65,
              mb: 3.5,
            }}
          >
            An unhandled runtime error interrupted this hospital portal view. All saved medical data, prescriptions, and patient records remain safe in PostgreSQL storage.
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
                  Incident Trace Identifier
                </Typography>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#5EEAD4', fontWeight: 700 }}>
                  {traceId}
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

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => reset()}
              startIcon={<ReplayIcon />}
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
              Retry Operation
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
              Public Homepage
            </Button>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />

          <Typography sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
            Hospital Engineering Helpdesk: <strong>Ext. 4401</strong> · it-support@medora.edu
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
