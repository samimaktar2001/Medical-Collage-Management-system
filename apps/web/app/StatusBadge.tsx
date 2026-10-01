'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

export type BadgeTone = 'success' | 'warning' | 'error' | 'info' | 'purple' | 'teal' | 'neutral';

export interface StatusBadgeProps {
  status: string;
  tone?: BadgeTone;
  showDot?: boolean;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}

// Automatically resolve semantic tone from common status strings across all panels
export function getStatusTone(status: string): BadgeTone {
  const s = (status || '').trim().toLowerCase();

  // Success / Green
  if (/^(active|verified|completed|approved|paid|resolved|published|normal|present|eligible|available|in stock|safe|discharged|passed|white|online|pass|100% pass|fully compliant)$/i.test(s)) {
    return 'success';
  }

  // Danger / Red
  if (/^(urgent|critical|high|emergency|rejected|absent|cancelled|no show|red|inactive|failed|expired|revoked|unpaid|death|mlc|flagged|high priority|critical stat|occupied|offline)$/i.test(s)) {
    return 'error';
  }

  // Warning / Amber
  if (/^(pending|in consultation|waiting|on leave|under review|submitted|in progress|contacted|draft|yellow|moderate|review|partial|intermediate|processing|warning|sanitizing|routine|borderline high)$/i.test(s)) {
    return 'warning';
  }

  // Info / Blue
  if (/^(scheduled|consulting|blue|dops|skill|mini-cex|elderly \/ pediatric|dispatched|tpa approved|reserved)$/i.test(s)) {
    return 'info';
  }

  // Purple / Special
  if (/^(osce|vip|autopsy|bio-hazard|post-op|icu|pg|fellowship)$/i.test(s)) {
    return 'purple';
  }

  // Teal / Clinical & Academic
  if (/^(mbbs|md|ms|bds|admission|general|clinic on-duty|staff|doctor|faculty|admitted)$/i.test(s)) {
    return 'teal';
  }

  return 'neutral';
}

const TONE_STYLES: Record<BadgeTone, { bg: string; color: string; border: string; dot: string }> = {
  success: {
    bg: '#ECFDF5',
    color: '#065F46',
    border: '#A7F3D0',
    dot: '#10B981',
  },
  warning: {
    bg: '#FFFBEB',
    color: '#92400E',
    border: '#FDE68A',
    dot: '#F59E0B',
  },
  error: {
    bg: '#FEF2F2',
    color: '#991B1B',
    border: '#FECACA',
    dot: '#EF4444',
  },
  info: {
    bg: '#EFF6FF',
    color: '#1E40AF',
    border: '#BFDBFE',
    dot: '#3B82F6',
  },
  purple: {
    bg: '#FAF5FF',
    color: '#6B21A8',
    border: '#E9D5FF',
    dot: '#A855F7',
  },
  teal: {
    bg: '#F0FDFA',
    color: '#0F766E',
    border: '#99F6E4',
    dot: '#0D9488',
  },
  neutral: {
    bg: '#F8FAFC',
    color: '#475569',
    border: '#E2E8F0',
    dot: '#94A3B8',
  },
};

export function StatusBadge({
  status,
  tone,
  showDot = true,
  size = 'small',
  sx,
}: StatusBadgeProps) {
  const resolvedTone = tone || getStatusTone(status);
  const styles = TONE_STYLES[resolvedTone];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.65,
        height: size === 'small' ? 24 : 28,
        px: size === 'small' ? '8px' : '12px',
        borderRadius: '6px',
        bgcolor: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
        fontSize: size === 'small' ? '0.72rem' : '0.78rem',
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        flexShrink: 0,
        ...sx,
      }}
    >
      {showDot && (
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: styles.dot,
            flexShrink: 0,
          }}
        />
      )}
      <span>{status || '—'}</span>
    </Box>
  );
}

export default StatusBadge;
