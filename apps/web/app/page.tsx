'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PublicNavbar from './(public)/PublicNavbar';
import PublicFooter from './(public)/PublicFooter';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
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
import { alpha } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HotelIcon from '@mui/icons-material/Hotel';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

interface DropdownItem {
  label: string;
  href: string;
  desc?: string;
}

const navDropdowns: Record<string, DropdownItem[]> = {
  Departments: [
    { label: 'All Departments Directory', href: '/portal/departments', desc: 'Pre-clinical, para-clinical & clinical' },
    { label: 'General Medicine', href: '/portal/departments', desc: 'Adult therapeutics & specialty care' },
    { label: 'General Surgery & OT', href: '/portal/surgery', desc: 'Laparoscopic & emergency surgeries' },
    { label: 'Pediatrics & NICU', href: '/portal/departments', desc: 'Neonatal & pediatric intensive care' },
    { label: 'Obstetrics & Gynecology', href: '/portal/departments', desc: 'Labor ward & maternity care' },
    { label: 'Radio-Diagnosis & Imaging', href: '/portal/radiology', desc: '3T MRI, 128-Slice CT, X-Ray' },
  ],
  Admissions: [
    { label: 'Apply for MBBS (New Admission)', href: '/portal/students/new', desc: 'Online application form & merit tracking' },
    { label: 'Undergraduate Eligibility & NEET', href: '#about', desc: 'NEET counseling & seat matrix' },
    { label: 'Postgraduate (MD/MS) Courses', href: '/portal/courses', desc: 'Clinical & non-clinical residency' },
    { label: 'Tuition Fees & Scholarships', href: '/portal/finance', desc: 'Government quotas & fee structure' },
    { label: 'Hostel Accommodation Rules', href: '/portal/hostel', desc: 'Campus residence & amenities' },
  ],
  Academics: [
    { label: 'Academic Programs & Curriculum', href: '/portal/courses', desc: 'NMC CBME aligned competencies' },
    { label: 'Class & Clinical Timetable', href: '/portal/timetable', desc: 'Weekly schedule & bedside postings' },
    { label: 'Distinguished Faculty Directory', href: '/portal/faculty', desc: 'Professors & department heads' },
    { label: 'Examinations & Assessments', href: '/portal/examination', desc: 'Final exams & internal tests' },
    { label: 'Results & Grade Sheets', href: '/portal/results', desc: 'Published transcripts & pass marks' },
    { label: 'Central Medical Library', href: '/portal/library', desc: 'E-journals, books & study halls' },
  ],
  Hospital: [
    { label: 'Hospital Command Center', href: '/portal/hospital', desc: 'Centralized patient operations' },
    { label: 'OPD Clinics & Token Queue', href: '/portal/opd', desc: 'Outpatient consultations & Rx writer' },
    { label: 'IPD Wards & Bed Allocation', href: '/portal/ipd', desc: 'Inpatient census & visual bed matrix' },
    { label: '24/7 Emergency & Trauma Center', href: '/portal/emergency', desc: 'Red triage & critical resus' },
    { label: 'Central Diagnostic Laboratory', href: '/portal/laboratory', desc: 'Hematology, biochemistry & micro' },
    { label: 'Blood Bank & Transfusion', href: '/portal/blood-bank', desc: '24/7 blood components & donation' },
    { label: 'Central Hospital Pharmacy', href: '/portal/pharmacy', desc: 'Inpatient & OPD medicine dispensing' },
  ],
  Research: [
    { label: 'Medical Research & Publications', href: '/portal/research', desc: 'Peer-reviewed journals & publications' },
    { label: 'ICMR Funded Projects', href: '/portal/research', desc: 'Translational clinical research grants' },
    { label: 'Clinical Trials Registry', href: '/portal/research', desc: 'Approved patient safety trials' },
  ],
  'News & Events': [
    { label: 'Latest College Circulars', href: '#news', desc: 'Official academic notices' },
    { label: 'Conferences & CME Workshops', href: '#news', desc: 'Seminars & guest lectures' },
    { label: 'Exam Schedules & Hall Tickets', href: '/portal/examination', desc: 'Timetable & eligibility notices' },
  ],
};

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Dropdown Menu State
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

  // Departments Carousel Index
  const [deptIndex, setDeptIndex] = useState(0);

  const [departments, setDepartments] = useState<any[]>([
    // Fallback while loading
    { title: 'Medicine', desc: 'Loading departments...', icon: <MedicalServicesIcon sx={{ fontSize: 28 }} />, color: '#0F766E' }
  ]);

  const [newsEvents, setNewsEvents] = useState<any[]>([
    // Fallback while loading
    { day: '00', month: '...', title: 'Loading latest notices...', time: '', venue: '' }
  ]);

  const [stats, setStats] = useState({ departments: 25, students: 1000, faculty: 200, patients: 5000 });
  const [settings, setSettings] = useState<any>({});

  React.useEffect(() => {
    async function fetchDynamicContent() {
      try {
        const [deptRes, newsRes, statsRes, settingsRes] = await Promise.all([
          fetch('/api/v1/public/departments').then(res => res.json()),
          fetch('/api/v1/public/content').then(res => res.json()),
          fetch('/api/v1/public/stats').then(res => res.json()).catch(() => ({})),
          fetch('/api/v1/public/settings').then(res => res.json()).catch(() => ({}))
        ]);

        if (settingsRes?.data) {
          setSettings(settingsRes.data);
        }

        if (statsRes && typeof statsRes.departments === 'number') {
          setStats({
            departments: statsRes.departments || 25,
            students: statsRes.students || 1000,
            faculty: statsRes.faculty || 200,
            patients: statsRes.patients || 5000
          });
        }

        if (deptRes?.items?.length > 0) {
          const defaultColors = ['#0F766E', '#007B80', '#0284C7', '#7C3AED', '#D97706', '#E11D48'];
          setDepartments(deptRes.items.map((d: any, idx: number) => ({
            title: d.name.replace('Department of ', ''),
            desc: `Department of ${d.name}`,
            icon: <MedicalServicesIcon sx={{ fontSize: 28 }} />,
            color: defaultColors[idx % defaultColors.length]
          })));
        }

        if (newsRes?.items?.length > 0) {
          setNewsEvents(newsRes.items.slice(0, 4).map((n: any) => {
            const date = n.published_at ? new Date(n.published_at) : new Date();
            return {
              day: String(date.getDate()).padStart(2, '0'),
              month: date.toLocaleString('default', { month: 'short' }),
              title: n.title,
              time: 'See details',
              venue: 'Campus Noticeboard'
            };
          }));
        }
      } catch (err) {
        console.error('Failed to load landing page dynamic content', err);
      }
    }
    fetchDynamicContent();
  }, []);

  const handleNextDept = () => {
    setDeptIndex((prev) => (prev + 1) % (departments.length - 2));
  };

  const handlePrevDept = () => {
    setDeptIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', color: '#1E293B', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      {/* ─── 1. PUBLIC NAVBAR (Unified Institutional Navigation) ─── */}
      <PublicNavbar />

      {/* ─── 2. HERO BANNER & 5 CORE PILLARS (Fits full screen height on desktop) ─── */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#061723',
          color: '#FFFFFF',
          minHeight: { xs: 'auto', lg: 'calc(100vh - 106px)' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          background: `linear-gradient(90deg, 
            rgba(5, 17, 26, 0.96) 0%, 
            rgba(7, 23, 36, 0.92) 42%, 
            rgba(10, 31, 48, 0.78) 72%, 
            rgba(15, 42, 56, 0.58) 100%
          ),
          linear-gradient(180deg, 
            rgba(5, 17, 26, 0.7) 0%, 
            transparent 35%, 
            rgba(5, 17, 26, 0.95) 100%
          ),
          url(/images/campus-hero.jpg) center/cover no-repeat`,
          backgroundAttachment: { md: 'fixed' },
        }}
      >
        {/* Top/Middle Hero Content */}
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 }, pt: { xs: 4, md: 4, xl: 5 }, pb: { xs: 3, md: 2 }, position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ alignItems: 'center', width: '100%' }}>
            {/* Left Hero Column */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: '15px !important', color: '#FACC15 !important' }} />}
                label="NAAC A+ Accredited Medical University"
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.75)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  mb: 2,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(94, 234, 212, 0.35)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              />
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#5EEAD4', letterSpacing: '0.14em', textTransform: 'uppercase', mb: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                Medical College &amp; Hospital
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 900,
                  fontSize: { xs: '2.3rem', sm: '3rem', md: '3.6rem', xl: '4.2rem' },
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  mb: 2,
                  color: '#FFFFFF',
                  textShadow: '0 3px 20px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                {settings.heading || (
                  <>Building a <Box component="span" sx={{ color: '#2DD4BF', textShadow: '0 0 30px rgba(45,212,191,0.85), 0 2px 10px rgba(0,0,0,0.95)' }}>Healthier</Box> <br />
                    Tomorrow</>
                )}
              </Typography>
              <Typography sx={{ color: '#F1F5F9', fontSize: { xs: '0.95rem', md: '1.1rem', xl: '1.2rem' }, lineHeight: 1.6, maxWidth: 620, mb: 3.5, fontWeight: 500, textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
                {settings.sub_heading || 'World-class medical education, advanced multi-specialty healthcare, and pioneering clinical research.'}
              </Typography>

              {/* CTAs */}
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => router.push('/courses')}
                  sx={{
                    bgcolor: '#0F766E',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    textTransform: 'none',
                    borderRadius: '25px',
                    px: 3.5,
                    py: 1.3,
                    boxShadow: '0 4px 18px rgba(15,118,110,0.6)',
                    '&:hover': { bgcolor: '#0D6861', boxShadow: '0 6px 22px rgba(15,118,110,0.8)' },
                  }}
                >
                  Explore Our Programs
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PlayCircleOutlinedIcon />}
                  onClick={() => setVideoModalOpen(true)}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.6)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    textTransform: 'none',
                    borderRadius: '25px',
                    px: 3,
                    py: 1.3,
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(15, 23, 42, 0.4)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  Watch Campus Tour
                </Button>
              </Stack>
            </Grid>

            {/* Right Floating Stats Card */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3, xl: 3.5 },
                  borderRadius: '20px',
                  bgcolor: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  maxWidth: 440,
                  ml: { lg: 'auto' },
                }}
              >
                <Stack spacing={2.5}>
                  {[
                    { icon: <ApartmentIcon sx={{ color: '#0F766E' }} />, value: `${stats.departments}+`, label: 'Academic & Clinical Departments' },
                    { icon: <SchoolIcon sx={{ color: '#0284C7' }} />, value: `${stats.students}+`, label: 'Students Enrolled & Alumni' },
                    { icon: <PeopleIcon sx={{ color: '#7C3AED' }} />, value: `${stats.faculty}+`, label: 'Distinguished Faculty Members' },
                    { icon: <LocalHospitalIcon sx={{ color: '#059669' }} />, value: `${stats.patients}+`, label: 'Patients Treated Annually' },
                  ].map((item, idx) => (
                    <Stack key={idx} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Box sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        bgcolor: '#F0FDFA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#0F172A', lineHeight: 1.1 }}>
                          {item.value}
                        </Typography>
                        <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* ─── 3. 5 KEY FEATURE CARDS (Pinned cleanly at viewport bottom) ─── */}
        <Box id="about" sx={{ position: 'relative', zIndex: 10, pb: { xs: 3, md: 3, xl: 4 }, pt: 1 }}>
          <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
            <Grid container spacing={2}>
              {[
                { title: 'Medical Education', sub: 'MBBS, MD, MS & Super-specialties', icon: <SchoolIcon sx={{ color: '#0F766E' }} />, href: '/courses' },
                { title: 'Advanced Hospital', sub: '24/7 Emergency & Critical ICU', icon: <LocalHospitalIcon sx={{ color: '#007B80' }} />, href: '/hospital' },
                { title: 'Research & Innovation', sub: 'ICMR & Global Collaborations', icon: <ScienceIcon sx={{ color: '#0284C7' }} />, href: '/research' },
                { title: 'Modern Facilities', sub: 'Advanced Labs, Library & Hostels', icon: <ApartmentIcon sx={{ color: '#7C3AED' }} />, href: '/facilities' },
                { title: 'Admissions 2026-27', sub: 'NEET Seat Matrix & Counseling', icon: <SupportAgentIcon sx={{ color: '#059669' }} />, href: '/admissions' },
              ].map((card, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={idx}>
                  <Paper
                    onClick={() => router.push(card.href)}
                    elevation={0}
                    sx={{
                      p: { xs: 2, xl: 2.5 },
                      borderRadius: '16px',
                      bgcolor: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 16px 36px rgba(15,118,110,0.25)',
                        borderColor: '#0F766E',
                        bgcolor: '#FFFFFF',
                      },
                    }}
                  >
                    <Box sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      bgcolor: '#F0FDFA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.2,
                    }}>
                      {card.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.875rem', xl: '0.9375rem' }, color: '#0F172A', mb: 0.4 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35, fontWeight: 500 }}>
                      {card.sub}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* ─── 4. OUR DEPARTMENTS CAROUSEL (#departments) ─── */}
      <Box id="departments" sx={{ py: 8, bgcolor: '#F8FAFC', mt: 6 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                Specialized Disciplines
              </Typography>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.875rem', color: '#0F172A' }}>
                Our Clinical &amp; Academic Departments
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <IconButton size="small" onClick={handlePrevDept} disabled={deptIndex === 0} sx={{ border: '1px solid #CBD5E1', bgcolor: '#fff' }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton size="small" onClick={handleNextDept} sx={{ border: '1px solid #CBD5E1', bgcolor: '#fff' }}>
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push('/departments')}
                sx={{ textTransform: 'none', color: '#0F766E', fontWeight: 700, ml: 1 }}
              >
                View All Departments
              </Button>
            </Stack>
          </Stack>

          <Grid container spacing={3}>
            {departments.slice(deptIndex, deptIndex + 4).map((dept, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    bgcolor: '#FFFFFF',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s',
                    '&:hover': {
                      borderColor: '#0F766E',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(15,118,110,0.1)',
                    },
                  }}
                >
                  <Box>
                    <Box sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '12px',
                      bgcolor: alpha(dept.color, 0.1),
                      color: dept.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}>
                      {dept.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', mb: 1 }}>
                      {dept.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5, mb: 2 }}>
                      {dept.desc}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      alignItems: 'center',
                      color: '#0F766E',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                    onClick={() => router.push('/portal/departments')}
                  >
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>Explore Curriculum</Typography>
                    <ArrowForwardIcon sx={{ fontSize: 14 }} />
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 5. HOSPITAL & CLINICAL SERVICES (#hospital) ─── */}
      <Box id="hospital" sx={{ py: 8, bgcolor: '#FFFFFF' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4 }}>
            <Box>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                750+ Bedded Tertiary Care Hospital
              </Typography>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.875rem', color: '#0F172A' }}>
                Advanced Hospital &amp; Emergency Healthcare
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => router.push('/portal/hospital')}
              sx={{
                bgcolor: '#0F766E',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '8px',
                px: 2.5,
                mt: { xs: 2, md: 0 },
                '&:hover': { bgcolor: '#0D6861' },
              }}
            >
              Hospital Command Dashboard
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {[
              { title: 'Outpatient Department (OPD)', desc: 'Daily specialty clinics, live token calling & digital Rx writing.', icon: <MedicalServicesIcon sx={{ color: '#0F766E' }} />, link: '/portal/opd', action: 'Enter OPD Clinic' },
              { title: 'Inpatient Department & Beds', desc: 'Ward allocation matrix, ICU beds, oxygen lines & patient census.', icon: <HotelIcon sx={{ color: '#0284C7' }} />, link: '/portal/ipd', action: 'View Bed Matrix' },
              { title: '24/7 Emergency & Trauma Center', desc: 'Immediate red triage resus, cardiac monitoring & ambulance desk.', icon: <LocalHospitalIcon sx={{ color: '#DC2626' }} />, link: '/portal/emergency', action: 'Emergency Ward' },
              { title: 'Diagnostic Lab & Blood Bank', desc: 'Automated hematology, biochemistry, cross-matching & component unit.', icon: <ScienceIcon sx={{ color: '#7C3AED' }} />, link: '/portal/laboratory', action: 'Diagnostic Labs' },
            ].map((serv, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#0F766E', boxShadow: '0 8px 24px rgba(15,118,110,0.1)', transform: 'translateY(-3px)' },
                  }}
                >
                  <Box>
                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      {serv.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', mb: 1 }}>
                      {serv.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5, mb: 2 }}>
                      {serv.desc}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => router.push(serv.link)}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '6px', fontSize: '0.8rem', borderColor: '#CBD5E1', color: '#0F766E' }}
                  >
                    {serv.action} →
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 6. NEWS, EVENTS & QUICK LINKS (#news) ─── */}
      <Box id="news" sx={{ py: 8, bgcolor: '#F8FAFC' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Grid container spacing={4}>
            {/* Latest News & Events */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#0F172A' }}>
                  Latest News &amp; Events
                </Typography>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/notices')}
                  sx={{ textTransform: 'none', color: '#0F766E', fontWeight: 700, fontSize: '0.875rem' }}
                >
                  View All Notices
                </Button>
              </Stack>

              <Stack spacing={2}>
                {newsEvents.map((item, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2.5,
                      bgcolor: '#FFFFFF',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#0F766E', bgcolor: '#F8FAFC' },
                    }}
                  >
                    <Box sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0F766E 0%, #0D5E57 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(15,118,110,0.25)',
                    }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', lineHeight: 1, color: '#FFFFFF !important', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                        {item.day}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5EEAD4 !important', mt: 0.3 }}>
                        {item.month}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A', mb: 0.3 }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {item.time} • <strong>{item.venue}</strong>
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* Quick Links Grid */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#0F172A', mb: 3 }}>
                Institutional Portals &amp; Quick Links
              </Typography>
              <Grid container spacing={2}>
                {[
                  { title: 'Student Management', sub: 'Grades, attendance & LMS', icon: <SchoolIcon sx={{ color: '#0F766E' }} />, href: '/portal/students' },
                  { title: 'Faculty & Doctors', sub: 'Timetable & grade entry', icon: <BadgeIcon sx={{ color: '#007B80' }} />, href: '/portal/faculty' },
                  { title: 'MBBS Admission Form', sub: 'Apply & track merit lists', icon: <AssignmentIcon sx={{ color: '#0284C7' }} />, href: '/portal/students/new' },
                  { title: 'Hospital Command', sub: 'OPD, IPD & Lab bookings', icon: <LocalHospitalIcon sx={{ color: '#7C3AED' }} />, href: '/portal/hospital' },
                  { title: 'Examination Results', sub: 'Official circulars board', icon: <ScienceIcon sx={{ color: '#D97706' }} />, href: '/portal/results' },
                  { title: 'Contact Helpdesk', sub: 'Emergency 24x7 lines', icon: <ContactPhoneIcon sx={{ color: '#059669' }} />, href: '#contact' },
                ].map((link, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                    <Paper
                      onClick={() => {
                        if (link.href.startsWith('#')) scrollToAnchor(link.href.slice(1));
                        else router.push(link.href);
                      }}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        bgcolor: '#FFFFFF',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        '&:hover': {
                          borderColor: '#0F766E',
                          bgcolor: '#F0FDFA',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(15,118,110,0.1)',
                        },
                      }}
                    >
                      <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {link.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A' }}>
                          {link.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6875rem', color: '#64748B' }}>
                          {link.sub}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── 7. CAMPUS & CLINICAL GALLERY (#gallery) ─── */}
      <Box id="gallery" sx={{ py: 8, bgcolor: '#FFFFFF' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
              Campus Facilities &amp; Clinical Life
            </Typography>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.875rem', color: '#0F172A' }}>
              State-of-the-Art Medical Infrastructure
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { title: 'Main University Campus', sub: 'Sprawling 45-acre medical campus with super-specialty hospital tower.', tag: 'Campus Hub' },
              { title: 'Anatomy Dissection & Museum', sub: 'High-definition 3D virtual dissection tables and anatomical specimen bank.', tag: 'Academic Lab' },
              { title: 'Simulation Clinical Center', sub: 'Advanced patient simulators for anesthesia, CPR and emergency trauma resus.', tag: 'Clinical Skills' },
              { title: 'Central Medical Library', sub: 'Over 25,000 reference volumes, digital e-library with Lancet, BMJ & NEJM access.', tag: 'Library Hub' },
            ].map((gal, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    bgcolor: '#F8FAFC',
                    transition: 'all 0.25s',
                    '&:hover': { borderColor: '#0F766E', transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(0,0,0,0.08)' },
                  }}
                >
                  <Box sx={{ height: 160, bgcolor: '#0A2533', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', p: 2, textAlign: 'center' }}>
                    <PhotoLibraryIcon sx={{ fontSize: 44, color: '#5EEAD4', opacity: 0.8 }} />
                  </Box>
                  <Box sx={{ p: 2.5 }}>
                    <Chip label={gal.tag} size="small" sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700, fontSize: '0.7rem', mb: 1 }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', mb: 0.5 }}>
                      {gal.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5 }}>
                      {gal.sub}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 8. CONTACT & EMERGENCY DESK (#contact) ─── */}
      <Box id="contact" sx={{ py: 8, bgcolor: '#0A1C28', color: '#FFFFFF' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1840px', px: { xs: 2, sm: 3, md: 4, xl: 6 } }}>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#5EEAD4', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}>
                24/7 Helpline &amp; Emergency
              </Typography>
              <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '2rem', mb: 2 }}>
                We Are Always Ready to Help
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, mb: 3 }}>
                Connect with our medical admissions advisory, casualty desk or academic registrar office.
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(239,68,68,0.2)', color: '#F87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>24/7 Emergency Casualty:</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#F87171' }}>1800-419-MED (Toll Free)</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(94,234,212,0.2)', color: '#5EEAD4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Admissions Office:</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>+91 98765 43210</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmailIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Official Inquiries:</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>admissions@medicacare.edu.in</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LocationOnIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Campus Location:</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#FFFFFF' }}>Medical University Campus, Health City, Kolkata - 700098</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* Quick Contact Box */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper sx={{ p: 4, borderRadius: '20px', bgcolor: '#FFFFFF', color: '#1E293B', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 1 }}>
                  Send an Inquiry to Academic Registrar
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mb: 3 }}>
                  Fill out the form below and our admissions committee will reach out within 24 hours.
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Your Full Name" placeholder="e.g. Dr. / Mr. / Ms." />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Phone Number" placeholder="+91 XXXXX XXXXX" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Email Address" placeholder="you@example.com" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Course of Interest" placeholder="MBBS, MD, MS, BDS" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" multiline rows={3} label="Message or Inquiry Details" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => alert('Thank you! Your message has been submitted to the academic office.')}
                      sx={{ bgcolor: '#0F766E', fontWeight: 700, py: 1.2, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#0D6861' } }}
                    >
                      Submit Inquiry
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── 9. PUBLIC FOOTER (Unified Regulatory Footer) ─── */}
      <PublicFooter />

      {/* ─── Search Dialog Modal ─── */}
      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Search Medical College Directory</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search programs, departments, doctors, notices..."
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
        </DialogContent>
      </Dialog>

      {/* Floating Chatbot Button */}
      <IconButton
        onClick={() => setChatbotOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#0F766E',
          color: 'white',
          width: 56,
          height: 56,
          boxShadow: '0 8px 16px rgba(15,118,110,0.4)',
          zIndex: 9999,
          '&:hover': {
            bgcolor: '#0D6861',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s',
        }}
      >
        <ChatIcon />
      </IconButton>

      {/* Chatbot Window */}
      {chatbotOpen && (
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: { xs: 0, sm: 100 },
            right: { xs: 0, sm: 24 },
            width: { xs: '100%', sm: 360 },
            height: { xs: '100%', sm: 480 },
            borderRadius: { xs: 0, sm: '20px' },
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ bgcolor: '#0F766E', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <SupportAgentIcon />
              <Typography sx={{ fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>MedicaCare Assistant</Typography>
            </Stack>
            <IconButton size="small" onClick={() => setChatbotOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#F8FAFC' }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Box sx={{ bgcolor: '#E2E8F0', p: 1.5, borderRadius: '12px 12px 12px 0', maxWidth: '85%' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#1E293B' }}>
                  Hello! How can I help you with MedicaCare Medical College today? You can ask about admissions, courses, or hospital services.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #E2E8F0' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              slotProps={{
                input: {
                  sx: { borderRadius: '24px', bgcolor: '#F1F5F9', fontSize: '0.85rem' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" sx={{ color: '#0F766E' }}>
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}
