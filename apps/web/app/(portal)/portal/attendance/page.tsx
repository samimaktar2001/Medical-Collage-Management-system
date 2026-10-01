'use client';

import GenericModulePage from '../../GenericModulePage';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export default function AttendancePage() {
  return (
    <GenericModulePage
      category="Academic"
      title="Student Attendance Tracker"
      description="Biometric and classroom attendance records, NMC mandatory 75% theory / 80% clinical thresholds."
      addModalTitle="Attendance Entry"
      addFields={[
        { id: 'session', label: 'Session / Class' },
        { id: 'date', label: 'Date', type: 'date' },
        { id: 'batch', label: 'Batch' },
        { id: 'presentCount', label: 'Present Students Count' },
      ]}
      kpis={[
        { title: 'College Overall Attendance', value: '92.4%', trend: 2, icon: <FactCheckIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Theory Sessions Tracked', value: '1,280', icon: <EventAvailableIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Eligible for Exams (>75%)', value: '2,690', trend: 4, icon: <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Shortage Warning (<75%)', value: '157', trend: -12, icon: <HighlightOffIcon sx={{ fontSize: 20 }} />, color: { bg: '#FEF2F2', icon: '#DC2626' } },
      ]}
      columns={[
        { id: 'batch', label: 'Batch / Course' },
        { id: 'subject', label: 'Subject' },
        { id: 'faculty', label: 'Faculty' },
        { id: 'totalClasses', label: 'Total Held' },
        { id: 'avgAttendance', label: 'Avg Attendance' },
        { id: 'shortageCount', label: 'Defaulters (<75%)' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', batch: 'MBBS 2024-25', subject: 'Human Anatomy', faculty: 'Dr. Meera Kapoor', totalClasses: '76', avgAttendance: '94.2%', shortageCount: '4', status: 'Active' },
        { id: '2', batch: 'MBBS 2024-25', subject: 'Medical Physiology', faculty: 'Dr. Arjun Roy', totalClasses: '70', avgAttendance: '92.8%', shortageCount: '6', status: 'Active' },
        { id: '3', batch: 'MBBS 2023-24', subject: 'General Surgery Postings', faculty: 'Dr. K. S. Mukherjee', totalClasses: '50', avgAttendance: '95.6%', shortageCount: '2', status: 'Active' },
      ]}
    />
  );
}
