import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { ToastProvider } from './context/ToastContext.js';
import { AuthProvider } from './context/AuthContext.js';

// Public pages
import { Home } from './pages/Home.js';
import { About } from './pages/About.js';
import { Categories } from './pages/Categories.js';
import { Nominees } from './pages/Nominees.js';
import { NomineeProfile } from './pages/NomineeProfile.js';
import { MyVotes } from './pages/MyVotes.js';
import { Blog } from './pages/Blog.js';
import { BlogDetail } from './pages/BlogDetail.js';
import { HallOfFame } from './pages/HallOfFame.js';
import { Gallery } from './pages/Gallery.js';
import { Partners } from './pages/Partners.js';
import { SubmitProposal } from './pages/SubmitProposal.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';

// Admin Layout & Pages
import { AdminLayout } from './layouts/AdminLayout.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminCategories } from './pages/admin/AdminCategories.js';
import { AdminNominees } from './pages/admin/AdminNominees.js';
import { AdminVotes } from './pages/admin/AdminVotes.js';
import { AdminProposals } from './pages/admin/AdminProposals.js';
import { AdminUsers } from './pages/admin/AdminUsers.js';
import { AdminTransactions } from './pages/admin/AdminTransactions.js';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-dark-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="categories" element={<Categories />} />
              <Route path="nominees" element={<Nominees />} />
              <Route path="nominees/:slug" element={<NomineeProfile />} />
              <Route path="my-votes" element={<MyVotes />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="hall-of-fame" element={<HallOfFame />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="partners" element={<Partners />} />
              <Route path="submit-proposal" element={<SubmitProposal />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="nominees" element={<AdminNominees />} />
              <Route path="votes" element={<AdminVotes />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="proposals" element={<AdminProposals />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};
