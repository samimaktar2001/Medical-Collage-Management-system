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
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../ConfirmDialog';

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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import CloseIcon from '@mui/icons-material/Close';

interface RoleItem {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  status: 'Active' | 'Inactive';
  permissions: string[];
}

interface PermissionGroup {
  category: string;
  permissions: { id: string; label: string; desc: string }[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'Academic & Curriculum',
    permissions: [
      { id: 'academic_admin', label: 'Academic Administration', desc: 'Oversee departments, syllabus and academic councils' },
      { id: 'curriculum', label: 'CBME Curriculum & Syllabi', desc: 'Design, review and update competency nodes' },
      { id: 'grading', label: 'Examinations & Marks Ledger', desc: 'Enter student exam marks and approve grade cards' },
      { id: 'attendance', label: 'Attendance Tracking & Roster', desc: 'Record theory lecture & clinical ward attendance' },
      { id: 'timetable', label: 'Lecture Timetables', desc: 'Publish class schedules and clinical rotation rosters' },
      { id: 'view_grades', label: 'Student Grade & Fee Access', desc: 'View student performance dossiers and fee ledgers' },
    ],
  },
  {
    category: 'Clinical & Hospital Care',
    permissions: [
      { id: 'opd', label: 'OPD Clinical Queue', desc: 'Consult outpatients, write Rx and trigger diagnostics' },
      { id: 'ipd', label: 'IPD Ward & Bed Census', desc: 'Admit inpatients, monitor bed census and chart rounds' },
      { id: 'prescriptions', label: 'Digital Prescriptions', desc: 'Issue digitally signed e-prescriptions with interaction check' },
      { id: 'vitals', label: 'Nursing Vitals & Charting', desc: 'Record BP, SpO2, blood glucose and nursing care logs' },
      { id: 'lab_tests', label: 'Laboratory Diagnostics', desc: 'Access analyzer samples and approve lab reports' },
      { id: 'dispensary', label: 'Pharmacy Formulary & Dispense', desc: 'Dispense prescribed drugs and verify stock ledger' },
    ],
  },
  {
    category: 'Administration & Finance',
    permissions: [
      { id: 'manage_college', label: 'Institution & NMC Settings', desc: 'Configure college profile, affiliations and approvals' },
      { id: 'users', label: 'User Directory & Access', desc: 'Manage doctor, student, nurse and staff credentials' },
      { id: 'billing', label: 'Hospital Billing & Insurance', desc: 'Generate cashless insurance claims and OPD/IPD invoices' },
      { id: 'fee_collection', label: 'Student Fee Counter', desc: 'Collect tuition fees and print official receipts' },
      { id: 'staff_records', label: 'HR Faculty Service Books', desc: 'Maintain employee service registers and leaves' },
      { id: 'inventory', label: 'Biomedical & Central Store', desc: 'Manage assets, AMC calibration and purchase orders' },
    ],
  },
  {
    category: 'Governance & Security',
    permissions: [
      { id: 'all', label: 'Full System Root Access (Wildcard)', desc: 'Super administrator override across all hospital domains' },
      { id: 'approvals', label: 'Principal Executive Approvals', desc: 'Approve requisitions, audit filings and appointments' },
      { id: 'reports', label: 'Statutory & NMC Analytics', desc: 'Export accreditation and statutory compliance reports' },
      { id: 'portal_access', label: 'Patient & Public Portal Access', desc: 'Access self-service appointments and medical records' },
    ],
  },
];

const initialRoles: RoleItem[] = [
  { id: '1', name: 'Super Admin', description: 'Full system access and control', usersCount: 2, status: 'Active', permissions: ['all'] },
  { id: '2', name: 'College Admin', description: 'College management and settings', usersCount: 5, status: 'Active', permissions: ['manage_college', 'users', 'billing'] },
  { id: '3', name: 'Principal', description: 'Overall academic and administrative head', usersCount: 1, status: 'Active', permissions: ['academic_admin', 'approvals', 'reports'] },
  { id: '4', name: 'Dean', description: 'Academic affairs and departments', usersCount: 2, status: 'Active', permissions: ['academic_admin', 'users', 'curriculum'] },
  { id: '5', name: 'HOD', description: 'Department head and management', usersCount: 8, status: 'Active', permissions: ['academic_admin', 'timetable', 'attendance'] },
  { id: '6', name: 'Faculty', description: 'Teaching and academic activities', usersCount: 48, status: 'Active', permissions: ['grading', 'attendance', 'curriculum'] },
  { id: '7', name: 'Doctor', description: 'Patient care and clinical services', usersCount: 32, status: 'Active', permissions: ['opd', 'ipd', 'prescriptions'] },
  { id: '8', name: 'Nurse', description: 'Patient care and nursing services', usersCount: 24, status: 'Active', permissions: ['vitals', 'ipd'] },
  { id: '9', name: 'Lab Technician', description: 'Laboratory and diagnostic services', usersCount: 12, status: 'Active', permissions: ['lab_tests', 'reports'] },
  { id: '10', name: 'Pharmacist', description: 'Pharmacy and medication management', usersCount: 8, status: 'Active', permissions: ['dispensary', 'inventory'] },
  { id: '11', name: 'Accountant', description: 'Finance and accounts management', usersCount: 6, status: 'Active', permissions: ['fee_collection', 'billing'] },
  { id: '12', name: 'HR Manager', description: 'Human resources and payroll', usersCount: 4, status: 'Active', permissions: ['staff_records', 'users'] },
  { id: '13', name: 'Librarian', description: 'Library management', usersCount: 3, status: 'Active', permissions: ['curriculum'] },
  { id: '14', name: 'Student', description: 'Academic learning and activities', usersCount: 1248, status: 'Active', permissions: ['view_grades', 'portal_access'] },
  { id: '15', name: 'Patient', description: 'Patient registration and services', usersCount: 2846, status: 'Active', permissions: ['portal_access'] },
];

