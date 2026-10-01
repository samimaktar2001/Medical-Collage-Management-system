'use client';

import GenericModulePage from '../../GenericModulePage';
import BiotechIcon from '@mui/icons-material/Biotech';
import ScienceIcon from '@mui/icons-material/Science';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function ResearchPage() {
  return (
    <GenericModulePage
      category="Reports"
      title="Medical Research &amp; Clinical Trials"
      description="ICMR projects, clinical drug trials, ethical clearance committee (IEC) protocol approvals and journal papers."
      addModalTitle="Research Project"
      addFields={[
        { id: 'title', label: 'Project Title' },
        { id: 'principalInvestigator', label: 'Principal Investigator (PI)' },
        { id: 'grantAgency', label: 'Funding Agency (ICMR / DBT / WHO)' },
        { id: 'budget', label: 'Sanctioned Budget (₹)' },
      ]}
      kpis={[
        { title: 'Funded Research Projects', value: '38', trend: 8, icon: <BiotechIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Total Research Grants', value: '₹ 4.85 Cr', trend: 15, icon: <CurrencyRupeeIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Active Clinical Trials', value: '14', icon: <ScienceIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Indexed Papers (Pubmed)', value: '520', trend: 12, icon: <AutoAwesomeIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'projId', label: 'Project #' },
        { id: 'title', label: 'Research Project Title' },
        { id: 'pi', label: 'Principal Investigator' },
        { id: 'agency', label: 'Grant Agency' },
        { id: 'budget', label: 'Budget' },
        { id: 'iecStatus', label: 'IEC Ethical Clearance' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', projId: 'RES-2025-01', title: 'Phase-III Clinical Trial on Novel Anti-Diabetic Peptide', pi: 'Dr. Ahmed Rahman', agency: 'ICMR / Biotech Partner', budget: '₹ 85,00,000', iecStatus: 'Approved', status: 'Active' },
        { id: '2', projId: 'RES-2025-02', title: 'Genomic Profiling of Pediatric Leukemias in Eastern India', pi: 'Dr. Neha Paul', agency: 'DBT Gov of India', budget: '₹ 1,20,00,000', iecStatus: 'Approved', status: 'Active' },
        { id: '3', projId: 'RES-2025-03', title: 'Minimally Invasive Video-Assisted Thoracoscopic Outcomes', pi: 'Dr. K. S. Mukherjee', agency: 'Institutional Grant', budget: '₹ 25,00,000', iecStatus: 'Approved', status: 'Active' },
      ]}
    />
  );
}
