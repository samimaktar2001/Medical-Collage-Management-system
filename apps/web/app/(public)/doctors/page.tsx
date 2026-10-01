'use client';

import React, { useState } from 'react';
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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

import { DOCTORS, Doctor } from '../public-data';

export default function DoctorsDirectoryPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filteredDoctors = DOCTORS.filter((doc: Doctor) => {
    if (deptFilter !== 'ALL' && doc.department !== deptFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Hero Banner ─── */}
      <Box sx={{ bgcolor: '#0B2332', color: '#FFFFFF', py: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Chip label="Senior Teaching Faculty &amp; Clinical Consultants" sx={{ bgcolor: 'rgba(94,234,212,0.18)', color: '#5EEAD4', fontWeight: 700, mb: 1.5 }} />
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.2, mb: 2 }}>
            Consultant Doctors &amp; Specialists
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 800, lineHeight: 1.6 }}>
            Browse our distinguished clinical faculty of professors, surgeons, and department directors providing evidence-based outpatient consultations and inpatient surgical mastery.
          </Typography>
        </Container>
      </Box>

      {/* ─── Search & Filter Bar ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: -3 }}>
        <Card elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', mb: 4 }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search doctor by name, specialty, or condition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#0F766E' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' },
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Select
                fullWidth
                size="small"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="ALL">All Clinical Departments</MenuItem>
                <MenuItem value="General Medicine">General Medicine</MenuItem>
                <MenuItem value="General Surgery">General Surgery</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics &amp; Neonatology</MenuItem>
                <MenuItem value="Radio-Diagnosis">Radio-Diagnosis &amp; Imaging</MenuItem>
                <MenuItem value="Pathology & Blood Bank">Pathology &amp; Blood Bank</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Card>

        {/* ─── Doctors Grid ─── */}
        <Typography sx={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, mb: 3 }}>
          Showing <strong>{filteredDoctors.length}</strong> Verified Consultant Doctors
        </Typography>

        <Grid container spacing={3}>
          {filteredDoctors.map((doc: Doctor) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={doc.slug}>
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
                  transition: 'border-color 0.2s, transform 0.2s',
                  '&:hover': { borderColor: '#0F766E', transform: 'translateY(-2px)' },
                }}
              >
                <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                  <Avatar
                    src={doc.name.includes('Anindita') || doc.name.includes('Dr. Priyanka') || doc.name.includes('Dr. Sunita') ? '/images/doctor-female-placeholder.svg' : '/images/doctor-placeholder.svg'}
                    alt={doc.name}
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: '#F0FDFA',
                      border: '2px solid #0F766E',
                      boxShadow: '0 4px 12px rgba(15,118,110,0.15)',
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', lineHeight: 1.2 }}>
                      {doc.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700, mt: 0.3 }}>
                      {doc.designation}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {doc.qualification}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mb: 2.5, flexGrow: 1 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Specialty Expertise:</Typography>
                  <Typography sx={{ fontSize: '0.825rem', color: '#334155', fontWeight: 600, mt: 0.2 }}>
                    {doc.specialty}
                  </Typography>
                </Box>

                <Stack spacing={1} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px', mb: 2.5, border: '1px solid #F1F5F9', fontSize: '0.75rem' }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: '#0F766E' }} />
                    <Typography sx={{ fontSize: 'inherit', color: '#334155' }}>
                      <strong>OPD:</strong> {doc.opdDays} ({doc.opdTime})
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <MeetingRoomIcon sx={{ fontSize: 16, color: '#0F766E' }} />
                    <Typography sx={{ fontSize: 'inherit', color: '#334155' }}>
                      <strong>Room:</strong> {doc.roomNumber}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <VerifiedUserIcon sx={{ fontSize: 16, color: '#0F766E' }} />
                    <Typography sx={{ fontSize: 'inherit', color: '#64748B' }}>
                      Council Reg: {doc.regNumber} ({doc.experienceYears}+ Yrs Exp)
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Link href="/appointment" style={{ textDecoration: 'none' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EventAvailableIcon />}
                    sx={{
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      textTransform: 'none',
                      bgcolor: '#0F766E',
                      py: 1,
                      '&:hover': { bgcolor: '#0D6861' },
                    }}
                  >
                    Book OPD Consultation
                  </Button>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
