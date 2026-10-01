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
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';

import { COURSES, Course } from '../public-data';

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  const filteredCourses = COURSES.filter((c) => {
    if (selectedLevel === 'ALL') return true;
    if (selectedLevel === 'UG') return c.level === 'Undergraduate';
    if (selectedLevel === 'PG') return c.level === 'Postgraduate';
    if (selectedLevel === 'NURSING') return c.level === 'Nursing & Allied';
    return true;
  });

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Hero Banner ─── */}
      <Box sx={{ bgcolor: '#0D2636', color: '#FFFFFF', py: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Chip label="NMC & INC Approved Programs" sx={{ bgcolor: 'rgba(94,234,212,0.18)', color: '#5EEAD4', fontWeight: 700, mb: 1.5 }} />
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.2, mb: 2 }}>
            Academic Medical &amp; Healthcare Programs
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 800, lineHeight: 1.6 }}>
            Explore rigorous, accredited undergraduate medical training, postgraduate clinical residency, and professional nursing degrees conducted in our 750-bed tertiary university teaching hospital.
          </Typography>
        </Container>
      </Box>

      {/* ─── Main Courses Section with Filters ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 5 }}>
        {/* Filter Tabs */}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 4 }} spacing={2}>
          <Tabs
            value={selectedLevel}
            onChange={(_, val) => setSelectedLevel(val)}
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '10px',
              p: 0.5,
              border: '1px solid #E2E8F0',
              '& .MuiTabs-indicator': { bgcolor: '#0F766E', height: 3, borderRadius: '2px' },
            }}
          >
            <Tab value="ALL" label="All Degrees &amp; Diplomas" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' }} />
            <Tab value="UG" label="Undergraduate (MBBS)" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' }} />
            <Tab value="PG" label="Postgraduate (MD / MS)" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' }} />
            <Tab value="NURSING" label="Nursing &amp; Allied Sciences" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' }} />
          </Tabs>

          <Typography sx={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>
            Showing <strong>{filteredCourses.length}</strong> Accredited Programs
          </Typography>
        </Stack>

        {/* Courses Grid */}
        <Grid container spacing={3}>
          {filteredCourses.map((course: Course) => (
            <Grid size={{ xs: 12, md: 6 }} key={course.slug}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: '16px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s, transform 0.2s',
                  '&:hover': { borderColor: '#0F766E', transform: 'translateY(-2px)' },
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Chip
                    label={course.level}
                    size="small"
                    sx={{
                      bgcolor: course.level === 'Undergraduate' ? 'rgba(15,118,110,0.1)' : 'rgba(37,99,235,0.1)',
                      color: course.level === 'Undergraduate' ? '#0F766E' : '#2563EB',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#0F766E', fontSize: '0.75rem', fontWeight: 700 }}>
                    <VerifiedIcon sx={{ fontSize: 15 }} />
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>NMC Recognized</Typography>
                  </Stack>
                </Stack>

                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#0F172A', mb: 1, lineHeight: 1.25 }}>
                  {course.name}
                </Typography>

                <Typography sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, mb: 3 }}>
                  {course.overview}
                </Typography>

                <Stack direction="row" spacing={3} sx={{ mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: '10px' }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: '#0F766E' }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>Duration</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{course.duration.split(' ')[0]} Yrs</Typography>
                    </Box>
                  </Stack>
                  <Divider orientation="vertical" flexItem />
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <EventSeatIcon sx={{ fontSize: 18, color: '#0F766E' }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>Sanctioned Intake</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{course.seats} Seats</Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Box sx={{ mb: 3, flexGrow: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', mb: 1 }}>
                    Eligibility Criteria:
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                    {course.eligibility}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }} spacing={2}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>Tuition / Year</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F766E' }}>
                      {course.tuitionPerYear.split('|')[0]}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1.5}>
                    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
                      <Button variant="outlined" size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />} sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', borderColor: '#0F766E', color: '#0F766E' }}>
                        Curriculum
                      </Button>
                    </Link>
                    <Link href="/admissions" style={{ textDecoration: 'none' }}>
                      <Button variant="contained" size="small" sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', bgcolor: '#0F766E', '&:hover': { bgcolor: '#0D6861' } }}>
                        Apply Now
                      </Button>
                    </Link>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
