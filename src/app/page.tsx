"use client";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import PreviewPage from "@/pages/PreviewPage";
import AppLayout from "@/components/AppLayout";

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
