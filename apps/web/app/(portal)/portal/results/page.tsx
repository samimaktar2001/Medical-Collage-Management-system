'use client';

import GenericModulePage from '../../GenericModulePage';
import BarChartIcon from '@mui/icons-material/BarChart';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export default function ResultsPage() {
  return (
    <GenericModulePage
      category="Academic"
      title="Examination Results &amp; Marks"
      description="Publish official grade sheets, GPA transcripts, revaluation requests and pass percentages."
      addModalTitle="Result Sheet"
      addFields={[
        { id: 'exam', label: 'Exam Name' },
        { id: 'batch', label: 'Batch / Year' },
        { id: 'passRate', label: 'Pass Percentage (%)' },
      ]}
      kpis={[
        { title: 'Average Pass Rate', value: '88.6%', trend: 4, icon: <BarChartIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Distinction / Honors', value: '312', trend: 12, icon: <WorkspacePremiumIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Published Sheets', value: '42', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Revaluations Filed', value: '18', trend: -6, icon: <AutoFixHighIcon sx={{ fontSize: 20 }} />, color: { bg: '#FFFBEB', icon: '#D97706' } },
      ]}
      columns={[
        { id: 'exam', label: 'Examination' },
        { id: 'batch', label: 'Batch' },
        { id: 'appeared', label: 'Appeared' },
        { id: 'passed', label: 'Passed' },
        { id: 'passPct', label: 'Pass %' },
        { id: 'publishedOn', label: 'Published Date' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', exam: 'MBBS 1st Professional Final', batch: '2023-24', appeared: '248', passed: '232', passPct: '93.5%', publishedOn: '20 Aug 2025', status: 'Completed' },
        { id: '2', exam: 'MD General Medicine Part I', batch: '2022-23', appeared: '24', passed: '23', passPct: '95.8%', publishedOn: '12 Jul 2025', status: 'Completed' },
        { id: '3', exam: 'BDS 2nd Year Annual Exam', batch: '2023-24', appeared: '98', passed: '89', passPct: '90.8%', publishedOn: '02 Sep 2025', status: 'Completed' },
      ]}
    />
  );
}
