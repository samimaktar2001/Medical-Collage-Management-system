'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { MedoraDataGridPagination } from '../../../Pagination';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import toast from 'react-hot-toast';

// Icons
import HotelIcon from '@mui/icons-material/Hotel';
import AirlineSeatIndividualSuiteIcon from '@mui/icons-material/AirlineSeatIndividualSuite';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AirIcon from '@mui/icons-material/Air';
import PersonIcon from '@mui/icons-material/Person';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import { kpiColors } from '../../../theme';

type BedStatus = 'Occupied' | 'Available' | 'Sanitizing' | 'Reserved';

interface Bed {
  id: string;
  bedNumber: string;
  ward: string;
  floor: string;
  status: BedStatus;
  patientName?: string;
  patientId?: string;
  ageGender?: string;
  admittedDate?: string;
  consultant?: string;
  diagnosis?: string;
  hasOxygen?: boolean;
  hasVentilator?: boolean;
}

const initialBeds: Bed[] = [
  // ICU Unit A
  { id: 'b1', bedNumber: 'ICU-01', ward: 'ICU Unit A', floor: 'Floor 2', status: 'Occupied', patientName: 'Abdul Rahman', patientId: 'PAT-2401', ageGender: '45 / M', admittedDate: '28 Sep 2026', consultant: 'Dr. S. K. Sen', diagnosis: 'Acute Coronary Syndrome', hasOxygen: true, hasVentilator: true },
  { id: 'b2', bedNumber: 'ICU-02', ward: 'ICU Unit A', floor: 'Floor 2', status: 'Occupied', patientName: 'Nikhil Sen', patientId: 'PAT-2405', ageGender: '55 / M', admittedDate: '29 Sep 2026', consultant: 'Dr. K. Basu', diagnosis: 'Ischemic Stroke monitoring', hasOxygen: true, hasVentilator: false },
  { id: 'b3', bedNumber: 'ICU-03', ward: 'ICU Unit A', floor: 'Floor 2', status: 'Sanitizing', ward_status: 'Sanitizing' } as any,
  { id: 'b4', bedNumber: 'ICU-04', ward: 'ICU Unit A', floor: 'Floor 2', status: 'Available', hasOxygen: true },

  // Cardiology Ward
  { id: 'b5', bedNumber: 'CARD-101', ward: 'Cardiology Ward', floor: 'Floor 3', status: 'Occupied', patientName: 'Mohammad Ali', patientId: 'PAT-2406', ageGender: '60 / M', admittedDate: '27 Sep 2026', consultant: 'Dr. S. K. Sen', diagnosis: 'Congestive Heart Failure', hasOxygen: true },
  { id: 'b6', bedNumber: 'CARD-102', ward: 'Cardiology Ward', floor: 'Floor 3', status: 'Available', hasOxygen: true },
  { id: 'b7', bedNumber: 'CARD-103', ward: 'Cardiology Ward', floor: 'Floor 3', status: 'Reserved', patientName: 'Transfer from Emergency', hasOxygen: true },
  { id: 'b8', bedNumber: 'CARD-104', ward: 'Cardiology Ward', floor: 'Floor 3', status: 'Available', hasOxygen: true },

  // Male Medical Ward
  { id: 'b9', bedNumber: 'MM-201', ward: 'Male Medical Ward', floor: 'Floor 2', status: 'Occupied', patientName: 'Harun-ur-Rashid', patientId: 'PAT-2407', ageGender: '52 / M', admittedDate: '26 Sep 2026', consultant: 'Dr. Ahmed Rahman', diagnosis: 'Severe Bronchial Asthma', hasOxygen: true },
  { id: 'b10', bedNumber: 'MM-202', ward: 'Male Medical Ward', floor: 'Floor 2', status: 'Occupied', patientName: 'Bikash Das', patientId: 'PAT-2408', ageGender: '39 / M', admittedDate: '29 Sep 2026', consultant: 'Dr. P. Roy', diagnosis: 'Dengue with Thrombocytopenia', hasOxygen: false },
  { id: 'b11', bedNumber: 'MM-203', ward: 'Male Medical Ward', floor: 'Floor 2', status: 'Available', hasOxygen: false },
  { id: 'b12', bedNumber: 'MM-204', ward: 'Male Medical Ward', floor: 'Floor 2', status: 'Sanitizing', hasOxygen: false },

  // Female Surgical Ward
  { id: 'b13', bedNumber: 'FS-301', ward: 'Female Surgical Ward', floor: 'Floor 3', status: 'Occupied', patientName: 'Rashida Khatun', patientId: 'PAT-2409', ageGender: '48 / F', admittedDate: '27 Sep 2026', consultant: 'Dr. K. S. Mukherjee', diagnosis: 'Post-op Lap Cholecystectomy', hasOxygen: false },
  { id: 'b14', bedNumber: 'FS-302', ward: 'Female Surgical Ward', floor: 'Floor 3', status: 'Occupied', patientName: 'Fatima Begum', patientId: 'PAT-2402', ageGender: '62 / F', admittedDate: '28 Sep 2026', consultant: 'Dr. R. Ahmed', diagnosis: 'Bilateral TKR Post-op', hasOxygen: false },
  { id: 'b15', bedNumber: 'FS-303', ward: 'Female Surgical Ward', floor: 'Floor 3', status: 'Available', hasOxygen: false },
  { id: 'b16', bedNumber: 'FS-304', ward: 'Female Surgical Ward', floor: 'Floor 3', status: 'Available', hasOxygen: false },
];

