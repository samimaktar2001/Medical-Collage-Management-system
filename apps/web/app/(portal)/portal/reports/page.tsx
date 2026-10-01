'use client';

import GenericModulePage from '../../GenericModulePage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ReportsPage() {
  return (
    <GenericModulePage
      category="Reports"
      title="Analytics &amp; Institutional Reports"
      description="Download NMC annual compliance audit reports, NAAC accreditation criteria, financial audits and student performance metrics."
      addModalTitle="Custom Report Request"
      addFields={[
        { id: 'name', label: 'Report Name' },
        { id: 'type', label: 'Module Category' },
        { id: 'frequency', label: 'Frequency (Daily / Monthly / Annual)' },
      ]}
      kpis={[
        { title: 'Generated Reports', value: '148', icon: <AssessmentIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Regulatory Compliance', value: '100% (NMC/NAAC)', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Automated Audit Exports', value: '34', icon: <CloudDownloadIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Data Analytics Modules', value: '12 Active', icon: <InsightsIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'reportId', label: 'Report Code' },
        { id: 'name', label: 'Report Title' },
        { id: 'type', label: 'Domain' },
        { id: 'period', label: 'Audit Period' },
        { id: 'format', label: 'File Format' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', reportId: 'REP-NMC-2025', name: 'NMC Annual Faculty & Bed Occupancy Mandatory Disclosure', type: 'Regulatory Compliance', period: 'Year 2024-25', format: 'PDF + Excel', status: 'Completed' },
        { id: '2', reportId: 'REP-ACAD-SEM2', name: 'MBBS End-Semester Academic & Attendance Analysis', type: 'Academic Affairs', period: 'Semester 2', format: 'PDF', status: 'Completed' },
        { id: '3', reportId: 'REP-FIN-Q2', name: 'Hospital Revenue & Patient Subsidy Financial Audit', type: 'Finance & Accounts', period: 'Q2 2025', format: 'Excel (XLSX)', status: 'Completed' },
      ]}
    />
  );
}
