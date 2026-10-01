'use client';

import React, { useState, useEffect } from 'react';
import { api, useAuth } from '../../PortalShell';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';
import toast from 'react-hot-toast';

// Icons
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface InquiryItem {
  id: string;
  type: 'contact' | 'admission' | 'emergency';
  name: string;
  email: string;
  phone?: string | null;
  category?: string | null;
  neet_score?: string | null;
  subject?: string | null;
  message: string;
  status: 'Pending' | 'Contacted' | 'Resolved';
  created_at: string;
}

export default function InquiriesDeskPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<InquiryItem | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const typeParam = tabValue === 'ALL' ? '' : `&type=${tabValue}`;
      const res = await api(`public/inquiries?limit=100${typeParam}`);
      if (res && res.data) {
        setInquiries(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load website inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    setPage(0);
  }, [tabValue]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  const handleUpdateStatus = async (id: string, newStatus: 'Pending' | 'Contacted' | 'Resolved') => {
    setActionLoading(true);
    try {
      await api(`public/inquiries/${id}/status`, 'PATCH', { status: newStatus });
      toast.success(`Inquiry marked as ${newStatus}`);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
      fetchInquiries();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!rowToDelete) return;
    try {
      await api(`public/inquiries/${rowToDelete.id}`, 'DELETE', null, user?.csrf);
      toast.success('Inquiry record deleted successfully');
      setInquiries((prev) => prev.filter((i) => i.id !== rowToDelete.id));
      if (selectedInquiry?.id === rowToDelete.id) {
        setSelectedInquiry(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete inquiry.');
    } finally {
      setDeleteModalOpen(false);
      setRowToDelete(null);
    }
  };

  const filtered = inquiries.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      item.message.toLowerCase().includes(q)
    );
  });

  const totalCount = inquiries.length;
  const admissionCount = inquiries.filter((i) => i.type === 'admission').length;
  const contactCount = inquiries.filter((i) => i.type === 'contact').length;
  const pendingCount = inquiries.filter((i) => i.status === 'Pending').length;

  return (
    <Box sx={{ pb: 3 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/portal/dashboard' },
          { label: 'Communication' },
          { label: 'Public Inquiries & Leads' },
        ]}
        category="Communication & Admissions"
        title="Website Inquiries & Admissions Desk"
        description="Real-time feed of candidate counseling applications, general queries, and contact messages submitted via public portals."
        icon={<EmailIcon />}
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchInquiries}
            disabled={loading}
            sx={{ borderColor: '#CBD5E1', color: '#0F766E', textTransform: 'none', fontWeight: 700 }}
          >
            Refresh
          </Button>
        }
      />

      {/* ─── KPI Metrics ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Total Inquiries', value: totalCount, icon: <EmailIcon sx={{ color: '#0F766E' }} />, bg: '#F0FDFA' },
          { label: 'Admission Counseling', value: admissionCount, icon: <SchoolIcon sx={{ color: '#0284C7' }} />, bg: '#F0F9FF' },
          { label: 'General / Hospital', value: contactCount, icon: <ContactSupportIcon sx={{ color: '#7C3AED' }} />, bg: '#FAF5FF' },
          { label: 'Awaiting Action', value: pendingCount, icon: <AccessTimeIcon sx={{ color: '#D97706' }} />, bg: '#FFFBEB' },
        ].map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: kpi.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {kpi.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
                  {kpi.label}
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {kpi.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ─── Filter Tabs & Search Bar ─── */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #E2E8F0', mb: 3, bgcolor: '#FFFFFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: '#64748B',
                '&.Mui-selected': { color: '#0F766E' },
              },
              '& .MuiTabs-indicator': { bgcolor: '#0F766E' },
            }}
          >
            <Tab label={`All Inquiries (${totalCount})`} value="ALL" />
            <Tab label="Admission Leads" value="admission" />
            <Tab label="General Inquiries" value="contact" />
            <Tab label="Emergency Requests" value="emergency" />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search candidate, email, phone, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: '100%', md: 320 } }}
          />
        </Stack>
      </Paper>

      {/* ─── Inquiries Table ─── */}
      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
        {loading ? (
          <Box sx={{ p: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={32} sx={{ color: '#0F766E' }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <EmailIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1.5 }} />
            <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '1rem' }}>
              No inquiries found in this category
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Incoming submissions from the public website will immediately appear here.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>Sender / Candidate</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>Type &amp; Category</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>NEET / Academic Info</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>Message Preview</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>Received</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>
                          {row.name}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.3 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                            {row.email}
                          </Typography>
                          {row.phone && (
                            <>
                              <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1' }}>•</Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 600 }}>
                                {row.phone}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
                        <StatusBadge status={row.type.toUpperCase()} size="small" />
                        {row.category && (
                          <Typography sx={{ fontSize: '0.8125rem', color: '#334155', fontWeight: 600 }}>
                            {row.category}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {row.neet_score ? (
                        <StatusBadge status={`NEET: ${row.neet_score}`} tone="warning" />
                      ) : (
                        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>—</Typography>
                      )}
                    </TableCell>

                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography
                        sx={{
                          fontSize: '0.8125rem',
                          color: '#475569',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {row.subject ? `${row.subject} — ${row.message}` : row.message}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {new Date(row.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedInquiry(row)}
                          sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', borderRadius: '6px', borderColor: '#CBD5E1', color: '#0F766E' }}
                        >
                          View Details
                        </Button>
                        <Tooltip title="Delete Record">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setRowToDelete(row);
                              setDeleteModalOpen(true);
                            }}
                            sx={{ color: '#E11D48', '&:hover': { bgcolor: '#FFF1F2' } }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* ─── Detail Modal ─── */}
      <Dialog
        open={Boolean(selectedInquiry)}
        onClose={() => setSelectedInquiry(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              maxWidth: '740px',
              width: '100%',
              boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {selectedInquiry && (
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
                  {selectedInquiry.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Manrope', sans-serif", fontSize: '0.825rem', mt: 0.25 }}>
                  Reference ID: #{selectedInquiry.id} · Admission Desk Dossier
                </Typography>
              </Box>
              <StatusBadge status={selectedInquiry.status} size="medium" />
            </DialogTitle>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogContent sx={{ p: 3, bgcolor: '#FAFAFB' }}>
              <Stack spacing={2.5}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>
                        Email Address
                      </Typography>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#0F766E', fontSize: '0.925rem', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                        <Link href={`mailto:${selectedInquiry.email}`} underline="hover" color="inherit" sx={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                          {selectedInquiry.email}
                        </Link>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>
                        Phone Contact
                      </Typography>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#0F172A', fontSize: '0.925rem', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                        {selectedInquiry.phone ? (
                          <Link href={`tel:${selectedInquiry.phone}`} underline="hover" color="inherit">
                            {selectedInquiry.phone}
                          </Link>
                        ) : (
                          'Not provided'
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>
                        Category / Course
                      </Typography>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#0F172A', fontSize: '0.925rem', wordBreak: 'break-word' }}>
                        {selectedInquiry.category || 'General'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>
                        NEET Score
                      </Typography>
                      <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#0F172A', fontSize: '0.925rem', wordBreak: 'break-word' }}>
                        {selectedInquiry.neet_score ? `${selectedInquiry.neet_score} Marks` : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {selectedInquiry.subject && (
                  <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', minWidth: 0, overflow: 'hidden' }}>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, mb: 0.5 }}>
                      Subject
                    </Typography>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#0F172A', fontSize: '0.95rem', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {selectedInquiry.subject}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ p: 2.5, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', minWidth: 0, overflow: 'hidden' }}>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block', mb: 0.75 }}>
                    Inquiry Message / Statement of Interest:
                  </Typography>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", color: '#334155', fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    {selectedInquiry.message}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'space-between', bgcolor: '#FFFFFF' }}>
              <Button onClick={() => setSelectedInquiry(null)} sx={{ textTransform: 'none', color: '#64748B', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                Close
              </Button>
              <Stack direction="row" spacing={1.5}>
                {selectedInquiry.status !== 'Contacted' && (
                  <Button
                    variant="outlined"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'Contacted')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontFamily: "'Manrope', sans-serif",
                      borderColor: '#4338CA',
                      color: '#4338CA',
                      borderRadius: '10px',
                      px: 2,
                    }}
                  >
                    Mark Contacted
                  </Button>
                )}
                {selectedInquiry.status !== 'Resolved' && (
                  <Button
                    variant="contained"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'Resolved')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontFamily: "'Manrope', sans-serif",
                      bgcolor: '#0F766E',
                      borderRadius: '10px',
                      px: 2.5,
                      boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
                      '&:hover': { bgcolor: '#0D6861' },
                    }}
                  >
                    Resolve Inquiry
                  </Button>
                )}
              </Stack>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Delete Confirmation Modal ─── */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PriorityHighIcon sx={{ color: '#E11D48' }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Are you sure you want to permanently delete the inquiry from{' '}
            <strong style={{ color: '#0F172A' }}>{rowToDelete?.name}</strong> ({rowToDelete?.email})? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => setDeleteModalOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#E11D48',
              '&:hover': { bgcolor: '#BE123C' },
            }}
          >
            Delete Inquiry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
