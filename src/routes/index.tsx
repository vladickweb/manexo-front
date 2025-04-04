import { Route, Routes } from "react-router-dom";

import { FavoritesPage } from "@/modules/FavoritesPage";
import { LandingPage } from "@/modules/LandingPage";
import { MessagesPage } from "@/modules/MessagesPage";
import { ProfilePage } from "@/modules/ProfilePage";
import { ServicesPage } from "@/modules/ServicesPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};
