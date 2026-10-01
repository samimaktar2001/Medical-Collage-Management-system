'use client';

import GenericModulePage from '../../GenericModulePage';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HotelIcon from '@mui/icons-material/Hotel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

export default function HostelPage() {
  return (
    <GenericModulePage
      category="Administration"
      title="Hostel &amp; Residential Campus"
      description="Manage student and resident doctor hostel blocks, room allotments, mess subscriptions and warden discipline."
      addModalTitle="Hostel Allocation"
      addFields={[
        { id: 'studentName', label: 'Student Name' },
        { id: 'rollNo', label: 'Roll Number' },
        { id: 'block', label: 'Hostel Block (Boys Block A/B / Girls Block A/B)' },
        { id: 'room', label: 'Room Number' },
      ]}
      kpis={[
        { title: 'Total Hostellers', value: '1,840', trend: 6, icon: <ApartmentIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Total Rooms Occupied', value: '920 / 1000', icon: <HotelIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Available Vacancies', value: '80 Beds', icon: <MeetingRoomIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Mess Active Subscriptions', value: '1,812', trend: 4, icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'block', label: 'Hostel Block' },
        { id: 'room', label: 'Room #' },
        { id: 'studentName', label: 'Resident Student' },
        { id: 'courseBatch', label: 'Course & Batch' },
        { id: 'type', label: 'Room Category' },
        { id: 'mess', label: 'Mess Plan' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', block: 'Charaka Boys (Block B)', room: 'Room 304', studentName: 'Rahim Ahmed', courseBatch: 'MBBS (2024-25)', type: 'AC Double', mess: 'Non-Veg', status: 'Active' },
        { id: '2', block: 'Sushruta Boys (Block A)', room: 'Room 210', studentName: 'Tanvir Hasan', courseBatch: 'MBBS (2023-24)', type: 'Non-AC Double', mess: 'Standard', status: 'Active' },
        { id: '3', block: 'Gargi Girls (Block A)', room: 'Room 105', studentName: 'Sadia Islam', courseBatch: 'MBBS (2024-25)', type: 'AC Single', mess: 'Veg Plan', status: 'Active' },
      ]}
    />
  );
}
