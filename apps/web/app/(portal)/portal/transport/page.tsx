'use client';

import GenericModulePage from '../../GenericModulePage';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RouteIcon from '@mui/icons-material/Route';

export default function TransportPage() {
  return (
    <GenericModulePage
      category="Administration"
      title="Fleet, Ambulance &amp; College Transport"
      description="Advanced Life Support (ALS) ambulances, student campus shuttles, mobile medical outreach vans and fuel logs."
      addModalTitle="Fleet Vehicle"
      addFields={[
        { id: 'vehicleNo', label: 'Registration / Plate #' },
        { id: 'type', label: 'Vehicle Type (ALS Ambulance / College Bus / Outreach Van)' },
        { id: 'driverName', label: 'Assigned Driver' },
        { id: 'route', label: 'Route / Coverage' },
      ]}
      kpis={[
        { title: 'Total Vehicles in Fleet', value: '28', icon: <DirectionsBusIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Emergency Ambulances (ALS/BLS)', value: '8', icon: <AirportShuttleIcon sx={{ fontSize: 20 }} />, color: { bg: '#FEF2F2', icon: '#DC2626' } },
        { title: 'Active Campus Routes', value: '12', icon: <RouteIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Vehicles On Active Duty', value: '24', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
      ]}
      columns={[
        { id: 'vehicleNo', label: 'Vehicle #' },
        { id: 'type', label: 'Type' },
        { id: 'driverName', label: 'Driver' },
        { id: 'route', label: 'Route / Standby Station' },
        { id: 'fuelStatus', label: 'Fuel Level' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', vehicleNo: 'DL-01-AMB-801', type: 'ALS Critical Care Ambulance', driverName: 'Sanjay Kumar', route: 'Emergency Casualty Bay 1', fuelStatus: 'Full Tank (95%)', status: 'Active' },
        { id: '2', vehicleNo: 'DL-01-BUS-204', type: '52-Seater Student Bus', driverName: 'Ramesh Singh', route: 'Hostel Block to Campus Main Gate', fuelStatus: '80%', status: 'Active' },
        { id: '3', vehicleNo: 'DL-01-VAN-102', type: 'Mobile Rural Health Van', driverName: 'Abdul Gani', route: 'Primary Health Center Outreach', fuelStatus: '85%', status: 'Active' },
      ]}
    />
  );
}
