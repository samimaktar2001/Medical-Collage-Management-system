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
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CollectionsIcon from '@mui/icons-material/Collections';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { GALLERY_ITEMS, GalleryItem, INSTITUTION_INFO } from '../public-data';

const CATEGORIES = ['All', 'Campus', 'Hospital & OTs', 'Academics & Labs', 'Events & Sports', 'Convocation'] as const;

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((g) => g.category === selectedCategory);
  }, [selectedCategory]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Hospital & OTs':
        return <LocalHospitalIcon sx={{ fontSize: 40, color: '#5EEAD4' }} />;
      case 'Academics & Labs':
        return <SchoolIcon sx={{ fontSize: 40, color: '#5EEAD4' }} />;
      case 'Events & Sports':
        return <FitnessCenterIcon sx={{ fontSize: 40, color: '#5EEAD4' }} />;
      default:
        return <AccountBalanceIcon sx={{ fontSize: 40, color: '#5EEAD4' }} />;
    }
  };

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
              Campus & Clinical Gallery
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
              <CollectionsIcon fontSize="medium" />
            </Box>
            <Typography variant="overline" sx={{ color: '#5EEAD4', letterSpacing: 2, fontWeight: 700 }}>
              VISUAL INFRASTRUCTURE TOUR
            </Typography>
          </Stack>

          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2, color: '#FFFFFF !important', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
            Campus, Clinical & Academic Gallery
          </Typography>
          <Typography variant="body1" sx={{ color: '#F1F5F9 !important', maxWidth: 800, fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Explore the world-class learning facilities, tertiary surgical theatres, high-fidelity simulation labs, and vibrant student campus life at {INSTITUTION_INFO.shortName}.
          </Typography>
        </Container>
      </Box>

      {/* Main Gallery Area */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, py: { xs: 4, md: 6 } }}>
        {/* Category Pills */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 4,
            overflowX: 'auto',
            pb: 1,
            justifyContent: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setSelectedCategory(cat)}
              sx={{
                px: 1,
                py: 2.2,
                fontWeight: selectedCategory === cat ? 700 : 500,
                bgcolor: selectedCategory === cat ? '#0F766E' : '#FFFFFF',
                color: selectedCategory === cat ? '#FFFFFF' : '#334155',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#0F766E' : '#E2E8F0',
                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(15, 118, 110, 0.25)' : 'none',
                '&:hover': {
                  bgcolor: selectedCategory === cat ? '#115E59' : '#F1F5F9',
                },
              }}
            />
          ))}
        </Stack>

        {/* Gallery Grid */}
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 28px rgba(15, 118, 110, 0.12)',
                    borderColor: '#99F6E4',
                  },
                }}
                onClick={() => setActiveItem(item)}
              >
                {/* Visual Thumbnail Frame */}
                <Box
                  sx={{
                    height: 220,
                    background: 'linear-gradient(135deg, #102A43 0%, #0F766E 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  {getCategoryIcon(item.category)}

                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 700,
                      mt: 1.5,
                      textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      bgcolor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(6px)',
                      color: '#5EEAD4',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />

                  <Chip
                    label={item.year}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      p: 0.5,
                      display: 'flex',
                    }}
                  >
                    <ZoomInIcon sx={{ color: '#FFFFFF', fontSize: 18 }} />
                  </Box>
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                    {item.caption}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Video Tour Banner */}
        <Box
          sx={{
            mt: 8,
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #102A43 0%, #0F172A 100%)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box>
            <Chip
              label="360° VIRTUAL WALKTHROUGH"
              size="small"
              sx={{ bgcolor: '#5EEAD4', color: '#0F172A', fontWeight: 800, mb: 1.5 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Take a Virtual Tour of the MMCH Medical Complex
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 650 }}>
              Experience high-resolution 360-degree interactive views of our dissection halls, modular OT complexes, ICU hubs, residential hostels, and eco-campus grounds.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<PlayCircleIcon sx={{ fontSize: 28 }} />}
            sx={{
              bgcolor: '#0F766E',
              color: '#FFFFFF',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#115E59' },
            }}
            onClick={() => alert('Launching MMCH 360° Virtual Campus Tour experience.')}
          >
            Launch Virtual 360°
          </Button>
        </Box>
      </Container>

      {/* Lightbox / Item Preview Modal */}
      <Dialog
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
      >
        {activeItem && (
          <>
            <Box
              sx={{
                height: 380,
                background: 'linear-gradient(135deg, #0F172A 0%, #102A43 50%, #0F766E 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                position: 'relative',
                p: 4,
                textAlign: 'center',
              }}
            >
              <IconButton
                onClick={() => setActiveItem(null)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: '#FFFFFF',
                  bgcolor: 'rgba(0,0,0,0.4)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <CloseIcon />
              </IconButton>

              {getCategoryIcon(activeItem.category)}

              <Typography variant="h4" sx={{ fontWeight: 800, mt: 2, mb: 1, maxWidth: 600 }}>
                {activeItem.title}
              </Typography>

              <Chip
                label={`${activeItem.category} • Archive Year ${activeItem.year}`}
                sx={{ bgcolor: 'rgba(94, 234, 212, 0.2)', color: '#5EEAD4', fontWeight: 700 }}
              />
            </Box>

            <DialogTitle sx={{ pt: 3, pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Description & Facility Details
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ pb: 3 }}>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8 }}>
                {activeItem.caption}
              </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={() => setActiveItem(null)} sx={{ color: '#64748B', fontWeight: 600 }}>
                Close Preview
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: '#0F766E', '&:hover': { bgcolor: '#115E59' } }}
                onClick={() => alert(`HD Image saved to your device for ${activeItem.title}`)}
              >
                Download High-Res
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
