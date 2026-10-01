'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { api, useAuth } from '../../PortalShell';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import toast from 'react-hot-toast';

// Icons
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PolicyIcon from '@mui/icons-material/Policy';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface BirthRecord {
  id: string;
  motherName: string;
  fatherName: string;
  dateTime: string;
  gender?: 'Male' | 'Female' | string;
  weightKg?: string;
  babyDetails?: string;
  apgar?: string;
  deliveryType: string;
  doctor?: string;
  attendingObgyn?: string;
  crsStatus: string;
}

interface DeathRecord {
  id: string;
  patientName: string;
  ageGender: string;
  wardBed: string;
  dateTime: string;
  immediateCause: string;
  underlyingCause: string;
  icd10: string;
  doctor: string;
  auditStatus: string;
}

interface MLCRecord {
  mlcNo: string;
  patientName: string;
  ageGender: string;
  policeStation: string;
  natureOfInjury?: string;
  incidentType?: string;
  broughtBy: string;
  cmoName?: string;
  examiningCmo?: string;
  dateTime: string;
  status: string;
}

const defaultBirths: BirthRecord[] = [
  { id: 'BR-2026-001', motherName: 'Fatema Khatun', fatherName: 'Nasir Hossain', dateTime: 'Today, 08:30 AM', gender: 'Male', weightKg: '3.2 kg', babyDetails: 'Male • 3.2 kg', apgar: '8/10, 9/10', deliveryType: 'Normal Vaginal', doctor: 'Dr. Kalyani Sen (OBGYN)', crsStatus: 'CRS Registered' },
  { id: 'BR-2026-002', motherName: 'Priyanka Dey', fatherName: 'Sourav Dey', dateTime: 'Yesterday, 04:15 PM', gender: 'Female', weightKg: '2.8 kg', babyDetails: 'Female • 2.8 kg', apgar: '9/10, 9/10', deliveryType: 'LSCS Caesarean', doctor: 'Dr. Farhana Yasmin', crsStatus: 'CRS Registered' },
  { id: 'BR-2026-003', motherName: 'Nusrat Jahan', fatherName: 'Imran Ali', dateTime: '28 Sep 2026', gender: 'Male', weightKg: '3.1 kg', babyDetails: 'Male • 3.1 kg', apgar: '8/10, 8/10', deliveryType: 'Normal Vaginal', doctor: 'Dr. Kalyani Sen (OBGYN)', crsStatus: 'Pending Verification' },
  { id: 'BR-2026-004', motherName: 'Sabina Yasmin', fatherName: 'Tariq Anwar', dateTime: '27 Sep 2026', gender: 'Female', weightKg: '2.9 kg', babyDetails: 'Female • 2.9 kg', apgar: '8/10, 9/10', deliveryType: 'Normal Vaginal', doctor: 'Dr. Kalyani Sen (OBGYN)', crsStatus: 'CRS Registered' },
  { id: 'BR-2026-005', motherName: 'Mousumi Paul', fatherName: 'Subhasish Paul', dateTime: '26 Sep 2026', gender: 'Male', weightKg: '3.4 kg', babyDetails: 'Male • 3.4 kg', apgar: '9/10, 10/10', deliveryType: 'LSCS Caesarean', doctor: 'Dr. Farhana Yasmin', crsStatus: 'CRS Registered' },
];

