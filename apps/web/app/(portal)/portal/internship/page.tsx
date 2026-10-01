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
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import toast from 'react-hot-toast';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface LogEntry {
  id: string;
  internName: string;
  rollNo: string;
  department: string;
  procedureCode: string;
  procedureName: string;
  patientDetails: string;
  role: 'Performed' | 'Assisted' | 'Observed';
  date: string;
  supervisor: string;
  status: 'Verified' | 'Pending Sign-off';
}

const defaultLogs: LogEntry[] = [
  { id: 'LOG-001', internName: 'Dr. Rahul Mondal', rollNo: 'INT-2026-042', department: 'General Medicine', procedureCode: 'MED-PR-04', procedureName: 'Lumbar Puncture & CSF Tap', patientDetails: 'Male 52Y, Suspected Meningitis', role: 'Performed', date: '30 Sep 2026', supervisor: 'Dr. Debasis Mukherjee (Prof)', status: 'Verified' },
  { id: 'LOG-002', internName: 'Dr. Sneha Paul', rollNo: 'INT-2026-015', department: 'General Surgery', procedureCode: 'SUR-PR-12', procedureName: 'Emergency Appendectomy Laparotomy', patientDetails: 'Female 28Y, Acute Appendicitis', role: 'Assisted', date: '29 Sep 2026', supervisor: 'Dr. K. S. Mukherjee', status: 'Pending Sign-off' },
  { id: 'LOG-003', internName: 'Dr. Tanmoy Ghosh', rollNo: 'INT-2026-088', department: 'Pediatrics', procedureCode: 'PED-PR-02', procedureName: 'Neonatal Resuscitation & Bag-Valve-Mask', patientDetails: 'Term Newborn, Apgar 4/10', role: 'Performed', date: '28 Sep 2026', supervisor: 'Dr. Shireen Banu', status: 'Verified' },
  { id: 'LOG-004', internName: 'Dr. Priya Das', rollNo: 'INT-2026-064', department: 'Obstetrics & Gynaecology', procedureCode: 'OBG-PR-09', procedureName: 'Normal Vaginal Delivery with Episiotomy', patientDetails: 'Primigravida 24Y', role: 'Performed', date: '27 Sep 2026', supervisor: 'Dr. Kalyani Sen (OBGYN)', status: 'Verified' },
  { id: 'LOG-005', internName: 'Dr. Sourav Sen', rollNo: 'INT-2026-031', department: 'Casualty / Emergency', procedureCode: 'EMG-PR-01', procedureName: 'Endotracheal Intubation in Polytrauma', patientDetails: 'Male 35Y, RTA GCS 6', role: 'Assisted', date: '26 Sep 2026', supervisor: 'Dr. T. Adhikary (CMO)', status: 'Pending Sign-off' },
];

const defaultRotations = [
  { dept: 'General Medicine', duration: '2 Months', status: 'Completed', progress: 100, color: '#0F766E' },
  { dept: 'General Surgery', duration: '2 Months', status: 'In Progress (Active)', progress: 65, color: '#0284C7' },
  { dept: 'Obstetrics & Gynaecology', duration: '2 Months', status: 'Upcoming', progress: 0, color: '#7C3AED' },
  { dept: 'Community Medicine', duration: '2 Months', status: 'Upcoming', progress: 0, color: '#EA580C' },
  { dept: 'Pediatrics & Ortho', duration: '2 Months', status: 'Upcoming', progress: 0, color: '#059669' },
  { dept: 'Casualty & Electives', duration: '2 Months', status: 'Upcoming', progress: 0, color: '#475569' },
];

