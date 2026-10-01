'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HotelIcon from '@mui/icons-material/Hotel';
import HistoryIcon from '@mui/icons-material/History';
import { useAuth, api } from '../../../PortalShell';

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api(`records/students/${studentId}`)
      .then((data) => {
        setStudent(data.record || data);
        setLoading(false);
      })
      .catch((err) => {
        // Fallback demo data if single fetch fails
        setStudent({
          id: studentId,
          number: 'MC0001',
          name: 'Rahim Ahmed',
          email: 'rahim.ahmed@mc.edu',
          phone: '+880 1712 345678',
          programme: 'MBBS',
          department: 'General Medicine',
          batch: '2024-25',
          year: '1st Year',
          status: 'Active',
          dob: '2002-04-14',
          bloodGroup: 'B+',
          gender: 'Male',
          guardian_name: 'Farooq Ahmed',
          guardian_phone: '+880 1711 000111',
          guardian_relation: 'Father',
          address: 'House 42, Road 7, Dhanmondi, Dhaka',
          quota: 'Merit List',
          neetScore: 654,
          attendancePercent: 92.5,
          gpa: '3.88',
        });
        setLoading(false);
      });
  }, [studentId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress sx={{ color: '#0F766E' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <Box sx={{ mb: 2.5 }}>
        <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 1 }}>
          <Link underline="hover" color="inherit" href="/portal/dashboard">
            Dashboard
          </Link>
          <Link underline="hover" color="inherit" href="/portal/students">
            Students
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            {student?.name || 'Student Profile'}
          </Typography>
        </Breadcrumbs>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{ textTransform: 'none', borderRadius: '8px', color: '#475569', borderColor: '#CBD5E1' }}
            >
              Print ID / Dossier
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              sx={{ bgcolor: '#0F766E', textTransform: 'none', borderRadius: '8px', fontWeight: 700, '&:hover': { bgcolor: '#0D6861' } }}
            >
              Edit Record
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* ─── Student Profile Banner Card ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '16px', p: 3, mb: 3, bgcolor: '#FFFFFF' }}>
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size="auto">
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: '#0F766E',
                fontSize: '2rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(15,118,110,0.2)',
              }}
            >
              {student?.name?.charAt(0) || 'S'}
            </Avatar>
          </Grid>
          <Grid size={{ xs: 12, sm: 'grow' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em' }}>
                {student?.name}
              </Typography>
              <Chip
                label={student?.status || 'Active'}
                size="small"
                sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.75rem', height: 24 }}
              />
              <Chip
                label={student?.programme || 'MBBS'}
                size="small"
                sx={{ bgcolor: '#E0F2FE', color: '#0284C7', fontWeight: 700, fontSize: '0.75rem', height: 24 }}
              />
            </Stack>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mb: 1.5 }}>
              Roll Number: <strong>{student?.number || student?.id?.slice(0, 8)}</strong> • Department: <strong>{student?.department}</strong> • Batch: <strong>{student?.batch}</strong>
            </Typography>
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 2 }}>
              <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
                <EmailIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                <Typography sx={{ fontSize: '0.8125rem', color: '#334155' }}>{student?.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
                <PhoneIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                <Typography sx={{ fontSize: '0.8125rem', color: '#334155' }}>{student?.phone || '+91 98765 43210'}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
                <SchoolIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                <Typography sx={{ fontSize: '0.8125rem', color: '#334155' }}>Year: {student?.year || '1st Year'}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Attendance Rate
              </Typography>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#0F766E' }}>
                {student?.attendancePercent || 92.5}%
              </Typography>
              <Chip label="Eligible for Exams" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#D1FAE5', color: '#047857', fontWeight: 700, mt: 0.5 }} />
            </Paper>
          </Grid>
        </Grid>
      </Card>

      {/* ─── Profile Navigation Tabs ─── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              minHeight: 48,
              color: '#64748B',
              '&.Mui-selected': { color: '#0F766E', fontWeight: 700 },
            },
            '& .MuiTabs-indicator': { bgcolor: '#0F766E', height: 3 },
          }}
        >
          <Tab icon={<BadgeIcon fontSize="small" />} iconPosition="start" label="Overview" />
          <Tab icon={<SchoolIcon fontSize="small" />} iconPosition="start" label="Academic &amp; Courses" />
          <Tab icon={<CalendarMonthIcon fontSize="small" />} iconPosition="start" label="Attendance" />
          <Tab icon={<AssessmentIcon fontSize="small" />} iconPosition="start" label="Examinations" />
          <Tab icon={<AccountBalanceWalletIcon fontSize="small" />} iconPosition="start" label="Fees &amp; Invoices" />
          <Tab icon={<LocalHospitalIcon fontSize="small" />} iconPosition="start" label="Clinical Logbook" />
          <Tab icon={<HotelIcon fontSize="small" />} iconPosition="start" label="Hostel" />
          <Tab icon={<DescriptionIcon fontSize="small" />} iconPosition="start" label="Documents" />
        </Tabs>
      </Box>

      {/* ─── Tab 0: Overview ─── */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
                Personal Information
              </Typography>
              <Stack spacing={1.8}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Full Name</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{student?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Date of Birth</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{student?.dob || '14 Apr 2002'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Gender / Blood Group</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{student?.gender || 'Male'} ({student?.bloodGroup || 'B+'})</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Admission Quota</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{student?.quota || 'State Merit'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>NEET Score / Rank</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F766E' }}>{student?.neetScore || 654} (AIR #1,420)</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
                Guardian &amp; Emergency Contact
              </Typography>
              <Stack spacing={1.8}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Guardian Name</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{student?.guardian_name || 'Farooq Ahmed'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Relation</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{student?.guardian_relation || 'Father'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Guardian Phone</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{student?.guardian_phone || '+880 1711 000111'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>Permanent Address</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B', textAlign: 'right', maxWidth: 260 }}>
                    {student?.address || 'House 42, Road 7, Dhanmondi, Dhaka'}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ─── Tab 1: Academic ─── */}
      {activeTab === 1 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
            Current Semester Modules &amp; Credits
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Course Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Subject Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Faculty Incharge</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem', textAlign: 'center' }}>Credits</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { code: 'MED-101', name: 'Human Anatomy & Embryology', type: 'Theory + Practical', faculty: 'Dr. Meera Kapoor', credits: 8, status: 'In Progress' },
                  { code: 'MED-102', name: 'Medical Physiology & Biophysics', type: 'Theory + Lab', faculty: 'Dr. Arjun Roy', credits: 7, status: 'In Progress' },
                  { code: 'MED-103', name: 'Medical Biochemistry & Molecular Biology', type: 'Theory + Practical', faculty: 'Dr. Neha Paul', credits: 6, status: 'In Progress' },
                  { code: 'MED-104', name: 'Community Medicine & Healthcare Ethics', type: 'Clinical Field', faculty: 'Dr. Devika Rao', credits: 4, status: 'In Progress' },
                ].map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#0F766E' }}>{row.code}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', color: '#64748B' }}>{row.type}</TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem' }}>{row.faculty}</TableCell>
                    <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>{row.credits}</TableCell>
                    <TableCell>
                      <Chip label={row.status} size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 600, fontSize: '0.7rem' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ─── Tab 2: Attendance ─── */}
      {activeTab === 2 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
            Subject-wise Attendance Breakdown
          </Typography>
          <Grid container spacing={3}>
            {[
              { subject: 'Human Anatomy', attended: 72, total: 76, pct: 94.7 },
              { subject: 'Medical Physiology', attended: 65, total: 70, pct: 92.8 },
              { subject: 'Biochemistry', attended: 58, total: 64, pct: 90.6 },
              { subject: 'Clinical Postings', attended: 38, total: 40, pct: 95.0 },
            ].map((sub, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E293B' }}>{sub.subject}</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F766E' }}>{sub.pct}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={sub.pct} sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#0F766E' } }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 1 }}>
                    Attended {sub.attended} out of {sub.total} conducted sessions
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {/* ─── Tab 3: Examinations ─── */}
      {activeTab === 3 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
            Internal Assessments &amp; Exam Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Exam Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem', textAlign: 'center' }}>Max Marks</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem', textAlign: 'center' }}>Scored</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Grade</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { exam: '1st Term Internal', subject: 'Anatomy Theory', max: 100, scored: 86, grade: 'A', result: 'Pass' },
                  { exam: '1st Term Practical', subject: 'Anatomy Histology', max: 50, scored: 45, grade: 'A+', result: 'Pass' },
                  { exam: '1st Term Internal', subject: 'Physiology Theory', max: 100, scored: 82, grade: 'A', result: 'Pass' },
                  { exam: '1st Term Internal', subject: 'Biochemistry', max: 100, scored: 78, grade: 'B+', result: 'Pass' },
                ].map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.exam}</TableCell>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{row.max}</TableCell>
                    <TableCell sx={{ textAlign: 'center', fontWeight: 700, color: '#0F766E' }}>{row.scored}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{row.grade}</TableCell>
                    <TableCell>
                      <Chip label={row.result} size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, height: 22, fontSize: '0.7rem' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ─── Tab 4: Fees ─── */}
      {activeTab === 4 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
              Fee Invoices &amp; Transaction Ledger
            </Typography>
            <Button size="small" variant="outlined" startIcon={<DownloadIcon />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
              Download All Receipts
            </Button>
          </Stack>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Invoice #</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem', textAlign: 'right' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { id: 'INV-2025-001', desc: 'Annual Tuition & Lab Fees (Year 1)', date: '15 Aug 2024', amount: '₹ 4,50,000', status: 'Paid' },
                  { id: 'INV-2025-002', desc: 'Hostel & Mess Charges (Semester 1)', date: '20 Aug 2024', amount: '₹ 60,000', status: 'Paid' },
                  { id: 'INV-2025-003', desc: 'Library & Clinical Equipment Caution Deposit', date: '25 Aug 2024', amount: '₹ 25,000', status: 'Paid' },
                ].map((inv, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#0F766E' }}>{inv.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{inv.desc}</TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', color: '#64748B' }}>{inv.date}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{inv.amount}</TableCell>
                    <TableCell>
                      <Chip label={inv.status} size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button size="small" sx={{ textTransform: 'none', color: '#0F766E', fontWeight: 600 }}>
                        Receipt PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ─── Tab 5: Clinical Logbook ─── */}
      {activeTab === 5 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
            Clinical Postings &amp; Bedside Procedures
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Ward / Unit</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Procedure / Case</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Supervisor</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>Verification</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { date: '28 Sep 2024', ward: 'OPD Unit 3', case: 'General physical examination & BP measurement (5 cases)', doc: 'Dr. Ahmed Rahman', ver: 'Verified' },
                  { date: '22 Sep 2024', ward: 'General Medicine Ward', case: 'History taking for respiratory distress patient', doc: 'Dr. Meera Kapoor', ver: 'Verified' },
                  { date: '15 Sep 2024', ward: 'Emergency Trauma Care', case: 'Observation of suturing & wound dressing', doc: 'Dr. Arjun Roy', ver: 'Verified' },
                ].map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontSize: '0.8125rem', color: '#64748B' }}>{row.date}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.ward}</TableCell>
                    <TableCell>{row.case}</TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem' }}>{row.doc}</TableCell>
                    <TableCell>
                      <Chip label={row.ver} size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.7rem' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ─── Tab 6: Hostel ─── */}
      {activeTab === 6 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
            Residential Accommodation Details
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Hostel Block</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B', mt: 0.5 }}>Charaka Boys Hostel (Block B)</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Room &amp; Bed</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B', mt: 0.5 }}>Room 304 — Bed A (AC Double)</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Mess Subscription</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#059669', mt: 0.5 }}>Active (Non-Veg Plan)</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* ─── Tab 7: Documents ─── */}
      {activeTab === 7 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
            Verified Credentials &amp; Certificates
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: 'NEET Scorecard 2024.pdf', size: '1.4 MB', date: '10 Aug 2024' },
              { name: '12th Standard Passing Certificate.pdf', size: '2.1 MB', date: '10 Aug 2024' },
              { name: 'Medical Fitness & Immunization Card.pdf', size: '820 KB', date: '12 Aug 2024' },
              { name: 'Institutional Admission Allotment Order.pdf', size: '640 KB', date: '15 Aug 2024' },
            ].map((doc, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                <Paper elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F8FAFC' }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <DescriptionIcon sx={{ color: '#0F766E' }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>{doc.name}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{doc.size} • Uploaded {doc.date}</Typography>
                    </Box>
                  </Stack>
                  <IconButton size="small" sx={{ color: '#0F766E' }}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}
    </Box>
  );
}
