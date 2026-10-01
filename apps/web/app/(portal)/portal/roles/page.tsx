'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { MedoraDataGridPagination } from '../../../Pagination';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

interface RoleItem {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  status: 'Active' | 'Inactive';
  permissions: string[];
}

const initialRoles: RoleItem[] = [
  { id: '1', name: 'Super Admin', description: 'Full system access and control', usersCount: 2, status: 'Active', permissions: ['all'] },
  { id: '2', name: 'College Admin', description: 'College management and settings', usersCount: 5, status: 'Active', permissions: ['manage_college', 'users', 'billing'] },
  { id: '3', name: 'Principal', description: 'Overall academic and administrative head', usersCount: 1, status: 'Active', permissions: ['academic_admin', 'approvals', 'reports'] },
  { id: '4', name: 'Dean', description: 'Academic affairs and departments', usersCount: 2, status: 'Active', permissions: ['academic_view', 'faculty_manage', 'curriculum'] },
  { id: '5', name: 'HOD', description: 'Department head and management', usersCount: 8, status: 'Active', permissions: ['dept_admin', 'timetable', 'attendance_approval'] },
  { id: '6', name: 'Faculty', description: 'Teaching and academic activities', usersCount: 48, status: 'Active', permissions: ['grading', 'attendance', 'assignments'] },
  { id: '7', name: 'Doctor', description: 'Patient care and clinical services', usersCount: 32, status: 'Active', permissions: ['opd', 'ipd', 'prescriptions'] },
  { id: '8', name: 'Nurse', description: 'Patient care and nursing services', usersCount: 24, status: 'Active', permissions: ['vitals', 'ward_care', 'rounds'] },
  { id: '9', name: 'Lab Technician', description: 'Laboratory and diagnostic services', usersCount: 12, status: 'Active', permissions: ['lab_tests', 'reports'] },
  { id: '10', name: 'Pharmacist', description: 'Pharmacy and medication management', usersCount: 8, status: 'Active', permissions: ['dispensary', 'inventory'] },
  { id: '11', name: 'Accountant', description: 'Finance and accounts management', usersCount: 6, status: 'Active', permissions: ['fee_collection', 'invoices', 'payroll'] },
  { id: '12', name: 'HR Manager', description: 'Human resources and payroll', usersCount: 4, status: 'Active', permissions: ['staff_records', 'leaves'] },
  { id: '13', name: 'Librarian', description: 'Library management', usersCount: 3, status: 'Active', permissions: ['books_catalog', 'issue_return'] },
  { id: '14', name: 'Student', description: 'Academic learning and activities', usersCount: 1248, status: 'Active', permissions: ['view_grades', 'submit_assignments', 'fees'] },
  { id: '15', name: 'Patient', description: 'Patient registration and services', usersCount: 2846, status: 'Active', permissions: ['portal_access', 'view_reports'] },
];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<RoleItem[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRoles = filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalUsers = roles.reduce((acc, r) => acc + r.usersCount, 0);

  const handleAddRole = () => {
    if (!newRoleName) return;
    const newRole: RoleItem = {
      id: Date.now().toString(),
      name: newRoleName,
      description: newRoleDesc || 'Custom institution role',
      usersCount: 0,
      status: 'Active',
      permissions: ['basic_view'],
    };
    setRoles([...roles, newRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setOpenAddDialog(false);
  };

  return (
    <Box>
      {/* ─── Breadcrumbs & Header ─── */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 1 }}>
          <Link underline="hover" color="inherit" href="/portal/dashboard">
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            Roles &amp; Permissions
          </Typography>
        </Breadcrumbs>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
          <Box>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2, mb: 0.5 }}>
              System Roles &amp; Permissions
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Manage access privileges, role hierarchy and user assignments for your institution
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              bgcolor: '#0F766E',
              fontWeight: 700,
              fontSize: '0.875rem',
              borderRadius: '9px',
              textTransform: 'none',
              px: 2.5,
              py: 1,
              boxShadow: '0 2px 8px rgba(15,118,110,0.2)',
              '&:hover': { bgcolor: '#0D6861' },
            }}
          >
            Add Role
          </Button>
        </Stack>
      </Box>

      {/* ─── KPI Cards Row ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(15,118,110,0.1)', color: '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Roles</Typography>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>{roles.length}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <VerifiedUserIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Active Roles</Typography>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>{roles.filter(r => r.status === 'Active').length}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PeopleIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Assigned Users</Typography>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>{totalUsers.toLocaleString()}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Admin Tier Roles</Typography>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>5</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* ─── Role Workspaces Quick Access ─── */}
      <Card
        sx={{
          mb: 3.5,
          p: 2.5,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #F0FDFA 0%, #FFFFFF 100%)',
          border: '1px solid #99F6E4',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Specialized Role Workspaces &amp; Consoles
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Switch seamlessly into dedicated workflows customized for students, faculty clinicians, and web administrators.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid #CBD5E1',
                bgcolor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Box>
                <Chip label="STUDENT WORKSPACE" size="small" sx={{ bgcolor: '#E0E7FF', color: '#4338CA', fontWeight: 800, mb: 1, fontSize: '0.65rem' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Student Portal
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                  CBME logbook, theory attendance, clinical ward rotations &amp; fee ledger.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                href="/portal/student"
                sx={{ mt: 2, bgcolor: '#0F766E', color: '#FFFFFF !important', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#115E59' } }}
              >
                Launch Student Portal →
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid #CBD5E1',
                bgcolor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Box>
                <Chip label="CLINICIAN WORKSPACE" size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 800, mb: 1, fontSize: '0.65rem' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Doctor Console
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                  OPD triage queue, ICD-10 diagnostic smart Rx writer &amp; IPD rounds census.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                href="/portal/doctor"
                sx={{ mt: 2, bgcolor: '#0F766E', color: '#FFFFFF !important', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#115E59' } }}
              >
                Launch Doctor Console →
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid #CBD5E1',
                bgcolor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Box>
                <Chip label="CONTENT STUDIO" size="small" sx={{ bgcolor: '#FAF5FF', color: '#7C3AED', fontWeight: 800, mb: 1, fontSize: '0.65rem' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  CMS Studio
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                  Dynamic homepage banner builder, syllabus nodes &amp; NMC disclosures.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                href="/portal/cms"
                sx={{ mt: 2, bgcolor: '#0F766E', color: '#FFFFFF !important', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#115E59' } }}
              >
                Launch CMS Studio →
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid #CBD5E1',
                bgcolor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Box>
                <Chip label="EXECUTIVE SUITE" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 800, mb: 1, fontSize: '0.65rem' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                  Institutional KPIs, hospital census, finance collections &amp; audit trails.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                href="/portal/dashboard"
                sx={{ mt: 2, bgcolor: '#0F766E', color: '#FFFFFF !important', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#115E59' } }}
              >
                Launch Dashboard →
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Card>

      {/* ─── Search & Roles Table Card ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search roles or descriptions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '10px', fontSize: '0.875rem', maxWidth: 420 },
              },
            }}
          />
        </Box>

        <DataGrid
          rows={filteredRoles}
          columns={[
            {
              field: 'name',
              headerName: 'Role Name',
              flex: 1,
              minWidth: 200,
              renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', height: '100%' }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: params.value === 'Super Admin' ? '#FEF3C7' : '#E0F2FE',
                    color: params.value === 'Super Admin' ? '#B45309' : '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <ShieldOutlinedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                    {params.value}
                  </Typography>
                </Stack>
              ),
            },
            {
              field: 'description',
              headerName: 'Description',
              flex: 2,
              minWidth: 300,
              renderCell: (params: GridRenderCellParams) => (
                <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>
                  {params.value}
                </Typography>
              ),
            },
            {
              field: 'usersCount',
              headerName: 'Users',
              width: 100,
              align: 'center',
              headerAlign: 'center',
              renderCell: (params: GridRenderCellParams) => (
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                  {Number(params.value).toLocaleString()}
                </Typography>
              ),
            },
            {
              field: 'status',
              headerName: 'Status',
              width: 120,
              renderCell: (params: GridRenderCellParams) => (
                <Chip
                  label={params.value as string}
                  size="small"
                  sx={{
                    bgcolor: '#D1FAE5',
                    color: '#065F46',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 24,
                    borderRadius: '6px',
                  }}
                />
              ),
            },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 120,
              sortable: false,
              align: 'center',
              headerAlign: 'center',
              renderCell: () => (
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                  <Tooltip title="Edit Permissions">
                    <IconButton size="small" sx={{ color: '#64748B', '&:hover': { color: '#0F766E', bgcolor: '#F0FDFA' } }}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More options">
                    <IconButton size="small" sx={{ color: '#94A3B8' }}>
                      <MoreVertIcon fontSize="small" />
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
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#F8FAFC' },
          }}
        />
      </Card>

      {/* ─── Add Role Dialog ─── */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
        <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
          Add New System Role
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Role Name"
              placeholder="e.g. Chief Medical Officer"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              placeholder="Describe the duties and scope of this role..."
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setOpenAddDialog(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddRole}
            sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#0D6861' } }}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
