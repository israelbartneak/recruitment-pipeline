"use client";
import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  UserCheck,
  BarChart3,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Lock,
  GitFork,
  Files,
} from "lucide-react";
import { IconGitBranch } from "@tabler/icons-react";

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  activeGroup,
  setActiveGroup,
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem("sidebar_collapsed");
    if (savedState !== null) setIsCollapsed(savedState === "true");
  }, [setIsCollapsed]);

  // Agrupado em 2 blocos para garantir espaçamento uniforme entre os itens
  const menuSections = useMemo(
    () => [
      {
        title: "Recruitment Suite",
        items: [
          { id: "dashboard", name: "Home", icon: Home, href: "/dashboard" },
          { id: "clients", name: "Clients", icon: Users, href: "/clients" },
          { id: "jobs", name: "Jobs", icon: Briefcase, href: "/jobs-board" },
          {
            id: "candidates",
            name: "Candidates",
            icon: UserCheck,
            href: "/candidates",
          },
        ],
      },
      {
        title: "Analytics & Resources",
        items: [
          {
            id: "reports",
            name: "Reports",
            icon: BarChart3,
            href: "/reports",
          },
          {
            id: "process",
            name: "Process",
            icon: IconGitBranch,
            href: "/process",
          },
          {
            id: "documents",
            name: "Documents",
            icon: Files,
            href: "/documents",
          },
        ],
      },
    ],
    [],
  );

  const handleGroupClick = (groupId) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      localStorage.setItem("sidebar_collapsed", "false");
      setTimeout(() => setActiveGroup(groupId), 120);
    } else {
      setActiveGroup(activeGroup === groupId ? null : groupId);
    }
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar_collapsed", String(newState));
  };

  if (!isMounted)
    return (
      <aside
        className="sidebar"
        style={{
          width: isCollapsed ? "72px" : "250px",
          height: "100vh",
          background: "#0F172A",
        }}
      />
    );

  return (
    <aside className="sidebar">
      <style jsx>{`
        .sidebar {
          width: ${isCollapsed ? "72px" : "250px"};
          height: 100vh;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .logo-container {
          padding: 0px ${isCollapsed ? "0" : "15px"};
          min-height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          width: 100%;
        }
        .logo-img {
          width: ${isCollapsed ? "35px" : "220px"};
          height: auto;
          max-height: 100px;
          object-fit: contain;
          transition: all 0.2s ease;
        }
        .nav-container {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 8px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .nav-container::-webkit-scrollbar {
          width: 0;
        }

        /* LINHA DIVISÓRIA EXCLUSIVA ENTRE CANDIDATES E REPORTS */
        .sidebar-divider {
          border: none;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.08);
          margin: 12px 6px 16px 6px;
          width: calc(100% - 12px);
        }

        :global(.nav-link-item) {
          border-radius: 6px;
          padding: 10px 14px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: ${isCollapsed ? "center" : "flex-start"} !important;
          gap: 12px !important;
          text-decoration: none !important;
          transition: all 0.15s ease !important;
          width: calc(100% - 4px) !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          cursor: pointer !important;
          margin-bottom: 4px;
        }
        :global(.nav-link-item:hover) {
          background: rgba(255, 255, 255, 0.04) !important;
        }
        :global(.icon-box) {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          width: 20px !important;
          height: 20px !important;
        }
        :global(.nav-text) {
          font-weight: 500 !important;
          font-size: 0.875rem !important;
          white-space: nowrap !important;
          display: inline-block !important;
        }
        .collapse-footer {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          transition: color 0.15s;
          width: 100%;
        }
        .collapse-footer:hover {
          color: #94a3b8;
        }
      `}</style>

      <div className="logo-container">
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            src={
              isCollapsed
                ? "https://23610680.fs1.hubspotusercontent-na1.net/hubfs/23610680/frontallusa-site-imgs/logo/frontall_white_n_orange_icon.png"
                : "https://23610680.fs1.hubspotusercontent-na1.net/hubfs/23610680/frontallusa-site-imgs/logo/hr-solutions-light.png"
            }
            className="logo-img"
            alt="Frontall Logo"
          />
        </Link>
      </div>

      <div className="nav-container">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} style={{ width: "100%" }}>
            {/* Divisor único renderizado antes do bloco de Analytics (índice 1) */}
            {sIdx === 1 && <hr className="sidebar-divider" />}

            {section.items.map((item) => {
              const ItemIcon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isGroupActive = activeGroup === item.id;
              const isLinkActive = pathname === item.href;

              return (
                <div key={item.id}>
                  {hasChildren ? (
                    <>
                      <div
                        className="nav-link-item"
                        style={{
                          background: isGroupActive
                            ? "rgba(255, 255, 255, 0.03)"
                            : "transparent",
                          borderLeft: isGroupActive
                            ? "3px solid #ea580c"
                            : "3px solid transparent",
                          paddingLeft: isGroupActive ? "11px" : "14px",
                        }}
                        onClick={() => handleGroupClick(item.id)}
                      >
                        <div
                          className="icon-box"
                          style={{
                            color: isGroupActive ? "#ea580c" : "#64748b",
                          }}
                        >
                          <ItemIcon size={20} />
                        </div>
                        {!isCollapsed && (
                          <div
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              overflow: "hidden",
                            }}
                          >
                            <span
                              className="nav-text"
                              style={{
                                color: isGroupActive ? "#ffffff" : "#94a3b8",
                              }}
                            >
                              {item.name}
                            </span>
                            <ChevronRight
                              size={14}
                              style={{
                                color: "#475569",
                                transform: isGroupActive
                                  ? "rotate(90deg)"
                                  : "none",
                                transition: "0.2s",
                                flexShrink: 0,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {!isCollapsed && isGroupActive && (
                        <div
                          style={{
                            paddingBottom: "4px",
                            marginLeft: "23px",
                            borderLeft: "1px solid rgba(234, 88, 12, 0.3)",
                          }}
                        >
                          {item.children.map((child, idx) => {
                            const isLocked = child.isDisabled;
                            const isChildActive = pathname === child.href;
                            return (
                              <Link
                                key={idx}
                                href={isLocked ? "#" : child.href}
                                target={
                                  child.isExternal && !isLocked
                                    ? "_blank"
                                    : "_self"
                                }
                                onClick={(e) => isLocked && e.preventDefault()}
                                className="nav-link-item"
                                style={{
                                  background: isChildActive
                                    ? "rgba(234, 88, 12, 0.1)"
                                    : "transparent",
                                  color: isChildActive ? "white" : "#94A3B8",
                                  fontSize: "0.8rem",
                                  opacity: isLocked ? 0.4 : 1,
                                  cursor: isLocked ? "not-allowed" : "pointer",
                                }}
                              >
                                <div
                                  className="icon-box"
                                  style={{
                                    color: isChildActive
                                      ? "#ea580c"
                                      : "#64748b",
                                  }}
                                >
                                  {isLocked ? (
                                    <Lock size={12} />
                                  ) : (
                                    <ChevronRight size={12} />
                                  )}
                                </div>
                                <span className="nav-text">{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="nav-link-item"
                      style={{
                        background: isLinkActive
                          ? "rgba(234, 88, 12, 0.1)"
                          : "transparent",
                        borderLeft: isLinkActive
                          ? "3px solid #ea580c"
                          : "3px solid transparent",
                        paddingLeft: isLinkActive ? "11px" : "14px",
                      }}
                    >
                      <div
                        className="icon-box"
                        style={{ color: isLinkActive ? "#ea580c" : "#64748b" }}
                      >
                        <ItemIcon size={20} />
                      </div>
                      {!isCollapsed && (
                        <span
                          className="nav-text"
                          style={{
                            color: isLinkActive ? "#ffffff" : "#94a3b8",
                          }}
                        >
                          {item.name}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="collapse-footer" onClick={toggleSidebar}>
        {isCollapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <PanelLeftClose size={18} />
        )}
      </div>
    </aside>
  );
}
