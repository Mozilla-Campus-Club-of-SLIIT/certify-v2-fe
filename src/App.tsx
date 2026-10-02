import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import PreviewPage from "./pages/PreviewPage";
import IssueCertificatePage from "./pages/admin/IssueCertificatePage";
import TemplateUploadPage from "./pages/admin/TemplateUploadPage";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="certificates/:id" element={<PreviewPage />} />
          <Route path="admin/certificates/new" element={<IssueCertificatePage />} />
          <Route path="admin/templates/new" element={<TemplateUploadPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
