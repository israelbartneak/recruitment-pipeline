"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  UserCheck,
  BarChart3,
  ChevronRight,
  Lock,
  Files,
} from "lucide-react";
import { IconGitBranch } from "@tabler/icons-react";

const SIDEBAR_COLLAPSED_WIDTH = 72;
const SIDEBAR_EXPANDED_WIDTH = 250;

export default function Sidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuSections = [
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
        { id: "reports", name: "Reports", icon: BarChart3, href: "/reports" },
        { id: "process", name: "Process", icon: IconGitBranch, href: "/process" },
        { id: "documents", name: "Documents", icon: Files, href: "/documents" },
      ],
    },
  ];

  const handleGroupClick = (groupId) => {
    setActiveGroup(activeGroup === groupId ? null : groupId);
  };

  const isExpanded = isMounted && isHovered;
  const currentWidth = isExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <>
      {/* PLACEHOLDER — reserva o espaço real no flex row do layout.
          Estilo inline puro, sem depender de nenhuma classe escopada. */}
      <div
        style={{
          width: SIDEBAR_COLLAPSED_WIDTH,
          flexShrink: 0,
          height: "100vh",
        }}
      />

      {/* SIDEBAR VISUAL — position:fixed, independente do fluxo flex,
          sempre ancorado no canto superior esquerdo da tela. */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setActiveGroup(null);
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: currentWidth,
          height: "100vh",
          background: "var(--sidebar-bg)",
          display: "flex",
          flexDirection: "column",
          zIndex: isExpanded ? 200 : 10,
          boxShadow: isExpanded ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
          transition: "width 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease",
          overflow: "hidden",
        }}
      >
        {/* Espaço reservado pro logo (a definir depois) */}
        <div
          style={{
            minHeight: 80,
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "20px 8px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} style={{ width: "100%" }}>
              {sIdx === 1 && (
                <hr
                  style={{
                    border: "none",
                    height: 1,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    margin: "12px 6px 16px 6px",
                    width: "calc(100% - 12px)",
                  }}
                />
              )}

              {section.items.map((item) => {
                const ItemIcon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isGroupActive = activeGroup === item.id;
                const isLinkActive = pathname === item.href;

                const navItemStyle = (active) => ({
                  borderRadius: 6,
                  padding: "10px 14px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: isExpanded ? "flex-start" : "center",
                  gap: 12,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  width: "calc(100% - 4px)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  cursor: "pointer",
                  marginBottom: 4,
                  background: active ? "rgba(254,81,2,0.1)" : "transparent",
                  borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
                  paddingLeft: active ? 11 : 14,
                });

                return (
                  <div key={item.id}>
                    {hasChildren ? (
                      <>
                        <div
                          style={{
                            ...navItemStyle(isGroupActive),
                            background: isGroupActive
                              ? "rgba(255,255,255,0.03)"
                              : "transparent",
                          }}
                          onClick={() => handleGroupClick(item.id)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              width: 20,
                              height: 20,
                              color: isGroupActive
                                ? "var(--primary)"
                                : "var(--sidebar-icon-inactive)",
                            }}
                          >
                            <ItemIcon size={20} />
                          </div>
                          {isExpanded && (
                            <div
                              style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                overflow: "hidden",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 500,
                                  fontSize: "0.875rem",
                                  whiteSpace: "nowrap",
                                  color: isGroupActive
                                    ? "#ffffff"
                                    : "var(--sidebar-text-inactive)",
                                }}
                              >
                                {item.name}
                              </span>
                              <ChevronRight
                                size={14}
                                style={{
                                  color: "#475569",
                                  transform: isGroupActive ? "rotate(90deg)" : "none",
                                  transition: "0.2s",
                                  flexShrink: 0,
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {isExpanded && isGroupActive && (
                          <div
                            style={{
                              paddingBottom: 4,
                              marginLeft: 23,
                              borderLeft: "1px solid rgba(254,81,2,0.3)",
                            }}
                          >
                            {item.children.map((child, idx) => {
                              const isLocked = child.isDisabled;
                              const isChildActive = pathname === child.href;
                              return (
                                <Link
                                  key={idx}
                                  href={isLocked ? "#" : child.href}
                                  target={child.isExternal && !isLocked ? "_blank" : "_self"}
                                  onClick={(e) => isLocked && e.preventDefault()}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 14px",
                                    borderRadius: 6,
                                    textDecoration: "none",
                                    background: isChildActive
                                      ? "rgba(254,81,2,0.1)"
                                      : "transparent",
                                    color: isChildActive ? "white" : "#94A3B8",
                                    fontSize: "0.8rem",
                                    opacity: isLocked ? 0.4 : 1,
                                    cursor: isLocked ? "not-allowed" : "pointer",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      width: 20,
                                      height: 20,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      color: isChildActive
                                        ? "var(--primary)"
                                        : "var(--sidebar-icon-inactive)",
                                    }}
                                  >
                                    {isLocked ? <Lock size={12} /> : <ChevronRight size={12} />}
                                  </div>
                                  <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                                    {child.name}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={item.href} style={navItemStyle(isLinkActive)}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            width: 20,
                            height: 20,
                            color: isLinkActive
                              ? "var(--primary)"
                              : "var(--sidebar-icon-inactive)",
                          }}
                        >
                          <ItemIcon size={20} />
                        </div>
                        {isExpanded && (
                          <span
                            style={{
                              fontWeight: 500,
                              fontSize: "0.875rem",
                              whiteSpace: "nowrap",
                              color: isLinkActive
                                ? "#ffffff"
                                : "var(--sidebar-text-inactive)",
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
      </aside>
    </>
  );
}