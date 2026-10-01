'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import toast from 'react-hot-toast';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import { useConfirm } from '../../../ConfirmDialog';

// Icons
import LanguageIcon from '@mui/icons-material/Language';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CampaignIcon from '@mui/icons-material/Campaign';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LaunchIcon from '@mui/icons-material/Launch';

// Mock Pages Data
const INITIAL_PAGES = [
  { id: 'pg-1', title: 'About Institution & Governance', slug: '/about', status: 'Published', lastUpdated: '30 Sep 2026', views: '14,200' },
  { id: 'pg-2', title: 'Academic Courses & CBME Matrix', slug: '/courses', status: 'Published', lastUpdated: '28 Sep 2026', views: '28,900' },
  { id: 'pg-3', title: 'Clinical Departments Directory', slug: '/departments', status: 'Published', lastUpdated: '25 Sep 2026', views: '18,450' },
  { id: 'pg-4', title: '750-Bed Teaching Hospital Services', slug: '/hospital', status: 'Published', lastUpdated: '27 Sep 2026', views: '32,100' },
  { id: 'pg-5', title: 'Campus Facilities & Simulation Lab', slug: '/facilities', status: 'Published', lastUpdated: '20 Sep 2026', views: '9,800' },
  { id: 'pg-6', title: 'Admissions & NEET Cut-Off Matrix', slug: '/admissions', status: 'Published', lastUpdated: '29 Sep 2026', views: '45,600' },
  { id: 'pg-7', title: 'Fee Structure & Scholarships', slug: '/fees', status: 'Published', lastUpdated: '24 Sep 2026', views: '21,300' },
  { id: 'pg-8', title: 'Central Research Facility & Labs', slug: '/research', status: 'Draft', lastUpdated: '22 Sep 2026', views: '3,400' },
];

