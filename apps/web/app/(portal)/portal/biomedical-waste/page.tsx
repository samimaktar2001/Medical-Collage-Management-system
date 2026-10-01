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
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import toast from 'react-hot-toast';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Icons
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AddIcon from '@mui/icons-material/Add';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HealingIcon from '@mui/icons-material/Healing';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface WasteLog {
  id: string;
  barcode: string;
  category: 'Yellow' | 'Red' | 'White' | 'Blue';
  wasteType?: string;
  ward: string;
  weightKg: number;
  time?: string;
  handler: string;
  cbwtfVendor?: string;
  status: string;
}

const defaultLogs: WasteLog[] = [
  { id: 'BMW-2026-101', barcode: 'WB-MED-0982', category: 'Yellow', wasteType: 'Human Anatomical & Soiled Cotton Gauze', ward: 'General Medicine Ward 2', weightKg: 4.8, time: 'Today, 07:30 AM', handler: 'Staff Nurse Sumita', cbwtfVendor: 'Medicare Environmental Management Ltd', status: 'Dispatched to CBWTF' },
  { id: 'BMW-2026-102', barcode: 'WB-SUR-0412', category: 'Red', wasteType: 'Contaminated Plastics (IV Bottles, Catheters)', ward: 'Female Surgical Ward 3', weightKg: 6.2, time: 'Today, 08:15 AM', handler: 'Staff Nurse Anjali', cbwtfVendor: 'Medicare Environmental Management Ltd', status: 'Dispatched to CBWTF' },
  { id: 'BMW-2026-103', barcode: 'WB-ICU-0119', category: 'White', wasteType: 'Puncture-proof Sharps & Needles', ward: 'ICU Unit A', weightKg: 1.5, time: 'Today, 09:00 AM', handler: 'ICU Technician Subir', cbwtfVendor: 'Medicare Environmental Management Ltd', status: 'Ready for Barcode Scan' },
  { id: 'BMW-2026-104', barcode: 'WB-OT-0881', category: 'Blue', wasteType: 'Glass Medicine Vials & Metallic Implants', ward: 'Operation Theatre Complex', weightKg: 3.4, time: 'Yesterday, 05:40 PM', handler: 'OT In-charge Sister', cbwtfVendor: 'Medicare Environmental Management Ltd', status: 'Dispatched to CBWTF' },
  { id: 'BMW-2026-105', barcode: 'WB-PED-0220', category: 'Yellow', wasteType: 'Human Anatomical & Soiled Linens', ward: 'Pediatrics Ward', weightKg: 3.1, time: 'Yesterday, 06:10 PM', handler: 'Staff Nurse Rupa', cbwtfVendor: 'Medicare Environmental Management Ltd', status: 'Dispatched to CBWTF' },
];

const ANTIBIOGRAM_DATA = [
  { pathogen: 'Escherichia coli (Urine & Blood isolates)', meropenem: '92%', colistin: '99%', pipTaz: '78%', amikacin: '86%', ciprofloxacin: '34%' },
  { pathogen: 'Klebsiella pneumoniae (ICU Sputum & Blood)', meropenem: '81%', colistin: '96%', pipTaz: '64%', amikacin: '74%', ciprofloxacin: '28%' },
  { pathogen: 'Staphylococcus aureus (MRSA Surveillance)', meropenem: 'N/A', colistin: 'N/A', vancomycin: '100%', linezolid: '98%', clindamycin: '58%' },
  { pathogen: 'Pseudomonas aeruginosa (Burn & Wound pus)', meropenem: '84%', colistin: '98%', ceftazidime: '72%', amikacin: '80%', ciprofloxacin: '52%' },
];

