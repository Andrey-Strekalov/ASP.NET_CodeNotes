import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box, Typography, Button, Chip, Alert, CircularProgress, Divider, IconButton, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';

const TAG_PALETTE = ['#7c4dff', '#00b4d8', '#ff6b6b', '#4caf50', '#ffab40', '#e040fb'];
const tagColor = (id) => TAG_PALETTE[id % TAG_PALETTE.length];

const formatDate = (d) =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/notes/${id}`)
      .then(({ data }) => setNote(data))
      .catch((err) => setError(err.response?.data?.message || 'Не удалось загрузить заметку'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Удалить эту заметку?')) return;
    try { await api.delete(`/notes/${id}`); navigate('/notes'); }
    catch (err) { setError(err.response?.data?.message || 'Ошибка при удалении'); }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress sx={{ color: '#7c4dff' }} />
    </Box>
  );

  if (error) return (
    <Box maxWidth={780} mx="auto" px={2} py={4}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/notes')}>Назад</Button>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 780, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/notes')}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
        Назад к заметкам
      </Button>

      <Box sx={{
        background: '#1a1a2e',
        border: '1px solid rgba(124,77,255,0.15)',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
      }}>
        {/* Header strip */}
        <Box sx={{
          background: 'linear-gradient(135deg, rgba(124,77,255,0.15), rgba(93,45,212,0.08))',
          borderBottom: '1px solid rgba(124,77,255,0.12)',
          px: { xs: 3, md: 5 }, py: 4,
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Typography variant="h4" fontWeight={700} sx={{
              background: 'linear-gradient(90deg, #e8eaf6, #c4a0ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              lineHeight: 1.3,
            }}>
              {note.title}
            </Typography>
            <Box display="flex" gap={1} flexShrink={0}>
              <Tooltip title="Редактировать">
                <IconButton onClick={() => navigate(`/notes/${id}/edit`)} sx={{
                  background: 'rgba(124,77,255,0.1)',
                  border: '1px solid rgba(124,77,255,0.2)',
                  '&:hover': { background: 'rgba(124,77,255,0.2)' },
                }}>
                  <EditIcon sx={{ color: '#ae80ff', fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Удалить">
                <IconButton onClick={handleDelete} sx={{
                  background: 'rgba(255,92,141,0.08)',
                  border: '1px solid rgba(255,92,141,0.15)',
                  '&:hover': { background: 'rgba(255,92,141,0.15)' },
                }}>
                  <DeleteIcon sx={{ color: '#ff5c8d', fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Meta */}
          <Box display="flex" gap={2.5} mt={1.5} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={0.6}>
              <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled">
                {formatDate(note.createdAt)}
              </Typography>
            </Box>
            {note.updatedAt && (
              <Box display="flex" alignItems="center" gap={0.6}>
                <UpdateIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled">
                  изм. {formatDate(note.updatedAt)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Tags */}
          {note.tags.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={0.8} mt={2}>
              {note.tags.map((tag) => (
                <Chip key={tag.id} label={tag.name} size="small" sx={{
                  background: `${tagColor(tag.id)}18`,
                  color: tagColor(tag.id),
                  border: `1px solid ${tagColor(tag.id)}40`,
                  fontWeight: 500,
                }} />
              ))}
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
          {note.content ? (
            <Typography variant="body1" sx={{
              whiteSpace: 'pre-wrap', lineHeight: 1.8,
              color: 'text.primary', fontFamily: '"Inter", monospace',
            }}>
              {note.content}
            </Typography>
          ) : (
            <Typography color="text.disabled" fontStyle="italic">
              Содержимое отсутствует
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NoteDetails;