export default function CMSAdminPage() {
  const confirm = useConfirm();
  const [tabIndex, setTabIndex] = useState(0);

  // Hero Section State
  const [heroTitle, setHeroTitle] = useState('Excellence in Medical Education, Patient Healing & Clinical Research');
  const [heroTagline, setHeroTagline] = useState('Recognized by National Medical Commission (NMC) & Affiliated with WBUHS. 750-Bedded Tertiary Super-Specialty Hospital.');
  const [savedBannerAlert, setSavedBannerAlert] = useState(false);

  // Pages State
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [openPageModal, setOpenPageModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', status: 'Published' });

  // Search, Filter & Pagination
  const [pageSearch, setPageSearch] = useState('');
  const [pageStatusFilter, setPageStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // View & Edit Modals
  const [viewPage, setViewPage] = useState<any | null>(null);
  const [editPage, setEditPage] = useState<any | null>(null);
  const [editPageForm, setEditPageForm] = useState<any>({});

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBannerAlert(true);
    setTimeout(() => setSavedBannerAlert(false), 4000);
    toast.success('Hero section banner updated successfully');
  };

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title || !newPage.slug) return;
    setPages([
      ...pages,
      {
        id: `pg-${Date.now()}`,
        title: newPage.title,
        slug: newPage.slug.startsWith('/') ? newPage.slug : `/${newPage.slug}`,
        status: newPage.status,
        lastUpdated: 'Just now',
        views: '0',
      },
    ]);
    setOpenPageModal(false);
    setNewPage({ title: '', slug: '', status: 'Published' });
    toast.success('New page created successfully');
  };

  const handleOpenEdit = (p: any) => {
    setEditPage(p);
    setEditPageForm({ ...p });
  };

  const handleSaveEdit = () => {
    if (!editPage) return;
    setPages(pages.map((p) => (p.id === editPage.id ? { ...p, ...editPageForm } : p)));
    toast.success(`Page ${editPageForm.title} updated successfully.`);
    setEditPage(null);
  };

  const handleDeletePage = async (id: string) => {
    const ok = await confirm({
      title: 'Unpublish & Archive Page',
      message: 'Are you sure you want to unpublish and archive this page? This will remove it from the public portal.',
      confirmText: 'Unpublish & Archive',
      severity: 'error',
    });
    if (ok) {
      setPages(pages.filter((p) => p.id !== id));
      toast.success('Page unpublished and archived successfully');
    }
  };

  const filteredPages = pages.filter((p) => {
    if (pageStatusFilter !== 'ALL' && p.status !== pageStatusFilter) return false;
    if (!pageSearch.trim()) return true;
    const q = pageSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  const paginatedPages = filteredPages.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/portal/dashboard' },
          { label: 'Role Workspaces', href: '/portal/roles' },
          { label: 'CMS Studio' },
        ]}
        category="Content & Public Communications"
        title="Institutional CMS & Content Management Studio"
        description="Manage public website typography, banners, academic course syllabus, notices, and NMC regulatory gazettes."
        icon={<LanguageIcon />}
        badge={<StatusBadge status="Live Public Sync" tone="teal" />}
        actions={
          <Button
            variant="contained"
            href="/"
            target="_blank"
            sx={{
              bgcolor: '#0F766E',
              color: '#ffffffff !important',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '8px',
              px: 2.5,
              py: 0.9,
              boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
              '&:hover': { bgcolor: '#0D6861' },
            }}
          >
            Open Live Public Website ↗
          </Button>
        }
      />

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            px: 2,
            borderBottom: '1px solid #E2E8F0',
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minHeight: 52 },
          }}
        >
          <Tab icon={<LanguageIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Homepage & Banners" />
          <Tab icon={<PostAddIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Pages & Routing" />
          <Tab icon={<PhotoLibraryIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Media Assets & CDN" />
          <Tab icon={<VerifiedUserIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="NMC Statutory Disclosures" />
        </Tabs>

        {/* Tab 0: Homepage Editor */}
        {tabIndex === 0 && (
          <Box sx={{ p: 3 }}>
            {savedBannerAlert && (
              <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mb: 3 }}>
                Homepage Hero section saved! Changes propagated to live public edge CDN cache.
              </Alert>
            )}

            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
              Hero Section Headline &amp; Tagline Configurator
            </Typography>

            <Box component="form" onSubmit={handleSaveHero}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Primary Hero Headline (H1)"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Sub-headline / Tagline Description"
                    value={heroTagline}
                    onChange={(e) => setHeroTagline(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Primary CTA Label" defaultValue="Explore Academic Courses" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Primary CTA Link" defaultValue="/courses" />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Secondary CTA Label" defaultValue="Book OPD Consultation" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Secondary CTA Link" defaultValue="/appointment" />
                </Grid>

                <Grid size={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ bgcolor: '#0F766E', fontWeight: 700, px: 4, py: 1.2, '&:hover': { bgcolor: '#115E59' } }}
                  >
                    Save &amp; Publish Hero Banner
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {/* Tab 1: Pages Manager */}
        {tabIndex === 1 && (
          <Box sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2.5, gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Managed Public Pages &amp; Content Nodes
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Edit metadata, SEO tags and publishing status for institutional sub-pages.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setOpenPageModal(true)}
                sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#115E59' }, whiteSpace: 'nowrap' }}
              >
                Create New Page
              </Button>
            </Stack>

            {/* Filter Bar */}
            <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search page title or URL slug..."
                value={pageSearch}
                onChange={(e) => {
                  setPageSearch(e.target.value);
                  setPage(0);
                }}
                sx={{ flex: 1, maxWidth: 350 }}
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
              <Select
                size="small"
                value={pageStatusFilter}
                onChange={(e) => {
                  setPageStatusFilter(e.target.value);
                  setPage(0);
                }}
                sx={{ height: 40, minWidth: 140, fontSize: '0.8125rem' }}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
              </Select>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Page Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>URL Slug</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Modified</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Monthly Views</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right', minWidth: 160 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748B' }}>
                        No pages match your filter query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPages.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>{p.title}</TableCell>
                        <TableCell sx={{ color: '#0F766E', fontWeight: 600 }}>{p.slug}</TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{p.lastUpdated}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{p.views}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Tooltip title="View Page Info">
                              <IconButton size="small" onClick={() => setViewPage(p)} sx={{ color: '#0F766E' }}>
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open Page in Browser">
                              <IconButton size="small" href={p.slug} target="_blank" sx={{ color: '#64748B' }}>
                                <LaunchIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Page">
                              <IconButton size="small" onClick={() => handleOpenEdit(p)} sx={{ color: '#0284C7' }}>
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Archive Page">
                              <IconButton size="small" onClick={() => handleDeletePage(p.id)} sx={{ color: '#EF4444' }}>
                                <DeleteIcon sx={{ fontSize: 18 }} />
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
              count={filteredPages.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        )}

        {/* Tab 2: Media & Assets */}
        {tabIndex === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
              Cloud Media Storage (S3 / CDN)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Managed high-resolution campus photography, faculty portraits, and signed circular PDFs.
            </Typography>

            <Grid container spacing={2}>
              {[
                { name: 'campus-facade-main.jpg', size: '2.4 MB', type: 'Image (JPEG)', date: '30 Sep 2026' },
                { name: 'mri-console-3t.jpg', size: '3.1 MB', type: 'Image (JPEG)', date: '28 Sep 2026' },
                { name: 'nmc-recognition-letter-2026.pdf', size: '840 KB', type: 'PDF Document', date: '25 Sep 2026' },
                { name: 'simman-robotics-lab.jpg', size: '2.8 MB', type: 'Image (JPEG)', date: '22 Sep 2026' },
              ].map((m, idx) => (
                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                  <Card sx={{ p: 2, borderRadius: 2, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                        {m.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        {m.type} • {m.size} • Uploaded {m.date}
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined" onClick={() => toast.success(`Viewing asset ${m.name}`)} sx={{ textTransform: 'none' }}>
                      Preview
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tab 3: Statutory Disclosures */}
        {tabIndex === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
              NMC Mandatory Statutory Disclosures (CBME Clause 3.2)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Live public disclosures required for annual college inspection and NMC assessment portals.
            </Typography>

            <Stack spacing={2}>
              {[
                { title: 'NMC Form 1: Teaching Faculty Biometric Attendance (AEBAS)', status: 'Live Sync Active', date: 'Refreshed 10 mins ago' },
                { title: 'NMC Form 2: Clinical Hospital Bed Occupancy & OPD Statistics', status: 'Live Sync Active', date: 'Refreshed 15 mins ago' },
                { title: 'NMC Form 3: Annual Intake Seat Matrix (MBBS 150 Seats & MD/MS 45 Seats)', status: 'Approved', date: 'Refreshed 24 Sep 2026' },
                { title: 'NMC Form 4: Anti-Ragging Committee & Gender Harassment Internal Redressal', status: 'Gazetted', date: 'Refreshed 20 Sep 2026' },
              ].map((doc, idx) => (
                <Card key={idx} sx={{ p: 2.5, borderRadius: 2, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {doc.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      {doc.date}
                    </Typography>
                  </Box>
                  <StatusBadge status={doc.status} />
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* ─── View Page Modal ─── */}
      <Dialog
        open={Boolean(viewPage)}
        onClose={() => setViewPage(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              maxWidth: '720px',
              width: '100%',
              boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {viewPage && (
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
                  {viewPage.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Manrope', sans-serif", fontSize: '0.825rem', mt: 0.25 }}>
                  Institutional CMS Page Dossier
                </Typography>
              </Box>
              <StatusBadge status={viewPage.status} size="medium" />
            </DialogTitle>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogContent sx={{ p: 3, bgcolor: '#FAFAFB' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                  <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.75 }}>
                      URL Route
                    </Typography>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0F766E', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                      {viewPage.slug}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                  <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.75 }}>
                      Publish Status
                    </Typography>
                    <StatusBadge status={viewPage.status} size="medium" />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                  <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.75 }}>
                      Last Modified Date
                    </Typography>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '0.925rem', color: '#0F172A' }}>
                      {viewPage.lastUpdated}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                  <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.75 }}>
                      Monthly Traffic
                    </Typography>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '0.925rem', color: '#0F172A' }}>
                      {viewPage.views.toLocaleString()} Pageviews
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'space-between', bgcolor: '#FFFFFF' }}>
              <Button onClick={() => setViewPage(null)} sx={{ textTransform: 'none', color: '#64748B', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                Close
              </Button>
              <Button
                variant="contained"
                href={viewPage.slug}
                target="_blank"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontFamily: "'Manrope', sans-serif",
                  bgcolor: '#0F766E',
                  borderRadius: '10px',
                  px: 2.5,
                  py: 1,
                  boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
                  '&:hover': { bgcolor: '#115E59' },
                }}
              >
                Open Page ↗
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Edit Page Modal ─── */}
      <Dialog
        open={Boolean(editPage)}
        onClose={() => setEditPage(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        {editPage && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
              Edit Page Metadata ({editPage.slug})
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Page Title"
                  size="small"
                  fullWidth
                  value={editPageForm.title || ''}
                  onChange={(e) => setEditPageForm({ ...editPageForm, title: e.target.value })}
                />
                <TextField
                  label="URL Route Slug"
                  size="small"
                  fullWidth
                  value={editPageForm.slug || ''}
                  onChange={(e) => setEditPageForm({ ...editPageForm, slug: e.target.value })}
                />
                <Select
                  size="small"
                  fullWidth
                  value={editPageForm.status || 'Published'}
                  onChange={(e) => setEditPageForm({ ...editPageForm, status: e.target.value })}
                >
                  <MenuItem value="Published">Published</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                </Select>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setEditPage(null)} sx={{ textTransform: 'none', color: '#64748B' }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', '&:hover': { bgcolor: '#115E59' } }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Modal: Create Page */}
      <Dialog open={openPageModal} onClose={() => setOpenPageModal(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
        <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}>
          Create New Institutional Page
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleAddPage} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              required
              label="Page Title"
              placeholder="e.g., Blood Bank Services & Donor Guidelines"
              value={newPage.title}
              onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              required
              label="Route Slug"
              placeholder="e.g., /blood-bank"
              value={newPage.slug}
              onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Publish Status"
              value={newPage.status}
              onChange={(e) => setNewPage({ ...newPage, status: e.target.value })}
            >
              <MenuItem value="Published">Published</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenPageModal(false)} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddPage}
            sx={{ bgcolor: '#0F766E', '&:hover': { bgcolor: '#115E59' } }}
          >
            Create Page
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
