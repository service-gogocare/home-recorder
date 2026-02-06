import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VisitRecord from './pages/VisitRecord';
import CaseList from './pages/CaseList';
import CaseDetail from './pages/CaseDetail';
import CaregiverList from './pages/CaregiverList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cases" element={<CaseList />} />
          <Route path="cases/:id" element={<CaseDetail />} />
          <Route path="caregivers" element={<CaregiverList />} />
          <Route path="visits" element={<VisitRecord />} />
          <Route path="schedule" element={<div className="p-4">工作排程頁面 (開發中)</div>} />
          <Route path="settings" element={<div className="p-4">設定頁面 (開發中)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
