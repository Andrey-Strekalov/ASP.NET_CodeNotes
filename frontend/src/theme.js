import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c4dff',
      light: '#ae80ff',
      dark: '#5d2dd4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00c8ff',
      light: '#6fffff',
      dark: '#0097cb',
    },
    background: {
      default: '#0a0a14',
      paper: '#13131f',
    },
    surface: {
      card: '#1a1a2e',
      elevated: '#20203a',
    },
    text: {
      primary: '#e8eaf6',
      secondary: '#8890b5',
      disabled: '#4a4a6a',
    },
    divider: 'rgba(124, 77, 255, 0.12)',
    error: { main: '#ff5c8d' },
    success: { main: '#00e676' },
    warning: { main: '#ffab40' },
    info: { main: '#40c4ff' },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    caption: { letterSpacing: '0.03em' },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0a14 0%, #0d0a1f 100%)',
          minHeight: '100vh',
          scrollbarWidth: 'thin',
          scrollbarColor: '#7c4dff33 transparent',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: '#7c4dff55',
            borderRadius: 3,
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(13, 13, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(124, 77, 255, 0.15)',
          boxShadow: 'none',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1a1a2e',
          border: '1px solid rgba(124, 77, 255, 0.12)',
          borderRadius: 16,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          backgroundImage: 'none',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(124, 77, 255, 0.18)',
            borderColor: 'rgba(124, 77, 255, 0.35)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#13131f',
          border: '1px solid rgba(124, 77, 255, 0.12)',
        },
        elevation2: {
          background: '#1a1a2e',
          border: '1px solid rgba(124, 77, 255, 0.15)',
        },
        elevation3: {
          background: '#20203a',
          border: '1px solid rgba(124, 77, 255, 0.2)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #7c4dff 0%, #5d2dd4 100%)',
          boxShadow: '0 4px 14px rgba(124, 77, 255, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9c6fff 0%, #7c4dff 100%)',
            boxShadow: '0 6px 20px rgba(124, 77, 255, 0.5)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
          '&.Mui-disabled': {
            background: 'rgba(124, 77, 255, 0.2)',
            color: 'rgba(232, 234, 246, 0.35)',
          },
        },
        outlined: {
          borderColor: 'rgba(124, 77, 255, 0.4)',
          color: '#ae80ff',
          '&:hover': {
            borderColor: '#7c4dff',
            background: 'rgba(124, 77, 255, 0.08)',
          },
        },
        text: {
          color: '#ae80ff',
          '&:hover': { background: 'rgba(124, 77, 255, 0.08)' },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(124, 77, 255, 0.25)' },
            '&:hover fieldset': { borderColor: 'rgba(124, 77, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#7c4dff' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#ae80ff' },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.72rem',
        },
        outlined: {
          borderColor: 'rgba(124, 77, 255, 0.35)',
          color: '#ae80ff',
        },
        filled: {
          background: 'rgba(124, 77, 255, 0.2)',
          color: '#c4a0ff',
          '&:hover': { background: 'rgba(124, 77, 255, 0.3)' },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          background: '#1a1a2e',
          borderRadius: 16,
          border: '1px solid rgba(124, 77, 255, 0.12)',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: 'rgba(124, 77, 255, 0.08)',
            color: '#ae80ff',
            fontWeight: 600,
            fontSize: '0.8rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(124, 77, 255, 0.15)',
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { background: 'rgba(124, 77, 255, 0.05) !important' },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(124, 77, 255, 0.08)',
            color: '#e8eaf6',
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': { paddingBottom: '24px' },
        },
      },
    },

    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '12px 16px 16px',
          borderTop: '1px solid rgba(124, 77, 255, 0.08)',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
        },
        head: {
          padding: '14px 20px',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 28px 16px',
          fontSize: '1.1rem',
          fontWeight: 600,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 28px 20px',
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 28px 24px',
          gap: 8,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(124, 77, 255, 0.12)' },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#1a1a2e',
          border: '1px solid rgba(124, 77, 255, 0.2)',
          borderRadius: 16,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
        standardError: {
          background: 'rgba(255, 92, 141, 0.1)',
          border: '1px solid rgba(255, 92, 141, 0.25)',
          color: '#ff8fb3',
        },
        standardSuccess: {
          background: 'rgba(0, 230, 118, 0.1)',
          border: '1px solid rgba(0, 230, 118, 0.25)',
          color: '#69ffa9',
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '&:hover': { background: 'rgba(124, 77, 255, 0.1)' },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#20203a',
          border: '1px solid rgba(124, 77, 255, 0.2)',
          color: '#e8eaf6',
          borderRadius: 8,
          fontSize: '0.78rem',
        },
      },
    },
  },
});

export default theme;
