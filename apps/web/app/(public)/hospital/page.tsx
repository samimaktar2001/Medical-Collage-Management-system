'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

// Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HotelIcon from '@mui/icons-material/Hotel';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

import { INSTITUTION_INFO } from '../public-data';

export default function HospitalPublicPage() {
  const hospitalUnits = [
    {
      title: '24/7 Casualty & Trauma Resus',
      badge: 'Red Triage 24/7',
      desc: 'Equipped with 20 resuscitation bays, ventilator life support, emergency minor OT, trauma radiology, and immediate blood bank access.',
      stats: '1800-419-MED Helpline',
    },
    {
      title: '60-Bedded Critical Care Suites',
      badge: 'ICU • CCU • NICU • PICU',
      desc: 'High-dependency units staffed round-the-clock by critical care intensivists with continuous hemodynamic monitoring and dialysis.',
      stats: '60+ Ventilator Beds',
    },
    {
      title: '12 Modular Operation Theatres',
      badge: 'HEPA Laminar Airflow',
      desc: 'Class-100 sterile surgical suites executing cardiac, neurosurgery, minimally invasive 4K laparoscopy, joint replacement, and emergency surgery.',
      stats: '45+ Surgeries Daily',
    },
    {
      title: 'Licensed Blood Bank & Component Unit',
      badge: 'Licensed 24/7',
      desc: 'Apheresis, component separation (PRBC, Fresh Frozen Plasma, Platelet concentrates, Cryoprecipitate) and 100% voluntary testing.',
      stats: '2,000+ Units Storage',
    },
    {
      title: '3.0T MRI & 128-Slice Helical CT',
      badge: 'NABL Diagnostics',
      desc: 'Ultra-fast low-dose cross-sectional imaging, digital fluoroscopy, high-resolution mammography, and 4D color Doppler ultrasound.',
      stats: 'PACS Cloud Reports',
    },
    {
      title: 'Subsidized Inpatient Wards',
      badge: 'General & Private',
      desc: 'Clean, well-ventilated male/female medical, surgical, orthopedic, and pediatric wards with free generic pharmacy dispensing.',
      stats: '750 Total Beds',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Hero Banner ─── */}
      <Box sx={{ bgcolor: '#0B2332', color: '#FFFFFF', py: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Chip label="NABH & NABL Accredited University Hospital" sx={{ bgcolor: 'rgba(94,234,212,0.18)', color: '#5EEAD4', fontWeight: 700, mb: 1.5 }} />
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.2, mb: 2 }}>
            750-Bedded Tertiary Teaching Hospital
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 800, lineHeight: 1.6 }}>
            Serving as the primary clinical teaching center for medical scholars while providing round-the-clock emergency, specialized inpatient, and subsidized outpatient healing to over 600,000 patients every year.
          </Typography>
        </Container>
      </Box>

      {/* ─── Emergency Callout Strip ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: -3 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 12px 35px rgba(220,38,38,0.38)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { md: 'center' },
            gap: 2.5,
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                bgcolor: 'rgba(255,255,255,0.22)',
                border: '1px solid rgba(255,255,255,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <PhoneInTalkIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  color: '#FFFFFF !important',
                  textShadow: '0 2px 6px rgba(0,0,0,0.35)',
                  lineHeight: 1.25,
                }}
              >
                24/7 Emergency Casualty &amp; Trauma Resuscitation Hotline
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: '#FEE2E2 !important',
                  fontWeight: 500,
                  mt: 0.4,
                  textShadow: '0 1px 3px rgba(0,0,0,0.25)',
                }}
              >
                Immediate ambulance dispatch, cardiac arrest code blue, stroke team, and emergency polytrauma stabilization.
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              bgcolor: 'rgba(0,0,0,0.22)',
              px: { xs: 2.5, md: 3 },
              py: 1.2,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.3)',
              textAlign: { xs: 'left', md: 'right' },
              flexShrink: 0,
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FECACA !important',
                fontWeight: 700,
              }}
            >
              Toll Free • Immediate Response
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 900,
                fontSize: { xs: '1.45rem', md: '1.75rem' },
                color: '#FFFFFF !important',
                letterSpacing: '0.03em',
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                lineHeight: 1.15,
              }}
            >
              {INSTITUTION_INFO.casualtyHelpline}
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* ─── Hospital Units Grid ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
            Tertiary Healthcare Infrastructure
          </Typography>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.875rem', color: '#0F172A' }}>
            Comprehensive Clinical &amp; Critical Care Units
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {hospitalUnits.map((unit, idx) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
              <Card
                elevation={0}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: '16px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#0F766E' },
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip label={unit.badge} size="small" sx={{ bgcolor: 'rgba(15,118,110,0.1)', color: '#0F766E', fontWeight: 800, fontSize: '0.7rem' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700 }}>{unit.stats}</Typography>
                </Stack>

                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F172A', mb: 1.5 }}>
                  {unit.title}
                </Typography>

                <Typography sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.65, mb: 3, flexGrow: 1 }}>
                  {unit.desc}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Link href="/appointment" style={{ textDecoration: 'none' }}>
                  <Button fullWidth variant="outlined" size="small" sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', color: '#0F766E', borderColor: '#0F766E' }}>
                    Consultant Booking &amp; Details
                  </Button>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ─── Visiting Hours & Inpatient Rules ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 8 }}>
        <Paper sx={{ p: 4, borderRadius: '20px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 3 }}>
            Patient Inpatient Admission &amp; Visitor Guidelines
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', height: '100%' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F766E', mb: 1 }}>OPD Registration</Typography>
                <Typography sx={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.6 }}>
                  Counters open at 08:00 AM daily. Token system ensures zero waiting outside consulting rooms. Senior citizens and emergency patients receive priority triage.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', height: '100%' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F766E', mb: 1 }}>Inpatient Visiting Hours</Typography>
                <Typography sx={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.6 }}>
                  Morning: 10:30 AM – 11:30 AM | Evening: 04:30 PM – 06:30 PM. Only 1 designated attendant pass is permitted per patient to ensure infection control.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', height: '100%' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F766E', mb: 1 }}>Government Health Schemes</Typography>
                <Typography sx={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.6 }}>
                  Empanelled under Swasthya Sathi, Ayushman Bharat PM-JAY, CGHS, and major private health TPA insurances for cashless hospitalizations.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
