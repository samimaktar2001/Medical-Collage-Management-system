'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { api } from '../../PortalShell';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import toast from 'react-hot-toast';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';

// Icons
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

export default function NMCAuditPage() {
  const [departmentAudits, setDepartmentAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('clinical/nmc-audit')
      .then((res: any) => {
        if (res?.departmentAudits) {
          setDepartmentAudits(res.departmentAudits);
        }
      })
      .catch((err) => console.error('Failed to load NMC audit', err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Box>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Reports & Roles', href: '/portal/dashboard' },
          { label: 'NMC MSR Audit' },
        ]}
        title="NMC Minimum Standard Requirements (MSR) Inspection Audit"
        description="Statutory verification cockpit for NMC UG/PG assessors: Daily OPD footfall, IPD bed occupancy, OT surgical volume, diagnostics, and AEBAS faculty biometric compliance."
        icon={<FactCheckIcon sx={{ fontSize: 24 }} />}
        badge={<StatusBadge status="Assessment Year 2026–27" tone="teal" />}
        actions={
          <>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap',
                px: 2,
                py: 0.8,
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                color: '#0F766E',
                '&:hover': { borderColor: '#0F766E', bgcolor: '#F0FDFA' },
              }}
            >
              Print Inspection Summary
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<DownloadIcon sx={{ color: '#FFFFFF !important' }} />}
              onClick={() => toast.success('Generating official NMC Form-B Complete Institutional Audit Dossier (PDF format) with digital signature stamps.')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap',
                px: 2.2,
                py: 0.8,
                borderRadius: '8px',
                bgcolor: '#0F766E',
                color: '#FFFFFF !important',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#115E59', boxShadow: 'none' },
              }}
            >
              Export NMC Form-B Dossier
            </Button>
          </>
        }
      />

        {/* 5 Regulatory Benchmark Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            {
              title: 'Daily OPD Patient Footfall',
              actual: '1,482 Patients',
              req: 'NMC Requirement: Min 1,200/day',
              ratio: 123.5,
              icon: <LocalHospitalIcon sx={{ color: '#0F766E' }} />,
              color: '#0F766E',
              bg: '#CCFBF1',
            },
            {
              title: 'Hospital Bed Occupancy Rate',
              actual: '84.6% Occupancy',
              req: 'NMC Requirement: Min 80% (635/750 beds)',
              ratio: 105.7,
              icon: <SchoolIcon sx={{ color: '#0284C7' }} />,
              color: '#0284C7',
              bg: '#E0F2FE',
            },
            {
              title: 'Major & Minor Surgeries',
              actual: '29 Major • 46 Minor',
              req: 'NMC Requirement: Min 25 Major/day',
              ratio: 116.0,
              icon: <FactCheckIcon sx={{ color: '#7C3AED' }} />,
              color: '#7C3AED',
              bg: '#EDE9FE',
            },
            {
              title: 'Diagnostic Investigations',
              actual: '1,531 Tests Today',
              req: 'Biochem: 620 • Path: 580 • Radio: 331',
              ratio: 128.0,
              icon: <ScienceIcon sx={{ color: '#EA580C' }} />,
              color: '#EA580C',
              bg: '#FFEDD5',
            },
            {
              title: 'AEBAS Biometric Faculty Attendance',
              actual: '88.4% Verified',
              req: 'NMC Requirement: Min 75% daily',
              ratio: 117.8,
              icon: <FingerprintIcon sx={{ color: '#059669' }} />,
              color: '#059669',
              bg: '#DCFCE7',
            },
          ].map((kpi, idx) => (
            <Grid size={{ xs: 12, sm: 6, lg: 2.4 }} key={idx}>
              <Paper elevation={0} sx={{ p: 2.2, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: '8px', bgcolor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {kpi.icon}
                    </Box>
                    <Chip icon={<CheckCircleIcon sx={{ fontSize: '13px !important', color: '#059669 !important' }} />} label="100% Pass" size="small" sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 800, fontSize: '0.65rem' }} />
                  </Stack>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>{kpi.title}</Typography>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F172A', my: 0.3 }}>{kpi.actual}</Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', mb: 0.5 }}>{kpi.req}</Typography>
                  <LinearProgress variant="determinate" value={100} sx={{ height: 5, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: kpi.color } }} />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Clinical Department-wise MSR Breakdown */}
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', bgcolor: '#FAFCFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                Department-wise Clinical &amp; Academic Workload Census
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                Real-time NMC inspection snapshot for 150 MBBS undergraduate annual intake.
              </Typography>
            </Box>
            <StatusBadge status="Overall Status: 100% Fully Compliant" tone="success" />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>DEPARTMENT</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>DAILY OPD CENSUS</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>IPD OCCUPIED BEDS</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>MAJOR OT</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>MINOR OT</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>LABORATORY TESTS</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>AEBAS BIOMETRIC</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>NMC STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentAudits.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{row.dept}</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F766E' }}>{row.opd} / day</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>{row.ipdBed}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{row.majorOt}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{row.minorOt}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0284C7' }}>{row.labTests}</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#059669' }}>{row.facultyAebas}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
    </Box>
  );
}
