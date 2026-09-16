"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Briefcase,
  Search,
  Download,
  MoreVertical,
  X,
  Upload,
  Pencil,
  Camera,
} from "lucide-react";
import { mockClients } from "../mockClients";
import { mockJobs } from "../../jobs-board/mockJobs";
import styles from "./clientProfile.module.css";

const TABS = ["Summary", "Jobs", "Meetings", "Notes", "Documents", "History"];

const MEETING_SUBJECTS = [
  "Contract",
  "Sales",
  "Onboarding",
  "Feedback",
  "General",
];

const DOCUMENT_TYPES = [
  "Legal Forms",
  "Contract",
  "Time Sheets",
  "Supporting Documents",
  "Confidential",
  "Others",
];

const FORMAT_OPTIONS = ["Full Time", "Part Time"];
const CURRENCY_OPTIONS = ["BRL", "USD"];
const FREQUENCY_OPTIONS = ["Hourly", "Monthly", "Annual"];

const DOCUMENT_TYPE_COLORS = {
  "Legal Forms": { color: "#0369a1", bg: "#e0f2fe" },
  Contract: { color: "#6d28d9", bg: "#ede9fe" },
  "Time Sheets": { color: "#1d4ed8", bg: "#dbeafe" },
  "Supporting Documents": { color: "#15803d", bg: "#dcfce7" },
  Confidential: { color: "#dc2626", bg: "#fee2e2" },
  Others: { color: "#475569", bg: "#f1f5f9" },
};

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

