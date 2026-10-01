'use client';
import { createTheme, alpha } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

/* ─── Design Tokens from Skill §3 & Reference UI ─── */
const CLINICAL_TEAL = '#0F766E';
const CLINICAL_TEAL_LIGHT = '#007B80';
const MEDICAL_NAVY = '#102A43';
const MEDICAL_NAVY_DEEP = '#0F172A';
const MEDICAL_NAVY_DARKEST = '#020617';
const ACCENT_MINT = '#5EEAD4';
const ACCENT_TURQUOISE = '#2DD4BF';
const ACADEMIC_GOLD = '#FACC15';
const ACADEMIC_GOLD_DARK = '#EAB308';
const CANVAS = '#F8FAFC';
const CANVAS_ALT = '#F5F7FA';
const TEXT_PRIMARY = '#1E293B';
const TEXT_SECONDARY = '#334155';
const TEXT_MUTED = '#64748B';
const BORDER = '#E2E8F0';
const WHITE = '#FFFFFF';

/* ─── Status Colors ─── */
const STATUS_SUCCESS = '#059669';
const STATUS_WARNING = '#D97706';
const STATUS_ERROR = '#DC2626';
const STATUS_INFO = '#0284C7';

/* ─── Sidebar width ─── */
export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const TOPBAR_HEIGHT = 64;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: CLINICAL_TEAL,
      light: CLINICAL_TEAL_LIGHT,
      dark: '#0B5D57',
      contrastText: WHITE,
    },
    secondary: {
      main: MEDICAL_NAVY,
      light: '#1E3A5F',
      dark: MEDICAL_NAVY_DEEP,
      contrastText: WHITE,
    },
    success: {
      main: STATUS_SUCCESS,
      light: '#D1FAE5',
      dark: '#047857',
    },
    warning: {
      main: STATUS_WARNING,
      light: '#FEF3C7',
      dark: '#B45309',
    },
    error: {
      main: STATUS_ERROR,
      light: '#FEE2E2',
      dark: '#B91C1C',
    },
    info: {
      main: STATUS_INFO,
      light: '#DBEAFE',
      dark: '#0369A1',
    },
    background: {
      default: CANVAS_ALT,
      paper: WHITE,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled: TEXT_MUTED,
    },
    divider: BORDER,
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontFamily: "'Manrope', 'Inter', sans-serif",
      fontWeight: 750,
      fontSize: '1.875rem',
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: "'Manrope', 'Inter', sans-serif",
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: "'Manrope', 'Inter', sans-serif",
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: "'Manrope', 'Inter', sans-serif",
      fontWeight: 650,
      fontSize: '1rem',
      lineHeight: 1.45,
    },
    h5: {
      fontFamily: "'Manrope', 'Inter', sans-serif",
      fontWeight: 650,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: "'Manrope', 'Inter', sans-serif",
      fontWeight: 600,
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.55,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(15,23,42,0.05)',
    '0 1px 3px 0 rgba(15,23,42,0.08), 0 1px 2px -1px rgba(15,23,42,0.06)',
    '0 4px 6px -1px rgba(15,23,42,0.07), 0 2px 4px -2px rgba(15,23,42,0.05)',
    '0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.04)',
    '0 20px 25px -5px rgba(15,23,42,0.08), 0 8px 10px -6px rgba(15,23,42,0.04)',
    '0 25px 50px -12px rgba(15,23,42,0.15)',
    ...Array(18).fill('none') as any,
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: {
          backgroundColor: CANVAS_ALT,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::-webkit-scrollbar': { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: '#CBD5E1',
          borderRadius: 3,
        },
        '::-webkit-scrollbar-thumb:hover': { background: '#94A3B8' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.8125rem',
          minHeight: 36,
          padding: '6px 16px',
          textTransform: 'none',
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        },
        contained: {
          background: `linear-gradient(135deg, ${CLINICAL_TEAL} 0%, ${CLINICAL_TEAL_LIGHT} 100%)`,
          color: WHITE,
          '&:hover': {
            background: `linear-gradient(135deg, #0B5D57 0%, ${CLINICAL_TEAL} 100%)`,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(15,118,110,0.25)',
          },
        },
        outlined: {
          borderColor: BORDER,
          color: TEXT_PRIMARY,
          '&:hover': { borderColor: CLINICAL_TEAL, color: CLINICAL_TEAL, backgroundColor: alpha(CLINICAL_TEAL, 0.04) },
        },
        text: {
          color: TEXT_SECONDARY,
          '&:hover': { backgroundColor: alpha(CLINICAL_TEAL, 0.06), color: CLINICAL_TEAL },
        },
        sizeSmall: { minHeight: 32, padding: '4px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0 },
        sizeLarge: { minHeight: 44, padding: '8px 24px', fontSize: '0.9375rem', whiteSpace: 'nowrap', flexShrink: 0 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${BORDER}`,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: '#CBD5E1',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 12 },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: TEXT_PRIMARY,
          '& input': {
            border: 'none !important',
            borderRadius: '0 !important',
            backgroundColor: 'transparent !important',
            boxShadow: 'none !important',
            outline: 'none !important',
          },
        },
        input: {
          border: 'none !important',
          borderRadius: '0 !important',
          backgroundColor: 'transparent !important',
          boxShadow: 'none !important',
          outline: 'none !important',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
          backgroundColor: '#FFFFFF',
          minHeight: 40,
          '&.MuiInputBase-multiline': {
            height: 'auto !important',
            minHeight: 'auto',
            padding: '10px 14px',
          },
          '& fieldset': { borderColor: BORDER },
          '&:hover fieldset': { borderColor: '#94A3B8' },
          '&.Mui-focused fieldset': { borderColor: CLINICAL_TEAL, borderWidth: 1.5 },
        },
        input: {
          padding: '8.5px 14px',
          height: 'auto',
          boxSizing: 'border-box',
          '&.MuiInputBase-inputMultiline': {
            padding: '0 !important',
            lineHeight: 1.5,
          },
        },
        sizeSmall: {
          minHeight: 40,
          '&:not(.MuiInputBase-multiline)': {
            height: 40,
          },
          '&.MuiInputBase-multiline': {
            height: 'auto !important',
            minHeight: 'auto',
            padding: '10px 14px',
          },
          '& input:not(textarea)': {
            padding: '8.5px 14px',
          },
          '& textarea': {
            padding: '0 !important',
            lineHeight: 1.5,
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        select: {
          minHeight: 'auto',
          display: 'flex',
          alignItems: 'center',
          padding: '8.5px 14px !important',
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: TEXT_MUTED,
            '&.Mui-focused': {
              color: CLINICAL_TEAL,
            },
          },
          '& .MuiInputLabel-root.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            backgroundColor: '#FFFFFF',
            padding: '0 4px',
            zIndex: 1,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.75rem', borderRadius: 6, height: 26 },
        sizeSmall: { height: 22, fontSize: '0.6875rem' },
        colorSuccess: { backgroundColor: '#D1FAE5', color: '#047857' },
        colorWarning: { backgroundColor: '#FEF3C7', color: '#B45309' },
        colorError: { backgroundColor: '#FEE2E2', color: '#B91C1C' },
        colorInfo: { backgroundColor: '#DBEAFE', color: '#0369A1' },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: '0.8125rem',
        },
        colorDefault: { backgroundColor: alpha(CLINICAL_TEAL, 0.1), color: CLINICAL_TEAL },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '1px 8px',
          padding: '8px 12px',
          transition: 'all 0.15s ease',
          '&.Mui-selected': {
            backgroundColor: alpha(ACCENT_MINT, 0.15),
            color: ACCENT_MINT,
            '& .MuiListItemIcon-root': { color: ACCENT_MINT },
            '&:hover': { backgroundColor: alpha(ACCENT_MINT, 0.2) },
          },
          '&:hover': { backgroundColor: alpha(WHITE, 0.06) },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 36, color: 'inherit' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 650,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: TEXT_MUTED,
            backgroundColor: '#F8FAFC',
            borderBottom: `2px solid ${BORDER}`,
            padding: '12px 16px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          padding: '12px 16px',
          borderBottom: `1px solid ${BORDER}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.1s ease',
          '&:hover': { backgroundColor: '#F8FAFC' },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${BORDER}`,
          color: TEXT_MUTED,
          fontSize: '0.8125rem',
        },
        selectLabel: {
          fontSize: '0.8125rem',
          color: TEXT_MUTED,
        },
        displayedRows: {
          fontSize: '0.8125rem',
          color: TEXT_PRIMARY,
          fontWeight: 600,
        },
        actions: {
          '& .MuiIconButton-root': {
            borderRadius: 6,
            border: `1px solid ${BORDER}`,
            padding: 6,
            marginLeft: 4,
            '&:hover': {
              backgroundColor: '#F8FAFC',
              borderColor: '#CBD5E1',
              color: CLINICAL_TEAL,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '0.8125rem',
          minHeight: 44,
          '&.Mui-selected': { color: CLINICAL_TEAL },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: CLINICAL_TEAL, height: 2.5, borderRadius: '2px 2px 0 0' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 14, boxShadow: '0 25px 50px -12px rgba(15,23,42,0.2)' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: MEDICAL_NAVY,
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '6px 12px',
        },
        arrow: { color: MEDICAL_NAVY },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: { fontSize: '0.8125rem' },
        separator: { color: TEXT_MUTED },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: BORDER },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: '0.8125rem' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: WHITE,
        },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          borderRadius: 8,
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: '#F0FDFA',
            color: CLINICAL_TEAL,
          },
          '&.Mui-selected': {
            backgroundColor: `${CLINICAL_TEAL} !important`,
            color: `${WHITE} !important`,
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#0D6861 !important',
            },
          },
          '&.MuiPickersDay-today': {
            borderColor: CLINICAL_TEAL,
            color: CLINICAL_TEAL,
            fontWeight: 700,
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          marginTop: 8,
          marginBottom: 8,
        },
        label: {
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: '0.9375rem',
          color: MEDICAL_NAVY,
        },
        switchViewButton: {
          color: CLINICAL_TEAL,
          '&:hover': { backgroundColor: '#F0FDFA' },
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          color: TEXT_MUTED,
          fontWeight: 650,
          fontSize: '0.75rem',
        },
      },
    },
    MuiYearCalendar: {
      styleOverrides: {
        button: {
          borderRadius: 8,
          fontSize: '0.875rem',
          '&:hover': { backgroundColor: '#F0FDFA', color: CLINICAL_TEAL },
          '&.Mui-selected': {
            backgroundColor: `${CLINICAL_TEAL} !important`,
            color: `${WHITE} !important`,
            fontWeight: 700,
          },
        },
      },
    },
    MuiMonthCalendar: {
      styleOverrides: {
        button: {
          borderRadius: 8,
          fontSize: '0.875rem',
          '&:hover': { backgroundColor: '#F0FDFA', color: CLINICAL_TEAL },
          '&.Mui-selected': {
            backgroundColor: `${CLINICAL_TEAL} !important`,
            color: `${WHITE} !important`,
            fontWeight: 700,
          },
        },
      },
    },
    MuiPickerPopper: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.16)',
        },
      },
    },
  },
});

/* ─── Custom palette values for sidebar ─── */
export const sidebarColors = {
  bg: MEDICAL_NAVY,
  bgDeep: MEDICAL_NAVY_DARKEST,
  text: alpha(WHITE, 0.7),
  textActive: ACCENT_MINT,
  textHover: WHITE,
  divider: alpha(WHITE, 0.08),
  sectionLabel: alpha(WHITE, 0.4),
  activeHighlight: alpha(ACCENT_MINT, 0.15),
  hoverBg: alpha(WHITE, 0.06),
  brandAccent: CLINICAL_TEAL,
};

export const kpiColors = {
  teal: { bg: alpha(CLINICAL_TEAL, 0.08), icon: CLINICAL_TEAL, border: alpha(CLINICAL_TEAL, 0.15) },
  emerald: { bg: '#ECFDF5', icon: '#059669', border: '#A7F3D0' },
  green: { bg: '#ECFDF5', icon: '#059669', border: '#A7F3D0' },
  blue: { bg: '#EFF6FF', icon: '#2563EB', border: '#BFDBFE' },
  purple: { bg: '#F5F3FF', icon: '#7C3AED', border: '#DDD6FE' },
  amber: { bg: '#FFFBEB', icon: '#D97706', border: '#FDE68A' },
  rose: { bg: '#FFF1F2', icon: '#E11D48', border: '#FECDD3' },
};

export default theme;
