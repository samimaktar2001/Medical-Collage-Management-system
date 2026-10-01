'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Alert,
  MenuItem,
  Divider,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';
import SendIcon from '@mui/icons-material/Send';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TrainIcon from '@mui/icons-material/Train';
import FlightIcon from '@mui/icons-material/Flight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { INSTITUTION_INFO } from '../public-data';

const INQUIRY_CATEGORIES = [
  'MBBS / PG Admissions',
  'Patient Care / OPD Appointment',
  'Academic Transcripts / Verification',
  'Tenders & Procurement',
  'Career & Faculty Vacancies',
  'Student Grievance / Anti-Ragging',
  'General Inquiry',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'MBBS / PG Admissions',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill out all required fields marked with *.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          category: formData.category,
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim(),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || result.error?.message || 'Unable to register inquiry.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #102A43 50%, #0F766E 100%)',
          color: '#FFFFFF',
          pt: { xs: 5, md: 8 },
          pb: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.6)' }} />}
            sx={{ mb: 3 }}
          >
            <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.875rem' }}>
              Home
            </Link>
            <Typography sx={{ color: '#5EEAD4', fontSize: '0.875rem', fontWeight: 600 }}>
              Contact & Emergency Helpdesk
            </Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'rgba(94, 234, 212, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5EEAD4',
              }}
            >
              <ContactSupportIcon fontSize="medium" />
            </Box>
            <Typography variant="overline" sx={{ color: '#5EEAD4', letterSpacing: 2, fontWeight: 700 }}>
              CAMPUS & HELPLINE DIRECTORY
            </Typography>
          </Stack>

          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2, color: '#FFFFFF !important', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
            Contact Us & 24/7 Helplines
          </Typography>
          <Typography variant="body1" sx={{ color: '#F1F5F9 !important', maxWidth: 800, fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Reach out to our academic administrative offices, hospital emergency trauma resuscitation desk, admissions cell, or submit an official inquiry.
          </Typography>
        </Container>
      </Box>

      {/* Main Container */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, py: { xs: 4, md: 6 } }}>
        {/* Emergency Quick Action Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                bgcolor: '#FEF2F2',
                border: '2px solid #FCA5A5',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.1)',
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: '#EF4444', color: '#FFFFFF' }}>
                  <LocalHospitalIcon />
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: '#DC2626', fontWeight: 800, letterSpacing: 1 }}>
                    24/7 CASUALTY / AMBULANCE
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#991B1B' }}>
                    {INSTITUTION_INFO.casualtyHelpline}
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: '#7F1D1D' }}>
                Dedicated trauma triage resus, cardiac stroke unit & emergency blood dispatch hotline.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                bgcolor: '#F0FDFA',
                border: '2px solid #99F6E4',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 4px 15px rgba(15, 118, 110, 0.1)',
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: '#0F766E', color: '#FFFFFF' }}>
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: '#0F766E', fontWeight: 800, letterSpacing: 1 }}>
                    ADMISSION COUNSELING
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#134E4A' }}>
                    {INSTITUTION_INFO.admissionHelpline}
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: '#115E59' }}>
                MBBS, MD/MS and B.Sc Nursing seat matrix & counseling guidance (Mon-Sat 9AM-5PM).
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                bgcolor: '#EFF6FF',
                border: '2px solid #BFDBFE',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)',
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: '#2563EB', color: '#FFFFFF' }}>
                  <SecurityIcon />
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: '#1D4ED8', fontWeight: 800, letterSpacing: 1 }}>
                    ANTI-RAGGING CELL (NMC)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E40AF' }}>
                    1800-180-5522 (Toll Free)
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: '#1E3A8A' }}>
                Zero tolerance campus policy. Immediate direct intervention by Dean & Security Chief.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Contact Form & Key Officials Directory */}
        <Grid container spacing={4}>
          {/* Inquiry Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3.5, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                Send Official Message or Inquiry
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Fill out the form below. Inquiries are logged directly into the administrative ticketing registry and answered within 24 working hours.
              </Typography>

              {submitted ? (
                <Alert
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ p: 3, borderRadius: 2 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Inquiry Ticket Dispatched Successfully!
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Your ticket reference has been logged. An academic counselor or administrative officer will respond to {formData.email} shortly.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        category: 'MBBS / PG Admissions',
                        subject: '',
                        message: '',
                      });
                    }}
                    sx={{ mt: 2, color: '#0F766E', borderColor: '#0F766E' }}
                  >
                    Submit Another Query
                  </Button>
                </Alert>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  {errorMsg && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                      {errorMsg}
                    </Alert>
                  )}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Contact Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Department / Inquiry Type"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {INQUIRY_CATEGORIES.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Subject Line"
                        placeholder="e.g., Verification of Internship Completion Certificate"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={4}
                        label="Your Query / Detailed Note"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={submitting}
                        startIcon={<SendIcon />}
                        sx={{
                          bgcolor: '#0F766E',
                          fontWeight: 700,
                          py: 1.5,
                          px: 4,
                          '&:hover': { bgcolor: '#115E59' },
                        }}
                      >
                        {submitting ? 'Transmitting to Registry...' : 'Submit Official Inquiry'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Institutional Directory & Location */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                  Statutory Administrative Offices
                </Typography>

                <Stack spacing={2} divider={<Divider />}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F766E' }}>
                      Principal & Dean Office
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      Administrative Block, Level 3
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Email: dean@medicacare.edu.in • Tel: +91 33 2490 8010
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F766E' }}>
                      Medical Superintendent (Hospital)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      Hospital Block A, Ground Floor
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Email: ms@medicacare.hospital.in • Tel: +91 33 2490 8020
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F766E' }}>
                      Registrar & Academic Secretariat
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      Council Chamber, Central Block
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Email: {INSTITUTION_INFO.email} • Tel: +91 33 2490 8005
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              {/* Transit & Commuting Info */}
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                  How to Reach Campus
                </Typography>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <LocationOnIcon sx={{ color: '#0F766E', mt: 0.3 }} />
                    <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                      <strong>Address:</strong> {INSTITUTION_INFO.address}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <TrainIcon sx={{ color: '#2563EB', mt: 0.3 }} />
                    <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                      <strong>Metro / Suburban Rail:</strong> 1.5 km from Salt Lake Sector V Metro Station (Green Line). Direct e-rickshaws available.
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <FlightIcon sx={{ color: '#D97706', mt: 0.3 }} />
                    <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                      <strong>Airport:</strong> 12 km from Netaji Subhash Chandra Bose International Airport (CCU). Approx 25 mins by taxi.
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <DirectionsBusIcon sx={{ color: '#16A34A', mt: 0.3 }} />
                    <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                      <strong>Bus Stop:</strong> &quot;MedicaCare Hospital Gate&quot; on the EM Bypass / Salt Lake Corridor (Direct AC buses).
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
