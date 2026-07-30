// src/app/clients/[id]/page.js
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { mockClients } from "../mockClients";
import styles from "./clientProfile.module.css";

const TABS = ["Summary", "Jobs", "Meetings", "Notes", "Documents", "History"];

function getStatusLabel(status) {
  switch (status) {
    case "ACTIVES":
      return "Under Contract";
    case "PROSPECTION":
      return "Prospects";
    case "BID":
      return "Bids";
    case "INACTIVES":
      return "Inactive";
    default:
      return status;
  }
}

function getStatusStyle(status) {
  switch (status) {
    case "ACTIVES":
      return { color: "#15803d", bg: "#dcfce7" };
    case "PROSPECTION":
      return { color: "#c2410c", bg: "#ffedd5" };
    case "BID":
      return { color: "#6d28d9", bg: "#ede9fe" };
    case "INACTIVES":
      return { color: "#94a3b8", bg: "#f1f5f9" };
    default:
      return { color: "#334155", bg: "#f1f5f9" };
  }
}

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Summary");

  const client = mockClients.find((c) => c.id === params.id);

  if (!client) {
    return (
      <div className={styles.container}>
        <p>Client not found.</p>
      </div>
    );
  }

  const statusStyle = getStatusStyle(client.status);

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={() => router.push("/clients")}>
              <ArrowLeft size={16} />
            </button>

            {client.logoUrl ? (
              <img src={client.logoUrl} alt={client.name} className={styles.clientLogo} />
            ) : (
              <div className={styles.clientLogoFallback}>{client.initials}</div>
            )}

            <div>
              <div className={styles.titleRow}>
                <h1>{client.name}</h1>
                <span
                  className={styles.statusBadge}
                  style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}
                >
                  {getStatusLabel(client.status)}
                </span>
              </div>

              <div className={styles.locationRow}>
                <MapPin size={13} />
                {client.city}, {client.state} - {client.country}
              </div>

              {client.contractTags.length > 0 && (
                <div className={styles.tagsRow}>
                  {client.contractTags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className={styles.editBtn}>Edit Profile</button>
        </div>

        <div className={styles.tabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Summary" ? (
        <div className={styles.summaryGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>General Information</h2>
              <button className={styles.smallEditBtn}>Edit Profile</button>
            </div>
            <div className={styles.infoList}>
              <div className={styles.infoLine}>
                <span className={styles.label}>ID</span>
                <span className={styles.value}>{client.id}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Website</span>
                {client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteLink}
                  >
                    {client.website.replace("https://", "")}
                  </a>
                ) : (
                  <span className={styles.value}>-</span>
                )}
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Location</span>
                <span className={styles.value}>{client.state}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>City</span>
                <span className={styles.value}>{client.city}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Zipcode</span>
                <span className={styles.value}>{client.zipcode}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Country</span>
                <span className={styles.value}>{client.country}</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.infoLine}>
                <span className={styles.label}>First contact date</span>
                <span className={styles.value}>{client.firstContactDate}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Contract signed date</span>
                <span className={styles.value}>{client.contractSignedDate}</span>
              </div>
            </div>
          </div>

          <div className={styles.sideColumn}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>CEO Contact</h2>
                <button className={styles.smallEditBtn}>Edit</button>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoLine}>
                  <span className={styles.label}>Name</span>
                  <span className={styles.value}>{client.ceoName}</span>
                </div>
                <div className={styles.infoLine}>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{client.ceoPhone}</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Primary Contact</h2>
                <button className={styles.smallEditBtn}>Edit</button>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoLine}>
                  <span className={styles.label}>Name</span>
                  <span className={styles.value}>{client.primaryContactName}</span>
                </div>
                <div className={styles.infoLine}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{client.primaryContactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.placeholderTab}>
          <p>{activeTab} content coming soon.</p>
        </div>
      )}
    </div>
  );
}