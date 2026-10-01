'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { MedoraDataGridPagination } from '../../../Pagination';
import { StatusBadge } from '../../../StatusBadge';
import { PageHeader } from '../../../PageHeader';

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import { kpiColors } from '../../../theme';

type SessionType = 'Lecture' | 'Clinical Bedside' | 'Practical / Lab' | 'Tutorial';

interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  subject: string;
  topic: string;
  batch: string;
  type: SessionType;
  venue: string;
  faculty: string;
}

const initialSchedule: TimetableSlot[] = [
  // Monday
  { id: '1', day: 'Monday', timeSlot: '08:00 - 09:00 AM', subject: 'Human Anatomy', topic: 'Brachial Plexus & Axilla', batch: 'MBBS 1st Prof', type: 'Lecture', venue: 'LT-1 Auditorium', faculty: 'Dr. Meera Kapoor' },
  { id: '2', day: 'Monday', timeSlot: '09:00 - 10:00 AM', subject: 'Physiology', topic: 'Cardiac Cycle & Pressure Changes', batch: 'MBBS 1st Prof', type: 'Lecture', venue: 'LT-1 Auditorium', faculty: 'Dr. Rajesh Sen' },
  { id: '3', day: 'Monday', timeSlot: '10:00 - 01:00 PM', subject: 'Anatomy Dissection', topic: 'Cadaveric Dissection Upper Limb', batch: 'MBBS 1st Prof', type: 'Practical / Lab', venue: 'Dissection Hall A', faculty: 'Dr. Meera Kapoor & Team' },
  { id: '4', day: 'Monday', timeSlot: '02:00 - 04:00 PM', subject: 'Biochemistry', topic: 'Enzyme Kinetics & Practical Assay', batch: 'MBBS 1st Prof', type: 'Practical / Lab', venue: 'Biochem Lab 2', faculty: 'Dr. Neha Paul' },

  // Tuesday
  { id: '5', day: 'Tuesday', timeSlot: '08:00 - 09:00 AM', subject: 'Community Medicine', topic: 'Epidemiological Principles', batch: 'MBBS 1st Prof', type: 'Lecture', venue: 'LT-1 Auditorium', faculty: 'Dr. S. Bannerjee' },
  { id: '6', day: 'Tuesday', timeSlot: '09:00 - 12:00 PM', subject: 'General Medicine', topic: 'Cardiovascular Bedside Examination', batch: 'MBBS 1st Prof', type: 'Clinical Bedside', venue: 'Male Medical Ward', faculty: 'Dr. Ahmed Rahman' },
  { id: '7', day: 'Tuesday', timeSlot: '02:00 - 04:00 PM', subject: 'Histology', topic: 'Microscopic Examination of Cartilage', batch: 'MBBS 1st Prof', type: 'Practical / Lab', venue: 'Histology Lab B', faculty: 'Dr. Arjun Roy' },

  // Wednesday
  { id: '8', day: 'Wednesday', timeSlot: '08:00 - 09:00 AM', subject: 'Physiology', topic: 'Action Potential & Synaptic Conduction', batch: 'MBBS 1st Prof', type: 'Lecture', venue: 'LT-1 Auditorium', faculty: 'Dr. Rajesh Sen' },
  { id: '9', day: 'Wednesday', timeSlot: '09:00 - 10:00 AM', subject: 'Human Anatomy', topic: 'Osteology of Shoulder Girdle', batch: 'MBBS 1st Prof', type: 'Lecture', venue: 'LT-1 Auditorium', faculty: 'Dr. Meera Kapoor' },
  { id: '10', day: 'Wednesday', timeSlot: '10:00 - 01:00 PM', subject: 'Anatomy Dissection', topic: 'Pectoral Region & Breast', batch: 'MBBS 1st Prof', type: 'Practical / Lab', venue: 'Dissection Hall A', faculty: 'Dr. Meera Kapoor' },
  { id: '11', day: 'Wednesday', timeSlot: '02:00 - 04:00 PM', subject: 'Biochemistry', topic: 'Clinical Correlation: Jaundice Seminar', batch: 'MBBS 1st Prof', type: 'Tutorial', venue: 'Seminar Hall 3', faculty: 'Dr. Neha Paul' },

  // Thursday
  { id: '12', day: 'Thursday', timeSlot: '08:00 - 09:00 AM', subject: 'Biochemistry', topic: 'Lipid Metabolism & Ketogenesis', batch: 'MBBS 1st Prof', type: 'Lecture', venue: 'LT-1 Auditorium', faculty: 'Dr. Neha Paul' },
  { id: '13', day: 'Thursday', timeSlot: '09:00 - 12:00 PM', subject: 'General Surgery', topic: 'Basic Surgical Skills & Asepsis', batch: 'MBBS 1st Prof', type: 'Clinical Bedside', venue: 'Surgical Skills Lab', faculty: 'Dr. K. S. Mukherjee' },
  { id: '14', day: 'Thursday', timeSlot: '02:00 - 04:00 PM', subject: 'Physiology Practical', topic: 'Haemoglobin Estimation & RBC Count', batch: 'MBBS 1st Prof', type: 'Practical / Lab', venue: 'Physiology Lab A', faculty: 'Dr. Rajesh Sen' },

  // Friday
  { id: '15', day: 'Friday', timeSlot: '08:00 - 09:00 AM', subject: 'Human Anatomy', topic: 'Embryology: Development of Heart', batch: 'MBBS 1st Prof', type: 'Lecture', venue: 'LT-1 Auditorium', faculty: 'Dr. Arjun Roy' },
  { id: '16', day: 'Friday', timeSlot: '09:00 - 12:00 PM', subject: 'Pediatrics Posting', topic: 'Normal Milestones & Neonatal Reflexes', batch: 'MBBS 1st Prof', type: 'Clinical Bedside', venue: 'Pediatric Ward 2', faculty: 'Dr. Shireen Banu' },
  { id: '17', day: 'Friday', timeSlot: '02:00 - 04:00 PM', subject: 'Sports & Extracurricular', topic: 'Campus Physical Training / Library', batch: 'MBBS 1st Prof', type: 'Tutorial', venue: 'Sports Ground / Library', faculty: 'Academic Coordinator' },

  // Saturday
  { id: '18', day: 'Saturday', timeSlot: '08:00 - 10:00 AM', subject: 'Clinical Grand Round', topic: 'Multi-disciplinary CPC Case Presentation', batch: 'MBBS 1st Prof', type: 'Clinical Bedside', venue: 'Main Auditorium', faculty: 'Principal & Faculty' },
  { id: '19', day: 'Saturday', timeSlot: '10:30 - 01:00 PM', subject: 'Integrated Formative Assessment', topic: 'Weekly Competency Quiz & Viva', batch: 'MBBS 1st Prof', type: 'Tutorial', venue: 'Examination Hall', faculty: 'Academic Committee' },
];

