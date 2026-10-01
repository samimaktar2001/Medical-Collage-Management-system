'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../PortalShell';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { MedoraDataGridPagination } from '../../../Pagination';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../ConfirmDialog';

// Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import PrintIcon from '@mui/icons-material/Print';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CampaignIcon from '@mui/icons-material/Campaign';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

import { kpiColors } from '../../../theme';

type OpdStatus = 'Waiting' | 'In Consultation' | 'Completed' | 'No Show';

interface OpdToken {
  id: string;
  token: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  department: string;
  room: string;
  doctor: string;
  triagePriority: 'Normal' | 'Urgent' | 'Elderly / Pediatric';
  registeredTime: string;
  status: OpdStatus;
  vitals?: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
  };
}

interface PrescriptionItem {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const initialTokens: OpdToken[] = [
  {
    id: 'tok-1',
    token: 'T-101',
    patientId: 'PAT-2401',
    patientName: 'Abdul Rahman',
    ageGender: '45 / M',
    department: 'Cardiology Clinic',
    room: 'Room 104',
    doctor: 'Dr. S. K. Sen',
    triagePriority: 'Urgent',
    registeredTime: '09:00 AM',
    status: 'In Consultation',
    vitals: { bp: '132/86', pulse: '78', temp: '98.4°F', spo2: '98%' },
  },
  {
    id: 'tok-2',
    token: 'T-102',
    patientId: 'PAT-2403',
    patientName: 'Rohan Sharma',
    ageGender: '12 / M',
    department: 'Pediatrics Clinic',
    room: 'Room 108',
    doctor: 'Dr. Shireen Banu',
    triagePriority: 'Elderly / Pediatric',
    registeredTime: '09:15 AM',
    status: 'Waiting',
    vitals: { bp: '110/70', pulse: '88', temp: '100.2°F', spo2: '99%' },
  },
  {
    id: 'tok-3',
    token: 'T-103',
    patientId: 'PAT-2404',
    patientName: 'Ayesha Khan',
    ageGender: '28 / F',
    department: 'Gynecology Clinic',
    room: 'Room 201',
    doctor: 'Dr. Farhana Yasmin',
    triagePriority: 'Normal',
    registeredTime: '09:25 AM',
    status: 'Waiting',
    vitals: { bp: '118/76', pulse: '72', temp: '98.6°F', spo2: '99%' },
  },
  {
    id: 'tok-4',
    token: 'T-104',
    patientId: 'PAT-2405',
    patientName: 'Bikash Paul',
    ageGender: '61 / M',
    department: 'Orthopedics Clinic',
    room: 'Room 112',
    doctor: 'Dr. Shakib Khan',
    triagePriority: 'Elderly / Pediatric',
    registeredTime: '09:30 AM',
    status: 'Waiting',
    vitals: { bp: '140/90', pulse: '76', temp: '98.6°F', spo2: '97%' },
  },
  {
    id: 'tok-5',
    token: 'T-100',
    patientId: 'PAT-2402',
    patientName: 'Fatima Begum',
    ageGender: '62 / F',
    department: 'Cardiology Clinic',
    room: 'Room 104',
    doctor: 'Dr. S. K. Sen',
    triagePriority: 'Elderly / Pediatric',
    registeredTime: '08:45 AM',
    status: 'Completed',
    vitals: { bp: '124/80', pulse: '72', temp: '98.6°F', spo2: '99%' },
  },
];

export default function OpdManagementPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const [tokens, setTokens] = useState<OpdToken[]>(initialTokens);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Consultation modal state
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [activeConsultToken, setActiveConsultToken] = useState<OpdToken | null>(null);

