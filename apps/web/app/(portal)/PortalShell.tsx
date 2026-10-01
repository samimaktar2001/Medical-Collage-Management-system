'use client';

import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import ExamIcon from '@mui/icons-material/AssignmentTurnedIn';
import ResultsIcon from '@mui/icons-material/BarChart';
import AttendanceIcon from '@mui/icons-material/FactCheck';
import OpdIcon from '@mui/icons-material/LocalHospital';
import IpdIcon from '@mui/icons-material/Hotel';
import EmergencyIcon from '@mui/icons-material/Emergency';
import LabIcon from '@mui/icons-material/Science';
import RadiologyIcon from '@mui/icons-material/CameraAlt';
import PharmacyIcon from '@mui/icons-material/LocalPharmacy';
import SurgeryIcon from '@mui/icons-material/MonitorHeart';
import BloodBankIcon from '@mui/icons-material/Bloodtype';
import HostelIcon from '@mui/icons-material/Apartment';
import LibraryIcon from '@mui/icons-material/LocalLibrary';
import FinanceIcon from '@mui/icons-material/AccountBalance';
import HrIcon from '@mui/icons-material/BadgeOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import TransportIcon from '@mui/icons-material/DirectionsBus';
import ResearchIcon from '@mui/icons-material/Biotech';
import ReportsIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import NotifyIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, TOPBAR_HEIGHT } from '../theme';

