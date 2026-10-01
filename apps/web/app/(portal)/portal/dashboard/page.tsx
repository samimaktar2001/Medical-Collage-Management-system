'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { StatusBadge } from '../../../StatusBadge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useRouter } from 'next/navigation';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import HospitalIcon from '@mui/icons-material/LocalHospital';
import BedIcon from '@mui/icons-material/Hotel';
import RevenueIcon from '@mui/icons-material/CurrencyRupee';
import TrendUpIcon from '@mui/icons-material/TrendingUp';
import TrendDownIcon from '@mui/icons-material/TrendingDown';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArticleIcon from '@mui/icons-material/Article';
import DescIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import NotifyIcon from '@mui/icons-material/Notifications';
import LabIcon from '@mui/icons-material/Science';
import MedicalIcon from '@mui/icons-material/MedicalServices';
import CheckIcon from '@mui/icons-material/CheckCircle';
import { useAuth, api } from '../../PortalShell';
import { kpiColors } from '../../../theme';

/* ─── KPI Card Component ─── */
function KPICard({
  title,
  value,
  trend,
  trendLabel,
  icon,
  color,
}: {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  color: { bg: string; icon: string; border: string };
}) {
  const isPositive = trend && trend > 0;
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
              {title}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em' }}>
              {value}
            </Typography>
            {trend !== undefined && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.75 }}>
                {isPositive ? (
                  <TrendUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography variant="caption" color={isPositive ? 'success.main' : 'error.main'} sx={{ fontWeight: 600 }}>
                  {Math.abs(trend)}%
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {trendLabel}
                </Typography>
              </Stack>
            )}
          </Box>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: color.bg,
              color: color.icon,
              border: `1px solid ${color.border}`,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

/* ─── Quick Action Button ─── */
function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: 2,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': { bgcolor: alpha('#0F766E', 0.06), transform: 'translateY(-2px)' },
      }}
    >
      <Avatar sx={{ width: 44, height: 44, bgcolor: alpha('#0F766E', 0.08), color: '#0F766E' }}>
        {icon}
      </Avatar>
      <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'center' }}>
        {label}
      </Typography>
    </Box>
  );
}

/* ─── Upcoming Event Item ─── */
function EventItem({ month, day, title, time, color }: { month: string; day: string; title: string; time: string; color: string }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', py: 1 }}>
      <Box sx={{
        minWidth: 44,
        textAlign: 'center',
        bgcolor: alpha(color, 0.1),
        borderRadius: '8px',
        py: 0.5,
      }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: `${color} !important`, textTransform: 'uppercase', lineHeight: 1.2 }}>
          {month}
        </Typography>
        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: `${color} !important`, lineHeight: 1.2 }}>
          {day}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          {time}
        </Typography>
      </Box>
    </Stack>
  );
}

