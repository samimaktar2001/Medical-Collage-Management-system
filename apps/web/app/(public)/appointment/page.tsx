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
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';
import InfoIcon from '@mui/icons-material/Info';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { DOCTORS, DEPARTMENTS, INSTITUTION_INFO } from '../public-data';
import { MedoraDatePicker } from '../../MedoraDatePicker';

const STEPS = ['Select Department & Doctor', 'Patient Information', 'Confirmation & Token'];

export default function AppointmentPage() {
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 State
  const [selectedDept, setSelectedDept] = useState('General Medicine');
  const [selectedDoctorSlug, setSelectedDoctorSlug] = useState(DOCTORS[0]?.slug || '');

  // Step 2 State
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    uhid: '',
    date: new Date().toISOString().split('T')[0],
    slot: 'Morning (09:00 AM - 12:00 PM)',
    symptoms: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generated Token State
  const [tokenInfo, setTokenInfo] = useState<{
    tokenNumber: string;
    opdSlipId: string;
    reportingTime: string;
  } | null>(null);

  const availableDoctors = DOCTORS.filter((doc) => doc.department === selectedDept);
  const currentDoctor = DOCTORS.find((d) => d.slug === selectedDoctorSlug) || availableDoctors[0];

  const handleNextStep1 = () => {
    setActiveStep(1);
  };

  const handleNextStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!patientData.name.trim() || !patientData.phone.trim() || !patientData.age.trim()) {
      setErrorMsg('Please fill out all required patient details marked with *.');
      return;
    }
    if (!patientData.date) {
      setErrorMsg('Please select an appointment date.');
      return;
    }
    const selectedDate = new Date(patientData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setErrorMsg('Appointment date cannot be in the past. Please select today or a future date.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/public/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: selectedDept,
          doctor_name: currentDoctor?.name || 'Senior Consultant',
          patient_name: patientData.name.trim(),
          age: parseInt(patientData.age) || 0,
          gender: patientData.gender,
          phone: patientData.phone.trim(),
          uhid: patientData.uhid?.trim() || undefined,
          slot: patientData.slot,
          appointment_date: patientData.date,
          symptoms: patientData.symptoms?.trim() || undefined,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || result.error?.message || 'Unable to book appointment.');
      }
      setTokenInfo({
        tokenNumber: result.data.tokenNumber,
        opdSlipId: result.data.opdSlipId,
        reportingTime: result.data.reportingTime,
      });
      setActiveStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setTokenInfo(null);
    setPatientData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      uhid: '',
      date: new Date().toISOString().split('T')[0],
      slot: 'Morning (09:00 AM - 12:00 PM)',
      symptoms: '',
    });
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
              OPD Appointment Booking
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
              <EventAvailableIcon fontSize="medium" />
            </Box>
            <Typography variant="overline" sx={{ color: '#5EEAD4', letterSpacing: 2, fontWeight: 700 }}>
              OUTPATIENT CLINICAL SERVICE
            </Typography>
          </Stack>

          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2, color: '#FFFFFF !important', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
            Book OPD Consultation &amp; E-Token
          </Typography>
          <Typography variant="body1" sx={{ color: '#F1F5F9 !important', maxWidth: 800, fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            Reserve your consultation slot with senior specialist professors and consultant doctors. Avoid long physical queues with instant automated digital queue slips.
          </Typography>
        </Container>
      </Box>

      {/* Main Container */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Left Column: Booking Stepper and Form */}
          <Grid size={{ xs: 12, lg: 8, xl: 8.5 }}>
            {/* Stepper Card */}
            <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '12px', border: '1px solid #E2E8F0', mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      slotProps={{
                        stepIcon: {
                          sx: {
                            '&.Mui-active': { color: '#0F766E' },
                            '&.Mui-completed': { color: '#0F766E' },
                          },
                        },
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1: Department & Doctor */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                    Step 1: Choose Clinical Department & Specialist Doctor
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Specialty Department"
                        value={selectedDept}
                        onChange={(e) => {
                          setSelectedDept(e.target.value);
                          const docs = DOCTORS.filter((d) => d.department === e.target.value);
                          if (docs.length > 0) setSelectedDoctorSlug(docs[0].slug);
                        }}
                      >
                        {DEPARTMENTS.filter((d) => d.type === 'Clinical').map((dept) => (
                          <MenuItem key={dept.slug} value={dept.name.replace('Department of ', '')}>
                            {dept.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Attending Doctor / Specialist"
                        value={currentDoctor?.slug || ''}
                        onChange={(e) => setSelectedDoctorSlug(e.target.value)}
                      >
                        {availableDoctors.length > 0 ? (
                          availableDoctors.map((doc) => (
                            <MenuItem key={doc.slug} value={doc.slug}>
                              {doc.name} ({doc.designation.split('&')[0]})
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>
                            Duty Registrar / Resident Specialist
                          </MenuItem>
                        )}
                      </TextField>
                    </Grid>
                  </Grid>

                  {/* Selected Doctor Summary Card */}
                  {currentDoctor && (
                    <Paper
                      sx={{
                        p: 3,
                        mt: 3,
                        bgcolor: '#F0FDFA',
                        borderRadius: '10px',
                        border: '1px solid #99F6E4',
                      }}
                    >
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                        <Avatar
                          src={currentDoctor.name.includes('Anindita') || currentDoctor.name.includes('Priyanka') || currentDoctor.name.includes('Sunita') ? '/images/doctor-female-placeholder.svg' : '/images/doctor-placeholder.svg'}
                          alt={currentDoctor.name}
                          sx={{
                            width: 52,
                            height: 52,
                            bgcolor: '#FFFFFF',
                            border: '2px solid #0F766E',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(15,118,110,0.15)',
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#134E4A' }}>
                            {currentDoctor.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#0F766E', fontWeight: 600 }}>
                            {currentDoctor.qualification} • {currentDoctor.designation}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>
                            Registration: {currentDoctor.regNumber} • {currentDoctor.specialty}
                          </Typography>

                          <Divider sx={{ my: 1.5 }} />

                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
                            <Chip
                              label={`OPD: ${currentDoctor.opdDays}`}
                              size="small"
                              sx={{ bgcolor: '#CCFBF1', color: '#0F766E', fontWeight: 700 }}
                            />
                            <Chip
                              label={`Timings: ${currentDoctor.opdTime}`}
                              size="small"
                              sx={{ bgcolor: '#E0E7FF', color: '#4338CA', fontWeight: 700 }}
                            />
                            <Chip
                              label={currentDoctor.roomNumber}
                              size="small"
                              sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }}
                            />
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  )}

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handleNextStep1}
                      sx={{
                        bgcolor: '#0F766E',
                        fontWeight: 700,
                        px: 4,
                        py: 1.2,
                        '&:hover': { bgcolor: '#115E59' },
                      }}
                    >
                      Proceed to Patient Info →
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 2: Patient Information */}
              {activeStep === 1 && (
                <Box component="form" onSubmit={handleNextStep2}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                    Step 2: Enter Patient Details &amp; Appointment Schedule
                  </Typography>

                  {errorMsg && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>
                      {errorMsg}
                    </Alert>
                  )}

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Patient Full Name"
                        value={patientData.name}
                        onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                      />
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField
                        fullWidth
                        required
                        type="number"
                        label="Age (Years)"
                        value={patientData.age}
                        onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                      />
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField
                        select
                        fullWidth
                        label="Gender"
                        value={patientData.gender}
                        onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Mobile Phone (for SMS Token)"
                        placeholder="e.g., 9876543210"
                        value={patientData.phone}
                        onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Hospital UHID (If already registered)"
                        placeholder="Leave blank for new patient"
                        value={patientData.uhid}
                        onChange={(e) => setPatientData({ ...patientData, uhid: e.target.value })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MedoraDatePicker
                        label="Appointment Date"
                        required
                        disablePast
                        value={patientData.date}
                        onChange={(val) => setPatientData({ ...patientData, date: val })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Consultation Session"
                        value={patientData.slot}
                        onChange={(e) => setPatientData({ ...patientData, slot: e.target.value })}
                      >
                        <MenuItem value="Morning (09:00 AM - 12:00 PM)">Morning Session (09:00 AM – 12:00 PM)</MenuItem>
                        <MenuItem value="Afternoon (12:30 PM - 03:00 PM)">Afternoon Session (12:30 PM – 03:00 PM)</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Chief Complaint / Health Problem"
                        placeholder="Briefly state symptoms (e.g., fever for 4 days, chest discomfort, joint pain...)"
                        value={patientData.symptoms}
                        onChange={(e) => setPatientData({ ...patientData, symptoms: e.target.value })}
                      />
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'space-between' }}>
                    <Button variant="outlined" onClick={() => setActiveStep(0)} disabled={submitting}>
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      sx={{
                        bgcolor: '#0F766E',
                        fontWeight: 700,
                        px: 4,
                        '&:hover': { bgcolor: '#115E59' },
                      }}
                    >
                      {submitting ? 'Registering with Hospital Database...' : 'Confirm & Generate OPD Token →'}
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Step 3: Confirmation & OPD Token Card */}
              {activeStep === 2 && tokenInfo && (
                <Box>
                  <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      OPD Consultation Booking Confirmed!
                    </Typography>
                    <Typography variant="body2">
                      An SMS with token details has been dispatched to +91 {patientData.phone}.
                    </Typography>
                  </Alert>

                  {/* Printable Token Slip */}
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      borderRadius: '12px',
                      border: '2px dashed #0F766E',
                      bgcolor: '#FFFFFF',
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ textAlign: 'center', pb: 2, borderBottom: '1px solid #E2E8F0' }}>
                      <Typography variant="overline" sx={{ color: '#0F766E', fontWeight: 800, letterSpacing: 2 }}>
                        {INSTITUTION_INFO.shortName} • OUTPATIENT CLINICAL DEPARTMENT
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A' }}>
                        E-OPD APPOINTMENT TOKEN SLIP
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        NABH / NABL Accredited Teaching Hospital • Slip Ref: {tokenInfo.opdSlipId}
                      </Typography>
                    </Box>

                    <Box sx={{ my: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
                        YOUR ASSIGNED QUEUE TOKEN NUMBER
                      </Typography>
                      <Typography variant="h2" sx={{ fontWeight: 900, color: '#0F766E', letterSpacing: 3, my: 1 }}>
                        {tokenInfo.tokenNumber}
                      </Typography>
                      <Chip
                        label={`Expected Reporting: ${tokenInfo.reportingTime}`}
                        color="primary"
                        sx={{ bgcolor: '#0F766E', fontWeight: 700, borderRadius: '8px' }}
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', mb: 3 }}>
                      <Grid size={{ xs: 6, sm: 4 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Patient Name</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{patientData.name}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Age / Gender</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{patientData.age} Yrs / {patientData.gender}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Phone</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{patientData.phone}</Typography>
                      </Grid>

                      <Grid size={{ xs: 6, sm: 4 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Doctor</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F766E' }}>{currentDoctor?.name}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Department & Room</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedDept} ({currentDoctor?.roomNumber})</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Consultation Date</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{patientData.date}</Typography>
                      </Grid>
                    </Grid>

                    <Stack spacing={1} sx={{ color: '#64748B' }}>
                      <Typography variant="caption">
                        • Please present this electronic slip at Central Registration Counter 4 to collect physical OPD booklet.
                      </Typography>
                      <Typography variant="caption">
                        • Government Ayushman Bharat & Swasthya Sathi cardholders enjoy 100% free consultation & basic diagnostics.
                      </Typography>
                    </Stack>
                  </Paper>

                  <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'space-between' }}>
                    <Button variant="outlined" onClick={handleReset}>
                      Book Another Patient
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<PrintIcon />}
                      onClick={() => window.print()}
                      sx={{ bgcolor: '#0F766E', '&:hover': { bgcolor: '#115E59' } }}
                    >
                      Print Token Slip
                    </Button>
                  </Stack>
                </Box>
              )}
            </Card>

          </Grid>

          {/* Right Column: Hospital OPD Info & Emergency Sidebar */}
          <Grid size={{ xs: 12, lg: 4, xl: 3.5 }}>
            <Stack spacing={3}>
              {/* Emergency Hotline Card */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                  color: '#FFFFFF !important',
                  boxShadow: '0 8px 25px rgba(220,38,38,0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#FEE2E2 !important', mb: 1 }}>
                  24/7 Emergency &amp; Trauma Resuscitation
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#FFFFFF !important', lineHeight: 1.25, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Need Immediate Casualty Care?
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#FFFFFF !important', opacity: 0.95, lineHeight: 1.55, mb: 2.5, fontWeight: 500 }}>
                  Do not book an OPD appointment for acute trauma, chest pain, stroke, or severe bleeding. Proceed straight to Red Triage.
                </Typography>
                <Button
                  component="a"
                  href={`tel:${INSTITUTION_INFO.casualtyHelpline}`}
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#FFFFFF !important',
                    color: '#ebe6e6ff !important',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    py: 1.3,
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    '&:hover': { bgcolor: '#F8FAFC !important', color: '#f1e9e9ff !important' },
                  }}
                >
                  Emergency: {INSTITUTION_INFO.casualtyHelpline}
                </Button>
              </Card>

              {/* OPD Operating Schedule Card */}
              <Card sx={{ p: 3, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', mb: 2 }}>
                  OPD Operating Hours
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F766E' }}>
                      Morning Consultation Shift
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: '#334155', fontWeight: 600 }}>
                      08:30 AM – 01:00 PM (Mon – Sat)
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 0.5 }}>
                      Token reporting before 12:30 PM
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0284C7' }}>
                      Afternoon &amp; Evening Shift
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: '#334155', fontWeight: 600 }}>
                      04:00 PM – 07:00 PM (Select Specialties)
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 0.5 }}>
                      Pediatrics, Cardiology, Gynecology
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              {/* Documents to Carry Card */}
              <Card sx={{ p: 3, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', mb: 1.5 }}>
                  What to Bring on Visit
                </Typography>
                <Stack spacing={1.2}>
                  {[
                    'Printed or SMS E-Token confirmation',
                    'Government Photo ID (Aadhaar / Voter ID)',
                    'Previous medical records, discharge cards & lab scans',
                    'Swasthya Sathi / Ayushman Bharat card (for cashless care)',
                  ].map((doc, idx) => (
                    <Stack key={idx} direction="row" spacing={1.2} sx={{ alignItems: 'flex-start' }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#0F766E', mt: 0.2, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.45 }}>
                        {doc}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