/* ─── Auth Context ─── */
export type User = {
  id: string;
  name: string;
  role: string;
  department: string;
  institution_id: string;
  student_id: string | null;
  csrf: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/* ─── API Helper ─── */
export async function api(
  path: string,
  method = 'GET',
  body?: unknown,
  csrf?: string,
  idempotencyKey?: string,
): Promise<any> {
  const r = await fetch(`/api/v1/${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'medora',
      ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(r.ok ? 'Unexpected server response.' : `Server error (${r.status}).`);
  }
  if (!r.ok) throw new Error(data.error?.message || 'Unable to complete request.');
  return data;
}

/* ─── Sidebar Navigation Config ─── */
type NavSection = {
  label: string;
  items: { label: string; icon: React.ReactNode; path: string; roles?: string[] }[];
};

const navSections: NavSection[] = [
  {
    label: '',
    items: [
      { label: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} />, path: '/portal/dashboard' },
    ],
  },
  {
    label: 'ROLE WORKSPACES',
    items: [
      { label: 'Student Portal', icon: <SchoolIcon sx={{ fontSize: 20 }} />, path: '/portal/student' },
      { label: 'Doctor Console', icon: <OpdIcon sx={{ fontSize: 20 }} />, path: '/portal/doctor' },
      { label: 'CMS Website Studio', icon: <SettingsIcon sx={{ fontSize: 20 }} />, path: '/portal/cms' },
    ],
  },
  {
    label: 'ACADEMIC',
    items: [
      { label: 'Students', icon: <PeopleIcon sx={{ fontSize: 20 }} />, path: '/portal/students' },
      { label: 'Faculty', icon: <SchoolIcon sx={{ fontSize: 20 }} />, path: '/portal/faculty' },
      { label: 'Departments', icon: <BusinessIcon sx={{ fontSize: 20 }} />, path: '/portal/departments' },
      { label: 'Courses', icon: <MenuBookIcon sx={{ fontSize: 20 }} />, path: '/portal/courses' },
      { label: 'CRMI Intern Logbook', icon: <SchoolIcon sx={{ fontSize: 20 }} />, path: '/portal/internship' },
      { label: 'Timetable', icon: <CalendarIcon sx={{ fontSize: 20 }} />, path: '/portal/timetable' },
      { label: 'Examination', icon: <ExamIcon sx={{ fontSize: 20 }} />, path: '/portal/examination' },
      { label: 'Results', icon: <ResultsIcon sx={{ fontSize: 20 }} />, path: '/portal/results' },
      { label: 'Attendance', icon: <AttendanceIcon sx={{ fontSize: 20 }} />, path: '/portal/attendance' },
    ],
  },
  {
    label: 'HOSPITAL',
    items: [
      { label: 'Hospital Dashboard', icon: <OpdIcon sx={{ fontSize: 20 }} />, path: '/portal/hospital' },
      { label: 'OPD', icon: <OpdIcon sx={{ fontSize: 20 }} />, path: '/portal/opd' },
      { label: 'IPD', icon: <IpdIcon sx={{ fontSize: 20 }} />, path: '/portal/ipd' },
      { label: 'Emergency', icon: <EmergencyIcon sx={{ fontSize: 20 }} />, path: '/portal/emergency' },
      { label: 'Birth, Death & MLC', icon: <OpdIcon sx={{ fontSize: 20 }} />, path: '/portal/birth-death' },
      { label: 'Biomedical Waste', icon: <InventoryIcon sx={{ fontSize: 20 }} />, path: '/portal/biomedical-waste' },
      { label: 'Cashless & Insurance', icon: <FinanceIcon sx={{ fontSize: 20 }} />, path: '/portal/insurance' },
      { label: 'Laboratory', icon: <LabIcon sx={{ fontSize: 20 }} />, path: '/portal/laboratory' },
      { label: 'Radiology', icon: <RadiologyIcon sx={{ fontSize: 20 }} />, path: '/portal/radiology' },
      { label: 'Pharmacy', icon: <PharmacyIcon sx={{ fontSize: 20 }} />, path: '/portal/pharmacy' },
      { label: 'OT & Surgery', icon: <SurgeryIcon sx={{ fontSize: 20 }} />, path: '/portal/surgery' },
      { label: 'Blood Bank', icon: <BloodBankIcon sx={{ fontSize: 20 }} />, path: '/portal/blood-bank' },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'Hostel', icon: <HostelIcon sx={{ fontSize: 20 }} />, path: '/portal/hostel' },
      { label: 'Library', icon: <LibraryIcon sx={{ fontSize: 20 }} />, path: '/portal/library' },
      { label: 'Fees & Finance', icon: <FinanceIcon sx={{ fontSize: 20 }} />, path: '/portal/finance' },
      { label: 'HR & Payroll', icon: <HrIcon sx={{ fontSize: 20 }} />, path: '/portal/hr' },
      { label: 'Inventory', icon: <InventoryIcon sx={{ fontSize: 20 }} />, path: '/portal/inventory' },
      { label: 'Transport', icon: <TransportIcon sx={{ fontSize: 20 }} />, path: '/portal/transport' },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { label: 'Notifications', icon: <NotifyIcon sx={{ fontSize: 20 }} />, path: '/portal/notifications' },
      { label: 'Staff Messages', icon: <ChatIcon sx={{ fontSize: 20 }} />, path: '/portal/messages' },
    ],
  },
  {
    label: 'REPORTS & ROLES',
    items: [
      { label: 'NMC MSR Audit', icon: <ReportsIcon sx={{ fontSize: 20 }} />, path: '/portal/nmc-audit' },
      { label: 'Research', icon: <ResearchIcon sx={{ fontSize: 20 }} />, path: '/portal/research' },
      { label: 'Reports', icon: <ReportsIcon sx={{ fontSize: 20 }} />, path: '/portal/reports' },
      { label: 'Roles & Access', icon: <SettingsIcon sx={{ fontSize: 20 }} />, path: '/portal/roles' },
      { label: 'Settings', icon: <SettingsIcon sx={{ fontSize: 20 }} />, path: '/portal/settings' },
    ],
  },
];

/* ─── Sidebar Component ─── */
function Sidebar({
  mobileOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const currentWidth = collapsed && !isMobile ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const drawerContent = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#0B1E28',
      color: '#FFFFFF',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      overflowX: 'hidden',
    }}>
      {/* ─── Brand & Collapse Header ─── */}
      <Box sx={{
        px: collapsed && !isMobile ? 1.5 : 2.5,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
        minHeight: TOPBAR_HEIGHT,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', overflow: 'hidden' }}>
          <Box sx={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            bgcolor: '#0F766E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(15,118,110,0.4)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </Box>
          {(!collapsed || isMobile) && (
            <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <Typography sx={{
                color: '#FFFFFF',
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: '1.05rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}>
                MedicaCare
              </Typography>
              <Typography sx={{
                color: '#5EEAD4',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                Medical College &amp; Hospital
              </Typography>
            </Box>
          )}
        </Stack>

        {(!collapsed || isMobile) && !isMobile && (
          <Tooltip title="Collapse Sidebar">
            <IconButton size="small" onClick={onToggleCollapse} sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' } }}>
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ─── Navigation Links ─── */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5, px: collapsed && !isMobile ? 0.8 : 1.2 }}>
        {navSections.map((section, sIdx) => (
          <Box key={sIdx} sx={{ mb: 1 }}>
            {section.label && (!collapsed || isMobile) && (
              <Typography sx={{
                px: 1.8,
                pt: sIdx === 0 ? 0.5 : 1.5,
                pb: 0.8,
                fontSize: '0.6875rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#94A3B8',
                textTransform: 'uppercase',
              }}>
                {section.label}
              </Typography>
            )}
            {section.label && collapsed && !isMobile && (
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1 }} />
            )}
            <List disablePadding>
              {section.items.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/portal/dashboard' && pathname?.startsWith(item.path));
                const buttonContent = (
                  <ListItemButton
                    selected={isActive}
                    onClick={() => {
                      router.push(item.path);
                      if (isMobile) onClose();
                    }}
                    sx={{
                      borderRadius: '10px',
                      py: 0.9,
                      px: collapsed && !isMobile ? 1 : 1.5,
                      my: 0.2,
                      minHeight: 40,
                      justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                      bgcolor: isActive ? '#0F766E !important' : 'transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: isActive ? '#0F766E !important' : 'rgba(255,255,255,0.08)',
                        '& .MuiListItemIcon-root': { color: '#FFFFFF !important' },
                        '& .MuiTypography-root': { color: '#FFFFFF !important' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{
                      minWidth: collapsed && !isMobile ? 0 : 34,
                      justifyContent: 'center',
                      color: isActive ? '#FFFFFF !important' : '#94A3B8',
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {(!collapsed || isMobile) && (
                      <Typography sx={{
                        fontSize: '0.8125rem',
                        fontWeight: isActive ? 750 : 500,
                        color: isActive ? '#FFFFFF !important' : '#CBD5E1 !important',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.label}
                      </Typography>
                    )}
                  </ListItemButton>
                );

                return (
                  <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
                    {collapsed && !isMobile ? (
                      <Tooltip title={item.label} placement="right" arrow>
                        {buttonContent}
                      </Tooltip>
                    ) : (
                      buttonContent
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* ─── Sidebar Footer Collapse Toggle (for collapsed mode) ─── */}
      {collapsed && !isMobile && (
        <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Tooltip title="Expand Sidebar" placement="right">
            <IconButton size="small" onClick={onToggleCollapse} sx={{ color: '#5EEAD4', bgcolor: 'rgba(255,255,255,0.06)' }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: currentWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

/* ─── TopBar Component ─── */
function TopBar({
  user,
  collapsed,
  onMenuClick,
  onToggleCollapse,
  onLogout,
}: {
  user: User | null;
  collapsed: boolean;
  onMenuClick: () => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifyAnchorEl, setNotifyAnchorEl] = useState<null | HTMLElement>(null);
  const [msgAnchorEl, setMsgAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(5);
  const router = useRouter();

  const currentSidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${currentSidebarWidth}px)` },
        ml: { md: `${currentSidebarWidth}px` },
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: '#1E293B',
        zIndex: (t) => t.zIndex.drawer + 1,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Toolbar sx={{ height: TOPBAR_HEIGHT, gap: 1.5, px: { xs: 2, md: 3 } }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, color: '#334155' }}
        >
          <MenuIcon />
        </IconButton>

        <IconButton
          edge="start"
          onClick={onToggleCollapse}
          sx={{ display: { xs: 'none', md: 'inline-flex' }, color: '#64748B' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search Input Bar (Clean single container, 40px height) */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#F8FAFC',
          borderRadius: '10px',
          px: 1.8,
          height: 40,
          flex: 1,
          maxWidth: 480,
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s',
          '&:focus-within': { borderColor: '#0F766E', bgcolor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(15,118,110,0.1)' },
        }}>
          <SearchIcon sx={{ color: '#94A3B8', mr: 1, fontSize: 18 }} />
          <InputBase
            placeholder="Search students, roll number, name, department..."
            sx={{ flex: 1, fontSize: '0.8125rem', color: '#1E293B' }}
          />
          <Chip
            label="Ctrl + K"
            size="small"
            sx={{
              height: 22,
              fontSize: '0.6875rem',
              bgcolor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#64748B',
              fontWeight: 700,
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Action icons */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              onClick={(e) => setNotifyAnchorEl(e.currentTarget)}
              sx={{ color: '#64748B', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', width: 36, height: 36 }}
            >
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 18, minWidth: 18 } }}>
                <NotifyIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Messages">
            <IconButton
              size="small"
              onClick={(e) => setMsgAnchorEl(e.currentTarget)}
              sx={{ color: '#64748B', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', width: 36, height: 36 }}
            >
              <Badge badgeContent={2} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 18, minWidth: 18, bgcolor: '#0F766E' } }}>
                <ChatIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Popover */}
          <Popover
            anchorEl={notifyAnchorEl}
            open={Boolean(notifyAnchorEl)}
            onClose={() => setNotifyAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: { mt: 1.2, width: 380, maxHeight: 480, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 16px 36px rgba(0,0,0,0.12)' },
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#FAFCFD' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>
                  Institutional Alerts
                </Typography>
                {unreadCount > 0 && (
                  <Chip size="small" label={`${unreadCount} New`} sx={{ bgcolor: '#FEE2E2', color: '#B91C1C', fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
                )}
              </Stack>
              {unreadCount > 0 && (
                <Button size="small" onClick={() => setUnreadCount(0)} sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 700, color: '#0F766E', p: 0.5 }}>
                  Mark all read
                </Button>
              )}
            </Box>
            <List disablePadding sx={{ maxHeight: 320, overflowY: 'auto' }}>
              {[
                { id: 1, title: 'Emergency Resus Alert', desc: 'Patient in Red Zone Bed #04 requires immediate triage review.', time: '2m ago', color: '#DC2626', badge: 'Critical' },
                { id: 2, title: 'Stat Lab Panel Ready', desc: 'Troponin-I, ABG & CBC results reported for IPD-304.', time: '15m ago', color: '#0F766E', badge: 'Laboratory' },
                { id: 3, title: 'MBBS Final Practical Schedule', desc: 'Dean Academic approved Semester-VIII Clinical VIVA timetable.', time: '1h ago', color: '#0284C7', badge: 'Academics' },
                { id: 4, title: 'Blood Bank Stock Notice', desc: '2 units O-Negative cross-matched & reserved for OT-02.', time: '3h ago', color: '#EA580C', badge: 'Blood Bank' },
                { id: 5, title: 'NMC Annual Compliance', desc: 'Faculty clinical hours report ready for final institutional signature.', time: '5h ago', color: '#7C3AED', badge: 'Compliance' },
              ].map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => { setNotifyAnchorEl(null); router.push('/portal/notifications'); }}
                  sx={{
                    p: 1.8,
                    cursor: 'pointer',
                    borderBottom: '1px solid #F8FAFC',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: '#F8FAFC' },
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, mr: 1.5, flexShrink: 0, mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A' }}>{item.title}</Typography>
                      <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{item.time}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>{item.desc}</Typography>
                    <Chip size="small" label={item.badge} sx={{ mt: 0.8, height: 18, fontSize: '0.625rem', fontWeight: 700, bgcolor: '#F1F5F9', color: '#475569' }} />
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 1.2, borderTop: '1px solid #F1F5F9', textAlign: 'center', bgcolor: '#FAFCFD' }}>
              <Button fullWidth size="small" onClick={() => { setNotifyAnchorEl(null); router.push('/portal/notifications'); }} sx={{ textTransform: 'none', fontWeight: 700, color: '#0F766E', fontSize: '0.78rem' }}>
                Open Full Notifications &amp; Alerts Hub →
              </Button>
            </Box>
          </Popover>

          {/* Messages Popover */}
          <Popover
            anchorEl={msgAnchorEl}
            open={Boolean(msgAnchorEl)}
            onClose={() => setMsgAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: { mt: 1.2, width: 380, maxHeight: 480, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 16px 36px rgba(0,0,0,0.12)' },
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#FAFCFD' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>
                  Clinical Consultations &amp; Messages
                </Typography>
              </Stack>
              <Chip size="small" label="Staff Network" sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
            </Box>
            <List disablePadding sx={{ maxHeight: 320, overflowY: 'auto' }}>
              {[
                { id: 1, sender: 'Dr. Debasis Mukherjee', role: 'Head of Cardiology', msg: 'ICU Ward 3 morning grand rounds completed. 2 stable post-PTCA.', time: '10m ago', avatar: '/images/doctor-placeholder.svg' },
                { id: 2, sender: 'Sister In-Charge Triage', role: 'Emergency Nursing', msg: 'Shift handover logged. 14 incoming trauma patients cleared.', time: '32m ago', avatar: '/images/doctor-female-placeholder.svg' },
                { id: 3, sender: 'Prof. Sunita Rao', role: 'Dept. of Anatomy', msg: 'Cadaveric dissection specimens prepared for batch B practicals.', time: '2h ago', avatar: '/images/doctor-female-placeholder.svg' },
                { id: 4, sender: 'Dr. Arjun Sen', role: 'Orthopedics OT-2', msg: 'Knee arthroplasty scheduled at 12:30 PM confirmed with Anesthesia.', time: '4h ago', avatar: '/images/doctor-placeholder.svg' },
              ].map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => { setMsgAnchorEl(null); router.push('/portal/messages'); }}
                  sx={{
                    p: 1.6,
                    cursor: 'pointer',
                    borderBottom: '1px solid #F8FAFC',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: '#F8FAFC' },
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <Avatar src={item.avatar} alt={item.sender} sx={{ width: 36, height: 36, bgcolor: '#F0FDFA', border: '1px solid #0F766E' }} />
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A' }}>{item.sender}</Typography>
                      <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{item.time}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '0.6875rem', color: '#0F766E', fontWeight: 600, mb: 0.5 }}>{item.role}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>{item.msg}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 1.2, borderTop: '1px solid #F1F5F9', textAlign: 'center', bgcolor: '#FAFCFD' }}>
              <Button fullWidth size="small" onClick={() => { setMsgAnchorEl(null); router.push('/portal/messages'); }} sx={{ textTransform: 'none', fontWeight: 700, color: '#0F766E', fontSize: '0.78rem' }}>
                Open Full Clinical Messaging Hub →
              </Button>
            </Box>
          </Popover>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

          {/* User Profile Pill */}
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              cursor: 'pointer',
              px: 1.2,
              py: 0.6,
              borderRadius: '10px',
              border: '1px solid transparent',
              transition: 'all 0.15s',
              '&:hover': { bgcolor: '#F8FAFC', borderColor: '#E2E8F0' },
            }}
          >
            <Avatar
              src={(user as any)?.avatarUrl || '/images/doctor-placeholder.svg'}
              alt={user?.name || 'User'}
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#F0FDFA',
                border: '1.5px solid #0F766E',
                boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
              }}
            >
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {user?.name || 'Dr. Ahmed Rahman'}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#0F766E', fontWeight: 600, textTransform: 'capitalize', lineHeight: 1.2 }}>
                {user?.role || 'Super Admin'}
              </Typography>
            </Box>
            <ExpandMore sx={{ fontSize: 18, color: '#94A3B8', display: { xs: 'none', sm: 'block' } }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: { mt: 1, minWidth: 190, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' },
              },
            }}
          >
            <MenuItem onClick={() => { setAnchorEl(null); router.push('/portal/roles'); }} sx={{ fontSize: '0.8125rem', gap: 1.2, py: 1 }}>
              <PersonIcon fontSize="small" sx={{ color: '#0F766E' }} /> Roles &amp; Permissions
            </MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: '0.8125rem', gap: 1.2, py: 1 }}>
              <SettingsIcon fontSize="small" sx={{ color: '#64748B' }} /> System Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={onLogout} sx={{ fontSize: '0.8125rem', gap: 1.2, py: 1, color: '#DC2626' }}>
              <LogoutIcon fontSize="small" /> Sign Out
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

/* ─── Portal Shell Layout ─── */
export default function PortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('auth/me')
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push('/portal');
      });
  }, [router]);

  const logout = useCallback(async () => {
    try {
      if (user?.csrf) await api('auth/logout', 'POST', undefined, user.csrf);
    } catch {}
    setUser(null);
    router.push('/portal');
  }, [user, router]);

  const authValue = useMemo(() => ({ user, loading, logout }), [user, loading, logout]);

  const currentSidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: '#F8FAFC',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: '#0F766E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </Box>
          <Typography variant="body2" color="text.secondary">Loading workspace...</Typography>
        </Box>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthContext.Provider value={authValue}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <TopBar
          user={user}
          collapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onLogout={logout}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${currentSidebarWidth}px)` },
            ml: { md: `${currentSidebarWidth}px` },
            mt: `${TOPBAR_HEIGHT}px`,
            p: { xs: 2, md: 3 },
            minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthContext.Provider>
  );
}
