'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { MedoraDataGridPagination } from '../Pagination';
import { MedoraDatePicker } from '../MedoraDatePicker';
import { StatusBadge } from '../StatusBadge';
import { PageHeader } from '../PageHeader';
import { api, useAuth } from './PortalShell';
import toast from 'react-hot-toast';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloseIcon from '@mui/icons-material/Close';

export interface ModuleKPICard {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  color: { bg: string; icon: string };
}

export interface ModuleColumn {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: any) => React.ReactNode;
}

export interface GenericModulePageProps {
  category: string;
  title: string;
  description: string;
  kpis: ModuleKPICard[];
  columns: ModuleColumn[];
  initialData: any[];
  addModalTitle?: string;
  addFields?: {
    id: string;
    label: string;
    placeholder?: string;
    type?: string;
    disableFuture?: boolean;
    disablePast?: boolean;
  }[];
  /** Optional: backend resource name (e.g. 'sessions', 'invoices'). When set, data is fetched from the live API. */
  apiResource?: string;
  onAddClick?: () => void;
  onViewClick?: (row: any) => void;
  onEditClick?: (row: any) => void;
  onDeleteClick?: (row: any) => void;
}

const isFieldPastDate = (field: { id: string; label: string; disableFuture?: boolean; disablePast?: boolean }) => {
  if (field.disableFuture !== undefined) return field.disableFuture;
  const key = `${field.id} ${field.label}`.toLowerCase();
  return (
    key.includes('dob') ||
    key.includes('birth') ||
    key.includes('death') ||
    key.includes('incident') ||
    key.includes('joined') ||
    key.includes('admitted') ||
    key.includes('attendance') ||
    key.includes('issue') ||
    key.includes('discharged') ||
    key.includes('past') ||
    key.includes('activity')
  );
};

const isFieldFutureDate = (field: { id: string; label: string; disableFuture?: boolean; disablePast?: boolean }) => {
  if (field.disablePast !== undefined) return field.disablePast;
  const key = `${field.id} ${field.label}`.toLowerCase();
  return (
    key.includes('appointment') ||
    key.includes('exam') ||
    key.includes('start') ||
    key.includes('due') ||
    key.includes('deadline') ||
    key.includes('expiry') ||
    key.includes('scheduled') ||
    key.includes('review')
  );
};

