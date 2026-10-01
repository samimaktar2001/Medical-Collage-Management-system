'use client';

import React from 'react';
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
import Divider from '@mui/material/Divider';

// Icons
import ScienceIcon from '@mui/icons-material/Science';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function ResearchPage() {
  const ongoingProjects = [
    {
      title: 'Genomic Profiling of Multi-Drug Resistant Gram-Negative Pathogens in Tertiary ICU Settings',
      funding: 'ICMR Extramural Grant (₹48.5 Lakhs)',
      pi: 'Prof. (Dr.) Kalyan K. Bhattacharya (Pathology & Microbiology)',
      duration: '2024 – 2027',
      status: 'Active Patient Enrolment',
    },
    {
      title: 'Phase-III Randomized Clinical Trial of Novel GLP-1 Receptor Agonist in Asian Diabetic Cardiomyopathy',
      funding: 'Department of Biotechnology (DBT) & Industry Sponsored',
      pi: 'Prof. (Dr.) Sanjoy K. Sengupta (Internal Medicine)',
      duration: '2025 – 2028',
      status: 'IEC Approved & CDSCO Registered',
    },
    {
      title: 'Automated AI-Driven Diagnostic Screening for Early Neonatal Respiratory Distress using Deep Learning',
      funding: 'DST-SERB Core Research Grant',
      pi: 'Prof. (Dr.) Meenakshi Roy (Pediatrics & Neonatology)',
      duration: '2024 – 2026',
      status: 'Algorithm Validation Phase',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Hero Banner ─── */}
      <Box sx={{ bgcolor: '#09212E', color: '#FFFFFF', py: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Chip label="Translational Medical Research &amp; Clinical Trials" sx={{ bgcolor: 'rgba(94,234,212,0.18)', color: '#5EEAD4', fontWeight: 700, mb: 1.5 }} />
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.2, mb: 2 }}>
            Biomedical Research &amp; Innovation
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 800, lineHeight: 1.6 }}>
            Bridging fundamental laboratory bench discoveries with bedside patient therapeutics through ICMR extramural funded projects, clinical drug trials, and peer-reviewed international scientific publications.
          </Typography>
        </Container>
      </Box>

      {/* ─── Key Research Stats ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: -3 }}>
        <Grid container spacing={2}>
          {[
            { label: 'Published Papers (PubMed / Scopus)', val: '480+' },
            { label: 'Active ICMR & DBT Grants', val: '18 Projects' },
            { label: 'Total Research Funding', val: '₹12.4 Crores' },
            { label: 'Patents Filed & Granted', val: '7 Patents' },
          ].map((stat, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={i}>
              <Card elevation={0} sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.6rem', color: '#0F766E' }}>
                  {stat.val}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ─── Ongoing Research Projects ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
            Government &amp; Extramural Funded Science
          </Typography>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.875rem', color: '#0F172A' }}>
            Featured Ongoing Clinical Research Studies
          </Typography>
        </Box>

        <Stack spacing={3}>
          {ongoingProjects.map((p, idx) => (
            <Card key={idx} elevation={0} sx={{ p: 3.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, mb: 1.5 }} spacing={1}>
                <Chip label={p.funding} size="small" sx={{ bgcolor: 'rgba(15,118,110,0.1)', color: '#0F766E', fontWeight: 800, fontSize: '0.75rem' }} />
                <Chip label={p.status} size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.75rem' }} />
              </Stack>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F172A', mb: 1.5 }}>
                {p.title}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#475569', mb: 1 }}>
                <strong>Principal Investigator:</strong> {p.pi}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                Tenure / Duration: {p.duration}
              </Typography>
            </Card>
          ))}
        </Stack>
      </Container>

      {/* ─── Institutional Ethics Committee (IEC) ─── */}
      <Container maxWidth={false} id="iec" sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 8 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, mb: 3 }} spacing={2}>
            <Box>
              <Chip label="DCGI / CDSCO Registered Committee" sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 700, mb: 1 }} />
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#0F172A' }}>
                Institutional Ethics Committee (IEC - Human Studies)
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                All biomedical, clinical trial, and epidemiological studies involving human participants are governed under ICMR National Ethical Guidelines:
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => alert('Opening Ethics Protocol Submission Guidelines...')} sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', borderRadius: '8px' }}>
              Submit Research Protocol
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {[
              { name: 'IEC Standard Operating Procedures (SOP Version 4.2)', size: '2.4 MB' },
              { name: 'Human Clinical Trial Initial Review Application Form', size: '650 KB' },
              { name: 'Informed Consent Form Template (English & Bengali)', size: '420 KB' },
              { name: 'Serious Adverse Event (SAE) Reporting Format', size: '510 KB' },
            ].map((f, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <MenuBookIcon sx={{ color: '#0F766E', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{f.name}</Typography>
                  </Stack>
                  <Button size="small" startIcon={<FileDownloadIcon sx={{ fontSize: 16 }} />} onClick={() => alert(`Downloading ${f.name}`)} sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E' }}>
                    PDF
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
