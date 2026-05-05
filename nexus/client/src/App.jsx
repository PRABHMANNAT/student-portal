import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import ProfileEditModal from './components/Profile/ProfileEditModal';
import CollectionsPage from './pages/CollectionsPage';
import JobsPage from './pages/JobsPage';
import ProfileEditorPage from './pages/ProfileEditorPage';
import RoadmapPage from './pages/RoadmapPage';

export default function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/roadmap" replace />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/notes" element={<ProfileEditorPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
        </Routes>
      </AnimatePresence>
      <ProfileEditModal />
    </>
  );
}
