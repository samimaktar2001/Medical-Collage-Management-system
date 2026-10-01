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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';

// Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HotelIcon from '@mui/icons-material/Hotel';

import { DEPARTMENTS, Department } from '../public-data';

export default function DepartmentsPage() {
  const [selectedType, setSelectedType] = useState('ALL');

  const filteredDepts = DEPARTMENTS.filter((d) => {
    if (selectedType === 'ALL') return true;
    if (selectedType === 'PRE') return d.type === 'Pre-Clinical';
    if (selectedType === 'PARA') return d.type === 'Para-Clinical';
    if (selectedType === 'CLINICAL') return d.type === 'Clinical';
    return true;
  });

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Hero Header ─── */}
      <Box sx={{ bgcolor: '#0D2738', color: '#FFFFFF', py: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Chip label="24 Specialized Medical & Surgical Faculties" sx={{ bgcolor: 'rgba(94,234,212,0.18)', color: '#5EEAD4', fontWeight: 700, mb: 1.5 }} />
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.2, mb: 2 }}>
            Medical &amp; Clinical Departments
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 800, lineHeight: 1.6 }}>
            Our academic faculties span foundational pre-clinical biological sciences to cutting-edge clinical, surgical, and diagnostic super-specialties serving 1,800+ patients daily.
          </Typography>
        </Container>
      </Box>

      {/* ─── Departments Listing ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 5 }}>
        {/* Type Filter Tabs */}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 4 }} spacing={2}>
          <Tabs
            value={selectedType}
            onChange={(_, val) => setSelectedType(val)}
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '10px',
              p: 0.5,
              border: '1px solid #E2E8F0',
              '& .MuiTabs-indicator': { bgcolor: '#0F766E', height: 3, borderRadius: '2px' },
            }}
          >
            <Tab value="ALL" label="All Departments" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' }} />
            <Tab value="PRE" label="Pre-Clinical (Anatomy, Physiol)" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' }} />
            <Tab value="PARA" label="Para-Clinical (Patho, Micro, FMT)" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' }} />
            <Tab value="CLINICAL" label="Clinical (Med, Surg, Pedia, Radio)" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' }} />
          </Tabs>

          <Typography sx={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>
            Showing <strong>{filteredDepts.length}</strong> Academic Faculties
          </Typography>
        </Stack>

        {/* Departments Grid */}
        <Grid container spacing={3}>
          {filteredDepts.map((dept: Department) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={dept.slug}>
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
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={dept.type}
                    size="small"
                    sx={{
                      bgcolor: dept.type === 'Clinical' ? 'rgba(15,118,110,0.1)' : 'rgba(124,58,237,0.1)',
                      color: dept.type === 'Clinical' ? '#0F766E' : '#7C3AED',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                    }}
                  />
                  {dept.bedCount && (
                    <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center', color: '#64748B', fontSize: '0.75rem' }}>
                      <HotelIcon sx={{ fontSize: 16, color: '#0F766E' }} />
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 700, color: '#0F172A' }}>{dept.bedCount} Beds</Typography>
                    </Stack>
                  )}
                </Stack>

                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 1, lineHeight: 1.25 }}>
                  {dept.name}
                </Typography>

                <Typography sx={{ color: '#64748B', fontSize: '0.825rem', lineHeight: 1.6, mb: 2.5, flexGrow: 1 }}>
                  {dept.description}
                </Typography>

                {/* HOD Info Box */}
                <Box sx={{ p: 1.8, bgcolor: '#F8FAFC', borderRadius: '10px', mb: 2.5, border: '1px solid #F1F5F9' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Head of Department:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{dept.hod}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#0F766E' }}>{dept.hodQualification}</Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', mb: 2.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 16, color: '#0F766E', mt: 0.2 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>
                    {dept.opdSchedule}
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Link href={`/departments/${dept.slug}`} style={{ textDecoration: 'none' }}>
                  <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />} sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'none', borderColor: '#0F766E', color: '#0F766E', '&:hover': { bgcolor: '#F0FDFA' } }}>
                    Department Details &amp; Faculty
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
