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
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmergencyIcon from '@mui/icons-material/Emergency';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface NotificationItem {
  id: string;
  category: string;
  severity: string;
  title: string;
  desc: string;
  department: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const loadNotifications = () => {
    api('clinical/notifications')
      .then((res: any) => {
        if (res?.notifications) {
          setNotifications(
            res.notifications.map((n: any) => ({
              id: n.id,
              category: n.category || 'clinical',
              severity: n.priority || 'medium',
              title: n.title,
              desc: n.message || n.desc || '',
              department:
                n.category === 'clinical'
                  ? 'Clinical Ward'
                  : n.category === 'academic'
                  ? 'Dean Academic Affairs'
                  : n.category === 'blood'
                  ? 'Blood Transfusion Center'
                  : n.category === 'nmc'
                  ? 'Institutional Compliance'
                  : 'Hospital Administration',
              timestamp: n.time || 'Today',
              read: Boolean(n.read),
              actionUrl: '/portal/dashboard',
              actionLabel: 'View Details',
            }))
          );
        }
      })
      .catch((err) => console.error('Failed to load notifications', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await api('clinical/notifications/mark-all-read', 'POST', {}, user?.csrf);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error('Failed to mark all as read', e);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = async (id: string) => {
    try {
      await api(`clinical/notifications/${id}/delete`, 'POST', {}, user?.csrf);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error('Failed to delete notification', e);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (tabValue !== 'all' && n.category !== tabValue) return false;
    if (severityFilter !== 'all' && n.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityChip = (severity: NotificationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <Chip size="small" label="CRITICAL STAT" sx={{ bgcolor: '#FEE2E2', color: '#B91C1C', fontWeight: 800, fontSize: '0.65rem' }} />;
      case 'high':
        return <Chip size="small" label="HIGH PRIORITY" sx={{ bgcolor: '#FFEDD5', color: '#C2410C', fontWeight: 800, fontSize: '0.65rem' }} />;
      case 'medium':
        return <Chip size="small" label="ROUTINE" sx={{ bgcolor: '#E0E7FF', color: '#4338CA', fontWeight: 800, fontSize: '0.65rem' }} />;
      default:
        return <Chip size="small" label="INFO" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '0.65rem' }} />;
    }
  };

  return (
    <Box>
      {/* ─── Breadcrumbs & Header Section ─── */}
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 0.5 }}>
            <Link underline="hover" color="inherit" href="/portal/dashboard">
              Communication
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Notifications
            </Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
              Notification &amp; Clinical Alerts Center
            </Typography>
            {unreadCount > 0 && (
              <Chip label={`${unreadCount} Unread`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#B91C1C', fontWeight: 800 }} />
            )}
          </Stack>
          <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
            Real-time dispatch board for statutory NMC notices, critical bedside patient alerts, laboratory panels and academic gazettes.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#CBD5E1', color: '#0F766E', whiteSpace: 'nowrap', px: 2, py: 0.8, borderRadius: '8px' }}
          >
            Mark All as Read
          </Button>
          <Chip
            label="Live Sync: Active"
            size="small"
            icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#059669 !important' }} />}
            sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 700, border: '1px solid #A7F3D0', py: 0.5 }}
          />
        </Stack>
      </Stack>

        {/* Metric KPI Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            { title: 'Critical Patient Alerts', count: '2 STAT', sub: 'Bedside action required', icon: <EmergencyIcon sx={{ color: '#DC2626' }} />, color: '#FEE2E2' },
            { title: 'Stat Lab & Radiology', count: '1 Verified', sub: 'Critical reports released', icon: <ScienceIcon sx={{ color: '#0F766E' }} />, color: '#CCFBF1' },
            { title: 'Academic & Circulars', count: '2 Circulars', sub: 'WBUHS & Exam gazettes', icon: <SchoolIcon sx={{ color: '#0284C7' }} />, color: '#E0F2FE' },
            { title: 'Blood Bank & Pharmacy', count: '1 Reserved', sub: '2 units O-neg cross-matched', icon: <BloodtypeIcon sx={{ color: '#EA580C' }} />, color: '#FFEDD5' },
          ].map((kpi, idx) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{kpi.title}</Typography>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F172A' }}>{kpi.count}</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{kpi.sub}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Filter and Content Card */}
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
          {/* Tabs bar */}
          <Box sx={{ borderBottom: '1px solid #E2E8F0', px: 2, bgcolor: '#FAFCFD' }}>
            <Tabs
              value={tabValue}
              onChange={(_, val) => setTabValue(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', minHeight: 48 } }}
            >
              <Tab value="all" label={`All Alerts (${notifications.length})`} />
              <Tab value="clinical" label="Clinical & Emergency" />
              <Tab value="academic" label="Academics & Exams" />
              <Tab value="blood" label="Blood Bank" />
              <Tab value="nmc" label="NMC Regulatory" />
            </Tabs>
          </Box>

          {/* Search & Filter Toolbar */}
          <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9', bgcolor: '#FFFFFF' }}>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search alert by patient, title, department or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Button
                    size="small"
                    variant={severityFilter === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setSeverityFilter('all')}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', ...(severityFilter === 'all' ? { bgcolor: '#0F766E', color: '#FFFFFF !important' } : { borderColor: '#CBD5E1', color: '#475569' }) }}
                  >
                    All Severity
                  </Button>
                  <Button
                    size="small"
                    variant={severityFilter === 'critical' ? 'contained' : 'outlined'}
                    onClick={() => setSeverityFilter(severityFilter === 'critical' ? 'all' : 'critical')}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', ...(severityFilter === 'critical' ? { bgcolor: '#DC2626', color: '#FFFFFF !important' } : { borderColor: '#FCA5A5', color: '#B91C1C' }) }}
                  >
                    Critical STAT
                  </Button>
                  <Button
                    size="small"
                    variant={severityFilter === 'high' ? 'contained' : 'outlined'}
                    onClick={() => setSeverityFilter(severityFilter === 'high' ? 'all' : 'high')}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', ...(severityFilter === 'high' ? { bgcolor: '#C2410C', color: '#FFFFFF !important' } : { borderColor: '#FDBA74', color: '#C2410C' }) }}
                  >
                    High
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* List of Notification Items */}
          <Stack divider={<Divider />} sx={{ p: 0 }}>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#64748B', fontWeight: 600 }}>No notifications match the active filter criteria.</Typography>
              </Box>
            ) : (
              filteredNotifications.map((notif) => (
                <Box
                  key={notif.id}
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                    bgcolor: notif.read ? '#FFFFFF' : 'rgba(15,118,110,0.025)',
                    borderLeft: notif.read ? '4px solid transparent' : '4px solid #0F766E',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: '#F8FAFC' },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.8, flexWrap: 'wrap', gap: 0.8 }}>
                      {getSeverityChip(notif.severity)}
                      <Chip label={notif.department} size="small" sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 700, fontSize: '0.6875rem' }} />
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#94A3B8' }}>
                        <AccessTimeIcon sx={{ fontSize: 13 }} />
                        <Typography sx={{ fontSize: '0.72rem' }}>{notif.timestamp}</Typography>
                      </Stack>
                    </Stack>

                    <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A', mb: 0.4 }}>
                      {notif.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, maxWidth: 900 }}>
                      {notif.desc}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                    {notif.actionUrl && (
                      <Button
                        size="small"
                        variant="contained"
                        href={notif.actionUrl}
                        endIcon={<ArrowForwardIcon sx={{ color: '#FFFFFF !important' }} />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          bgcolor: '#0F766E',
                          color: '#FFFFFF !important',
                          boxShadow: '0 2px 6px rgba(15,118,110,0.25)',
                          '& .MuiButton-endIcon': { color: '#FFFFFF !important' },
                          '&:hover': { bgcolor: '#115E59', color: '#FFFFFF !important' },
                        }}
                      >
                        {notif.actionLabel || 'Action'}
                      </Button>
                    )}
                    {!notif.read && (
                      <Tooltip title="Mark as read">
                        <IconButton size="small" onClick={() => markAsRead(notif.id)} sx={{ color: '#0F766E' }}>
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Dismiss">
                      <IconButton size="small" onClick={() => deleteNotification(notif.id)} sx={{ color: '#94A3B8', '&:hover': { color: '#DC2626' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        </Card>
    </Box>
  );
}
