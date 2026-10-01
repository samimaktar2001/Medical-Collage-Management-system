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
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

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

// Mock Pages Data
const INITIAL_PAGES = [
  { id: 'pg-1', title: 'About Institution & Governance', slug: '/about', status: 'Published', lastUpdated: '30 Sep 2026', views: '14,200' },
  { id: 'pg-2', title: 'Academic Courses & CBME Matrix', slug: '/courses', status: 'Published', lastUpdated: '28 Sep 2026', views: '28,900' },
  { id: 'pg-3', title: 'Clinical Departments Directory', slug: '/departments', status: 'Published', lastUpdated: '25 Sep 2026', views: '18,450' },
  { id: 'pg-4', title: '750-Bed Teaching Hospital Services', slug: '/hospital', status: 'Published', lastUpdated: '27 Sep 2026', views: '32,100' },
  { id: 'pg-5', title: 'Campus Facilities & Simulation Lab', slug: '/facilities', status: 'Published', lastUpdated: '20 Sep 2026', views: '9,800' },
  { id: 'pg-6', title: 'Admissions & NEET Cut-Off Matrix', slug: '/admissions', status: 'Published', lastUpdated: '29 Sep 2026', views: '45,600' },
];

export default function CMSAdminPage() {
  const [tabIndex, setTabIndex] = useState(0);

  // Hero Section State
  const [heroTitle, setHeroTitle] = useState('Excellence in Medical Education, Patient Healing & Clinical Research');
  const [heroTagline, setHeroTagline] = useState('Recognized by National Medical Commission (NMC) & Affiliated with WBUHS. 750-Bedded Tertiary Super-Specialty Hospital.');
  const [savedBannerAlert, setSavedBannerAlert] = useState(false);

  // Pages State
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [openPageModal, setOpenPageModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', status: 'Published' });

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBannerAlert(true);
    setTimeout(() => setSavedBannerAlert(false), 4000);
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
  };

  const handleDeletePage = (id: string) => {
    if (confirm('Are you sure you want to unpublish and archive this page?')) {
      setPages(pages.filter((p) => p.id !== id));
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* CMS Header Banner */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3.5,
          background: 'linear-gradient(135deg, #0F172A 0%, #102A43 60%, #0F766E 100%)',
          color: '#FFFFFF',
          p: { xs: 2.5, md: 3 },
          boxShadow: '0 8px 30px rgba(15, 118, 110, 0.15)',
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
              <LanguageIcon sx={{ color: '#5EEAD4', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Institutional CMS &amp; Content Management Studio
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#5EEAD4' }}>
              Manage public website typography, banners, academic course syllabus, notices, and NMC regulatory gazettes.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              href="/"
              target="_blank"
              sx={{ bgcolor: '#5EEAD4', color: '#0F172A', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#99F6E4' } }}
            >
              Open Live Public Website ↗
            </Button>
          </Grid>
        </Grid>
      </Card>

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
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2.5 }}>
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
                sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#115E59' } }}
              >
                Create New Page
              </Button>
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
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pages.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>{p.title}</TableCell>
                      <TableCell sx={{ color: '#0F766E', fontWeight: 600 }}>{p.slug}</TableCell>
                      <TableCell>
                        <Chip
                          label={p.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: p.status === 'Published' ? '#ECFDF5' : '#FFFBEB',
                            color: p.status === 'Published' ? '#059669' : '#D97706',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#64748B' }}>{p.lastUpdated}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{p.views}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button size="small" href={p.slug} target="_blank" sx={{ textTransform: 'none', mr: 1 }}>
                          View
                        </Button>
                        <IconButton size="small" onClick={() => handleDeletePage(p.id)} sx={{ color: '#EF4444' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                    <Button size="small" onClick={() => alert(`Copied CDN URL: https://cdn.medicacare.edu.in/media/${m.name}`)}>
                      Copy URL
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
              National Medical Commission (NMC) Statutory Disclosures
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Mandatory disclosures under Section 28 of NMC Act 2019 displayed publicly for annual inspections.
            </Typography>

            <Stack spacing={2}>
              {[
                { title: 'NMC Form-1: Clinical Material & Bed Occupancy Census (Daily)', status: 'Live Synced from HIS', updated: 'Today, 06:00 AM' },
                { title: 'Biometric Faculty Attendance System (AEBAS) Compliance Record', status: 'Live Verified', updated: 'Today, 08:30 AM' },
                { title: 'CCTV Camera Live Streaming Feeds to NMC Command Centre', status: 'All 25 Streams Active', updated: 'Active' },
                { title: 'Anti-Ragging Committee & Squad Composition Notification 2026', status: 'Published', updated: '15 Sep 2026' },
              ].map((item, idx) => (
                <Card key={idx} sx={{ p: 2.5, borderRadius: 2, borderLeft: '4px solid #0F766E', bgcolor: '#F8FAFC' }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Status: <strong>{item.status}</strong> • Last Verified: {item.updated}
                      </Typography>
                    </Box>
                    <Chip label="COMPLIANT" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 800, mt: { xs: 1, sm: 0 } }} />
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Add Page Modal */}
      <Dialog
        open={openPageModal}
        onClose={() => setOpenPageModal(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Public Web Page</DialogTitle>
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