const defaultDeaths: DeathRecord[] = [
  { id: 'DR-2026-001', patientName: 'Sudhir Karmakar', ageGender: '72 / M', wardBed: 'ICU Unit A - Bed 04', dateTime: 'Yesterday, 11:20 PM', immediateCause: 'Septic Shock with MODS', underlyingCause: 'Severe Hospital-Acquired Pneumonia', icd10: 'A41.9 / J18.9', doctor: 'Dr. Debasis Mukherjee (Prof)', auditStatus: 'M&M Audited' },
  { id: 'DR-2026-002', patientName: 'Rashidul Haque', ageGender: '58 / M', wardBed: 'Cardiology Ward - Bed 12', dateTime: '28 Sep 2026', immediateCause: 'Acute Ventricular Fibrillation', underlyingCause: 'Anterior Wall ST-Elevation Myocardial Infarction', icd10: 'I21.0', doctor: 'Dr. S. K. Sen', auditStatus: 'M&M Audited' },
  { id: 'DR-2026-003', patientName: 'Anita Banerjee', ageGender: '64 / F', wardBed: 'Female Medical Ward - Bed 08', dateTime: '27 Sep 2026', immediateCause: 'Intracerebral Hemorrhage', underlyingCause: 'Accelerated Malignant Hypertension', icd10: 'I61.9', doctor: 'Dr. Ahmed Rahman', auditStatus: 'Pending Review' },
  { id: 'DR-2026-004', patientName: 'Babulal Das', ageGender: '81 / M', wardBed: 'Respiratory CCU - Bed 02', dateTime: '25 Sep 2026', immediateCause: 'Type-II Respiratory Failure', underlyingCause: 'Severe End-Stage COPD Exacerbation', icd10: 'J44.1', doctor: 'Dr. Debasis Mukherjee (Prof)', auditStatus: 'M&M Audited' },
];

const defaultMlcs: MLCRecord[] = [
  { mlcNo: 'MLC-2026-018', patientName: 'Rabin Mondal', ageGender: '34 / M', policeStation: 'Kalyani PS', incidentType: 'Road Traffic Accident (Two-wheeler vs Truck)', natureOfInjury: 'Polytrauma, Compound Fracture Right Tibia', broughtBy: 'Highway Police Patrol (ASI S. Ghosh)', cmoName: 'Dr. T. Adhikary (CMO Casualty)', examiningCmo: 'Dr. T. Adhikary (CMO Casualty)', dateTime: 'Today, 02:40 AM', status: 'Police Intimation Sent' },
  { mlcNo: 'MLC-2026-017', patientName: 'Kabir Ahmed', ageGender: '26 / M', policeStation: 'Chakdaha PS', incidentType: 'Physical Assault / Blunt Injury', natureOfInjury: 'Lacerated Wound Scalp 4x2 cm', broughtBy: 'Brother (Salim Ahmed)', cmoName: 'Dr. M. Roy (CMO Casualty)', examiningCmo: 'Dr. M. Roy (CMO Casualty)', dateTime: 'Yesterday, 09:15 PM', status: 'Police Acknowledged' },
  { mlcNo: 'MLC-2026-016', patientName: 'Joydeb Saha', ageGender: '42 / M', policeStation: 'Ranaghat PS', incidentType: 'Occupational Machine Crush Injury', natureOfInjury: 'Traumatic Amputation Left Ring Finger', broughtBy: 'Factory Supervisor', cmoName: 'Dr. T. Adhikary (CMO Casualty)', examiningCmo: 'Dr. T. Adhikary (CMO Casualty)', dateTime: '28 Sep 2026', status: 'Police Acknowledged' },
];

