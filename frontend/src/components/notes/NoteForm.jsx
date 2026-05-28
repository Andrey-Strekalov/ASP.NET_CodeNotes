import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress, Chip, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const TAG_PALETTE = ['#7c4dff', '#00b4d8', '#ff6b6b', '#4caf50', '#ffab40', '#e040fb'];
const tagColor = (id) => TAG_PALETTE[id % TAG_PALETTE.length];

const validationSchema = Yup.object({
  title: Yup.string().max(200, 'Максимум 200 символов').required('Заголовок обязателен'),
  content: Yup.string().max(40000, 'Максимум 40000 символов'),
});

const NoteForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [error, setError] = useState('');
  const [loadingNote, setLoadingNote] = useState(isEdit);

  const formik = useFormik({
    initialValues: { title: '', content: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const payload = { title: values.title, content: values.content || null, tagIds: selectedTagIds };
        if (isEdit) await api.put(`/notes/${id}`, payload);
        else await api.post('/notes', payload);
        navigate('/notes');
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при сохранении');
      } finally { setSubmitting(false); }
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: tagList } = await api.get('/tags');
        setTags(tagList);
        if (isEdit) {
          const { data: note } = await api.get(`/notes/${id}`);
          formik.setValues({ title: note.title, content: note.content || '' });
          setSelectedTagIds(note.tags.map((t) => t.id));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка загрузки данных');
      } finally { setLoadingNote(false); }
    };
    loadData();
  }, [id, isEdit]);

  const toggleTag = (tagId) =>
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );

  if (loadingNote) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress sx={{ color: '#7c4dff' }} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 780, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/notes')}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
        Назад к заметкам
      </Button>

      <Box sx={{
        background: '#1a1a2e',
        border: '1px solid rgba(124,77,255,0.15)',
        borderRadius: 4, overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, rgba(124,77,255,0.12), rgba(93,45,212,0.06))',
          borderBottom: '1px solid rgba(124,77,255,0.12)',
          px: { xs: 3, md: 5 }, py: 3,
        }}>
          <Typography variant="h5" fontWeight={700}>
            {isEdit ? 'Редактировать заметку' : 'Новая заметка'}
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError('')}>{error}</Alert>}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField fullWidth label="Заголовок" name="title" autoFocus
              value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{ mb: 3 }}
            />
            <TextField fullWidth label="Содержимое" name="content" multiline rows={10}
              value={formik.values.content} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
              sx={{ mb: 3, '& .MuiInputBase-root': { fontFamily: '"Inter", monospace', lineHeight: 1.7 } }}
            />

            {tags.length > 0 && (
              <>
                <Divider sx={{ mb: 2.5 }} />
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <LocalOfferIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    Теги
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                  {tags.map((tag) => {
                    const selected = selectedTagIds.includes(tag.id);
                    const color = tagColor(tag.id);
                    return (
                      <Chip key={tag.id} label={tag.name} clickable onClick={() => toggleTag(tag.id)}
                        sx={selected ? {
                          background: `${color}25`,
                          color: color,
                          border: `1px solid ${color}60`,
                          fontWeight: 600,
                        } : {
                          background: 'rgba(255,255,255,0.04)',
                          color: 'text.secondary',
                          border: '1px solid rgba(255,255,255,0.08)',
                          '&:hover': { background: `${color}15`, color: color },
                        }}
                      />
                    );
                  })}
                </Box>
              </>
            )}

            <Box display="flex" gap={2} mt={1}>
              <Button type="submit" variant="contained" disabled={formik.isSubmitting}
                sx={{ minWidth: 130, py: 1.2 }}>
                {formik.isSubmitting
                  ? <CircularProgress size={20} color="inherit" />
                  : isEdit ? 'Сохранить' : 'Создать'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/notes')} sx={{ minWidth: 100 }}>
                Отмена
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NoteForm;
