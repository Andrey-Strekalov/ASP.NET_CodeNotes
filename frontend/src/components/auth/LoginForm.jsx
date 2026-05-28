import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  TextField, Button, Typography, Box, Alert,
  FormControlLabel, Checkbox, CircularProgress, Divider,
} from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const validationSchema = Yup.object({
  username: Yup.string().required('Имя пользователя обязательно'),
  password: Yup.string().required('Пароль обязателен'),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { username: '', password: '', rememberMe: false },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      const result = await login(values.username, values.password, values.rememberMe);
      if (result.success) navigate('/notes');
      else setError(result.message);
      setSubmitting(false);
    },
  });

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      px: 2,
      background: 'radial-gradient(ellipse at 60% 20%, rgba(124,77,255,0.08) 0%, transparent 60%)',
    }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Logo block */}
        <Box textAlign="center" mb={4}>
          <Box sx={{
            width: 56, height: 56, borderRadius: 3, mx: 'auto', mb: 2,
            background: 'linear-gradient(135deg, #7c4dff, #5d2dd4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(124,77,255,0.45)',
          }}>
            <NoteAltIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Typography variant="h4" fontWeight={700} sx={{
            background: 'linear-gradient(90deg, #e8eaf6, #ae80ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            CodeNotes
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Войдите в свой аккаунт
          </Typography>
        </Box>

        {/* Card */}
        <Box sx={{
          background: '#1a1a2e',
          border: '1px solid rgba(124,77,255,0.15)',
          borderRadius: 4, p: 4,
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <LockOutlinedIcon sx={{ color: '#ae80ff', fontSize: 20 }} />
            <Typography variant="h6" fontWeight={600}>Вход</Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField fullWidth label="Имя пользователя" name="username"
              value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              autoComplete="username" sx={{ mb: 2 }}
            />
            <TextField fullWidth label="Пароль" name="password" type="password"
              value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              autoComplete="current-password" sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox name="rememberMe" checked={formik.values.rememberMe}
                  onChange={formik.handleChange} size="small"
                  sx={{ color: 'rgba(124,77,255,0.5)', '&.Mui-checked': { color: '#7c4dff' } }}
                />
              }
              label={<Typography variant="body2" color="text.secondary">Запомнить меня (30 дней)</Typography>}
              sx={{ mb: 2.5 }}
            />

            <Button type="submit" fullWidth variant="contained" disabled={formik.isSubmitting}
              sx={{ py: 1.3, fontSize: '1rem' }}>
              {formik.isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Войти'}
            </Button>

            <Divider sx={{ my: 3, color: 'text.disabled', fontSize: '0.75rem' }}>или</Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Нет аккаунта?{' '}
                <RouterLink to="/register" style={{ color: '#ae80ff', textDecoration: 'none', fontWeight: 600 }}>
                  Зарегистрироваться
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
