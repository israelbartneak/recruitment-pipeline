// src/app/candidates/[id]/page.js
"use client";
import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Play,
  FileX,
  Upload,
  Maximize2,
  Download,
  RefreshCw,
  Pencil,
  Trash2,
  Search,
  Plus,
  MoreVertical,
  UploadCloud,
  X,
  Video,
} from "lucide-react";
import { mockCandidates } from "../mockCandidates";
import { mockInterviews } from "../mockInterviews";
import { mockCandidateNotes } from "../mockCandidateNotes";
import {
  mockCandidateDocuments,
  CANDIDATE_DOCUMENT_TYPES,
  CANDIDATE_DOCUMENT_TYPE_COLORS,
} from "../mockCandidateDocuments";
import { mockCandidateHistory } from "../mockCandidateHistory";
import { mockJobs } from "../../jobs-board/mockJobs";
import { mockCandidateJobs, PIPELINE_STAGES } from "../../jobs-board/mockCandidateJobs";
import { mockClients } from "../../clients/mockClients";
import { mockFollowUps } from "../mockFollowUps";
import styles from "./candidateProfile.module.css";

const TABS = [
  "Summary",
  "Resume",
  "Jobs",
  "Follow Up",
  "Interviews",
  "Notes",
  "Documents",
  "History",
];

const FOLLOWUP_SUBJECT_COLORS = {
  Success: { color: "#15803d", bg: "#dcfce7" },
  "No Contact": { color: "#334155", bg: "#f1f5f9" },
  "Health Issue": { color: "#dc2626", bg: "#fee2e2" },
};

const CONVERSATION_TYPE_COLORS = {
  "Candidate Interview": { color: "#15803d", bg: "#dcfce7" },
  "Client Interview": { color: "#6d28d9", bg: "#ede9fe" },
  Update: { color: "#1d4ed8", bg: "#dbeafe" },
  "Job Offer": { color: "#c2410c", bg: "#ffedd5" },
  Onboarding: { color: "#0369a1", bg: "#e0f2fe" },
  "Follow-up Call": { color: "#334155", bg: "#f1f5f9" },
  Other: { color: "#475569", bg: "#f1f5f9" },
};

const METHOD_COLORS = {
  Video: { color: "#1d4ed8", bg: "#dbeafe" },
  Phone: { color: "#334155", bg: "#f1f5f9" },
  "In Person": { color: "#15803d", bg: "#dcfce7" },
  Messaging: { color: "#c2410c", bg: "#ffedd5" },
  Other: { color: "#475569", bg: "#f1f5f9" },
};

function getBadgeStyle(map, key) {
  return map[key] || { color: "#334155", bg: "#f1f5f9" };
}

