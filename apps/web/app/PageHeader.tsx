'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  category?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  breadcrumbs,
  category,
  title,
  description,
  icon,
  badge,
  actions,
}: PageHeaderProps) {
  // Build breadcrumb items if only category or default is provided
  const items: BreadcrumbItem[] = breadcrumbs && breadcrumbs.length > 0
    ? breadcrumbs
    : [
        ...(category ? [{ label: category, href: '/portal/dashboard' }] : []),
        { label: title },
      ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.2, sm: 2.8, md: 3 },
        mb: 3,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #0F766E 0%, #14B8A6 50%, #38BDF8 100%)',
        },
      }}
    >
      {/* Decorative ambient subtle glow */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,118,110,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 13, color: '#94A3B8' }} />}
        sx={{
          mb: 1.5,
          '& .MuiBreadcrumbs-li': { display: 'inline-flex', alignItems: 'center' },
        }}
      >
        <Link
          href="/portal/dashboard"
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#64748B',
            '&:hover': { color: '#0F766E' },
          }}
        >
          <HomeOutlinedIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
          <span>Home</span>
        </Link>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          if (isLast) {
            return (
              <Typography
                key={idx}
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0F766E',
                  bgcolor: '#F0FDFA',
                  px: 1,
                  py: 0.2,
                  borderRadius: '5px',
                  border: '1px solid #CCFBF1',
                }}
              >
                {item.label}
              </Typography>
            );
          }
          return (
            <Link
              key={idx}
              href={item.href || '/portal/dashboard'}
              underline="hover"
              sx={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#64748B',
                '&:hover': { color: '#0F766E' },
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* Main Row: (Icon + Title + Badge + Description) and Actions */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2.5}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.8 }}>
            {icon && (
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: '#F0FDFA',
                  border: '1px solid #CCFBF1',
                  color: '#0F766E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(15,118,110,0.08)',
                }}
              >
                {icon}
              </Box>
            )}

            <Typography
              component="h1"
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: { xs: '1.35rem', sm: '1.6rem', md: '1.75rem' },
                color: '#0F172A',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>

            {badge && <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>{badge}</Box>}
          </Stack>

          {description && (
            <Typography
              sx={{
                color: '#64748B',
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              flexShrink: 0,
              flexWrap: 'wrap',
              alignSelf: { xs: 'stretch', sm: 'auto' },
            }}
          >
            {actions}
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

export default PageHeader;
