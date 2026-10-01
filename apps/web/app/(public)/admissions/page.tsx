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
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { INSTITUTION_INFO } from '../public-data';

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'MBBS',
    neetScore: '',
    city: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Please enter candidate name and a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admission',
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          category: formData.course,
          neet_score: formData.neetScore.trim() || undefined,
          subject: `Admission Inquiry: ${formData.course} (${formData.city || 'Candidate'})`,
          message: formData.message.trim() || `Inquiry for ${formData.course} admission counseling. NEET score: ${formData.neetScore || 'N/A'}. City: ${formData.city || 'N/A'}.`,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || result.error?.message || 'Unable to register admission inquiry.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Hero Banner ─── */}
      <Box sx={{ bgcolor: '#0D2738', color: '#FFFFFF', py: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Chip label="Admissions Academic Year 2026-27" sx={{ bgcolor: 'rgba(94,234,212,0.18)', color: '#5EEAD4', fontWeight: 700, mb: 1.5 }} />
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.2, mb: 2 }}>
            Undergraduate &amp; Postgraduate Medical Admissions
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 800, lineHeight: 1.6 }}>
            Admission to the 250 MBBS seats and 86 MD/MS residency seats is governed strictly through NEET merit counseling conducted by the Medical Counseling Committee (MCC) and State Health Department.
          </Typography>
        </Container>
      </Box>

      {/* ─── Seat Matrix & Eligibility ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 5 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Seat Matrix Table */}
            <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', mb: 4 }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 1 }}>
                Annual Sanctioned Seat Matrix
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.85rem', mb: 3 }}>
                All seats are recognized by the National Medical Commission (NMC) and West Bengal University of Health Sciences (WBUHS).
              </Typography>

              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9', textAlign: 'left', color: '#334155' }}>
                      <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>Program / Degree</th>
                      <th style={{ padding: '12px 16px' }}>Total Seats</th>
                      <th style={{ padding: '12px 16px' }}>State Quota (85%)</th>
                      <th style={{ padding: '12px 16px' }}>All India / Mgmt</th>
                      <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>Entrance Exam</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0F766E' }}>MBBS (Medicine &amp; Surgery)</td>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>250</td>
                      <td style={{ padding: '14px 16px' }}>150 Seats</td>
                      <td style={{ padding: '14px 16px' }}>100 Seats</td>
                      <td style={{ padding: '14px 16px' }}>NEET-UG</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>MD General Medicine</td>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>18</td>
                      <td style={{ padding: '14px 16px' }}>9 Seats</td>
                      <td style={{ padding: '14px 16px' }}>9 Seats</td>
                      <td style={{ padding: '14px 16px' }}>NEET-PG</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>MS General Surgery</td>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>16</td>
                      <td style={{ padding: '14px 16px' }}>8 Seats</td>
                      <td style={{ padding: '14px 16px' }}>8 Seats</td>
                      <td style={{ padding: '14px 16px' }}>NEET-PG</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>MD Pediatrics</td>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>12</td>
                      <td style={{ padding: '14px 16px' }}>6 Seats</td>
                      <td style={{ padding: '14px 16px' }}>6 Seats</td>
                      <td style={{ padding: '14px 16px' }}>NEET-PG</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>B.Sc. Professional Nursing</td>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>100</td>
                      <td style={{ padding: '14px 16px' }}>70 Seats</td>
                      <td style={{ padding: '14px 16px' }}>30 Seats</td>
                      <td style={{ padding: '14px 16px' }}>JENPAS-UG</td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Paper>

            {/* Document Verification Checklist */}
            <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', mb: 4 }} id="documents">
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 2 }}>
                Mandatory Document Verification Checklist
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.85rem', mb: 3 }}>
                Candidates reporting for physical seat allotment must present original documents along with 3 sets of self-attested photocopies:
              </Typography>

              <Grid container spacing={2}>
                {[
                  'NEET-UG / NEET-PG Admit Card & All India Rank Card',
                  'Provisional Allotment Letter generated by MCC / WBMCC Portal',
                  'Class 10th Board Certificate & Birth Certificate for Age Proof',
                  'Class 12th Marks Sheet & Passing Certificate (minimum 50% in PCB)',
                  'Migration / Transfer Certificate from previous School/College',
                  'Conduct / Character Certificate from the Head of the Institution',
                  'Caste / EWS / PwD Certificate (if applicable, in prescribed Govt. format)',
                  'Medical Fitness Certificate & Hepatitis-B Immunization record',
                  'Government Photo ID Proof (Aadhaar Card, Passport or Voter ID)',
                  '10 Recent Passport Size Photographs (identical to NEET form)',
                ].map((doc, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                    <Stack direction="row" spacing={1.2} sx={{ alignItems: 'flex-start' }}>
                      <CheckCircleIcon sx={{ color: '#0F766E', fontSize: 18, mt: 0.2 }} />
                      <Typography sx={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
                        {doc}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Fee Breakdown */}
            <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }} id="fees">
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', mb: 2 }}>
                Fee Schedule &amp; Scholarships
              </Typography>
              <Typography sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, mb: 3 }}>
                Fees are regulated by the State Fee Regulatory Committee. Meritorious students ranking in the top 500 of State NEET are eligible for the Chairman’s Merit Scholarship covering 50% tuition waiver.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={() => alert('Downloading Fee Schedule PDF')} sx={{ borderColor: '#0F766E', color: '#0F766E', fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}>
                  Download Fee Structure PDF
                </Button>
                <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={() => alert('Downloading Bond Proforma PDF')} sx={{ borderColor: '#0F766E', color: '#0F766E', fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}>
                  Download Service Bond Format
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column: Admission Inquiry Desk Form */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={0} sx={{ p: 4, borderRadius: '20px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', position: 'sticky', top: 96, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }} id="inquiry">
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 1 }}>
                Admission Inquiry &amp; Counseling Desk
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 3 }}>
                Fill this form for direct counseling assistance from the Academic Registrar’s Office.
              </Typography>

              {submitted ? (
                <Alert severity="success" sx={{ borderRadius: '10px' }}>
                  Thank you! Your inquiry has been registered in our official database. An admission counselor will contact you via WhatsApp / Call within 24 hours.
                </Alert>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMsg && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                      {errorMsg}
                    </Alert>
                  )}
                  <Stack spacing={2}>
                    <TextField fullWidth size="small" label="Full Name of Candidate" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <TextField fullWidth size="small" label="Email Address" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <TextField fullWidth size="small" label="Phone / WhatsApp Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <TextField select fullWidth size="small" label="Course of Interest" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })}>
                      <MenuItem value="MBBS">MBBS (Undergraduate)</MenuItem>
                      <MenuItem value="MD General Medicine">MD General Medicine</MenuItem>
                      <MenuItem value="MS General Surgery">MS General Surgery</MenuItem>
                      <MenuItem value="MD Pediatrics">MD Pediatrics</MenuItem>
                      <MenuItem value="B.Sc. Nursing">B.Sc. Nursing</MenuItem>
                    </TextField>
                    <TextField fullWidth size="small" label="NEET Score / All India Rank" placeholder="e.g. Score 620 / AIR 14200" value={formData.neetScore} onChange={(e) => setFormData({ ...formData, neetScore: e.target.value })} />
                    <TextField fullWidth size="small" label="Candidate City / State" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    <TextField fullWidth size="small" multiline rows={2} label="Any Specific Question?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      sx={{ bgcolor: '#0F766E', fontWeight: 800, borderRadius: '8px', py: 1.2, textTransform: 'none', '&:hover': { bgcolor: '#0D6861' } }}
                    >
                      {submitting ? 'Registering Inquiry...' : 'Submit Inquiry to Registrar'}
                    </Button>
                  </Stack>
                </form>
              )}

              <Box sx={{ mt: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: '10px', fontSize: '0.75rem', color: '#64748B' }}>
                <Typography sx={{ fontSize: 'inherit', fontWeight: 700, color: '#0F172A', mb: 0.5 }}>Helpline Desk:</Typography>
                <Typography sx={{ fontSize: 'inherit' }}>Call: {INSTITUTION_INFO.admissionHelpline}</Typography>
                <Typography sx={{ fontSize: 'inherit' }}>Email: {INSTITUTION_INFO.admissionEmail}</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