/* ─── Dashboard Page ─── */
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('dashboard')
      .then(setDashboard)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

  return (
    <Box>
      {/* ─── Greeting Banner ─── */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { md: 'center' },
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h1" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2, mb: 0.5 }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
            Here's what's happening at your Medical College &amp; Hospital today.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: { xs: 2, md: 0 }, flexWrap: 'wrap', gap: 1.5 }}>
          {/* Live Campus & OPD Status Pill */}
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              px: 2,
              py: 1,
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              bgcolor: '#10B981',
              boxShadow: '0 0 0 3px rgba(16,185,129,0.25)',
              flexShrink: 0,
            }} />
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                OPD &amp; Campus Active
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#0F766E', fontWeight: 600, lineHeight: 1.2 }}>
                AY 2026-27 • Semester II
              </Typography>
            </Box>
          </Paper>

          {/* Date & Time Pill */}
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              px: 2,
              py: 1,
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <CalendarIcon sx={{ fontSize: 20, color: '#0F766E' }} />
            <Box>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                {dateStr}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.2 }}>
                {timeStr} (IST)
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Stack>

      {/* ─── Role-Specific Fast-Track Workspace Banner ─── */}
      {user?.role === 'student' && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(15,118,110,0.18)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <SchoolIcon sx={{ color: '#5EEAD4' }} />
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.15rem' }}>
                  Student Academic Workspace
                </Typography>
                <Chip label="MBBS Phase II" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 700 }} />
              </Stack>
              <Typography sx={{ fontSize: '0.85rem', color: '#CCFBF1', maxWidth: 640 }}>
                Manage your clinical CBME logbook, semester attendance, university examinations, hostel room allotment, and published result cards.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => router.push('/portal/student')}
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#0F766E',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  px: 2,
                  '&:hover': { bgcolor: '#F0FDFA' },
                }}
              >
                Open Full Student Portal →
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/portal/attendance')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                My Attendance
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/portal/results')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Exam Results
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {(user?.role === 'faculty' || user?.role === 'doctor') && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(15,23,42,0.18)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <HospitalIcon sx={{ color: '#38BDF8' }} />
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.15rem' }}>
                  Doctor &amp; Clinical Consultant Console
                </Typography>
                <Chip label={user?.department || 'Clinical Services'} size="small" sx={{ bgcolor: 'rgba(56,189,248,0.2)', color: '#38BDF8', fontWeight: 700 }} />
              </Stack>
              <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: 640 }}>
                Access live OPD triage tokens, inpatient rounds, digital prescriptions, and student intern competency sign-offs.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => router.push('/portal/doctor')}
                sx={{
                  bgcolor: '#0F766E',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  px: 2,
                  '&:hover': { bgcolor: '#0D6760' },
                }}
              >
                Launch Doctor Console →
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/portal/opd')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.06)' },
                }}
              >
                OPD Queue
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/portal/internship')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.06)' },
                }}
              >
                Intern Logbooks
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* ─── KPI Row ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <KPICard
            title="Total Students"
            value={dashboard?.students?.toLocaleString() || '—'}
            trend={12}
            trendLabel="from last semester"
            icon={<PeopleIcon fontSize="small" />}
            color={kpiColors.teal}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <KPICard
            title="Total Faculty"
            value={dashboard?.sessions?.toString() || '—'}
            trend={5}
            trendLabel="from last month"
            icon={<SchoolIcon fontSize="small" />}
            color={kpiColors.blue}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <KPICard
            title="OPD Patients (Today)"
            value="—"
            trend={18}
            trendLabel="from yesterday"
            icon={<HospitalIcon fontSize="small" />}
            color={kpiColors.green}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <KPICard
            title="IPD Patients"
            value="—"
            trend={7}
            trendLabel="from last year"
            icon={<BedIcon fontSize="small" />}
            color={kpiColors.purple}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <KPICard
            title="Revenue (This Month)"
            value="—"
            trend={14}
            trendLabel="from last month"
            icon={<RevenueIcon fontSize="small" />}
            color={kpiColors.amber}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <KPICard
            title="Bed Occupancy"
            value="—"
            trend={-6}
            trendLabel="from last week"
            icon={<BedIcon fontSize="small" />}
            color={kpiColors.rose}
          />
        </Grid>
      </Grid>

      {/* ─── Middle Section ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Recent Admissions */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2.5, pt: 2.5, pb: 1.5 }}>
                <Typography variant="h4">Recent Admissions</Typography>
                <Button size="small" endIcon={<ArrowForwardIcon />} sx={{ fontSize: '0.75rem' }} onClick={() => router.push('/portal/courses')}>
                  View All
                </Button>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID / Name</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(dashboard?.notices || []).slice(0, 4).map((_: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.6875rem', bgcolor: alpha('#0F766E', 0.1), color: '#0F766E' }}>
                            {String.fromCharCode(65 + i)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Student {i + 1}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell><StatusBadge status="MBBS" tone="teal" /></TableCell>
                      <TableCell><Typography variant="body2">Anatomy</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{dateStr}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Distribution */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Department Distribution</Typography>
                <Button size="small" sx={{ fontSize: '0.75rem' }} onClick={() => router.push('/portal/patients')}>View Details</Button>
              </Stack>
              {['Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics', 'Radiology', 'Pathology'].map((dept, i) => {
                const values = [482, 421, 318, 287, 243, 198, 165];
                const maxVal = values[0];
                return (
                  <Stack key={dept} direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.2 }}>
                    <Typography variant="body2" sx={{ minWidth: 90, fontSize: '0.75rem' }}>{dept}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(values[i] / maxVal) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha('#0F766E', 0.08),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: i < 3 ? '#0F766E' : i < 5 ? '#007B80' : '#2DD4BF',
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ minWidth: 30, textAlign: 'right', fontWeight: 700 }}>
                      {values[i]}
                    </Typography>
                  </Stack>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Notifications */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Recent Notifications</Typography>
                <Button size="small" sx={{ fontSize: '0.75rem' }} onClick={() => router.push('/portal/hospital')}>View All</Button>
              </Stack>
              <Stack spacing={1.5}>
                {[
                  { icon: <PersonAddIcon sx={{ fontSize: 16 }} />, title: 'New student admission application', desc: 'Rahim Ahmed (MBBS) submitted application', time: '2m ago', color: '#0F766E' },
                  { icon: <LabIcon sx={{ fontSize: 16 }} />, title: 'Lab report ready', desc: 'Biochemistry report for ID: L-4587 is ready', time: '12m ago', color: '#2563EB' },
                  { icon: <RevenueIcon sx={{ fontSize: 16 }} />, title: 'Payment received', desc: '₹ 25,000 received from Student ID: 2021-0632', time: '28m ago', color: '#059669' },
                  { icon: <CheckIcon sx={{ fontSize: 16 }} />, title: 'Leave approval', desc: 'Dr. Farhana Akter\'s leave request approved', time: '1h ago', color: '#D97706' },
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(item.color, 0.1), color: item.color }}>
                      {item.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{item.title}</Typography>
                      <Typography variant="caption" color="text.disabled">{item.desc}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap' }}>{item.time}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── Bottom Section ─── */}
      <Grid container spacing={2}>
        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={0}>
                <Grid size={4}><QuickAction icon={<PersonAddIcon fontSize="small" />} label="Add Student" onClick={() => router.push('/portal/students/new')} /></Grid>
                <Grid size={4}><QuickAction icon={<MedicalIcon fontSize="small" />} label="Add Patient" onClick={() => router.push('/portal/patients/new')} /></Grid>
                <Grid size={4}><QuickAction icon={<DescIcon fontSize="small" />} label="Create Admission" onClick={() => router.push('/portal/hospital')} /></Grid>
                <Grid size={4}><QuickAction icon={<SchoolIcon fontSize="small" />} label="Add Faculty" onClick={() => router.push('/portal/faculty')} /></Grid>
                <Grid size={4}><QuickAction icon={<ArticleIcon fontSize="small" />} label="Generate Report" onClick={() => router.push('/portal/reports')} /></Grid>
                <Grid size={4}><QuickAction icon={<SendIcon fontSize="small" />} label="Send Notice" onClick={() => router.push('/portal/cms')} /></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h4">Upcoming Events</Typography>
                <Button size="small" sx={{ fontSize: '0.75rem' }} onClick={() => router.push('/portal/hospital')}>View All</Button>
              </Stack>
              <Stack divider={<Divider />}>
                <EventItem month="APR" day="30" title="MBBS Final Year Practical Exam" time="09:00 AM - 02:00 PM | Anatomy Lab" color="#E11D48" />
                <EventItem month="MAY" day="02" title="Department Meeting" time="11:00 AM - 12:00 PM | Conference Room" color="#2563EB" />
                <EventItem month="MAY" day="05" title="Hostel Fee Deadline" time="Full Payment Required" color="#D97706" />
                <EventItem month="MAY" day="08" title="Research Seminar" time="10:00 AM - 12:00 PM | Auditorium" color="#059669" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* System Overview */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>System Overview</Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Academic', icon: <SchoolIcon />, status: 'Active', color: '#059669', href: '/portal/courses' },
                  { label: 'Hospital', icon: <HospitalIcon />, status: 'Active', color: '#059669', href: '/portal/hospital' },
                  { label: 'Administration', icon: <PeopleIcon />, status: 'Active', color: '#059669', href: '/portal/hr' },
                  { label: 'Finance', icon: <RevenueIcon />, status: 'Active', color: '#059669', href: '/portal/finance' },
                ].map((mod) => (
                  <Grid size={6} key={mod.label}>
                    <Box 
                      onClick={() => router.push(mod.href)}
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        cursor: 'pointer',
                        borderRadius: '10px',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#0F766E', 0.02) },
                    }}>
                      <Avatar sx={{
                        mx: 'auto',
                        mb: 1,
                        width: 40,
                        height: 40,
                        bgcolor: alpha(mod.color, 0.1),
                        color: mod.color,
                      }}>
                        {mod.icon}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{mod.label}</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <StatusBadge status={mod.status} />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
