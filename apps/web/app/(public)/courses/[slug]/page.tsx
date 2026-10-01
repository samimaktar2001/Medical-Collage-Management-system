'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
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
import Breadcrumbs from '@mui/material/Breadcrumbs';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { COURSES } from '../../public-data';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const course = COURSES.find((c) => c.slug === slug);

  if (!course) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Course Not Found</Typography>
        <Typography sx={{ color: '#64748B', mb: 4 }}>The academic program you requested does not exist or has been updated.</Typography>
        <Link href="/courses">
          <Button variant="contained" sx={{ bgcolor: '#0F766E' }}>View All Courses</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Breadcrumb & Banner ─── */}
      <Box sx={{ bgcolor: '#0B2332', color: '#FFFFFF', py: 6, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Breadcrumbs sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', mb: 2 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <Link href="/courses" style={{ color: 'inherit', textDecoration: 'none' }}>Courses</Link>
            <Typography sx={{ color: '#5EEAD4', fontSize: '0.8rem', fontWeight: 600 }}>{course.degree}</Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'center' }}>
            <Chip label={course.level} sx={{ bgcolor: '#0F766E', color: '#FFFFFF', fontWeight: 700 }} />
            <Chip icon={<VerifiedUserIcon sx={{ fontSize: 14, color: '#5EEAD4 !important' }} />} label="NMC Recognized" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.75rem' }} />
          </Stack>

          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.2, mb: 2, maxWidth: 900 }}>
            {course.name}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: 850, lineHeight: 1.6 }}>
            {course.overview}
          </Typography>
        </Container>
      </Box>

      {/* ─── Course Details ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 5 }}>
        <Grid container spacing={4}>
          {/* Left Column: Curriculum & Prospects */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Curriculum Highlights */}
            <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', mb: 4 }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 2 }}>
                CBME Curriculum &amp; Training Structure
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, mb: 3 }}>
                Designed in strict alignment with statutory National Medical Commission (NMC) competencies, combining didactic lectures, early clinical exposure (ECE), hands-on dissection, skills lab simulation, and bedside clerkships:
              </Typography>

              <Stack spacing={2}>
                {course.curriculumHighlights.map((item, idx) => (
                  <Stack key={idx} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ color: '#0F766E', fontSize: 20, mt: 0.3 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Career Pathways */}
            <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 2 }}>
                Career Opportunities &amp; Advanced Training
              </Typography>
              <Grid container spacing={2}>
                {course.careerProspects.map((path, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                    <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#F0FDFA', border: '1px solid rgba(15,118,110,0.15)' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F766E' }}>
                        {path}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column: Admission Summary Card */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={0} sx={{ p: 4, borderRadius: '20px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', position: 'sticky', top: 96, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 2 }}>
                Program Key Facts
              </Typography>

              <Stack spacing={2.5} sx={{ mb: 4 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Sanctioned Intake</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F766E' }}>{course.seats} Seats / Batch</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Duration &amp; Internship</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{course.duration}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Tuition Fee Schedule</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{course.tuitionPerYear}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Statutory Affiliation</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>{course.affiliation}</Typography>
                </Box>
              </Stack>

              <Link href="/admissions" style={{ textDecoration: 'none' }}>
                <Button fullWidth variant="contained" size="large" sx={{ bgcolor: '#0F766E', fontWeight: 800, borderRadius: '10px', py: 1.4, textTransform: 'none', '&:hover': { bgcolor: '#0D6861' } }}>
                  Proceed to Admissions
                </Button>
              </Link>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
