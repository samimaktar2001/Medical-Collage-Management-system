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
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { INSTITUTION_INFO } from '../public-data';

export default function AboutPage() {
  const leadership = [
    {
      role: 'Principal & Dean',
      name: 'Prof. (Dr.) Debabrata Majumdar',
      degree: 'MBBS, MD (Medicine), DM (Cardiology), FACC',
      reg: 'WBMC-32104',
      avatar: '/images/doctor-placeholder.svg',
      message: 'Medical science is an eternal pledge of empathy, scientific precision, and selfless human service. At MedicaCare, we nurture future healers through rigorous bedside clinical immersion and high ethical conviction.',
    },
    {
      role: 'Medical Superintendent cum Vice Principal',
      name: 'Prof. (Dr.) Suniti K. Ganguly',
      degree: 'MBBS, MS (Gen Surgery), M.Ch. (Surgical Oncology)',
      reg: 'WBMC-35928',
      avatar: '/images/doctor-placeholder.svg',
      message: 'Our 750-bedded teaching hospital treats over 1,800 patients daily. Every ward round, every ICU resuscitation, and every operation is an authentic masterclass for our medical undergraduates and resident doctors.',
    },
    {
      role: 'Dean of Academic Affairs',
      name: 'Prof. (Dr.) Anindita Chowdhury',
      degree: 'MBBS, MD (Pharmacology), Ph.D., FAIMER Fellow',
      reg: 'WBMC-41209',
      avatar: '/images/doctor-female-placeholder.svg',
      message: 'Committed to NMC Competency-Based Medical Education (CBME), our curriculum blends early clinical exposure, skills lab simulation, and formative assessment rubrics for well-rounded clinical competence.',
    },
  ];

  const milestones = [
    { year: '1998', title: 'Foundation & Genesis', desc: 'Established with an initial 100-bed hospital and 50 undergraduate MBBS student capacity.' },
    { year: '2008', title: 'NMC Permanent Recognition', desc: 'Granted permanent statutory recognition by National Medical Commission and Ministry of Health.' },
    { year: '2015', title: '750-Bedded Hospital & Postgraduates', desc: 'Commissioned the 10-story super-specialty hospital tower with MD/MS residency seats.' },
    { year: '2022', title: 'NAAC A+ Accreditation', desc: 'Awarded highest institutional grade A+ (CGPA 3.62) by National Assessment and Accreditation Council.' },
    { year: '2026', title: 'CBME Center of Excellence', desc: 'Pioneering advanced robotic surgical simulation, ICMR multi-centric trials, and 250 MBBS intake.' },
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 10 }}>
      {/* ─── Hero Header ─── */}
      <Box sx={{ bgcolor: '#0B2535', color: '#FFFFFF', py: { xs: 8, md: 10 }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: '15px !important', color: '#FACC15 !important' }} />}
            label="Institutional Heritage Since 1998"
            sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontWeight: 700, mb: 2 }}
          />
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.15, mb: 2, maxWidth: 900 }}>
            Shaping Compassionate Healers &amp; Advancing Clinical Science
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: { xs: '0.95rem', md: '1.1rem' }, maxWidth: 800, lineHeight: 1.6 }}>
            {INSTITUTION_INFO.name} is an autonomous medical university campus housing 1,250+ undergraduate and postgraduate medical scholars, a 750-bedded NABH-accredited tertiary care teaching hospital, and leading biomedical research labs.
          </Typography>
        </Container>
      </Box>

      {/* ─── Mission, Vision & Core Values ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: -4 }}>
        <Grid container spacing={3}>
          {[
            {
              title: 'Our Vision',
              icon: <WorkspacePremiumIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
              desc: 'To stand as a globally distinguished medical education center that leads in translational clinical innovation, humanistic healthcare delivery, and equitable patient healing.',
            },
            {
              title: 'Our Mission',
              icon: <SchoolIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
              desc: 'To produce ethically grounded, clinically confident doctors who combine sharp diagnostics with deep compassionate bedside care, trained rigorously in evidence-based medicine.',
            },
            {
              title: 'Clinical Commitment',
              icon: <LocalHospitalIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
              desc: 'To provide subsidized, round-the-clock tertiary and critical medical care to all strata of society without discrimination, serving as the trusted lifeline of the region.',
            },
          ].map((item, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card elevation={0} sx={{ p: 4, height: '100%', borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
                  {item.icon}
                </Box>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 1.5 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ─── Institutional Overview & Key Facts ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 8 }}>
        <Grid container spacing={5} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Academic &amp; Clinical Excellence
            </Typography>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, color: '#0F172A', lineHeight: 1.2, mb: 2.5 }}>
              A 52-Acre Modern Health Sciences University Ecosystem
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, mb: 2 }}>
              Founded with the noble mission to eliminate regional disparities in super-specialty healthcare and medical training, MedicaCare has grown into one of eastern India’s most revered medical institutions.
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, mb: 3 }}>
              Our undergraduate MBBS curriculum conforms strictly to the National Medical Commission (NMC) Competency-Based guidelines. With a 750-bed inpatient capacity, 12 modular laminar-flow operation theatres, and 60+ critical care beds, students observe and assist with high case volumes right from their second year of study.
            </Typography>

            <Grid container spacing={2}>
              {[
                { label: 'Annual MBBS Intake', val: '250 Seats' },
                { label: 'Hospital Beds', val: '750 Beds' },
                { label: 'Specialist Faculty', val: '320+ Doctors' },
                { label: 'Daily OPD Census', val: '1,800+ Patients' },
              ].map((stat, i) => (
                <Grid size={{ xs: 6 }} key={i}>
                  <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F766E' }}>
                      {stat.val}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Timeline Milestones */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 4, borderRadius: '20px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 3 }}>
                Historical Journey &amp; Milestones
              </Typography>

              <Stack spacing={3}>
                {milestones.map((m, idx) => (
                  <Stack key={idx} direction="row" spacing={2.5}>
                    <Box sx={{ minWidth: 64, textAlign: 'center' }}>
                      <Chip label={m.year} sx={{ bgcolor: '#0F766E', color: '#FFFFFF', fontWeight: 800, fontSize: '0.8rem' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', mb: 0.3 }}>
                        {m.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.825rem', color: '#64748B', lineHeight: 1.5 }}>
                        {m.desc}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* ─── Leadership Desk ─── */}
      <Box sx={{ bgcolor: '#FFFFFF', py: 8, mt: 8, borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth={false} id="leadership" sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
              Institutional Governance
            </Typography>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '2rem', color: '#0F172A' }}>
              Messages from College Leadership
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {leadership.map((leader, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Card elevation={0} sx={{ p: 4, height: '100%', borderRadius: '16px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2.5 }}>
                    <Avatar
                      src={leader.avatar || '/images/doctor-placeholder.svg'}
                      alt={leader.name}
                      sx={{
                        width: 58,
                        height: 58,
                        bgcolor: '#F0FDFA',
                        border: '2px solid #0F766E',
                        boxShadow: '0 4px 12px rgba(15,118,110,0.15)',
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>{leader.name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700 }}>{leader.role}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{leader.degree}</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Typography sx={{ color: '#475569', fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.6, flexGrow: 1 }}>
                    &ldquo;{leader.message}&rdquo;
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', mt: 2, fontWeight: 600 }}>
                    Council Reg: {leader.reg}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Mandatory NMC Disclosure Section (§Inspector Ready) ─── */}
      <Container maxWidth={false} id="disclosure" sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 8 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', bgcolor: '#0A202D', color: '#FFFFFF' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, mb: 3 }} spacing={2}>
            <Box>
              <Chip label="Statutory Compliance" sx={{ bgcolor: 'rgba(94,234,212,0.2)', color: '#5EEAD4', fontWeight: 700, mb: 1 }} />
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.5rem' }}>
                National Medical Commission (NMC) Mandatory Disclosures
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                In accordance with NMC (UGMER &amp; PGMEB) guidelines, the public documents below are maintained for statutory inspection:
              </Typography>
            </Box>
            <Link href="/portal" style={{ textDecoration: 'none' }}>
              <Button variant="contained" sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#0D6861' } }}>
                Official Verification Portal
              </Button>
            </Link>
          </Stack>

          <Grid container spacing={2}>
            {[
              { title: 'NMC Letter of Permission (LOP) & Renewal Form 2026', size: '1.4 MB' },
              { title: 'Faculty & Resident Doctors Sanctioned Post Matrix', size: '2.1 MB' },
              { title: 'Hospital Clinical Bed Occupancy & Surgery Audit (Past 12 Mos)', size: '3.8 MB' },
              { title: 'Approved Fee Structure & State Quota Bond Conditions', size: '850 KB' },
              { title: 'Anti-Ragging Committee & Gender Harassment Cell Order', size: '620 KB' },
              { title: 'Institutional Ethics Committee (IEC) Registration Certificate', size: '940 KB' },
            ].map((doc, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={idx}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '10px',
                    bgcolor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <MenuBookIcon sx={{ color: '#5EEAD4', fontSize: 20 }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{doc.title}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>PDF Document • {doc.size}</Typography>
                    </Box>
                  </Stack>
                  <IconButton size="small" onClick={() => alert(`Downloading verified document: ${doc.title}`)} sx={{ color: '#5EEAD4' }}>
                    <FileDownloadIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
