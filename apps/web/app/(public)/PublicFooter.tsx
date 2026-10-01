'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// Icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { INSTITUTION_INFO } from './public-data';

export default function PublicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#071620', color: '#FFFFFF', pt: 8, pb: 4, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Col 1: Identity & Accreditations */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '10px',
                  bgcolor: '#0F766E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.2rem', lineHeight: 1.15 }}>
                  MedicaCare
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: '#5EEAD4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Medical College &amp; Hospital
                </Typography>
              </Box>
            </Stack>

            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, mb: 3 }}>
              A premier autonomous medical education, healthcare and clinical research institution committed to imparting world-class evidence-based medical training and subsidized tertiary compassionate care.
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: '#5EEAD4 !important' }} />} label="NMC Recognized" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 600 }} />
              <Chip label="NAAC Grade A+" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#FACC15', fontSize: '0.7rem', fontWeight: 700 }} />
              <Chip label="NABH Hospital" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 600 }} />
              <Chip label="NABL Diagnostics" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 600 }} />
            </Stack>
          </Grid>

          {/* Col 2: Academic Programs */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#5EEAD4', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Programs
            </Typography>
            <Stack spacing={1.2}>
              {[
                { label: 'MBBS Degree (250 Seats)', href: '/courses/mbbs' },
                { label: 'MD General Medicine', href: '/courses' },
                { label: 'MS General Surgery', href: '/courses' },
                { label: 'MD Pediatrics & Child Care', href: '/courses' },
                { label: 'MD Radio-Diagnosis (3T MRI)', href: '/courses' },
                { label: 'B.Sc. Professional Nursing', href: '/courses' },
                { label: 'Paramedical Diplomas (DMLT)', href: '/courses' },
                { label: 'NEET Admission Regulations', href: '/admissions' },
              ].map((item, idx) => (
                <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', transition: 'color 0.15s', '&:hover': { color: '#5EEAD4' } }}>
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Col 3: Hospital & Clinical Services */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#5EEAD4', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hospital &amp; Clinical
            </Typography>
            <Stack spacing={1.2}>
              {[
                { label: '750-Bedded Teaching Hospital', href: '/hospital' },
                { label: '24/7 Casualty & Trauma Red Resus', href: '/hospital#emergency' },
                { label: 'Critical Care (ICU / CCU / NICU)', href: '/hospital#icu' },
                { label: '12 Modular Operation Theatres', href: '/hospital#ot' },
                { label: 'Licensed Blood Bank & Components', href: '/hospital#blood-bank' },
                { label: 'NABL Central Pathology & Micro', href: '/departments/pathology' },
                { label: 'Consultant Doctors Directory', href: '/doctors' },
                { label: 'Book OPD Token Online', href: '/appointment' },
              ].map((item, idx) => (
                <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', transition: 'color 0.15s', '&:hover': { color: '#5EEAD4' } }}>
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Col 4: Campus & Emergency Helpline */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#5EEAD4', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campus Contact &amp; Emergency
            </Typography>

            <Stack spacing={2} sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem' }}>
              <Stack direction="row" spacing={1.2} sx={{ alignItems: 'flex-start' }}>
                <LocationOnIcon sx={{ fontSize: 18, color: '#5EEAD4', mt: 0.2 }} />
                <Typography sx={{ fontSize: 'inherit', lineHeight: 1.5 }}>
                  {INSTITUTION_INFO.address}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                <PhoneIcon sx={{ fontSize: 18, color: '#F87171' }} />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>24/7 Casualty Helpline:</Typography>
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#F87171' }}>
                    {INSTITUTION_INFO.casualtyHelpline}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                <EmailIcon sx={{ fontSize: 18, color: '#5EEAD4' }} />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Registrar Office:</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#FFFFFF', fontWeight: 600 }}>
                    {INSTITUTION_INFO.email}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ pt: 1 }}>
                <Link href="/portal" style={{ textDecoration: 'none' }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '8px',
                      bgcolor: 'rgba(15,118,110,0.25)',
                      border: '1px solid rgba(94,234,212,0.3)',
                      color: '#5EEAD4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(15,118,110,0.4)' },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Faculty / Student Portal Login</Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>→</Typography>
                  </Box>
                </Link>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />

        {/* Bottom Strip */}
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: 'center' }} spacing={2}>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} {INSTITUTION_INFO.name}. All Rights Reserved. Approved by NMC &amp; Ministry of Health.
          </Typography>

          <Stack direction="row" spacing={3} sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/about#disclosure" style={{ color: 'inherit', textDecoration: 'none' }}>
              NMC Mandatory Disclosure
            </Link>
            <Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
              Citizen Charter
            </Link>
            <Link href="/notices" style={{ color: 'inherit', textDecoration: 'none' }}>
              Anti-Ragging Committee
            </Link>
            <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
              Internal Complaints (ICC)
            </Link>
          </Stack>

          <IconButton onClick={scrollToTop} size="small" sx={{ color: '#5EEAD4', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
            <KeyboardArrowUpIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
}