function getFollowUpSubjectStyle(subject) {
  return FOLLOWUP_SUBJECT_COLORS[subject] || { color: "#334155", bg: "#f1f5f9" };
}

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();

  const [candidate, setCandidate] = useState(() =>
    mockCandidates.find((c) => c.id === params.id),
  );

  const [activeTab, setActiveTab] = useState("Summary");
  const [jobSearch, setJobSearch] = useState("");
  const [followUpSearch, setFollowUpSearch] = useState("");
  const [interviewSearch, setInterviewSearch] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteSearch, setNoteSearch] = useState("");

  const [documents, setDocuments] = useState(() =>
    mockCandidateDocuments.filter((d) => d.candidateId === params.id),
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState(CANDIDATE_DOCUMENT_TYPES[0]);
  const fileInputRef = useRef(null);
  const [openDocMenuId, setOpenDocMenuId] = useState(null);

  /* ===== SUMMARY: edição por bloco ===== */
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsForm, setDetailsForm] = useState(null);

  const [isContractDrawerOpen, setIsContractDrawerOpen] = useState(false);
  const [contractForm, setContractForm] = useState(null);

  const [isSkillsDrawerOpen, setIsSkillsDrawerOpen] = useState(false);
  const [skillsForm, setSkillsForm] = useState("");

  const [openVideoMenu, setOpenVideoMenu] = useState(false);
  const videoInputRef = useRef(null);

  const handleOpenEditDetails = () => {
    setDetailsForm({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      gender: candidate.gender,
      email: candidate.email,
      phone: candidate.phone,
      linkedin: candidate.linkedin,
      languages: candidate.languages.join(", "),
    });
    setIsDetailsDrawerOpen(true);
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    setCandidate({
      ...candidate,
      firstName: detailsForm.firstName,
      lastName: detailsForm.lastName,
      gender: detailsForm.gender,
      email: detailsForm.email,
      phone: detailsForm.phone,
      linkedin: detailsForm.linkedin,
      languages: detailsForm.languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    });
    setIsDetailsDrawerOpen(false);
  };

  const handleOpenEditContract = () => {
    setContractForm({
      preferredContract: candidate.preferredContract,
      workModel: candidate.workModel,
      salaryExpectation: candidate.salaryExpectation,
    });
    setIsContractDrawerOpen(true);
  };

  const handleSaveContract = (e) => {
    e.preventDefault();
    setCandidate({ ...candidate, ...contractForm });
    setIsContractDrawerOpen(false);
  };

  const handleOpenEditSkills = () => {
    setSkillsForm(candidate.skills.join(", "));
    setIsSkillsDrawerOpen(true);
  };

  const handleSaveSkills = (e) => {
    e.preventDefault();
    setCandidate({
      ...candidate,
      skills: skillsForm
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setIsSkillsDrawerOpen(false);
  };

  const handleUploadVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCandidate({ ...candidate, videoUrl: URL.createObjectURL(file) });
    setOpenVideoMenu(false);
  };

  const handleDeleteVideo = () => {
    setCandidate({ ...candidate, videoUrl: null });
    setOpenVideoMenu(false);
  };

  /* ===== JOBS ===== */
  const [jobEntriesState, setJobEntriesState] = useState(() =>
    mockCandidateJobs.filter((entry) => entry.candidateId === params.id),
  );
  const [isAddJobDrawerOpen, setIsAddJobDrawerOpen] = useState(false);
  const [addJobForm, setAddJobForm] = useState({ jobId: "" });
  const [openJobEntryMenuId, setOpenJobEntryMenuId] = useState(null);

  const candidateJobEntries = jobEntriesState
    .map((entry) => {
      const job = mockJobs.find((j) => j.id === entry.jobId);
      const stage = PIPELINE_STAGES.find((s) => s.key === entry.stage);
      return {
        ...entry,
        jobTitle: job ? job.title : "Unknown Job",
        stageLabel: stage ? stage.label : entry.stage,
        stageColor: stage ? stage.color : "#64748b",
      };
    })
    .filter((entry) => entry.jobTitle.toLowerCase().includes(jobSearch.toLowerCase()));

  const availableJobsToAdd = mockJobs.filter(
    (j) => !jobEntriesState.some((entry) => entry.jobId === j.id),
  );

  const handleSaveAddJob = (e) => {
    e.preventDefault();
    if (!addJobForm.jobId) return;
    const job = mockJobs.find((j) => j.id === addJobForm.jobId);
    const newEntry = {
      id: `cj${jobEntriesState.length + 1}-${Date.now()}`,
      candidateId: candidate.id,
      jobId: addJobForm.jobId,
      stage: "new",
      dropped: false,
      match: 0,
      timeInJob: "0d",
      timeInStage: "0d",
      roleLabel: job ? job.title : "",
      matchCreatedDate: new Date().toLocaleDateString("pt-BR"),
    };
    setJobEntriesState([...jobEntriesState, newEntry]);
    setAddJobForm({ jobId: "" });
    setIsAddJobDrawerOpen(false);
  };

  const handleRemoveJobEntry = (entryId) => {
    setJobEntriesState(jobEntriesState.filter((e) => e.id !== entryId));
    setOpenJobEntryMenuId(null);
  };

  /* ===== FOLLOW UP (sem alterações pedidas) ===== */
  const candidateFollowUps = mockFollowUps
    .filter((fu) => fu.candidateId === candidate?.id)
    .map((fu) => {
      const client = mockClients.find((c) => c.id === fu.clientId);
      const job = mockJobs.find((j) => j.id === fu.jobId);
      return {
        ...fu,
        clientName: client ? client.name : "Unknown Client",
        jobTitle: job ? job.title : "Unknown Job",
      };
    })
    .filter((fu) => {
      const term = followUpSearch.toLowerCase();
      return (
        fu.clientName.toLowerCase().includes(term) ||
        fu.jobTitle.toLowerCase().includes(term) ||
        fu.subject.toLowerCase().includes(term) ||
        fu.observation.toLowerCase().includes(term) ||
        fu.creator.toLowerCase().includes(term)
      );
    });

  /* ===== INTERVIEWS ===== */
  const [interviewsState, setInterviewsState] = useState(() =>
    mockInterviews.filter((iv) => iv.candidateId === params.id),
  );
  const [isInterviewDrawerOpen, setIsInterviewDrawerOpen] = useState(false);
  const [editingInterviewId, setEditingInterviewId] = useState(null);
  const [openInterviewMenuId, setOpenInterviewMenuId] = useState(null);
  const emptyInterviewForm = {
    jobId: "",
    participants: [""],
    conversationType: Object.keys(CONVERSATION_TYPE_COLORS)[0],
    method: Object.keys(METHOD_COLORS)[0],
    file: null,
  };
  const [interviewForm, setInterviewForm] = useState(emptyInterviewForm);
  const interviewFileInputRef = useRef(null);

  const candidateInterviews = interviewsState
    .map((iv) => {
      const job = mockJobs.find((j) => j.id === iv.jobId);
      return { ...iv, jobTitle: job ? job.title : "Unknown Job" };
    })
    .filter((iv) => {
      const term = interviewSearch.toLowerCase();
      return (
        iv.jobTitle.toLowerCase().includes(term) ||
        iv.participants.toLowerCase().includes(term) ||
        iv.conversationType.toLowerCase().includes(term) ||
        iv.method.toLowerCase().includes(term) ||
        iv.createdBy.toLowerCase().includes(term)
      );
    });

  const handleOpenNewInterview = () => {
    setInterviewForm(emptyInterviewForm);
    setEditingInterviewId(null);
    setIsInterviewDrawerOpen(true);
  };

  const handleEditInterview = (iv) => {
    setInterviewForm({
      jobId: iv.jobId,
      participants: iv.participants.split(",").map((p) => p.trim()).filter(Boolean) || [""],
      conversationType: iv.conversationType,
      method: iv.method,
      file: null,
    });
    setEditingInterviewId(iv.id);
    setOpenInterviewMenuId(null);
    setIsInterviewDrawerOpen(true);
  };

  const handleDeleteInterview = (ivId) => {
    setInterviewsState(interviewsState.filter((iv) => iv.id !== ivId));
    setOpenInterviewMenuId(null);
  };

  const handleParticipantChange = (index, value) => {
    const updated = [...interviewForm.participants];
    updated[index] = value;
    setInterviewForm({ ...interviewForm, participants: updated });
  };

  const handleAddParticipant = () => {
    setInterviewForm({
      ...interviewForm,
      participants: [...interviewForm.participants, ""],
    });
  };

  const handleRemoveParticipant = (index) => {
    if (interviewForm.participants.length === 1) return;
    setInterviewForm({
      ...interviewForm,
      participants: interviewForm.participants.filter((_, i) => i !== index),
    });
  };

  const handleSaveInterview = (e) => {
    e.preventDefault();
    if (!interviewForm.jobId) return;
    const participantsStr = interviewForm.participants.filter((p) => p.trim()).join(", ");
    const today = new Date().toLocaleDateString("pt-BR");

    if (editingInterviewId) {
      setInterviewsState(
        interviewsState.map((iv) =>
          iv.id === editingInterviewId
            ? {
                ...iv,
                jobId: interviewForm.jobId,
                participants: participantsStr,
                conversationType: interviewForm.conversationType,
                method: interviewForm.method,
                fileUrl: interviewForm.file
                  ? URL.createObjectURL(interviewForm.file)
                  : iv.fileUrl,
              }
            : iv,
        ),
      );
    } else {
      const newInterview = {
        id: `iv${interviewsState.length + 1}-${Date.now()}`,
        candidateId: candidate.id,
        jobId: interviewForm.jobId,
        date: today,
        participants: participantsStr,
        conversationType: interviewForm.conversationType,
        method: interviewForm.method,
        createdBy: "Bryan Santana",
        fileUrl: interviewForm.file ? URL.createObjectURL(interviewForm.file) : "#",
      };
      setInterviewsState([newInterview, ...interviewsState]);
    }

    setInterviewForm(emptyInterviewForm);
    setEditingInterviewId(null);
    setIsInterviewDrawerOpen(false);
  };

  /* ===== NOTES ===== */
  const [notesState, setNotesState] = useState(() =>
    mockCandidateNotes.filter((n) => n.candidateId === params.id),
  );
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: "", body: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [openNoteMenuId, setOpenNoteMenuId] = useState(null);

  const filteredNotes = notesState.filter((n) =>
    n.title.toLowerCase().includes(noteSearch.toLowerCase()),
  );
  const selectedNote =
    filteredNotes.find((n) => n.id === selectedNoteId) || filteredNotes[0] || null;

  const handleOpenNewNote = () => {
    setNoteForm({ title: "", body: "" });
    setEditingNoteId(null);
    setIsNoteDrawerOpen(true);
  };

  const handleEditNote = (note) => {
    setNoteForm({ title: note.title, body: note.body });
    setEditingNoteId(note.id);
    setOpenNoteMenuId(null);
    setIsNoteDrawerOpen(true);
  };

  const handleDeleteNote = (noteId) => {
    setNotesState(notesState.filter((n) => n.id !== noteId));
    setOpenNoteMenuId(null);
    if (selectedNoteId === noteId) setSelectedNoteId(null);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteForm.title.trim()) return;
    const today = new Date().toLocaleDateString("pt-BR");

    if (editingNoteId) {
      setNotesState(
        notesState.map((n) =>
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
      );
    } else {
      const newNote = {
        id: `cn${notesState.length + 1}-${Date.now()}`,
        candidateId: candidate.id,
        title: noteForm.title,
        body: noteForm.body,
        createdBy: "Bryan Santana",
        createdAt: today,
        updatedBy: null,
        updatedAt: null,
      };
      setNotesState([newNote, ...notesState]);
      setSelectedNoteId(newNote.id);
    }

    setNoteForm({ title: "", body: "" });
    setEditingNoteId(null);
    setIsNoteDrawerOpen(false);
  };

  /* ===== DOCUMENTS ===== */
  const handleUploadDocument = () => {
    if (!selectedFile) return;
    const newDocument = {
      id: `cd${documents.length + 1}-${Date.now()}`,
      candidateId: candidate.id,
      name: selectedFile.name,
      type: documentType,
      createdBy: "Bryan Santana",
      date: new Date().toLocaleDateString("pt-BR"),
    };
    setDocuments([newDocument, ...documents]);
    setSelectedFile(null);
    setDocumentType(CANDIDATE_DOCUMENT_TYPES[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(documents.filter((d) => d.id !== docId));
    setOpenDocMenuId(null);
  };

  /* ===== HISTORY (sem alterações pedidas) ===== */
  const candidateHistory = mockCandidateHistory.filter(
    (h) => h.candidateId === candidate?.id,
  );

  if (!candidate) {
    return (
      <div className={styles.container}>
        <p>Candidate not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={() => router.back()}>
              <ArrowLeft size={16} />
            </button>
            <img
              src={candidate.photoUrl}
              alt={`${candidate.firstName} ${candidate.lastName}`}
              className={styles.candidatePhoto}
            />
            <div>
              <h1>
                {candidate.firstName} {candidate.lastName}
              </h1>
              <div className={styles.locationRow}>
                <MapPin size={13} />
                Location: {candidate.city}, {candidate.state}, {candidate.country}
              </div>
              {candidate.tags.length > 0 && (
                <div className={styles.tagsRow}>
                  <span className={styles.tagsLabel}>Tags:</span>
                  {candidate.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag.toUpperCase()}
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
          {/* CANDIDATE DETAILS */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Candidate Details</h2>
              <div className={styles.cardMenuWrapper}>
                <button
                  className={styles.cardMenuBtn}
                  onClick={handleOpenEditDetails}
                  title="Edit details"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            <div className={styles.infoList}>
              <div className={styles.infoLine}>
                <span className={styles.label}>Candidate ID</span>
                <span className={styles.value}>{candidate.id}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>First Name</span>
                <span className={styles.value}>{candidate.firstName}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Last Name</span>
                <span className={styles.value}>{candidate.lastName}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Gender</span>
                <span className={styles.value}>{candidate.gender}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{candidate.email}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Phone Number</span>
                <span className={styles.value}>{candidate.phone}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>LinkedIn</span>
                <a
                  href={`https://${candidate.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedinLink}
                >
                  {candidate.linkedin}
                </a>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Languages</span>
                <span className={styles.value}>{candidate.languages.join(", ")}</span>
              </div>
              <div className={styles.infoLine}>
                <span className={styles.label}>Created Date</span>
                <span className={styles.value}>{candidate.createdDate}</span>
              </div>
            </div>
          </div>

          <div className={styles.sideColumn}>
            {/* VIDEO INTRODUCTION */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Video Introduction</h2>
                <div className={styles.cardMenuWrapper}>
                  <button
                    className={styles.cardMenuBtn}
                    onClick={() => setOpenVideoMenu(!openVideoMenu)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openVideoMenu && (
                    <div className={styles.cardMenuDropdown}>
                      <button onClick={() => videoInputRef.current?.click()}>
                        Upload Video
                      </button>
                      {candidate.videoUrl && (
                        <button className={styles.cardMenuDelete} onClick={handleDeleteVideo}>
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={handleUploadVideo}
                  />
                </div>
              </div>
              <div className={styles.videoRow}>
                <div className={styles.playBtn}>
                  {candidate.videoUrl ? (
                    <Play size={16} fill="#ffffff" color="#ffffff" />
                  ) : (
                    <Video size={16} color="#ffffff" />
                  )}
                </div>
                <div>
                  <div className={styles.videoLabel}>
                    {candidate.videoUrl ? "Watch Video" : "No video yet"}
                  </div>
                  {candidate.videoUrl && (
                    <div className={styles.videoDuration}>0:52 min</div>
                  )}
                </div>
              </div>
            </div>

            {/* CONTRACT PREFERENCES */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Contract Preferences</h2>
                <div className={styles.cardMenuWrapper}>
                  <button className={styles.cardMenuBtn} onClick={handleOpenEditContract}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoLine}>
                  <span className={styles.label}>Preferred Contract</span>
                  <span className={styles.value}>{candidate.preferredContract}</span>
                </div>
                <div className={styles.infoLine}>
                  <span className={styles.label}>Work Model</span>
                  <span className={styles.value}>{candidate.workModel}</span>
                </div>
                <div className={styles.infoLine}>
                  <span className={styles.label}>Salary Expectation</span>
                  <span className={styles.value}>{candidate.salaryExpectation}</span>
                </div>
              </div>
            </div>

            {/* SKILLS PORTFOLIO */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Skills Portfolio</h2>
                <div className={styles.cardMenuWrapper}>
                  <button className={styles.cardMenuBtn} onClick={handleOpenEditSkills}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              <div className={styles.skillsRow}>
                {candidate.skills.map((skill) => (
                  <span key={skill} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "Resume" ? (
        <div className={styles.resumeViewerCard}>
          {candidate.resumeUrl ? (
            <div className={styles.resumeToolbar}>
              <button className={styles.resumeToolbarIcon} title="Hide panel">
                <Maximize2 size={16} />
              </button>
              <div className={styles.resumeSearchWrapper}>
                <input
                  type="text"
                  placeholder="Search in document..."
                  className={styles.resumeSearchInput}
                />
              </div>
              <span className={styles.resumePageIndicator}>1 / 1</span>
            </div>
          ) : null}
          <div className={styles.resumeContentArea}>
            {candidate.resumeUrl ? (
              <iframe src={candidate.resumeUrl} title="Resume" className={styles.resumeIframe} />
            ) : (
              <div className={styles.resumeEmptyState}>
                <FileX size={32} className={styles.resumeEmptyIcon} />
                <p className={styles.resumeEmptyText}>No resume file attached.</p>
                <button className={styles.uploadResumeBtn}>
                  <Upload size={14} />
                  Upload Resume
                </button>
              </div>
            )}
          </div>
          <div className={styles.resumeActionsBar}>
            <button className={styles.resumeActionIcon} title="Open full view" disabled={!candidate.resumeUrl}>
              <Maximize2 size={16} />
            </button>
            <button className={styles.resumeActionIcon} title="Download" disabled={!candidate.resumeUrl}>
              <Download size={16} />
            </button>
            <button className={styles.resumeActionIcon} title="Replace resume" disabled={!candidate.resumeUrl}>
              <RefreshCw size={16} />
            </button>
            <button className={styles.resumeActionIcon} title="Rename" disabled={!candidate.resumeUrl}>
              <Pencil size={16} />
            </button>
            <button
              className={`${styles.resumeActionIcon} ${styles.resumeActionDanger}`}
              title="Delete resume"
              disabled={!candidate.resumeUrl}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : activeTab === "Jobs" ? (
        <>
          <div className={styles.jobsToolbarRow}>
            <div className={styles.jobsSearchWrapper}>
              <Search size={17} className={styles.jobsSearchIcon} />
              <input
                type="text"
                placeholder="Search jobs..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className={styles.jobsSearchInput}
              />
            </div>
            <button className={styles.addToJobBtn} onClick={() => setIsAddJobDrawerOpen(true)}>
              <Plus size={15} />
              Add to Job
            </button>
          </div>
          <p className={styles.resultsCount}>{candidateJobEntries.length} jobs found</p>
          <div className={styles.jobsTableWrapper}>
            <table className={styles.jobsTable}>
              <thead>
                <tr>
                  <th>Position Name</th>
                  <th>Stage</th>
                  <th>Dropped</th>
                  <th>Match Created Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {candidateJobEntries.length > 0 ? (
                  candidateJobEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <Link href={`/jobs-board/${entry.jobId}`} className={styles.jobPositionLink}>
                          {entry.jobTitle}
                        </Link>
                      </td>
                      <td>
                        <span
                          className={styles.jobStageBadge}
                          style={{
                            color: entry.stageColor,
                            backgroundColor: `${entry.stageColor}1A`,
                          }}
                        >
                          {entry.stageLabel}
                        </span>
                      </td>
                      <td>
                        <span className={entry.dropped ? styles.droppedYes : styles.droppedNo}>
                          {entry.dropped ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className={styles.jobsDateCell}>{entry.matchCreatedDate}</td>
                      <td className={styles.meetingActionsCell}>
                        <div className={styles.cardMenuWrapper}>
                          <button
                            className={styles.meetingActionIcon}
                            onClick={() =>
                              setOpenJobEntryMenuId(
                                openJobEntryMenuId === entry.id ? null : entry.id,
                              )
                            }
                          >
                            <MoreVertical size={14} />
                          </button>
                          {openJobEntryMenuId === entry.id && (
                            <div className={styles.cardMenuDropdown} style={{ right: 0, left: "auto" }}>
                              <button
                                className={styles.cardMenuDelete}
                                onClick={() => handleRemoveJobEntry(entry.id)}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.emptyJobsRow}>
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : activeTab === "Follow Up" ? (
        <>
          <div className={styles.jobsToolbarRow}>
            <div className={styles.jobsSearchWrapper}>
              <Search size={17} className={styles.jobsSearchIcon} />
              <input
                type="text"
                placeholder="Search follow ups..."
                value={followUpSearch}
                onChange={(e) => setFollowUpSearch(e.target.value)}
                className={styles.jobsSearchInput}
              />
            </div>
            <button className={styles.addToJobBtn}>
              <Plus size={15} />
              Log Follow Up
            </button>
          </div>
          <p className={styles.resultsCount}>{candidateFollowUps.length} follow ups found</p>
          <div className={styles.jobsTableWrapper}>
            <table className={styles.followUpTable}>
              <colgroup>
                <col style={{ width: "110px" }} />
                <col style={{ width: "130px" }} />
                <col style={{ width: "150px" }} />
                <col style={{ width: "160px" }} />
                <col style={{ width: "140px" }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Register Date</th>
                  <th>Creator</th>
                  <th>Client</th>
                  <th>Job</th>
                  <th>Subject</th>
                  <th>Observation</th>
                </tr>
              </thead>
              <tbody>
                {candidateFollowUps.length > 0 ? (
                  candidateFollowUps.map((fu) => {
                    const subjectStyle = getFollowUpSubjectStyle(fu.subject);
                    return (
                      <tr key={fu.id}>
                        <td className={styles.followUpCellTruncate}>{fu.registerDate}</td>
                        <td className={styles.followUpCellTruncate} title={fu.creator}>
                          {fu.creator}
                        </td>
                        <td className={styles.followUpCellTruncate}>
                          <Link href={`/clients/${fu.clientId}`} className={styles.followUpLink}>
                            {fu.clientName}
                          </Link>
                        </td>
                        <td className={styles.followUpCellTruncate}>
                          <Link href={`/jobs-board/${fu.jobId}`} className={styles.followUpLink}>
                            {fu.jobTitle}
                          </Link>
                        </td>
                        <td className={styles.followUpCellTruncate}>
                          <span
                            className={styles.followUpSubjectBadge}
                            style={{ color: subjectStyle.color, backgroundColor: subjectStyle.bg }}
                          >
                            {fu.subject}
                          </span>
                        </td>
                        <td
                          className={`${styles.followUpCellTruncate} ${styles.followUpObservation}`}
                          title={fu.observation}
                        >
                          {fu.observation}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.emptyJobsRow}>
                      No follow ups found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : activeTab === "Interviews" ? (
        <>
          <div className={styles.jobsToolbarRow}>
            <div className={styles.jobsSearchWrapper}>
              <Search size={17} className={styles.jobsSearchIcon} />
              <input
                type="text"
                placeholder="Search interviews..."
                value={interviewSearch}
                onChange={(e) => setInterviewSearch(e.target.value)}
                className={styles.jobsSearchInput}
              />
            </div>
            <button className={styles.addToJobBtn} onClick={handleOpenNewInterview}>
              <Plus size={15} />
              Add Interview
            </button>
          </div>
          <p className={styles.resultsCount}>{candidateInterviews.length} interviews found</p>
          <div className={styles.jobsTableWrapper}>
            <table className={styles.interviewsTable}>
              <colgroup>
                <col style={{ width: "95px" }} />
                <col style={{ width: "150px" }} />
                <col style={{ width: "180px" }} />
                <col style={{ width: "150px" }} />
                <col style={{ width: "110px" }} />
                <col style={{ width: "140px" }} />
                <col style={{ width: "70px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Job</th>
                  <th>Participants</th>
                  <th>Conversation Type</th>
                  <th>Method</th>
                  <th>Created By</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {candidateInterviews.length > 0 ? (
                  candidateInterviews.map((iv) => {
                    const typeStyle = getBadgeStyle(CONVERSATION_TYPE_COLORS, iv.conversationType);
                    const methodStyle = getBadgeStyle(METHOD_COLORS, iv.method);
                    return (
                      <tr key={iv.id}>
                        <td className={styles.followUpCellTruncate}>{iv.date}</td>
                        <td className={styles.followUpCellTruncate}>
                          <Link href={`/jobs-board/${iv.jobId}`} className={styles.followUpLink}>
                            {iv.jobTitle}
                          </Link>
                        </td>
                        <td className={styles.followUpCellTruncate} title={iv.participants}>
                          {iv.participants}
                        </td>
                        <td className={styles.followUpCellTruncate}>
                          <span
                            className={styles.followUpSubjectBadge}
                            style={{ color: typeStyle.color, backgroundColor: typeStyle.bg }}
                          >
                            {iv.conversationType}
                          </span>
                        </td>
                        <td className={styles.followUpCellTruncate}>
                          <span
                            className={styles.followUpSubjectBadge}
                            style={{ color: methodStyle.color, backgroundColor: methodStyle.bg }}
                          >
                            {iv.method}
                          </span>
                        </td>
                        <td className={styles.followUpCellTruncate} title={iv.createdBy}>
                          {iv.createdBy}
                        </td>
                        <td className={styles.meetingActionsCell}>
                          <div className={styles.cardMenuWrapper}>
                            <button
                              className={styles.meetingActionIcon}
                              onClick={() =>
                                setOpenInterviewMenuId(
                                  openInterviewMenuId === iv.id ? null : iv.id,
                                )
                              }
                            >
                              <MoreVertical size={14} />
                            </button>
                            {openInterviewMenuId === iv.id && (
                              <div className={styles.cardMenuDropdown} style={{ right: 0, left: "auto" }}>
                                <button onClick={() => handleEditInterview(iv)}>Edit</button>
                                <button
                                  className={styles.cardMenuDelete}
                                  onClick={() => handleDeleteInterview(iv.id)}
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
                    <td colSpan={7} className={styles.emptyJobsRow}>
                      No interviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : activeTab === "Notes" ? (
        <div className={styles.notesLayout}>
          <div className={styles.notesHeader}>
            <div className={styles.notesSearchWrapper}>
              <Search size={17} className={styles.notesSearchIcon} />
              <input
                type="text"
                placeholder="Search notes..."
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                className={styles.notesSearchInput}
              />
            </div>
            <button className={styles.newNoteBtn} onClick={handleOpenNewNote}>
              <Plus size={15} />
              New Note
            </button>
          </div>
          <div className={styles.notesGrid}>
            <div className={styles.notesList}>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`${styles.noteListItem} ${
                      selectedNote?.id === note.id ? styles.noteListItemActive : ""
                    }`}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    onClick={() => setSelectedNoteId(note.id)}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {note.title}
                    </span>
                    <div className={styles.cardMenuWrapper} onClick={(e) => e.stopPropagation()}>
                      <button
                        className={styles.cardMenuBtn}
                        onClick={() =>
                          setOpenNoteMenuId(openNoteMenuId === note.id ? null : note.id)
                        }
                      >
                        <MoreVertical size={13} />
                      </button>
                      {openNoteMenuId === note.id && (
                        <div className={styles.cardMenuDropdown}>
                          <button onClick={() => handleEditNote(note)}>Edit</button>
                          <button className={styles.cardMenuDelete} onClick={() => handleDeleteNote(note.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyNotesList}>
                  {noteSearch ? "No notes match your search." : "No notes yet."}
                </div>
              )}
            </div>
            <div className={styles.noteDetail}>
              {selectedNote ? (
                <>
                  <h3 className={styles.noteDetailTitle}>{selectedNote.title}</h3>
                  <p className={styles.noteDetailBody}>{selectedNote.body}</p>
                  <div className={styles.noteDetailFooter}>
                    <span>
                      Created by {selectedNote.createdBy} on {selectedNote.createdAt}
                    </span>
                    {selectedNote.updatedBy && (
                      <span>
                        Updated by {selectedNote.updatedBy} on {selectedNote.updatedAt}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.emptyNoteDetail}>
                  Select a note on the left to view its content.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === "Documents" ? (
        <>
          <div className={styles.uploadCard}>
            <h3 className={styles.uploadCardTitle}>Upload New Document</h3>
            <div className={styles.uploadRow}>
              <div className={styles.uploadField}>
                <span className={styles.uploadLabel}>Upload a File</span>
                <div className={styles.fileChooseRow}>
                  <button
                    type="button"
                    className={styles.chooseFileBtn}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </button>
                  <span className={styles.fileNameText}>
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className={styles.hiddenFileInput}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <div className={styles.uploadField}>
                <span className={styles.uploadLabel}>Document Type</span>
                <select
                  className={styles.documentTypeSelect}
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  {CANDIDATE_DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={handleUploadDocument}
                disabled={!selectedFile}
              >
                <UploadCloud size={14} />
                Upload
              </button>
            </div>
          </div>
          <p className={styles.resultsCount}>{documents.length} documents</p>
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
                      CANDIDATE_DOCUMENT_TYPE_COLORS[doc.type] ||
                      CANDIDATE_DOCUMENT_TYPE_COLORS.Others;
                    return (
                      <tr key={doc.id}>
                        <td className={styles.documentNameCell}>{doc.name}</td>
                        <td>
                          <span
                            className={styles.documentTypeBadge}
                            style={{ color: typeStyle.color, backgroundColor: typeStyle.bg }}
                          >
                            {doc.type}
                          </span>
                        </td>
                        <td>{doc.createdBy}</td>
                        <td className={styles.documentDateCell}>{doc.date}</td>
                        <td className={styles.meetingActionsCell}>
                          <div className={styles.cardMenuWrapper}>
                            <button
                              className={styles.meetingActionIcon}
                              onClick={() =>
                                setOpenDocMenuId(openDocMenuId === doc.id ? null : doc.id)
                              }
                            >
                              <MoreVertical size={14} />
                            </button>
                            {openDocMenuId === doc.id && (
                              <div className={styles.cardMenuDropdown} style={{ right: 0, left: "auto" }}>
                                <button
                                  className={styles.cardMenuDelete}
                                  onClick={() => handleDeleteDocument(doc.id)}
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
                    <td colSpan={5} className={styles.emptyJobsRow}>
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
          {candidateHistory.length > 0 ? (
            candidateHistory.map((entry) => (
              <div key={entry.id} className={styles.historyItem}>
                <div className={styles.historyAvatar} style={{ backgroundColor: entry.userColor }}>
                  {entry.userInitials}
                </div>
                <div className={styles.historyText}>
                  <span className={styles.historyUser}>{entry.userName}</span> {entry.action}
                  {entry.target && (
                    <>
                      {" "}
                      <span className={styles.historyTarget}>"{entry.target}"</span>
                    </>
                  )}
                </div>
                <div className={styles.historyTimeGroup}>
                  <span className={styles.historyTimeAgo}>{entry.timeAgo}</span>
                  <span className={styles.historyDateTime}>{entry.dateTime}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyHistory}>No activity recorded yet.</div>
          )}
        </div>
      ) : (
        <div className={styles.placeholderTab}>
          <p>{activeTab} content coming soon.</p>
        </div>
      )}

      {/* ===== DRAWERS ===== */}

      {/* Edit Candidate Details */}
      <div className={`${styles.drawer} ${isDetailsDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h2>Edit Details</h2>
          <button onClick={() => setIsDetailsDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>
        {detailsForm && (
          <form onSubmit={handleSaveDetails} className={styles.drawerForm}>
            <div className={styles.inputGroup}>
              <label>First Name</label>
              <input
                type="text"
                value={detailsForm.firstName}
                onChange={(e) => setDetailsForm({ ...detailsForm, firstName: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Last Name</label>
              <input
                type="text"
                value={detailsForm.lastName}
                onChange={(e) => setDetailsForm({ ...detailsForm, lastName: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Gender</label>
              <input
                type="text"
                value={detailsForm.gender}
                onChange={(e) => setDetailsForm({ ...detailsForm, gender: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                value={detailsForm.email}
                onChange={(e) => setDetailsForm({ ...detailsForm, email: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="text"
                value={detailsForm.phone}
                onChange={(e) => setDetailsForm({ ...detailsForm, phone: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>LinkedIn</label>
              <input
                type="text"
                value={detailsForm.linkedin}
                onChange={(e) => setDetailsForm({ ...detailsForm, linkedin: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Languages (comma separated)</label>
              <input
                type="text"
                value={detailsForm.languages}
                onChange={(e) => setDetailsForm({ ...detailsForm, languages: e.target.value })}
              />
            </div>
            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Edit Contract Preferences */}
      <div className={`${styles.drawer} ${isContractDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h2>Edit Contract Preferences</h2>
          <button onClick={() => setIsContractDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>
        {contractForm && (
          <form onSubmit={handleSaveContract} className={styles.drawerForm}>
            <div className={styles.inputGroup}>
              <label>Preferred Contract</label>
              <input
                type="text"
                value={contractForm.preferredContract}
                onChange={(e) =>
                  setContractForm({ ...contractForm, preferredContract: e.target.value })
                }
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Work Model</label>
              <input
                type="text"
                value={contractForm.workModel}
                onChange={(e) => setContractForm({ ...contractForm, workModel: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Salary Expectation</label>
              <input
                type="text"
                value={contractForm.salaryExpectation}
                onChange={(e) =>
                  setContractForm({ ...contractForm, salaryExpectation: e.target.value })
                }
              />
            </div>
            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Edit Skills */}
      <div className={`${styles.drawer} ${isSkillsDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h2>Edit Skills</h2>
          <button onClick={() => setIsSkillsDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSaveSkills} className={styles.drawerForm}>
          <div className={styles.inputGroup}>
            <label>Skills (comma separated)</label>
            <textarea
              rows={6}
              value={skillsForm}
              onChange={(e) => setSkillsForm(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.saveBtn}>
            Save Changes
          </button>
        </form>
      </div>

      {/* Add to Job */}
      <div className={`${styles.drawer} ${isAddJobDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h2>Add to Job</h2>
          <button onClick={() => setIsAddJobDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSaveAddJob} className={styles.drawerForm}>
          <div className={styles.inputGroup}>
            <label>Job</label>
            <select
              required
              value={addJobForm.jobId}
              onChange={(e) => setAddJobForm({ jobId: e.target.value })}
            >
              <option value="">Select a job...</option>
              {availableJobsToAdd.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.saveBtn}>
            Add
          </button>
        </form>
      </div>

      {/* Add / Edit Interview */}
      <div className={`${styles.drawer} ${isInterviewDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h2>{editingInterviewId ? "Edit Interview" : "Add Interview"}</h2>
          <button onClick={() => setIsInterviewDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSaveInterview} className={styles.drawerForm}>
          <div className={styles.inputGroup}>
            <label>Job</label>
            <select
              required
              value={interviewForm.jobId}
              onChange={(e) => setInterviewForm({ ...interviewForm, jobId: e.target.value })}
            >
              <option value="">Select a job...</option>
              {mockJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Participants</label>
            {interviewForm.participants.map((p, index) => (
              <div key={index} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => handleParticipantChange(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                {interviewForm.participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(index)}
                    className={styles.removeParticipantBtn}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className={styles.addParticipantBtn} onClick={handleAddParticipant}>
              + Add Participant
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label>Conversation Type</label>
            <select
              value={interviewForm.conversationType}
              onChange={(e) =>
                setInterviewForm({ ...interviewForm, conversationType: e.target.value })
              }
            >
              {Object.keys(CONVERSATION_TYPE_COLORS).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Method</label>
            <select
              value={interviewForm.method}
              onChange={(e) => setInterviewForm({ ...interviewForm, method: e.target.value })}
            >
              {Object.keys(METHOD_COLORS).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Attachment (optional)</label>
            <div className={styles.fileChooseRow}>
              <button
                type="button"
                className={styles.chooseFileBtn}
                onClick={() => interviewFileInputRef.current?.click()}
              >
                Choose File
              </button>
              <span className={styles.fileNameText}>
                {interviewForm.file ? interviewForm.file.name : "No file chosen"}
              </span>
              <input
                ref={interviewFileInputRef}
                type="file"
                className={styles.hiddenFileInput}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, file: e.target.files?.[0] || null })
                }
              />
            </div>
          </div>

          <button type="submit" className={styles.saveBtn}>
            {editingInterviewId ? "Save Changes" : "Save Interview"}
          </button>
        </form>
      </div>

      {/* New / Edit Note */}
      <div className={`${styles.drawer} ${isNoteDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h2>{editingNoteId ? "Edit Note" : "New Note"}</h2>
          <button onClick={() => setIsNoteDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSaveNote} className={styles.drawerForm}>
          <div className={styles.inputGroup}>
            <label>Title</label>
            <input
              type="text"
              required
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Note</label>
            <textarea
              rows={8}
              value={noteForm.body}
              onChange={(e) => setNoteForm({ ...noteForm, body: e.target.value })}
            />
          </div>
          <button type="submit" className={styles.saveBtn}>
            {editingNoteId ? "Save Changes" : "Save Note"}
          </button>
        </form>
      </div>
    </div>
  );
}