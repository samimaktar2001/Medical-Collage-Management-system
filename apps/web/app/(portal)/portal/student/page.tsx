'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DownloadIcon from '@mui/icons-material/Download';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Mock student profile
const STUDENT_PROFILE = {
  name: 'Ananya Mukherjee',
  rollNo: 'MBBS-2023-042',
  regNo: 'WBUHS/2023/MED/0089',
  program: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
  currentPhase: 'Phase II (3rd Year / 5th Semester)',
  batchYear: '2023 – 2028',
  bloodGroup: 'B +ve',
  mentor: 'Prof. (Dr.) Sanjoy K. Sengupta',
  hostelRoom: 'Sarojini Naidu Girls Hostel • Room 314',
  overallGpa: '3.78 / 4.00 (Distinction in Anatomy & Biochem)',
};

// Initial CBME Logbook entries
const INITIAL_LOGBOOK = [
  { id: 'CBME-MED-01', code: 'IM 3.2', competency: 'Venepuncture and collection of blood sample', category: 'DOPS', level: 'Performed Under Supervision', verifiedBy: 'Dr. Sanjoy Sengupta', status: 'Approved', date: '24 Sep 2026' },
  { id: 'CBME-SUR-04', code: 'SU 11.4', competency: 'Aseptic scrubbing, donning gown and gloves for OT', category: 'Skill', level: 'Performed Independently', verifiedBy: 'Dr. Arup Mukherjee', status: 'Approved', date: '21 Sep 2026' },
  { id: 'CBME-PED-02', code: 'PE 8.1', competency: 'Assessment of newborn gestational age via Ballard Score', category: 'Mini-CEX', level: 'Observed & Assisted', verifiedBy: 'Dr. Meenakshi Roy', status: 'Pending Review', date: '27 Sep 2026' },
  { id: 'CBME-PAT-03', code: 'PA 16.5', competency: 'Interpretation of Peripheral Blood Smear for microcytic anemia', category: 'DOPS', level: 'Performed Independently', verifiedBy: 'Dr. Kalyan Bhattacharya', status: 'Approved', date: '18 Sep 2026' },
  { id: 'CBME-MED-09', code: 'IM 9.6', competency: 'Interpretation of 12-lead ECG in acute myocardial infarction', category: 'OSCE', level: 'Demonstrated in Sim Lab', verifiedBy: 'Dr. Sanjoy Sengupta', status: 'Approved', date: '12 Sep 2026' },
];