export default function RolesPermissionsPage() {
  const confirm = useConfirm();
  const [roles, setRoles] = useState<RoleItem[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Action Menu & Dialog States
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; role: RoleItem } | null>(null);
  const [viewRole, setViewRole] = useState<RoleItem | null>(null);
  const [editRole, setEditRole] = useState<RoleItem | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
    status: 'Active' | 'Inactive';
    permissions: string[];
  }>({
    name: '',
    description: '',
    status: 'Active',
    permissions: [],
  });

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = roles.reduce((acc, r) => acc + r.usersCount, 0);

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    const newRole: RoleItem = {
      id: Date.now().toString(),
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || 'Custom institution role',
      usersCount: 0,
      status: 'Active',
      permissions: ['portal_access'],
    };
    setRoles(prev => [...prev, newRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setOpenAddDialog(false);
    toast.success(`Role "${newRole.name}" created successfully.`);
  };

  const handleOpenEdit = (role: RoleItem) => {
    setEditRole(role);
    setEditForm({
      name: role.name,
      description: role.description,
      status: role.status,
      permissions: [...role.permissions],
    });
    setMenuAnchor(null);
  };

  const handleSaveEdit = () => {
    if (!editRole || !editForm.name.trim()) {
      toast.error('Role name cannot be empty');
      return;
    }
    setRoles(prev => prev.map(r => r.id === editRole.id ? {
      ...r,
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      status: editForm.status,
      permissions: editForm.permissions,
    } : r));
    toast.success(`Role "${editForm.name}" updated successfully.`);
    setEditRole(null);
  };

  const handleTogglePermission = (permId: string) => {
    setEditForm(prev => {
      const exists = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: exists ? prev.permissions.filter(p => p !== permId) : [...prev.permissions, permId],
      };
    });
  };

  const handleToggleAllCategory = (categoryPerms: { id: string }[], shouldSelect: boolean) => {
    setEditForm(prev => {
      const ids = categoryPerms.map(p => p.id);
      if (shouldSelect) {
        const set = new Set([...prev.permissions, ...ids]);
        return { ...prev, permissions: Array.from(set) };
      } else {
        return { ...prev, permissions: prev.permissions.filter(p => !ids.includes(p)) };
      }
    });
  };

  const handleToggleStatus = (role: RoleItem) => {
    const newStatus = role.status === 'Active' ? 'Inactive' : 'Active';
    setRoles(prev => prev.map(r => r.id === role.id ? { ...r, status: newStatus } : r));
    toast.success(`Role "${role.name}" set to ${newStatus}.`);
    setMenuAnchor(null);
  };

  const handleDeleteRole = async (role: RoleItem) => {
    setMenuAnchor(null);
    if (role.name === 'Super Admin') {
      toast.error('System root role "Super Admin" is protected and cannot be deleted.');
      return;
    }
    const confirmed = await confirm({
      title: 'Delete System Role',
      message: `Are you sure you want to permanently delete the role "${role.name}"? ${role.usersCount} users currently assigned to this role will need to be reallocated.`,
      confirmText: 'Delete Role',
      severity: 'error',
    });
    if (!confirmed) return;
    setRoles(prev => prev.filter(r => r.id !== role.id));
    toast.success(`Role "${role.name}" was successfully deleted.`);
  };

  return (
    <Box>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/portal/dashboard' },
          { label: 'Roles & Permissions' },
        ]}
        category="Access Control & Security"
        title="System Roles & Permissions"
        description="Manage access privileges, role hierarchy and user assignments for your institution."
        icon={<SecurityIcon />}
        actions={
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
        }
      />

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
                <Box sx={{ mb: 1 }}>
                  <StatusBadge status="Student Workspace" tone="info" />
                </Box>
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
                <Box sx={{ mb: 1 }}>
                  <StatusBadge status="Clinician Workspace" tone="warning" />
                </Box>
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
                <Box sx={{ mb: 1 }}>
                  <StatusBadge status="Content Studio" tone="purple" />
                </Box>
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
                <Box sx={{ mb: 1 }}>
                  <StatusBadge status="Executive Suite" tone="success" />
                </Box>
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <StatusBadge status={params.value as string} />
              ),
            },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 140,
              sortable: false,
              align: 'center',
              headerAlign: 'center',
              renderCell: (params: GridRenderCellParams) => {
                const role = params.row as RoleItem;
                return (
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                    <Tooltip title="View Role Dossier">
                      <IconButton
                        size="small"
                        onClick={() => setViewRole(role)}
                        sx={{ color: '#0F766E', '&:hover': { bgcolor: '#F0FDFA' } }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Permissions">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(role)}
                        sx={{ color: '#64748B', '&:hover': { color: '#0F766E', bgcolor: '#F0FDFA' } }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More options">
                      <IconButton
                        size="small"
                        onClick={(e) => setMenuAnchor({ el: e.currentTarget, role })}
                        sx={{ color: '#94A3B8', '&:hover': { color: '#0F172A', bgcolor: '#F1F5F9' } }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                );
              },
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

      {/* ─── Row Actions Menu ─── */}
      <Menu
        anchorEl={menuAnchor?.el}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              minWidth: 190,
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
              border: '1px solid #E2E8F0',
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (menuAnchor) setViewRole(menuAnchor.role);
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon sx={{ color: '#0F766E' }}>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
            View Role Dossier
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor) handleOpenEdit(menuAnchor.role);
          }}
        >
          <ListItemIcon sx={{ color: '#475569' }}>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
            Edit Permissions
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor) handleToggleStatus(menuAnchor.role);
          }}
        >
          <ListItemIcon sx={{ color: menuAnchor?.role.status === 'Active' ? '#D97706' : '#059669' }}>
            {menuAnchor?.role.status === 'Active' ? (
              <ToggleOffOutlinedIcon fontSize="small" />
            ) : (
              <ToggleOnOutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
            {menuAnchor?.role.status === 'Active' ? 'Deactivate Role' : 'Activate Role'}
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            if (menuAnchor) handleDeleteRole(menuAnchor.role);
          }}
          sx={{ color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}
        >
          <ListItemIcon sx={{ color: '#DC2626' }}>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#DC2626' }}>
            Delete Role
          </Typography>
        </MenuItem>
      </Menu>

      {/* ─── View Role Dossier Modal ─── */}
      <Dialog
        open={Boolean(viewRole)}
        onClose={() => setViewRole(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              maxWidth: '740px',
              width: '100%',
              boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {viewRole && (
          <>
            <DialogTitle
              component="div"
              sx={{
                p: 3,
                pb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#FFFFFF',
              }}
            >
              <Box>
                <Typography
                  component="span"
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '1.25rem',
                    color: '#0F172A',
                    display: 'block',
                  }}
                >
                  {viewRole.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Manrope', sans-serif", fontSize: '0.825rem', mt: 0.25 }}>
                  Security & Access Privilege Dossier · ID #{viewRole.id}
                </Typography>
              </Box>
              <StatusBadge status={viewRole.status} size="medium" />
            </DialogTitle>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogContent sx={{ p: 3, bgcolor: '#FAFAFB' }}>
              <Stack spacing={2.5}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>
                        Role Title
                      </Typography>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#0F172A', fontSize: '0.925rem' }}>
                        {viewRole.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>
                        Assigned Users
                      </Typography>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#0F766E', fontSize: '0.925rem' }}>
                        {viewRole.usersCount.toLocaleString()} Users
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', minWidth: 0, overflow: 'hidden' }}>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>
                    Role Scope & Description
                  </Typography>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: '#334155', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {viewRole.description}
                  </Typography>
                </Box>

                <Box sx={{ p: 2.5, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', minWidth: 0 }}>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1.5 }}>
                    Granted Access Privileges ({viewRole.permissions.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {viewRole.permissions.map((perm) => (
                      <Chip
                        key={perm}
                        icon={<CheckCircleIcon sx={{ fontSize: '15px !important', color: '#0F766E !important' }} />}
                        label={perm.replace(/_/g, ' ')}
                        sx={{
                          bgcolor: '#F0FDFA',
                          border: '1px solid #99F6E4',
                          color: '#0F766E',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          fontFamily: "'Manrope', sans-serif",
                          textTransform: 'capitalize',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </DialogContent>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'space-between', bgcolor: '#FFFFFF' }}>
              <Button onClick={() => setViewRole(null)} sx={{ textTransform: 'none', color: '#64748B', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={() => {
                  const r = viewRole;
                  setViewRole(null);
                  handleOpenEdit(r);
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontFamily: "'Manrope', sans-serif",
                  bgcolor: '#0F766E',
                  borderRadius: '10px',
                  px: 2.5,
                  boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
                  '&:hover': { bgcolor: '#0D6861' },
                }}
              >
                Edit Role & Permissions
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Edit Role & Permissions Modal ─── */}
      <Dialog
        open={Boolean(editRole)}
        onClose={() => setEditRole(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              maxWidth: '760px',
              width: '100%',
              boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {editRole && (
          <>
            <DialogTitle
              component="div"
              sx={{
                p: 3,
                pb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#FFFFFF',
              }}
            >
              <Box>
                <Typography
                  component="span"
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '1.25rem',
                    color: '#0F172A',
                    display: 'block',
                  }}
                >
                  Edit Role: {editRole.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Manrope', sans-serif", fontSize: '0.825rem', mt: 0.25 }}>
                  Configure role title, active status and granular system permissions
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setEditRole(null)}
                sx={{ color: '#94A3B8', '&:hover': { color: '#0F172A', bgcolor: '#F1F5F9' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogContent sx={{ p: 3, bgcolor: '#FAFAFB', maxHeight: '70vh' }}>
              <Stack spacing={3}>
                {/* Basic Info */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextField
                      fullWidth
                      label="Role Title"
                      size="small"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      size="small"
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Active' | 'Inactive' })}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description & Scope"
                      size="small"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </Grid>
                </Grid>

                {/* Granular Permissions Section */}
                <Box>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.875rem', fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    Granular Access Privileges
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
                    Select the operational capabilities allowed for users assigned to this role.
                  </Typography>

                  <Stack spacing={2.5}>
                    {PERMISSION_GROUPS.map((group) => {
                      const allSelected = group.permissions.every(p => editForm.permissions.includes(p.id));
                      const someSelected = group.permissions.some(p => editForm.permissions.includes(p.id));

                      return (
                        <Card
                          key={group.category}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: '14px',
                            border: '1px solid #E2E8F0',
                            bgcolor: '#FFFFFF',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#0F766E' }}>
                              {group.category}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => handleToggleAllCategory(group.permissions, !allSelected)}
                              sx={{
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                color: '#64748B',
                                '&:hover': { color: '#0F766E' },
                              }}
                            >
                              {allSelected ? 'Clear Group' : 'Select All'}
                            </Button>
                          </Box>
                          <Grid container spacing={1.5}>
                            {group.permissions.map((perm) => {
                              const checked = editForm.permissions.includes(perm.id);
                              return (
                                <Grid size={{ xs: 12, sm: 6 }} key={perm.id}>
                                  <Paper
                                    elevation={0}
                                    onClick={() => handleTogglePermission(perm.id)}
                                    sx={{
                                      p: 1.25,
                                      borderRadius: '10px',
                                      border: checked ? '1.5px solid #0F766E' : '1px solid #E2E8F0',
                                      bgcolor: checked ? '#F0FDFA' : '#FAFAFB',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: 1,
                                      '&:hover': {
                                        borderColor: '#0F766E',
                                        bgcolor: '#F0FDFA',
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      size="small"
                                      checked={checked}
                                      sx={{ p: 0.25, color: '#94A3B8', '&.Mui-checked': { color: '#0F766E' } }}
                                    />
                                    <Box sx={{ minWidth: 0 }}>
                                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '0.825rem', color: '#0F172A', lineHeight: 1.3 }}>
                                        {perm.label}
                                      </Typography>
                                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', mt: 0.25, lineHeight: 1.3 }}>
                                        {perm.desc}
                                      </Typography>
                                    </Box>
                                  </Paper>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'space-between', bgcolor: '#FFFFFF' }}>
              <Button onClick={() => setEditRole(null)} sx={{ textTransform: 'none', color: '#64748B', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontFamily: "'Manrope', sans-serif",
                  bgcolor: '#0F766E',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
                  '&:hover': { bgcolor: '#0D6861' },
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Add Role Dialog ─── */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <DialogTitle component="div" sx={{ p: 3, pb: 2, fontWeight: 800, fontFamily: "'Manrope', sans-serif", fontSize: '1.25rem', color: '#0F172A' }}>
          Add New System Role
        </DialogTitle>
        <Divider sx={{ borderColor: '#F1F5F9' }} />
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Role Title"
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
              placeholder="Describe the duties and administrative scope of this role..."
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <Divider sx={{ borderColor: '#F1F5F9' }} />
        <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setOpenAddDialog(false)} sx={{ color: '#64748B', textTransform: 'none', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddRole}
            sx={{
              bgcolor: '#0F766E',
              fontWeight: 700,
              fontFamily: "'Manrope', sans-serif",
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
              '&:hover': { bgcolor: '#0D6861' },
            }}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
