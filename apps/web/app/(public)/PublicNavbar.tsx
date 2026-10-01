'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { INSTITUTION_INFO, COURSES, DEPARTMENTS } from './public-data';

interface DropdownItem {
  label: string;
  href: string;
  desc?: string;
  badge?: string;
}

const navDropdowns: Record<string, DropdownItem[]> = {
  Academics: [
    { label: 'All Courses & Programs', href: '/courses', desc: 'MBBS, MD, MS, Nursing & Allied Sciences' },
    { label: 'MBBS (Bachelor of Medicine)', href: '/courses/mbbs', desc: '250 Seats • 5.5 Years • CBME Curriculum', badge: 'Flagship' },
    { label: 'Postgraduate Residency (MD/MS)', href: '/courses', desc: 'Clinical & Para-clinical Specializations' },
    { label: 'B.Sc. Nursing College', href: '/courses', desc: '4-Year Professional Nursing & Patient Care' },
    { label: 'Academic Regulations & NMC Norms', href: '/courses', desc: 'Competency curriculum and evaluation rubrics' },
  ],
  Departments: [
    { label: 'All Departments Directory', href: '/departments', desc: 'Pre-clinical, Para-clinical & Clinical faculties' },
    { label: 'Department of General Medicine', href: '/departments/general-medicine', desc: 'Adult therapeutics & 30-bed ICU' },
    { label: 'Department of General Surgery', href: '/departments/general-surgery', desc: '12 Modular Laminar-Flow OTs' },
    { label: 'Department of Pediatrics', href: '/departments/pediatrics', desc: 'Level-III NICU, PICU & Child Care' },
    { label: 'Department of Radio-Diagnosis', href: '/departments/radiology', desc: '3.0T MRI, 128-Slice CT, 4D Ultrasound' },
    { label: 'Department of Pathology & Blood Bank', href: '/departments/pathology', desc: 'NABL accredited 24/7 Diagnostics' },
  ],
  Hospital: [
    { label: '750-Bedded Hospital Overview', href: '/hospital', desc: 'Tertiary healthcare & medical education hub' },
    { label: '24/7 Emergency Casualty & Trauma', href: '/hospital#emergency', desc: 'Red triage resus & ambulance hotline', badge: '24/7' },
    { label: 'Critical Care (ICU / CCU / NICU)', href: '/hospital#icu', desc: '60+ ventilator-supported critical beds' },
    { label: 'Licensed Blood Bank & Component Unit', href: '/hospital#blood-bank', desc: 'Whole blood, PRBC, FFP, Platelets' },
    { label: 'Book OPD Consultation Token', href: '/appointment', desc: 'Fast online appointment with doctor choice' },
  ],
  Admissions: [
    { label: 'Admission Guidelines & Seat Matrix', href: '/admissions', desc: 'NEET eligibility, reservation & schedule' },
    { label: 'Fee Structure & Scholarships', href: '/admissions#fees', desc: 'Transparent state & management quotas' },
    { label: 'Document Verification Checklist', href: '/admissions#documents', desc: 'Required certificates and bond formats' },
    { label: 'Online Inquiry & Counseling Form', href: '/admissions#inquiry', desc: 'Direct registrar desk assistance' },
  ],
  Campus: [
    { label: 'Campus Infrastructure & Facilities', href: '/facilities', desc: '52-acre eco-friendly green university campus' },
    { label: 'Air-Conditioned Digital Library', href: '/facilities', desc: '45,000+ volumes, 140+ e-journals & 24/7 study' },
    { label: 'Clinical Skills Simulation Lab', href: '/facilities', desc: 'SimMan robotic mannequins & task trainers' },
    { label: 'Student Hostels & Residential Towers', href: '/facilities', desc: 'Separate boys & girls residential blocks' },
    { label: 'Campus Photo & Video Gallery', href: '/gallery', desc: 'Glimpse into college life and clinical events' },
  ],
};

