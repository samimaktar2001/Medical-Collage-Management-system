'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Chip,
  Card,
  CardContent,
  Button,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import toast from 'react-hot-toast';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { NEWS_ITEMS, NewsItem, INSTITUTION_INFO } from '../public-data';

const NEWS_CATEGORIES = ['All', 'Conference', 'Academic Event', 'Achievement', 'Community Health Camp', 'Hospital Update'] as const;

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  const filteredNews = useMemo(() => {
    return NEWS_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const featured = NEWS_ITEMS[0];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #102A43 50%, #0F766E 100%)',
          color: '#FFFFFF',
          pt: { xs: 5, md: 8 },
          pb: { xs: 6, md: 10 },
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
              News & Academic Bulletin
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
              <NewspaperIcon fontSize="medium" />
            </Box>
            <Typography variant="overline" sx={{ color: '#5EEAD4', letterSpacing: 2, fontWeight: 700 }}>
              CAMPUS & CLINICAL JOURNAL
            </Typography>
          </Stack>

          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2, color: '#FFFFFF !important', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
            News, Events & Research Milestones
          </Typography>
          <Typography variant="body1" sx={{ color: '#F1F5F9 !important', maxWidth: 800, fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Stay updated with clinical breakthroughs, national CME conferences, community health camps, and student academic triumphs from {INSTITUTION_INFO.shortName}.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, py: { xs: 4, md: 6 } }}>
        {/* Featured Story */}
        {featured && selectedCategory === 'All' && !search && (
          <Card
            sx={{
              mb: 5,
              borderRadius: 3.5,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(15, 118, 110, 0.1)',
              border: '1px solid #CBD5E1',
              bgcolor: '#FFFFFF',
            }}
          >
            <Grid container>
              <Grid
                size={{ xs: 12, md: 5 }}
                sx={{
                  background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                  color: '#FFFFFF',
                  p: { xs: 4, md: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Chip
                    label="FEATURED HEADLINE"
                    size="small"
                    sx={{ bgcolor: '#5EEAD4', color: '#0F172A', fontWeight: 800, mb: 2.5 }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 2 }}>
                    {featured.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                    {featured.summary}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mt: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: '#99F6E4', fontWeight: 600 }}>
                    {featured.date} • {featured.readTime}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => setActiveArticle(featured)}
                    sx={{
                      bgcolor: '#FFFFFF',
                      color: '#0F766E',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#F0FDFA' },
                    }}
                  >
                    Read Full Story
                  </Button>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }} sx={{ p: { xs: 3, md: 5 } }}>
                <Typography variant="overline" sx={{ color: '#0F766E', fontWeight: 800 }}>
                  SYNOPSIS & KEY TAKEAWAYS
                </Typography>
                <Stack spacing={2} sx={{ mt: 1.5, mb: 3 }}>
                  {featured.content.map((paragraph, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: '#334155', lineHeight: 1.7 }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {featured.tags.map((t) => (
                    <Chip key={t} label={`#${t}`} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600 }} />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Filter & Search Bar */}
        <Card sx={{ p: 2.5, mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search articles, tags or topics..."
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

            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: { xs: 1, md: 0 } }}>
                {NEWS_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    clickable
                    onClick={() => setSelectedCategory(cat)}
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

        {/* News Grid */}
        <Grid container spacing={3}>
          {filteredNews.map((item) => (
            <Grid size={{ xs: 12, md: 6 }} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 24px rgba(15, 118, 110, 0.08)',
                    borderColor: '#99F6E4',
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        bgcolor: '#E6FFFA',
                        color: '#0F766E',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#64748B' }}>
                      <CalendarMonthIcon sx={{ fontSize: 15 }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {item.date}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: '#0F172A',
                      mb: 1.5,
                      lineHeight: 1.4,
                      fontSize: '1.15rem',
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 2.5, flexGrow: 1 }}>
                    {item.summary}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 2.5 }}>
                    {item.tags.map((tag) => (
                      <Chip key={tag} label={`#${tag}`} size="small" sx={{ bgcolor: '#F8FAFC', color: '#64748B', fontSize: '0.7rem' }} />
                    ))}
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #F1F5F9' }}>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#64748B' }}>
                      <AccessTimeIcon sx={{ fontSize: 15 }} />
                      <Typography variant="caption">{item.readTime}</Typography>
                    </Stack>

                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => setActiveArticle(item)}
                      sx={{
                        color: '#0F766E',
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { color: '#115E59' },
                      }}
                    >
                      Read Story
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Article Detail Modal */}
      <Dialog
        open={Boolean(activeArticle)}
        onClose={() => setActiveArticle(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        {activeArticle && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                <Chip label={activeArticle.category} size="small" sx={{ bgcolor: '#0F766E', color: '#FFFFFF', fontWeight: 700 }} />
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  {activeArticle.date} • {activeArticle.readTime}
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                {activeArticle.title}
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#64748B', mt: 1 }}>
                <PersonIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Reported by: {activeArticle.author}
                </Typography>
              </Stack>
            </DialogTitle>

            <DialogContent dividers>
              <Box sx={{ mb: 2.5, p: 2, bgcolor: '#F0FDFA', borderRadius: 2, borderLeft: '4px solid #0F766E' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F766E' }}>
                  Summary Brief:
                </Typography>
                <Typography variant="body2" sx={{ color: '#134E4A' }}>
                  {activeArticle.summary}
                </Typography>
              </Box>

              <Stack spacing={2}>
                {activeArticle.content.map((p, idx) => (
                  <Typography key={idx} variant="body1" sx={{ color: '#334155', lineHeight: 1.8 }}>
                    {p}
                  </Typography>
                ))}
              </Stack>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E2E8F0' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mr: 1 }}>
                  Keywords:
                </Typography>
                {activeArticle.tags.map((t) => (
                  <Chip key={t} label={`#${t}`} size="small" sx={{ mr: 0.5, bgcolor: '#F1F5F9', color: '#475569' }} />
                ))}
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setActiveArticle(null)} sx={{ color: '#64748B', fontWeight: 600 }}>
                Close
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Article link copied to clipboard!');
                  }
                }}
                sx={{ borderColor: '#CBD5E1', color: '#334155', textTransform: 'none' }}
              >
                Share Article
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
