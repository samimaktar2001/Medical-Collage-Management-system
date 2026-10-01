'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import toast from 'react-hot-toast';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CampaignIcon from '@mui/icons-material/Campaign';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListIcon from '@mui/icons-material/FilterList';
import { NOTICES, INSTITUTION_INFO, Notice } from '../public-data';

const CATEGORIES = ['All', 'Academic', 'Examination', 'Admission', 'Tender', 'Hospital'] as const;

export default function NoticesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);

  const filteredNotices = useMemo(() => {
    return NOTICES.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        n.audience.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #102A43 50%, #0F766E 100%)',
          color: '#FFFFFF',
          pt: { xs: 5, md: 8 },
          pb: { xs: 6, md: 10 },
          position: 'relative',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.6)' }} />}
            sx={{ mb: 3 }}
          >
            <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.875rem' }}>
              Home
            </Link>
            <Typography sx={{ color: '#5EEAD4', fontSize: '0.875rem', fontWeight: 600 }}>
              Official Notices & Circulars
            </Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'rgba(94, 234, 212, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5EEAD4',
              }}
            >
              <CampaignIcon fontSize="medium" />
            </Box>
            <Typography variant="overline" sx={{ color: '#5EEAD4', letterSpacing: 2, fontWeight: 700 }}>
              INSTITUTIONAL REGULATORY GAZETTE
            </Typography>
          </Stack>

          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2, color: '#FFFFFF !important', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
            Official Notices, Circulars & Tenders
          </Typography>
          <Typography variant="body1" sx={{ color: '#F1F5F9 !important', maxWidth: 800, fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Access authentic regulatory releases, University examination schedules, National Medical Commission (NMC) mandatory disclosures, and open procurement tenders.
          </Typography>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, py: { xs: 4, md: 6 } }}>
        {/* Compliance Alert */}
        <Alert
          icon={<VerifiedUserIcon fontSize="inherit" />}
          severity="info"
          sx={{
            mb: 4,
            borderRadius: 2,
            bgcolor: 'rgba(15, 118, 110, 0.08)',
            border: '1px solid rgba(15, 118, 110, 0.2)',
            color: '#0F172A',
            '& .MuiAlert-icon': { color: '#0F766E' },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Statutory Notice under NMC Section 28 & WBUHS Regulations:
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            All circulars published here constitute legal notice to students, guardians, faculty, and vendors. Discrepancies should be reported within 7 working days to the Registrar at {INSTITUTION_INFO.email}.
          </Typography>
        </Alert>

        {/* Search & Category Filter */}
        <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by title, subject or audience..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#64748B' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: { xs: 1, md: 0 }, alignItems: 'center' }}>
                <FilterListIcon sx={{ color: '#64748B', display: { xs: 'none', sm: 'block' }, mr: 1 }} />
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    clickable
                    onClick={() => setSelectedCategory(cat)}
                    color={selectedCategory === cat ? 'primary' : 'default'}
                    sx={{
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      bgcolor: selectedCategory === cat ? '#0F766E' : '#F1F5F9',
                      color: selectedCategory === cat ? '#FFFFFF' : '#334155',
                      '&:hover': {
                        bgcolor: selectedCategory === cat ? '#115E59' : '#E2E8F0',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* Notices Listing */}
        <Stack spacing={2.5}>
          {filteredNotices.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                No circulars or notices matched your filter.
              </Typography>
              <Button variant="outlined" onClick={() => { setSearch(''); setSelectedCategory('All'); }} sx={{ mt: 1 }}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            filteredNotices.map((notice) => (
              <Card
                key={notice.id}
                sx={{
                  borderRadius: 2.5,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(15, 118, 110, 0.08)',
                    borderColor: '#99F6E4',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 1.5 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip
                        label={notice.category}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor:
                            notice.category === 'Examination'
                              ? '#FEF3C7'
                              : notice.category === 'Admission'
                              ? '#E0E7FF'
                              : notice.category === 'Tender'
                              ? '#FCE7F3'
                              : '#E6FFFA',
                          color:
                            notice.category === 'Examination'
                              ? '#B45309'
                              : notice.category === 'Admission'
                              ? '#4338CA'
                              : notice.category === 'Tender'
                              ? '#BE185D'
                              : '#0F766E',
                        }}
                      />
                      {notice.isNew && (
                        <Chip
                          label="NEW"
                          size="small"
                          sx={{
                            bgcolor: '#EF4444',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            height: 20,
                            animation: 'pulse 2s infinite',
                          }}
                        />
                      )}
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#64748B' }}>
                        <GroupIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Audience: {notice.audience}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#64748B' }}>
                      <CalendarTodayIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        Published: {notice.date}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0F172A',
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.15rem' },
                    }}
                  >
                    {notice.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 2.5 }}>
                    {notice.excerpt}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Circular Ref: MMCH/NOT/{notice.id.toUpperCase()}/2026 • Verified by Registrar
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => setPreviewNotice(notice)}
                        sx={{
                          borderColor: '#CBD5E1',
                          color: '#334155',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': { borderColor: '#0F766E', color: '#0F766E' },
                        }}
                      >
                        Read Full Circular
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        sx={{
                          bgcolor: '#0F766E',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': { bgcolor: '#115E59' },
                        }}
                        onClick={() => toast.success(`Downloading official PDF circular: MMCH_${notice.id}.pdf`)}
                      >
                        Download PDF
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Container>

      {/* Notice Detail Dialog Modal */}
      <Dialog
        open={Boolean(previewNotice)}
        onClose={() => setPreviewNotice(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        {previewNotice && (
          <>
            <DialogTitle component="div" sx={{ pb: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                <Chip label={previewNotice.category} size="small" color="primary" sx={{ bgcolor: '#0F766E', fontWeight: 700 }} />
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Dated: {previewNotice.date}
                </Typography>
              </Stack>
              <Typography component="h3" variant="h6" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                {previewNotice.title}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Official Notification issued under the Seal of the Registrar & Principal.
                </Typography>
              </Alert>

              <Typography variant="subtitle2" sx={{ color: '#0F766E', fontWeight: 700, mb: 1 }}>
                Target Recipient Group: {previewNotice.audience}
              </Typography>

              <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, mb: 3 }}>
                {previewNotice.excerpt}
              </Typography>

              <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px dashed #CBD5E1', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
                  Regulatory Directive & Action Points:
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                  1. All concerned students, departments, or vendors must adhere to the timeline indicated in this release.
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                  2. Requests for extension or verification must be submitted via the designated college portal.
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  3. This circular has been dispatched to the Academic Council and National Medical Commission inspection repository.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setPreviewNotice(null)} sx={{ color: '#64748B', fontWeight: 600 }}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  toast.success(`Downloading official signed notice PDF for ${previewNotice.id}`);
                  setPreviewNotice(null);
                }}
                sx={{ bgcolor: '#0F766E', '&:hover': { bgcolor: '#115E59' } }}
              >
                Download Signed Copy (PDF)
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
