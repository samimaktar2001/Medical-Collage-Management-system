'use client';

import GenericModulePage from '../../GenericModulePage';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export default function ExaminationPage() {
  return (
    <GenericModulePage
      category="Academic"
      title="Examinations &amp; Assessments"
      description="Manage semester finals, university professional exams, internal tests and hall tickets."
      addModalTitle="Exam Schedule"
      addFields={[
        { id: 'name', label: 'Examination Name' },
        { id: 'programme', label: 'Programme' },
        { id: 'session', label: 'Academic Session' },
        { id: 'startDate', label: 'Start Date', type: 'date' },
      ]}
      kpis={[
        { title: 'Upcoming Exams', value: '8', trend: 2, icon: <AssignmentTurnedInIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Registered Students', value: '1,420', trend: 5, icon: <HowToRegIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Theory Centers', value: '6', icon: <DateRangeIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Practical Vivas', value: '24', icon: <EditNoteIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'code', label: 'Exam Code' },
        { id: 'name', label: 'Examination Title' },
        { id: 'programme', label: 'Programme' },
        { id: 'date', label: 'Exam Date' },
        { id: 'type', label: 'Exam Format' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', code: 'EX-2025-01', name: '1st Professional MBBS Final Exam', programme: 'MBBS (Year 1)', date: '15 Nov 2025', type: 'Theory + Practical', status: 'Active' },
        { id: '2', code: 'EX-2025-02', name: 'Internal Assessment Term 2', programme: 'MBBS (Year 2)', date: '28 Oct 2025', type: 'Theory', status: 'Active' },
        { id: '3', code: 'EX-2025-03', name: 'MD Clinical Case Viva', programme: 'MD General Medicine', date: '05 Dec 2025', type: 'Bedside Viva', status: 'Active' },
      ]}
    />
  );
}