const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function AcademicTimetablePage() {
  const [schedule, setSchedule] = useState<TimetableSlot[]>(initialSchedule);
  const [selectedBatch, setSelectedBatch] = useState('MBBS 1st Prof');
  const [activeTab, setActiveTab] = useState(0);

  // Add session modal
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday' as const,
    timeSlot: '08:00 - 09:00 AM',
    subject: '',
    topic: '',
    type: 'Lecture' as SessionType,
    venue: 'LT-1 Auditorium',
    faculty: '',
  });

  const filteredSchedule = schedule.filter((s) => s.batch === selectedBatch);

  const getTypeStyle = (type: SessionType) => {
    switch (type) {
      case 'Lecture':
        return { bg: '#EFF6FF', border: '#93C5FD', color: '#1D4ED8', badgeBg: '#DBEAFE', badgeColor: '#1E40AF' };
      case 'Clinical Bedside':
        return { bg: '#ECFDF5', border: '#86EFAC', color: '#047857', badgeBg: '#D1FAE5', badgeColor: '#065F46' };
      case 'Practical / Lab':
        return { bg: '#FAF5FF', border: '#D8B4FE', color: '#7E22CE', badgeBg: '#F3E8FF', badgeColor: '#6B21A8' };
      case 'Tutorial':
        return { bg: '#FFFBEB', border: '#FDE68A', color: '#B45309', badgeBg: '#FEF3C7', badgeColor: '#92400E' };
      default:
        return { bg: '#F8FAFC', border: '#E2E8F0', color: '#334155', badgeBg: '#F1F5F9', badgeColor: '#475569' };
    }
  };

  const handleCreateSlot = () => {
    if (!newSlot.subject) return;
    const item: TimetableSlot = {
      id: `slot-${Date.now()}`,
      day: newSlot.day,
      timeSlot: newSlot.timeSlot,
      subject: newSlot.subject,
      topic: newSlot.topic,
      batch: selectedBatch,
      type: newSlot.type,
      venue: newSlot.venue,
      faculty: newSlot.faculty || 'Senior Faculty',
    };
    setSchedule([...schedule, item]);
    setOpenAddModal(false);
    setNewSlot({
      day: 'Monday',
      timeSlot: '08:00 - 09:00 AM',
      subject: '',
      topic: '',
      type: 'Lecture',
      venue: 'LT-1 Auditorium',
      faculty: '',
    });
  };

  // DataGrid Columns for list view
  const columns: GridColDef[] = [
    { field: 'day', headerName: 'Day', width: 120, fontWeight: 700 } as any,
    { field: 'timeSlot', headerName: 'Time Slot', width: 150 },
    {
      field: 'subject',
      headerName: 'Subject & Topic',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
            {params.value}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
            {params.row.topic}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Session Type',
      width: 160,
      renderCell: (params: GridRenderCellParams) => {
        return <StatusBadge status={params.value as string} />;
      },
    },
    { field: 'venue', headerName: 'Lecture Hall / Lab', flex: 1, minWidth: 150 },
    { field: 'faculty', headerName: 'Faculty In-Charge', flex: 1, minWidth: 160 },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* ─── Breadcrumbs & Header ─── */}
      <PageHeader
        breadcrumbs={[
          { label: 'Academic', href: '/portal/dashboard' },
          { label: 'Timetable & Curriculum Schedule' },
        ]}
        category="Curriculum & Scheduling"
        title="Academic & Clinical Timetable"
        description="National Medical Commission (NMC) aligned curriculum scheduler, clinical postings, and lecture timetables."
        icon={<CalendarMonthIcon />}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                color: '#334155',
                bgcolor: '#FFFFFF',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              Print Routine
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddModal(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                bgcolor: '#0F766E',
                boxShadow: '0 2px 6px rgba(15,118,110,0.2)',
                '&:hover': { bgcolor: '#0D6861' },
              }}
            >
              + Add Class / Rotation
            </Button>
          </Stack>
        }
      />

      {/* ─── Top KPIs ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Weekly Curriculum Hours', value: '38 Hours', label: 'Aligned with NMC CBME', icon: <CalendarMonthIcon />, color: kpiColors.teal },
          { title: 'Clinical Bedside Postings', value: '14 Hours', label: 'Ward rotations active', icon: <AccessTimeIcon />, color: kpiColors.emerald },
          { title: 'Dissection & Lab Practicals', value: '12 Hours', label: 'Hands-on practicals', icon: <MeetingRoomIcon />, color: kpiColors.blue },
          { title: 'Faculty Assigned', value: '28 Instructors', label: 'Active this week', icon: <SchoolIcon />, color: kpiColors.amber },
        ].map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, bgcolor: '#FFFFFF', height: '100%' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: kpi.color.bg, color: kpi.color.icon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(kpi.icon, { sx: { fontSize: 20 } })}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{kpi.title}</Typography>
                  <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#0F172A', lineHeight: 1.1 }}>
                    {kpi.value}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{kpi.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ─── Filter & View Switcher Bar ─── */}
      <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, mb: 2, bgcolor: '#FFFFFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' } }}>
          {/* Batch Selector */}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Academic Year / Batch:
            </Typography>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              size="small"
              sx={{ height: 40, minWidth: 200, fontSize: '0.8125rem', borderRadius: '8px', bgcolor: '#FFFFFF' }}
            >
              <MenuItem value="MBBS 1st Prof">MBBS 1st Professional (Batch 2025-26)</MenuItem>
              <MenuItem value="MBBS 2nd Prof">MBBS 2nd Professional (Batch 2024-25)</MenuItem>
              <MenuItem value="MBBS 3rd Prof Part I">MBBS 3rd Prof Part I (Batch 2023-24)</MenuItem>
              <MenuItem value="Final MBBS Part II">Final MBBS Part II (Batch 2022-23)</MenuItem>
            </Select>
          </Stack>

          {/* Type Legend Chips */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
            {[
              { label: 'Lecture', type: 'Lecture' as SessionType },
              { label: 'Clinical Bedside', type: 'Clinical Bedside' as SessionType },
              { label: 'Practical / Lab', type: 'Practical / Lab' as SessionType },
              { label: 'Tutorial / Seminar', type: 'Tutorial' as SessionType },
            ].map((leg) => {
              return (
                <StatusBadge
                  key={leg.label}
                  status={leg.label}
                />
              );
            })}
          </Stack>

          {/* View Mode Switcher */}
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              minHeight: 40,
              bgcolor: '#F1F5F9',
              borderRadius: '8px',
              p: 0.5,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                minHeight: 32,
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'none',
                color: '#64748B',
                py: 0.5,
                px: 2,
                '&.Mui-selected': { bgcolor: '#FFFFFF', color: '#0F766E', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
              },
            }}
          >
            <Tab icon={<GridViewIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Weekly Schedule Grid" />
            <Tab icon={<TableRowsIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="List View (DataGrid)" />
          </Tabs>
        </Stack>
      </Card>

      {/* ─── TAB 0: Weekly Visual Schedule Grid ─── */}
      {activeTab === 0 && (
        <Stack spacing={2.5}>
          {days.map((day) => {
            const daySlots = filteredSchedule.filter((s) => s.day === day);
            return (
              <Card key={day} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px', p: 2.5, bgcolor: '#FFFFFF' }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F172A', mb: 1.5, pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  {day}
                </Typography>

                {daySlots.length === 0 ? (
                  <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', py: 1 }}>
                    No sessions scheduled for this day.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {daySlots.map((slot) => {
                      const style = getTypeStyle(slot.type);
                      return (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={slot.id}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: '10px',
                              bgcolor: style.bg,
                              border: `1px solid ${style.border}`,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box>
                              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: style.color }}>
                                  {slot.timeSlot}
                                </Typography>
                                <StatusBadge status={slot.type} size="small" />
                              </Stack>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A', mb: 0.5, lineHeight: 1.3 }}>
                                {slot.subject}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#475569', mb: 1 }}>
                                {slot.topic}
                              </Typography>
                            </Box>

                            <Box sx={{ pt: 1, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                              <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                                <strong>Venue:</strong> {slot.venue}
                              </Typography>
                              <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
                                <strong>Faculty:</strong> {slot.faculty}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Card>
            );
          })}
        </Stack>
      )}

      {/* ─── TAB 1: DataGrid List View ─── */}
      {activeTab === 1 && (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', bgcolor: '#FFFFFF', height: 600 }}>
          <DataGrid
            rows={filteredSchedule}
            columns={columns}
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
            }}
          />
        </Card>
      )}

      {/* ─── ADD SESSION DIALOG ─── */}
      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '14px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
          Schedule New Class / Clinical Rotation
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Select
              size="small"
              fullWidth
              value={newSlot.day}
              onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value as any })}
            >
              {days.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </Select>

            <TextField
              label="Time Slot (e.g. 09:00 - 10:00 AM)"
              size="small"
              fullWidth
              value={newSlot.timeSlot}
              onChange={(e) => setNewSlot({ ...newSlot, timeSlot: e.target.value })}
            />

            <TextField
              label="Subject (e.g. Pharmacology, Pathology)"
              size="small"
              fullWidth
              value={newSlot.subject}
              onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
            />

            <TextField
              label="Topic / Clinical Skill"
              size="small"
              fullWidth
              value={newSlot.topic}
              onChange={(e) => setNewSlot({ ...newSlot, topic: e.target.value })}
            />

            <Select
              size="small"
              fullWidth
              value={newSlot.type}
              onChange={(e) => setNewSlot({ ...newSlot, type: e.target.value as any })}
            >
              <MenuItem value="Lecture">Lecture</MenuItem>
              <MenuItem value="Clinical Bedside">Clinical Bedside Posting</MenuItem>
              <MenuItem value="Practical / Lab">Practical / Lab Session</MenuItem>
              <MenuItem value="Tutorial">Tutorial / Seminar</MenuItem>
            </Select>

            <TextField
              label="Venue / Hall / Ward"
              size="small"
              fullWidth
              value={newSlot.venue}
              onChange={(e) => setNewSlot({ ...newSlot, venue: e.target.value })}
            />

            <TextField
              label="Faculty In-Charge"
              size="small"
              fullWidth
              value={newSlot.faculty}
              onChange={(e) => setNewSlot({ ...newSlot, faculty: e.target.value })}
              placeholder="e.g. Dr. Meera Kapoor"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setOpenAddModal(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateSlot}
            sx={{ bgcolor: '#0F766E', fontWeight: 700, textTransform: 'none', borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#0D6861' } }}
          >
            Add to Routine
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
