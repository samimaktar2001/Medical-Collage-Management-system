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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import toast from 'react-hot-toast';

// Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HotelIcon from '@mui/icons-material/Hotel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import PrintIcon from '@mui/icons-material/Print';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';

// Mock Patient Queue for OPD Clinic
interface PatientQueueItem {
  token: string;
  uhid: string;
  name: string;
  ageGender: string;
  vitals: string;
  chiefComplaint: string;
  status: 'Waiting' | 'Consulting' | 'Completed';
}

const INITIAL_QUEUE: PatientQueueItem[] = [
  { token: 'TK-101', uhid: 'UHID-89210', name: 'Rameshwar Roy', ageGender: '58 / M', vitals: 'BP: 140/90 • HR: 78 • SpO2: 98%', chiefComplaint: 'Fatigue, frequent urination & polyuria for 3 weeks', status: 'Waiting' },
  { token: 'TK-102', uhid: 'UHID-89214', name: 'Shyama Devi', ageGender: '46 / F', vitals: 'BP: 128/82 • HR: 82 • SpO2: 99%', chiefComplaint: 'Epigastric burning sensation after meals for 1 month', status: 'Waiting' },
  { token: 'TK-103', uhid: 'UHID-89219', name: 'Tapan Kumar Das', ageGender: '64 / M', vitals: 'BP: 155/95 • HR: 88 • SpO2: 96%', chiefComplaint: 'Bilateral ankle edema & exertional dyspnea (NYHA Class II)', status: 'Waiting' },
  { token: 'TK-104', uhid: 'UHID-89225', name: 'Priya Sen', ageGender: '29 / F', vitals: 'BP: 110/70 • HR: 76 • SpO2: 99%', chiefComplaint: 'Intermittent high-grade fever with chills for 4 days', status: 'Waiting' },
  { token: 'TK-100', uhid: 'UHID-89190', name: 'Animesh Ghosh', ageGender: '52 / M', vitals: 'BP: 130/84 • HR: 74 • SpO2: 98%', chiefComplaint: 'Routine hypertension and diabetes followup', status: 'Completed' },
];

const COMMON_ICD10 = [
  'E11.9 - Type 2 diabetes mellitus without complications',
  'I10 - Essential (primary) hypertension',
  'K21.9 - Gastro-esophageal reflux disease without esophagitis',
  'J06.9 - Acute upper respiratory infection, unspecified',
  'J45.909 - Unspecified asthma, uncomplicated',
  'M54.5 - Low back pain',
  'B54 - Unspecified malaria',
];