export default function InternshipLogbookPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>(defaultLogs);
  const [rotations, setRotations] = useState<any[]>(defaultRotations);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // View, Edit, Delete states
  const [viewLog, setViewLog] = useState<LogEntry | null>(null);
  const [editLog, setEditLog] = useState<LogEntry | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<LogEntry>>({});
  const [deleteLog, setDeleteLog] = useState<LogEntry | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loadData = () => {
    api('clinical/internship')
      .then((res: any) => {
        if (res) {
          if (res.rotations && res.rotations.length > 0) setRotations(res.rotations);
          if (res.logs && res.logs.length > 0) setLogs(res.logs);
        }
      })
      .catch((err) => console.error('Failed to load internship data', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search, tabValue]);

  // New Log Form State
  const [newLog, setNewLog] = useState({
    department: 'General Medicine',
    procedureName: '',
    patientDetails: '',
    role: 'Performed' as const,
    supervisor: 'Dr. Debasis Mukherjee (Prof)',
  });

  const handleAddLog = async () => {
    if (!newLog.procedureName.trim()) return;

    try {
      const res = await api(
        'clinical/internship/logs',
        'POST',
        {
          department: newLog.department,
          procedureName: newLog.procedureName,
          patientDetails: newLog.patientDetails || 'OPD / Ward Patient',
          role: newLog.role,
          supervisor: newLog.supervisor,
        },
        user?.csrf
      ).catch(() => {});

      const item: LogEntry = res?.item || {
        id: `LOG-00${logs.length + 1}`,
        internName: user?.name || 'Dr. Intern Resident',
        rollNo: 'INT-2026-099',
        department: newLog.department,
        procedureCode: 'CLIN-PR-01',
        procedureName: newLog.procedureName,
        patientDetails: newLog.patientDetails || 'Ward Patient',
        role: newLog.role,
        date: 'Today',
        supervisor: newLog.supervisor,
        status: 'Pending Sign-off',
      };
      setLogs([item, ...logs]);
      toast.success('Clinical procedure logged in CRMI e-logbook.');
    } catch {
      toast.error('Failed to log procedure.');
    }

    setOpenModal(false);
    setNewLog({ department: 'General Medicine', procedureName: '', patientDetails: '', role: 'Performed', supervisor: 'Dr. Debasis Mukherjee (Prof)' });
  };

  const handleSignOff = async (id: string) => {
    try {
      await api(`clinical/internship/logs/${id}/sign-off`, 'POST', {}, user?.csrf).catch(() => {});
      setLogs(logs.map((l) => (l.id === id ? { ...l, status: 'Verified' } : l)));
      toast.success('Procedure successfully signed off by supervisor.');
    } catch {
      toast.error('Failed to sign off log.');
    }
  };

  const handleOpenEdit = (l: LogEntry) => {
    setEditLog(l);
    setEditFormData({ ...l });
  };

  const handleSaveEdit = async () => {
    if (!editLog) return;
    try {
      setLogs(logs.map((l) => (l.id === editLog.id ? ({ ...l, ...editFormData } as LogEntry) : l)));
      toast.success(`Log entry ${editLog.procedureCode} updated successfully.`);
      setEditLog(null);
    } catch {
      toast.error('Failed to update log entry.');
    }
  };

  const handleOpenDelete = (l: LogEntry) => {
    setDeleteLog(l);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteLog) return;
    try {
      setLogs(logs.filter((l) => l.id !== deleteLog.id));
      toast.success(`Log entry ${deleteLog.procedureCode} deleted.`);
    } catch {
      toast.error('Failed to delete log.');
    } finally {
      setDeleteModalOpen(false);
      setDeleteLog(null);
    }
  };

  const filteredLogs = logs
    .filter((l) =>
      tabValue === 1
        ? l.status === 'Verified'
        : tabValue === 2
        ? l.status === 'Pending Sign-off'
        : true
    )
    .filter((log) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        log.procedureName.toLowerCase().includes(q) ||
        log.procedureCode.toLowerCase().includes(q) ||
        log.internName.toLowerCase().includes(q) ||
        log.department.toLowerCase().includes(q) ||
        log.patientDetails.toLowerCase().includes(q) ||
        log.supervisor.toLowerCase().includes(q)
      );
    });

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Academic', href: '/portal/dashboard' },
          { label: 'CRMI Internship' },
        ]}
        category="Compulsory Rotatory Internship"
        title="CRMI 1-Year Compulsory Rotatory Medical Internship"
        description="Official digital portfolio: Rotational postings, daily procedure logbook, clinical supervisor sign-offs, and NMC completion certification."
        icon={<SchoolIcon />}
        badge={<StatusBadge status="NMC CRMI 2021 Norms" tone="teal" />}
        actions={
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon sx={{ color: '#FFFFFF !important' }} />}
              onClick={() => setOpenModal(true)}
              sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: '#115E59' } }}
            >
              + Log Procedure / Case
            </Button>
          </Stack>
        }
      />

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Total Procedures Logged', val: `${logs.length} Procedures`, sub: 'All rotations cumulative', icon: <MedicalServicesIcon sx={{ color: '#0F766E' }} />, bg: '#CCFBF1' },
          { title: 'Faculty Signed Off', val: `${logs.filter(l => l.status === 'Verified').length} Verified`, sub: 'Digital signature verified', icon: <CheckCircleIcon sx={{ color: '#059669' }} />, bg: '#DCFCE7' },
          { title: 'Pending Faculty Sign-off', val: `${logs.filter(l => l.status === 'Pending Sign-off').length} Cases`, sub: 'Awaiting consultant review', icon: <AccessTimeIcon sx={{ color: '#EA580C' }} />, bg: '#FFEDD5' },
          { title: 'NMC Completion Readiness', val: '65% Complete', sub: 'On-track for Provisional Reg', icon: <SchoolIcon sx={{ color: '#0284C7' }} />, bg: '#E0F2FE' },
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

      {/* 12-Month Rotation Roster */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 3, mb: 3, bgcolor: '#FFFFFF' }}>
        <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', mb: 2 }}>
          Mandatory 12-Month CRMI Rotation Roster (NMC Schedule)
        </Typography>
        <Grid container spacing={2}>
          {rotations.map((r, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FAFCFD' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A' }}>{r.dept}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>{r.duration}</Typography>
                  </Box>
                  <StatusBadge status={r.status} />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={r.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#E2E8F0',
                    '& .MuiLinearProgress-bar': { bgcolor: r.color || '#0F766E', borderRadius: 3 },
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Procedures Table */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, bgcolor: '#FAFCFD' }}>
          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' } }}
          >
            <Tab label={`All Logged Procedures (${logs.length})`} />
            <Tab label="Verified by Faculty" />
            <Tab label="Pending Sign-off" />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search procedure, intern, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 280 }, bgcolor: '#FFFFFF' }}
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

        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>CODE &amp; DATE</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>PROCEDURE / CLINICAL COMPETENCY</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>DEPARTMENT</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>PATIENT CONTEXT</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>SUPERVISOR</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 160 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#64748B' }}>
                    No internship procedures matching query.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#0F172A' }}>{log.procedureCode}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{log.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{log.procedureName}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>Intern: {log.internName}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={log.department} tone="neutral" />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{log.patientDetails}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={log.role} />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>{log.supervisor}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={log.status === 'Verified' ? 'Verified' : 'Pending'} />
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 160, whiteSpace: 'nowrap' }}>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        {log.status === 'Pending Sign-off' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleSignOff(log.id)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              bgcolor: '#0F766E',
                              py: 0.2,
                              px: 1,
                              borderRadius: '6px',
                              '&:hover': { bgcolor: '#115E59' },
                            }}
                          >
                            Sign Off
                          </Button>
                        )}
                        <Tooltip title="View Procedure Details">
                          <IconButton size="small" onClick={() => setViewLog(log)} sx={{ color: '#0F766E' }}>
                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Log">
                          <IconButton size="small" onClick={() => handleOpenEdit(log)} sx={{ color: '#0284C7' }}>
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Log">
                          <IconButton size="small" onClick={() => handleOpenDelete(log)} sx={{ color: '#E11D48' }}>
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
      </Card>

      {/* ─── View Procedure Details Modal ─── */}
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
                  CRMI Clinical Procedure Details
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Manrope', sans-serif", fontSize: '0.825rem', mt: 0.25 }}>
                  Code: {viewLog.procedureCode} • Intern: {viewLog.internName}
                </Typography>
              </Box>
              <StatusBadge status={viewLog.status} size="medium" />
            </DialogTitle>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogContent sx={{ p: 3, bgcolor: '#FAFAFB' }}>
              <Grid container spacing={2}>
                {[
                  { label: 'Procedure Name', value: viewLog.procedureName },
                  { label: 'Department', value: viewLog.department },
                  { label: 'Role Performed', value: viewLog.role },
                  { label: 'Patient Context', value: viewLog.patientDetails },
                  { label: 'Supervising Consultant', value: viewLog.supervisor },
                  { label: 'Date Logged', value: viewLog.date },
                ].map((item, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx} sx={{ minWidth: 0 }}>
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.75 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '0.925rem', color: '#0F172A', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                        {item.value || '—'}
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

      {/* ─── Edit Procedure Modal ─── */}
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
              Edit Procedure Log ({editLog.procedureCode})
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Procedure Name"
                  size="small"
                  fullWidth
                  value={editFormData.procedureName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, procedureName: e.target.value })}
                />
                <TextField
                  label="Patient Context"
                  size="small"
                  fullWidth
                  value={editFormData.patientDetails || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, patientDetails: e.target.value })}
                />
                <Select
                  size="small"
                  fullWidth
                  value={editFormData.role || 'Performed'}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as any })}
                >
                  <MenuItem value="Performed">Performed (Independent)</MenuItem>
                  <MenuItem value="Assisted">Assisted Faculty</MenuItem>
                  <MenuItem value="Observed">Observed Demonstration</MenuItem>
                </Select>
                <TextField
                  label="Supervising Consultant"
                  size="small"
                  fullWidth
                  value={editFormData.supervisor || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, supervisor: e.target.value })}
                />
                <Select
                  size="small"
                  fullWidth
                  value={editFormData.status || 'Pending Sign-off'}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                >
                  <MenuItem value="Pending Sign-off">Pending Sign-off</MenuItem>
                  <MenuItem value="Verified">Verified</MenuItem>
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
            Are you sure you want to delete procedure entry{' '}
            <strong style={{ color: '#0F172A' }}>{deleteLog?.procedureCode}</strong> (
            {deleteLog?.procedureName})?
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
            Delete Procedure
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: New Procedure Log */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
        <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}>
          Log Clinical Competency / Procedure
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              fullWidth
              label="Rotation Department"
              value={newLog.department}
              onChange={(e) => setNewLog({ ...newLog, department: e.target.value })}
            >
              <MenuItem value="General Medicine">General Medicine</MenuItem>
              <MenuItem value="General Surgery">General Surgery</MenuItem>
              <MenuItem value="Obstetrics &amp; Gynaecology">Obstetrics &amp; Gynaecology</MenuItem>
              <MenuItem value="Pediatrics">Pediatrics</MenuItem>
              <MenuItem value="Orthopedics">Orthopedics</MenuItem>
              <MenuItem value="Casualty &amp; Emergency">Casualty &amp; Emergency</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Procedure Name &amp; Clinical Competency"
              placeholder="e.g. Lumbar Puncture, Pleural Fluid Tap, Episiotomy"
              value={newLog.procedureName}
              onChange={(e) => setNewLog({ ...newLog, procedureName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Patient Context / Clinical Details"
              placeholder="e.g. 45Y/M with Acute Encephalopathy"
              value={newLog.patientDetails}
              onChange={(e) => setNewLog({ ...newLog, patientDetails: e.target.value })}
            />
            <TextField
              select
              fullWidth
              label="Role Performed"
              value={newLog.role}
              onChange={(e) => setNewLog({ ...newLog, role: e.target.value as any })}
            >
              <MenuItem value="Performed">Performed (Independent with Supervision)</MenuItem>
              <MenuItem value="Assisted">Assisted Senior Resident / Faculty</MenuItem>
              <MenuItem value="Observed">Observed Clinical Demonstration</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Supervising Faculty / Consultant"
              value={newLog.supervisor}
              onChange={(e) => setNewLog({ ...newLog, supervisor: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddLog}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', '&:hover': { bgcolor: '#115E59' } }}
          >
            Save in E-Logbook
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
