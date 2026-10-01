'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ScaleIcon from '@mui/icons-material/Scale';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryIcon from '@mui/icons-material/History';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import BedIcon from '@mui/icons-material/Hotel';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  status: 'Inpatient (Admitted)' | 'Outpatient' | 'Discharged';
  admittedDate?: string;
  ward?: string;
  bedNumber?: string;
  attendingDoctor: string;
  department: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    validTill: string;
    coverageLimit: string;
  };
  allergies: string[];
  chronicDiseases: string[];
  vitals: {
    bp: string;
    heartRate: string;
    spo2: string;
    temperature: string;
    respiratoryRate: string;
    bmi: string;
    weight: string;
  };
}

const mockPatients: Record<string, PatientRecord> = {
  'PAT-2401': {
    id: 'PAT-2401',
    name: 'Abdul Rahman',
    age: 45,
    gender: 'Male',
    dob: '1979-04-12',
    bloodGroup: 'B+',
    phone: '+91 98765 43210',
    email: 'abdul.rahman@example.com',
    address: '42 Crescent Road, Park Circus, Kolkata, WB - 700017',
    status: 'Inpatient (Admitted)',
    admittedDate: '2026-09-28 10:30 AM',
    ward: 'Cardiology Ward B (Floor 3)',
    bedNumber: 'Bed #304',
    attendingDoctor: 'Dr. S. K. Sen (Senior Cardiologist)',
    department: 'Cardiology',
    emergencyContact: {
      name: 'Nasreen Rahman',
      relationship: 'Spouse',
      phone: '+91 98765 43211',
    },
    insurance: {
      provider: 'Star Health & Allied Insurance',
      policyNumber: 'SH-MED-889210-C',
      validTill: '2027-03-31',
      coverageLimit: '₹5,00,000',
    },
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicDiseases: ['Hypertension (Stage 2)', 'Type 2 Diabetes Mellitus'],
    vitals: {
      bp: '132/86 mmHg',
      heartRate: '78 bpm',
      spo2: '98%',
      temperature: '98.4 °F',
      respiratoryRate: '18 / min',
      bmi: '24.2',
      weight: '72 kg',
    },
  },
  'PAT-2402': {
    id: 'PAT-2402',
    name: 'Fatima Begum',
    age: 62,
    gender: 'Female',
    dob: '1964-08-20',
    bloodGroup: 'O+',
    phone: '+91 98301 22345',
    email: 'fatima.begum@example.com',
    address: '15/B Lake Gardens, Kolkata, WB - 700045',
    status: 'Discharged',
    admittedDate: '2026-09-20 02:15 PM',
    ward: 'Orthopedic Post-Op Ward',
    bedNumber: 'Bed #112',
    attendingDoctor: 'Dr. R. Ahmed (Orthopedic Surgeon)',
    department: 'Orthopedics',
    emergencyContact: {
      name: 'Imran Begum',
      relationship: 'Son',
      phone: '+91 98301 22346',
    },
    insurance: {
      provider: 'HDFC ERGO Health',
      policyNumber: 'HE-9912044-OP',
      validTill: '2027-01-15',
      coverageLimit: '₹7,50,000',
    },
    allergies: ['Aspirin'],
    chronicDiseases: ['Osteoarthritis (Bilateral Knees)', 'Hypothyroidism'],
    vitals: {
      bp: '124/80 mmHg',
      heartRate: '72 bpm',
      spo2: '99%',
      temperature: '98.6 °F',
      respiratoryRate: '16 / min',
      bmi: '26.8',
      weight: '65 kg',
    },
  },
};

const defaultPatient: PatientRecord = {
  id: 'PAT-2400',
  name: 'Standard Patient',
  age: 35,
  gender: 'Male',
  dob: '1991-01-01',
  bloodGroup: 'O+',
  phone: '+91 98000 00000',
  email: 'patient@example.com',
  address: 'Medical College Campus, Kolkata, WB',
  status: 'Inpatient (Admitted)',
  admittedDate: '2026-09-29 09:00 AM',
  ward: 'General Medicine Ward (Floor 2)',
  bedNumber: 'Bed #205',
  attendingDoctor: 'Dr. P. Roy (General Physician)',
  department: 'General Medicine',
  emergencyContact: {
    name: 'Family Member',
    relationship: 'Kin',
    phone: '+91 98000 00001',
  },
  insurance: {
    provider: 'Swasthya Sathi Scheme',
    policyNumber: 'WB-SS-9938210',
    validTill: '2028-12-31',
    coverageLimit: '₹5,00,000',
  },
  allergies: ['None Reported'],
  chronicDiseases: ['Mild Gastritis'],
  vitals: {
    bp: '120/80 mmHg',
    heartRate: '74 bpm',
    spo2: '99%',
    temperature: '98.6 °F',
    respiratoryRate: '16 / min',
    bmi: '23.1',
    weight: '68 kg',
  },
};

