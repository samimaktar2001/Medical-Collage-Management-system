'use client';

import GenericModulePage from '../../GenericModulePage';
import BadgeIcon from '@mui/icons-material/Badge';
import PeopleIcon from '@mui/icons-material/People';
import PaymentsIcon from '@mui/icons-material/Payments';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export default function HrPage() {
  return (
    <GenericModulePage
      category="Administration"
      title="Human Resources &amp; Staff Payroll"
      description="Doctor appointments, nursing rosters, paramedical staff, monthly payroll processing and leave management."
      addModalTitle="Staff Employee"
      addFields={[
        { id: 'name', label: 'Employee Name' },
        { id: 'role', label: 'Role / Designation' },
        { id: 'department', label: 'Department' },
        { id: 'salary', label: 'Monthly Salary (₹)' },
      ]}
      kpis={[
        { title: 'Total Hospital & College Staff', value: '624', trend: 4, icon: <PeopleIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Doctors & Faculty', value: '368', icon: <BadgeIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Nursing & Paramedical', value: '186', icon: <EventAvailableIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Monthly Payroll Disbursed', value: '₹ 1.42 Cr', trend: 3, icon: <PaymentsIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'empId', label: 'Staff ID' },
        { id: 'name', label: 'Employee Name' },
        { id: 'designation', label: 'Designation' },
        { id: 'department', label: 'Department' },
        { id: 'shift', label: 'Current Roster Shift' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', empId: 'EMP-101', name: 'Dr. Ahmed Rahman', designation: 'Professor & Senior Consultant', department: 'General Medicine', shift: 'Morning (08:00 - 16:00)', status: 'Active' },
        { id: '2', empId: 'EMP-102', name: 'Sister Mary Joseph', designation: 'Nursing Superintendent', department: 'ICU Ward', shift: 'Rotational', status: 'Active' },
        { id: '3', empId: 'EMP-103', name: 'Kabir Shah', designation: 'Senior Accountant', department: 'Finance', shift: 'General (09:00 - 17:00)', status: 'Active' },
      ]}
    />
  );
}
