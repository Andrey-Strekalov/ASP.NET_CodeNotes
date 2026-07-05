import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar, Chip,
} from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import NotesIcon from '@mui/icons-material/Notes';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);
  return (
    <Button
      component={RouterLink}
      to={to}
      startIcon={icon}
      sx={{
        color: active ? '#ae80ff' : 'text.secondary',
        background: active ? 'rgba(124,77,255,0.12)' : 'transparent',
        borderRadius: 2,
        px: 1.5,
        fontWeight: active ? 600 : 500,
        '&:hover': { background: 'rgba(124,77,255,0.1)', color: '#ae80ff' },
      }}
    >
      {label}
    </Button>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 1, minHeight: 64 }}>
        {/* Logo */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            textDecoration: 'none', mr: 3,
          }}
        >
          <Box sx={{
            width: 34, height: 34, borderRadius: 2,
            background: 'linear-gradient(135deg, #7c4dff, #5d2dd4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(124,77,255,0.4)',
          }}>
            <NoteAltIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Typography variant="h6" sx={{
            color: 'text.primary', fontWeight: 700, letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #e8eaf6, #ae80ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            CodeNotes
          </Typography>
        </Box>

        {/* Nav links */}
        {isAuthenticated && (
          <Box display="flex" gap={0.5}>
            <NavLink to="/notes" icon={<NotesIcon sx={{ fontSize: 18 }} />} label="Заметки" />
            <NavLink to="/tags"  icon={<LocalOfferIcon sx={{ fontSize: 18 }} />} label="Теги" />
          </Box>
        )}

        <Box flexGrow={1} />

        {/* Right side */}
        {isAuthenticated ? (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Chip
              avatar={
                <Avatar sx={{ bgcolor: 'rgba(124,77,255,0.3)', color: '#ae80ff', fontSize: '0.75rem' }}>
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              }
              label={user?.username}
              sx={{
                background: 'rgba(124,77,255,0.1)',
                border: '1px solid rgba(124,77,255,0.25)',
                color: 'text.primary',
                fontWeight: 500,
              }}
            />
            <Button
              size="small"
              startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
              onClick={handleLogout}
              sx={{
                color: 'text.secondary',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
                px: 1.5,
                '&:hover': {
                  color: '#ff5c8d',
                  border: '1px solid rgba(255,92,141,0.3)',
                  background: 'rgba(255,92,141,0.06)',
                },
              }}
            >
              Выйти
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button component={RouterLink} to="/login"
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
              Вход
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" size="small">
              Регистрация
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
