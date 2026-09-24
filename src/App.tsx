import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AuthProvider from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import VerificationPage from "./pages/VerificationPage";
import PreviewPage from "./pages/PreviewPage";
import IssueCertificatePage from "./pages/admin/IssueCertificatePage";
import TemplateUploadPage from "./pages/admin/TemplateUploadPage";
import BadgeTemplateUploadPage from "./pages/admin/BadgeTemplateUploadPage";
import IssueBadgePage from "./pages/admin/IssueBadgePage";
import BadgeVerifyPage from "./pages/BadgeVerifyPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="verify" element={<VerificationPage />} />
            <Route path="certificates/:id" element={<PreviewPage />} />
            <Route path="badges/verify" element={<BadgeVerifyPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="admin/certificates/new" element={<IssueCertificatePage />} />
              <Route path="admin/templates/new" element={<TemplateUploadPage />} />
              <Route path="admin/badges/new" element={<IssueBadgePage />} />
              <Route path="admin/badges/templates/new" element={<BadgeTemplateUploadPage />} />
            </Route>
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
