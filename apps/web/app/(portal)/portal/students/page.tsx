'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { alpha } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth, api } from '../../PortalShell';
import { kpiColors } from '../../../theme';
import { MedoraDataGridPagination } from '../../../Pagination';

type Student = {
  id: string;
  number: string;
  name: string;
  email: string;
  programme: string;
  batch: string;
  department: string;
  year?: string;
  phone?: string;
  status: string;
};

/* ─── Mock Fallback Records matching Mockup 2 ─── */
const demoStudents: Student[] = [
  { id: '1', number: 'MC0001', name: 'Rahim Ahmed', email: 'rahim.ahmed@mc.edu', programme: 'MBBS', department: 'Medicine', year: '1st Year', batch: '2024-25', status: 'Active', phone: '+880 1712 345678' },
  { id: '2', number: 'MC0002', name: 'Sadia Islam', email: 'sadia.islam@mc.edu', programme: 'MBBS', department: 'Surgery', year: '1st Year', batch: '2024-25', status: 'Active', phone: '+880 1712 345679' },
  { id: '3', number: 'MC0003', name: 'Tanvir Hasan', email: 'tanvir.hasan@mc.edu', programme: 'MBBS', department: 'Pediatrics', year: '2nd Year', batch: '2023-24', status: 'Active', phone: '+880 1812 345670' },
  { id: '4', number: 'MC0004', name: 'Nusrat Jahan', email: 'nusrat.jahan@mc.edu', programme: 'BDS', department: 'Dental', year: '1st Year', batch: '2024-25', status: 'Active', phone: '+880 1612 345671' },
  { id: '5', number: 'MC0005', name: 'Fahim Ahmed', email: 'fahim.ahmed@mc.edu', programme: 'MD', department: 'Medicine', year: '3rd Year', batch: '2022-23', status: 'Active', phone: '+880 1912 345672' },
  { id: '6', number: 'MC0006', name: 'Ayesha Akter', email: 'ayesha.akter@mc.edu', programme: 'MBBS', department: 'Gynecology', year: '2nd Year', batch: '2023-24', status: 'Active', phone: '+880 1712 345673' },
  { id: '7', number: 'MC0007', name: 'Shakib Khan', email: 'shakib.khan@mc.edu', programme: 'MS', department: 'Orthopedics', year: '2nd Year', batch: '2023-24', status: 'Active', phone: '+880 1812 345674' },
  { id: '8', number: 'MC0008', name: 'Farzana Rahman', email: 'farzana.rahman@mc.edu', programme: 'BSc Nursing', department: 'Nursing', year: '1st Year', batch: '2024-25', status: 'Active', phone: '+880 1612 345675' },
  { id: '9', number: 'MC0009', name: 'Imran Hossain', email: 'imran.hossain@mc.edu', programme: 'Pharmacy', department: 'Pharmacy', year: '1st Year', batch: '2024-25', status: 'Active', phone: '+880 1912 345676' },
  { id: '10', number: 'MC0010', name: 'Rifat Chowdhury', email: 'rifat.chowdhury@mc.edu', programme: 'MBBS', department: 'Community Medicine', year: '2nd Year', batch: '2023-24', status: 'On Leave', phone: '+880 1712 345677' },
];

function ProgrammeBadge({ programme }: { programme: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    MBBS: { bg: '#CCFBF1', text: '#0F766E' },
    MD: { bg: '#FFEDD5', text: '#C2410C' },
    MS: { bg: '#DBEAFE', text: '#1D4ED8' },
    BDS: { bg: '#E0E7FF', text: '#4338CA' },
    'BSc Nursing': { bg: '#FCE7F3', text: '#BE185D' },
    Pharmacy: { bg: '#F3E8FF', text: '#7E22CE' },
  };
  const config = colorMap[programme] || { bg: '#F1F5F9', text: '#475569' };
  return (
    <Chip
      label={programme}
      size="small"
      sx={{
        bgcolor: config.bg,
        color: config.text,
        fontWeight: 700,
        fontSize: '0.6875rem',
        height: 22,
        borderRadius: '5px',
      }}
    />
  );
}

function StatusChip({ status }: { status: string }) {
  const isLeave = status.toLowerCase().includes('leave');
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: isLeave ? '#FEF3C7' : '#D1FAE5',
        color: isLeave ? '#B45309' : '#065F46',
        fontWeight: 700,
        fontSize: '0.72rem',
        height: 22,
        borderRadius: '5px',
      }}
    />
  );
}