  // Doctor consultation clinical form
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');
  const [clinicalAdvice, setClinicalAdvice] = useState('');
  const [followUpDays, setFollowUpDays] = useState('7 Days');
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);
  const [rxList, setRxList] = useState<PrescriptionItem[]>([
    { id: '1', medicine: 'Tab. Paracetamol 650mg', dosage: '1 Tab', frequency: 'TDS (Post Meals)', duration: '3 Days', instructions: 'SOS if fever > 100°F' },
    { id: '2', medicine: 'Cap. Amoxicillin + Clavulanate 625mg', dosage: '1 Cap', frequency: 'BD (1-0-1)', duration: '5 Days', instructions: 'After lunch and dinner' },
  ]);

  // New Token modal
  const [newTokenOpen, setNewTokenOpen] = useState(false);
  const [newTokenData, setNewTokenData] = useState({
    patientName: '',
    patientId: '',
    ageGender: '',
    department: 'General Medicine Clinic',
    doctor: 'Dr. Ahmed Rahman',
    room: 'Room 102',
    priority: 'Normal' as const,
  });

  // Edit Token state
  const [editTokenOpen, setEditTokenOpen] = useState(false);
  const [tokenToEdit, setTokenToEdit] = useState<OpdToken | null>(null);
  const [editTokenForm, setEditTokenForm] = useState({
    patientName: '',
    department: '',
    doctor: '',
    room: '',
    triagePriority: 'Normal' as 'Normal' | 'Urgent' | 'Elderly / Pediatric',
    status: 'Waiting' as OpdStatus,
  });

  // Delete Token state
  const [deleteTokenOpen, setDeleteTokenOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<OpdToken | null>(null);

  const handleOpenEditToken = (token: OpdToken) => {
    setTokenToEdit(token);
    setEditTokenForm({
      patientName: token.patientName,
      department: token.department,
      doctor: token.doctor,
      room: token.room,
      triagePriority: token.triagePriority,
      status: token.status,
    });
    setEditTokenOpen(true);
  };

  const handleSaveEditToken = async () => {
    if (!tokenToEdit) return;
    try {
      await api(`appointments/${tokenToEdit.id}/status`, 'PATCH', { status: editTokenForm.status }).catch(() => {});
      setTokens((prev) =>
        prev.map((t) =>
          t.id === tokenToEdit.id ? { ...t, ...editTokenForm } : t
        )
      );
      toast.success(`Token ${tokenToEdit.token} updated successfully.`);
      setEditTokenOpen(false);
      setTokenToEdit(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update token.');
    }
  };

  const handleOpenDeleteToken = (token: OpdToken) => {
    setTokenToDelete(token);
    setDeleteTokenOpen(true);
  };

  const handleConfirmDeleteToken = async () => {
    if (!tokenToDelete) return;
    try {
      await api(`appointments/${tokenToDelete.id}/status`, 'PATCH', { status: 'Cancelled' }).catch(() => {});
      setTokens((prev) => prev.filter((t) => t.id !== tokenToDelete.id));
      toast.success(`Token ${tokenToDelete.token} (${tokenToDelete.patientName}) cancelled.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel token.');
    } finally {
      setDeleteTokenOpen(false);
      setTokenToDelete(null);
    }
  };

  const loadAppointments = () => {
    api('appointments')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const mapped: OpdToken[] = res.data.map((r: any) => ({
            id: r.id,
            token: r.token_number,
            patientId: r.uhid || r.opd_slip_id,
            patientName: r.patient_name,
            ageGender: `${r.age} Y / ${r.gender}`,
            department: r.department,
            doctor: r.doctor_name,
            room: 'Room ' + (100 + (parseInt(String(r.token_number).replace(/\D/g, '')) % 15 || 1)),
            triagePriority: r.age > 60 || r.age < 12 ? 'Elderly / Pediatric' : 'Normal',
            registeredTime: r.reporting_time || '09:00 AM',
            status: (r.status as OpdStatus) || 'Waiting',
            vitals: { bp: '120/80', pulse: '76', temp: '98.4°F', spo2: '98%' },
          }));
          setTokens(mapped);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Filter tokens
  const filteredTokens = tokens.filter((t) => {
    if (selectedDept !== 'ALL' && t.department !== selectedDept) return false;
    if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.token.toLowerCase().includes(q) ||
        t.patientName.toLowerCase().includes(q) ||
        t.patientId.toLowerCase().includes(q) ||
        t.doctor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const waitingCount = tokens.filter((t) => t.status === 'Waiting').length;
  const inConsultCount = tokens.filter((t) => t.status === 'In Consultation').length;
  const completedCount = tokens.filter((t) => t.status === 'Completed').length;

  const handleStartConsultation = (token: OpdToken) => {
    setActiveConsultToken(token);
    setChiefComplaints('');
    setClinicalDiagnosis('');
    setClinicalAdvice('Adequate oral hydration, rest, monitor fever.');
    setConsultModalOpen(true);
  };

  const handleAddRxRow = () => {
    setRxList([
      ...rxList,
      {
        id: `rx-${Date.now()}`,
        medicine: '',
        dosage: '1 Tab',
        frequency: 'BD (1-0-1)',
        duration: '5 Days',
        instructions: 'After meals',
      },
    ]);
  };

  const handleRemoveRxRow = (id: string) => {
    setRxList(rxList.filter((r) => r.id !== id));
  };

  const handleUpdateRx = (id: string, field: keyof PrescriptionItem, val: string) => {
    setRxList(rxList.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const handleCompleteConsultation = () => {
    if (!activeConsultToken) return;
    api(`appointments/${activeConsultToken.id}/status`, 'PATCH', { status: 'Completed' })
      .catch(() => {});
    setTokens(
      tokens.map((t) =>
        t.id === activeConsultToken.id ? { ...t, status: 'Completed' } : t
      )
    );
    setConsultModalOpen(false);
    toast.success(`Prescription for Token ${activeConsultToken.token} (${activeConsultToken.patientName}) generated and sent to Hospital Pharmacy!`);
  };

  const handleCallToken = (token: OpdToken) => {
    api(`appointments/${token.id}/status`, 'PATCH', { status: 'In Consultation' })
      .catch(() => {});
    setTokens(
      tokens.map((t) =>
        t.id === token.id ? { ...t, status: 'In Consultation' } : t
      )
    );
    toast.success(`📢 Calling Token ${token.token}: ${token.patientName} to ${token.room} (${token.department})`);
  };

  const handleCreateToken = async () => {
    if (!newTokenData.patientName) return;
    try {
      await api('public/appointments', 'POST', {
        department: newTokenData.department,
        doctor_name: newTokenData.doctor,
        patient_name: newTokenData.patientName,
        age: 30,
        gender: 'Male',
        phone: '9876543210',
        slot: 'Morning (09:00 AM - 12:00 PM)',
        appointment_date: new Date().toISOString().split('T')[0],
      });
      loadAppointments();
    } catch {
      const nextNum = 100 + tokens.length + 1;
      const item: OpdToken = {
        id: `tok-${Date.now()}`,
        token: `T-${nextNum}`,
        patientId: newTokenData.patientId || `PAT-${Math.floor(2400 + Math.random() * 200)}`,
        patientName: newTokenData.patientName,
        ageGender: newTokenData.ageGender || '30 / M',
        department: newTokenData.department,
        room: newTokenData.room,
        doctor: newTokenData.doctor,
        triagePriority: newTokenData.priority,
        registeredTime: 'Just Now',
        status: 'Waiting',
        vitals: { bp: '120/80', pulse: '75', temp: '98.6°F', spo2: '99%' },
      };
      setTokens([item, ...tokens]);
    }
    setNewTokenOpen(false);
    setNewTokenData({
      patientName: '',
      patientId: '',
      ageGender: '',
      department: 'General Medicine Clinic',
      doctor: 'Dr. Ahmed Rahman',
      room: 'Room 102',
      priority: 'Normal',
    });
  };

  // DataGrid Column Definitions
  const columns: GridColDef[] = [
    {
      field: 'token',
      headerName: 'Token #',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <StatusBadge
          status={String(params.value)}
          tone={params.row.status === 'In Consultation' ? 'warning' : 'neutral'}
          showDot={false}
        />
      ),
    },
    {
      field: 'patientName',
      headerName: 'Patient Details',
      flex: 1.2,
      minWidth: 190,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#0F766E' }}>
            {(params.value as string).charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {params.value}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>
              {params.row.patientId} • {params.row.ageGender}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'triagePriority',
      headerName: 'Priority',
      width: 140,
      renderCell: (params: GridRenderCellParams) => {
        const p = params.value as string;
        return <StatusBadge status={p} />;
      },
    },
    { field: 'department', headerName: 'Clinic & Room', flex: 1, minWidth: 170, valueGetter: (_, row) => `${row.department} (${row.room})` },
    { field: 'doctor', headerName: 'Consultant Doctor', flex: 1, minWidth: 150 },
    { field: 'registeredTime', headerName: 'Check-in Time', width: 120 },
    {
      field: 'status',
      headerName: 'Queue Status',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const val = params.value as string;
        return <StatusBadge status={val} />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const token = params.row as OpdToken;
        return (
          <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center', height: '100%' }}>
            {token.status === 'Waiting' && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<MedicationIcon sx={{ fontSize: 14 }} />}
                  onClick={() => handleStartConsultation(token)}
                  sx={{ bgcolor: '#0F766E', textTransform: 'none', fontSize: '0.72rem', py: 0.25, borderRadius: '6px', fontWeight: 700 }}
                >
                  Consult
                </Button>
                <Tooltip title="Call Next Patient">
                  <IconButton size="small" onClick={() => handleCallToken(token)} sx={{ color: '#D97706' }}>
                    <CampaignIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {token.status === 'In Consultation' && (
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={() => handleStartConsultation(token)}
                sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.25, borderRadius: '6px', fontWeight: 700 }}
              >
                Resume Rx
              </Button>
            )}
            {token.status === 'Completed' && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<PrintIcon sx={{ fontSize: 14 }} />}
                onClick={() => toast.success(`Printing Prescription for ${token.patientName}...`)}
                sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, borderRadius: '6px', borderColor: '#CBD5E1', color: '#475569' }}
              >
                Print Rx
              </Button>
            )}
            <Tooltip title="View Patient Profile">
              <IconButton
                size="small"
                onClick={() => router.push(`/portal/patients/${token.patientId}`)}
                sx={{ color: '#64748B' }}
              >
                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Token Details">
              <IconButton
                size="small"
                onClick={() => handleOpenEditToken(token)}
                sx={{ color: '#0284C7' }}
              >
                <EditOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel / Delete Token">
              <IconButton
                size="small"
                onClick={() => handleOpenDeleteToken(token)}
                sx={{ color: '#E11D48' }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Hospital', href: '/portal/hospital' },
          { label: 'OPD & Doctor Consultation' },
        ]}
        category="Clinical Services"
        title="OPD Clinic & Consultation Desk"
        description="Live outpatient token queue, doctor consultation workstation, and electronic prescription (Rx) writer."
        icon={<LocalHospitalIcon />}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewTokenOpen(true)}
            sx={{
              bgcolor: '#0F766E',
              fontWeight: 700,
              fontSize: '0.8125rem',
              borderRadius: '8px',
              textTransform: 'none',
              px: 2.5,
              py: 1,
              boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
              '&:hover': { bgcolor: '#0D6861' },
            }}
          >
            + Issue OPD Token
          </Button>
        }
      />

      {/* ─── KPI Cards ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Total Patients Registered', value: `${tokens.length} Patients`, trend: 14, label: 'Today in OPD', icon: <LocalHospitalIcon />, color: kpiColors.teal },
          { title: 'Waiting in Queue', value: `${waitingCount} Tokens`, label: 'Next token ready', icon: <AccessTimeIcon />, color: kpiColors.blue },
          { title: 'In Consultation', value: `${inConsultCount} Active`, label: 'In doctor rooms', icon: <MedicationIcon />, color: kpiColors.amber },
          { title: 'Completed Consultations', value: `${completedCount} Seen`, trend: 9, label: 'Rx dispensed', icon: <CheckCircleIcon />, color: kpiColors.emerald },
        ].map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF', height: '100%' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: kpi.color.bg, color: kpi.color.icon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(kpi.icon, { sx: { fontSize: 20 } })}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{kpi.title}</Typography>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#0F172A', lineHeight: 1.1 }}>
                    {kpi.value}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{kpi.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ─── Filter Bar ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, mb: 2, bgcolor: '#FFFFFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {/* Search */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              px: 1.5,
              height: 40,
              width: { xs: '100%', sm: 220 },
              '&:focus-within': { borderColor: '#0F766E' },
            }}>
              <SearchIcon sx={{ color: '#94A3B8', fontSize: 18, mr: 0.8 }} />
              <InputBase
                placeholder="Search token, patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ fontSize: '0.8125rem', width: '100%' }}
              />
            </Box>

            {/* Department Filter */}
            <Select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              size="small"
              sx={{ height: 40, minWidth: 170, fontSize: '0.8125rem', borderRadius: '8px' }}
            >
              <MenuItem value="ALL">All Clinics</MenuItem>
              <MenuItem value="Cardiology Clinic">Cardiology Clinic</MenuItem>
              <MenuItem value="Pediatrics Clinic">Pediatrics Clinic</MenuItem>
              <MenuItem value="Gynecology Clinic">Gynecology Clinic</MenuItem>
              <MenuItem value="Orthopedics Clinic">Orthopedics Clinic</MenuItem>
            </Select>

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              size="small"
              sx={{ height: 40, minWidth: 140, fontSize: '0.8125rem', borderRadius: '8px' }}
            >
              <MenuItem value="ALL">Status: All</MenuItem>
              <MenuItem value="Waiting">Waiting ({waitingCount})</MenuItem>
              <MenuItem value="In Consultation">In Consultation ({inConsultCount})</MenuItem>
              <MenuItem value="Completed">Completed ({completedCount})</MenuItem>
            </Select>
          </Stack>
        </Stack>
      </Card>

      {/* ─── Main Queue DataGrid ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', bgcolor: '#FFFFFF', height: 560 }}>
        <DataGrid
          rows={filteredTokens}
          columns={columns}
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
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9' },
          }}
        />
      </Card>

      {/* ─── DOCTOR CONSULTATION & PRESCRIPTION MODAL ─── */}
      {activeConsultToken && (
        <Dialog
          open={consultModalOpen}
          onClose={() => setConsultModalOpen(false)}
          maxWidth="md"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
        >
          <DialogTitle sx={{ bgcolor: '#0F766E', color: '#FFFFFF', p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>
                  Doctor Consultation & Electronic Rx
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  Token #{activeConsultToken.token} • {activeConsultToken.patientName} ({activeConsultToken.patientId})
                </Typography>
              </Box>
              <Chip
                label={activeConsultToken.department}
                sx={{ bgcolor: '#FFFFFF', color: '#0F766E', fontWeight: 700, fontSize: '0.75rem' }}
              />
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ p: 3, pt: 3 }}>
            {/* Patient Vitals Quickstrip */}
            {activeConsultToken.vitals && (
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '10px', mb: 3 }}>
                <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 1, fontSize: '0.8rem', color: '#334155' }}>
                  <Box><strong>Age / Gender:</strong> {activeConsultToken.ageGender}</Box>
                  <Box><strong>BP:</strong> {activeConsultToken.vitals.bp} mmHg</Box>
                  <Box><strong>Pulse:</strong> {activeConsultToken.vitals.pulse} bpm</Box>
                  <Box><strong>SpO2:</strong> {activeConsultToken.vitals.spo2}</Box>
                  <Box><strong>Temp:</strong> {activeConsultToken.vitals.temp}</Box>
                </Stack>
              </Paper>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="Chief Complaints & Symptoms"
                  placeholder="e.g. Headache x 2 days, persistent mild fever..."
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="Clinical Findings & Provisional Diagnosis"
                  placeholder="e.g. Upper Respiratory Tract Infection (URTI)..."
                  value={clinicalDiagnosis}
                  onChange={(e) => setClinicalDiagnosis(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Prescriptions Table */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', fontFamily: "'Manrope', sans-serif" }}>
                  Prescribed Medications (Rx)
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddRxRow}
                  sx={{ textTransform: 'none', color: '#0F766E', fontWeight: 700 }}
                >
                  Add Medicine
                </Button>
              </Stack>

              <Stack spacing={1}>
                {rxList.map((rx, idx) => (
                  <Paper key={rx.id} variant="outlined" sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#FFFFFF' }}>
                    <Grid container spacing={1} sx={{ alignItems: 'center' }}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label={`Medicine #${idx + 1}`}
                          value={rx.medicine}
                          onChange={(e) => handleUpdateRx(rx.id, 'medicine', e.target.value)}
                          placeholder="e.g. Tab. Paracetamol 650mg"
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Dosage"
                          value={rx.dosage}
                          onChange={(e) => handleUpdateRx(rx.id, 'dosage', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Frequency"
                          value={rx.frequency}
                          onChange={(e) => handleUpdateRx(rx.id, 'frequency', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Duration"
                          value={rx.duration}
                          onChange={(e) => handleUpdateRx(rx.id, 'duration', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 1.5 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Instructions"
                          value={rx.instructions}
                          onChange={(e) => handleUpdateRx(rx.id, 'instructions', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 0.5 }}>
                        <IconButton size="small" color="error" onClick={() => handleRemoveRxRow(rx.id)}>
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </Box>

            {/* Diagnostic Investigations */}
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', mb: 1, fontFamily: "'Manrope', sans-serif" }}>
              Order Diagnostic Tests
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
              {['Complete Blood Count (CBC)', 'Chest X-Ray (PA)', 'Urine R/E', 'Serum Creatinine', '12-Lead ECG', 'Blood Glucose (F/PP)'].map((test) => {
                const isSelected = selectedLabTests.includes(test);
                return (
                  <Chip
                    key={test}
                    label={test}
                    clickable
                    onClick={() => {
                      setSelectedLabTests(
                        isSelected ? selectedLabTests.filter((t) => t !== test) : [...selectedLabTests, test]
                      );
                    }}
                    sx={{
                      bgcolor: isSelected ? '#0F766E' : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : '#334155',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                    }}
                  />
                );
              })}
            </Stack>

            {/* Doctor Advice & Followup */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Dietary & Lifestyle Advice"
                  value={clinicalAdvice}
                  onChange={(e) => setClinicalAdvice(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Follow-up In"
                  value={followUpDays}
                  onChange={(e) => setFollowUpDays(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 0, justifyContent: 'space-between' }}>
            <Button
              color="error"
              variant="outlined"
              onClick={async () => {
                const ok = await confirm({
                  title: 'Emergency IPD Admission',
                  message: `Transfer ${activeConsultToken?.patientName || 'this patient'} to IPD Ward for emergency hospital admission?`,
                  confirmText: 'Transfer & Admit to IPD',
                  severity: 'error',
                });
                if (ok) {
                  router.push('/portal/ipd');
                  toast.success('Patient transfer protocol initiated');
                }
              }}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Transfer / Admit to IPD
            </Button>
            <Stack direction="row" spacing={1.5}>
              <Button onClick={() => setConsultModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCompleteConsultation}
                sx={{
                  bgcolor: '#0F766E',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  '&:hover': { bgcolor: '#0D6861' },
                }}
              >
                Save & Issue Prescription
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      )}

      {/* ─── ISSUE OPD TOKEN MODAL ─── */}
      <Dialog
        open={newTokenOpen}
        onClose={() => setNewTokenOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '14px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
          Issue New OPD Token
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Patient Full Name"
              size="small"
              fullWidth
              value={newTokenData.patientName}
              onChange={(e) => setNewTokenData({ ...newTokenData, patientName: e.target.value })}
              placeholder="e.g. Suman Roy"
            />
            <TextField
              label="Patient UHID (Optional)"
              size="small"
              fullWidth
              value={newTokenData.patientId}
              onChange={(e) => setNewTokenData({ ...newTokenData, patientId: e.target.value })}
              placeholder="e.g. PAT-2489"
            />
            <TextField
              label="Age & Gender"
              size="small"
              fullWidth
              value={newTokenData.ageGender}
              onChange={(e) => setNewTokenData({ ...newTokenData, ageGender: e.target.value })}
              placeholder="e.g. 35 / M"
            />
            <Select
              size="small"
              fullWidth
              value={newTokenData.department}
              onChange={(e) => setNewTokenData({ ...newTokenData, department: e.target.value })}
            >
              <MenuItem value="General Medicine Clinic">General Medicine Clinic (Room 102)</MenuItem>
              <MenuItem value="Cardiology Clinic">Cardiology Clinic (Room 104)</MenuItem>
              <MenuItem value="Pediatrics Clinic">Pediatrics Clinic (Room 108)</MenuItem>
              <MenuItem value="Gynecology Clinic">Gynecology Clinic (Room 201)</MenuItem>
              <MenuItem value="Orthopedics Clinic">Orthopedics Clinic (Room 112)</MenuItem>
            </Select>
            <Select
              size="small"
              fullWidth
              value={newTokenData.priority}
              onChange={(e) => setNewTokenData({ ...newTokenData, priority: e.target.value as any })}
            >
              <MenuItem value="Normal">Triage Priority: Normal</MenuItem>
              <MenuItem value="Urgent">Triage Priority: Urgent</MenuItem>
              <MenuItem value="Elderly / Pediatric">Triage Priority: Elderly / Pediatric</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setNewTokenOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateToken}
            sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#0D6861' } }}
          >
            Generate Token
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Edit Token Modal ─── */}
      <Dialog
        open={editTokenOpen}
        onClose={() => setEditTokenOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        <DialogTitle component="div" sx={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component="span" variant="h6" sx={{ fontWeight: 800 }}>
            Edit Token Details
          </Typography>
          <StatusBadge status={tokenToEdit?.token || ''} tone="warning" showDot={false} />
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Patient Name"
              size="small"
              fullWidth
              value={editTokenForm.patientName}
              onChange={(e) => setEditTokenForm({ ...editTokenForm, patientName: e.target.value })}
            />
            <TextField
              label="Consultant Doctor"
              size="small"
              fullWidth
              value={editTokenForm.doctor}
              onChange={(e) => setEditTokenForm({ ...editTokenForm, doctor: e.target.value })}
            />
            <TextField
              label="Room / Cabin"
              size="small"
              fullWidth
              value={editTokenForm.room}
              onChange={(e) => setEditTokenForm({ ...editTokenForm, room: e.target.value })}
            />
            <Select
              size="small"
              fullWidth
              value={editTokenForm.department}
              onChange={(e) => setEditTokenForm({ ...editTokenForm, department: e.target.value })}
            >
              <MenuItem value="Cardiology Clinic">Cardiology Clinic</MenuItem>
              <MenuItem value="Pediatrics Clinic">Pediatrics Clinic</MenuItem>
              <MenuItem value="Gynecology Clinic">Gynecology Clinic</MenuItem>
              <MenuItem value="Orthopedics Clinic">Orthopedics Clinic</MenuItem>
              <MenuItem value="General Medicine Clinic">General Medicine Clinic</MenuItem>
            </Select>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Select
                  size="small"
                  fullWidth
                  value={editTokenForm.triagePriority}
                  onChange={(e) => setEditTokenForm({ ...editTokenForm, triagePriority: e.target.value as any })}
                >
                  <MenuItem value="Normal">Priority: Normal</MenuItem>
                  <MenuItem value="Urgent">Priority: Urgent</MenuItem>
                  <MenuItem value="Elderly / Pediatric">Priority: Elderly / Pediatric</MenuItem>
                </Select>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Select
                  size="small"
                  fullWidth
                  value={editTokenForm.status}
                  onChange={(e) => setEditTokenForm({ ...editTokenForm, status: e.target.value as any })}
                >
                  <MenuItem value="Waiting">Waiting</MenuItem>
                  <MenuItem value="In Consultation">In Consultation</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="No Show">No Show</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => setEditTokenOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEditToken}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#0F766E',
              '&:hover': { bgcolor: '#0D6861' },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Cancel / Delete Token Dialog ─── */}
      <Dialog
        open={deleteTokenOpen}
        onClose={() => setDeleteTokenOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
          Cancel OPD Token
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Are you sure you want to cancel token{' '}
            <strong style={{ color: '#0F172A' }}>{tokenToDelete?.token}</strong> for{' '}
            <strong style={{ color: '#0F172A' }}>{tokenToDelete?.patientName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => setDeleteTokenOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDeleteToken}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#E11D48',
              '&:hover': { bgcolor: '#BE123C' },
            }}
          >
            Cancel Token
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
