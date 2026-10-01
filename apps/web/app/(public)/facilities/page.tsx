'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

// Icons
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { FACILITIES, INSTITUTION_INFO } from '../public-data';

export default function FacilitiesPage() {
  const facilityIcons = [
    <LocalLibraryIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
    <MedicalServicesIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
    <ApartmentIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
    <ApartmentIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
    <SportsCricketIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', pb: 12 }}>
      {/* ─── Hero Header ─── */}
      <Box sx={{ bgcolor: '#0A2230', color: '#FFFFFF', py: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Chip label="52-Acre Green Eco-Friendly Campus" sx={{ bgcolor: 'rgba(94,234,212,0.18)', color: '#5EEAD4', fontWeight: 700, mb: 1.5 }} />
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.2, mb: 2 }}>
            Campus Infrastructure &amp; Student Facilities
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 800, lineHeight: 1.6 }}>
            Designed to foster intellectual rigor, clinical excellence, and holistic student wellness. From high-fidelity simulation robotics to air-conditioned digital libraries and vibrant student hostels.
          </Typography>
        </Container>
      </Box>

      {/* ─── Facilities Catalog ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, mt: 6 }}>
        <Stack spacing={4}>
          {FACILITIES.map((fac, idx) => (
            <Card
              key={idx}
              elevation={0}
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: '20px',
                bgcolor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: '#0F766E' },
              }}
            >
              <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
                <Grid size={{ xs: 12, md: 1 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {facilityIcons[idx % facilityIcons.length]}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                    <Chip label={fac.category} size="small" sx={{ bgcolor: 'rgba(15,118,110,0.1)', color: '#0F766E', fontWeight: 700, fontSize: '0.7rem' }} />
                    {fac.capacity && (
                      <Chip label={fac.capacity} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.7rem' }} />
                    )}
                  </Stack>

                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', mb: 1.5 }}>
                    {fac.title}
                  </Typography>

                  <Typography sx={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.65 }}>
                    {fac.description}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', mb: 1.5, letterSpacing: '0.05em' }}>
                      Key Highlights &amp; Amenities:
                    </Typography>
                    <Stack spacing={1}>
                      {fac.features.map((feat, fIdx) => (
                        <Stack key={fIdx} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                          <CheckCircleIcon sx={{ color: '#0F766E', fontSize: 16, mt: 0.2 }} />
                          <Typography sx={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                            {feat}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
