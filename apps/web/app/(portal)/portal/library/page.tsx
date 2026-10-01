'use client';

import GenericModulePage from '../../GenericModulePage';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DevicesIcon from '@mui/icons-material/Devices';

export default function LibraryPage() {
  return (
    <GenericModulePage
      category="Administration"
      title="Central Medical Library &amp; E-Journal Hub"
      description="Medical textbooks, international peer-reviewed journals (PubMed/Lancet/NEJM), RFID circulation and e-learning reading halls."
      addModalTitle="Book / Journal"
      addFields={[
        { id: 'title', label: 'Book Title' },
        { id: 'author', label: 'Author / Editor' },
        { id: 'isbn', label: 'ISBN / Accession #' },
        { id: 'copies', label: 'Number of Copies' },
      ]}
      kpis={[
        { title: 'Total Print Volumes', value: '28,450', trend: 5, icon: <LocalLibraryIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Books Currently Issued', value: '1,240', icon: <AutoStoriesIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'E-Journals Subscribed', value: '450+', icon: <DevicesIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Reading Hall Seating', value: '350 Seats', icon: <MenuBookIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'accNo', label: 'Accession #' },
        { id: 'title', label: 'Title' },
        { id: 'author', label: 'Author(s)' },
        { id: 'edition', label: 'Edition' },
        { id: 'category', label: 'Subject Category' },
        { id: 'available', label: 'Available Copies' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', accNo: 'LIB-10492', title: 'Gray\'s Anatomy: The Anatomical Basis of Clinical Practice', author: 'Susan Standring', edition: '42nd Edition', category: 'Human Anatomy', available: '14 / 20', status: 'Available' },
        { id: '2', accNo: 'LIB-10493', title: 'Harrison\'s Principles of Internal Medicine', author: 'J. Larry Jameson et al.', edition: '21st Edition', category: 'General Medicine', available: '8 / 15', status: 'Available' },
        { id: '3', accNo: 'LIB-10494', title: 'Guyton and Hall Textbook of Medical Physiology', author: 'John E. Hall', edition: '14th Edition', category: 'Physiology', available: '18 / 25', status: 'Available' },
      ]}
    />
  );
}
