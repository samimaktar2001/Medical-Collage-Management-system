'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
  const router = useRouter();

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
        background: 'radial-gradient(ellipse at 50% 10%, rgba(15,118,110,0.25) 0%, rgba(10,25,38,0.98) 75%)',
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
              bgcolor: '#DBEAFE',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2.5,
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
            }}
          >
            <FindInPageOutlinedIcon sx={{ fontSize: 48, color: '#2563EB' }} />
          </Box>

          <div>
            <Chip
              label="404 · Record Or Page Not Found"
              sx={{
                bgcolor: '#DBEAFE',
                color: '#1D4ED8',
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
            404
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
            Requested Clinical Dossier Or Page Missing
          </Typography>

          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: { xs: '0.92rem', sm: '1rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.65,
              mb: 4.5,
            }}
          >
            The patient admission record, academic notice, or hospital portal page you requested could not be located. It may have been archived, transferred to a different clinical unit, or entered with an invalid URL.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/')}
              startIcon={<HomeIcon />}
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
              Public Homepage
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => router.back()}
              startIcon={<ArrowBackIcon />}
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
              Go Back
            </Button>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />

          <Typography sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
            Medora Medical College &amp; Hospital · Digital Records &amp; Academic Information System
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
