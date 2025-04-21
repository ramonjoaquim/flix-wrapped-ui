// components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="pt-15">
        <Outlet />
      </main>
    </div>
  );
}
