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
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import { MedoraDatePicker } from '../../../../MedoraDatePicker';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PageHeader } from '../../../../PageHeader';
import { useAuth, api } from '../../../PortalShell';

const steps = [
  'Basic Profile',
  'Contact Details',
  'Guardian Info',
  'Academic History',
  'Entrance Exam',
  'Course Selection',
  'Category & Quota',
  'Medical Fitness',
  'Identity Docs',
  'Academic Certs',
  'Hostel & Transit',
  'Fee Structure',
  'Review & Submit',
];

export default function NewStudentAdmissionPage() {
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
      if (!formData.firstName || !formData.lastName || !formData.dob) {
        setError('Please fill in all mandatory personal details.');
        return;
      }
      if (new Date(formData.dob) > new Date()) {
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
      const studentPayload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        programme: formData.programme,
        department: formData.department,
        batch: formData.batch,
        quota: formData.quota,
        neet_score: Number(formData.neetScore) || null,
        neet_rank: Number(formData.neetRank) || null,
        guardian_name: formData.guardianName,
        guardian_phone: formData.guardianPhone,
        status: 'Active',
      };
      await api('records/students', 'POST', studentPayload, user?.csrf);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit admission record.');
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
            Admission Processed Successfully!
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.95rem', mb: 4 }}>
            Student record for <strong>{formData.firstName} {formData.lastName}</strong> has been created.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => { setSuccess(false); setActiveStep(0); }} sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}>
              Admit Another Student
            </Button>
            <Button variant="contained" onClick={() => router.push('/portal/students')} sx={{ bgcolor: '#0F766E', textTransform: 'none', borderRadius: '8px', fontWeight: 700, '&:hover': { bgcolor: '#0D6861' } }}>
              View Student Directory
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
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="nationality" control={control} render={({ field }) => <TextField fullWidth label="Nationality" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Controller name="bloodGroup" control={control} render={({ field }) => (<Select {...field} label="Blood Group" >
                  <MenuItem value="A+">A+</MenuItem><MenuItem value="A-">A-</MenuItem><MenuItem value="B+">B+</MenuItem><MenuItem value="B-">B-</MenuItem><MenuItem value="O+">O+</MenuItem><MenuItem value="O-">O-</MenuItem><MenuItem value="AB+">AB+</MenuItem><MenuItem value="AB-">AB-</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="aadhaarNumber" control={control} render={({ field }) => <TextField fullWidth label="Aadhaar / National ID" {...field} />} /></Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="email" control={control} render={({ field }) => <TextField fullWidth type="email" label="Email Address" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="phone" control={control} render={({ field }) => <TextField fullWidth label="Mobile Phone" {...field}  required />} /></Grid>
            <Grid size={12}><Controller name="address" control={control} render={({ field }) => <TextField fullWidth label="Permanent Address" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="city" control={control} render={({ field }) => <TextField fullWidth label="City" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="state" control={control} render={({ field }) => <TextField fullWidth label="State" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="pincode" control={control} render={({ field }) => <TextField fullWidth label="Pincode" {...field} />} /></Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="guardianName" control={control} render={({ field }) => <TextField fullWidth label="Guardian Name" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Relation</InputLabel>
                <Controller name="guardianRelation" control={control} render={({ field }) => (<Select {...field} label="Relation" >
                  <MenuItem value="Father">Father</MenuItem><MenuItem value="Mother">Mother</MenuItem><MenuItem value="Guardian">Legal Guardian</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="guardianPhone" control={control} render={({ field }) => <TextField fullWidth label="Guardian Phone" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="guardianOccupation" control={control} render={({ field }) => <TextField fullWidth label="Guardian Occupation" {...field} />} /></Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="tenthBoard" control={control} render={({ field }) => <TextField fullWidth label="10th Board" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="tenthYear" control={control} render={({ field }) => <TextField fullWidth label="10th Passing Year" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="tenthPercentage" control={control} render={({ field }) => <TextField fullWidth label="10th Percentage" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="twelfthBoard" control={control} render={({ field }) => <TextField fullWidth label="12th Board" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="twelfthYear" control={control} render={({ field }) => <TextField fullWidth label="12th Passing Year" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Controller name="twelfthPercentage" control={control} render={({ field }) => <TextField fullWidth label="12th Percentage" {...field} />} /></Grid>
            <Grid size={12}><Controller name="previousInstitute" control={control} render={({ field }) => <TextField fullWidth label="Previous Institute Attended" {...field} />} /></Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="neetRollNumber" control={control} render={({ field }) => <TextField fullWidth label="NEET Roll Number" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="neetScore" control={control} render={({ field }) => <TextField fullWidth type="number" label="NEET Score" {...field}  required />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="neetRank" control={control} render={({ field }) => <TextField fullWidth type="number" label="All India Rank" {...field} />} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="neetYear" control={control} render={({ field }) => <TextField fullWidth label="NEET Exam Year" {...field} />} /></Grid>
          </Grid>
        );
      case 5:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Programme</InputLabel>
                <Controller name="programme" control={control} render={({ field }) => (<Select {...field} label="Programme" >
                  <MenuItem value="MBBS">MBBS</MenuItem><MenuItem value="MD">MD</MenuItem><MenuItem value="BDS">BDS</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Controller name="department" control={control} render={({ field }) => (<Select {...field} label="Department" >
                  <MenuItem value="General Medicine">General Medicine</MenuItem><MenuItem value="Pediatrics">Pediatrics</MenuItem><MenuItem value="Radiology">Radiology</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Batch</InputLabel>
                <Controller name="batch" control={control} render={({ field }) => (<Select {...field} label="Batch" >
                  <MenuItem value="2025-2026">2025 - 2026</MenuItem><MenuItem value="2024-2025">2024 - 2025</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
          </Grid>
        );
      case 6:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Controller name="category" control={control} render={({ field }) => (<Select {...field} label="Category" >
                  <MenuItem value="General">General</MenuItem><MenuItem value="OBC">OBC</MenuItem><MenuItem value="SC">SC</MenuItem><MenuItem value="ST">ST</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Quota</InputLabel>
                <Controller name="quota" control={control} render={({ field }) => (<Select {...field} label="Quota" >
                  <MenuItem value="Government Merit">Government Merit</MenuItem><MenuItem value="Management Quota">Management Quota</MenuItem><MenuItem value="NRI">NRI Quota</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Person with Disability</InputLabel>
                <Controller name="isPwd" control={control} render={({ field }) => (<Select {...field} label="Person with Disability" >
                  <MenuItem value="No">No</MenuItem><MenuItem value="Yes">Yes</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
          </Grid>
        );
      case 7:
        return (
          <Grid container spacing={2.5}>
            <Grid size={12}><Controller name="medicalConditions" control={control} render={({ field }) => <TextField fullWidth label="Existing Medical Conditions" {...field} />} /></Grid>
            <Grid size={12}><Controller name="allergies" control={control} render={({ field }) => <TextField fullWidth label="Known Allergies" {...field} />} /></Grid>
            <Grid size={12}>
              <Paper elevation={0} sx={{ p: 2, border: '1px dashed #CBD5E1', borderRadius: '10px', bgcolor: '#F8FAFC' }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B', mb: 1 }}>Upload Medical Fitness Certificate</Typography>
                <Button size="small" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ textTransform: 'none' }}>Upload File</Button>
              </Paper>
            </Grid>
          </Grid>
        );
      case 8:
        return (
          <Grid container spacing={2}>
            {['Passport Size Photo', 'Aadhaar / ID Proof', 'Signature Scan'].map((doc, idx) => (
              <Grid size={12} key={idx}>
                <Paper elevation={0} sx={{ p: 2, border: '1px dashed #CBD5E1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F8FAFC' }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>{doc}</Typography>
                  <Button size="small" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ textTransform: 'none' }}>Upload</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );
      case 9:
        return (
          <Grid container spacing={2}>
            {['10th Marksheet', '12th Marksheet', 'NEET Scorecard', 'Transfer Certificate'].map((doc, idx) => (
              <Grid size={12} key={idx}>
                <Paper elevation={0} sx={{ p: 2, border: '1px dashed #CBD5E1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F8FAFC' }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>{doc}</Typography>
                  <Button size="small" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ textTransform: 'none' }}>Upload</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );
      case 10:
        return (
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <FormControlLabel control={<Checkbox checked={formData.needsHostel} onChange={(e) => setValue('needsHostel',  e.target.checked)} />} label="Opt for On-Campus Hostel Accommodation" />
            </Grid>
            {formData.needsHostel && (
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Hostel Room Type</InputLabel>
                  <Controller name="hostelRoomType" control={control} render={({ field }) => (<Select {...field} label="Hostel Room Type" >
                    <MenuItem value="AC Single">AC Single</MenuItem><MenuItem value="Non-AC Double">Non-AC Double</MenuItem>
                  </Select>
)} />
              </FormControl>
              </Grid>
            )}
            <Grid size={12}>
              <FormControlLabel control={<Checkbox checked={formData.needsTransport} onChange={(e) => setValue('needsTransport',  e.target.checked)} />} label="Opt for College Transport / Bus Facility" />
            </Grid>
            {formData.needsTransport && (
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Transport Route</InputLabel>
                  <Controller name="transportRoute" control={control} render={({ field }) => (<Select {...field} label="Transport Route" >
                    <MenuItem value="Route A">Route A (North City)</MenuItem><MenuItem value="Route B">Route B (South City)</MenuItem>
                  </Select>
)} />
              </FormControl>
              </Grid>
            )}
          </Grid>
        );
      case 11:
        return (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Fee Plan</InputLabel>
                <Controller name="feeCategory" control={control} render={({ field }) => (<Select {...field} label="Fee Plan" >
                  <MenuItem value="Standard Fee">Standard Fee</MenuItem><MenuItem value="Instalment Plan">Instalment Plan</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Scholarship / Waiver</InputLabel>
                <Controller name="scholarship" control={control} render={({ field }) => (<Select {...field} label="Scholarship / Waiver" >
                  <MenuItem value="None">None</MenuItem><MenuItem value="Merit 25%">25% Merit Waiver</MenuItem>
                </Select>
)} />
              </FormControl>
            </Grid>
            <Grid size={12}><Controller name="initialDeposit" control={control} render={({ field }) => <TextField fullWidth label="Initial Deposit Amount (₹)" {...field} />} /></Grid>
          </Grid>
        );
      case 12:
        return (
          <Box>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mb: 2 }}>Please review the student details before final submission.</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>STUDENT NAME</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>{formData.firstName} {formData.lastName}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>PROGRAMME</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F766E' }}>{formData.programme} - {formData.department}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>NEET SCORE</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>{formData.neetScore} (Rank: {formData.neetRank})</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>QUOTA & FEES</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>{formData.quota} • {formData.feeCategory}</Typography>
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
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/portal/dashboard' },
          { label: 'Students', href: '/portal/students' },
          { label: 'New Admission' },
        ]}
        category="Student Admissions Desk"
        title="Student Admission & Enrollment Dossier"
        description="Comprehensive 9-stage NMC institutional admission registration and digital document verification."
        icon={<PersonAddIcon />}
      />

      {/* Stepper with horizontal scrolling on mobile */}
      <Paper elevation={0} sx={{ p: 3, mb: 3.5, borderRadius: '12px', border: '1px solid #E2E8F0', overflowX: 'auto' }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ minWidth: 1000 }}>
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
              {submitting ? 'Submitting...' : 'Confirm & Enroll Student'}
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}
