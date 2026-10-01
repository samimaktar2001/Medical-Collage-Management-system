'use client';

import GenericModulePage from '../../GenericModulePage';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BiotechIcon from '@mui/icons-material/Biotech';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

export default function FacultyPage() {
  return (
    <GenericModulePage
      category="Academic"
      title="Faculty Management"
      description="Manage professors, associate doctors, lecturers and teaching assignments."
      addModalTitle="Faculty Member"
      addFields={[
        { id: 'name', label: 'Faculty Name', placeholder: 'Dr. John Doe' },
        { id: 'designation', label: 'Designation', placeholder: 'Professor / HOD' },
        { id: 'department', label: 'Department', placeholder: 'General Medicine' },
        { id: 'email', label: 'Email', placeholder: 'faculty@medora.edu' },
        { id: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
      ]}
      kpis={[
        { title: 'Total Faculty', value: '368', trend: 5, icon: <SchoolIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Active On Duty', value: '342', trend: 3, icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'PhD / Super Specialists', value: '148', trend: 8, icon: <WorkspacePremiumIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Research Publications', value: '520', trend: 14, icon: <BiotechIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'id', label: 'Faculty ID' },
        { id: 'name', label: 'Faculty Name' },
        { id: 'designation', label: 'Designation' },
        { id: 'department', label: 'Department' },
        { id: 'email', label: 'Email' },
        { id: 'phone', label: 'Phone' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: 'FAC-001', name: 'Dr. Ahmed Rahman', designation: 'Professor & HOD', department: 'General Medicine', email: 'ahmed.rahman@mc.edu', phone: '+880 1712 000111', status: 'Active' },
        { id: 'FAC-002', name: 'Dr. Meera Kapoor', designation: 'Associate Professor', department: 'Anatomy', email: 'meera.kapoor@mc.edu', phone: '+880 1712 000222', status: 'Active' },
        { id: 'FAC-003', name: 'Dr. Arjun Roy', designation: 'Assistant Professor', department: 'Physiology', email: 'arjun.roy@mc.edu', phone: '+880 1712 000333', status: 'Active' },
        { id: 'FAC-004', name: 'Dr. Neha Paul', designation: 'Professor', department: 'Biochemistry', email: 'neha.paul@mc.edu', phone: '+880 1712 000444', status: 'Active' },
        { id: 'FAC-005', name: 'Dr. Devika Rao', designation: 'Dean & Professor', department: 'Academic Affairs', email: 'devika.rao@mc.edu', phone: '+880 1712 000555', status: 'Active' },
      ]}
    />
  );
}
