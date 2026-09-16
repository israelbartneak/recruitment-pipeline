"use client";
import { useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./globals.css";

export default function RootLayout({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const profileRef = useRef(null);

  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <style jsx global>{`
            body {
              background-color: #ffffff;
              overflow: hidden;
            }
            .app-container {
              display: flex;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
            }
            .main-content {
              display: flex;
              flex-direction: column;
              flex: 1;
              min-width: 0;
              height: 100vh;
            }
            .page-body {
              flex: 1;
              overflow-y: auto;
              padding: 2rem;
            }
          `}</style>

          <Sidebar />

          <div className="main-content">
            <Topbar
              searchContainerRef={searchContainerRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              setIsUpdatesModalOpen={setIsUpdatesModalOpen}
              setIsRemindersOpen={setIsRemindersOpen}
              reminders={[]}
              profileRef={profileRef}
              isProfileOpen={isProfileOpen}
              setIsProfileOpen={setIsProfileOpen}
              userName="Bryan Santana"
              userRole="IT Specialist"
            />

            <main className="page-body">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}