export default function StudentPortalPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [logbook, setLogbook] = useState(INITIAL_LOGBOOK);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [newLog, setNewLog] = useState({
    code: '',
    competency: '',
    category: 'DOPS',
    level: 'Performed Under Supervision',
    faculty: 'Dr. Sanjoy Sengupta',
  });

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.code || !newLog.competency) {
      alert('Please fill out the competency details.');
      return;
    }
    const item = {
      id: `CBME-LOG-${Math.floor(100 + Math.random() * 900)}`,
      code: newLog.code,
      competency: newLog.competency,
      category: newLog.category,
      level: newLog.level,
      verifiedBy: newLog.faculty,
      status: 'Pending Review',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setLogbook([item, ...logbook]);
    setOpenLogModal(false);
    setNewLog({ code: '', competency: '', category: 'DOPS', level: 'Performed Under Supervision', faculty: 'Dr. Sanjoy Sengupta' });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Student Profile Card Header */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3.5,
          background: 'linear-gradient(135deg, #0F172A 0%, #102A43 55%, #0F766E 100%)',
          color: '#FFFFFF',
          p: { xs: 2.5, md: 3.5 },
          boxShadow: '0 8px 30px rgba(15, 118, 110, 0.15)',
        }}
      >
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: '#5EEAD4',
                color: '#0F172A',
                fontSize: '2rem',
                fontWeight: 800,
                border: '4px solid rgba(255,255,255,0.2)',
              }}
            >
              AM
            </Avatar>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {STUDENT_PROFILE.name}
              </Typography>
              <Chip
                label="ACTIVE CANDIDATE"
                size="small"
                sx={{ bgcolor: '#10B981', color: '#FFFFFF', fontWeight: 800, fontSize: '0.7rem' }}
              />
              <Chip
                label={STUDENT_PROFILE.bloodGroup}
                size="small"
                sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', fontWeight: 700 }}
              />
            </Stack>

            <Typography variant="body2" sx={{ color: '#5EEAD4', fontWeight: 600, mb: 1 }}>
              {STUDENT_PROFILE.program} • {STUDENT_PROFILE.currentPhase}
            </Typography>

            <Grid container spacing={2} sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Roll No:</strong> {STUDENT_PROFILE.rollNo} • <strong>Reg:</strong> {STUDENT_PROFILE.regNo}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Clinical Mentor:</strong> {STUDENT_PROFILE.mentor}
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => alert('Generating official University Examination Hall Ticket PDF...')}
              sx={{
                bgcolor: '#5EEAD4',
                color: '#0F172A',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { bgcolor: '#99F6E4' },
              }}
            >
              Download Hall Ticket
            </Button>
            <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', mt: 1 }}>
              Univ Exam Center: Hall 2 (Bio-Block)
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* NMC Statutory Eligibility Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, letterSpacing: 0.5 }}>
              THEORY ATTENDANCE (NMC MIN 75%)
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', my: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F766E' }}>
                84.5%
              </Typography>
              <Chip label="ELIGIBLE" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 800, height: 20 }} />
            </Stack>
            <LinearProgress variant="determinate" value={84.5} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#0F766E' } }} />
            <Typography variant="caption" sx={{ color: '#64748B', mt: 1, display: 'block' }}>
              152 / 180 Lectures attended
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, letterSpacing: 0.5 }}>
              CLINICAL POSTINGS (NMC MIN 80%)
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', my: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7' }}>
                91.2%
              </Typography>
              <Chip label="ELIGIBLE" size="small" sx={{ bgcolor: '#F0F9FF', color: '#0284C7', fontWeight: 800, height: 20 }} />
            </Stack>
            <LinearProgress variant="determinate" value={91.2} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#0284C7' } }} />
            <Typography variant="caption" sx={{ color: '#64748B', mt: 1, display: 'block' }}>
              73 / 80 Bedside clinics logged
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, letterSpacing: 0.5 }}>
              CBME LOGBOOK STATUS
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', my: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#7C3AED' }}>
                112 / 140
              </Typography>
              <Chip label="80% DONE" size="small" sx={{ bgcolor: '#FAF5FF', color: '#7C3AED', fontWeight: 800, height: 20 }} />
            </Stack>
            <LinearProgress variant="determinate" value={80} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#7C3AED' } }} />
            <Typography variant="caption" sx={{ color: '#64748B', mt: 1, display: 'block' }}>
              28 DOPS & mini-CEX pending
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, letterSpacing: 0.5 }}>
              INTERNAL ASSESSMENT (IA)
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', my: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669' }}>
                68.5%
              </Typography>
              <Chip label="QUALIFIED" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 800, height: 20 }} />
            </Stack>
            <LinearProgress variant="determinate" value={68.5} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#059669' } }} />
            <Typography variant="caption" sx={{ color: '#64748B', mt: 1, display: 'block' }}>
              Min 50% required in Theory + Practical
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            px: 2,
            borderBottom: '1px solid #E2E8F0',
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minHeight: 52 },
          }}
        >
          <Tab icon={<FactCheckIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="CBME Logbook & DOPS" />
          <Tab icon={<EventAvailableIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Weekly Timetable" />
          <Tab icon={<MenuBookIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Internal Assessment & Results" />
          <Tab icon={<AccountBalanceWalletIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Fee Ledger & Receipts" />
        </Tabs>

        {/* Tab 0: CBME Logbook */}
        {tabIndex === 0 && (
          <Box sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  CBME Competency & Procedural Logbook
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Statutory e-Logbook conforming to National Medical Commission direct observation rubrics.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setOpenLogModal(true)}
                sx={{
                  bgcolor: '#0F766E',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#115E59' },
                }}
              >
                Log New Clinical Procedure
              </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>CBME Code</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Competency / Procedure Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Evaluation Tool</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Mastery Level</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Supervising Faculty</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Verification</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logbook.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: '#0F766E' }}>{row.code}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1E293B' }}>{row.competency}</TableCell>
                      <TableCell>
                        <Chip label={row.category} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: '#F1F5F9' }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#475569' }}>{row.level}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#334155', fontWeight: 600 }}>{row.verifiedBy}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#64748B' }}>{row.date}</TableCell>
                      <TableCell>
                        <Chip
                          icon={row.status === 'Approved' ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <WarningAmberIcon sx={{ fontSize: 14 }} />}
                          label={row.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            bgcolor: row.status === 'Approved' ? '#ECFDF5' : '#FFFBEB',
                            color: row.status === 'Approved' ? '#059669' : '#D97706',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab 1: Weekly Timetable */}
        {tabIndex === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
              Phase II Clinical Rotation & Academic Schedule
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Current Week: WBUHS Academic Week 14 • Unit Posting: General Medicine Unit 2 (Ward 4B)
            </Typography>

            <Grid container spacing={2}>
              {[
                { time: '08:00 AM - 09:00 AM', session: 'Theory Lecture: Community Acquired Pneumonia', venue: 'Lecture Theatre 2', teacher: 'Prof. (Dr.) Sanjoy Sengupta' },
                { time: '09:00 AM - 12:00 PM', session: 'Bedside Clinical Postings: History Taking & Respiratory Examination', venue: 'Hospital Ward 4B', teacher: 'Dr. A. Roy (Associate Prof)' },
                { time: '12:00 PM - 01:00 PM', session: 'Clinical Skills Lab: Sputum Collection & Peak Flow Meter Demonstration', venue: 'Simulation Center Station 3', teacher: 'Dr. K. Bhattacharya' },
                { time: '01:00 PM - 02:00 PM', session: 'Lunch & Peer Mentoring Break', venue: 'Central Student Cafeteria', teacher: 'Self' },
                { time: '02:00 PM - 04:00 PM', session: 'Pathology Practical: Hematology Slide Review & Blood Grouping', venue: 'Para-Clinical Lab 1', teacher: 'Dept. of Pathology Faculty' },
              ].map((item, idx) => (
                <Grid size={{ xs: 12 }} key={idx}>
                  <Card sx={{ p: 2, borderRadius: 2, borderLeft: '5px solid #0F766E', bgcolor: '#F8FAFC' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                      <Box>
                        <Chip label={item.time} size="small" sx={{ bgcolor: '#0F766E', color: '#FFFFFF', fontWeight: 700, mb: 0.5 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                          {item.session}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          Instructor: {item.teacher}
                        </Typography>
                      </Box>
                      <Chip label={item.venue} variant="outlined" sx={{ fontWeight: 600, color: '#334155', mt: { xs: 1, sm: 0 } }} />
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tab 2: Internal Assessment */}
        {tabIndex === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
              Phase II Internal Assessment (IA) Report Card
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>IA-1 Theory (100)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>IA-1 Practical (50)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>IA-2 Theory (100)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>IA-2 Practical (50)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Aggregate %</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { subject: 'General Medicine', t1: '74', p1: '39', t2: '78', p2: '41', pct: '77.3%', status: 'Pass' },
                    { subject: 'General Surgery', t1: '68', p1: '36', t2: '72', p2: '38', pct: '71.3%', status: 'Pass' },
                    { subject: 'Pathology & Blood Bank', t1: '82', p1: '44', t2: '86', p2: '46', pct: '86.0%', status: 'Distinction' },
                    { subject: 'Pharmacology', t1: '71', p1: '37', t2: '75', p2: '40', pct: '74.3%', status: 'Pass' },
                    { subject: 'Microbiology', t1: '69', p1: '35', t2: '70', p2: '37', pct: '70.3%', status: 'Pass' },
                  ].map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>{row.subject}</TableCell>
                      <TableCell>{row.t1}</TableCell>
                      <TableCell>{row.p1}</TableCell>
                      <TableCell>{row.t2}</TableCell>
                      <TableCell>{row.p2}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0F766E' }}>{row.pct}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: row.status === 'Distinction' ? '#FAF5FF' : '#ECFDF5',
                            color: row.status === 'Distinction' ? '#7C3AED' : '#059669',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab 3: Fee Ledger */}
        {tabIndex === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
              Student Academic Fee Ledger & Tax Invoices
            </Typography>

            <Grid container spacing={2}>
              {[
                { title: 'Academic Year 2026-27 (Phase II Tuition)', amount: '₹6,50,000', date: '01 Jul 2026', status: 'PAID IN FULL', receiptNo: 'RCP-2026-00412' },
                { title: 'Hostel Boarding & Mess Advance (2026-27)', amount: '₹1,20,000', date: '05 Jul 2026', status: 'PAID IN FULL', receiptNo: 'RCP-2026-00489' },
                { title: 'WBUHS Professional Examination Registration Fee', amount: '₹4,500', date: '15 Sep 2026', status: 'PAID IN FULL', receiptNo: 'RCP-2026-00912' },
              ].map((fee, idx) => (
                <Grid size={{ xs: 12 }} key={idx}>
                  <Card sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                        {fee.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Paid on: {fee.date} • Transaction Receipt: {fee.receiptNo}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F766E' }}>
                        {fee.amount}
                      </Typography>
                      <Chip label={fee.status} size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 800 }} />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => alert(`Downloading payment receipt ${fee.receiptNo}`)}
                      >
                        Receipt
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Log Procedure Modal */}
      <Dialog
        open={openLogModal}
        onClose={() => setOpenLogModal(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
          Log New CBME Clinical Procedure
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleAddLog} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="CBME Code (e.g. IM 4.3)"
                  value={newLog.code}
                  onChange={(e) => setNewLog({ ...newLog, code: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Assessment Tool"
                  value={newLog.category}
                  onChange={(e) => setNewLog({ ...newLog, category: e.target.value })}
                >
                  <MenuItem value="DOPS">DOPS (Direct Observation)</MenuItem>
                  <MenuItem value="Mini-CEX">Mini-CEX (Clinical Exam)</MenuItem>
                  <MenuItem value="OSCE">OSCE</MenuItem>
                  <MenuItem value="Skill">Skill Demonstration</MenuItem>
                </TextField>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  label="Competency / Procedure Name"
                  placeholder="e.g. Insertion of nasogastric tube under aseptic precautions"
                  value={newLog.competency}
                  onChange={(e) => setNewLog({ ...newLog, competency: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Performance Level"
                  value={newLog.level}
                  onChange={(e) => setNewLog({ ...newLog, level: e.target.value })}
                >
                  <MenuItem value="Observed & Assisted">Observed &amp; Assisted</MenuItem>
                  <MenuItem value="Performed Under Supervision">Performed Under Supervision</MenuItem>
                  <MenuItem value="Performed Independently">Performed Independently</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Supervising Faculty"
                  value={newLog.faculty}
                  onChange={(e) => setNewLog({ ...newLog, faculty: e.target.value })}
                >
                  <MenuItem value="Dr. Sanjoy Sengupta">Prof. (Dr.) Sanjoy Sengupta (Medicine)</MenuItem>
                  <MenuItem value="Dr. Arup Mukherjee">Prof. (Dr.) Arup Mukherjee (Surgery)</MenuItem>
                  <MenuItem value="Dr. Meenakshi Roy">Prof. (Dr.) Meenakshi Roy (Pediatrics)</MenuItem>
                  <MenuItem value="Dr. Kalyan Bhattacharya">Prof. (Dr.) Kalyan Bhattacharya (Pathology)</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenLogModal(false)} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddLog}
            sx={{ bgcolor: '#0F766E', '&:hover': { bgcolor: '#115E59' } }}
          >
            Submit for Faculty Signoff
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
