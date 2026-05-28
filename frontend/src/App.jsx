import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import PublicRoute from './components/auth/PublicRoute';
import Navbar from './components/layout/Navbar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import NoteList from './components/notes/NoteList';
import NoteDetails from './components/notes/NoteDetails';
import NoteForm from './components/notes/NoteForm';
import TagList from './components/tags/TagList';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
          <Route path="/notes" element={<PrivateRoute><NoteList /></PrivateRoute>} />
          <Route path="/notes/create" element={<PrivateRoute><NoteForm isEdit={false} /></PrivateRoute>} />
          <Route path="/notes/:id" element={<PrivateRoute><NoteDetails /></PrivateRoute>} />
          <Route path="/notes/:id/edit" element={<PrivateRoute><NoteForm isEdit={true} /></PrivateRoute>} />
          <Route path="/tags" element={<PrivateRoute><TagList /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
