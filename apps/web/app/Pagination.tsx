'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { SxProps, Theme } from '@mui/material/styles';
import {
  useGridApiContext,
  useGridSelector,
  gridPaginationModelSelector,
  gridPaginationRowCountSelector,
} from '@mui/x-data-grid';

export interface MedoraPaginationProps {
  page: number; // 1-based index (1, 2, 3...)
  pageSize: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;
}

export function MedoraPagination({
  page,
  pageSize,
  total,
  onPageChange,
  sx,
}: MedoraPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / (pageSize || 10)));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startRecord = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, total);

  // Generate visible page numbers (sliding window around currentPage)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const navBtnSx = (disabled: boolean) => ({
    minWidth: 32,
    height: 32,
    px: 1,
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    bgcolor: '#FFFFFF',
    color: disabled ? '#CBD5E1' : '#64748B',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    pointerEvents: disabled ? 'none' : 'auto',
    transition: 'all 0.15s ease',
    '&:hover': disabled
      ? {}
      : {
          bgcolor: '#F8FAFC',
          borderColor: '#CBD5E1',
          color: '#0F766E',
        },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        px: 2.5,
        borderTop: '1px solid #F1F5F9',
        bgcolor: '#FFFFFF',
        flexWrap: 'wrap',
        gap: 1.5,
        ...sx,
      }}
    >
      {/* Left side: Showing X to Y of Z results */}
      <Typography
        sx={{
          fontSize: '0.8125rem',
          color: '#64748B',
          fontWeight: 400,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Showing{' '}
        <Typography
          component="span"
          sx={{ fontWeight: 700, color: '#1E293B', fontSize: 'inherit' }}
        >
          {startRecord}
        </Typography>{' '}
        to{' '}
        <Typography
          component="span"
          sx={{ fontWeight: 700, color: '#1E293B', fontSize: 'inherit' }}
        >
          {endRecord}
        </Typography>{' '}
        of{' '}
        <Typography
          component="span"
          sx={{ fontWeight: 700, color: '#1E293B', fontSize: 'inherit' }}
        >
          {total}
        </Typography>{' '}
        results
      </Typography>

      {/* Right side: Navigation buttons « < 1 2 > » */}
      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        {/* First Page « */}
        <ButtonBase
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          sx={navBtnSx(currentPage <= 1)}
          aria-label="First page"
        >
          &laquo;
        </ButtonBase>

        {/* Prev Page < */}
        <ButtonBase
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          sx={navBtnSx(currentPage <= 1)}
          aria-label="Previous page"
        >
          &lsaquo;
        </ButtonBase>

        {/* Page Numbers */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <Box
                key={`ellipsis-${idx}`}
                sx={{
                  minWidth: 28,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  fontSize: '0.85rem',
                }}
              >
                &hellip;
              </Box>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <ButtonBase
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              sx={{
                minWidth: 32,
                height: 32,
                px: 1,
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.15s ease',
                ...(isActive
                  ? {
                      bgcolor: '#F0FDFA', // Soft theme teal matching user's mockup pill
                      border: '1px solid #99F6E4',
                      color: '#0F766E', // Medora brand primary
                    }
                  : {
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      color: '#475569',
                      '&:hover': {
                        bgcolor: '#F8FAFC',
                        borderColor: '#CBD5E1',
                        color: '#0F766E',
                      },
                    }),
              }}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </ButtonBase>
          );
        })}

        {/* Next Page > */}
        <ButtonBase
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          sx={navBtnSx(currentPage >= totalPages)}
          aria-label="Next page"
        >
          &rsaquo;
        </ButtonBase>

        {/* Last Page » */}
        <ButtonBase
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          sx={navBtnSx(currentPage >= totalPages)}
          aria-label="Last page"
        >
          &raquo;
        </ButtonBase>
      </Stack>
    </Box>
  );
}

/**
 * Custom pagination slot component for MUI DataGrid.
 * Matches Medora styling and user's requested layout:
 * "Showing X to Y of Z results" on left, « < 1 2 > » on right.
 */
export function MedoraDataGridPagination() {
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const rowCount = useGridSelector(apiRef, gridPaginationRowCountSelector);

  const currentPage = (paginationModel?.page ?? 0) + 1; // Convert 0-indexed to 1-indexed
  const pageSize = paginationModel?.pageSize ?? 10;
  const total = rowCount ?? 0;

  const handlePageChange = (newPage: number) => {
    apiRef.current.setPage(newPage - 1);
  };

  return (
    <MedoraPagination
      page={currentPage}
      pageSize={pageSize}
      total={total}
      onPageChange={handlePageChange}
      sx={{ width: '100%' }}
    />
  );
}

export default MedoraPagination;
