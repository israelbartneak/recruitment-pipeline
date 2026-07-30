// src/app/clients/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, X, FileText, Edit3, MoreVertical, MapPin } from "lucide-react";
import { mockClients } from "./mockClients";
import styles from "./clients.module.css";

export default function ClientsPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formType, setFormType] = useState("");

  const [clients, setClients] = useState(mockClients);

  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    contact: "",
    status: "ACTIVES",
  });

  const handleOpenChoice = () => setIsModalOpen(true);

  const handleChooseType = (type) => {
    setFormType(type);
    setIsModalOpen(false);

    if (type === "template") {
      setFormData({
        name: "New Corp Template",
        sector: "Consulting",
        contact: "Sales Manager",
        status: "PROSPECTION",
      });
    } else {
      setFormData({ name: "", sector: "", contact: "", status: "ACTIVES" });
    }
    setIsSidebarOpen(true);
  };

  const handleSaveClient = (e) => {
    e.preventDefault();
    const newClient = {
      id: (formData.name || "new-client")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      name: formData.name || "New Client Corp",
      sector: formData.sector || "Other",
      status: formData.status,
      since: "Jul 2026",
      website: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      initials: (formData.name || "NC")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2),
      logoUrl: "",
      contractTags: [],
      firstContactDate: "-",
      contractSignedDate: "-",
      ceoName: "-",
      ceoPhone: "-",
      primaryContactName: formData.contact || "No contact",
      primaryContactEmail: "-",
    };

    setClients([...clients, newClient]);
    setIsSidebarOpen(false);
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.sector.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === "All") return matchesSearch;
    return (
      matchesSearch &&
      client.status.toUpperCase() === activeFilter.toUpperCase()
    );
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVES":
        return styles.actives;
      case "PROSPECTION":
        return styles.prospection;
      case "BID":
        return styles.bid;
      case "INACTIVES":
        return styles.inactives;
      default:
        return "";
    }
  };

  const getStatusLabel = (status) => {
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
  };

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Under Contract", value: "ACTIVES" },
    { label: "Prospects", value: "PROSPECTION" },
    { label: "Bids", value: "BID" },
    { label: "Inactive", value: "INACTIVES" },
  ];

  return (
    <div className={styles.container}>
      {/* Header Limpo Padronizado */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Clients</h1>
          <span className={styles.totalBadge}>
            {clients.length} companies registered
          </span>
        </div>
        <button className={styles.addBtn} onClick={handleOpenChoice}>
          <Plus size={16} /> New Client
        </button>
      </header>

      {/* Search & Filter Bar */}
      <section className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search company or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          {filterOptions.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${activeFilter === f.value ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <p className={styles.resultsCount}>{filteredClients.length} clients found</p>

      {/* Clients Cards Grid */}
      <section className={styles.clientsGrid}>
        {filteredClients.map((client) => (
          <div key={client.id} className={styles.clientCard}>
            <div className={styles.cardHeader}>
              <div className={styles.avatarBox}>{client.initials}</div>
              <div className={styles.metaBox}>
                <h4
                  className={styles.clientNameLink}
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  {client.name}
                </h4>
                <span>{client.sector}</span>
              </div>
              <span
                className={`${styles.statusBadge} ${getStatusStyle(client.status)}`}
              >
                {getStatusLabel(client.status)}
              </span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoLine}>
                <span className={styles.label}>Client Since</span>
                <span className={styles.value}>{client.since}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>
                  <MapPin size={11} /> Location
                </span>
                <span className={styles.value}>
                  {client.city}, {client.state} - {client.country}
                </span>
              </div>
              {client.website && (
                <div className={styles.infoLine}>
                  <span className={styles.label}>Website</span>
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteLink}
                  >
                    Click here
                  </a>
                </div>
              )}
            </div>
            <div className={styles.cardFooter}>
              <div className={styles.contactArea}>
                <span className={styles.label}>Contact</span>
                <span className={styles.contactName}>{client.primaryContactName}</span>
              </div>
              <button className={styles.actionBtn}>
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Modal Selection */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Choose Creation Method</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.choiceGrid}>
              <button
                className={styles.choiceCard}
                onClick={() => handleChooseType("template")}
              >
                <FileText size={40} color="#FE5102" />
                <h4>Use Form Template</h4>
                <p>Pre-fill fields to accelerate creation.</p>
              </button>
              <button
                className={styles.choiceCard}
                onClick={() => handleChooseType("scratch")}
              >
                <Edit3 size={40} color="#0f172a" />
                <h4>Create From Scratch</h4>
                <p>Open a blank form to fill manually.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Drawer Form */}
      <div
        className={`${styles.drawer} ${isSidebarOpen ? styles.drawerOpen : ""}`}
      >
        <div className={styles.drawerHeader}>
          <h2>
            New Client ({formType === "template" ? "Template" : "Scratch"})
          </h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSaveClient} className={styles.drawerForm}>
          <div className={styles.inputGroup}>
            <label>Company Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Industry Sector</label>
            <input
              type="text"
              required
              value={formData.sector}
              onChange={(e) =>
                setFormData({ ...formData, sector: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Responsible Contact</label>
            <input
              type="text"
              required
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="ACTIVES">Under Contract</option>
              <option value="PROSPECTION">Prospects</option>
              <option value="BID">Bids</option>
              <option value="INACTIVES">Inactive</option>
            </select>
          </div>
          <button type="submit" className={styles.saveBtn}>
            Save Client
          </button>
        </form>
      </div>
    </div>
  );
}