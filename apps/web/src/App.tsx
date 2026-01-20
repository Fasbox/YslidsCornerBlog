import { Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import HomePage from "./pages/HomePage"
import SectionIndexPage from "./pages/SectionIndexPage";
import PostDetailPage from "./pages/PostDetailPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminEditorPage from "./pages/admin/editor/AdminEditorPage";
import AdminNewPostPage from "./pages/admin/AdminNewPostPage";
import SearchPage from "./pages/SearchPage";
import AdminGuard from "./pages/admin/AdminGuard";
import NotFoundPage from "./pages/NotFoundPage";
import AdminTagsPage from "./pages/admin/AdminTagsPage";


function useThemeByRoute() {
  const { pathname } = useLocation();
  return pathname.startsWith("/fasec") ? "fasec" : "tech";
}

export default function App() {
  const theme = useThemeByRoute();

  return (
    <div data-theme={theme} className="min-h-screen">
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/tech" element={<SectionIndexPage section="TECH" />} />
          <Route path="/tech/post/:slug" element={<PostDetailPage />} />

          <Route path="/fasec" element={<SectionIndexPage section="FASEC" />} />
          <Route path="/fasec/post/:slug" element={<PostDetailPage />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route element={<AdminGuard />} >
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/editor/:id" element={<AdminEditorPage />} />
            <Route path="/admin/new" element={<AdminNewPostPage />} />
            <Route path="/admin/tags" element={<AdminTagsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </div>
  );
}
