'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HotelIcon from '@mui/icons-material/Hotel';

import { DEPARTMENTS, DOCTORS } from '../../public-data';

export default function DepartmentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  const deptDoctors = DOCTORS.filter((doc) => doc.department.toLowerCase().includes(dept?.name.toLowerCase().replace('department of ', '') || ''));

  if (!dept) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Department Not Found</Typography>
        <Typography sx={{ color: '#64748B', mb: 4 }}>The medical department you are looking for has been moved or renamed.</Typography>
        <Link href="/departments">
          <Button variant="contained" sx={{ bgcolor: '#0F766E' }}>Browse All Departments</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Breadcrumb Banner ─── */}
      <Box sx={{ bgcolor: '#09212E', color: '#FFFFFF', py: 6, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Breadcrumbs sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', mb: 2 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <Link href="/departments" style={{ color: 'inherit', textDecoration: 'none' }}>Departments</Link>
            <Typography sx={{ color: '#5EEAD4', fontSize: '0.8rem', fontWeight: 600 }}>{dept.name}</Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'center' }}>
            <Chip label={dept.type} sx={{ bgcolor: '#0F766E', color: '#FFFFFF', fontWeight: 700 }} />
            {dept.bedCount && (
              <Chip icon={<HotelIcon sx={{ fontSize: 14, color: '#5EEAD4 !important' }} />} label={`${dept.bedCount} Inpatient Beds`} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.75rem' }} />
            )}
          </Stack>

          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.2, mb: 2 }}>
            {dept.name}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: 850, lineHeight: 1.6 }}>
            {dept.description}
          </Typography>
        </Container>
      </Box>

      {/* ─── Main Details ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 5 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Clinical & Laboratory Infrastructure */}
            <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', mb: 4 }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 2 }}>
                Specialized Infrastructure &amp; Clinical Units
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, mb: 3 }}>
                Equipped with cutting-edge medical hardware and staffed 24/7 to provide seamless inpatient, outpatient, and critical diagnostic service:
              </Typography>

              <Grid container spacing={2}>
                {dept.facilities.map((fac, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                    <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#F0FDFA', border: '1px solid rgba(15,118,110,0.15)', display: 'flex', alignItems: 'flex-start', height: '100%' }}>
                      <CheckCircleIcon sx={{ color: '#0F766E', fontSize: 20, mr: 1.2, mt: 0.2 }} />
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>
                        {fac}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Teaching & Academics */}
            <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', mb: 4 }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 2 }}>
                Academic Programs &amp; Medical Training
              </Typography>
              <Stack spacing={1.5}>
                {dept.academicPrograms.map((prog, idx) => (
                  <Stack key={idx} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <SchoolIcon sx={{ color: '#0F766E', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                      {prog}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Department Doctors / Faculty */}
            <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 3 }}>
                Consultant Doctors &amp; Teaching Faculty
              </Typography>

              {deptDoctors.length > 0 ? (
                <Grid container spacing={2.5}>
                  {deptDoctors.map((doc, idx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                      <Card elevation={0} sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>{doc.name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700 }}>{doc.designation}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B', mb: 1.5 }}>{doc.qualification}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#334155', mb: 1.5 }}>
                          <strong>OPD:</strong> {doc.opdDays} ({doc.opdTime})
                        </Typography>
                        <Link href="/appointment" style={{ textDecoration: 'none' }}>
                          <Button size="small" variant="contained" sx={{ bgcolor: '#0F766E', textTransform: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                            Book Consultation
                          </Button>
                        </Link>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                  Full faculty roster with Assistant Professors and Senior Residents available in the College Administrative Office.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Right Column: HOD & OPD Consultation Desk */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={0} sx={{ p: 4, borderRadius: '20px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', position: 'sticky', top: 96, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 2 }}>
                Department Office &amp; OPD
              </Typography>

              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', mb: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Head of Department:</Typography>
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{dept.hod}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 600 }}>{dept.hodQualification}</Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>OPD Consultation Timings:</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', mb: 1 }}>{dept.opdSchedule}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Registration counters open at 08:00 AM in Ground Floor Hospital Reception.
                </Typography>
              </Box>

              <Link href="/appointment" style={{ textDecoration: 'none' }}>
                <Button fullWidth variant="contained" size="large" startIcon={<EventAvailableIcon />} sx={{ bgcolor: '#0F766E', fontWeight: 800, borderRadius: '10px', py: 1.4, textTransform: 'none', '&:hover': { bgcolor: '#0D6861' } }}>
                  Book OPD Appointment
                </Button>
              </Link>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
