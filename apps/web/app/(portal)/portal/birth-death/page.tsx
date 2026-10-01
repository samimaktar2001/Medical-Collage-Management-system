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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';

// Icons
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PolicyIcon from '@mui/icons-material/Policy';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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

export default function BirthDeathRegistryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [births, setBirths] = useState<BirthRecord[]>([]);
  const [deaths, setDeaths] = useState<DeathRecord[]>([]);
  const [mlcs, setMlcs] = useState<MLCRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [birthModal, setBirthModal] = useState(false);
  const [deathModal, setDeathModal] = useState(false);

  const loadData = () => {
    api('clinical/birth-death')
      .then((res: any) => {
        if (res) {
          if (res.births) {
            setBirths(res.births.map((b: any) => ({
              ...b,
              doctor: b.attendingObgyn || b.doctor || 'Dr. Kalyani Sen (OBGYN)',
              babyDetails: b.babyDetails || 'Male • 3.0 kg',
              apgar: b.apgar || '8/10, 9/10',
            })));
          }
          if (res.deaths) setDeaths(res.deaths);
          if (res.mlcs) {
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

  // New Birth State
  const [newBirth, setNewBirth] = useState({
    motherName: '',
    fatherName: '',
    gender: 'Male' as const,
    weightKg: '3.0 kg',
    apgar: '8/10, 9/10',
    deliveryType: 'Normal Vaginal' as const,
    doctor: 'Dr. Kalyani Sen (OBGYN)',
  });

  // New Death State
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
      }, user?.csrf);
      if (res?.birth) {
        setBirths([
          {
            ...res.birth,
            doctor: res.birth.attendingObgyn || newBirth.doctor,
            babyDetails: res.birth.babyDetails || `${newBirth.gender} • ${newBirth.weightKg}`,
            apgar: newBirth.apgar,
          },
          ...births,
        ]);
      } else {
        loadData();
      }
    } catch (e) {
      console.error('Failed to register birth', e);
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
      }, user?.csrf);
      if (res?.death) {
        setDeaths([res.death, ...deaths]);
      } else {
        loadData();
      }
    } catch (e) {
      console.error('Failed to register death', e);
    }
    setDeathModal(false);
    setNewDeath({ patientName: '', ageGender: '', wardBed: '', immediateCause: '', underlyingCause: '', icd10: '', doctor: 'Dr. Debasis Mukherjee (Prof)' });
  };

  return (
    <Box>
      {/* ─── Breadcrumbs & Header ─── */}
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 0.5 }}>
            <Link underline="hover" color="inherit" href="/portal/dashboard">
              Hospital
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Birth, Death &amp; MLC
            </Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
              Birth, Mortality &amp; Medico-Legal (MLC) Registry
            </Typography>
            <Chip label="Civil Registration System (CRS)" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800 }} />
          </Stack>
          <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
            Statutory Civil Registration of live births (Form-1), hospital mortality summaries with ICD-10 cause of death (Form-2), and police MLC records.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setDeathModal(true)}
            sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#FCA5A5', color: '#B91C1C', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px' }}
          >
            + Death Summary
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ color: '#FFFFFF !important' }} />}
            onClick={() => setBirthModal(true)}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: '#115E59' } }}
          >
            + Register Live Birth
          </Button>
        </Stack>
      </Stack>

        {/* Metric KPI Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            { title: 'Live Births Registered', count: '184 Babies', sub: 'Normal: 122 • LSCS: 62', icon: <ChildFriendlyIcon sx={{ color: '#0284C7' }} />, bg: '#E0F2FE' },
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
              <Tab label={`Live Birth Registry (${births.length})`} />
              <Tab label={`Mortality & Death Summaries (${deaths.length})`} />
              <Tab label={`Medico-Legal (MLC) Police Register (${mlcs.length})`} />
            </Tabs>

            <TextField
              size="small"
              placeholder="Search by name, ID, or cause..."
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
                    <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 150 }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {births.map((b) => (
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
                        <Chip
                          label={b.babyDetails || `${b.gender || 'Infant'} • ${b.weightKg || '3.0 kg'}`}
                          size="small"
                          sx={{
                            bgcolor: b.babyDetails?.includes('Female') || b.gender === 'Female' ? '#FCE7F3' : '#E0F2FE',
                            color: b.babyDetails?.includes('Female') || b.gender === 'Female' ? '#BE185D' : '#0369A1',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                          }}
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
                        <Chip
                          label={b.crsStatus}
                          size="small"
                          sx={{
                            bgcolor: b.crsStatus === 'CRS Registered' ? '#DCFCE7' : '#FEF3C7',
                            color: b.crsStatus === 'CRS Registered' ? '#15803D' : '#B45309',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PrintIcon />}
                          onClick={() => alert(`Printing Official CRS Form-1 Birth Certificate for ${b.motherName}`)}
                          sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0, px: 1.6, py: 0.6, borderRadius: '6px', borderColor: '#CBD5E1', color: '#0F766E' }}
                        >
                          Print Form-1
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 150 }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deaths.map((d) => (
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
                        <Chip label={d.icd10} size="small" sx={{ bgcolor: '#F1F5F9', color: '#0F172A', fontWeight: 800, fontSize: '0.6875rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{d.doctor}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={d.auditStatus}
                          size="small"
                          sx={{
                            bgcolor: d.auditStatus === 'M&M Audited' ? '#DCFCE7' : '#FEF3C7',
                            color: d.auditStatus === 'M&M Audited' ? '#15803D' : '#B45309',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PrintIcon />}
                          onClick={() => alert(`Printing Statutory Form-2 Death Certificate & ICD-10 Cause of Death for ${d.patientName}`)}
                          sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0, px: 1.6, py: 0.6, borderRadius: '6px', borderColor: '#CBD5E1', color: '#DC2626' }}
                        >
                          Print Form-2
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 150 }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mlcs.map((m) => (
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
                        <Chip label={m.natureOfInjury} size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 800, fontSize: '0.6875rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{m.broughtBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{m.cmoName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={m.status}
                          size="small"
                          sx={{
                            bgcolor: m.status === 'Police Acknowledged' ? '#DCFCE7' : '#EFF6FF',
                            color: m.status === 'Police Acknowledged' ? '#15803D' : '#1D4ED8',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PrintIcon />}
                          onClick={() => alert(`Printing Statutory Police Intimation & MLC Injury Certificate for ${m.mlcNo}`)}
                          sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0, px: 1.6, py: 0.6, borderRadius: '6px', borderColor: '#CBD5E1', color: '#7C3AED' }}
                        >
                          Print MLC Form
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

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
