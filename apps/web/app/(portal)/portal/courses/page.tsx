'use client';

import GenericModulePage from '../../GenericModulePage';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupsIcon from '@mui/icons-material/Groups';

export default function CoursesPage() {
  return (
    <GenericModulePage
      category="Academic"
      title="Courses &amp; Programmes"
      description="Curriculum catalog, degree programs, semester syllabus, and credit requirements."
      addModalTitle="Course Program"
      addFields={[
        { id: 'code', label: 'Program Code', placeholder: 'e.g. MBBS-UG' },
        { id: 'name', label: 'Program Title', placeholder: 'e.g. Bachelor of Medicine' },
        { id: 'duration', label: 'Duration', placeholder: 'e.g. 5.5 Years' },
        { id: 'seats', label: 'Total Annual Seats', placeholder: 'e.g. 150' },
      ]}
      kpis={[
        { title: 'Total Programs', value: '18', trend: 2, icon: <MenuBookIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Undergraduate', value: '4', icon: <SchoolIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Postgraduate (MD/MS)', value: '12', icon: <WorkspacePremiumIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Approved Intake Seats', value: '450', trend: 10, icon: <GroupsIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'code', label: 'Code' },
        { id: 'name', label: 'Program Title' },
        { id: 'level', label: 'Degree Level' },
        { id: 'duration', label: 'Duration' },
        { id: 'seats', label: 'Seat Intake' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', code: 'MBBS-UG', name: 'Bachelor of Medicine and Bachelor of Surgery', level: 'Undergraduate', duration: '5.5 Years (inc. 1 yr Internship)', seats: '250', status: 'Active' },
        { id: '2', code: 'MD-MED', name: 'Doctor of Medicine (General Medicine)', level: 'Postgraduate', duration: '3 Years', seats: '24', status: 'Active' },
        { id: '3', code: 'MS-SURG', name: 'Master of Surgery (General Surgery)', level: 'Postgraduate', duration: '3 Years', seats: '20', status: 'Active' },
        { id: '4', code: 'BDS-UG', name: 'Bachelor of Dental Surgery', level: 'Undergraduate', duration: '5 Years', seats: '100', status: 'Active' },
        { id: '5', code: 'BSC-NURS', name: 'B.Sc Nursing', level: 'Undergraduate', duration: '4 Years', seats: '60', status: 'Active' },
      ]}
    />
  );
}