export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown States
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null);

  const handleOpenDropdown = (event: React.MouseEvent<HTMLElement>, key: string) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveDropdownKey(key);
  };

  const handleCloseDropdown = () => {
    setMenuAnchorEl(null);
    setActiveDropdownKey(null);
  };

  const executeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchDialogOpen(false);
    const q = searchQuery.toLowerCase();
    if (q.includes('course') || q.includes('mbbs') || q.includes('md') || q.includes('seat')) {
      router.push('/courses');
    } else if (q.includes('doctor') || q.includes('dr') || q.includes('consult')) {
      router.push('/doctors');
    } else if (q.includes('hospital') || q.includes('bed') || q.includes('opd') || q.includes('icu')) {
      router.push('/hospital');
    } else if (q.includes('admission') || q.includes('fee')) {
      router.push('/admissions');
    } else if (q.includes('notice') || q.includes('exam')) {
      router.push('/notices');
    } else {
      router.push('/departments');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Academics', key: 'Academics', hasDropdown: true },
    { label: 'Departments', key: 'Departments', hasDropdown: true },
    { label: 'Hospital', key: 'Hospital', hasDropdown: true },
    { label: 'Admissions', key: 'Admissions', hasDropdown: true },
    { label: 'Doctors', href: '/doctors', hideOnLg: true },
    { label: 'Campus', key: 'Campus', hasDropdown: true, hideOnLg: true },
    { label: 'Research', href: '/research', hideOnLg: true },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <Box sx={{ width: '100%', position: 'sticky', top: 0, zIndex: 1100, bgcolor: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* ─── Top Utility Strip ─── */}
      <Box sx={{ bgcolor: '#09212E', color: 'rgba(255,255,255,0.85)', py: 0.6, fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: 'center' }} spacing={1}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center', color: '#5EEAD4' }}>
                <VerifiedUserIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  NMC Recognized • NAAC A+ University • NABH Teaching Hospital
                </Typography>
              </Stack>
              <Typography sx={{ display: { xs: 'none', md: 'inline' }, color: 'rgba(255,255,255,0.4)' }}>|</Typography>
              <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center', color: '#F87171' }}>
                <PhoneInTalkIcon sx={{ fontSize: 13 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  24/7 Casualty: {INSTITUTION_INFO.casualtyHelpline}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Link href="/appointment" style={{ textDecoration: 'none' }}>
                <Typography sx={{ color: '#FACC15', fontSize: '0.75rem', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                  Book OPD Appointment
                </Typography>
              </Link>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>|</Typography>
              <Link href="/notices" style={{ textDecoration: 'none' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', '&:hover': { color: '#5EEAD4' } }}>
                  Notices &amp; Tenders
                </Typography>
              </Link>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>|</Typography>
              <Link href="/portal" style={{ textDecoration: 'none' }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#5EEAD4', fontWeight: 700 }}>
                  <LockOutlinedIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: '0.75rem' }}>Management Portal</Typography>
                </Stack>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ─── Main Brand & Navbar ─── */}
      <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', height: 74 }}>
          {/* Logo & College Identity */}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', cursor: 'pointer' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  bgcolor: '#0F766E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(15,118,110,0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.05rem', md: '1.2rem' }, color: '#0F172A', lineHeight: 1.15 }}>
                  MedicaCare
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.625rem', md: '0.6875rem' }, color: '#0F766E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Medical College &amp; Hospital
                </Typography>
              </Box>
            </Stack>
          </Link>

          {/* Desktop Navigation Links */}
          <Stack direction="row" spacing={{ xl: 1.2, lg: 0.6 }} sx={{ alignItems: 'center', display: { xs: 'none', lg: 'flex' }, flexWrap: 'nowrap' }}>
            {navLinks.map((item, idx) => {
              const isActive = item.href ? pathname === item.href : false;
              const displayRule = item.hideOnLg ? { xs: 'none', lg: 'none', xl: 'flex' } : { xs: 'none', lg: 'flex' };

              if (item.hasDropdown && item.key) {
                const isDropdownActive = activeDropdownKey === item.key;
                return (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={0.2}
                    onClick={(e) => handleOpenDropdown(e, item.key!)}
                    sx={{
                      display: displayRule,
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: isDropdownActive ? '#0F766E' : '#334155',
                      fontWeight: isDropdownActive ? 700 : 600,
                      fontSize: { xl: '0.84rem', lg: '0.78rem' },
                      py: 0.8,
                      px: { xl: 0.8, lg: 0.5 },
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s',
                      '&:hover': { color: '#0F766E', bgcolor: 'rgba(15,118,110,0.06)' },
                    }}
                  >
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', whiteSpace: 'nowrap' }}>{item.label}</Typography>
                    <KeyboardArrowDownIcon sx={{ fontSize: 15, transform: isDropdownActive ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', ml: -0.2 }} />
                  </Stack>
                );
              }

              return (
                <Box key={idx} sx={{ display: displayRule }}>
                  <Link href={item.href || '/'} style={{ textDecoration: 'none' }}>
                    <Typography
                      sx={{
                        color: isActive ? '#0F766E' : '#334155',
                        fontWeight: isActive ? 700 : 600,
                        fontSize: { xl: '0.84rem', lg: '0.78rem' },
                        py: 0.8,
                        px: { xl: 0.8, lg: 0.5 },
                        borderRadius: '6px',
                        bgcolor: isActive ? 'rgba(15,118,110,0.08)' : 'transparent',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s',
                        '&:hover': { color: '#0F766E', bgcolor: 'rgba(15,118,110,0.06)' },
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                </Box>
              );
            })}
          </Stack>

          {/* Right Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0, ml: { lg: 1, xl: 2 } }}>
            <IconButton onClick={() => setSearchDialogOpen(true)} size="small" sx={{ color: '#0F766E', bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
              <SearchIcon fontSize="small" />
            </IconButton>

            <Link href="/appointment" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EventAvailableIcon sx={{ fontSize: 16 }} />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  borderColor: '#0F766E',
                  color: '#0F766E',
                  fontWeight: 700,
                  fontSize: { xl: '0.8125rem', lg: '0.75rem' },
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: { xl: 1.8, lg: 1.2 },
                  height: 38,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'rgba(15,118,110,0.06)', borderColor: '#0D6861' },
                }}
              >
                Book OPD
              </Button>
            </Link>

            <Link href="/admissions" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#0F766E',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: { xl: '0.8125rem', lg: '0.75rem' },
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: { xl: 2, lg: 1.5 },
                  height: 38,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(15,118,110,0.25)',
                  '&:hover': { bgcolor: '#0B5D57' },
                }}
              >
                Apply MBBS 2026
              </Button>
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ display: { xs: 'flex', lg: 'none' }, color: '#1E293B', flexShrink: 0 }}>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>

      {/* ─── Navigation Dropdown Menu ─── */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseDropdown}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 1.5,
              minWidth: 320,
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              p: 1,
              boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
            },
          },
        }}
      >
        {activeDropdownKey &&
          navDropdowns[activeDropdownKey]?.map((subItem, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                handleCloseDropdown();
                router.push(subItem.href);
              }}
              sx={{
                borderRadius: '8px',
                py: 1,
                px: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                '&:hover': { bgcolor: '#F0FDFA' },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>{subItem.label}</Typography>
                {subItem.badge && (
                  <Chip label={subItem.badge} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#CCFBF1', color: '#0F766E' }} />
                )}
              </Stack>
              {subItem.desc && (
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mt: 0.2 }}>{subItem.desc}</Typography>
              )}
            </MenuItem>
          ))}
      </Menu>

      {/* ─── Mobile Drawer ─── */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} slotProps={{ paper: { sx: { width: 320, p: 2.5 } } }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
            MedicaCare College
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          {[
            { label: 'Home', href: '/' },
            { label: 'About College & Mission', href: '/about' },
            { label: 'Academic Courses (MBBS/MD)', href: '/courses' },
            { label: 'Medical Departments', href: '/departments' },
            { label: 'Consultant Doctors Directory', href: '/doctors' },
            { label: 'Hospital & Emergency Care', href: '/hospital' },
            { label: 'Admissions & Seat Matrix', href: '/admissions' },
            { label: 'Campus & Facilities', href: '/facilities' },
            { label: 'Research & Ethics Committee', href: '/research' },
            { label: 'Notices & Circulars', href: '/notices' },
            { label: 'Photo & Event Gallery', href: '/gallery' },
            { label: 'Book OPD Appointment', href: '/appointment' },
            { label: 'Contact & Campus Map', href: '/contact' },
            { label: 'Management Portal Dashboard', href: '/portal' },
          ].map((item, idx) => (
            <ListItem key={idx} disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push(item.href);
                }}
                sx={{ borderRadius: '8px', py: 1 }}
              >
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: item.label.includes('Portal') ? '#0F766E' : '#1E293B',
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* ─── Search Dialog ─── */}
      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.2rem', pb: 1 }}>Search College Directory</DialogTitle>
        <DialogContent>
          <form onSubmit={executeSearch}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Search courses, doctors, departments, notices, hospital beds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#0F766E' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '10px' },
                },
              }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mr: 1, py: 0.5 }}>Quick search:</Typography>
              {['MBBS', 'Cardiology', 'OPD Token', 'Hostel', 'Fees', 'Dr. Sengupta'].map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  onClick={() => {
                    setSearchQuery(tag);
                  }}
                  sx={{ cursor: 'pointer', fontSize: '0.75rem', bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}
                />
              ))}
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
