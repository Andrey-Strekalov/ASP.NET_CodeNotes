import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../../services/api';
import {
  Box, Button, Typography, Card, CardContent, CardActions,
  Chip, Grid, Alert, CircularProgress, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotesIcon from '@mui/icons-material/Notes';

const TAG_PALETTE = ['#7c4dff', '#00b4d8', '#ff6b6b', '#4caf50', '#ffab40', '#e040fb'];
const tagColor = (id) => TAG_PALETTE[id % TAG_PALETTE.length];

const formatDate = (d) =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true); setError('');
      const { data } = await api.get('/notes');
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить заметки');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту заметку?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((p) => p.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#7c4dff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{
            background: 'linear-gradient(90deg, #e8eaf6, #ae80ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Мои заметки
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {notes.length} {notes.length === 1 ? 'заметка' : notes.length < 5 ? 'заметки' : 'заметок'}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/notes/create"
          sx={{ px: 2.5, py: 1 }}>
          Новая заметка
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>
      )}

      {notes.length === 0 && !error && (
        <Box textAlign="center" py={12}>
          <Box sx={{
            width: 80, height: 80, borderRadius: 4, mx: 'auto', mb: 3,
            background: 'rgba(124,77,255,0.08)',
            border: '2px dashed rgba(124,77,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <NotesIcon sx={{ fontSize: 36, color: 'rgba(124,77,255,0.4)' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Заметок пока нет
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={1} mb={3}>
            Создайте первую заметку, чтобы начать
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/notes/create">
            Создать заметку
          </Button>
        </Box>
      )}

      <Grid container spacing={2.5}>
        {notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => navigate(`/notes/${note.id}`)}>
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Title */}
                <Typography variant="h6" fontWeight={600} noWrap mb={0.5}
                  sx={{ color: 'text.primary' }}>
                  {note.title}
                </Typography>
                {/* Date */}
                <Typography variant="caption" color="text.disabled" display="block" mb={1.5}>
                  {formatDate(note.createdAt)}
                </Typography>
                {/* Preview */}
                {note.content && (
                  <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.6,
                    mb: 2,
                  }}>
                    {note.content}
                  </Typography>
                )}
                {/* Tags */}
                {note.tags.length > 0 && (
                  <Box display="flex" flexWrap="wrap" gap={0.6} mt="auto">
                    {note.tags.map((tag) => (
                      <Chip key={tag.id} label={tag.name} size="small" sx={{
                        background: `${tagColor(tag.id)}18`,
                        color: tagColor(tag.id),
                        border: `1px solid ${tagColor(tag.id)}40`,
                        fontWeight: 500, fontSize: '0.7rem',
                      }} />
                    ))}
                  </Box>
                )}
              </CardContent>

              <CardActions onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Просмотр">
                  <IconButton size="small" onClick={() => navigate(`/notes/${note.id}`)}
                    sx={{ color: 'text.secondary' }}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Редактировать">
                  <IconButton size="small" onClick={() => navigate(`/notes/${note.id}/edit`)}
                    sx={{ color: 'text.secondary' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Удалить">
                  <IconButton size="small" onClick={() => handleDelete(note.id)}
                    sx={{ color: 'text.secondary', '&:hover': { color: '#ff5c8d', background: 'rgba(255,92,141,0.08)' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NoteList;
