// src/app/clients/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  X,
  FileText,
  Edit3,
  Upload,
  Trash2,
} from "lucide-react";
import { mockClients } from "./mockClients";
import styles from "./clients.module.css";

export default function ClientsPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formType, setFormType] = useState("");

  const CLIENTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const [clients, setClients] = useState(mockClients);

  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    website: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    status: "ACTIVES",
    logoFile: null,
    logoPreview: "",
    contacts: [{ name: "", phone: "", email: "" }],
  });

  const handleOpenChoice = () => setIsModalOpen(true);

  const emptyFormData = {
    name: "",
    sector: "",
    website: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    status: "ACTIVES",
    logoFile: null,
    logoPreview: "",
    contacts: [{ name: "", phone: "", email: "" }],
  };

  const handleChooseType = (type) => {
    setFormType(type);
    setIsModalOpen(false);

    if (type === "template") {
      setFormData({
        ...emptyFormData,
        name: "New Corp Template",
        sector: "Consulting",
        contacts: [{ name: "Sales Manager", phone: "", email: "" }],
        status: "PROSPECTION",
      });
    } else {
      setFormData(emptyFormData);
    }

    setIsSidebarOpen(true);
  };

  const handleSaveClient = (e) => {
    e.preventDefault();

    const validContacts = formData.contacts.filter((c) => c.name.trim());

    const newClient = {
      id: (formData.name || "new-client")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),

      name: formData.name || "New Client Corp",
      sector: formData.sector || "Other",
      status: formData.status,
      since: "Jul 2026",
      website: formData.website,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipcode: formData.zipcode,

      initials: (formData.name || "NC")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2),

      logoUrl: formData.logoPreview || "",
      contractTags: [],
      firstContactDate: "-",
      contractSignedDate: "-",
      ceoName: "-",
      ceoPhone: "-",

      contacts:
        validContacts.length > 0
          ? validContacts.map((c, i) => ({
              id: `c${Date.now()}-${i}`,
              name: c.name,
              phone: c.phone,
              email: c.email,
              role: "Contact",
            }))
          : [],

      primaryContactName: validContacts[0]?.name || "No contact",
      primaryContactEmail: validContacts[0]?.email || "-",
    };

    setClients([...clients, newClient]);
    setIsSidebarOpen(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData({
      ...formData,
      logoFile: file,
      logoPreview: previewUrl,
    });
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...formData.contacts];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      contacts: updated,
    });
  };

  const handleAddContact = () => {
    setFormData({
      ...formData,
      contacts: [
        ...formData.contacts,
        {
          name: "",
          phone: "",
          email: "",
        },
      ],
    });
  };

  const handleRemoveContact = (index) => {
    if (formData.contacts.length === 1) return;

    setFormData({
      ...formData,
      contacts: formData.contacts.filter((_, i) => i !== index),
    });
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.sector.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "All") {
      return matchesSearch;
    }

    return (
      matchesSearch &&
      client.status.toUpperCase() === activeFilter.toUpperCase()
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / CLIENTS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * CLIENTS_PER_PAGE;

  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + CLIENTS_PER_PAGE
  );

  const rangeStart = filteredClients.length === 0 ? 0 : startIndex + 1;

  const rangeEnd = Math.min(
    startIndex + CLIENTS_PER_PAGE,
    filteredClients.length
  );

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
    {
      label: "All",
      value: "All",
    },
    {
      label: "Under Contract",
      value: "ACTIVES",
    },
    {
      label: "Prospects",
      value: "PROSPECTION",
    },
    {
      label: "Bids",
      value: "BID",
    },
    {
      label: "Inactive",
      value: "INACTIVES",
    },
  ];

  return (
    <div className={`${styles.container} ${styles.containerFullHeight}`}>
      {/* Header Limpo Padronizado */}
          <header className={styles.header}>
        <div>
          <h1>Clients</h1>
          <div className={styles.accentLine}></div>
        </div>
        <button className={styles.addBtn} onClick={handleOpenChoice}>
          <Plus size={16} />
          New Client
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          {filterOptions.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${
                activeFilter === f.value ? styles.filterBtnActive : ""
              }`}
              onClick={() => {
                setActiveFilter(f.value);
                setCurrentPage(1);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

            <p className={styles.resultsCount}>
        Showing {rangeStart} to {rangeEnd} of {filteredClients.length}
        {" "}
        <span className={styles.totalRegisteredNote}>
          ({clients.length} total registered)
        </span>
      </p>

      {/* Clients List */}
      <section className={styles.clientsTableWrapper}>
        <table className={styles.clientsTable}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Sector</th>
              <th>Status</th>
              <th>Client Since</th>
              <th>Location</th>
              <th>Website</th>
              <th>Contact</th>
            </tr>
          </thead>

          <tbody>
            {paginatedClients.length > 0 ? (
              paginatedClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div
                      className={styles.companyCell}
                      onClick={() => router.push(`/clients/${client.id}`)}
                    >
                      {client.logoUrl ? (
                        <img
                          src={client.logoUrl}
                          alt={client.name}
                          className={styles.avatarImg}
                        />
                      ) : (
                        <div className={styles.avatarBox}>
                          {client.initials}
                        </div>
                      )}

                      <span className={styles.clientNameLink}>
                        {client.name}
                      </span>
                    </div>
                  </td>

                  <td className={styles.tableCellMuted}>
                    {client.sector}
                  </td>

                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusStyle(
                        client.status
                      )}`}
                    >
                      {getStatusLabel(client.status)}
                    </span>
                  </td>

                  <td className={styles.tableCellMuted}>
                    {client.since}
                  </td>

                  <td className={styles.tableCellMuted}>
                    {client.city}, {client.state} - {client.country}
                  </td>

                  <td>
                    {client.website ? (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.websiteLink}
                      >
                        Click here
                      </a>
                    ) : (
                      <span className={styles.tableCellMuted}>-</span>
                    )}
                  </td>

                  <td className={styles.tableCellMuted}>
                    {client.contacts[0]?.name || "No contact"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyClientsRow}>
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.paginationFooter}>
          <button
            className={styles.pageNavBtn}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`${styles.pageNumberBtn} ${
                    page === safeCurrentPage
                      ? styles.pageNumberBtnActive
                      : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            className={styles.pageNavBtn}
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={safeCurrentPage === totalPages}
          >
            Next
          </button>
        </div>
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
        className={`${styles.drawer} ${
          isSidebarOpen ? styles.drawerOpen : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <h2>
            New Client (
            {formType === "template" ? "Template" : "Scratch"})
          </h2>

          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveClient} className={styles.drawerForm}>
          <div className={styles.inputGroup}>
            <label>Company Logo</label>

            <div className={styles.logoUploadRow}>
              <div className={styles.logoPreview}>
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt="Logo preview"
                  />
                ) : (
                  <span>No logo</span>
                )}
              </div>

              <label className={styles.uploadLogoBtn}>
                <Upload size={13} />
                Upload Logo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Company Name</label>

            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
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
                setFormData({
                  ...formData,
                  sector: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Website</label>

            <input
              type="text"
              placeholder="https://..."
              value={formData.website}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  website: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Location</label>

            <div className={styles.locationGrid}>
              <div className={styles.locationField}>
                <input
                  type="text"
                  placeholder=" "
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                />

                <span className={styles.locationFieldLabel}>
                  City
                </span>
              </div>

              <div className={styles.locationField}>
                <input
                  type="text"
                  placeholder=" "
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                    })
                  }
                />

                <span className={styles.locationFieldLabel}>
                  State
                </span>
              </div>

              <div className={styles.locationField}>
                <input
                  type="text"
                  placeholder=" "
                  value={formData.zipcode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      zipcode: e.target.value,
                    })
                  }
                />

                <span className={styles.locationFieldLabel}>
                  Zip Code
                </span>
              </div>

              <div className={styles.locationField}>
                <input
                  type="text"
                  placeholder=" "
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      country: e.target.value,
                    })
                  }
                />

                <span className={styles.locationFieldLabel}>
                  Country
                </span>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Status</label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
            >
              <option value="ACTIVES">
                Under Contract
              </option>

              <option value="PROSPECTION">
                Prospects
              </option>

              <option value="BID">
                Bids
              </option>

              <option value="INACTIVES">
                Inactive
              </option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Responsible Contacts</label>

            {formData.contacts.map((contact, index) => (
              <div
                key={index}
                className={styles.contactCard}
              >
                {formData.contacts.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeContactBtn}
                    onClick={() =>
                      handleRemoveContact(index)
                    }
                  >
                    <Trash2 size={13} />
                  </button>
                )}

                <span className={styles.contactFieldLabel}>
                  Name
                </span>

                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) =>
                    handleContactChange(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                <div className={styles.contactSplitRow}>
                  <div>
                    <span
                      className={styles.contactFieldLabel}
                    >
                      Phone
                    </span>

                    <input
                      type="text"
                      value={contact.phone}
                      onChange={(e) =>
                        handleContactChange(
                          index,
                          "phone",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <span
                      className={styles.contactFieldLabel}
                    >
                      Email
                    </span>

                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) =>
                        handleContactChange(
                          index,
                          "email",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className={styles.addContactBtn}
              onClick={handleAddContact}
            >
              + Add Another Contact
            </button>
          </div>

          <button
            type="submit"
            className={styles.saveBtn}
          >
            Save Client
          </button>
        </form>
      </div>
    </div>
  );
}