export default function IpdManagementPage() {
  const router = useRouter();
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openAdmitModal, setOpenAdmitModal] = useState(false);
  const [selectedBedForAdmit, setSelectedBedForAdmit] = useState<Bed | null>(null);

  // New admission form state
  const [newAdmission, setNewAdmission] = useState({
    patientName: '',
    patientId: '',
    ageGender: '',
    consultant: '',
    diagnosis: '',
  });

  // Filter beds
  const filteredBeds = beds.filter((b) => {
    if (selectedWard !== 'ALL' && b.ward !== selectedWard) return false;
    if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = b.patientName && b.patientName.toLowerCase().includes(q);
      const matchBed = b.bedNumber.toLowerCase().includes(q);
      const matchDoc = b.consultant && b.consultant.toLowerCase().includes(q);
      return matchName || matchBed || matchDoc;
    }
    return true;
  });

  // Bed stats
  const totalBeds = beds.length;
  const occupiedCount = beds.filter((b) => b.status === 'Occupied').length;
  const availableCount = beds.filter((b) => b.status === 'Available').length;
  const sanitizingCount = beds.filter((b) => b.status === 'Sanitizing').length;
  const reservedCount = beds.filter((b) => b.status === 'Reserved').length;

  const handleOpenAdmit = (bed?: Bed) => {
    if (bed) setSelectedBedForAdmit(bed);
    setOpenAdmitModal(true);
  };

  const handleConfirmAdmission = () => {
    if (!newAdmission.patientName) return;
    const targetBedId = selectedBedForAdmit ? selectedBedForAdmit.id : beds.find((b) => b.status === 'Available')?.id;
    if (!targetBedId) {
      toast.error('No available bed selected!');
      return;
    }

    setBeds(
      beds.map((b) =>
        b.id === targetBedId
          ? {
              ...b,
              status: 'Occupied',
              patientName: newAdmission.patientName,
              patientId: newAdmission.patientId || `PAT-${Math.floor(2000 + Math.random() * 900)}`,
              ageGender: newAdmission.ageGender || '40 / M',
              admittedDate: 'Today, Just Now',
              consultant: newAdmission.consultant || 'Dr. S. K. Sen',
              diagnosis: newAdmission.diagnosis || 'Observation',
            }
          : b
      )
    );
    setNewAdmission({ patientName: '', patientId: '', ageGender: '', consultant: '', diagnosis: '' });
    setSelectedBedForAdmit(null);
    setOpenAdmitModal(false);
  };

  const handleMarkClean = (bedId: string) => {
    setBeds(beds.map((b) => (b.id === bedId ? { ...b, status: 'Available' } : b)));
  };

  const handleDischargeBed = (bedId: string) => {
    setBeds(
      beds.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: 'Sanitizing',
              patientName: undefined,
              patientId: undefined,
              admittedDate: undefined,
              consultant: undefined,
              diagnosis: undefined,
            }
          : b
      )
    );
  };

  // Columns for Inpatient Table
  const tableColumns: GridColDef[] = [
    { field: 'bedNumber', headerName: 'Bed #', width: 110, fontWeight: 700 } as any,
    { field: 'ward', headerName: 'Ward & Floor', width: 180 },
    {
      field: 'patientName',
      headerName: 'Patient Name',
      flex: 1,
      minWidth: 170,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#0F766E' }}>
            {params.value ? (params.value as string).charAt(0) : '—'}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {params.value || 'Vacant Bed'}
            </Typography>
            {params.row.patientId && (
              <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{params.row.patientId}</Typography>
            )}
          </Box>
        </Stack>
      ),
    },
    { field: 'ageGender', headerName: 'Age/Gender', width: 110 },
    { field: 'diagnosis', headerName: 'Diagnosis', flex: 1, minWidth: 160 },
    { field: 'consultant', headerName: 'Consultant', flex: 1, minWidth: 150 },
    { field: 'admittedDate', headerName: 'Admitted Date', width: 130 },
    {
      field: 'status',
      headerName: 'Bed Status',
      width: 140,
      renderCell: (params: GridRenderCellParams) => {
        return <StatusBadge status={params.value as string} />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const bed = params.row as Bed;
        return (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', height: '100%' }}>
            {bed.status === 'Occupied' && (
              <>
                <Tooltip title="View Patient Profile">
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/portal/patients/${bed.patientId || 'PAT-2401'}`)}
                    sx={{ color: '#0F766E' }}
                  >
                    <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Discharge / Vacate Bed">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDischargeBed(bed.id)}
                  >
                    <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {bed.status === 'Available' && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleOpenAdmit(bed)}
                sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.2, borderRadius: '6px' }}
              >
                Admit
              </Button>
            )}
            {bed.status === 'Sanitizing' && (
              <Button
                size="small"
                variant="text"
                color="warning"
                onClick={() => handleMarkClean(bed.id)}
                sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.2 }}
              >
                Mark Clean
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Hospital', href: '/portal/hospital' },
          { label: 'IPD & Bed Management' },
        ]}
        category="Inpatient Management"
        title="IPD & Ward Bed Management"
        description="Live inpatient ward census, visual bed allocation matrix, and nurse station monitoring."
        icon={<AirlineSeatIndividualSuiteIcon />}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<SwapHorizIcon />}
              onClick={() => toast.success('Initiating ward transfer protocol...')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                color: '#334155',
                bgcolor: '#FFFFFF',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              Bed Transfer
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAdmit()}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                bgcolor: '#0F766E',
                boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
                '&:hover': { bgcolor: '#0D6861' },
              }}
            >
              + New IPD Admission
            </Button>
          </Stack>
        }
      />

      {/* ─── Top KPI Cards ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Admitted Inpatients', value: `${occupiedCount} Patients`, trend: 8, label: 'vs last week', icon: <HotelIcon />, color: kpiColors.teal },
          { title: 'Bed Occupancy Rate', value: `${Math.round((occupiedCount / totalBeds) * 100)}%`, trend: 4, label: `${occupiedCount}/${totalBeds} Total Beds`, icon: <AirlineSeatIndividualSuiteIcon />, color: kpiColors.blue },
          { title: 'Available Vacant Beds', value: `${availableCount} Beds`, label: 'Ready for admission', icon: <MeetingRoomIcon />, color: kpiColors.emerald },
          { title: 'Under Sanitization', value: `${sanitizingCount} Beds`, label: 'Housekeeping active', icon: <CleaningServicesIcon />, color: kpiColors.amber },
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

      {/* ─── Controls & View Switcher ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, mb: 2, bgcolor: '#FFFFFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' } }}>
          {/* Filters */}
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
                placeholder="Search bed, patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ fontSize: '0.8125rem', width: '100%' }}
              />
            </Box>

            {/* Ward Filter */}
            <Select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              size="small"
              sx={{ height: 40, minWidth: 150, fontSize: '0.8125rem', borderRadius: '8px' }}
            >
              <MenuItem value="ALL">All Wards</MenuItem>
              <MenuItem value="ICU Unit A">ICU Unit A</MenuItem>
              <MenuItem value="Cardiology Ward">Cardiology Ward</MenuItem>
              <MenuItem value="Male Medical Ward">Male Medical Ward</MenuItem>
              <MenuItem value="Female Surgical Ward">Female Surgical Ward</MenuItem>
            </Select>

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              size="small"
              sx={{ height: 40, minWidth: 130, fontSize: '0.8125rem', borderRadius: '8px' }}
            >
              <MenuItem value="ALL">Status: All</MenuItem>
              <MenuItem value="Occupied">Occupied ({occupiedCount})</MenuItem>
              <MenuItem value="Available">Available ({availableCount})</MenuItem>
              <MenuItem value="Sanitizing">Sanitizing ({sanitizingCount})</MenuItem>
              <MenuItem value="Reserved">Reserved ({reservedCount})</MenuItem>
            </Select>
          </Stack>

          {/* View Mode Switcher */}
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              minHeight: 40,
              bgcolor: '#F1F5F9',
              borderRadius: '8px',
              p: 0.5,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                minHeight: 32,
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'none',
                color: '#64748B',
                py: 0.5,
                px: 2,
                '&.Mui-selected': { bgcolor: '#FFFFFF', color: '#0F766E', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
              },
            }}
          >
            <Tab icon={<GridViewIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Visual Ward Map" />
            <Tab icon={<TableRowsIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Inpatient Census" />
          </Tabs>
        </Stack>
      </Card>

      {/* ─── TAB 0: Visual Ward Bed Matrix ─── */}
      {activeTab === 0 && (
        <Box>
          <Grid container spacing={2}>
            {filteredBeds.map((bed) => {
              const isOccupied = bed.status === 'Occupied';
              const isAvailable = bed.status === 'Available';
              const isSanitizing = bed.status === 'Sanitizing';
              const isReserved = bed.status === 'Reserved';

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={bed.id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: isOccupied ? '#FCA5A5' : isAvailable ? '#86EFAC' : isSanitizing ? '#FDE68A' : '#BFDBFE',
                      borderRadius: '14px',
                      p: 2,
                      bgcolor: '#FFFFFF',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      },
                    }}
                  >
                    {/* Top Row: Bed #, Ward, and Status */}
                    <Box>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <HotelIcon sx={{ fontSize: 20, color: isOccupied ? '#DC2626' : isAvailable ? '#16A34A' : '#D97706' }} />
                          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                            {bed.bedNumber}
                          </Typography>
                        </Stack>
                        <StatusBadge status={bed.status} size="small" />
                      </Stack>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mb: 1.5 }}>
                        {bed.ward} • {bed.floor}
                      </Typography>

                      {/* Equipment Tags */}
                      <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                        {bed.hasOxygen && (
                          <Chip
                            icon={<AirIcon sx={{ fontSize: '14px !important', color: '#0284C7' }} />}
                            label="O2 Piped"
                            size="small"
                            sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 600 }}
                          />
                        )}
                        {bed.hasVentilator && (
                          <Chip
                            label="Ventilator"
                            size="small"
                            sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }}
                          />
                        )}
                      </Stack>

                      {/* Patient Info If Occupied */}
                      {isOccupied && (
                        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#F8FAFC', mb: 1.5 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                            {bed.patientName}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {bed.patientId} • {bed.ageGender}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#334155', mt: 0.5 }}>
                            <strong>Diag:</strong> {bed.diagnosis}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                            <strong>Doc:</strong> {bed.consultant}
                          </Typography>
                        </Paper>
                      )}

                      {/* Sanitizing / Available Placeholder */}
                      {isAvailable && (
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                          <CheckCircleOutlinedIcon sx={{ fontSize: 32, color: '#22C55E', opacity: 0.8 }} />
                          <Typography sx={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600, mt: 0.5 }}>
                            Bed Ready for Patient
                          </Typography>
                        </Box>
                      )}

                      {isSanitizing && (
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                          <CleaningServicesIcon sx={{ fontSize: 32, color: '#F59E0B', opacity: 0.8 }} />
                          <Typography sx={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 600, mt: 0.5 }}>
                            Housekeeping in Progress
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Action Footer */}
                    <Box sx={{ pt: 1, borderTop: '1px solid #F1F5F9' }}>
                      {isOccupied && (
                        <Stack direction="row" spacing={1}>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            onClick={() => router.push(`/portal/patients/${bed.patientId || 'PAT-2401'}`)}
                            sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: '6px' }}
                          >
                            View EHR
                          </Button>
                          <Button
                            fullWidth
                            size="small"
                            color="error"
                            variant="text"
                            onClick={() => handleDischargeBed(bed.id)}
                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                          >
                            Discharge
                          </Button>
                        </Stack>
                      )}

                      {isAvailable && (
                        <Button
                          fullWidth
                          size="small"
                          variant="contained"
                          onClick={() => handleOpenAdmit(bed)}
                          sx={{ bgcolor: '#0F766E', textTransform: 'none', fontSize: '0.75rem', borderRadius: '6px', fontWeight: 700 }}
                        >
                          Admit Patient Here
                        </Button>
                      )}

                      {isSanitizing && (
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          color="warning"
                          onClick={() => handleMarkClean(bed.id)}
                          sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: '6px' }}
                        >
                          Mark Ready
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* ─── TAB 1: Inpatient Table DataGrid ─── */}
      {activeTab === 1 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', bgcolor: '#FFFFFF', height: 600 }}>
          <DataGrid
            rows={filteredBeds}
            columns={tableColumns}
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
      )}

      {/* ─── Modal: Admit Patient to Bed ─── */}
      <Dialog
        open={openAdmitModal}
        onClose={() => setOpenAdmitModal(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '14px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
          Inpatient Admission & Bed Allocation
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mb: 2 }}>
            Assigning patient to{' '}
            <strong style={{ color: '#0F766E' }}>
              {selectedBedForAdmit ? `${selectedBedForAdmit.bedNumber} (${selectedBedForAdmit.ward})` : 'First Available Vacant Bed'}
            </strong>
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Patient Full Name"
              size="small"
              fullWidth
              value={newAdmission.patientName}
              onChange={(e) => setNewAdmission({ ...newAdmission, patientName: e.target.value })}
              placeholder="e.g. Suman Roy"
            />
            <TextField
              label="Patient UHID / ID (Optional)"
              size="small"
              fullWidth
              value={newAdmission.patientId}
              onChange={(e) => setNewAdmission({ ...newAdmission, patientId: e.target.value })}
              placeholder="e.g. PAT-2489"
            />
            <TextField
              label="Age & Gender"
              size="small"
              fullWidth
              value={newAdmission.ageGender}
              onChange={(e) => setNewAdmission({ ...newAdmission, ageGender: e.target.value })}
              placeholder="e.g. 52 / M"
            />
            <TextField
              label="Attending Consultant"
              size="small"
              fullWidth
              value={newAdmission.consultant}
              onChange={(e) => setNewAdmission({ ...newAdmission, consultant: e.target.value })}
              placeholder="e.g. Dr. S. K. Sen"
            />
            <TextField
              label="Provisional Admission Diagnosis"
              size="small"
              fullWidth
              value={newAdmission.diagnosis}
              onChange={(e) => setNewAdmission({ ...newAdmission, diagnosis: e.target.value })}
              placeholder="e.g. Acute Appendicitis / Hypertension"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setOpenAdmitModal(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAdmission}
            sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#0D6861' } }}
          >
            Confirm Admission
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