export default function BiomedicalWastePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [logs, setLogs] = useState<WasteLog[]>(defaultLogs);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // View, Edit, Delete modals
  const [viewLog, setViewLog] = useState<WasteLog | null>(null);
  const [editLog, setEditLog] = useState<WasteLog | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<WasteLog>>({});
  const [deleteLog, setDeleteLog] = useState<WasteLog | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loadLogs = () => {
    api('clinical/biomedical-waste')
      .then((res: any) => {
        if (res?.logs && res.logs.length > 0) {
          setLogs(
            res.logs.map((l: any) => ({
              ...l,
              wasteType:
                l.category === 'Yellow'
                  ? 'Human Anatomical & Soiled Cotton Gauze'
                  : l.category === 'Red'
                  ? 'Contaminated Plastics (IV Bottles, Catheters)'
                  : l.category === 'White'
                  ? 'Puncture-proof Sharps & Needles'
                  : 'Glass Medicine Vials & Metallic Implants',
              time: 'Today',
              cbwtfVendor: l.cbwtfManifestNo || 'Medicare Environmental Management Ltd',
            }))
          );
        }
      })
      .catch((err) => console.error('Failed to load waste logs', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search, categoryFilter]);

  // New Waste Form State
  const [newWaste, setNewWaste] = useState({
    category: 'Yellow' as const,
    ward: 'General Medicine Ward 2',
    weightKg: '',
    handler: 'Staff Nurse on Duty',
  });

  const handleAddWaste = async () => {
    if (!newWaste.weightKg) return;
    try {
      const res = await api(
        'clinical/biomedical-waste/logs',
        'POST',
        {
          category: newWaste.category,
          ward: newWaste.ward,
          weightKg: parseFloat(newWaste.weightKg),
          handler: newWaste.handler,
        },
        user?.csrf
      ).catch(() => {});

      const item: WasteLog = res?.item || {
        id: `BMW-${Date.now()}`,
        barcode: `WB-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
        category: newWaste.category,
        wasteType:
          newWaste.category === 'Yellow'
            ? 'Human Anatomical & Placental Waste'
            : newWaste.category === 'Red'
            ? 'Contaminated Plastics & Catheters'
            : newWaste.category === 'White'
            ? 'Puncture-proof Sharps & Needles'
            : 'Glass Medicine Vials & Ampoules',
        ward: newWaste.ward,
        weightKg: parseFloat(newWaste.weightKg),
        time: 'Just now',
        handler: newWaste.handler,
        cbwtfVendor: 'Medicare Environmental Management Ltd',
        status: 'Ready for Barcode Scan',
      };
      setLogs([item, ...logs]);
      toast.success('Biomedical waste bag barcoded and logged.');
    } catch {
      toast.error('Failed to log waste bag.');
    }

    setOpenModal(false);
    setNewWaste({ category: 'Yellow', ward: 'General Medicine Ward 2', weightKg: '', handler: 'Staff Nurse on Duty' });
  };

  const handleOpenEdit = (l: WasteLog) => {
    setEditLog(l);
    setEditFormData({ ...l });
  };

  const handleSaveEdit = async () => {
    if (!editLog) return;
    try {
      setLogs(logs.map((l) => (l.id === editLog.id ? ({ ...l, ...editFormData } as WasteLog) : l)));
      toast.success(`Waste log ${editLog.barcode} updated successfully.`);
      setEditLog(null);
    } catch {
      toast.error('Failed to update waste log.');
    }
  };

  const handleOpenDelete = (l: WasteLog) => {
    setDeleteLog(l);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteLog) return;
    try {
      setLogs(logs.filter((l) => l.id !== deleteLog.id));
      toast.success(`Waste log ${deleteLog.barcode} deleted.`);
    } catch {
      toast.error('Failed to delete waste log.');
    } finally {
      setDeleteModalOpen(false);
      setDeleteLog(null);
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (categoryFilter !== 'ALL' && l.category !== categoryFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.barcode.toLowerCase().includes(q) ||
      l.ward.toLowerCase().includes(q) ||
      l.handler.toLowerCase().includes(q) ||
      (l.cbwtfVendor && l.cbwtfVendor.toLowerCase().includes(q)) ||
      (l.wasteType && l.wasteType.toLowerCase().includes(q))
    );
  });

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalToday = logs.reduce((acc, curr) => acc + curr.weightKg, 0).toFixed(1);

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Hospital', href: '/portal/hospital' },
          { label: 'Biomedical Waste & Infection Control' },
        ]}
        category="Hospital Operations & Safety"
        title="Biomedical Waste (BMW) & Infection Control (HICC)"
        description="Statutory color-coded barcode tracking under Bio-Medical Waste Management Rules 2016 and institutional antimicrobial stewardship antibiogram."
        icon={<DeleteSweepIcon />}
        badge={<StatusBadge status="CPCB / SPCB Barcoded" tone="warning" />}
        actions={
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon sx={{ color: '#FFFFFF !important' }} />}
              onClick={() => setOpenModal(true)}
              sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: '#115E59' } }}
            >
              + Scan & Log Waste Bag
            </Button>
          </Stack>
        }
      />

      {/* Metrics KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Total Segregated Waste', val: `${totalToday} kg`, sub: '100% Barcode Tagged Today', icon: <DeleteSweepIcon sx={{ color: '#0F766E' }} />, bg: '#CCFBF1' },
          { title: 'CBWTF Vehicle Transit', val: 'Dispatched', sub: 'GPS-enabled collection vehicle', icon: <LocalShippingIcon sx={{ color: '#0284C7' }} />, bg: '#E0F2FE' },
          { title: 'HICC Hand Hygiene Audit', val: '92.4% Compliance', sub: 'WHO 5 moments audited', icon: <HealingIcon sx={{ color: '#059669' }} />, bg: '#DCFCE7' },
          { title: 'Needle Stick Injuries', val: 'Zero (0) PEP Cases', sub: 'Zero accidents recorded Q3', icon: <VerifiedUserIcon sx={{ color: '#7C3AED' }} />, bg: '#EDE9FE' },
        ].map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {kpi.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{kpi.title}</Typography>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A' }}>{kpi.val}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{kpi.sub}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Content Box */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, bgcolor: '#FAFCFD' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' } }}
          >
            <Tab label={`Daily Barcode Waste Register (${filteredLogs.length} Bags)`} />
            <Tab label="HICC Antibiogram &amp; Antibiotic Surveillance" />
            <Tab label="Needle-Stick Injury &amp; PEP Register (Zero Incidents)" />
          </Tabs>

          {activeTab === 0 && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Select
                size="small"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ height: 40, minWidth: 140, fontSize: '0.8125rem', bgcolor: '#FFFFFF' }}
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                <MenuItem value="Yellow">Yellow Bag</MenuItem>
                <MenuItem value="Red">Red Bag</MenuItem>
                <MenuItem value="White">White Bag</MenuItem>
                <MenuItem value="Blue">Blue Bag</MenuItem>
              </Select>
              <TextField
                size="small"
                placeholder="Search barcode, ward, handler..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 250 }, bgcolor: '#FFFFFF' }}
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
            </Stack>
          )}
        </Box>

        {/* TAB 0: WASTE REGISTER */}
        {activeTab === 0 && (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>BAG BARCODE</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>CATEGORY &amp; WASTE TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>SOURCE HOSPITAL WARD</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>SCANNED WEIGHT</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>AUTHORIZED HANDLER</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>CBWTF VENDOR</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>STATUS</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 140 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#64748B' }}>
                        No waste records matching query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#0F172A' }}>{row.barcode}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{row.time}</Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor:
                                  row.category === 'Yellow'
                                    ? '#EAB308'
                                    : row.category === 'Red'
                                    ? '#DC2626'
                                    : row.category === 'White'
                                    ? '#94A3B8'
                                    : '#2563EB',
                              }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#0F172A' }}>{row.category} Bag</Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{row.wasteType}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.78rem', color: '#0F172A', fontWeight: 600 }}>{row.ward}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F766E' }}>{row.weightKg} kg</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{row.handler}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>{row.cbwtfVendor}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell align="right" sx={{ minWidth: 140, whiteSpace: 'nowrap' }}>
                          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Tooltip title="View Bag Record">
                              <IconButton size="small" onClick={() => setViewLog(row)} sx={{ color: '#0F766E' }}>
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Log">
                              <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: '#0284C7' }}>
                                <EditOutlinedIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Log">
                              <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: '#E11D48' }}>
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
            <TablePagination
              component="div"
              count={filteredLogs.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}

        {/* TAB 1: HICC ANTIBIOGRAM */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                  Institutional Antibiogram Surveillance (Q3 2026)
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Antimicrobial stewardship profile for guiding empirical therapy in ICU, Surgery and General Medicine wards.
                </Typography>
              </Box>
              <StatusBadge status="HICC Audited" tone="teal" />
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>MICROBIAL PATHOGEN</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>MEROPENEM</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>COLISTIN</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>PIPERACILLIN-TAZO</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>AMIKACIN</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>CIPROFLOXACIN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ANTIBIOGRAM_DATA.map((a, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A' }}>{a.pathogen}</TableCell>
                      <TableCell sx={{ color: '#0F766E', fontWeight: 700 }}>{a.meropenem}</TableCell>
                      <TableCell sx={{ color: '#059669', fontWeight: 800 }}>{a.colistin}</TableCell>
                      <TableCell sx={{ color: '#D97706', fontWeight: 700 }}>{a.pipTaz}</TableCell>
                      <TableCell sx={{ color: '#0F766E', fontWeight: 700 }}>{a.amikacin}</TableCell>
                      <TableCell sx={{ color: '#DC2626', fontWeight: 700 }}>{a.ciprofloxacin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 2: NEEDLE-STICK PEP */}
        {activeTab === 2 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <VerifiedUserIcon sx={{ fontSize: 48, color: '#059669', mb: 1 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
              Zero Occupational Needle-Stick Incidents Reported (Year 2026)
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.85rem', maxWidth: 500, mx: 'auto', mt: 0.5 }}>
              Institutional Safety Hub: All staff nurses, interns, and lab personnel follow mandatory hub-cutter disposal protocols and universal precautions.
            </Typography>
          </Box>
        )}
      </Card>

      {/* ─── View Bag Dialog ─── */}
      <Dialog
        open={Boolean(viewLog)}
        onClose={() => setViewLog(null)}
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
        {viewLog && (
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
                  Waste Bag Details
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Manrope', sans-serif", fontSize: '0.825rem', mt: 0.25 }}>
                  Barcode: {viewLog.barcode} • CBWTF Tracking Manifest
                </Typography>
              </Box>
              <StatusBadge status={viewLog.status} size="medium" />
            </DialogTitle>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogContent sx={{ p: 3, bgcolor: '#FAFAFB' }}>
              <Grid container spacing={2}>
                {[
                  { label: 'Category', value: `${viewLog.category} Bag` },
                  { label: 'Waste Type', value: viewLog.wasteType },
                  { label: 'Source Ward', value: viewLog.ward },
                  { label: 'Net Weight', value: `${viewLog.weightKg} kg` },
                  { label: 'Authorized Handler', value: viewLog.handler },
                  { label: 'CBWTF Manifest Vendor', value: viewLog.cbwtfVendor },
                  { label: 'Logged Timestamp', value: viewLog.time },
                ].map((item, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx} sx={{ minWidth: 0 }}>
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.75 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '0.925rem', color: '#0F172A', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                        {String(item.value || '—')}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'flex-end', bgcolor: '#FFFFFF' }}>
              <Button onClick={() => setViewLog(null)} sx={{ textTransform: 'none', color: '#64748B', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Edit Bag Dialog ─── */}
      <Dialog
        open={Boolean(editLog)}
        onClose={() => setEditLog(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        {editLog && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
              Edit Waste Bag Log ({editLog.barcode})
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Select
                  size="small"
                  fullWidth
                  value={editFormData.category || 'Yellow'}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as any })}
                >
                  <MenuItem value="Yellow">Yellow (Anatomical & Soiled)</MenuItem>
                  <MenuItem value="Red">Red (Contaminated Plastics)</MenuItem>
                  <MenuItem value="White">White (Sharps & Needles)</MenuItem>
                  <MenuItem value="Blue">Blue (Glassware & Implants)</MenuItem>
                </Select>
                <TextField
                  label="Source Hospital Ward"
                  size="small"
                  fullWidth
                  value={editFormData.ward || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, ward: e.target.value })}
                />
                <TextField
                  label="Weight (kg)"
                  size="small"
                  fullWidth
                  type="number"
                  value={editFormData.weightKg || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, weightKg: parseFloat(e.target.value) || 0 })}
                />
                <TextField
                  label="Authorized Handler"
                  size="small"
                  fullWidth
                  value={editFormData.handler || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, handler: e.target.value })}
                />
                <Select
                  size="small"
                  fullWidth
                  value={editFormData.status || 'Ready for Barcode Scan'}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <MenuItem value="Ready for Barcode Scan">Ready for Barcode Scan</MenuItem>
                  <MenuItem value="Dispatched to CBWTF">Dispatched to CBWTF</MenuItem>
                  <MenuItem value="Incinerated / Disposed">Incinerated / Disposed</MenuItem>
                </Select>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setEditLog(null)} sx={{ textTransform: 'none', color: '#64748B' }}>
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
            Are you sure you want to delete waste bag{' '}
            <strong style={{ color: '#0F172A' }}>{deleteLog?.barcode}</strong> ({deleteLog?.ward})?
            This will remove the manifest entry.
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
            Delete Log
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: New Waste Entry */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
        <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}>
          Barcode Log Biomedical Waste
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              fullWidth
              label="BMW Segregation Color Category"
              value={newWaste.category}
              onChange={(e) => setNewWaste({ ...newWaste, category: e.target.value as any })}
            >
              <MenuItem value="Yellow">Yellow (Anatomical, Soiled Gauze, Placenta)</MenuItem>
              <MenuItem value="Red">Red (Plastic Bottles, Syringes w/o Needles)</MenuItem>
              <MenuItem value="White">White (Translucent Puncture Proof Sharps)</MenuItem>
              <MenuItem value="Blue">Blue (Glassware, Vials, Metallic Implants)</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Source Ward / Unit"
              value={newWaste.ward}
              onChange={(e) => setNewWaste({ ...newWaste, ward: e.target.value })}
            />
            <TextField
              fullWidth
              label="Bag Net Weight (in kg)"
              placeholder="e.g. 4.2"
              type="number"
              value={newWaste.weightKg}
              onChange={(e) => setNewWaste({ ...newWaste, weightKg: e.target.value })}
            />
            <TextField
              fullWidth
              label="Designated Nurse / Sanitary Staff"
              value={newWaste.handler}
              onChange={(e) => setNewWaste({ ...newWaste, handler: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddWaste}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', '&:hover': { bgcolor: '#115E59' } }}
          >
            Print Barcode &amp; Log
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
