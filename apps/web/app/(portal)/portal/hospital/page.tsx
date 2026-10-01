'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

// Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import BedIcon from '@mui/icons-material/Hotel';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ScienceIcon from '@mui/icons-material/Science';

import GenericModulePage, { ModuleKPICard, ModuleColumn } from '../../GenericModulePage';
import { kpiColors } from '../../../theme';

const kpis: ModuleKPICard[] = [
  {
    title: 'Active OPD Patients',
    value: '428',
    trend: 12,
    trendLabel: 'vs last hour',
    icon: <MedicalServicesIcon />,
    color: kpiColors.amber,
  },
  {
    title: 'Occupied Beds (IPD)',
    value: '84%',
    trend: -2,
    trendLabel: 'vs yesterday',
    icon: <BedIcon />,
    color: kpiColors.teal,
  },
  {
    title: 'Emergency Admissions',
    value: '24',
    trend: 5,
    trendLabel: 'since midnight',
    icon: <LocalHospitalIcon />,
    color: kpiColors.rose,
  },
  {
    title: 'Pending Lab Reports',
    value: '112',
    trend: -15,
    trendLabel: 'cleared today',
    icon: <ScienceIcon />,
    color: kpiColors.blue,
  }
];

const columns: ModuleColumn[] = [
  { id: 'id', label: 'Registration ID' },
  { id: 'name', label: 'Patient Name' },
  { id: 'age', label: 'Age / Gender' },
  { id: 'department', label: 'Department' },
  { id: 'doctor', label: 'Attending Doctor' },
  { id: 'status', label: 'Status' },
];

const initialData = [
  { id: 'PAT-2401', name: 'Abdul Rahman', age: '45 / M', department: 'Cardiology', doctor: 'Dr. S. K. Sen', status: 'Admitted' },
  { id: 'PAT-2402', name: 'Fatima Begum', age: '62 / F', department: 'Orthopedics', doctor: 'Dr. R. Ahmed', status: 'Discharged' },
  { id: 'PAT-2403', name: 'Rohan Sharma', age: '12 / M', department: 'Pediatrics', doctor: 'Dr. M. Ali', status: 'OPD' },
  { id: 'PAT-2404', name: 'Ayesha Khan', age: '28 / F', department: 'Gynecology', doctor: 'Dr. P. Das', status: 'OPD' },
  { id: 'PAT-2405', name: 'Mohammad Ali', age: '55 / M', department: 'Neurology', doctor: 'Dr. K. Basu', status: 'Admitted' },
];

export default function HospitalManagementPage() {
  const router = useRouter();

  return (
    <GenericModulePage
      category="Clinical"
      title="Hospital Management System"
      description="Centralized command center for OPD, IPD, emergencies, and hospital operations."
      kpis={kpis}
      columns={columns}
      initialData={initialData}
      addModalTitle="Register Patient"
      onAddClick={() => router.push('/portal/patients/new')}
      onViewClick={(row) => router.push(`/portal/patients/${row.id}`)}
    />
  );
}
