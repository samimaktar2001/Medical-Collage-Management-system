'use client';

import GenericModulePage from '../../GenericModulePage';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';

export default function DepartmentsPage() {
  return (
    <GenericModulePage
      category="Academic"
      title="Departments Directory"
      description="Manage clinical and preclinical departments, heads of department, and bed allocations."
      addModalTitle="Department"
      addFields={[
        { id: 'name', label: 'Department Name', placeholder: 'e.g. Cardiology' },
        { id: 'code', label: 'Department Code', placeholder: 'e.g. CARD' },
        { id: 'hod', label: 'Head of Department', placeholder: 'Dr. Full Name' },
        { id: 'type', label: 'Type', placeholder: 'Clinical / Pre-Clinical / Para-Clinical' },
      ]}
      kpis={[
        { title: 'Total Departments', value: '25', trend: 0, icon: <BusinessIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Clinical Units', value: '16', trend: 4, icon: <LocalHospitalIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Pre-Clinical Units', value: '9', trend: 0, icon: <SchoolIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Total Staff Assigned', value: '482', trend: 6, icon: <PeopleIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'code', label: 'Dept Code' },
        { id: 'name', label: 'Department Name' },
        { id: 'type', label: 'Type' },
        { id: 'hod', label: 'Head of Department' },
        { id: 'facultyCount', label: 'Faculty' },
        { id: 'studentsCount', label: 'Students' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', code: 'MED', name: 'General Medicine', type: 'Clinical', hod: 'Dr. Ahmed Rahman', facultyCount: '24', studentsCount: '482', status: 'Active' },
        { id: '2', code: 'SURG', name: 'General Surgery', type: 'Clinical', hod: 'Dr. K. S. Mukherjee', facultyCount: '20', studentsCount: '421', status: 'Active' },
        { id: '3', code: 'PED', name: 'Pediatrics & Neonatology', type: 'Clinical', hod: 'Dr. Shireen Banu', facultyCount: '16', studentsCount: '318', status: 'Active' },
        { id: '4', code: 'GYN', name: 'Obstetrics & Gynecology', type: 'Clinical', hod: 'Dr. Farhana Yasmin', facultyCount: '18', studentsCount: '287', status: 'Active' },
        { id: '5', code: 'ANAT', name: 'Human Anatomy', type: 'Pre-Clinical', hod: 'Dr. Meera Kapoor', facultyCount: '12', studentsCount: '250', status: 'Active' },
        { id: '6', code: 'PHYS', name: 'Medical Physiology', type: 'Pre-Clinical', hod: 'Dr. Arjun Roy', facultyCount: '10', studentsCount: '250', status: 'Active' },
      ]}
    />
  );
}
