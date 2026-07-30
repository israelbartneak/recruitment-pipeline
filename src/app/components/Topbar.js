"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Terminal,
  Sun,
  Sunrise,
  Moon,
  User as UserIcon,
  Settings,
  LogOut,
} from "lucide-react";

const router = {
  push: (path) => console.log(`[Simulação Router] Navegando para: ${path}`),
};

export default function Topbar({
  searchContainerRef,
  searchQuery = "",
  setSearchQuery = () => {},
  isSearchFocused = false,
  setIsSearchFocused = () => {},
  setIsUpdatesModalOpen = () => {},
  setIsRemindersOpen = () => {},
  reminders = [],
  profileRef,
  isProfileOpen = false,
  setIsProfileOpen = () => {},
  userName: propUserName,
  userRole: propUserRole,
  userData: propUserData,
  onSignOut,
}) {
  const [localUser, setLocalUser] = useState({
    fullName: propUserName || propUserData?.name || "Bryan Santana",
    role: (
      propUserRole ||
      propUserData?.role ||
      "administrator"
    )?.toLowerCase(),
    avatar: propUserData?.avatar || "",
  });

  // Estado do Tema: 'light' | 'golden' | 'dark'
  const [currentTheme, setCurrentTheme] = useState("light");
  const [isThemeHovered, setIsThemeHovered] = useState(false);

  useEffect(() => {
    const loadUserData = () => {
      const storedName = localStorage.getItem("user_full_name");
      const storedAvatar = localStorage.getItem("user_avatar");
      const storedRole =
        localStorage.getItem("user_role") || propUserRole || "administrator";

      setLocalUser({
        fullName: storedName || propUserName || "Bryan Santana",
        role: storedRole.toLowerCase(),
        avatar: storedAvatar || propUserData?.avatar || "",
      });
    };
    loadUserData();

    const savedTheme = localStorage.getItem("portal_theme") || "light";
    applyTheme(savedTheme);
  }, [propUserName, propUserRole, propUserData]);

  const applyTheme = (themeMode) => {
    setCurrentTheme(themeMode);
    localStorage.setItem("portal_theme", themeMode);
    document.documentElement.setAttribute("data-theme", themeMode);
  };

  const getInitials = () => {
    if (!localUser.fullName) return "BS";
    return localUser.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Mapeamento dos temas
  const themes = [
    {
      id: "light",
      icon: Sun,
      label: "Light Mode",
      color: "#EAB308",
      activeBg: "#FEF9C3",
    },
    {
      id: "golden",
      icon: Sunrise,
      label: "Golden Hour (Medium)",
      color: "#FE5102",
      activeBg: "#FFEDD5",
    },
    {
      id: "dark",
      icon: Moon,
      label: "Dark Mode",
      color: "#818CF8",
      activeBg: "#1E1B4B",
    },
  ];

  const activeThemeObj = themes.find((t) => t.id === currentTheme) || themes[0];
  const ActiveIcon = activeThemeObj.icon;

  return (
    <header className="topbar-container">
      <style jsx>{`
        .topbar-container {
          height: 70px;
          background: var(--bg-card, white);
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          z-index: 50;
          width: 100%;
          transition:
            background-color 0.25s,
            border-color 0.25s;
        }
        .search-area {
          position: relative;
          width: 420px;
          display: flex;
          align-items: center;
        }
        .search-input {
          width: 100%;
          height: 44px;
          padding: 0 45px;
          border-radius: 12px;
          border: 1px solid ${isSearchFocused ? "#FE5102" : "#E2E8F0"};
          background: #f8fafc;
          font-size: 0.88rem;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: ${isSearchFocused
            ? "0 0 0 3px rgba(254, 81, 2, 0.1)"
            : "none"};
        }
        .ctrl-k-badge {
          position: absolute;
          right: 14px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 3px 7px;
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          pointer-events: none;
          display: ${isSearchFocused || searchQuery ? "none" : "block"};
        }
        .right-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* CONTAINER DO SELETOR DE TEMA EXPANSÍVEL (HOVER) */
        .theme-expand-wrapper {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 3px;
          gap: 4px;
          height: 40px;
          transition:
            width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            background-color 0.2s;
          overflow: hidden;
        }

        .theme-opt-btn {
          width: 34px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            background-color 0.15s,
            color 0.15s;
          flex-shrink: 0;
        }
        .theme-opt-btn:hover {
          background: rgba(254, 81, 2, 0.1);
        }
        .theme-opt-btn.active {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .v-separator {
          width: 1px;
          height: 24px;
          background: #e2e8f0;
          margin: 0 2px;
        }

        /* Perfil de Usuário */
        .user-anchor {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 6px 6px 6px 15px;
          border-radius: 14px;
          cursor: pointer;
          transition: 0.2s;
          border: 1px solid transparent;
        }
        .user-anchor:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
        }
        .user-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .name-txt {
          font-size: 0.85rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
          margin-top: 2px;
        }
        .role-txt {
          font-size: 0.65rem;
          font-weight: 700;
          color: #fe5102;
          text-transform: uppercase;
          margin-top: 4px;
          letter-spacing: 0.5px;
        }

        .avatar-box {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: ${localUser.avatar ? "transparent" : "#FE5102"};
          border: 2px solid white;
          box-shadow: 0 0 0 1px #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          overflow: hidden;
          font-size: 0.8rem;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .drop-item-hover {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          color: #475569;
          cursor: pointer;
          font-size: 0.85rem;
          transition: 0.15s;
        }
        .drop-item-hover:hover {
          background-color: #f8fafc !important;
          color: #fe5102 !important;
        }
        .badge-dot {
          position: relative;
        }
        .badge-dot::after {
          content: "";
          position: absolute;
          top: 10px;
          right: 12px;
          width: 6px;
          height: 6px;
          background: #fe5102;
          border-radius: 50%;
        }
      `}</style>

      {/* Campo de Busca */}
      <div className="search-area" ref={searchContainerRef}>
        <input
          id="portal-search-input"
          type="text"
          className="search-input"
          placeholder="Search tools, routes or people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
        />
        <div className="ctrl-k-badge">CTRL + K</div>
      </div>

      {/* Ações da Direita */}
      <div className="right-actions">
        {/* Seletor Expansível de Temas no Hover */}
        <div
          className="theme-expand-wrapper"
          onMouseEnter={() => setIsThemeHovered(true)}
          onMouseLeave={() => setIsThemeHovered(false)}
        >
          {isThemeHovered ? (
            /* Quando passa o mouse: Expande e mostra as 3 opções lado a lado */
            themes.map((t) => {
              const IconComp = t.icon;
              const isActive = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  className={`theme-opt-btn ${isActive ? "active" : ""}`}
                  style={{ background: isActive ? t.activeBg : "transparent" }}
                  onClick={() => applyTheme(t.id)}
                  title={t.label}
                >
                  <IconComp size={18} color={t.color} />
                </button>
              );
            })
          ) : (
            /* Repouso: Exibe apenas o ícone do tema selecionado */
            <button
              className="theme-opt-btn active"
              style={{ background: activeThemeObj.activeBg }}
              title={`Current: ${activeThemeObj.label} (Hover to expand options)`}
            >
              <ActiveIcon size={18} color={activeThemeObj.color} />
            </button>
          )}
        </div>

        <div className="v-separator"></div>

        {/* Perfil do Usuário com Menu Expandido */}
        <div
          className="user-profile-zone"
          ref={profileRef}
          style={{ position: "relative" }}
        >
          <div
            className="user-anchor"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="avatar-box">
              {localUser.avatar ? (
                <img
                  src={localUser.avatar}
                  alt={localUser.fullName}
                  className="avatar-img"
                />
              ) : (
                getInitials()
              )}
            </div>
          </div>

          {/* Menu Dropdown com Atalhos Operacionais */}
          {isProfileOpen && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: "0",
                width: "210px",
                background: "white",
                borderRadius: "15px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                padding: "8px",
                zIndex: 100,
              }}
            >
              <div
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsUpdatesModalOpen(true);
                }}
                className="drop-item-hover"
              >
                <Terminal size={16} /> Dev Updates
              </div>

              <div
                onClick={() => {
                  setIsProfileOpen(false);
                  router.push("/portal/calendar");
                }}
                className="drop-item-hover"
              >
                <Calendar size={16} /> Calendar
              </div>

              <div
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsRemindersOpen(true);
                }}
                className={`drop-item-hover ${reminders?.length > 0 ? "badge-dot" : ""}`}
              >
                <Bell size={16} /> Reminders
              </div>

              <div
                style={{
                  height: "1px",
                  background: "#F1F5F9",
                  margin: "6px 0",
                }}
              ></div>

              <div
                onClick={() => setIsProfileOpen(false)}
                className="drop-item-hover"
              >
                <UserIcon size={16} /> Profile
              </div>

              <div
                onClick={() => setIsProfileOpen(false)}
                className="drop-item-hover"
              >
                <Settings size={16} /> Settings
              </div>

              <div
                style={{
                  height: "1px",
                  background: "#F1F5F9",
                  margin: "6px 0",
                }}
              ></div>

              <div
                onClick={onSignOut}
                className="drop-item-hover"
                style={{ color: "#EF4444" }}
              >
                <LogOut size={16} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