export default function DoctorPortalPage() {
  const [queue, setQueue] = useState<PatientQueueItem[]>(INITIAL_QUEUE);
  const [activePatient, setActivePatient] = useState<PatientQueueItem | null>(null);

  // Rx State
  const [diagnosis, setDiagnosis] = useState(COMMON_ICD10[0]);
  const [rxNotes, setRxNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([
    { drug: 'Tab. Metformin 500mg', dosage: '1 Tab', freq: 'Twice daily (BD)', timing: 'After Meals', duration: '30 Days' },
    { drug: 'Tab. Telmisartan 40mg', dosage: '1 Tab', freq: 'Once daily (OD)', timing: 'Morning Before Breakfast', duration: '30 Days' },
  ]);
  const [labTests, setLabTests] = useState('HbA1c, Fasting Blood Sugar (FBS), Lipid Profile, Serum Creatinine');
  const [admitToIpd, setAdmitToIpd] = useState(false);

  const handleStartConsultation = (patient: PatientQueueItem) => {
    setActivePatient(patient);
  };

  const handleCompleteConsultation = () => {
    if (!activePatient) return;
    setQueue((prev) =>
      prev.map((p) => (p.uhid === activePatient.uhid ? { ...p, status: 'Completed' } : p))
    );
    toast.success(`Prescription for ${activePatient.name} signed & dispatched to Hospital Central Pharmacy & EHR repository.`);
    setActivePatient(null);
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/portal/dashboard' },
          { label: 'Role Workspaces', href: '/portal/roles' },
          { label: 'Doctor Console' },
        ]}
        category="Clinical Workstation"
        title="Doctor Clinical Workstation & OPD Chamber"
        description="Live patient consultation queue, clinical diagnosis, E-Prescription writer, and IPD ward round orders."
        icon={<LocalHospitalIcon />}
        badge={<StatusBadge status="Clinic On-Duty" tone="teal" />}
        actions={
          <Button
            variant="outlined"
            onClick={() => toast.success('Opening Ward 4B IPD Rounds Census...')}
            sx={{
              borderColor: '#CBD5E1',
              color: '#0F766E',
              bgcolor: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '8px',
              px: 2,
              '&:hover': { bgcolor: '#F0FDFA' },
            }}
          >
            IPD Rounds (30 Beds)
          </Button>
        }
      />

      {/* Doctor Header Banner Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          p: { xs: 2.5, md: 3 },
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <Grid container spacing={2.5} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: '#F0FDFA',
                color: '#0F766E',
                fontSize: '1.6rem',
                fontWeight: 800,
                border: '2px solid #0F766E',
                boxShadow: '0 4px 12px rgba(15,118,110,0.15)',
              }}
            >
              SS
            </Avatar>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: '#0F172A' }}>
                Prof. (Dr.) Sanjoy K. Sengupta
              </Typography>
              <StatusBadge status="Senior Consultant" tone="teal" />
              <StatusBadge status="Unit 1 Head" tone="info" />
            </Stack>
            <Typography sx={{ color: '#0F766E', fontWeight: 700, fontSize: '0.875rem' }}>
              HOD &amp; Senior Consultant Physician • Department of General Medicine
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.8125rem', mt: 0.5 }}>
              Council Registration: <strong>WBMC-48192</strong> • OPD Chamber: <strong>Room 102</strong> • Timing: <strong>09:00 AM – 02:00 PM</strong>
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 'auto' }} sx={{ ml: { md: 'auto' } }}>
            <Paper elevation={0} sx={{ p: 1.5, px: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Consultation Status
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: '#059669', mt: 0.3 }}>
                Active Chamber
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Card>

      {/* Clinical Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
              OPD QUEUE WAITING
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#D97706', my: 0.5 }}>
              {queue.filter((q) => q.status === 'Waiting').length} Patients
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Estimated queue time: ~45 mins
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
              CONSULTATIONS COMPLETED
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669', my: 0.5 }}>
              {queue.filter((q) => q.status === 'Completed').length} Today
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Avg consultation: 8.5 mins
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
              IPD PATIENTS IN WARD
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7', my: 0.5 }}>
              28 / 30 Beds
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              3 Discharges planned today
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
              MEDICO-LEGAL (MLC) &amp; CRITICAL
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#DC2626', my: 0.5 }}>
              0 Flagged
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              ICU on-call standby
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* OPD Patient Queue Table */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Today&apos;s Active Outpatient Consultation Queue
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Room 102 • Patients triaged at Nursing Station with vital signs recorded.
            </Typography>
          </Box>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Token</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>UHID &amp; Patient</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Age / Gender</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vital Signs Recorded</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chief Complaint</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Clinical Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((pt) => (
                <TableRow key={pt.token} hover>
                  <TableCell sx={{ fontWeight: 800, color: '#0F766E' }}>{pt.token}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                      {pt.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {pt.uhid}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{pt.ageGender}</TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#334155' }}>{pt.vitals}</TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#475569', maxWidth: 260 }}>{pt.chiefComplaint}</TableCell>
                  <TableCell>
                    <StatusBadge status={pt.status} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {pt.status !== 'Completed' ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleStartConsultation(pt)}
                        sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#115E59' } }}
                      >
                        Examine &amp; Prescribe
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PrintIcon />}
                        onClick={() => toast.success(`Printing signed Rx for ${pt.name}`)}
                        sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                      >
                        View Rx
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Smart Rx & Consultation Dialog */}
      <Dialog
        open={Boolean(activePatient)}
        onClose={() => setActivePatient(null)}
        maxWidth="lg"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        {activePatient && (
          <>
            <DialogTitle component="div" sx={{ pb: 1, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography component="span" variant="h6" sx={{ fontWeight: 800, color: '#0F172A', display: 'block' }}>
                    Clinical Consultation: {activePatient.name} ({activePatient.ageGender})
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Token: {activePatient.token} • {activePatient.uhid} • Vitals: {activePatient.vitals}
                  </Typography>
                </Box>
                <IconButton onClick={() => setActivePatient(null)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
              <Grid container spacing={3}>
                {/* Left: Complaints & Diagnosis */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F766E', mb: 1 }}>
                    1. Patient Symptoms &amp; History
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: '#F0FDFA', borderRadius: 2, mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>Triage Chief Complaint:</Typography>
                    <Typography variant="body2" sx={{ color: '#134E4A', fontWeight: 600, mt: 0.5 }}>
                      {activePatient.chiefComplaint}
                    </Typography>
                  </Paper>

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F766E', mb: 1 }}>
                    2. Primary Diagnosis (ICD-10 Coded)
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    sx={{ mb: 2 }}
                  >
                    {COMMON_ICD10.map((d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F766E', mb: 1 }}>
                    3. Clinical Examination Findings
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Chest clear, S1 S2 heard normal, P/A soft non-tender, no pedal edema..."
                    value={rxNotes}
                    onChange={(e) => setRxNotes(e.target.value)}
                  />
                </Grid>

                {/* Right: Prescriptions & Diagnostic Lab Orders */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F766E', mb: 1 }}>
                    4. Medications &amp; Dosage Instructions (Rx)
                  </Typography>

                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, mb: 3 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Medication</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Timing</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prescriptions.map((rx, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>{rx.drug}</TableCell>
                            <TableCell>{rx.freq}</TableCell>
                            <TableCell>{rx.timing}</TableCell>
                            <TableCell>{rx.duration}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F766E', mb: 1 }}>
                    5. Laboratory &amp; Radiological Orders
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={labTests}
                    onChange={(e) => setLabTests(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#0F172A' }}>
                      Diagnostic requisitions are synced instantly to Central Pathology &amp; PACS Radiology.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
              <Button onClick={() => setActivePatient(null)} sx={{ color: '#64748B' }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={handleCompleteConsultation}
                sx={{
                  bgcolor: '#0F766E',
                  fontWeight: 700,
                  px: 3,
                  '&:hover': { bgcolor: '#115E59' },
                }}
              >
                Sign &amp; Issue Digital Prescription
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