export default function PatientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const patientId = (params?.id as string) || 'PAT-2401';
  const patient = mockPatients[patientId] || { ...defaultPatient, id: patientId };

  const [activeTab, setActiveTab] = useState(0);

  // Mock active medications
  const medications = [
    { name: 'Tab. Telmisartan 40mg', dose: '1 Tab', freq: 'Once daily (Morning)', route: 'Oral', duration: '30 Days', status: 'Active', prescribedBy: 'Dr. S. K. Sen' },
    { name: 'Tab. Metformin 500mg SR', dose: '1 Tab', freq: 'Twice daily (Post Meals)', route: 'Oral', duration: 'Ongoing', status: 'Active', prescribedBy: 'Dr. S. K. Sen' },
    { name: 'Inj. Enoxaparin 40mg', dose: '0.4 ml', freq: 'Once daily (Sub-Q)', route: 'Subcutaneous', duration: '5 Days', status: 'Active', prescribedBy: 'Dr. S. K. Sen' },
    { name: 'Tab. Pantoprazole 40mg', dose: '1 Tab', freq: 'Empty stomach (Morning)', route: 'Oral', duration: '14 Days', status: 'Active', prescribedBy: 'Dr. S. K. Sen' },
    { name: 'Cap. Amoxicillin 500mg', dose: '1 Cap', freq: 'TDS (8 hrly)', route: 'Oral', duration: '5 Days', status: 'Completed', prescribedBy: 'Emergency Duty MO' },
  ];

  // Mock lab reports
  const labReports = [
    { testName: 'Complete Blood Count (CBC)', date: '2026-09-29 08:30 AM', category: 'Hematology', result: 'Hb: 13.8 g/dL, WBC: 8,400 /uL, Plt: 2.4L', status: 'Normal', reportId: 'LAB-90412' },
    { testName: 'Lipid Profile Comprehensive', date: '2026-09-29 08:30 AM', category: 'Biochemistry', result: 'Total Chol: 210 mg/dL, LDL: 132 mg/dL, HDL: 44 mg/dL', status: 'Borderline High', reportId: 'LAB-90413' },
    { testName: '12-Lead Electrocardiogram (ECG)', date: '2026-09-28 11:15 AM', category: 'Cardiology', result: 'Sinus rhythm, Mild ST depression in V4-V6', status: 'Under Review', reportId: 'ECG-4421' },
    { testName: 'Chest X-Ray (PA View)', date: '2026-09-28 12:00 PM', category: 'Radiology', result: 'Normal cardiac silhouette, Clear lung fields', status: 'Normal', reportId: 'RAD-11029' },
    { testName: 'Serum Creatinine & Urea', date: '2026-09-29 08:30 AM', category: 'Biochemistry', result: 'Creatinine: 1.0 mg/dL, Blood Urea: 28 mg/dL', status: 'Normal', reportId: 'LAB-90415' },
  ];

  // Mock clinical timeline notes
  const clinicalNotes = [
    {
      date: '2026-09-30 09:30 AM',
      doctor: 'Dr. S. K. Sen (Consultant Cardiologist)',
      type: 'Morning Ward Round',
      notes: 'Patient feels comfortable today. Chest tightness resolved post-medication. BP stabilized at 132/86. Advised to continue current anti-hypertensive regimen and plan for 2D Echo tomorrow morning.',
    },
    {
      date: '2026-09-29 06:00 PM',
      doctor: 'Dr. A. Dutta (Resident Medical Officer)',
      type: 'Evening Clinical Review',
      notes: 'Evening vitals recorded. Blood sugar pre-dinner: 142 mg/dL. No nocturnal dyspnea or palpitation. Diet: Low salt, diabetic meal administered.',
    },
    {
      date: '2026-09-28 10:30 AM',
      doctor: 'Emergency Medical Officer',
      type: 'Emergency Admission',
      notes: 'Presented with acute retrosternal chest pain radiating to left shoulder for 2 hours. Sublingual nitrate given with relief. Admitted to Cardiology Ward for observation and cardiac enzyme series.',
    },
  ];

  // Mock billing items
  const billingItems = [
    { desc: 'Hospital Inpatient Bed Charges (3 Days @ ₹1,500/day)', date: '2026-09-28 to 2026-09-30', amount: '₹4,500' },
    { desc: 'Consultant Specialist Visit Charges (Dr. S. K. Sen - 3 Visits)', date: '2026-09-28 to 2026-09-30', amount: '₹3,000' },
    { desc: 'Laboratory Diagnostics (CBC, Lipid, LFT, KFT)', date: '2026-09-29', amount: '₹2,800' },
    { desc: 'Diagnostic Imaging (12-Lead ECG + Chest X-Ray)', date: '2026-09-28', amount: '₹1,400' },
    { desc: 'Pharmacy & Medical Consumables (Inpatient supply)', date: '2026-09-28 to 2026-09-30', amount: '₹3,650' },
    { desc: 'Nursing & Round-the-clock Monitoring Fees', date: '2026-09-28 to 2026-09-30', amount: '₹1,800' },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Top Breadcrumbs & Back ─── */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>

        <Breadcrumbs sx={{ fontSize: '0.8125rem' }}>
          <Link underline="hover" color="inherit" href="/portal/hospital">
            Hospital Management
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            Patient Profile ({patient.id})
          </Typography>
        </Breadcrumbs>
      </Stack>

      {/* ─── Master Header Card ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '16px', p: 3, mb: 3, bgcolor: '#FFFFFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
          {/* Patient Identity */}
          <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: '#0F766E',
                fontSize: '1.75rem',
                fontWeight: 800,
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 4px 12px rgba(15,118,110,0.25)',
              }}
            >
              {patient.name.charAt(0)}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.35rem', sm: '1.6rem' }, color: '#0F172A' }}>
                  {patient.name}
                </Typography>
                <Chip
                  label={patient.status}
                  size="small"
                  sx={{
                    bgcolor: patient.status.includes('Admitted') ? '#FEF2F2' : '#F0FDF4',
                    color: patient.status.includes('Admitted') ? '#DC2626' : '#16A34A',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1, color: '#64748B', fontSize: '0.85rem' }}>
                <Box component="span"><strong>UHID:</strong> {patient.id}</Box>
                <Box component="span">•</Box>
                <Box component="span"><strong>Age:</strong> {patient.age} Yrs ({patient.gender})</Box>
                <Box component="span">•</Box>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#BE123C', fontWeight: 700 }}>
                  <BloodtypeIcon sx={{ fontSize: 16 }} /> {patient.bloodGroup}
                </Box>
                <Box component="span">•</Box>
                <Box component="span"><strong>Ward:</strong> {patient.ward || 'Outpatient'}</Box>
              </Stack>
            </Box>
          </Stack>

          {/* Quick Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                color: '#334155',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              Print ID & Summary
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => alert(`Adding prescription for ${patient.name}...`)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                bgcolor: '#0F766E',
                boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
                '&:hover': { bgcolor: '#0D6861' },
              }}
            >
              + New Prescription
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* Contact & Meta Row */}
        <Grid container spacing={2} sx={{ fontSize: '0.85rem', color: '#475569' }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <PhoneIcon sx={{ fontSize: 18, color: '#0F766E' }} />
              <Typography sx={{ fontSize: '0.85rem' }}>{patient.phone}</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <EmailIcon sx={{ fontSize: 18, color: '#0F766E' }} />
              <Typography sx={{ fontSize: '0.85rem' }}>{patient.email}</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <LocalHospitalIcon sx={{ fontSize: 18, color: '#0F766E' }} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Doctor: {patient.attendingDoctor}</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <HealthAndSafetyIcon sx={{ fontSize: 18, color: '#0F766E' }} />
              <Typography sx={{ fontSize: '0.85rem' }}>Insurance: {patient.insurance.provider}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {/* ─── Clinical Vitals Banner ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Blood Pressure', value: patient.vitals.bp, icon: <MonitorHeartIcon />, color: '#DC2626', bg: '#FEF2F2', sub: 'Normal: 120/80' },
          { label: 'Heart Rate', value: patient.vitals.heartRate, icon: <FavoriteIcon />, color: '#E11D48', bg: '#FFE4E6', sub: 'Resting pulse' },
          { label: 'SpO2 Oxygen', value: patient.vitals.spo2, icon: <AirIcon />, color: '#0284C7', bg: '#E0F2FE', sub: 'Room air' },
          { label: 'Body Temp', value: patient.vitals.temperature, icon: <ThermostatIcon />, color: '#D97706', bg: '#FEF3C7', sub: 'Oral reading' },
          { label: 'Resp. Rate', value: patient.vitals.respiratoryRate, icon: <AccessTimeIcon />, color: '#059669', bg: '#D1FAE5', sub: 'Spontaneous' },
          { label: 'Weight & BMI', value: `${patient.vitals.weight} (${patient.vitals.bmi})`, icon: <ScaleIcon />, color: '#7C3AED', bg: '#EDE9FE', sub: 'Normal range' },
        ].map((v, i) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={i}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 1.5, bgcolor: '#FFFFFF', height: '100%' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: v.bg, color: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(v.icon, { sx: { fontSize: 16 } })}
                </Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>{v.label}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.15rem', color: '#0F172A', lineHeight: 1.2 }}>
                {v.value}
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mt: 0.25 }}>{v.sub}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ─── Navigation Tabs ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: '1px solid #E2E8F0',
            bgcolor: '#F8FAFC',
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              py: 2,
              color: '#64748B',
              '&.Mui-selected': { color: '#0F766E' },
            },
            '& .MuiTabs-indicator': { bgcolor: '#0F766E', height: 3, borderRadius: '3px 3px 0 0' },
          }}
        >
          <Tab icon={<HistoryIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Medical Overview" />
          <Tab icon={<MedicationIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Prescriptions & Rx" />
          <Tab icon={<ScienceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Lab & Radiology Tests" />
          <Tab icon={<LocalHospitalIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Clinical Doctor Notes" />
          <Tab icon={<BedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Bed & Admission" />
          <Tab icon={<ReceiptLongIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Billing & Invoices" />
        </Tabs>

        {/* ─── Tab 0: Medical Overview ─── */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Allergies & Alerts */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', mb: 1.5, fontFamily: "'Manrope', sans-serif" }}>
                  Known Allergies & Drug Sensitivities
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {patient.allergies.map((allergy, i) => (
                    <Chip
                      key={i}
                      label={`⚠️ Allergy: ${allergy}`}
                      sx={{ bgcolor: '#FEF2F2', color: '#DC2626', fontWeight: 700, fontSize: '0.8rem', border: '1px solid #FCA5A5' }}
                    />
                  ))}
                </Stack>

                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', mb: 1.5, fontFamily: "'Manrope', sans-serif" }}>
                  Chronic Co-morbidities
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {patient.chronicDiseases.map((dis, i) => (
                    <Chip
                      key={i}
                      label={dis}
                      sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 600, fontSize: '0.8rem', border: '1px solid #CBD5E1' }}
                    />
                  ))}
                </Stack>
              </Grid>

              {/* Emergency Contact & Insurance Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F8FAFC', mb: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A', mb: 1, fontFamily: "'Manrope', sans-serif" }}>
                    Emergency Kin Contact
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>
                    <strong>Name:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>
                    <strong>Phone:</strong> {patient.emergencyContact.phone}
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F0FDFA', borderColor: '#99F6E4' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F766E', mb: 1, fontFamily: "'Manrope', sans-serif" }}>
                    Health Insurance Policy Details
                  </Typography>
                  <Grid container spacing={1} sx={{ fontSize: '0.825rem', color: '#134E4A' }}>
                    <Grid size={{ xs: 6 }}><strong>Provider:</strong> {patient.insurance.provider}</Grid>
                    <Grid size={{ xs: 6 }}><strong>Policy No:</strong> {patient.insurance.policyNumber}</Grid>
                    <Grid size={{ xs: 6 }}><strong>Coverage Limit:</strong> {patient.insurance.coverageLimit}</Grid>
                    <Grid size={{ xs: 6 }}><strong>Validity:</strong> {patient.insurance.validTill}</Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ─── Tab 1: Prescriptions & Rx ─── */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', fontFamily: "'Manrope', sans-serif" }}>
                Active & Hospital Inpatient Medications
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => alert('Opening prescription dialog...')}
                sx={{ bgcolor: '#0F766E', textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
              >
                Add Medication
              </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>MEDICATION / DRUG</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DOSAGE</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>FREQUENCY</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>ROUTE</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DURATION</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>PRESCRIBER</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medications.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A' }}>{row.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#334155' }}>{row.dose}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#334155' }}>{row.freq}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#334155' }}>{row.route}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#334155' }}>{row.duration}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#64748B' }}>{row.prescribedBy}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            bgcolor: row.status === 'Active' ? '#D1FAE5' : '#F1F5F9',
                            color: row.status === 'Active' ? '#065F46' : '#64748B',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            height: 22,
                            borderRadius: '4px',
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

        {/* ─── Tab 2: Lab & Radiology ─── */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', fontFamily: "'Manrope', sans-serif" }}>
                Diagnostic Laboratory & Radiology Reports
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ScienceIcon />}
                onClick={() => alert('Order new diagnostic test...')}
                sx={{ borderColor: '#CBD5E1', color: '#334155', textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}
              >
                Order Lab Test
              </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>TEST NAME</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>CATEGORY</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DATE & TIME</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>FINDINGS / SUMMARY</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569', textAlign: 'right' }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {labReports.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A' }}>
                        {row.testName}
                        <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>{row.reportId}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#334155' }}>{row.category}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#334155' }}>{row.date}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#334155' }}>{row.result}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            bgcolor: row.status === 'Normal' ? '#D1FAE5' : row.status === 'Borderline High' ? '#FEF3C7' : '#E0F2FE',
                            color: row.status === 'Normal' ? '#065F46' : row.status === 'Borderline High' ? '#B45309' : '#0369A1',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            height: 22,
                            borderRadius: '4px',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button
                          size="small"
                          startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                          onClick={() => alert(`Downloading report ${row.reportId}...`)}
                          sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, color: '#0F766E' }}
                        >
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* ─── Tab 3: Clinical Notes ─── */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', fontFamily: "'Manrope', sans-serif" }}>
                Consultant Rounds & Clinical Progress Notes
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => alert('Add progress note dialog...')}
                sx={{ bgcolor: '#0F766E', textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
              >
                + New Progress Note
              </Button>
            </Stack>

            <Stack spacing={2}>
              {clinicalNotes.map((note, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2.5, borderRadius: '12px', borderLeft: '4px solid #0F766E' }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
                      {note.type} — <Box component="span" sx={{ color: '#0F766E' }}>{note.doctor}</Box>
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>{note.date}</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                    {note.notes}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* ─── Tab 4: Bed & Admission ─── */}
        {activeTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', mb: 2, fontFamily: "'Manrope', sans-serif" }}>
              Inpatient Ward & Bed Allocation Status
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#64748B', mb: 1 }}>
                    CURRENT ADMISSION DETAILS
                  </Typography>
                  <Stack spacing={1.5} sx={{ fontSize: '0.85rem', color: '#334155' }}>
                    <Box><strong>Admission Date & Time:</strong> {patient.admittedDate || 'N/A'}</Box>
                    <Box><strong>Assigned Ward:</strong> {patient.ward || 'General'}</Box>
                    <Box><strong>Bed Identifier:</strong> <Chip label={patient.bedNumber || 'Bed #304'} size="small" sx={{ fontWeight: 700, bgcolor: '#E0F2FE', color: '#0369A1' }} /></Box>
                    <Box><strong>Treating Department:</strong> {patient.department}</Box>
                    <Box><strong>Primary Consultant:</strong> {patient.attendingDoctor}</Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F8FAFC' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#64748B', mb: 1 }}>
                    BED MOVEMENT & TRANSFER ACTIONS
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mb: 2 }}>
                    Transfer patient to ICU, Step-Down Ward, or initiate discharge summary.
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Button variant="outlined" size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>
                      Transfer Bed / Ward
                    </Button>
                    <Button variant="contained" size="small" color="error" sx={{ textTransform: 'none', fontWeight: 700 }}>
                      Initiate Discharge
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ─── Tab 5: Billing & Invoices ─── */}
        {activeTab === 5 && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', fontFamily: "'Manrope', sans-serif" }}>
                Patient Running Bill & Interim Invoices
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<ReceiptLongIcon />}
                onClick={() => alert('Generating Interim Bill PDF...')}
                sx={{ bgcolor: '#0F766E', textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
              >
                Generate Interim Invoice
              </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '10px', mb: 3 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SERVICE / CHARGE DESCRIPTION</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DATE PERIOD</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569', textAlign: 'right' }}>AMOUNT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingItems.map((item, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: 600 }}>{item.desc}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#64748B' }}>{item.date}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: 700, textAlign: 'right' }}>{item.amount}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell colSpan={2} sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A', textAlign: 'right' }}>
                      Total Interim Running Bill:
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F766E', textAlign: 'right' }}>
                      ₹17,150
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="info" sx={{ borderRadius: '10px', fontSize: '0.85rem' }}>
              <strong>TPA Insurance Pre-Authorization:</strong> Approved for cashless coverage up to ₹1,50,000 under Star Health Policy #{patient.insurance.policyNumber}.
            </Alert>
          </Box>
        )}
      </Card>
    </Box>
  );
}