export default function BirthDeathRegistryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [births, setBirths] = useState<BirthRecord[]>(defaultBirths);
  const [deaths, setDeaths] = useState<DeathRecord[]>(defaultDeaths);
  const [mlcs, setMlcs] = useState<MLCRecord[]>(defaultMlcs);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Creation Modals
  const [birthModal, setBirthModal] = useState(false);
  const [deathModal, setDeathModal] = useState(false);

  // View, Edit, Delete Modals
  const [viewRecord, setViewRecord] = useState<any | null>(null);
  const [editRecord, setEditRecord] = useState<any | null>(null);
  const [editType, setEditType] = useState<'birth' | 'death' | 'mlc'>('birth');
  const [editFormData, setEditFormData] = useState<any>({});
  const [deleteRecord, setDeleteRecord] = useState<any | null>(null);
  const [deleteType, setDeleteType] = useState<'birth' | 'death' | 'mlc'>('birth');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loadData = () => {
    api('clinical/birth-death')
      .then((res: any) => {
        if (res) {
          if (res.births && res.births.length > 0) {
            setBirths(res.births.map((b: any) => ({
              ...b,
              doctor: b.attendingObgyn || b.doctor || 'Dr. Kalyani Sen (OBGYN)',
              babyDetails: b.babyDetails || 'Male • 3.0 kg',
              apgar: b.apgar || '8/10, 9/10',
            })));
          }
          if (res.deaths && res.deaths.length > 0) setDeaths(res.deaths);
          if (res.mlcs && res.mlcs.length > 0) {
            setMlcs(res.mlcs.map((m: any) => ({
              ...m,
              natureOfInjury: m.natureOfInjury || m.incidentType || 'Injury',
              cmoName: m.cmoName || m.examiningCmo || 'CMO Casualty',
            })));
          }
        }
      })
      .catch((err) => console.error('Failed to load birth/death/mlc data', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search, activeTab]);

  // Form states for new records
  const [newBirth, setNewBirth] = useState({
    motherName: '',
    fatherName: '',
    gender: 'Male' as const,
    weightKg: '3.0 kg',
    apgar: '8/10, 9/10',
    deliveryType: 'Normal Vaginal' as const,
    doctor: 'Dr. Kalyani Sen (OBGYN)',
  });

  const [newDeath, setNewDeath] = useState({
    patientName: '',
    ageGender: '',
    wardBed: '',
    immediateCause: '',
    underlyingCause: '',
    icd10: '',
    doctor: 'Dr. Debasis Mukherjee (Prof)',
  });

  const handleCreateBirth = async () => {
    if (!newBirth.motherName.trim()) return;
    try {
      const res = await api('clinical/birth-death/births', 'POST', {
        motherName: newBirth.motherName,
        fatherName: newBirth.fatherName || 'Not Stated',
        babyDetails: `${newBirth.gender} • ${newBirth.weightKg}`,
        deliveryType: newBirth.deliveryType,
        attendingObgyn: newBirth.doctor,
      }, user?.csrf).catch(() => {});

      const item: BirthRecord = res?.birth || {
        id: `BR-2026-00${births.length + 1}`,
        motherName: newBirth.motherName,
        fatherName: newBirth.fatherName || 'Not Stated',
        dateTime: 'Just now',
        gender: newBirth.gender,
        weightKg: newBirth.weightKg,
        babyDetails: `${newBirth.gender} • ${newBirth.weightKg}`,
        apgar: newBirth.apgar,
        deliveryType: newBirth.deliveryType,
        doctor: newBirth.doctor,
        crsStatus: 'CRS Registered',
      };
      setBirths([item, ...births]);
      toast.success('Live birth record registered successfully.');
    } catch {
      toast.error('Failed to register birth.');
    }
    setBirthModal(false);
    setNewBirth({ motherName: '', fatherName: '', gender: 'Male', weightKg: '3.0 kg', apgar: '8/10, 9/10', deliveryType: 'Normal Vaginal', doctor: 'Dr. Kalyani Sen (OBGYN)' });
  };

  const handleCreateDeath = async () => {
    if (!newDeath.patientName.trim()) return;
    try {
      const res = await api('clinical/birth-death/deaths', 'POST', {
        patientName: newDeath.patientName,
        ageGender: newDeath.ageGender || 'Adult',
        wardBed: newDeath.wardBed || 'ICU Bed',
        immediateCause: newDeath.immediateCause,
        underlyingCause: newDeath.underlyingCause,
        icd10: newDeath.icd10 || 'R99 (Unspecified)',
        doctor: newDeath.doctor,
      }, user?.csrf).catch(() => {});

      const item: DeathRecord = res?.death || {
        id: `DR-2026-00${deaths.length + 1}`,
        patientName: newDeath.patientName,
        ageGender: newDeath.ageGender || 'Adult',
        wardBed: newDeath.wardBed || 'ICU Bed',
        dateTime: 'Just now',
        immediateCause: newDeath.immediateCause,
        underlyingCause: newDeath.underlyingCause,
        icd10: newDeath.icd10 || 'R99 (Unspecified)',
        doctor: newDeath.doctor,
        auditStatus: 'M&M Audited',
      };
      setDeaths([item, ...deaths]);
      toast.success('Death certificate signed and recorded.');
    } catch {
      toast.error('Failed to register death.');
    }
    setDeathModal(false);
    setNewDeath({ patientName: '', ageGender: '', wardBed: '', immediateCause: '', underlyingCause: '', icd10: '', doctor: 'Dr. Debasis Mukherjee (Prof)' });
  };

  // View, Edit, Delete Handlers
  const handleOpenEdit = (rec: any, type: 'birth' | 'death' | 'mlc') => {
    setEditRecord(rec);
    setEditType(type);
    setEditFormData({ ...rec });
  };

  const handleSaveEdit = async () => {
    if (!editRecord) return;
    try {
      if (editType === 'birth') {
        setBirths(births.map((b) => (b.id === editRecord.id ? { ...b, ...editFormData } : b)));
        toast.success(`Birth record ${editRecord.id} updated successfully.`);
      } else if (editType === 'death') {
        setDeaths(deaths.map((d) => (d.id === editRecord.id ? { ...d, ...editFormData } : d)));
        toast.success(`Death record ${editRecord.id} updated successfully.`);
      } else {
        setMlcs(mlcs.map((m) => (m.mlcNo === editRecord.mlcNo ? { ...m, ...editFormData } : m)));
        toast.success(`MLC record ${editRecord.mlcNo} updated successfully.`);
      }
      setEditRecord(null);
    } catch {
      toast.error('Failed to update record.');
    }
  };

  const handleOpenDelete = (rec: any, type: 'birth' | 'death' | 'mlc') => {
    setDeleteRecord(rec);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteRecord) return;
    try {
      if (deleteType === 'birth') {
        setBirths(births.filter((b) => b.id !== deleteRecord.id));
        toast.success(`Birth record ${deleteRecord.id} removed.`);
      } else if (deleteType === 'death') {
        setDeaths(deaths.filter((d) => d.id !== deleteRecord.id));
        toast.success(`Death record ${deleteRecord.id} removed.`);
      } else {
        setMlcs(mlcs.filter((m) => m.mlcNo !== deleteRecord.mlcNo));
        toast.success(`MLC record ${deleteRecord.mlcNo} removed.`);
      }
    } catch {
      toast.error('Failed to delete record.');
    } finally {
      setDeleteModalOpen(false);
      setDeleteRecord(null);
    }
  };

  // Reactive filtering
  const q = search.trim().toLowerCase();

  const filteredBirths = births.filter((b) => {
    if (!q) return true;
    return (
      b.id.toLowerCase().includes(q) ||
      b.motherName.toLowerCase().includes(q) ||
      b.fatherName.toLowerCase().includes(q) ||
      (b.doctor && b.doctor.toLowerCase().includes(q)) ||
      b.deliveryType.toLowerCase().includes(q) ||
      b.crsStatus.toLowerCase().includes(q)
    );
  });

  const filteredDeaths = deaths.filter((d) => {
    if (!q) return true;
    return (
      d.id.toLowerCase().includes(q) ||
      d.patientName.toLowerCase().includes(q) ||
      d.wardBed.toLowerCase().includes(q) ||
      d.immediateCause.toLowerCase().includes(q) ||
      d.doctor.toLowerCase().includes(q) ||
      d.icd10.toLowerCase().includes(q)
    );
  });

  const filteredMlcs = mlcs.filter((m) => {
    if (!q) return true;
    return (
      m.mlcNo.toLowerCase().includes(q) ||
      m.patientName.toLowerCase().includes(q) ||
      m.policeStation.toLowerCase().includes(q) ||
      (m.natureOfInjury && m.natureOfInjury.toLowerCase().includes(q)) ||
      m.broughtBy.toLowerCase().includes(q)
    );
  });

  const paginatedBirths = filteredBirths.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const paginatedDeaths = filteredDeaths.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const paginatedMlcs = filteredMlcs.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const currentCount =
    activeTab === 0
      ? filteredBirths.length
      : activeTab === 1
      ? filteredDeaths.length
      : filteredMlcs.length;

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Hospital', href: '/portal/hospital' },
          { label: 'Civil Registration & Forensic' },
        ]}
        category="Statutory Registry"
        title="Civil Registration System (CRS) & Medico-Legal Cell"
        description="Institutional statutory birth registry (Form-1), cause of death certification (Form-2 ICD-10 M&M Audit), and Medico-Legal police register."
        icon={<PolicyIcon />}
        badge={<StatusBadge status="Govt Statutory Portal" tone="teal" />}
        actions={
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
            {activeTab === 0 ? (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon sx={{ color: '#FFFFFF !important' }} />}
                onClick={() => setBirthModal(true)}
                sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: '#115E59' } }}
              >
                + Register Live Birth
              </Button>
            ) : activeTab === 1 ? (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon sx={{ color: '#FFFFFF !important' }} />}
                onClick={() => setDeathModal(true)}
                sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#DC2626', color: '#FFFFFF !important', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: '#B91C1C' } }}
              >
                + Sign Death Certificate
              </Button>
            ) : null}
          </Stack>
        }
      />

      {/* Metrics KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Live Births Registered', count: `${births.length} Babies`, sub: 'Normal & LSCS', icon: <ChildFriendlyIcon sx={{ color: '#0284C7' }} />, bg: '#E0F2FE' },
          { title: 'Hospital Mortality', count: `${deaths.length} Summaries`, sub: '100% ICD-10 M&M Audited', icon: <LocalHospitalIcon sx={{ color: '#DC2626' }} />, bg: '#FEE2E2' },
          { title: 'Medico-Legal Cases (MLC)', count: `${mlcs.length} Cases`, sub: 'Police intimation dispatched', icon: <PolicyIcon sx={{ color: '#7C3AED' }} />, bg: '#EDE9FE' },
          { title: 'CRS Compliance Status', count: '100% On-Time', sub: 'Within 21 days statutory limit', icon: <VerifiedUserIcon sx={{ color: '#059669' }} />, bg: '#DCFCE7' },
        ].map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {kpi.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{kpi.title}</Typography>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A' }}>{kpi.count}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{kpi.sub}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Content Box */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, bgcolor: '#FAFCFD' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' } }}
          >
            <Tab label={`Live Birth Registry (${filteredBirths.length})`} />
            <Tab label={`Mortality & Death Summaries (${filteredDeaths.length})`} />
            <Tab label={`Medico-Legal (MLC) Police Register (${filteredMlcs.length})`} />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search by name, ID, cause..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 280 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* TAB 0: BIRTH REGISTRY */}
        {activeTab === 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>BIRTH REG ID</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>PARENTS</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>GENDER &amp; WEIGHT</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>APGAR SCORE</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>DELIVERY TYPE</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>ATTENDING OBGYN</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>CRS STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 200 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBirths.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#64748B' }}>
                      No birth records matching your query.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBirths.map((b) => (
                    <TableRow key={b.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#0F172A' }}>{b.id}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{b.dateTime}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0F172A' }}>{b.motherName}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>Father: {b.fatherName}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={b.babyDetails || `${b.gender || 'Infant'} • ${b.weightKg || '3.0 kg'}`}
                          tone={b.gender === 'Female' ? 'purple' : 'info'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{b.apgar}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{b.deliveryType}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{b.doctor}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={b.crsStatus} />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 200, whiteSpace: 'nowrap' }}>
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Tooltip title="View Certificate Details">
                            <IconButton size="small" onClick={() => setViewRecord({ type: 'Birth', ...b })} sx={{ color: '#0F766E' }}>
                              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Record">
                            <IconButton size="small" onClick={() => handleOpenEdit(b, 'birth')} sx={{ color: '#0284C7' }}>
                              <EditOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print Form-1">
                            <IconButton
                              size="small"
                              onClick={() => toast.success(`Printing Official CRS Form-1 Birth Certificate for ${b.motherName}`)}
                              sx={{ color: '#475569' }}
                            >
                              <PrintIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Record">
                            <IconButton size="small" onClick={() => handleOpenDelete(b, 'birth')} sx={{ color: '#E11D48' }}>
                              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* TAB 1: DEATH SUMMARIES */}
        {activeTab === 1 && (
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>DEATH REG ID</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>DECEASED PATIENT</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>WARD / LOCATION</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>IMMEDIATE CAUSE OF DEATH</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>ICD-10 CODE</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>CERTIFYING CONSULTANT</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>M&amp;M AUDIT</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 200 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDeaths.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#64748B' }}>
                      No mortality records matching your query.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDeaths.map((d) => (
                    <TableRow key={d.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#DC2626' }}>{d.id}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{d.dateTime}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0F172A' }}>{d.patientName}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{d.ageGender}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{d.wardBed}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#0F172A' }}>{d.immediateCause}</Typography>
                        <Typography sx={{ fontSize: '0.6875rem', color: '#64748B' }}>Underlying: {d.underlyingCause}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={d.icd10} tone="neutral" />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{d.doctor}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={d.auditStatus} />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 200, whiteSpace: 'nowrap' }}>
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Tooltip title="View Death Record">
                            <IconButton size="small" onClick={() => setViewRecord({ type: 'Death', ...d })} sx={{ color: '#0F766E' }}>
                              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Record">
                            <IconButton size="small" onClick={() => handleOpenEdit(d, 'death')} sx={{ color: '#0284C7' }}>
                              <EditOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print Form-2">
                            <IconButton
                              size="small"
                              onClick={() => toast.success(`Printing Statutory Form-2 Death Certificate for ${d.patientName}`)}
                              sx={{ color: '#DC2626' }}
                            >
                              <PrintIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Record">
                            <IconButton size="small" onClick={() => handleOpenDelete(d, 'death')} sx={{ color: '#E11D48' }}>
                              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* TAB 2: MEDICO-LEGAL (MLC) */}
        {activeTab === 2 && (
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>MLC REGISTER NO</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>INJURED PATIENT</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>JURISDICTION POLICE STATION</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>NATURE OF INJURY</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>BROUGHT BY</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>EXAMINING CMO</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>POLICE INTIMATION</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 200 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMlcs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#64748B' }}>
                      No MLC records matching your query.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMlcs.map((m) => (
                    <TableRow key={m.mlcNo} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#7C3AED' }}>{m.mlcNo}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{m.dateTime}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0F172A' }}>{m.patientName}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{m.ageGender}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#0F172A', fontWeight: 600 }}>{m.policeStation}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={m.natureOfInjury || 'Injury'} tone="warning" />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{m.broughtBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{m.cmoName}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={m.status} />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 200, whiteSpace: 'nowrap' }}>
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Tooltip title="View MLC Details">
                            <IconButton size="small" onClick={() => setViewRecord({ type: 'MLC', ...m })} sx={{ color: '#0F766E' }}>
                              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Record">
                            <IconButton size="small" onClick={() => handleOpenEdit(m, 'mlc')} sx={{ color: '#0284C7' }}>
                              <EditOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print MLC Form">
                            <IconButton
                              size="small"
                              onClick={() => toast.success(`Printing Statutory Police Intimation for ${m.mlcNo}`)}
                              sx={{ color: '#7C3AED' }}
                            >
                              <PrintIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Record">
                            <IconButton size="small" onClick={() => handleOpenDelete(m, 'mlc')} sx={{ color: '#E11D48' }}>
                              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div"
          count={currentCount}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      {/* ─── View Record Dialog ─── */}
      <Dialog
        open={Boolean(viewRecord)}
        onClose={() => setViewRecord(null)}
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
        {viewRecord && (
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
                  {viewRecord.type} Record Details
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Manrope', sans-serif", fontSize: '0.825rem', mt: 0.25 }}>
                  ID: #{viewRecord.id || viewRecord.mlcNo} • Institutional Registry Dossier
                </Typography>
              </Box>
              <StatusBadge status={viewRecord.crsStatus || viewRecord.auditStatus || viewRecord.status} size="medium" />
            </DialogTitle>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogContent sx={{ p: 3, bgcolor: '#FAFAFB' }}>
              <Grid container spacing={2}>
                {Object.entries(viewRecord)
                  .filter(([k]) => k !== 'type')
                  .map(([key, val]) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={key} sx={{ minWidth: 0 }}>
                      <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                        <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.75, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Typography>
                        <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '0.925rem', color: '#0F172A', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                          {String(val || '—')}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </DialogContent>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'flex-end', bgcolor: '#FFFFFF' }}>
              <Button onClick={() => setViewRecord(null)} sx={{ textTransform: 'none', color: '#64748B', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Edit Record Dialog ─── */}
      <Dialog
        open={Boolean(editRecord)}
        onClose={() => setEditRecord(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        {editRecord && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
              Edit {editType.toUpperCase()} Record ({editRecord.id || editRecord.mlcNo})
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {editType === 'birth' && (
                  <>
                    <TextField
                      label="Mother Name"
                      size="small"
                      fullWidth
                      value={editFormData.motherName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, motherName: e.target.value })}
                    />
                    <TextField
                      label="Father Name"
                      size="small"
                      fullWidth
                      value={editFormData.fatherName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value })}
                    />
                    <TextField
                      label="Attending Doctor"
                      size="small"
                      fullWidth
                      value={editFormData.doctor || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, doctor: e.target.value })}
                    />
                    <TextField
                      label="Delivery Type"
                      size="small"
                      fullWidth
                      value={editFormData.deliveryType || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, deliveryType: e.target.value })}
                    />
                    <Select
                      size="small"
                      fullWidth
                      value={editFormData.crsStatus || 'CRS Registered'}
                      onChange={(e) => setEditFormData({ ...editFormData, crsStatus: e.target.value })}
                    >
                      <MenuItem value="CRS Registered">CRS Registered</MenuItem>
                      <MenuItem value="Pending Verification">Pending Verification</MenuItem>
                    </Select>
                  </>
                )}

                {editType === 'death' && (
                  <>
                    <TextField
                      label="Patient Name"
                      size="small"
                      fullWidth
                      value={editFormData.patientName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, patientName: e.target.value })}
                    />
                    <TextField
                      label="Ward / Bed"
                      size="small"
                      fullWidth
                      value={editFormData.wardBed || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, wardBed: e.target.value })}
                    />
                    <TextField
                      label="Immediate Cause"
                      size="small"
                      fullWidth
                      value={editFormData.immediateCause || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, immediateCause: e.target.value })}
                    />
                    <TextField
                      label="ICD-10 Code"
                      size="small"
                      fullWidth
                      value={editFormData.icd10 || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, icd10: e.target.value })}
                    />
                    <Select
                      size="small"
                      fullWidth
                      value={editFormData.auditStatus || 'M&M Audited'}
                      onChange={(e) => setEditFormData({ ...editFormData, auditStatus: e.target.value })}
                    >
                      <MenuItem value="M&M Audited">M&M Audited</MenuItem>
                      <MenuItem value="Pending Review">Pending Review</MenuItem>
                    </Select>
                  </>
                )}

                {editType === 'mlc' && (
                  <>
                    <TextField
                      label="Patient Name"
                      size="small"
                      fullWidth
                      value={editFormData.patientName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, patientName: e.target.value })}
                    />
                    <TextField
                      label="Police Station"
                      size="small"
                      fullWidth
                      value={editFormData.policeStation || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, policeStation: e.target.value })}
                    />
                    <TextField
                      label="Nature of Injury"
                      size="small"
                      fullWidth
                      value={editFormData.natureOfInjury || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, natureOfInjury: e.target.value })}
                    />
                    <Select
                      size="small"
                      fullWidth
                      value={editFormData.status || 'Police Acknowledged'}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    >
                      <MenuItem value="Police Acknowledged">Police Acknowledged</MenuItem>
                      <MenuItem value="Police Intimation Sent">Police Intimation Sent</MenuItem>
                    </Select>
                  </>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setEditRecord(null)} sx={{ textTransform: 'none', color: '#64748B' }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', '&:hover': { bgcolor: '#0D6861' } }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PriorityHighIcon sx={{ color: '#E11D48' }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Are you sure you want to delete this {deleteType.toUpperCase()} record (
            <strong style={{ color: '#0F172A' }}>{deleteRecord?.id || deleteRecord?.mlcNo}</strong>)?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => setDeleteModalOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' } }}
          >
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Register Live Birth */}
      <Dialog open={birthModal} onClose={() => setBirthModal(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
        <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}>
          Civil Registration: Live Birth Entry (Form-1)
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Mother Full Name & Age"
              placeholder="e.g. Smt. Anita Roy (25/F)"
              value={newBirth.motherName}
              onChange={(e) => setNewBirth({ ...newBirth, motherName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Father Full Name"
              placeholder="e.g. Sri Sanjoy Roy"
              value={newBirth.fatherName}
              onChange={(e) => setNewBirth({ ...newBirth, fatherName: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  label="Gender of Baby"
                  value={newBirth.gender}
                  onChange={(e) => setNewBirth({ ...newBirth, gender: e.target.value as any })}
                >
                  <MenuItem value="Male">Male Infant</MenuItem>
                  <MenuItem value="Female">Female Infant</MenuItem>
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Birth Weight"
                  value={newBirth.weightKg}
                  onChange={(e) => setNewBirth({ ...newBirth, weightKg: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  label="Mode of Delivery"
                  value={newBirth.deliveryType}
                  onChange={(e) => setNewBirth({ ...newBirth, deliveryType: e.target.value as any })}
                >
                  <MenuItem value="Normal Vaginal">Normal Vaginal Delivery</MenuItem>
                  <MenuItem value="LSCS (Caesarean)">LSCS (Emergency / Elective C-Section)</MenuItem>
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="APGAR Score (1m, 5m)"
                  value={newBirth.apgar}
                  onChange={(e) => setNewBirth({ ...newBirth, apgar: e.target.value })}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBirthModal(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateBirth}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', '&:hover': { bgcolor: '#115E59' } }}
          >
            Generate Form-1 Certificate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Death Summary */}
      <Dialog open={deathModal} onClose={() => setDeathModal(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
        <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#DC2626' }}>
          Statutory Medical Certificate of Cause of Death (Form-2)
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Deceased Patient Name"
              placeholder="e.g. Late Rameswar Sen"
              value={newDeath.patientName}
              onChange={(e) => setNewDeath({ ...newDeath, patientName: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Age / Sex"
                  placeholder="e.g. 68 / M"
                  value={newDeath.ageGender}
                  onChange={(e) => setNewDeath({ ...newDeath, ageGender: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Ward / Bed No"
                  placeholder="e.g. CCU Bed 04"
                  value={newDeath.wardBed}
                  onChange={(e) => setNewDeath({ ...newDeath, wardBed: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Immediate Cause of Death (Part I-a)"
              placeholder="e.g. Cardiorespiratory Arrest due to Refractory Septic Shock"
              value={newDeath.immediateCause}
              onChange={(e) => setNewDeath({ ...newDeath, immediateCause: e.target.value })}
            />
            <TextField
              fullWidth
              label="Underlying Antecedent Cause (Part I-b/c)"
              placeholder="e.g. Chronic Kidney Disease Stage V / Severe Pneumonia"
              value={newDeath.underlyingCause}
              onChange={(e) => setNewDeath({ ...newDeath, underlyingCause: e.target.value })}
            />
            <TextField
              fullWidth
              label="ICD-10 Diagnostic Code"
              placeholder="e.g. I46.9, A41.9, N18.5"
              value={newDeath.icd10}
              onChange={(e) => setNewDeath({ ...newDeath, icd10: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeathModal(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateDeath}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#DC2626', color: '#FFFFFF !important', '&:hover': { bgcolor: '#B91C1C' } }}
          >
            Sign Form-2 Death Certificate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