export default function GenericModulePage({
  category,
  title,
  description,
  kpis,
  columns,
  initialData,
  addModalTitle,
  addFields = [],
  apiResource,
  onAddClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
}: GenericModulePageProps) {
  const { user } = useAuth();
  const [rawItems, setRawItems] = useState<any[]>(initialData || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [rowToView, setRowToView] = useState<any>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);

  const [addError, setAddError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!apiResource);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Compute effective editable/addable fields (derived from columns if addFields not specified)
  const effectiveFields: {
    id: string;
    label: string;
    placeholder?: string;
    type?: string;
    disableFuture?: boolean;
    disablePast?: boolean;
  }[] = useMemo(() => {
    if (addFields && addFields.length > 0) return addFields;
    return columns
      .filter((c) => c.id !== 'actions')
      .map((c) => ({
        id: c.id,
        label: c.label,
        placeholder: `Enter ${c.label.toLowerCase()}`,
        type: 'text',
        disableFuture: false,
        disablePast: false,
      }));
  }, [addFields, columns]);

  // Fetch data from backend API if apiResource is set
  const fetchData = useCallback(async () => {
    if (!apiResource) return;
    setLoading(true);
    setFetchError(null);
    try {
      const qParams = new URLSearchParams();
      if (search) qParams.append('q', search);
      if (statusFilter !== 'ALL') qParams.append('status', statusFilter);
      qParams.append('page', (page + 1).toString());
      qParams.append('limit', '100');

      const res = await api(`${apiResource}?${qParams.toString()}`);
      if (res?.items) {
        setRawItems(res.items);
      } else if (Array.isArray(res)) {
        setRawItems(res);
      }
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load live data.');
    } finally {
      setLoading(false);
    }
  }, [apiResource, search, statusFilter, page]);

  useEffect(() => {
    if (apiResource) {
      fetchData();
    }
  }, [apiResource, fetchData]);

  // Search & Status Filter
  const filteredItems = useMemo(() => {
    return rawItems.filter((item: any) => {
      // Status filter
      if (statusFilter !== 'ALL' && item.status) {
        const itemStatus = String(item.status).toLowerCase();
        if (itemStatus !== statusFilter.toLowerCase()) return false;
      }

      // Search filter across all string/number fields
      if (search.trim()) {
        const q = search.toLowerCase();
        const hasMatch = Object.entries(item).some(([k, val]) => {
          if (k === 'id') return false;
          return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
        });
        if (!hasMatch) return false;
      }
      return true;
    });
  }, [rawItems, search, statusFilter]);

  // Reset page to 0 when search or filter changes
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter]);

  // Form management for Add / Edit
  const { control, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: {},
  });

  const onSubmit = async (formData: any) => {
    if (Object.keys(formData).length === 0) return;

    // Validate contextual date fields
    for (const field of effectiveFields) {
      if (field.type === 'date' && formData[field.id]) {
        const val = new Date(formData[field.id]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isFieldPastDate(field) && val > new Date()) {
          setAddError(`${field.label} cannot be in the future.`);
          return;
        }
        if (isFieldFutureDate(field) && val < today) {
          setAddError(`${field.label} cannot be in the past.`);
          return;
        }
      }
    }

    setAddError(null);

    // Save logic
    if (apiResource) {
      try {
        if (editMode && editingId) {
          const res = await api(`${apiResource}/${editingId}`, 'PATCH', formData, user?.csrf);
          const updated = res?.item || { id: editingId, ...formData };
          setRawItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...updated } : item)));
          toast.success('Record updated successfully!');
        } else {
          const res = await api(apiResource, 'POST', formData, user?.csrf);
          const newItem = res?.item || { id: `REC-${Date.now().toString().slice(-6)}`, status: 'Active', ...formData };
          setRawItems((prev) => [newItem, ...prev]);
          toast.success('New record created successfully!');
        }
      } catch (err: any) {
        setAddError(err.message || 'Failed to save record.');
        return;
      }
    } else {
      if (editMode && editingId) {
        setRawItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item)));
        toast.success('Record updated successfully!');
      } else {
        const newItem = {
          id: `REC-${Date.now().toString().slice(-6)}`,
          status: formData.status || 'Active',
          ...formData,
        };
        setRawItems((prev) => [newItem, ...prev]);
        toast.success('New record added successfully!');
      }
    }

    reset({});
    setOpenAdd(false);
    setEditMode(false);
    setEditingId(null);
  };

  const handleViewClick = (row: any) => {
    if (onViewClick) {
      onViewClick(row);
    }
    setRowToView(row);
    setViewModalOpen(true);
  };

  const handleEditClick = (row: any) => {
    if (onEditClick) {
      onEditClick(row);
      return;
    }
    // Prefill form values
    reset(row);
    setEditingId(row.id);
    setEditMode(true);
    setOpenAdd(true);
    setViewModalOpen(false);
  };

  const handleDeleteClick = (row: any) => {
    if (onDeleteClick) {
      onDeleteClick(row);
      return;
    }
    setRowToDelete(row);
    setDeleteModalOpen(true);
    setViewModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!rowToDelete) return;
    if (apiResource) {
      try {
        await api(`${apiResource}/${rowToDelete.id}`, 'DELETE', null, user?.csrf);
        setRawItems((prev) => prev.filter((item) => item.id !== rowToDelete.id));
        toast.success('Record deleted successfully');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete record.');
      }
    } else {
      setRawItems((prev) => prev.filter((item) => item.id !== rowToDelete.id));
      toast.success('Record deleted successfully');
    }
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const handleExportCSV = () => {
    if (filteredItems.length === 0) {
      toast.error('No records available to export.');
      return;
    }
    const cols = columns.filter((c) => c.id !== 'actions');
    const headers = cols.map((c) => `"${c.label}"`).join(',');
    const rows = filteredItems.map((item) =>
      cols
        .map((c) => {
          const val = item[c.id] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-export.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredItems.length} records to CSV!`);
  };

  const CONTROL_HEIGHT = 40;

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        category={category}
        title={title}
        description={description}
      />

      {/* ─── KPI Cards Grid ─── */}
      {kpis.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {kpis.map((kpi, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 12 / Math.min(kpis.length, 4) }} key={idx}>
              <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF', height: '100%' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      bgcolor: kpi.color.bg,
                      color: kpi.color.icon,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{kpi.title}</Typography>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#0F172A', lineHeight: 1.1 }}>
                      {kpi.value}
                    </Typography>
                  </Box>
                </Stack>
                {kpi.trend !== undefined && (
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 14, color: '#059669' }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669' }}>
                      +{kpi.trend}%
                    </Typography>
                    {kpi.trendLabel && (
                      <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>{kpi.trendLabel}</Typography>
                    )}
                  </Stack>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ─── Filter Bar ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 1.5, mb: 2.5, bgcolor: '#FFFFFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {/* Search Box */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                px: 1.5,
                height: CONTROL_HEIGHT,
                width: { xs: '100%', sm: 260 },
                boxSizing: 'border-box',
                transition: 'all 0.15s',
                '&:focus-within': { borderColor: '#0F766E', boxShadow: '0 0 0 2px rgba(15,118,110,0.15)' },
              }}
            >
              <SearchIcon sx={{ color: '#94A3B8', fontSize: 18, mr: 0.8, flexShrink: 0 }} />
              <InputBase
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ fontSize: '0.8125rem', color: '#1E293B', width: '100%' }}
              />
              {search && (
                <IconButton size="small" onClick={() => setSearch('')} sx={{ p: 0.2 }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{
                height: CONTROL_HEIGHT,
                minWidth: 140,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                bgcolor: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' },
              }}
            >
              <MenuItem value="ALL" sx={{ fontSize: '0.8125rem' }}>All Statuses ({filteredItems.length})</MenuItem>
              <MenuItem value="Active" sx={{ fontSize: '0.8125rem' }}>Active</MenuItem>
              <MenuItem value="Completed" sx={{ fontSize: '0.8125rem' }}>Completed</MenuItem>
              <MenuItem value="Pending" sx={{ fontSize: '0.8125rem' }}>Pending</MenuItem>
              <MenuItem value="Available" sx={{ fontSize: '0.8125rem' }}>Available</MenuItem>
              <MenuItem value="In Stock" sx={{ fontSize: '0.8125rem' }}>In Stock</MenuItem>
            </Select>

            {/* Result count indicator */}
            <Typography sx={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              Showing {filteredItems.length} records
            </Typography>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                if (onAddClick) {
                  onAddClick();
                } else {
                  reset({});
                  setEditMode(false);
                  setEditingId(null);
                  setOpenAdd(true);
                }
              }}
              sx={{
                height: CONTROL_HEIGHT,
                bgcolor: '#0F766E',
                fontWeight: 700,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                textTransform: 'none',
                px: 2,
                boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#0D6861' },
              }}
            >
              {addModalTitle ? `+ ${addModalTitle}` : '+ Add Record'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={handleExportCSV}
              sx={{
                height: CONTROL_HEIGHT,
                borderColor: '#CBD5E1',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                textTransform: 'none',
                px: 2,
                bgcolor: '#FFFFFF',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#F8FAFC', borderColor: '#94A3B8' },
              }}
            >
              Export CSV
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* ─── Main Table ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', bgcolor: '#FFFFFF', minHeight: 460 }}>
        {loading ? (
          <Box sx={{ p: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={32} sx={{ color: '#0F766E' }} />
          </Box>
        ) : (
          <DataGrid
            rows={filteredItems}
            autoHeight
            columns={[
              ...columns.map((col): GridColDef => ({
                field: col.id,
                headerName: col.label,
                flex: col.id === 'id' ? 0.6 : 1,
                minWidth: col.id === 'name' || col.id === 'title' ? 180 : 120,
                align: col.align || 'left',
                headerAlign: col.align || 'left',
                renderCell: (params: GridRenderCellParams) => {
                  if (col.render) return col.render(params.row);
                  const isStatusLike = /^(status|state|payment_status|paymentStatus|priority|condition|availability|approval_status)$/i.test(col.id);
                  if (isStatusLike) {
                    const val = String(params.value ?? 'Active');
                    return <StatusBadge status={val} />;
                  }
                  return (
                    <Typography sx={{ fontSize: '0.8125rem', color: '#1E293B', fontWeight: col.id === 'name' || col.id === 'title' || col.id === 'code' ? 700 : 400 }}>
                      {params.value ?? '—'}
                    </Typography>
                  );
                },
              })),
              {
                field: 'actions',
                headerName: 'Actions',
                width: 140,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => (
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewClick(params.row)}
                        sx={{ color: '#64748B', '&:hover': { color: '#0F766E', bgcolor: '#F0FDFA' } }}
                      >
                        <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Record">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(params.row)}
                        sx={{ color: '#64748B', '&:hover': { color: '#0F766E', bgcolor: '#F0FDFA' } }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Record">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(params.row)}
                        sx={{ color: '#E11D48', '&:hover': { bgcolor: '#FFF1F2' } }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ),
              },
            ]}
            slots={{
              pagination: MedoraDataGridPagination,
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: rowsPerPage, page: 0 } },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' },
              '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9' },
              '& .MuiDataGrid-row:hover': { bgcolor: '#F8FAFC' },
            }}
          />
        )}
      </Card>

      {/* ─── VIEW RECORD DETAILS MODAL ─── */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              maxWidth: '760px',
              width: '100%',
              boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            p: 3,
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            bgcolor: '#FFFFFF',
          }}
        >
          <Box sx={{ pr: 2 }}>
            <Typography
              component="span"
              variant="h6"
              sx={{
                fontWeight: 800,
                color: '#0F172A',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '1.25rem',
                display: 'block',
                lineHeight: 1.3,
              }}
            >
              {rowToView?.name || rowToView?.title || rowToView?.code || `Record #${rowToView?.id}`}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748B',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.825rem',
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              {title} · Detailed Dossier
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setViewModalOpen(false)}
            sx={{
              color: '#94A3B8',
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              p: 0.75,
              '&:hover': { color: '#0F172A', bgcolor: '#F1F5F9' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: '#F1F5F9' }} />
        <DialogContent sx={{ p: 3, bgcolor: '#FAFAFB' }}>
          {rowToView && (
            <Grid container spacing={2}>
              {columns
                .filter((c) => c.id !== 'actions')
                .map((c) => {
                  const isStatus = /^(status|state|payment_status|paymentStatus|priority|condition|availability|approval_status)$/i.test(c.id);
                  const val = rowToView[c.id];
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={c.id} sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          height: '100%',
                          minWidth: 0,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            borderColor: '#CBD5E1',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'Manrope', sans-serif",
                            fontSize: '0.75rem',
                            color: '#64748B',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            mb: 0.75,
                          }}
                        >
                          {c.label}
                        </Typography>
                        {isStatus ? (
                          <Box sx={{ mt: 0.25, display: 'flex', alignItems: 'center' }}>
                            <StatusBadge status={String(val || 'Active')} size="medium" />
                          </Box>
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: "'Manrope', sans-serif",
                              fontSize: '0.925rem',
                              color: '#0F172A',
                              fontWeight: 700,
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              lineHeight: 1.4,
                            }}
                          >
                            {val !== undefined && val !== null && String(val).trim() !== '' ? String(val) : '—'}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
            </Grid>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: '#F1F5F9' }} />
        <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'space-between', bgcolor: '#FFFFFF' }}>
          <Button
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => handleDeleteClick(rowToView)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: "'Manrope', sans-serif",
              borderRadius: '8px',
              px: 1.5,
              '&:hover': { bgcolor: '#FEE2E2' },
            }}
          >
            Delete Record
          </Button>
          <Stack direction="row" spacing={1.5}>
            <Button
              onClick={() => setViewModalOpen(false)}
              sx={{
                color: '#64748B',
                textTransform: 'none',
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() => handleEditClick(rowToView)}
              sx={{
                bgcolor: '#0F766E',
                fontWeight: 700,
                fontFamily: "'Manrope', sans-serif",
                textTransform: 'none',
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
                '&:hover': { bgcolor: '#0D6861' },
              }}
            >
              Edit Record
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* ─── ADD / EDIT RECORD MODAL ─── */}
      <Dialog
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setAddError(null);
          reset({});
        }}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
            {editMode ? `Edit ${addModalTitle || 'Record'}` : `Add New ${addModalTitle || 'Record'}`}
          </DialogTitle>
          <DialogContent>
            {addError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px', fontSize: '0.8125rem' }}>
                {addError}
              </Alert>
            )}
            <Stack spacing={2} sx={{ mt: 1 }}>
              {effectiveFields.map((field) => (
                <Controller
                  key={field.id}
                  name={field.id}
                  control={control}
                  rules={{ required: field.id === 'name' || field.id === 'title' || field.id === 'code' }}
                  render={({ field: { onChange, value } }) => (
                    field.type === 'date' ? (
                      <MedoraDatePicker
                        label={field.label}
                        value={value || ''}
                        onChange={(v) => {
                          onChange(v);
                          if (addError) setAddError(null);
                        }}
                        disableFuture={field.disableFuture}
                        disablePast={field.disablePast}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        label={field.label}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        type={(field.type as any) || 'text'}
                        value={value ?? ''}
                        onChange={(e) => {
                          onChange(e.target.value);
                          if (addError) setAddError(null);
                        }}
                      />
                    )
                  )}
                />
              ))}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button
              onClick={() => {
                setOpenAdd(false);
                setAddError(null);
                reset({});
              }}
              sx={{ color: '#64748B', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#0D6861' } }}
            >
              {editMode ? 'Update Record' : 'Save Record'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#475569', mb: 1 }}>
            Are you sure you want to delete <strong>{rowToDelete?.name || rowToDelete?.title || rowToDelete?.code || 'this record'}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button
            onClick={() => {
              setDeleteModalOpen(false);
              setRowToDelete(null);
            }}
            sx={{ color: '#64748B', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{ bgcolor: '#E11D48', fontWeight: 700, textTransform: 'none', borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#BE123C' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
