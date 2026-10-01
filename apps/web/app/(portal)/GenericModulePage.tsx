import { useState, useEffect, useCallback } from 'react';
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
import Skeleton from '@mui/material/Skeleton';
import { MedoraDataGridPagination } from '../Pagination';
import { MedoraDatePicker } from '../MedoraDatePicker';
import { api, useAuth } from './PortalShell';


// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
  const [data, setData] = useState<any[]>(apiResource ? [] : initialData);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(!!apiResource);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch data from backend API if apiResource is set
  const fetchData = useCallback(async () => {
    if (!apiResource) {
      // Client side simulation
      const filtered = initialData.filter((item: any) => {
        if (statusFilter !== 'ALL' && item.status && item.status !== statusFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return Object.values(item).some(
            (val) => typeof val === 'string' && val.toLowerCase().includes(q)
          );
        }
        return true;
      });
      setTotal(filtered.length);
      setData(filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
      return;
    }
    
    setLoading(true);
    setFetchError(null);
    try {
      const qParams = new URLSearchParams();
      if (search) qParams.append('q', search);
      if (statusFilter !== 'ALL') qParams.append('status', statusFilter);
      qParams.append('page', (page + 1).toString());
      qParams.append('limit', rowsPerPage.toString());

      const res = await api(`${apiResource}?${qParams.toString()}`);
      if (res?.items) {
        setData(res.items);
        setTotal(res.total || res.items.length);
      } else if (Array.isArray(res)) {
        setData(res);
        setTotal(res.length);
      }
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load data.');
      setData(initialData);
    } finally {
      setLoading(false);
    }
  }, [apiResource, initialData, search, statusFilter, page, rowsPerPage]);

  useEffect(() => {
    if (apiResource) {
      fetchData();
    }
  }, [apiResource, fetchData]);

  const { control, handleSubmit, reset } = useForm<any>({
    defaultValues: {}
  });

  const filteredData = data;

  const onSubmit = async (formData: any) => {
    if (Object.keys(formData).length === 0) return;

    // Validate contextual date fields
    for (const field of addFields) {
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

    // If connected to API, POST the new record
    if (apiResource) {
      try {
        if (editMode && editingId) {
          const res = await api(`${apiResource}/${editingId}`, 'PATCH', formData, user?.csrf);
          if (res?.item) {
            setData(data.map(item => item.id === editingId ? res.item : item));
          } else {
            await fetchData();
          }
        } else {
          const res = await api(apiResource, 'POST', formData, user?.csrf);
          if (res?.item) {
            setData([res.item, ...data]);
          } else {
            await fetchData();
          }
        }
      } catch (err: any) {
        setAddError(err.message || 'Failed to save record.');
        return;
      }
    } else {
      if (editMode && editingId) {
        setData(data.map(item => item.id === editingId ? { ...item, ...formData } : item));
      } else {
        const item = {
          id: `new-${Date.now()}`,
          status: 'Active',
          ...formData,
        };
        setData([item, ...data]);
      }
    }
    reset({});
    setOpenAdd(false);
    setEditMode(false);
    setEditingId(null);
  };

  const handleDeleteClick = (row: any) => {
    if (onDeleteClick) {
      onDeleteClick(row);
      return;
    }
    
    setRowToDelete(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!rowToDelete) return;
    
    if (apiResource) {
      try {
        await api(`${apiResource}/${rowToDelete.id}`, 'DELETE', null, user?.csrf);
        fetchData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete record.');
      }
    } else {
      setData(data.filter(item => item.id !== rowToDelete.id));
    }
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const handleEditClick = (row: any) => {
    if (onEditClick) {
      onEditClick(row);
      return;
    }
    
    // If no custom edit page, use the default modal
    if (addFields.length > 0) {
      reset(row);
      setEditingId(row.id);
      setEditMode(true);
      setOpenAdd(true);
    }
  };

  const CONTROL_HEIGHT = 40;

  return (
    <Box>
      {/* ─── Breadcrumbs & Header ─── */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 0.5 }}>
          <Link underline="hover" color="inherit" href="/portal/dashboard">
            {category}
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            {title}
          </Typography>
        </Breadcrumbs>
        <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
          {description}
        </Typography>
      </Box>

      {/* ─── KPI Cards Grid ─── */}
      {kpis.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {kpis.map((kpi, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 12 / kpis.length }} key={idx}>
              <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF', height: '100%' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                  <Box sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    bgcolor: kpi.color.bg,
                    color: kpi.color.icon,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
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
                    <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>{kpi.trendLabel || 'from last month'}</Typography>
                  </Stack>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ─── Filters & Actions Bar (All 40px Height) ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, mb: 2, bgcolor: '#FFFFFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {/* Search Box */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              px: 1.5,
              height: CONTROL_HEIGHT,
              width: { xs: '100%', sm: 220 },
              boxSizing: 'border-box',
              transition: 'all 0.15s',
              '&:focus-within': { borderColor: '#0F766E', boxShadow: '0 0 0 2px rgba(15,118,110,0.15)' },
            }}>
              <SearchIcon sx={{ color: '#94A3B8', fontSize: 18, mr: 0.8, flexShrink: 0 }} />
              <InputBase
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                sx={{ fontSize: '0.8125rem', color: '#1E293B', width: '100%' }}
              />
            </Box>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              size="small"
              sx={{
                height: CONTROL_HEIGHT,
                minWidth: 120,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                bgcolor: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' },
              }}
            >
              <MenuItem value="ALL" sx={{ fontSize: '0.8125rem' }}>Status: All</MenuItem>
              <MenuItem value="Active" sx={{ fontSize: '0.8125rem' }}>Active</MenuItem>
              <MenuItem value="Completed" sx={{ fontSize: '0.8125rem' }}>Completed</MenuItem>
              <MenuItem value="Pending" sx={{ fontSize: '0.8125rem' }}>Pending</MenuItem>
            </Select>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {(addFields.length > 0 || onAddClick) && (
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
            )}

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={() => alert(`Exporting ${title} report...`)}
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
              Export
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* ─── Main Table ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', bgcolor: '#FFFFFF', height: 600 }}>
        <DataGrid
          paginationMode="server"
          rowCount={total}
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={(model) => { setPage(model.page); setRowsPerPage(model.pageSize); }}
          rows={filteredData.map((r, i) => ({ ...r, id: r.id || `row-${i}` }))}
          columns={[
            ...columns.map((col): GridColDef => ({
              field: col.id,
              headerName: col.label,
              flex: 1,
              minWidth: 150,
              headerAlign: col.align || 'left',
              align: col.align || 'left',
              renderCell: (params: GridRenderCellParams) => {
                if (col.render) return col.render(params.row);
                if (col.id === 'status') {
                  const val = params.value || 'Active';
                  return (
                    <Chip
                      label={val}
                      size="small"
                      sx={{
                        bgcolor: val === 'Active' || val === 'Completed' || val === 'Available' ? '#D1FAE5' : '#FEF3C7',
                        color: val === 'Active' || val === 'Completed' || val === 'Available' ? '#065F46' : '#B45309',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        height: 22,
                        borderRadius: '5px',
                      }}
                    />
                  );
                }
                return (
                  <Typography sx={{ fontSize: '0.8125rem', color: '#1E293B', fontWeight: (col.id === 'name' || col.id === 'title' || col.id === 'id') ? 700 : 400 }}>
                    {params.value ?? '—'}
                  </Typography>
                );
              },
            })),
            {
              field: 'actions',
              headerName: 'Actions',
              width: 120,
              sortable: false,
              align: 'center',
              headerAlign: 'center',
              renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => onViewClick && onViewClick(params.row)}
                      sx={{ color: '#64748B', '&:hover': { color: '#0F766E', bgcolor: '#F0FDFA' } }}
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditClick(params.row)} sx={{ color: '#64748B', '&:hover': { color: '#0F766E', bgcolor: '#F0FDFA' } }}>
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDeleteClick(params.row)} sx={{ color: '#E11D48', '&:hover': { bgcolor: '#FFF1F2' } }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#F8FAFC' },
          }}
        />
      </Card>

      {/* ─── Add Record Modal ─── */}
      {addFields.length > 0 && (
        <Dialog
          open={openAdd}
          onClose={() => {
            setOpenAdd(false);
            setAddError(null);
          }}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: '14px' } } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
            {editMode ? `Edit ${addModalTitle || 'Record'}` : (addModalTitle ? `Add New ${addModalTitle}` : 'Add New Record')}
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              {addError && (
                <Alert severity="error" sx={{ mb: 2, mt: 1, borderRadius: '8px' }}>
                  {addError}
                </Alert>
              )}
              <Stack spacing={2} sx={{ mt: addError ? 1 : 1.5 }}>
                {addFields.map((field) =>
                  field.type === 'date' ? (
                    <Controller
                      key={field.id}
                      name={field.id}
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => (
                        <MedoraDatePicker
                          size="small"
                          label={field.label}
                          disableFuture={isFieldPastDate(field)}
                          disablePast={isFieldFutureDate(field)}
                          value={value}
                          onChange={(val) => {
                            onChange(val);
                            if (addError) setAddError(null);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <Controller
                      key={field.id}
                      name={field.id}
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          fullWidth
                          size="small"
                          label={field.label}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          type={(field.type as any) || 'text'}
                          value={value}
                          onChange={(e) => {
                            onChange(e.target.value);
                            if (addError) setAddError(null);
                          }}
                        />
                      )}
                    />
                  )
                )}
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
                Save Record
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
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
            Are you sure you want to delete this record? This action cannot be undone.
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
