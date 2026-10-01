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
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DownloadIcon from '@mui/icons-material/Download';

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

export default function InternshipLogbookPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [rotations, setRotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState('');

  const loadData = () => {
    api('clinical/internship')
      .then((res: any) => {
        if (res) {
          if (res.rotations) setRotations(res.rotations);
          if (res.logs) setLogs(res.logs);
        }
      })
      .catch((err) => console.error('Failed to load internship data', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

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
      );
      if (res?.item) {
        setLogs([res.item, ...logs]);
      } else {
        loadData();
      }
    } catch (e) {
      console.error('Failed to create log', e);
    }

    setOpenModal(false);
    setNewLog({ department: 'General Medicine', procedureName: '', patientDetails: '', role: 'Performed', supervisor: 'Dr. Debasis Mukherjee (Prof)' });
  };

  const handleSignOff = async (id: string) => {
    try {
      await api(`clinical/internship/logs/${id}/sign-off`, 'POST', {}, user?.csrf);
      setLogs(logs.map((l) => (l.id === id ? { ...l, status: 'Verified' } : l)));
    } catch (e) {
      console.error('Failed to sign off log', e);
    }
  };

  const filteredLogs = logs.filter((l) =>
    l.procedureName.toLowerCase().includes(search.toLowerCase()) ||
    l.department.toLowerCase().includes(search.toLowerCase()) ||
    l.supervisor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* ─── Breadcrumbs & Header ─── */}
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 0.5 }}>
            <Link underline="hover" color="inherit" href="/portal/dashboard">
              Academic
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              CRMI Intern Logbook
            </Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
              CRMI MBBS Internship E-Logbook &amp; Competencies
            </Typography>
            <Chip label="NMC Mandated 2021/24" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800 }} />
          </Stack>
          <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
            Compulsory Rotating Medical Internship digital registry, clinical procedural competency verification, and unit chief sign-off.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => alert('CRMI Official Internship Completion Certificate Dossier generated for Dean signature.')}
            sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#CBD5E1', color: '#0F766E', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px' }}
          >
            Export NMC Dossier
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ color: '#FFFFFF !important' }} />}
            onClick={() => setOpenModal(true)}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: '#115E59' } }}
          >
            + Log New Case / Procedure
          </Button>
        </Stack>
      </Stack>

        {/* Metric KPI Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            { title: 'Current Rotational Posting', val: 'Dept. of Medicine', sub: 'Week 6 of 8 • Ward 2', icon: <MedicalServicesIcon sx={{ color: '#0F766E' }} />, bg: '#CCFBF1' },
            { title: 'NMC Core Competencies', val: `${logs.filter(l => l.status === 'Verified').length} Verified`, sub: 'Out of 50 mandatory cases', icon: <VerifiedUserIcon sx={{ color: '#0284C7' }} />, bg: '#E0F2FE' },
            { title: 'Pending Faculty Sign-off', val: `${logs.filter(l => l.status === 'Pending Sign-off').length} Cases`, sub: 'Awaiting Unit Chief signature', icon: <AccessTimeIcon sx={{ color: '#EA580C' }} />, bg: '#FFEDD5' },
            { title: 'Internship Attendance', val: '97.2%', sub: 'NMC Requirement: Min 90%', icon: <CheckCircleIcon sx={{ color: '#059669' }} />, bg: '#DCFCE7' },
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

        {/* Rotational Department Schedule Overview */}
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 2.5, mb: 3, bgcolor: '#FFFFFF' }}>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F172A', mb: 2 }}>
            12-Month Rotational Posting Tracker (Batch 2026–2027)
          </Typography>
          <Grid container spacing={2}>
            {rotations.map((r, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Box sx={{ p: 1.8, borderRadius: '10px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A' }}>{r.dept}</Typography>
                    <Chip size="small" label={r.duration} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                  </Stack>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mb: 1 }}>{r.status}</Typography>
                  <LinearProgress variant="determinate" value={r.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: r.color } }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>

        {/* Main Logbook Table Container */}
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, bgcolor: '#FAFCFD' }}>
            <Tabs
              value={tabValue}
              onChange={(_, val) => setTabValue(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' } }}
            >
              <Tab label={`All Procedure Logs (${logs.length})`} />
              <Tab label={`Verified (${logs.filter(l => l.status === 'Verified').length})`} />
              <Tab label={`Pending Review (${logs.filter(l => l.status === 'Pending Sign-off').length})`} />
            </Tabs>

            <TextField
              size="small"
              placeholder="Search procedure, supervisor, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: '100%', sm: 300 } }}
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
                  <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 120 }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs
                  .filter((l) => (tabValue === 1 ? l.status === 'Verified' : tabValue === 2 ? l.status === 'Pending Sign-off' : true))
                  .map((log) => (
                    <TableRow key={log.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#0F172A' }}>{log.procedureCode}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>{log.date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{log.procedureName}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>Intern: {log.internName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={log.department} size="small" sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 700, fontSize: '0.6875rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{log.patientDetails}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.role}
                          size="small"
                          sx={{
                            bgcolor: log.role === 'Performed' ? '#DCFCE7' : log.role === 'Assisted' ? '#FEF3C7' : '#E0E7FF',
                            color: log.role === 'Performed' ? '#15803D' : log.role === 'Assisted' ? '#B45309' : '#4338CA',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                            whiteSpace: 'nowrap',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>{log.supervisor}</Typography>
                      </TableCell>
                      <TableCell>
                        {log.status === 'Verified' ? (
                          <Chip icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#059669 !important' }} />} label="Verified" size="small" sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 800, fontSize: '0.6875rem', whiteSpace: 'nowrap' }} />
                        ) : (
                          <Chip icon={<AccessTimeIcon sx={{ fontSize: '14px !important', color: '#D97706 !important' }} />} label="Pending" size="small" sx={{ bgcolor: '#FFFBEB', color: '#B45309', fontWeight: 800, fontSize: '0.6875rem', whiteSpace: 'nowrap' }} />
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 120, whiteSpace: 'nowrap' }}>
                        {log.status === 'Pending Sign-off' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleSignOff(log.id)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              bgcolor: '#0F766E',
                              color: '#FFFFFF !important',
                              px: 1.8,
                              py: 0.6,
                              borderRadius: '6px',
                              boxShadow: 'none',
                              '&:hover': { bgcolor: '#115E59', boxShadow: 'none' }
                            }}
                          >
                            Sign Off
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Modal: New Procedure Log */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
          <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}>
            Log Clinical Procedure / Case
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                select
                fullWidth
                label="Rotational Department"
                value={newLog.department}
                onChange={(e) => setNewLog({ ...newLog, department: e.target.value })}
              >
                {rotations.map((r) => (
                  <MenuItem key={r.dept} value={r.dept}>
                    {r.dept}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Procedure / Clinical Competency Name"
                placeholder="e.g. Foley Catheterization, Endotracheal Intubation, Normal Delivery..."
                value={newLog.procedureName}
                onChange={(e) => setNewLog({ ...newLog, procedureName: e.target.value })}
              />

              <TextField
                fullWidth
                label="Patient Context / Ward Bed"
                placeholder="e.g. 52/M, Ward 3 Bed 18, Acute urinary retention"
                value={newLog.patientDetails}
                onChange={(e) => setNewLog({ ...newLog, patientDetails: e.target.value })}
              />

              <TextField
                select
                fullWidth
                label="Role of Intern"
                value={newLog.role}
                onChange={(e) => setNewLog({ ...newLog, role: e.target.value as any })}
              >
                <MenuItem value="Performed">Performed Independently</MenuItem>
                <MenuItem value="Assisted">Assisted Faculty / Senior Resident</MenuItem>
                <MenuItem value="Observed">Observed (Clinical Teaching)</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Supervising Faculty / Unit Chief"
                value={newLog.supervisor}
                onChange={(e) => setNewLog({ ...newLog, supervisor: e.target.value })}
              >
                <MenuItem value="Dr. Debasis Mukherjee (Prof)">Dr. Debasis Mukherjee (Prof &amp; HOD, Medicine)</MenuItem>
                <MenuItem value="Dr. Arjun Sen (Assoc Prof)">Dr. Arjun Sen (Assoc Prof, Surgery)</MenuItem>
                <MenuItem value="Dr. Kalyani Sen (HOD)">Dr. Kalyani Sen (HOD, OBGYN)</MenuItem>
                <MenuItem value="Dr. R. Bannerjee (Prof)">Dr. R. Bannerjee (Prof, Pediatrics)</MenuItem>
              </TextField>
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
              Submit to Logbook
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
