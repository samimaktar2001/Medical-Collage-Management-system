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
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ClaimItem {
  id: string;
  patientName: string;
  scheme: 'Ayushman Bharat (PM-JAY)' | 'Swasthya Sathi (WB)' | 'Private TPA / Corporate';
  abhaId: string;
  procedurePackage: string;
  packageCost: string;
  preAuthStatus: 'Approved' | 'Under Review' | 'Settled';
  preAuthNo: string;
  wardBed: string;
}

export default function InsuranceDeskPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState('');

  const loadClaims = () => {
    api('clinical/insurance')
      .then((res: any) => {
        if (res?.claims) {
          setClaims(res.claims);
        }
      })
      .catch((err) => console.error('Failed to load claims', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClaims();
  }, []);

  // Form State
  const [newClaim, setNewClaim] = useState({
    patientName: '',
    scheme: 'Ayushman Bharat (PM-JAY)' as const,
    abhaId: '',
    procedurePackage: '',
    packageCost: '',
    wardBed: 'Ward 2 Bed 10',
  });

  const handleAddClaim = async () => {
    if (!newClaim.patientName.trim()) return;
    try {
      const res = await api(
        'clinical/insurance/claims',
        'POST',
        {
          patientName: newClaim.patientName,
          scheme: newClaim.scheme,
          abhaId: newClaim.abhaId || 'ABHA-VERIFIED',
          procedurePackage: newClaim.procedurePackage || 'Standard Hospital Package',
          packageCost: newClaim.packageCost || '₹ 50,000',
          wardBed: newClaim.wardBed,
        },
        user?.csrf
      );
      if (res?.claim) {
        setClaims([res.claim, ...claims]);
      } else {
        loadClaims();
      }
    } catch (e) {
      console.error('Failed to submit claim', e);
    }
    setOpenModal(false);
    setNewClaim({ patientName: '', scheme: 'Ayushman Bharat (PM-JAY)', abhaId: '', procedurePackage: '', packageCost: '', wardBed: 'Ward 2 Bed 10' });
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
              Cashless &amp; Insurance
            </Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
              Ayushman Bharat (PM-JAY) &amp; Swasthya Sathi Cashless Desk
            </Typography>
            <Chip label="ABDM Integrated (NHA)" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800 }} />
          </Stack>
          <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
            Statutory government health insurance desk: Golden Card &amp; ABHA ID verification, online pre-authorization packages, and cashless claim settlements.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ color: '#FFFFFF !important' }} />}
            onClick={() => setOpenModal(true)}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: '#115E59' } }}
          >
            + Submit Pre-Auth Request
          </Button>
        </Stack>
      </Stack>

        {/* Metrics KPI Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            { title: 'Active Cashless Patients', val: '142 IPD Patients', sub: 'PM-JAY & Swasthya Sathi', icon: <HealthAndSafetyIcon sx={{ color: '#0F766E' }} />, bg: '#CCFBF1' },
            { title: 'Approved Pre-Auth Volume', val: '₹ 48.6 Lakhs', sub: 'Guaranteed government cashless', icon: <CurrencyRupeeIcon sx={{ color: '#0284C7' }} />, bg: '#E0F2FE' },
            { title: 'Pending Pre-Auth Review', val: `${claims.filter(c => c.preAuthStatus === 'Under Review').length} Cases`, sub: 'TPA Doctor approval in progress', icon: <AccessTimeIcon sx={{ color: '#EA580C' }} />, bg: '#FFEDD5' },
            { title: 'Claim Settlement Ratio', val: '97.4%', sub: 'Zero rejected claims this quarter', icon: <CheckCircleIcon sx={{ color: '#059669' }} />, bg: '#DCFCE7' },
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
          <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, bgcolor: '#FAFCFD' }}>
            <Tabs
              value={tabValue}
              onChange={(_, val) => setTabValue(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' } }}
            >
              <Tab label={`All Pre-Auth Claims (${claims.length})`} />
              <Tab label="Ayushman Bharat (PM-JAY)" />
              <Tab label="Swasthya Sathi (WB)" />
            </Tabs>

            <TextField
              size="small"
              placeholder="Search by patient, ABHA ID or package..."
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
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>CLAIM ID &amp; SCHEME</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>PATIENT NAME</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>ABHA / GOLDEN CARD ID</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>PROCEDURE PACKAGE</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>APPROVED COST</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>LOCATION</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>PRE-AUTH STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', minWidth: 140 }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claims
                  .filter((c) =>
                    tabValue === 1
                      ? c.scheme.includes('PM-JAY')
                      : tabValue === 2
                      ? c.scheme.includes('Swasthya Sathi')
                      : true
                  )
                  .map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#0F172A' }}>{c.id}</Typography>
                        <Chip
                          label={c.scheme}
                          size="small"
                          sx={{
                            mt: 0.5,
                            bgcolor: c.scheme.includes('PM-JAY') ? '#EFF6FF' : '#F0FDF4',
                            color: c.scheme.includes('PM-JAY') ? '#1D4ED8' : '#15803D',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{c.patientName}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748B' }}>Ref: {c.preAuthNo}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>
                          {c.abhaId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8rem', color: '#0F172A', fontWeight: 600 }}>{c.procedurePackage}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F766E' }}>{c.packageCost}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>{c.wardBed}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={c.preAuthStatus}
                          size="small"
                          sx={{
                            bgcolor: c.preAuthStatus === 'Approved' ? '#DCFCE7' : c.preAuthStatus === 'Settled' ? '#E0E7FF' : '#FEF3C7',
                            color: c.preAuthStatus === 'Approved' ? '#15803D' : c.preAuthStatus === 'Settled' ? '#4338CA' : '#B45309',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 140, whiteSpace: 'nowrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => alert(`Viewing Pre-Authorization Letter & Clinical Discharge Voucher for ${c.patientName}`)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            px: 1.8,
                            py: 0.6,
                            borderRadius: '6px',
                            borderColor: '#CBD5E1',
                            color: '#0F766E',
                            '&:hover': { borderColor: '#0F766E', bgcolor: '#F0FDFA' }
                          }}
                        >
                          View Voucher
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Modal: New Pre-Auth Request */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
          <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}>
            Submit Cashless Health Scheme Pre-Authorization
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                select
                fullWidth
                label="Government / TPA Scheme"
                value={newClaim.scheme}
                onChange={(e) => setNewClaim({ ...newClaim, scheme: e.target.value as any })}
              >
                <MenuItem value="Ayushman Bharat (PM-JAY)">Ayushman Bharat (PM-JAY - Central Govt)</MenuItem>
                <MenuItem value="Swasthya Sathi (WB)">Swasthya Sathi (West Bengal State Govt)</MenuItem>
                <MenuItem value="Private TPA / Corporate">Private TPA (Star Health / HDFC Ergo / Medi Assist)</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Inpatient Name & Age"
                placeholder="e.g. Ramesh Chandra Das (56/M)"
                value={newClaim.patientName}
                onChange={(e) => setNewClaim({ ...newClaim, patientName: e.target.value })}
              />

              <TextField
                fullWidth
                label="ABHA Health ID / Scheme Golden Card URN"
                placeholder="e.g. ABHA-91-XXXX-XXXX-XX or URN 1904-XXXX-XXXX"
                value={newClaim.abhaId}
                onChange={(e) => setNewClaim({ ...newClaim, abhaId: e.target.value })}
              />

              <TextField
                fullWidth
                label="Procedure / Surgical Package"
                placeholder="e.g. Coronary Artery Bypass Graft (CABG), Hernia Repair..."
                value={newClaim.procedurePackage}
                onChange={(e) => setNewClaim({ ...newClaim, procedurePackage: e.target.value })}
              />

              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Estimated Package Cost (₹)"
                    placeholder="e.g. ₹ 75,000"
                    value={newClaim.packageCost}
                    onChange={(e) => setNewClaim({ ...newClaim, packageCost: e.target.value })}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Admitted Ward & Bed"
                    value={newClaim.wardBed}
                    onChange={(e) => setNewClaim({ ...newClaim, wardBed: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddClaim}
              sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', '&:hover': { bgcolor: '#115E59' } }}
            >
              Submit to NHA / Scheme Portal
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
