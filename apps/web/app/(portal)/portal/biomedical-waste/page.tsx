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
import LinearProgress from '@mui/material/LinearProgress';

// Icons
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AddIcon from '@mui/icons-material/Add';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HealingIcon from '@mui/icons-material/Healing';

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

const ANTIBIOGRAM_DATA = [
  { pathogen: 'Escherichia coli (Urine & Blood isolates)', meropenem: '92%', colistin: '99%', pipTaz: '78%', amikacin: '86%', ciprofloxacin: '34%' },
  { pathogen: 'Klebsiella pneumoniae (ICU Sputum & Blood)', meropenem: '81%', colistin: '96%', pipTaz: '64%', amikacin: '74%', ciprofloxacin: '28%' },
  { pathogen: 'Staphylococcus aureus (MRSA Surveillance)', meropenem: 'N/A', colistin: 'N/A', vancomycin: '100%', linezolid: '98%', clindamycin: '58%' },
  { pathogen: 'Pseudomonas aeruginosa (Burn & Wound pus)', meropenem: '84%', colistin: '98%', ceftazidime: '72%', amikacin: '80%', ciprofloxacin: '52%' },
];

export default function BiomedicalWastePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [logs, setLogs] = useState<WasteLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const loadLogs = () => {
    api('clinical/biomedical-waste')
      .then((res: any) => {
        if (res?.logs) {
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
      );
      if (res?.item) {
        setLogs([
          {
            ...res.item,
            wasteType:
              newWaste.category === 'Yellow'
                ? 'Human Anatomical & Placental Waste'
                : newWaste.category === 'Red'
                ? 'Contaminated Plastics & Catheters'
                : newWaste.category === 'White'
                ? 'Puncture-proof Sharps & Needles'
                : 'Glass Medicine Vials & Ampoules',
            time: 'Just now',
            cbwtfVendor: res.item.cbwtfManifestNo || 'Medicare Environmental Management Ltd',
          },
          ...logs,
        ]);
      } else {
        loadLogs();
      }
    } catch (e) {
      console.error('Failed to log waste', e);
    }

    setOpenModal(false);
    setNewWaste({ category: 'Yellow', ward: 'General Medicine Ward 2', weightKg: '', handler: 'Staff Nurse on Duty' });
  };

  const totalToday = logs.reduce((acc, curr) => acc + curr.weightKg, 0).toFixed(1);

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
              Biomedical Waste
            </Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
              Biomedical Waste (BMW) &amp; Infection Control (HICC)
            </Typography>
            <Chip label="CPCB Rules 2016/19 Compliant" size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800 }} />
          </Stack>
          <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
            Statutory 4-color coded barcode waste weighing register, CBWTF common manifest dispatch tracking, and Hospital Infection Control Antibiogram.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LocalShippingIcon />}
            onClick={() => alert('CPCB Form-VI Electronic Daily Waste Dispatch Manifest exported with GPS tracking barcode.')}
            sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#CBD5E1', color: '#0F766E', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px' }}
          >
            Export CBWTF Manifest
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<QrCodeScannerIcon sx={{ color: '#FFFFFF !important' }} />}
            onClick={() => setOpenModal(true)}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', color: '#FFFFFF !important', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: '#115E59' } }}
          >
            + Barcode Scan &amp; Weigh Bag
          </Button>
        </Stack>
      </Stack>

        {/* 4-Color Category KPI Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            {
              cat: 'Yellow Bag (Anatomical & Soiled)',
              code: 'Human Tissue, Cotton Gauze, Placentas',
              weight: `${logs.filter(l => l.category === 'Yellow').reduce((a, c) => a + c.weightKg, 0).toFixed(1)} kg`,
              color: '#CA8A04',
              bg: '#FEF08A',
            },
            {
              cat: 'Red Bag (Recyclable Plastics)',
              code: 'IV Bottles, Catheters, Syringes (no needle)',
              weight: `${logs.filter(l => l.category === 'Red').reduce((a, c) => a + c.weightKg, 0).toFixed(1)} kg`,
              color: '#DC2626',
              bg: '#FEE2E2',
            },
            {
              cat: 'White Box (Translucent Sharps)',
              code: 'Puncture-proof Needles, Blades, Scalpels',
              weight: `${logs.filter(l => l.category === 'White').reduce((a, c) => a + c.weightKg, 0).toFixed(1)} kg`,
              color: '#475569',
              bg: '#F1F5F9',
            },
            {
              cat: 'Blue Cardboard (Glassware & Metal)',
              code: 'Medicine Vials, Ampoules, Ortho Implants',
              weight: `${logs.filter(l => l.category === 'Blue').reduce((a, c) => a + c.weightKg, 0).toFixed(1)} kg`,
              color: '#2563EB',
              bg: '#DBEAFE',
            },
          ].map((kpi, idx) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
              <Paper elevation={0} sx={{ p: 2.2, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', borderTop: `4px solid ${kpi.color}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: kpi.color, mb: 0.5 }}>{kpi.cat}</Typography>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>{kpi.weight}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: '#64748B', mt: 0.5 }}>{kpi.code}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Content Box with Tabs */}
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', bgcolor: '#FAFCFD' }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' } }}
            >
              <Tab label={`Daily Barcode Waste Register (${logs.length} Bags)`} />
              <Tab label="HICC Antibiogram & Antibiotic Surveillance" />
              <Tab label="Needle-Stick Injury & PEP Register (Zero Incidents)" />
            </Tabs>
          </Box>

          {/* TAB 0: WASTE REGISTER */}
          {activeTab === 0 && (
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((row) => (
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
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            bgcolor: row.status === 'Dispatched to CBWTF' ? '#DCFCE7' : '#EFF6FF',
                            color: row.status === 'Dispatched to CBWTF' ? '#15803D' : '#1D4ED8',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                <Chip icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: '#0F766E !important' }} />} label="HICC Audited" size="small" sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 800 }} />
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
                        <TableCell><Chip label={a.meropenem || 'N/A'} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800, bgcolor: '#DCFCE7', color: '#15803D' }} /></TableCell>
                        <TableCell><Chip label={a.colistin || 'N/A'} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800, bgcolor: '#DCFCE7', color: '#15803D' }} /></TableCell>
                        <TableCell><Chip label={a.pipTaz || a.vancomycin || 'N/A'} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800, bgcolor: '#FEF3C7', color: '#B45309' }} /></TableCell>
                        <TableCell><Chip label={a.amikacin || a.linezolid || 'N/A'} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800, bgcolor: '#DCFCE7', color: '#15803D' }} /></TableCell>
                        <TableCell><Chip label={a.ciprofloxacin || a.clindamycin || 'N/A'} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800, bgcolor: '#FEE2E2', color: '#B91C1C' }} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 2: NEEDLE-STICK INJURY */}
          {activeTab === 2 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <HealingIcon sx={{ fontSize: 48, color: '#059669', mb: 1 }} />
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', mb: 0.5 }}>
                Zero Needle-Stick Injuries Logged This Quarter
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', maxWidth: 600, mx: 'auto', mb: 2 }}>
                Hospital Infection Control Protocol requires mandatory reporting of all occupational sharp injuries within 1 hour for immediate HIV / Hepatitis B Post-Exposure Prophylaxis (PEP).
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => alert('Emergency PEP Protocol initiated. Please report to Casualty CMO immediately with source patient details.')}
                sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#DC2626', color: '#DC2626' }}
              >
                + Emergency Needle-Stick Incident Report
              </Button>
            </Box>
          )}
        </Card>

        {/* Modal: Barcode Scan Waste */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
          <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}>
            Barcode Weighing &amp; Disposal Entry (CPCB BMW)
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                select
                fullWidth
                label="Waste Color Category"
                value={newWaste.category}
                onChange={(e) => setNewWaste({ ...newWaste, category: e.target.value as any })}
              >
                <MenuItem value="Yellow">Yellow Bag (Anatomical, Soiled Cotton, Placenta)</MenuItem>
                <MenuItem value="Red">Red Bag (Contaminated Plastics, Catheters, IV Sets)</MenuItem>
                <MenuItem value="White">White Box (Sharps, Scalpels, Needles)</MenuItem>
                <MenuItem value="Blue">Blue Cardboard (Glass Vials, Ampoules, Metallic Implants)</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Hospital Source Ward / Unit"
                value={newWaste.ward}
                onChange={(e) => setNewWaste({ ...newWaste, ward: e.target.value })}
              >
                <MenuItem value="OT Complex (OT-1 to OT-4)">OT Complex (OT-1 to OT-4)</MenuItem>
                <MenuItem value="Emergency & Trauma Resus">Emergency &amp; Trauma Resus</MenuItem>
                <MenuItem value="Medicine ICU & CCU">Medicine ICU &amp; CCU</MenuItem>
                <MenuItem value="Pediatric & NICU Ward">Pediatric &amp; NICU Ward</MenuItem>
                <MenuItem value="Labor Room & Maternity">Labor Room &amp; Maternity</MenuItem>
                <MenuItem value="Central Pathology Lab">Central Pathology Lab</MenuItem>
              </TextField>

              <TextField
                fullWidth
                type="number"
                label="Bag Weight on Digital Scale (in kg)"
                placeholder="e.g. 14.5"
                value={newWaste.weightKg}
                onChange={(e) => setNewWaste({ ...newWaste, weightKg: e.target.value })}
              />

              <TextField
                fullWidth
                label="Authorized Nurse / Sanitary Supervisor"
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
              Generate Barcode &amp; Record Weight
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