const STAGE_META = {
  new: { label: "New", color: "#64748b" },
  process: { label: "Recruiting", color: "#1d4ed8" },
  submitted: { label: "Submitted", color: "#b45309" },
  client_interview: { label: "Client Interview", color: "#c2410c" },
  onboarding: { label: "Offer & Onboarding", color: "#7c3aed" },
  concluded: { label: "Concluded", color: "#15803d" },
};

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();

  const emptyJobForm = {
    positionName: "",
    city: "",
    state: "",
    country: "",
    numberOfPositions: "1",
    format: "Full Time",
    salaryMin: "",
    salaryMax: "",
    currency: "BRL",
    frequency: "Monthly",
    description: "",
  };

  const emptyMeetingForm = {
    title: "",
    date: "",
    participants: "",
    createdBy: "",
    subject: "General",
    notes: "",
    file: null,
  };

  const [activeTab, setActiveTab] = useState("Summary");

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteSearch, setNoteSearch] = useState("");

  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: "",
    body: "",
  });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [openNoteMenuId, setOpenNoteMenuId] = useState(null);

  const [client, setClient] = useState(() =>
    mockClients.find((c) => c.id === params.id),
  );

  const [meetings, setMeetings] = useState(client ? client.meetings : []);
  const [meetingSearch, setMeetingSearch] = useState("");
  const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
  const [openMeetingMenuId, setOpenMeetingMenuId] = useState(null);
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [meetingForm, setMeetingForm] = useState(emptyMeetingForm);

  const [documents, setDocuments] = useState(client ? client.documents : []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
  const [openDocMenuId, setOpenDocMenuId] = useState(null);
  const [editingDocId, setEditingDocId] = useState(null);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [openContactMenuId, setOpenContactMenuId] = useState(null);
  const [editingContactId, setEditingContactId] = useState(null);

  const [contactForm, setContactForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  });

  const [clientJobsState, setClientJobsState] = useState(() =>
    mockJobs.filter((j) => j.clientId === params.id),
  );

  const [openJobMenuId, setOpenJobMenuId] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [isJobDrawerOpen, setIsJobDrawerOpen] = useState(false);

  const [jobForm, setJobForm] = useState(emptyJobForm);

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const meetingFileInputRef = useRef(null);

  if (!client) {
    return (
      <div className={styles.container}>
        <p>Client not found.</p>
      </div>
    );
  }

  const statusStyle = getStatusStyle(client.status);

  const clientJobs = clientJobsState;

  const selectedNote =
    client.notes.find((n) => n.id === selectedNoteId) ||
    client.notes[0] ||
    null;

  const filteredNotes = client.notes.filter((n) =>
    n.title.toLowerCase().includes(noteSearch.toLowerCase()),
  );

  const filteredMeetings = meetings.filter((m) => {
    const term = meetingSearch.toLowerCase();

    return (
      m.title.toLowerCase().includes(term) ||
      m.participants.toLowerCase().includes(term) ||
      m.createdBy.toLowerCase().includes(term) ||
      m.subject.toLowerCase().includes(term) ||
      m.notes.toLowerCase().includes(term)
    );
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setClient({
      ...client,
      logoUrl: previewUrl,
    });
  };

  const handleSaveMeeting = (e) => {
    e.preventDefault();

    if (editingMeetingId) {
      setMeetings(
        meetings.map((m) =>
          m.id === editingMeetingId
            ? {
                ...m,
                title: meetingForm.title || "Untitled Meeting",
                date: meetingForm.date || "-",
                participants: meetingForm.participants || "-",
                createdBy: meetingForm.createdBy || "-",
                subject: meetingForm.subject,
                notes: meetingForm.notes || "-",
                fileUrl: meetingForm.file
                  ? URL.createObjectURL(meetingForm.file)
                  : m.fileUrl,
              }
            : m,
        ),
      );
    } else {
      const newMeeting = {
        id: `m${meetings.length + 1}-${Date.now()}`,
        title: meetingForm.title || "Untitled Meeting",
        date: meetingForm.date || "-",
        participants: meetingForm.participants || "-",
        createdBy: meetingForm.createdBy || "-",
        subject: meetingForm.subject,
        notes: meetingForm.notes || "-",
        fileUrl: meetingForm.file
          ? URL.createObjectURL(meetingForm.file)
          : "#",
      };

      setMeetings([newMeeting, ...meetings]);
    }

    setMeetingForm(emptyMeetingForm);
    setEditingMeetingId(null);

    if (meetingFileInputRef.current) {
      meetingFileInputRef.current.value = "";
    }

    setIsMeetingDrawerOpen(false);
  };

  const handleOpenLogMeeting = () => {
    setMeetingForm(emptyMeetingForm);
    setEditingMeetingId(null);
    setIsMeetingDrawerOpen(true);
  };

  const handleEditMeeting = (meeting) => {
    setMeetingForm({
      title: meeting.title,
      date: meeting.date,
      participants: meeting.participants,
      createdBy: meeting.createdBy,
      subject: meeting.subject,
      notes: meeting.notes,
      file: null,
    });

    setEditingMeetingId(meeting.id);
    setOpenMeetingMenuId(null);
    setIsMeetingDrawerOpen(true);
  };

  const handleDeleteMeeting = (meetingId) => {
    setMeetings(meetings.filter((m) => m.id !== meetingId));
    setOpenMeetingMenuId(null);
  };

  const handleUploadDocument = () => {
    if (!selectedFile) return;

    const newDocument = {
      id: `d${documents.length + 1}`,
      name: selectedFile.name,
      type: documentType,
      createdBy: "Bryan Santana",
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setDocuments([newDocument, ...documents]);
    setSelectedFile(null);
    setDocumentType(DOCUMENT_TYPES[0]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditDocument = (doc) => {
    setSelectedFile(null);
    setDocumentType(doc.type);
    setEditingDocId(doc.id);
    setOpenDocMenuId(null);
  };

  const handleSaveDocumentEdit = () => {
    setDocuments(
      documents.map((d) =>
        d.id === editingDocId
          ? {
              ...d,
              type: documentType,
            }
          : d,
      ),
    );

    setEditingDocId(null);
    setDocumentType(DOCUMENT_TYPES[0]);
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(documents.filter((d) => d.id !== docId));
    setOpenDocMenuId(null);
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: client.name,
      sector: client.sector,
      website: client.website || "",
      companyEmail: client.companyEmail || "",
      companyPhone: client.companyPhone || "",
      address: client.address || "",
      city: client.city || "",
      state: client.state || "",
      zipcode: client.zipcode || "",
      country: client.country || "",
      status: client.status,
    });

    setIsEditDrawerOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    setClient({
      ...client,
      ...editForm,
    });

    setIsEditDrawerOpen(false);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();

    if (!contactForm.name.trim()) return;

    if (editingContactId) {
      setClient({
        ...client,
        contacts: client.contacts.map((c) =>
          c.id === editingContactId
            ? {
                ...c,
                name: contactForm.name,
                role: contactForm.role || "Contact",
                email: contactForm.email,
                phone: contactForm.phone,
              }
            : c,
        ),
      });
    } else {
      const newContact = {
        id: `c${client.contacts.length + 1}-${Date.now()}`,
        name: contactForm.name,
        role: contactForm.role || "Contact",
        email: contactForm.email,
        phone: contactForm.phone,
      };

      setClient({
        ...client,
        contacts: [...client.contacts, newContact],
      });
    }

    setContactForm({
      name: "",
      role: "",
      email: "",
      phone: "",
    });

    setEditingContactId(null);
    setIsContactDrawerOpen(false);
  };

  const handleOpenAddContact = () => {
    setContactForm({
      name: "",
      role: "",
      email: "",
      phone: "",
    });

    setEditingContactId(null);
    setIsContactDrawerOpen(true);
  };

  const handleEditContact = (contact) => {
    setContactForm({
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
    });

    setEditingContactId(contact.id);
    setOpenContactMenuId(null);
    setIsContactDrawerOpen(true);
  };

  const handleDeleteContact = (contactId) => {
    setClient({
      ...client,
      contacts: client.contacts.filter((c) => c.id !== contactId),
    });

    setOpenContactMenuId(null);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();

    if (editingJobId) {
      setClientJobsState(
        clientJobsState.map((j) =>
          j.id === editingJobId
            ? {
                ...j,
                title: jobForm.positionName || "New Position",
                city: jobForm.city,
                state: jobForm.state,
                country: jobForm.country,
                salaryMin: Number(jobForm.salaryMin) || 0,
                salaryMax: Number(jobForm.salaryMax) || 0,
                employmentType: jobForm.format,
                currency: jobForm.currency,
                frequency: jobForm.frequency,
                openings: Number(jobForm.numberOfPositions) || 1,
                description: jobForm.description,
              }
            : j,
        ),
      );
    } else {
      const newJob = {
        id: `${(jobForm.positionName || "new-job")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        title: jobForm.positionName || "New Position",
        company: client.name,
        clientId: client.id,
        stage: "new",
        clientStatus: "BPO",
        isHold: false,
        initial: client.initials,
        logoColor: "0c4a6e",
        logoUrl: client.logoUrl || "",
        city: jobForm.city,
        state: jobForm.state,
        country: jobForm.country,
        salaryMin: Number(jobForm.salaryMin) || 0,
        salaryMax: Number(jobForm.salaryMax) || 0,
        status: "ACTIVE",
        employmentType: jobForm.format,
        workType: "Hybrid",
        currency: jobForm.currency,
        frequency: jobForm.frequency,
        openings: Number(jobForm.numberOfPositions) || 1,
        priority: "Standard",
        openDate: new Date().toLocaleDateString("pt-BR"),
        closeDate: null,
        dashboardNote: "",
        isReplacement: false,
        description: jobForm.description,
      };

      setClientJobsState([...clientJobsState, newJob]);
    }

    setJobForm(emptyJobForm);
    setEditingJobId(null);
    setIsJobDrawerOpen(false);
  };

  const handleOpenCreateJob = () => {
    setJobForm(emptyJobForm);
    setEditingJobId(null);
    setIsJobDrawerOpen(true);
  };

  const handleEditJob = (job) => {
    setJobForm({
      positionName: job.title,
      city: job.city || "",
      state: job.state || "",
      country: job.country || "",
      numberOfPositions: String(job.openings || 1),
      format: job.employmentType || "Full Time",
      salaryMin: String(job.salaryMin || ""),
      salaryMax: String(job.salaryMax || ""),
      currency: job.currency || "BRL",
      frequency: job.frequency || "Monthly",
      description: job.description || "",
    });

    setEditingJobId(job.id);
    setOpenJobMenuId(null);
    setIsJobDrawerOpen(true);
  };

  const handleDeleteJob = (jobId) => {
    setClientJobsState(
      clientJobsState.filter((j) => j.id !== jobId),
    );

    setOpenJobMenuId(null);
  };

  const handleOpenNewNote = () => {
    setNoteForm({
      title: "",
      body: "",
    });

    setEditingNoteId(null);
    setIsNoteDrawerOpen(true);
  };

  const handleEditNote = (note) => {
    setNoteForm({
      title: note.title,
      body: note.body,
    });

    setEditingNoteId(note.id);
    setOpenNoteMenuId(null);
    setIsNoteDrawerOpen(true);
  };

  const handleDeleteNote = (noteId) => {
    setClient({
      ...client,
      notes: client.notes.filter((n) => n.id !== noteId),
    });

    setOpenNoteMenuId(null);

    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  };

  const handleSaveNote = (e) => {
    e.preventDefault();

    if (!noteForm.title.trim()) return;

    const today = new Date().toLocaleDateString("pt-BR");

    if (editingNoteId) {
      setClient({
        ...client,
        notes: client.notes.map((n) =>
          n.id === editingNoteId
            ? {
                ...n,
                title: noteForm.title,
                body: noteForm.body,
                updatedBy: "Bryan Santana",
                updatedAt: today,
              }
            : n,
        ),
      });
    } else {
      const newNote = {
        id: `n${client.notes.length + 1}-${Date.now()}`,
        title: noteForm.title,
        body: noteForm.body,
        createdBy: "Bryan Santana",
        createdAt: today,
        updatedBy: null,
        updatedAt: null,
      };

      setClient({
        ...client,
        notes: [newNote, ...client.notes],
      });

      setSelectedNoteId(newNote.id);
    }

    setNoteForm({
      title: "",
      body: "",
    });

    setEditingNoteId(null);
    setIsNoteDrawerOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <button
              className={styles.backBtn}
              onClick={() => router.push("/clients")}
            >
              <ArrowLeft size={16} />
            </button>

            <div
              className={styles.logoUploadWrapper}
              onClick={() => logoInputRef.current?.click()}
            >
              {client.logoUrl ? (
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className={styles.clientLogo}
                />
              ) : (
                <div className={styles.clientLogoFallback}>
                  {client.initials}
                </div>
              )}

              <div className={styles.logoOverlay}>
                <Camera size={16} color="#fff" />
              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: "none" }}
              />
            </div>

            <div>
              <div className={styles.titleRow}>
                <h1>{client.name}</h1>

                <span
                  className={styles.statusBadge}
                  style={{
                    color: statusStyle.color,
                    backgroundColor: statusStyle.bg,
                  }}
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

          {activeTab === "Jobs" ? (
            <button
              className={styles.editBtn}
              onClick={handleOpenCreateJob}
            >
              <Plus size={14} /> Create Job
            </button>
          ) : (
            <button
              className={styles.editBtn}
              onClick={handleOpenEdit}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className={styles.tabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
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
              <h2>Company Information</h2>

              <button
                className={styles.smallEditBtn}
                onClick={handleOpenEdit}
              >
                Edit Profile
              </button>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoLine}>
                <span className={styles.label}>Industry</span>
                <span className={styles.value}>
                  {client.sector}
                </span>
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
                <span className={styles.label}>
                  Company Email
                </span>

                <span className={styles.value}>
                  {client.companyEmail}
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>
                  Company Phone
                </span>

                <span className={styles.value}>
                  {client.companyPhone}
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>Address</span>
                <span className={styles.value}>
                  {client.address}
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>City</span>
                <span className={styles.value}>
                  {client.city}
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>State</span>
                <span className={styles.value}>
                  {client.state}
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>Zipcode</span>
                <span className={styles.value}>
                  {client.zipcode}
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>Country</span>
                <span className={styles.value}>
                  {client.country}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.sideColumn}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Account Details</h2>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoLine}>
                  <span className={styles.label}>
                    Client ID
                  </span>

                  <span className={styles.value}>
                    {client.id}
                  </span>
                </div>

                <div className={styles.infoLine}>
                  <span className={styles.label}>
                    Contract Signed
                  </span>

                  <span className={styles.value}>
                    {client.contractSignedDate}
                  </span>
                </div>

                <div className={styles.infoLine}>
                  <span className={styles.label}>
                    Created
                  </span>

                  <span className={styles.value}>
                    {client.createdAt}
                  </span>
                </div>

                <div className={styles.infoLine}>
                  <span className={styles.label}>
                    Updated
                  </span>

                  <span className={styles.value}>
                    {client.updatedAt}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Contacts</h2>

                <button
                  className={styles.addContactBtn}
                  onClick={handleOpenAddContact}
                >
                  <Plus size={13} /> Add
                </button>
              </div>

              <div className={styles.contactsList}>
                {client.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={styles.contactCard}
                  >
                    <div className={styles.contactCardTop}>
                      <span className={styles.contactName}>
                        {contact.name}
                      </span>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span className={styles.contactRole}>
                          {contact.role}
                        </span>

                        <div className={styles.cardMenuWrapper}>
                          <button
                            className={styles.cardMenuBtn}
                            onClick={() =>
                              setOpenContactMenuId(
                                openContactMenuId === contact.id
                                  ? null
                                  : contact.id,
                              )
                            }
                          >
                            <MoreVertical size={13} />
                          </button>

                          {openContactMenuId === contact.id && (
                            <div className={styles.cardMenuDropdown}>
                              <button
                                onClick={() =>
                                  handleEditContact(contact)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className={styles.cardMenuDelete}
                                onClick={() =>
                                  handleDeleteContact(contact.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className={styles.contactDetail}>
                      {contact.email}
                    </span>

                    <span className={styles.contactDetail}>
                      {contact.phone}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "Jobs" ? (
        <div className={styles.jobsGrid}>
          {clientJobs.length > 0 ? (
            clientJobs.map((job) => {
              const stage = STAGE_META[job.stage] || {
                label: job.stage,
                color: "#64748b",
              };

              return (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.jobCardHeader}>
                    <div className={styles.jobIconBox}>
                      <Briefcase size={16} />
                    </div>

                    <div className={styles.jobCardInfo}>
                      <h4>{job.title}</h4>
                      <span>{client.name}</span>
                    </div>

                    <span
                      className={styles.jobStageBadge}
                      style={{
                        color: stage.color,
                        backgroundColor: `${stage.color}1A`,
                      }}
                    >
                      {stage.label.toUpperCase()}
                    </span>

                    <div className={styles.cardMenuWrapper}>
                      <button
                        className={styles.cardMenuBtn}
                        onClick={() =>
                          setOpenJobMenuId(
                            openJobMenuId === job.id
                              ? null
                              : job.id,
                          )
                        }
                      >
                        <MoreVertical size={14} />
                      </button>

                      {openJobMenuId === job.id && (
                        <div className={styles.cardMenuDropdown}>
                          <button
                            onClick={() => handleEditJob(job)}
                          >
                            Edit
                          </button>

                          <button
                            className={styles.cardMenuDelete}
                            onClick={() =>
                              handleDeleteJob(job.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.jobCardBody}>
                    <div className={styles.infoLine}>
                      <span className={styles.label}>
                        Location
                      </span>

                      <span className={styles.value}>
                        {job.city}, {job.state}
                      </span>
                    </div>

                    <div className={styles.infoLine}>
                      <span className={styles.label}>
                        Salary
                      </span>

                      <span className={styles.value}>
                        R$ {job.salaryMin.toLocaleString()} -{" "}
                        {job.salaryMax.toLocaleString()}
                      </span>
                    </div>

                    <div className={styles.infoLine}>
                      <span className={styles.label}>
                        Type
                      </span>

                      <span className={styles.value}>
                        {job.employmentType}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.emptyJobs}>
              No jobs registered for this client yet.
            </p>
          )}
        </div>
      ) : activeTab === "Meetings" ? (
        <>
          <div className={styles.meetingsToolbarRow}>
            <div className={styles.meetingsSearchWrapper}>
              <Search
                size={17}
                className={styles.meetingsSearchIcon}
              />

              <input
                type="text"
                placeholder="Search meetings..."
                value={meetingSearch}
                onChange={(e) =>
                  setMeetingSearch(e.target.value)
                }
                className={styles.meetingsSearchInput}
              />
            </div>

            <button
              className={styles.logMeetingBtn}
              onClick={handleOpenLogMeeting}
            >
              <Plus size={15} /> Log Meeting
            </button>
          </div>

          <p className={styles.resultsCount}>
            {filteredMeetings.length} meetings found
          </p>

          <div className={styles.meetingsTableWrapper}>
            <table className={styles.meetingsTable}>
              <colgroup>
                <col style={{ width: "100px" }} />
                <col style={{ width: "220px" }} />
                <col style={{ width: "200px" }} />
                <col style={{ width: "150px" }} />
                <col style={{ width: "140px" }} />
                <col />
                <col style={{ width: "70px" }} />
              </colgroup>

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Meeting Title / File</th>
                  <th>Participants</th>
                  <th>Created By</th>
                  <th>Subject</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredMeetings.length > 0 ? (
                  filteredMeetings.map((m) => (
                    <tr key={m.id}>
                      <td className={styles.meetingCellTruncate}>
                        {m.date}
                      </td>

                      <td
                        className={styles.meetingCellTruncate}
                        title={m.title}
                      >
                        <span className={styles.meetingTitleText}>
                          {m.title}
                        </span>
                      </td>

                      <td
                        className={styles.meetingCellTruncate}
                        title={m.participants}
                      >
                        {m.participants}
                      </td>

                      <td
                        className={styles.meetingCellTruncate}
                        title={m.createdBy}
                      >
                        {m.createdBy}
                      </td>

                      <td className={styles.meetingCellTruncate}>
                        <span className={styles.subjectBadge}>
                          {m.subject}
                        </span>
                      </td>

                      <td
                        className={`${styles.meetingCellTruncate} ${styles.meetingNotes}`}
                        title={m.notes}
                      >
                        {m.notes}
                      </td>

                      <td className={styles.meetingActionsCell}>
                        <div className={styles.cardMenuWrapper}>
                          <button
                            className={styles.meetingActionIcon}
                            title="More options"
                            onClick={() =>
                              setOpenMeetingMenuId(
                                openMeetingMenuId === m.id
                                  ? null
                                  : m.id,
                              )
                            }
                          >
                            <MoreVertical size={14} />
                          </button>

                          {openMeetingMenuId === m.id && (
                            <div
                              className={styles.cardMenuDropdown}
                              style={{
                                right: 0,
                                left: "auto",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleEditMeeting(m)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className={styles.cardMenuDelete}
                                onClick={() =>
                                  handleDeleteMeeting(m.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className={styles.emptyMeetings}
                    >
                      No meetings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            className={`${styles.drawer} ${
              isMeetingDrawerOpen
                ? styles.drawerOpen
                : ""
            }`}
          >
            <div className={styles.drawerHeader}>
              <h2>
                {editingMeetingId
                  ? "Edit Meeting"
                  : "Log Meeting"}
              </h2>

              <button
                onClick={() =>
                  setIsMeetingDrawerOpen(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveMeeting}
              className={styles.drawerForm}
            >
              <div className={styles.inputGroup}>
                <label>Meeting Title / File</label>

                <input
                  type="text"
                  required
                  value={meetingForm.title}
                  onChange={(e) =>
                    setMeetingForm({
                      ...meetingForm,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Date</label>

                <input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  required
                  value={meetingForm.date}
                  onChange={(e) =>
                    setMeetingForm({
                      ...meetingForm,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Participants</label>

                <input
                  type="text"
                  placeholder="Name 1, Name 2..."
                  value={meetingForm.participants}
                  onChange={(e) =>
                    setMeetingForm({
                      ...meetingForm,
                      participants: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Created By</label>

                <input
                  type="text"
                  value={meetingForm.createdBy}
                  onChange={(e) =>
                    setMeetingForm({
                      ...meetingForm,
                      createdBy: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Subject</label>

                <select
                  value={meetingForm.subject}
                  onChange={(e) =>
                    setMeetingForm({
                      ...meetingForm,
                      subject: e.target.value,
                    })
                  }
                >
                  {MEETING_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>
                  Attachment (optional)
                </label>

                <div className={styles.fileChooseRow}>
                  <button
                    type="button"
                    className={styles.chooseFileBtn}
                    onClick={() =>
                      meetingFileInputRef.current?.click()
                    }
                  >
                    Choose File
                  </button>

                  <span className={styles.fileNameText}>
                    {meetingForm.file
                      ? meetingForm.file.name
                      : editingMeetingId
                        ? "Keep current attachment"
                        : "No file chosen"}
                  </span>

                  <input
                    ref={meetingFileInputRef}
                    type="file"
                    className={styles.hiddenFileInput}
                    onChange={(e) =>
                      setMeetingForm({
                        ...meetingForm,
                        file:
                          e.target.files?.[0] ||
                          null,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Notes</label>

                <textarea
                  rows={4}
                  value={meetingForm.notes}
                  onChange={(e) =>
                    setMeetingForm({
                      ...meetingForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className={styles.saveBtn}
              >
                {editingMeetingId
                  ? "Save Changes"
                  : "Save Meeting"}
              </button>
            </form>
          </div>
        </>
      ) : activeTab === "Notes" ? (
        <div className={styles.notesLayout}>
          <div className={styles.notesHeader}>
            <div className={styles.notesSearchWrapper}>
              <Search
                size={17}
                className={styles.notesSearchIcon}
              />

              <input
                type="text"
                placeholder="Search notes..."
                value={noteSearch}
                onChange={(e) =>
                  setNoteSearch(e.target.value)
                }
                className={styles.notesSearchInput}
              />
            </div>

            <button
              className={styles.newNoteBtn}
              onClick={handleOpenNewNote}
            >
              <Plus size={15} /> New Note
            </button>
          </div>

          <div className={styles.notesGrid}>
            <div className={styles.notesList}>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`${styles.noteListItem} ${
                      selectedNote?.id === note.id
                        ? styles.noteListItemActive
                        : ""
                    }`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() =>
                      setSelectedNoteId(note.id)
                    }
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {note.title}
                    </span>

                    <div
                      className={styles.cardMenuWrapper}
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      <button
                        className={styles.cardMenuBtn}
                        onClick={() =>
                          setOpenNoteMenuId(
                            openNoteMenuId === note.id
                              ? null
                              : note.id,
                          )
                        }
                      >
                        <MoreVertical size={13} />
                      </button>

                      {openNoteMenuId === note.id && (
                        <div className={styles.cardMenuDropdown}>
                          <button
                            onClick={() =>
                              handleEditNote(note)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className={styles.cardMenuDelete}
                            onClick={() =>
                              handleDeleteNote(note.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyNotesList}>
                  {noteSearch
                    ? "No notes match your search."
                    : "No notes yet."}
                </div>
              )}
            </div>

            <div className={styles.noteDetail}>
              {selectedNote ? (
                <>
                  <h3 className={styles.noteDetailTitle}>
                    {selectedNote.title}
                  </h3>

                  <p className={styles.noteDetailBody}>
                    {selectedNote.body}
                  </p>

                  <div className={styles.noteDetailFooter}>
                    <span>
                      Created by{" "}
                      {selectedNote.createdBy} on{" "}
                      {selectedNote.createdAt}
                    </span>

                    {selectedNote.updatedBy && (
                      <span>
                        Updated by{" "}
                        {selectedNote.updatedBy} on{" "}
                        {selectedNote.updatedAt}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.emptyNoteDetail}>
                  Select a note on the left to
                  view its content.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === "Documents" ? (
        <>
          <div className={styles.uploadCard}>
            <h3 className={styles.uploadCardTitle}>
              {editingDocId
                ? "Edit Document Type"
                : "Upload New Document"}
            </h3>

            <div className={styles.uploadRow}>
              {!editingDocId && (
                <div className={styles.uploadField}>
                  <span className={styles.uploadLabel}>
                    Upload a File
                  </span>

                  <div className={styles.fileChooseRow}>
                    <button
                      type="button"
                      className={styles.chooseFileBtn}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      Choose File
                    </button>

                    <span className={styles.fileNameText}>
                      {selectedFile
                        ? selectedFile.name
                        : "No file chosen"}
                    </span>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className={styles.hiddenFileInput}
                      onChange={(e) =>
                        setSelectedFile(
                          e.target.files?.[0] ||
                            null,
                        )
                      }
                    />
                  </div>
                </div>
              )}

              <div className={styles.uploadField}>
                <span className={styles.uploadLabel}>
                  Document Type
                </span>

                <select
                  className={styles.documentTypeSelect}
                  value={documentType}
                  onChange={(e) =>
                    setDocumentType(
                      e.target.value,
                    )
                  }
                >
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {editingDocId ? (
                <>
                  <button
                    type="button"
                    className={styles.uploadBtn}
                    onClick={handleSaveDocumentEdit}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className={styles.chooseFileBtn}
                    onClick={() => {
                      setEditingDocId(null);
                      setDocumentType(
                        DOCUMENT_TYPES[0],
                      );
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={handleUploadDocument}
                  disabled={!selectedFile}
                >
                  <Upload size={14} /> Upload
                </button>
              )}
            </div>
          </div>

          <p className={styles.resultsCount}>
            {documents.length} documents
          </p>

          <div className={styles.documentsTableWrapper}>
            <table className={styles.documentsTable}>
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Document Type</th>
                  <th>Created By</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc) => {
                    const typeStyle =
                      DOCUMENT_TYPE_COLORS[
                        doc.type
                      ] ||
                      DOCUMENT_TYPE_COLORS.Others;

                    return (
                      <tr key={doc.id}>
                        <td className={styles.documentNameCell}>
                          {doc.name}
                        </td>

                        <td>
                          <span
                            className={styles.documentTypeBadge}
                            style={{
                              color: typeStyle.color,
                              backgroundColor: typeStyle.bg,
                            }}
                          >
                            {doc.type}
                          </span>
                        </td>

                        <td>{doc.createdBy}</td>

                        <td className={styles.documentDateCell}>
                          {doc.date}
                        </td>

                        <td className={styles.documentActionsCell}>
                          <div className={styles.cardMenuWrapper}>
                            <button
                              className={styles.meetingActionIcon}
                              title="More options"
                              onClick={() =>
                                setOpenDocMenuId(
                                  openDocMenuId === doc.id
                                    ? null
                                    : doc.id,
                                )
                              }
                            >
                              <MoreVertical size={14} />
                            </button>

                            {openDocMenuId === doc.id && (
                              <div
                                className={styles.cardMenuDropdown}
                                style={{
                                  right: 0,
                                  left: "auto",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    handleEditDocument(doc)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className={styles.cardMenuDelete}
                                  onClick={() =>
                                    handleDeleteDocument(doc.id)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className={styles.emptyMeetings}
                    >
                      No documents uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : activeTab === "History" ? (
        <div className={styles.historyCard}>
          {client.history.length > 0 ? (
            client.history.map((entry) => (
              <div
                key={entry.id}
                className={styles.historyItem}
              >
                <div
                  className={styles.historyAvatar}
                  style={{
                    backgroundColor:
                      entry.userColor,
                  }}
                >
                  {entry.userInitials}
                </div>

                <div className={styles.historyText}>
                  <span className={styles.historyUser}>
                    {entry.userName}
                  </span>{" "}
                  {entry.action}

                  {entry.target && (
                    <>
                      {" "}
                      <span className={styles.historyTarget}>
                        "{entry.target}"
                      </span>
                    </>
                  )}
                </div>

                <div className={styles.historyTimeGroup}>
                  <span className={styles.historyTimeAgo}>
                    {entry.timeAgo}
                  </span>

                  <span className={styles.historyDateTime}>
                    {entry.dateTime}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyHistory}>
              No activity recorded yet.
            </div>
          )}
        </div>
      ) : (
        <div className={styles.placeholderTab}>
          <p>{activeTab} content coming soon.</p>
        </div>
      )}

      {/* Drawer: Edit Client */}
      <div
        className={`${styles.drawer} ${
          isEditDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <h2>Edit Client</h2>

          <button
            onClick={() =>
              setIsEditDrawerOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        {editForm && (
          <form
            onSubmit={handleSaveEdit}
            className={styles.drawerForm}
          >
            <div className={styles.inputGroup}>
              <label>Company Name</label>

              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Industry Sector</label>

              <input
                type="text"
                value={editForm.sector}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    sector: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Website</label>

              <input
                type="text"
                value={editForm.website}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    website: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Company Email</label>

              <input
                type="email"
                value={editForm.companyEmail}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    companyEmail:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Company Phone</label>

              <input
                type="text"
                value={editForm.companyPhone}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    companyPhone:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Address</label>

              <input
                type="text"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>City</label>

              <input
                type="text"
                value={editForm.city}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    city: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>State</label>

              <input
                type="text"
                value={editForm.state}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    state: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Zipcode</label>

              <input
                type="text"
                value={editForm.zipcode}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    zipcode: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Country</label>

              <input
                type="text"
                value={editForm.country}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    country: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Status</label>

              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
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

            <button
              type="submit"
              className={styles.saveBtn}
            >
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Drawer: Add / Edit Contact */}
      <div
        className={`${styles.drawer} ${
          isContactDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <h2>
            {editingContactId
              ? "Edit Contact"
              : "Add Contact"}
          </h2>

          <button
            onClick={() =>
              setIsContactDrawerOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSaveContact}
          className={styles.drawerForm}
        >
          <div className={styles.inputGroup}>
            <label>Name</label>

            <input
              type="text"
              required
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Role</label>

            <input
              type="text"
              value={contactForm.role}
              onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  role: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>

            <input
              type="email"
              value={contactForm.email}
              onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Phone</label>

            <input
              type="text"
              value={contactForm.phone}
              onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className={styles.saveBtn}
          >
            {editingContactId
              ? "Save Changes"
              : "Save Contact"}
          </button>
        </form>
      </div>

      {/* Drawer: Create / Edit Job */}
      <div
        className={`${styles.drawer} ${
          isJobDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <h2>
            {editingJobId
              ? "Edit Job"
              : "Create Job"}
          </h2>

          <button
            onClick={() =>
              setIsJobDrawerOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSaveJob}
          className={styles.drawerForm}
        >
          <div className={styles.inputGroup}>
            <label>Position Name</label>

            <input
              type="text"
              required
              value={jobForm.positionName}
              onChange={(e) =>
                setJobForm({
                  ...jobForm,
                  positionName:
                    e.target.value,
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
                  value={jobForm.city}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
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
                  value={jobForm.state}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      state: e.target.value,
                    })
                  }
                />

                <span className={styles.locationFieldLabel}>
                  State
                </span>
              </div>

              <div
                className={styles.locationField}
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <input
                  type="text"
                  value={jobForm.country}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
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

          <div className={styles.twoColRow}>
            <div className={styles.inputGroup}>
              <label>Number of Positions</label>

              <input
                type="number"
                min="1"
                value={jobForm.numberOfPositions}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    numberOfPositions:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Format</label>

              <select
                value={jobForm.format}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    format: e.target.value,
                  })
                }
              >
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Salary Range</label>

            <div className={styles.twoColRow}>
              <div>
                <input
                  type="number"
                  placeholder="Minimum"
                  value={jobForm.salaryMin}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      salaryMin:
                        e.target.value,
                    })
                  }
                />

                <span className={styles.locationFieldLabel}>
                  Minimum
                </span>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Maximum"
                  value={jobForm.salaryMax}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      salaryMax:
                        e.target.value,
                    })
                  }
                />

                <span className={styles.locationFieldLabel}>
                  Maximum
                </span>
              </div>
            </div>
          </div>

          <div className={styles.twoColRow}>
            <div className={styles.inputGroup}>
              <label>Currency</label>

              <select
                value={jobForm.currency}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    currency: e.target.value,
                  })
                }
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Frequency</label>

              <select
                value={jobForm.frequency}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    frequency: e.target.value,
                  })
                }
              >
                {FREQUENCY_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Job Description</label>

            <textarea
              rows={5}
              value={jobForm.description}
              onChange={(e) =>
                setJobForm({
                  ...jobForm,
                  description:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className={styles.saveBtn}
          >
            {editingJobId
              ? "Save Changes"
              : "Save Job"}
          </button>
        </form>
      </div>

      {/* Drawer: New Note / Edit Note */}
      <div
        className={`${styles.drawer} ${
          isNoteDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <h2>
            {editingNoteId
              ? "Edit Note"
              : "New Note"}
          </h2>

          <button
            onClick={() =>
              setIsNoteDrawerOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSaveNote}
          className={styles.drawerForm}
        >
          <div className={styles.inputGroup}>
            <label>Title</label>

            <input
              type="text"
              required
              value={noteForm.title}
              onChange={(e) =>
                setNoteForm({
                  ...noteForm,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Note</label>

            <textarea
              rows={8}
              value={noteForm.body}
              onChange={(e) =>
                setNoteForm({
                  ...noteForm,
                  body: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className={styles.saveBtn}
          >
            {editingNoteId
              ? "Save Changes"
              : "Save Note"}
          </button>
        </form>
      </div>
    </div>
  );
}