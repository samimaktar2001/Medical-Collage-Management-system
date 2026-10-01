'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import { MedoraDatePicker } from '../../../../MedoraDatePicker';
import { useAuth, api } from '../../../PortalShell';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const steps = [
  'Patient Demographics',
  'Emergency Contact',
  'Medical History',
  'Insurance Details',
  'Assign Department',
  'Review & Register'
];

export default function NewPatientRegistrationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, watch, trigger, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '', lastName: '', dob: '', gender: 'Male', bloodGroup: 'O+', nationality: 'Indian', aadhaarNumber: '',
      phone: '', email: '', address: '', city: '', state: '', pincode: '',
      emergencyName: '', emergencyRelation: 'Spouse', emergencyPhone: '', guardianName: '', guardianRelation: 'Father', guardianPhone: '', guardianOccupation: '', guardianEmail: '',
      pastConditions: '', allergies: 'None', currentMedications: 'None', physicalHandicap: 'No', medicalConditions: 'None',
      insuranceProvider: 'None', policyNumber: '', groupNumber: '',
      admissionType: 'OPD', department: 'General Medicine', referringDoctor: '',
      tenthBoard: '', tenthYear: '', tenthPercentage: '', twelfthBoard: '', twelfthYear: '', twelfthPercentage: '', previousInstitute: '',
      neetRollNumber: '', neetScore: '', neetRank: '', neetYear: '2025',
      programme: 'MBBS', batch: '2025-2026',
      category: 'General', quota: 'Government Merit', isPwd: 'No',
      needsHostel: false, hostelRoomType: 'Non-AC Double', needsTransport: false, transportRoute: 'None',
      feeCategory: 'Standard Fee', scholarship: 'None', initialDeposit: '50000',
    }
  });
  const formData = watch();

  

  const handleNext = () => {
    setError(null);
    if (activeStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        setError('Please fill in required fields (Name and Phone).');
        return;
      }
      if (formData.dob && new Date(formData.dob) > new Date()) {
        setError('Date of birth cannot be in the future.');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const patientPayload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email || null,
        phone: formData.phone,
        department: formData.department,
        programme: formData.admissionType,
        batch: new Date().getFullYear().toString(),
        status: 'Active',
        guardian_name: formData.emergencyName || null,
        guardian_phone: formData.emergencyPhone || null,
      };
      await api('records/students', 'POST', patientPayload, user?.csrf);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to register patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto', textAlign: 'center', py: 8 }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: 44 }} />
          </Box>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#0F172A', mb: 1 }}>
            Patient Registered Successfully!
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.95rem', mb: 4 }}>
            Patient record for <strong>{formData.firstName} {formData.lastName}</strong> has been created. ID: <strong>PAT-{Math.floor(Math.random() * 9000) + 1000}</strong>
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => { setSuccess(false); setActiveStep(0); reset(); }} sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}>
              Register Another
            </Button>
            <Button variant="contained" onClick={() => router.push('/portal/hospital')} sx={{ bgcolor: '#0F766E', textTransform: 'none', borderRadius: '8px', fontWeight: 700, '&:hover': { bgcolor: '#0D6861' } }}>
              Go to Hospital Dashboard
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="firstName" control={control} render={({ field }) => <TextField fullWidth label="First Name" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="lastName" control={control} render={({ field }) => <TextField fullWidth label="Last Name" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="dob" control={control} render={({ field }) => <MedoraDatePicker
                label="Date of Birth"
                size="small"
                required
                disableFuture
                {...field} value={field.value} onChange={field.onChange}
                
              />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Controller name="gender" control={control} render={({ field }) => (<Select {...field} label="Gender" >
                  <MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem><MenuItem value="Other">Other</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Controller name="bloodGroup" control={control} render={({ field }) => (<Select {...field} label="Blood Group" >
                  <MenuItem value="A+">A+</MenuItem><MenuItem value="A-">A-</MenuItem><MenuItem value="B+">B+</MenuItem><MenuItem value="O+">O+</MenuItem><MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="phone" control={control} render={({ field }) => <TextField fullWidth label="Mobile Phone" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="email" control={control} render={({ field }) => <TextField fullWidth label="Email Address" type="email" {...field} />} /></Grid>
            <Grid size={12}><Controller name="address" control={control} render={({ field }) => <TextField fullWidth label="Full Address" {...field} />} /></Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="emergencyName" control={control} render={({ field }) => <TextField fullWidth label="Emergency Contact Name" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Relation</InputLabel>
                <Controller name="emergencyRelation" control={control} render={({ field }) => (<Select {...field} label="Relation" >
                  <MenuItem value="Spouse">Spouse</MenuItem><MenuItem value="Parent">Parent</MenuItem><MenuItem value="Child">Child</MenuItem><MenuItem value="Sibling">Sibling</MenuItem><MenuItem value="Other">Other</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="emergencyPhone" control={control} render={({ field }) => <TextField fullWidth label="Emergency Phone" {...field}  required />} /></Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2.5}>
            <Grid size={12}><Controller name="pastConditions" control={control} render={({ field }) => <TextField fullWidth multiline rows={2} label="Past Medical Conditions" {...field}  placeholder="e.g. Diabetes, Hypertension" />} /></Grid>
            <Grid size={12}><Controller name="allergies" control={control} render={({ field }) => <TextField fullWidth label="Known Allergies" {...field} />} /></Grid>
            <Grid size={12}><Controller name="currentMedications" control={control} render={({ field }) => <TextField fullWidth label="Current Medications" {...field} />} /></Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Insurance Provider</InputLabel>
                <Controller name="insuranceProvider" control={control} render={({ field }) => (<Select {...field} label="Insurance Provider" >
                  <MenuItem value="None">None (Out of Pocket)</MenuItem><MenuItem value="Star Health">Star Health</MenuItem><MenuItem value="HDFC ERGO">HDFC ERGO</MenuItem><MenuItem value="LIC">LIC</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="policyNumber" control={control} render={({ field }) => <TextField fullWidth label="Policy Number" {...field}  disabled={formData.insuranceProvider === 'None'} />} /></Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Admission Type</InputLabel>
                <Controller name="admissionType" control={control} render={({ field }) => (<Select {...field} label="Admission Type" >
                  <MenuItem value="OPD">OPD (Outpatient)</MenuItem><MenuItem value="IPD">IPD (Inpatient / Admitted)</MenuItem><MenuItem value="Emergency">Emergency</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Controller name="department" control={control} render={({ field }) => (<Select {...field} label="Department" >
                  <MenuItem value="General Medicine">General Medicine</MenuItem><MenuItem value="Cardiology">Cardiology</MenuItem><MenuItem value="Orthopedics">Orthopedics</MenuItem><MenuItem value="Neurology">Neurology</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="referringDoctor" control={control} render={({ field }) => <TextField fullWidth label="Referring Doctor (if any)" {...field} />} /></Grid>
          </Grid>
        );
      case 5:
        return (
          <Box>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mb: 2 }}>Please review the patient details before generating the ID.</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>PATIENT NAME</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>{formData.firstName} {formData.lastName} ({formData.gender})</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>CONTACT</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>{formData.phone}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>DEPARTMENT & TYPE</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>{formData.department} - {formData.admissionType}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>INSURANCE</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>{formData.insuranceProvider}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 1 }}>
          <Link underline="hover" color="inherit" href="/portal/dashboard">Dashboard</Link>
          <Link underline="hover" color="inherit" href="/portal/hospital">Hospital</Link>
          <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>Patient Registration</Typography>
        </Breadcrumbs>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em' }}>
            New Patient Registration
          </Typography>
        </Stack>
      </Box>

      {/* Stepper with horizontal scrolling on mobile */}
      <Paper elevation={0} sx={{ p: 3, mb: 3.5, borderRadius: '12px', border: '1px solid #E2E8F0', overflowX: 'auto' }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ minWidth: 800 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepIcon-root.Mui-active': { color: '#0F766E' }, '& .MuiStepIcon-root.Mui-completed': { color: '#0F766E' } }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: activeStep === index ? 700 : 500 }}>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }} onClose={() => setError(null)}>{error}</Alert>}

      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: { xs: 2.5, md: 4 } }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 0.5 }}>
          {activeStep + 1}. {steps[activeStep]}
        </Typography>
        <Divider sx={{ mb: 3, mt: 1 }} />
        
        {renderStepContent()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBackIcon />} sx={{ textTransform: 'none', color: '#64748B', fontWeight: 600 }}>Previous</Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: '#0F766E', textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#0D6861' } }}>
              Continue
            </Button>
          ) : (
            <Button variant="contained" disabled={submitting} onClick={handleSubmit(onSubmit)} sx={{ bgcolor: '#0F766E', textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 4, py: 1.2, '&:hover': { bgcolor: '#0D6861' } }}>
              {submitting ? 'Registering...' : 'Register Patient'}
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}
