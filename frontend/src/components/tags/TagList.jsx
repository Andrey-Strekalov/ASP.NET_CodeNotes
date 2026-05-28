import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Box, Button, Typography, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const TAG_PALETTE = ['#7c4dff', '#00b4d8', '#ff6b6b', '#4caf50', '#ffab40', '#e040fb'];
const tagColor = (id) => TAG_PALETTE[id % TAG_PALETTE.length];
const formatDate = (d) =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState('');

  useEffect(() => { fetchTags(); }, []);

  const fetchTags = async () => {
    try {
      setLoading(true); setError('');
      const { data } = await api.get('/tags');
      setTags(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить теги');
    } finally { setLoading(false); }
  };

  const openCreate = () => { setEditingTag(null); setTagName(''); setFieldError(''); setDialogOpen(true); };
  const openEdit = (tag) => { setEditingTag(tag); setTagName(tag.name); setFieldError(''); setDialogOpen(true); };

  const handleSave = async () => {
    if (!tagName.trim()) { setFieldError('Название тега обязательно'); return; }
    setSaving(true); setFieldError('');
    try {
      if (editingTag) {
        const { data } = await api.put(`/tags/${editingTag.id}`, { name: tagName.trim() });
        setTags((prev) => prev.map((t) => (t.id === editingTag.id ? data : t)));
      } else {
        const { data } = await api.post('/tags', { name: tagName.trim() });
        setTags((prev) => [...prev, data]);
      }
      setDialogOpen(false);
    } catch (err) {
      setFieldError(err.response?.data?.message || 'Ошибка при сохранении');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот тег?')) return;
    try { await api.delete(`/tags/${id}`); setTags((prev) => prev.filter((t) => t.id !== id)); }
    catch (err) { setError(err.response?.data?.message || 'Ошибка удаления'); }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress sx={{ color: '#7c4dff' }} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{
            background: 'linear-gradient(90deg, #e8eaf6, #ae80ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Теги
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {tags.length} {tags.length === 1 ? 'тег' : tags.length < 5 ? 'тега' : 'тегов'}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Новый тег
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {tags.length === 0 && !error ? (
        <Box textAlign="center" py={10}>
          <Box sx={{
            width: 72, height: 72, borderRadius: 4, mx: 'auto', mb: 3,
            background: 'rgba(124,77,255,0.08)',
            border: '2px dashed rgba(124,77,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LocalOfferIcon sx={{ fontSize: 32, color: 'rgba(124,77,255,0.4)' }} />
          </Box>
          <Typography variant="h6" color="text.secondary">Тегов пока нет</Typography>
          <Typography variant="body2" color="text.disabled" mt={1} mb={3}>
            Создайте теги для удобной классификации заметок
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Создать тег</Button>
        </Box>
      ) : (
        <TableContainer sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Тег</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag) => {
                const color = tagColor(tag.id);
                return (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <Chip label={tag.name} size="small" sx={{
                        background: `${color}18`, color,
                        border: `1px solid ${color}40`, fontWeight: 600,
                      }} />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDate(tag.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Редактировать">
                        <IconButton size="small" onClick={() => openEdit(tag)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton size="small" onClick={() => handleDelete(tag.id)}
                          sx={{ '&:hover': { color: '#ff5c8d', background: 'rgba(255,92,141,0.08)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalOfferIcon sx={{ color: '#ae80ff', fontSize: 20 }} />
          {editingTag ? 'Редактировать тег' : 'Новый тег'}
        </DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Название тега"
            value={tagName} onChange={(e) => setTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            error={Boolean(fieldError)} helperText={fieldError}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<CloseIcon />}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TagList;