function StudentKPI({
  title,
  value,
  trend,
  trendLabel,
  icon,
  color,
}: {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  color: { bg: string; icon: string; border: string };
}) {
  return (
    <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF', height: '100%' }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
        <Box sx={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          bgcolor: color.bg,
          color: color.icon,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{title}</Typography>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#0F172A', lineHeight: 1.1 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        {trend >= 0 ? (
          <TrendingUpIcon sx={{ fontSize: 14, color: '#059669' }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 14, color: '#DC2626' }} />
        )}
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: trend >= 0 ? '#059669' : '#DC2626' }}>
          {trend >= 0 ? `+${trend}%` : `${trend}%`}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>{trendLabel}</Typography>
      </Stack>
    </Card>
  );
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page + 1));
    params.set('limit', String(rowsPerPage));
    if (search) params.set('q', search);
    if (statusFilter !== 'ALL') params.set('status', statusFilter);

    api(`students?${params}`)
      .then((data) => {
        if (data.items) {
          setStudents(data.items);
          setTotal(data.total || data.items.length);
        } else {
          setStudents([]);
          setTotal(0);
        }
      })
      .catch(() => {
        setStudents([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, search, statusFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds({
        type: 'include',
        ids: new Set(students.map((s) => s.id)),
      });
    } else {
      setSelectedIds({
        type: 'include',
        ids: new Set(),
      });
    }
  };

  const handleSelectOne = (id: string) => {
    const nextIds = new Set(selectedIds.ids);
    if (nextIds.has(id)) {
      nextIds.delete(id);
    } else {
      nextIds.add(id);
    }
    setSelectedIds({
      type: 'include',
      ids: nextIds,
    });
  };

  const filteredStudents = students.filter((s) => {
    if (courseFilter !== 'ALL' && s.programme !== courseFilter) return false;
    if (deptFilter !== 'ALL' && s.department !== deptFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.number.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Uniform height for filter controls
  const CONTROL_HEIGHT = 40;

  return (
    <Box>
      {/* ─── Breadcrumbs & Header Banner (Matching Mockup 2) ─── */}
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, mb: 3 }}>
        <Box>
          <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 0.5 }}>
            <Link underline="hover" color="inherit" href="/portal/dashboard">
              Academic
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Students
            </Typography>
          </Breadcrumbs>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2, mb: 0.5 }}>
            Student Management
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
            Manage student records, admissions, academic details and more.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: { xs: 2, md: 0 }, flexWrap: 'wrap', gap: 1.5 }}>
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
                Admissions Active
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#0F766E', fontWeight: 600, lineHeight: 1.2 }}>
                Batch 2026-27 Open
              </Typography>
            </Box>
          </Paper>

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
            <CalendarMonthIcon sx={{ fontSize: 20, color: '#0F766E' }} />
            <Box>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                {dateStr}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.2 }}>
                {timeStr}
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Stack>

      {/* ─── 5 KPI Metric Cards (Matching Mockup 2 Top Grid) ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StudentKPI title="Total Students" value="2,847" trend={12} trendLabel="from last semester" icon={<PeopleIcon sx={{ fontSize: 20 }} />} color={{ bg: '#F0FDFA', icon: '#0F766E', border: '#CCFBF1' }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StudentKPI title="New Admissions" value="248" trend={18} trendLabel="from last month" icon={<PersonAddIcon sx={{ fontSize: 20 }} />} color={{ bg: '#ECFDF5', icon: '#059669', border: '#A7F3D0' }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StudentKPI title="Active Students" value="2,603" trend={8} trendLabel="from last semester" icon={<CheckCircleIcon sx={{ fontSize: 20 }} />} color={{ bg: '#EFF6FF', icon: '#0284C7', border: '#BFDBFE' }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StudentKPI title="Graduated" value="196" trend={5} trendLabel="from last year" icon={<SchoolIcon sx={{ fontSize: 20 }} />} color={{ bg: '#FAF5FF', icon: '#7C3AED', border: '#E9D5FF' }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StudentKPI title="On Leave" value="48" trend={2} trendLabel="from last week" icon={<EventBusyIcon sx={{ fontSize: 20 }} />} color={{ bg: '#FFFBEB', icon: '#D97706', border: '#FDE68A' }} />
        </Grid>
      </Grid>

      {/* ─── Main Two-Column Layout ─── */}
      <Grid container spacing={2.5}>
        {/* Left 9-column: Filter Bar + Table + Pagination */}
        <Grid size={{ xs: 12, lg: 8.8 }}>
          {/* ─── Unified Filter Bar (Exact Same Height = 40px, Matching Mockup 2) ─── */}
          <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, mb: 2, bgcolor: '#FFFFFF' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} sx={{ alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
              {/* Search & Select Filters */}
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                {/* Search Input Box */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  px: 1.5,
                  height: CONTROL_HEIGHT,
                  width: { xs: '100%', sm: 190 },
                  boxSizing: 'border-box',
                  transition: 'all 0.15s',
                  '&:focus-within': { borderColor: '#0F766E', boxShadow: '0 0 0 2px rgba(15,118,110,0.15)' },
                }}>
                  <SearchIcon sx={{ color: '#94A3B8', fontSize: 18, mr: 0.8, flexShrink: 0 }} />
                  <InputBase
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    sx={{ fontSize: '0.8125rem', color: '#1E293B', width: '100%' }}
                  />
                </Box>

                {/* Course Select */}
                <Select
                  value={courseFilter}
                  onChange={(e) => { setCourseFilter(e.target.value); setPage(0); }}
                  size="small"
                  sx={{
                    height: CONTROL_HEIGHT,
                    minWidth: 125,
                    fontSize: '0.8125rem',
                    borderRadius: '8px',
                    bgcolor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' },
                  }}
                >
                  <MenuItem value="ALL" sx={{ fontSize: '0.8125rem' }}>All Courses</MenuItem>
                  <MenuItem value="MBBS" sx={{ fontSize: '0.8125rem' }}>MBBS</MenuItem>
                  <MenuItem value="MD" sx={{ fontSize: '0.8125rem' }}>MD / MS</MenuItem>
                  <MenuItem value="BDS" sx={{ fontSize: '0.8125rem' }}>BDS</MenuItem>
                  <MenuItem value="BSc Nursing" sx={{ fontSize: '0.8125rem' }}>BSc Nursing</MenuItem>
                  <MenuItem value="Pharmacy" sx={{ fontSize: '0.8125rem' }}>Pharmacy</MenuItem>
                </Select>

                {/* Department Select */}
                <Select
                  value={deptFilter}
                  onChange={(e) => { setDeptFilter(e.target.value); setPage(0); }}
                  size="small"
                  sx={{
                    height: CONTROL_HEIGHT,
                    minWidth: 140,
                    fontSize: '0.8125rem',
                    borderRadius: '8px',
                    bgcolor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' },
                  }}
                >
                  <MenuItem value="ALL" sx={{ fontSize: '0.8125rem' }}>All Departments</MenuItem>
                  <MenuItem value="Medicine" sx={{ fontSize: '0.8125rem' }}>Medicine</MenuItem>
                  <MenuItem value="Surgery" sx={{ fontSize: '0.8125rem' }}>Surgery</MenuItem>
                  <MenuItem value="Pediatrics" sx={{ fontSize: '0.8125rem' }}>Pediatrics</MenuItem>
                  <MenuItem value="Dental" sx={{ fontSize: '0.8125rem' }}>Dental</MenuItem>
                  <MenuItem value="Gynecology" sx={{ fontSize: '0.8125rem' }}>Gynecology</MenuItem>
                  <MenuItem value="Orthopedics" sx={{ fontSize: '0.8125rem' }}>Orthopedics</MenuItem>
                </Select>

                {/* Status Select */}
                <Select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                  size="small"
                  sx={{
                    height: CONTROL_HEIGHT,
                    minWidth: 110,
                    fontSize: '0.8125rem',
                    borderRadius: '8px',
                    bgcolor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' },
                  }}
                >
                  <MenuItem value="ALL" sx={{ fontSize: '0.8125rem' }}>Status: All</MenuItem>
                  <MenuItem value="Active" sx={{ fontSize: '0.8125rem' }}>Active</MenuItem>
                  <MenuItem value="On Leave" sx={{ fontSize: '0.8125rem' }}>On Leave</MenuItem>
                </Select>
              </Stack>

              {/* Action Buttons: Add Student & Export (Exact Same Height = 40px) */}
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/portal/students/new')}
                  sx={{
                    height: CONTROL_HEIGHT,
                    bgcolor: '#0F766E',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    borderRadius: '8px',
                    textTransform: 'none',
                    px: 2,
                    boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#0D6861' },
                  }}
                >
                  Add Student
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<FileDownloadOutlinedIcon />}
                  onClick={() => alert('Exporting student directory to CSV...')}
                  sx={{
                    height: CONTROL_HEIGHT,
                    borderColor: '#CBD5E1',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    borderRadius: '8px',
                    textTransform: 'none',
                    px: 2,
                    bgcolor: '#FFFFFF',
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#94A3B8' },
                  }}
                >
                  Export
                </Button>
              </Stack>
            </Stack>
          </Card>

          {/* ─── Students Table Card ─── */}
          <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', bgcolor: '#FFFFFF', height: 750 }}>
            <DataGrid
              rows={filteredStudents}
              rowSelectionModel={selectedIds}
              onRowSelectionModelChange={(newSelection) => {
                setSelectedIds(newSelection);
              }}
              checkboxSelection
              columns={[
                {
                  field: 'number',
                  headerName: 'Student ID',
                  width: 130,
                  renderCell: (params: GridRenderCellParams) => (
                    <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center', height: '100%' }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#0F766E', fontWeight: 700 }}>
                        {params.row.name.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F766E' }}>
                        {params.value}
                      </Typography>
                    </Stack>
                  ),
                },
                {
                  field: 'name',
                  headerName: 'Name',
                  flex: 1,
                  minWidth: 180,
                  renderCell: (params: GridRenderCellParams) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A', lineHeight: 1.2 }}>
                        {params.value}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {params.row.email}
                      </Typography>
                    </Box>
                  ),
                },
                {
                  field: 'programme',
                  headerName: 'Course',
                  width: 120,
                  renderCell: (params: GridRenderCellParams) => (
                    <ProgrammeBadge programme={params.value as string} />
                  ),
                },
                {
                  field: 'department',
                  headerName: 'Department',
                  width: 160,
                  renderCell: (params: GridRenderCellParams) => (
                    <Typography sx={{ fontSize: '0.8125rem', color: '#334155' }}>
                      {params.value}
                    </Typography>
                  ),
                },
                {
                  field: 'year',
                  headerName: 'Year',
                  width: 110,
                  renderCell: (params: GridRenderCellParams) => (
                    <Typography sx={{ fontSize: '0.8125rem', color: '#475569' }}>
                      {params.value || '1st Year'}
                    </Typography>
                  ),
                },
                {
                  field: 'batch',
                  headerName: 'Batch',
                  width: 120,
                  renderCell: (params: GridRenderCellParams) => (
                    <Typography sx={{ fontSize: '0.8125rem', color: '#475569' }}>
                      {params.value}
                    </Typography>
                  ),
                },
                {
                  field: 'status',
                  headerName: 'Status',
                  width: 110,
                  renderCell: (params: GridRenderCellParams) => (
                    <StatusChip status={params.value as string} />
                  ),
                },
                {
                  field: 'phone',
                  headerName: 'Phone',
                  width: 140,
                  renderCell: (params: GridRenderCellParams) => (
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {params.value || '+880 1712 345678'}
                    </Typography>
                  ),
                },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 130,
                  sortable: false,
                  align: 'center',
                  headerAlign: 'center',
                  renderCell: (params: GridRenderCellParams) => (
                    <Stack direction="row" spacing={0.3} sx={{ justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                      <Tooltip title="View Profile">
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/portal/students/${params.row.id}`)}
                          sx={{ color: '#64748B', '&:hover': { color: '#0F766E', bgcolor: '#F0FDFA' } }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Student">
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/portal/students/${params.row.id}`)}
                          sx={{ color: '#64748B', '&:hover': { color: '#0F766E', bgcolor: '#F0FDFA' } }}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More options">
                        <IconButton size="small" sx={{ color: '#94A3B8' }}>
                          <MoreVertIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ),
                },
              ]}
              slots={{
                pagination: MedoraDataGridPagination,
              }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{
                border: 0,
                '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' },
                '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center' },
                '& .MuiDataGrid-row:hover': { bgcolor: '#F8FAFC' },
              }}
            />
          </Card>
        </Grid>

        {/* Right 3.2-column: Donut Chart, Quick Actions, Upcoming Events (Matching Mockup 2) */}
        <Grid size={{ xs: 12, lg: 3.2 }}>
          <Stack spacing={2}>
            {/* Students by Course Donut Widget */}
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2.5, bgcolor: '#FFFFFF' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>
                  Students by Course
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700, cursor: 'pointer' }}>
                  View All
                </Typography>
              </Stack>

              {/* Donut Simulation Graphic */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', my: 2.5 }}>
                <Box sx={{
                  position: 'relative',
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: 'conic-gradient(#0F766E 0% 74%, #F59E0B 74% 88%, #6366F1 88% 95%, #EC4899 95% 98%, #94A3B8 98% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(15,118,110,0.12)',
                }}>
                  {/* Callout slice badges for clear visibility */}
                  <Chip
                    size="small"
                    label="MBBS 74%"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: -10,
                      bgcolor: '#0F766E',
                      color: '#FFFFFF !important',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      height: 20,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  />
                  <Chip
                    size="small"
                    label="MD/MS 14%"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: -12,
                      bgcolor: '#F59E0B',
                      color: '#FFFFFF !important',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      height: 20,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  />
                  <Box sx={{
                    width: 104,
                    height: 104,
                    borderRadius: '50%',
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)',
                    p: 1,
                  }}>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#0F172A', lineHeight: 1.1 }}>
                      2,847
                    </Typography>
                    <Typography sx={{ fontSize: '0.6875rem', color: '#475569', fontWeight: 700, mt: 0.3, whiteSpace: 'nowrap' }}>
                      Total Students
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Course Breakdown Legend */}
              <Stack spacing={1} sx={{ mt: 2 }}>
                {[
                  { course: 'MBBS', count: '2,112', pct: '74%', color: '#0F766E' },
                  { course: 'MD/MS', count: '412', pct: '14%', color: '#F59E0B' },
                  { course: 'BDS', count: '187', pct: '7%', color: '#6366F1' },
                  { course: 'Nursing', count: '96', pct: '3%', color: '#EC4899' },
                  { course: 'Others', count: '40', pct: '2%', color: '#94A3B8' },
                ].map((item, idx) => (
                  <Stack key={idx} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 600, color: '#334155' }}>{item.course}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 700, color: '#0F172A' }}>
                      {item.count} <Box component="span" sx={{ color: '#64748B', fontWeight: 400 }}>({item.pct})</Box>
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>

            {/* Quick Actions (Matching Mockup 2) */}
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2.5, bgcolor: '#FFFFFF' }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A', mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.2}>
                {[
                  { title: 'Add New Student', sub: 'Register a new student', icon: <PersonAddIcon sx={{ color: '#0F766E', fontSize: 18 }} />, href: '/portal/students/new' },
                  { title: 'Bulk Import', sub: 'Import student data from CSV', icon: <UploadFileIcon sx={{ color: '#0284C7', fontSize: 18 }} />, href: '/portal/students/new' },
                  { title: 'Student ID Cards', sub: 'Generate student ID cards', icon: <BadgeIcon sx={{ color: '#7C3AED', fontSize: 18 }} />, href: '/portal/students/MC0001' },
                  { title: 'Admission Process', sub: 'Manage admission workflow', icon: <AssignmentIndIcon sx={{ color: '#059669', fontSize: 18 }} />, href: '/portal/students/new' },
                ].map((act, idx) => (
                  <Paper
                    key={idx}
                    onClick={() => router.push(act.href)}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: '8px',
                      border: '1px solid #F1F5F9',
                      bgcolor: '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: '#0F766E', bgcolor: '#F0FDFA', transform: 'translateX(2px)' },
                    }}
                  >
                    <Box sx={{ width: 32, height: 32, borderRadius: '6px', bgcolor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                      {act.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A' }}>
                        {act.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6875rem', color: '#64748B' }}>
                        {act.sub}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Card>

            {/* Upcoming Events (Matching Mockup 2) */}
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2.5, bgcolor: '#FFFFFF' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>
                  Upcoming Events
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700, cursor: 'pointer' }}>
                  View All
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {[
                  { day: '30', month: 'APR', title: 'MBBS Final Year Practical Exam', sub: '09:00 AM – 02:00 PM | Anatomy Lab', bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' },
                  { day: '02', month: 'MAY', title: 'Department Meeting', sub: '11:00 AM – 12:00 PM | Conference Room', bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
                  { day: '05', month: 'MAY', title: 'Hostel Fee Deadline', sub: 'Full Payment Required', bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
                  { day: '08', month: 'MAY', title: 'Research Seminar', sub: '10:00 AM – 12:00 PM | Auditorium', bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
                ].map((ev, idx) => (
                  <Stack key={idx} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Box sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '10px',
                      bgcolor: ev.bg,
                      border: `1px solid ${ev.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: `${ev.text} !important`, lineHeight: 1 }}>
                        {ev.day}
                      </Typography>
                      <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: `${ev.text} !important`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {ev.month}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A', lineHeight: 1.2 }}>
                        {ev.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6875rem', color: '#64748B' }}>
                        {ev.sub}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
