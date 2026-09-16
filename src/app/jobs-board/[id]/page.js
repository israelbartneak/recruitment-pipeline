// src/app/jobs-board/[id]/page.js
"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  MapPin,
  DollarSign,
  MoreVertical,
  Eye,
  Clock,
  Zap,
  X,
  Pencil,
  Search,
  Plus,
  Download,
} from "lucide-react";

import { mockJobs } from "../mockJobs";
import { mockCandidates } from "../../candidates/mockCandidates";
import {
  mockCandidateJobs,
  PIPELINE_STAGES,
} from "../mockCandidateJobs";

import { mockJobNotes } from "../mockJobNotes";

import {
  mockJobAttachments,
  JOB_ATTACHMENT_TYPES,
  JOB_ATTACHMENT_TYPE_COLORS,
} from "../mockJobAttachments";

import styles from "./jobPosition.module.css";

const TABS = [
  "Candidates",
  "Description",
  "Notes",
  "Interview Script",
  "Attachments",
];

function getMatchStyle(match) {
  if (match >= 60) {
    return {
      color: "#15803d",
      bg: "#dcfce7",
    };
  }

  if (match >= 40) {
    return {
      color: "#c2410c",
      bg: "#ffedd5",
    };
  }

  return {
    color: "#dc2626",
    bg: "#fee2e2",
  };
}

function getBadgeStyle(map, key) {
  return (
    map[key] || {
      color: "#334155",
      bg: "#f1f5f9",
    }
  );
}

const DONUT_RADIUS = 6.5;
const DONUT_CIRCUMFERENCE =
  2 * Math.PI * DONUT_RADIUS;

export default function JobPositionPage() {
  const params = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState("Candidates");

  const [
    selectedCandidate,
    setSelectedCandidate,
  ] = useState(null);

  /*
   * Notes
   */
  const [noteSearch, setNoteSearch] =
    useState("");

  const [
    selectedNoteId,
    setSelectedNoteId,
  ] = useState(null);

  /*
   * Notes da vaga — agora editável
   */
  const [jobNotesState, setJobNotesState] = useState(() =>
    mockJobNotes.filter((n) => n.jobId === params.id),
  );

  const [isNoteDrawerOpen, setIsNoteDrawerOpen] =
    useState(false);

  const [noteForm, setNoteForm] = useState({
    title: "",
    body: "",
  });

  const [editingNoteId, setEditingNoteId] =
    useState(null);

  const [openNoteMenuId, setOpenNoteMenuId] =
    useState(null);

  /*
   * Interview Script
   */
  const [scripts, setScripts] = useState([]);

  const [isScriptDrawerOpen, setIsScriptDrawerOpen] =
    useState(false);

  const [scriptForm, setScriptForm] = useState({
    text: "",
  });

  const [editingScriptId, setEditingScriptId] =
    useState(null);

  const [openScriptMenuId, setOpenScriptMenuId] =
    useState(null);

  /*
   * Attachments
   */
  const [
    isAttachmentDrawerOpen,
    setIsAttachmentDrawerOpen,
  ] = useState(false);

  const [attachmentForm, setAttachmentForm] = useState({
    type: JOB_ATTACHMENT_TYPES[0],
    file: null,
  });

  /*
   * Drop candidato
   */
  const [
    openCandidateMenuId,
    setOpenCandidateMenuId,
  ] = useState(null);

  const [
    isDropDrawerOpen,
    setIsDropDrawerOpen,
  ] = useState(false);

  const [
    droppingCandidate,
    setDroppingCandidate,
  ] = useState(null);

  const [dropForm, setDropForm] = useState({
    reason: "",
    observations: "",
  });

  /*
   * Edit Job Details
   */
  const [
    isEditJobDrawerOpen,
    setIsEditJobDrawerOpen,
  ] = useState(false);

  const [jobEditForm, setJobEditForm] =
    useState(null);

  /*
   * Job
   */
  const [job, setJob] = useState(() =>
    mockJobs.find(
      (j) => j.id === params.id,
    ),
  );

  /*
   * Description
   */
  const [
    isEditingDescription,
    setIsEditingDescription,
  ] = useState(false);

  const [
    descriptionDraft,
    setDescriptionDraft,
  ] = useState(job?.description || "");

  const [
    description,
    setDescription,
  ] = useState(job?.description || "");

  /*
   * Attachments
   */
  const [
    attachments,
    setAttachments,
  ] = useState(
    mockJobAttachments.filter(
      (a) => a.jobId === job?.id,
    ),
  );

  const [
    attachmentSearch,
    setAttachmentSearch,
  ] = useState("");

  const attachmentInputRef = useRef(null);

  /*
   * Notes filtradas
   */
  const filteredNotes = jobNotesState.filter((n) =>
    n.title
      .toLowerCase()
      .includes(noteSearch.toLowerCase()),
  );

  const selectedNote =
    filteredNotes.find(
      (n) => n.id === selectedNoteId,
    ) ||
    filteredNotes[0] ||
    null;

  /*
   * Attachments filtrados
   */
  const filteredAttachments =
    attachments.filter((a) => {
      const term =
        attachmentSearch.toLowerCase();

      return (
        a.name
          .toLowerCase()
          .includes(term) ||
        a.type
          .toLowerCase()
          .includes(term) ||
        a.createdBy
          .toLowerCase()
          .includes(term)
      );
    });

  /*
   * Salvar attachment
   */
  const handleSaveAttachment = (e) => {
    e.preventDefault();

    if (!attachmentForm.file) return;

    const newAttachment = {
      id: `ja${attachments.length + 1}-${Date.now()}`,
      jobId: job.id,
      name: attachmentForm.file.name,
      type: attachmentForm.type,
      createdBy: "Bryan Santana",
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setAttachments([
      newAttachment,
      ...attachments,
    ]);

    setAttachmentForm({
      type: JOB_ATTACHMENT_TYPES[0],
      file: null,
    });

    setIsAttachmentDrawerOpen(false);
  };

  /*
   * Candidatos iniciais
   */
  const buildInitialCandidates = () =>
    mockCandidateJobs
      .filter(
        (entry) =>
          entry.jobId === job?.id,
      )
      .map((entry) => {
        const person =
          mockCandidates.find(
            (c) =>
              c.id === entry.candidateId,
          );

        return {
          entryId: entry.id,
          candidateId:
            entry.candidateId,

          name: person
            ? `${person.firstName} ${person.lastName}`
            : "Unknown",

          role: entry.roleLabel,
          stage: entry.stage,
          dropped: entry.dropped,
          match: entry.match,
          timeInJob: entry.timeInJob,
          timeInStage:
            entry.timeInStage,

          initial: person
            ? `${person.firstName[0]}${person.lastName[0]}`.toUpperCase()
            : "?",
        };
      });

  const [
    candidates,
    setCandidates,
  ] = useState(
    buildInitialCandidates(),
  );

  /*
   * Drag & Drop
   */
  const onDragStart = (
    e,
    entryId,
  ) => {
    e.dataTransfer.setData(
      "entryId",
      entryId,
    );
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (
    e,
    targetStage,
  ) => {
    const entryId =
      e.dataTransfer.getData(
        "entryId",
      );

    setCandidates((prev) =>
      prev.map((c) =>
        c.entryId === entryId
          ? {
              ...c,
              stage:
                targetStage,
            }
          : c,
      ),
    );
  };

  /*
   * Description handlers
   */
  const handleStartEditDescription =
    () => {
      setDescriptionDraft(
        description,
      );

      setIsEditingDescription(
        true,
      );
    };

  const handleSaveDescription = () => {
    setDescription(
      descriptionDraft,
    );

    setIsEditingDescription(
      false,
    );
  };

  const handleCancelEditDescription =
    () => {
      setIsEditingDescription(
        false,
      );
    };

  /*
   * Drop / Remove candidato
   */
  const handleDropCandidate = (
    candidate,
  ) => {
    setDroppingCandidate(
      candidate,
    );

    setDropForm({
      reason: "",
      observations: "",
    });

    setOpenCandidateMenuId(
      null,
    );

    setIsDropDrawerOpen(
      true,
    );
  };

  const handleRemoveCandidate = (
    candidate,
  ) => {
    setCandidates(
      candidates.filter(
        (c) =>
          c.entryId !==
          candidate.entryId,
      ),
    );

    setOpenCandidateMenuId(
      null,
    );
  };

  const handleSaveDrop = (e) => {
    e.preventDefault();

    setCandidates(
      candidates.map((c) =>
        c.entryId ===
        droppingCandidate.entryId
          ? {
              ...c,
              dropped: true,
              dropReason:
                dropForm.reason,
              dropObservations:
                dropForm.observations,
            }
          : c,
      ),
    );

    setIsDropDrawerOpen(
      false,
    );

    setDroppingCandidate(
      null,
    );
  };

  /*
   * Edit Job Details
   */
  const handleOpenEditJob = () => {
    setJobEditForm({
      title: job.title,
      city: job.city,
      state: job.state,
      country: job.country,
      workType: job.workType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      frequency: job.frequency,
      employmentType:
        job.employmentType,
    });

    setIsEditJobDrawerOpen(
      true,
    );
  };

  const handleSaveEditJob = (
    e,
  ) => {
    e.preventDefault();

    setJob({
      ...job,
      title:
        jobEditForm.title,
      city:
        jobEditForm.city,
      state:
        jobEditForm.state,
      country:
        jobEditForm.country,
      workType:
        jobEditForm.workType,
      salaryMin:
        Number(
          jobEditForm.salaryMin,
        ) || 0,
      salaryMax:
        Number(
          jobEditForm.salaryMax,
        ) || 0,
      currency:
        jobEditForm.currency,
      frequency:
        jobEditForm.frequency,
      employmentType:
        jobEditForm.employmentType,
    });

    setIsEditJobDrawerOpen(
      false,
    );
  };

  /*
   * Notes handlers
   */
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

    setEditingNoteId(
      note.id,
    );

    setOpenNoteMenuId(
      null,
    );

    setIsNoteDrawerOpen(
      true,
    );
  };

  const handleDeleteNote = (
    noteId,
  ) => {
    setJobNotesState(
      jobNotesState.filter(
        (n) =>
          n.id !== noteId,
      ),
    );

    setOpenNoteMenuId(
      null,
    );

    if (
      selectedNoteId === noteId
    ) {
      setSelectedNoteId(
        null,
      );
    }
  };

  const handleSaveNote = (e) => {
    e.preventDefault();

    if (
      !noteForm.title.trim()
    ) {
      return;
    }

    const today =
      new Date().toLocaleDateString(
        "pt-BR",
      );

    if (editingNoteId) {
      setJobNotesState(
        jobNotesState.map((n) =>
          n.id === editingNoteId
            ? {
                ...n,
                title:
                  noteForm.title,
                body:
                  noteForm.body,
                updatedBy:
                  "Bryan Santana",
                updatedAt:
                  today,
              }
            : n,
        ),
      );
    } else {
      const newNote = {
        id: `jn${jobNotesState.length + 1}-${Date.now()}`,
        jobId:
          job.id,
        title:
          noteForm.title,
        body:
          noteForm.body,
        createdBy:
          "Bryan Santana",
        createdAt:
          today,
        updatedBy:
          null,
        updatedAt:
          null,
      };

      setJobNotesState([
        newNote,
        ...jobNotesState,
      ]);

      setSelectedNoteId(
        newNote.id,
      );
    }

    setNoteForm({
      title: "",
      body: "",
    });

    setEditingNoteId(
      null,
    );

    setIsNoteDrawerOpen(
      false,
    );
  };

  /*
   * Interview Script handlers
   */
  const handleOpenNewScript =
    () => {
      setScriptForm({
        text: "",
      });

      setEditingScriptId(
        null,
      );

      setIsScriptDrawerOpen(
        true,
      );
    };

  const handleEditScript = (
    script,
  ) => {
    setScriptForm({
      text:
        script.text,
    });

    setEditingScriptId(
      script.id,
    );

    setOpenScriptMenuId(
      null,
    );

    setIsScriptDrawerOpen(
      true,
    );
  };

  const handleDeleteScript = (
    scriptId,
  ) => {
    setScripts(
      scripts.filter(
        (script) =>
          script.id !== scriptId,
      ),
    );

    setOpenScriptMenuId(
      null,
    );
  };

  const handleSaveScript = (
    e,
  ) => {
    e.preventDefault();

    if (
      !scriptForm.text.trim()
    ) {
      return;
    }

    const today =
      new Date().toLocaleDateString(
        "pt-BR",
      );

    if (editingScriptId) {
      setScripts(
        scripts.map(
          (script) =>
            script.id ===
            editingScriptId
              ? {
                  ...script,
                  text:
                    scriptForm.text,
                }
              : script,
        ),
      );
    } else {
      const newScript = {
        id: `sc${scripts.length + 1}-${Date.now()}`,
        text:
          scriptForm.text,
        createdBy:
          "Bryan Santana",
        date:
          today,
      };

      setScripts([
        newScript,
        ...scripts,
      ]);
    }

    setScriptForm({
      text: "",
    });

    setEditingScriptId(
      null,
    );

    setIsScriptDrawerOpen(
      false,
    );
  };

  /*
   * Job não encontrado
   */
  if (!job) {
    return (
      <div
        className={
          styles.container
        }
      >
        <p>
          Job not found.
        </p>
      </div>
    );
  }

  /*
   * Card do candidato
   */
  const renderCandidateCard = (
    candidate,
  ) => {
    const matchStyle =
      getMatchStyle(
        candidate.match,
      );

    const stageColor =
      PIPELINE_STAGES.find(
        (s) =>
          s.key ===
          candidate.stage,
      )?.color ||
      "#64748b";

    return (
      <div
        key={
          candidate.entryId
        }
        className={
          styles.card
        }
        draggable
        onDragStart={(e) =>
          onDragStart(
            e,
            candidate.entryId,
          )
        }
        style={{
          "--stage-color":
            stageColor,
        }}
      >
        <div
          className={
            styles.cardTop
          }
        >
          <div
            className={
              styles.cardTopLeft
            }
          >
            <div
              className={
                styles.candidateAvatar
              }
              style={{
                backgroundColor:
                  stageColor,
              }}
            >
              {
                candidate.initial
              }
            </div>

            <div
              className={
                styles.candidateDetails
              }
            >
              <Link
                href={`/candidates/${candidate.candidateId}`}
                className={
                  styles.candidateName
                }
              >
                {
                  candidate.name
                }
              </Link>

              <span
                className={
                  styles.candidateRole
                }
              >
                {
                  candidate.role
                }
              </span>
            </div>
          </div>

          <div
            className={
              styles.candidateMenuWrapper
            }
          >
            <button
              className={
                styles.menuBtn
              }
              title="More options"
              onClick={() =>
                setOpenCandidateMenuId(
                  openCandidateMenuId ===
                    candidate.entryId
                    ? null
                    : candidate.entryId,
                )
              }
            >
              <MoreVertical
                size={14}
              />
            </button>

            {openCandidateMenuId ===
              candidate.entryId && (
              <div
                className={
                  styles.candidateMenuDropdown
                }
              >
                <button
                  onClick={() =>
                    handleDropCandidate(
                      candidate,
                    )
                  }
                >
                  Drop
                </button>

                <button
                  className={
                    styles.candidateMenuRemove
                  }
                  onClick={() =>
                    handleRemoveCandidate(
                      candidate,
                    )
                  }
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={
            styles.cardFooter
          }
        >
          <span
            className={
              styles.matchWrapper
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <circle
                cx="8"
                cy="8"
                r={
                  DONUT_RADIUS
                }
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2.4"
              />

              <circle
                cx="8"
                cy="8"
                r={
                  DONUT_RADIUS
                }
                fill="none"
                stroke={
                  matchStyle.color
                }
                strokeWidth="2.4"
                strokeDasharray={
                  DONUT_CIRCUMFERENCE
                }
                strokeDashoffset={
                  DONUT_CIRCUMFERENCE *
                  (1 -
                    candidate.match /
                      100)
                }
                strokeLinecap="round"
                transform="rotate(-90 8 8)"
              />
            </svg>

            <span
              className={
                styles.matchValue
              }
              style={{
                color:
                  matchStyle.color,
              }}
            >
              {
                candidate.match
              }
              %
            </span>
          </span>

          <span
            className={
              styles.timesGroup
            }
          >
            <span
              className={
                styles.timeItem
              }
              title="Time in job"
            >
              <Clock
                size={11}
              />

              {
                candidate.timeInJob
              }
            </span>

            <span
              className={
                styles.timeItem
              }
              title="Time in this stage"
            >
              <Zap
                size={11}
              />

              {
                candidate.timeInStage
              }
            </span>
          </span>

          <button
            className={
              styles.eyeBtn
            }
            title="View candidate profile"
            onClick={() =>
              setSelectedCandidate(
                candidate,
              )
            }
          >
            <Eye
              size={14}
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={
        styles.container
      }
    >
      {/* HEADER */}
      <div
        className={
          styles.headerCard
        }
      >
        <div
          className={
            styles.headerTop
          }
        >
          <div
            className={
              styles.headerLeft
            }
          >
            <button
              className={
                styles.backBtn
              }
              onClick={() =>
                router.push(
                  "/jobs-board",
                )
              }
            >
              <ArrowLeft
                size={16}
              />
            </button>

            <div
              className={
                styles.jobLogo
              }
              style={{
                backgroundColor:
                  job.logoColor,
              }}
            >
              {
                job.initial
              }
            </div>

            <div>
              <div
                className={
                  styles.titleRow
                }
              >
                <h1>
                  {
                    job.title
                  }
                </h1>

                <span
                  className={`${
                    styles.statusBadge
                  } ${
                    job.status ===
                    "ACTIVE"
                      ? styles.active
                      : styles.onHold
                  }`}
                >
                  {job.status ===
                  "ACTIVE"
                    ? "ACTIVE"
                    : "ON HOLD"}
                </span>
              </div>

              <div
                className={
                  styles.companyName
                }
              >
                {
                  job.company
                }
              </div>

              <div
                className={
                  styles.metaRow
                }
              >
                <span>
                  <MapPin
                    size={13}
                  />

                  {job.city},{" "}
                  {job.state} -{" "}
                  {job.country}
                </span>

                <span>
                  {
                    job.employmentType
                  }
                </span>

                <span>
                  <DollarSign
                    size={13}
                  />

                  R${" "}
                  {
                    job.salaryMin
                  }{" "}
                  -{" "}
                  {
                    job.salaryMax
                  }{" "}
                  BRL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div
          className={
            styles.tabsRow
          }
        >
          {TABS.map(
            (tab) => (
              <button
                key={tab}
                className={`${
                  styles.tabBtn
                } ${
                  activeTab ===
                  tab
                    ? styles.activeTab
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(
                    tab,
                  )
                }
              >
                {
                  tab
                }
              </button>
            ),
          )}
        </div>
      </div>

      {/* CANDIDATES */}
      {activeTab ===
      "Candidates" ? (
        <div
          className={
            styles.boardWrapper
          }
        >
          <div
            className={
              styles.board
            }
          >
            {PIPELINE_STAGES.map(
              (stage) => (
                <div
                  key={
                    stage.key
                  }
                  className={
                    styles.column
                  }
                  onDragOver={
                    onDragOver
                  }
                  onDrop={(e) =>
                    onDrop(
                      e,
                      stage.key,
                    )
                  }
                >
                  <div
                    className={
                      styles.columnHeader
                    }
                  >
                    <div
                      className={
                        styles.stageTitleLeft
                      }
                    >
                      <span
                        className={
                          styles.stageDot
                        }
                        style={{
                          backgroundColor:
                            stage.color,
                        }}
                      />

                      <h3>
                        {
                          stage.label
                        }
                      </h3>
                    </div>

                    <span
                      className={
                        styles.badge
                      }
                    >
                      {
                        candidates.filter(
                          (c) =>
                            c.stage ===
                              stage.key &&
                            !c.dropped,
                        ).length
                      }
                    </span>
                  </div>

                  <div
                    className={
                      styles.cardList
                    }
                  >
                    {candidates
                      .filter(
                        (c) =>
                          c.stage ===
                            stage.key &&
                          !c.dropped,
                      )
                      .map(
                        (c) =>
                          renderCandidateCard(
                            c,
                          ),
                      )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

      /* DESCRIPTION */
      ) : activeTab ===
        "Description" ? (
        <div
          className={
            styles.descriptionGrid
          }
        >
          <div
            className={
              styles.card
            }
          >
            <div
              className={
                styles.cardHeader
              }
            >
              <h2>
                Job Description
              </h2>

              {!isEditingDescription && (
                <button
                  className={
                    styles.editIconBtn
                  }
                  onClick={
                    handleStartEditDescription
                  }
                  title="Edit description"
                >
                  <Pencil
                    size={15}
                  />
                </button>
              )}
            </div>

            {isEditingDescription ? (
              <>
                <textarea
                  className={
                    styles.descriptionTextarea
                  }
                  value={
                    descriptionDraft
                  }
                  onChange={(e) =>
                    setDescriptionDraft(
                      e.target.value,
                    )
                  }
                  rows={10}
                />

                <div
                  className={
                    styles.descriptionEditActions
                  }
                >
                  <button
                    className={
                      styles.cancelBtn
                    }
                    onClick={
                      handleCancelEditDescription
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className={
                      styles.saveDescriptionBtn
                    }
                    onClick={
                      handleSaveDescription
                    }
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <p
                className={
                  styles.descriptionText
                }
              >
                {
                  description
                }
              </p>
            )}
          </div>

          <div
            className={
              styles.card
            }
          >
            <div
              className={
                styles.cardHeader
              }
            >
              <h2>
                Job Details
              </h2>

              <button
                className={
                  styles.editIconBtn
                }
                onClick={
                  handleOpenEditJob
                }
                title="Edit job details"
              >
                <Pencil
                  size={15}
                />
              </button>
            </div>

            <div
              className={
                styles.infoList
              }
            >
              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Job ID
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.id
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Position Name
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.title
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Job Location
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {job.city},{" "}
                  {job.state} -{" "}
                  {job.country}
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Work Type
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.workType
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Minimum Salary
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.salaryMin.toLocaleString()
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Maximum Salary
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.salaryMax.toLocaleString()
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Currency
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.currency
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Frequency
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.frequency
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Contract Details
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.employmentType
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Open Date
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.openDate
                  }
                </span>
              </div>

              <div
                className={
                  styles.infoLine
                }
              >
                <span
                  className={
                    styles.label
                  }
                >
                  Close Date
                </span>

                <span
                  className={
                    styles.value
                  }
                >
                  {
                    job.closeDate ||
                    "-"
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

      /* NOTES */
      ) : activeTab ===
        "Notes" ? (
        <div
          className={
            styles.notesLayout
          }
        >
          <div
            className={
              styles.notesHeader
            }
          >
            <div
              className={
                styles.notesSearchWrapper
              }
            >
              <Search
                size={17}
                className={
                  styles.notesSearchIcon
                }
              />

              <input
                type="text"
                placeholder="Search notes..."
                value={
                  noteSearch
                }
                onChange={(e) =>
                  setNoteSearch(
                    e.target.value,
                  )
                }
                className={
                  styles.notesSearchInput
                }
              />
            </div>

            <button
              className={
                styles.newNoteBtn
              }
              onClick={
                handleOpenNewNote
              }
            >
              <Plus
                size={15}
              />
              New Note
            </button>
          </div>

          <div
            className={
              styles.notesGrid
            }
          >
            <div
              className={
                styles.notesList
              }
            >
              {filteredNotes.length >
              0 ? (
                filteredNotes.map(
                  (note) => (
                    <div
                      key={
                        note.id
                      }
                      className={`${
                        styles.noteListItem
                      } ${
                        selectedNote?.id ===
                        note.id
                          ? styles.noteListItemActive
                          : ""
                      }`}
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                      }}
                      onClick={() =>
                        setSelectedNoteId(
                          note.id,
                        )
                      }
                    >
                      <span
                        style={{
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          note.title
                        }
                      </span>

                      <div
                        className={
                          styles.candidateMenuWrapper
                        }
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        <button
                          className={
                            styles.menuBtn
                          }
                          onClick={() =>
                            setOpenNoteMenuId(
                              openNoteMenuId ===
                                note.id
                                ? null
                                : note.id,
                            )
                          }
                        >
                          <MoreVertical
                            size={13}
                          />
                        </button>

                        {openNoteMenuId ===
                          note.id && (
                          <div
                            className={
                              styles.candidateMenuDropdown
                            }
                          >
                            <button
                              onClick={() =>
                                handleEditNote(
                                  note,
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className={
                                styles.candidateMenuRemove
                              }
                              onClick={() =>
                                handleDeleteNote(
                                  note.id,
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div
                  className={
                    styles.emptyNotesList
                  }
                >
                  {noteSearch
                    ? "No notes match your search."
                    : "No notes yet."}
                </div>
              )}
            </div>

            <div
              className={
                styles.noteDetail
              }
            >
              {selectedNote ? (
                <>
                  <h3
                    className={
                      styles.noteDetailTitle
                    }
                  >
                    {
                      selectedNote.title
                    }
                  </h3>

                  <p
                    className={
                      styles.noteDetailBody
                    }
                  >
                    {
                      selectedNote.body
                    }
                  </p>

                  <div
                    className={
                      styles.noteDetailFooter
                    }
                  >
                    <span>
                      Created by{" "}
                      {
                        selectedNote.createdBy
                      }{" "}
                      on{" "}
                      {
                        selectedNote.createdAt
                      }
                    </span>

                    {selectedNote.updatedBy && (
                      <span>
                        Updated by{" "}
                        {
                          selectedNote.updatedBy
                        }{" "}
                        on{" "}
                        {
                          selectedNote.updatedAt
                        }
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div
                  className={
                    styles.emptyNoteDetail
                  }
                >
                  Select a note on the left to view its content.
                </div>
              )}
            </div>
          </div>
        </div>

      /* INTERVIEW SCRIPT */
      ) : activeTab ===
        "Interview Script" ? (
        <>
          <div
            className={
              styles.jobsToolbarRow
            }
          >
            <div
              style={{
                flex: 1,
              }}
            />

            <button
              className={
                styles.addToJobBtn
              }
              onClick={
                handleOpenNewScript
              }
            >
              <Plus
                size={15}
              />
              Add Interview
            </button>
          </div>

          <p
            className={
              styles.resultsCount
            }
          >
            {
              scripts.length
            }{" "}
            script
            {scripts.length !==
            1
              ? "s"
              : ""}
          </p>

          <div
            className={
              styles.scriptsList
            }
          >
            {scripts.length >
            0 ? (
              scripts.map(
                (script) => (
                  <div
                    key={
                      script.id
                    }
                    className={
                      styles.scriptCard
                    }
                  >
                    <div
                      className={
                        styles.scriptCardHeader
                      }
                    >
                      <span
                        className={
                          styles.scriptCardMeta
                        }
                      >
                        {
                          script.createdBy
                        }{" "}
                        ·{" "}
                        {
                          script.date
                        }
                      </span>

                      <div
                        className={
                          styles.candidateMenuWrapper
                        }
                      >
                        <button
                          className={
                            styles.menuBtn
                          }
                          onClick={() =>
                            setOpenScriptMenuId(
                              openScriptMenuId ===
                                script.id
                                ? null
                                : script.id,
                            )
                          }
                        >
                          <MoreVertical
                            size={14}
                          />
                        </button>

                        {openScriptMenuId ===
                          script.id && (
                          <div
                            className={
                              styles.candidateMenuDropdown
                            }
                          >
                            <button
                              onClick={() =>
                                handleEditScript(
                                  script,
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className={
                                styles.candidateMenuRemove
                              }
                              onClick={() =>
                                handleDeleteScript(
                                  script.id,
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p
                      className={
                        styles.scriptCardText
                      }
                    >
                      {
                        script.text
                      }
                    </p>
                  </div>
                ),
              )
            ) : (
              <div
                className={
                  styles.emptyJobsRow
                }
              >
                No scripts added yet.
              </div>
            )}
          </div>
        </>

      /* ATTACHMENTS */
      ) : activeTab ===
        "Attachments" ? (
        <>
          <div
            className={
              styles.jobsToolbarRow
            }
          >
            <div
              className={
                styles.jobsSearchWrapper
              }
            >
              <Search
                size={17}
                className={
                  styles.jobsSearchIcon
                }
              />

              <input
                type="text"
                placeholder="Search attachments..."
                value={
                  attachmentSearch
                }
                onChange={(e) =>
                  setAttachmentSearch(
                    e.target.value,
                  )
                }
                className={
                  styles.jobsSearchInput
                }
              />
            </div>

            <button
              className={
                styles.addToJobBtn
              }
              onClick={() =>
                setIsAttachmentDrawerOpen(
                  true,
                )
              }
            >
              <Plus
                size={15}
              />
              Add Document
            </button>
          </div>

          <p
            className={
              styles.resultsCount
            }
          >
            {
              filteredAttachments.length
            }{" "}
            document
            {filteredAttachments.length !==
            1
              ? "s"
              : ""}{" "}
            found
          </p>

          <div
            className={
              styles.jobsTableWrapper
            }
          >
            <table
              className={
                styles.documentsTable
              }
            >
              <thead>
                <tr>
                  <th>
                    Document Name
                  </th>

                  <th>
                    Document Type
                  </th>

                  <th>
                    Created By
                  </th>

                  <th>
                    Date
                  </th>

                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredAttachments.length >
                0 ? (
                  filteredAttachments.map(
                    (doc) => {
                      const typeStyle =
                        JOB_ATTACHMENT_TYPE_COLORS[
                          doc.type
                        ] ||
                        JOB_ATTACHMENT_TYPE_COLORS.Others;

                      return (
                        <tr
                          key={
                            doc.id
                          }
                        >
                          <td
                            className={
                              styles.documentNameCell
                            }
                          >
                            {
                              doc.name
                            }
                          </td>

                          <td>
                            <span
                              className={
                                styles.followUpSubjectBadge
                              }
                              style={{
                                color:
                                  typeStyle.color,
                                backgroundColor:
                                  typeStyle.bg,
                              }}
                            >
                              {
                                doc.type
                              }
                            </span>
                          </td>

                          <td>
                            {
                              doc.createdBy
                            }
                          </td>

                          <td
                            className={
                              styles.documentDateCell
                            }
                          >
                            {
                              doc.date
                            }
                          </td>

                          <td
                            className={
                              styles.meetingActionsCell
                            }
                          >
                            <button
                              className={
                                styles.meetingActionIcon
                              }
                              title="Download"
                            >
                              <Download
                                size={14}
                              />
                            </button>

                            <button
                              className={
                                styles.meetingActionIcon
                              }
                              title="More options"
                            >
                              <MoreVertical
                                size={14}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    },
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className={
                        styles.emptyJobsRow
                      }
                    >
                      No documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>

      /* FALLBACK */
      ) : (
        <div
          className={
            styles.placeholderTab
          }
        >
          <p>
            {
              activeTab
            }{" "}
            content coming soon.
          </p>
        </div>
      )}

      {/* DRAWER: Candidate Profile */}
      <div
        className={`${
          styles.drawer
        } ${
          selectedCandidate
            ? styles.drawerOpen
            : ""
        }`}
      >
        {selectedCandidate && (
          <>
            <div
              className={
                styles.drawerHeader
              }
            >
              <h2>
                Candidate Profile
              </h2>

              <button
                onClick={() =>
                  setSelectedCandidate(
                    null,
                  )
                }
              >
                <X
                  size={20}
                />
              </button>
            </div>

            <div
              className={
                styles.drawerBody
              }
            >
              <div
                className={
                  styles.drawerAvatar
                }
                style={{
                  backgroundColor:
                    PIPELINE_STAGES.find(
                      (s) =>
                        s.key ===
                        selectedCandidate.stage,
                    )?.color ||
                    "#64748b",
                }}
              >
                {
                  selectedCandidate.initial
                }
              </div>

              <h3
                className={
                  styles.drawerName
                }
              >
                {
                  selectedCandidate.name
                }
              </h3>

              <p
                className={
                  styles.drawerRole
                }
              >
                {
                  selectedCandidate.role
                }
              </p>

              <div
                className={
                  styles.drawerMatch
                }
                style={{
                  color:
                    getMatchStyle(
                      selectedCandidate.match,
                    ).color,
                  backgroundColor:
                    getMatchStyle(
                      selectedCandidate.match,
                    ).bg,
                }}
              >
                {
                  selectedCandidate.match
                }
                % Match with this job
              </div>

              <div
                className={
                  styles.drawerInfoLine
                }
              >
                <span
                  className={
                    styles.drawerLabel
                  }
                >
                  Time in job
                </span>

                <span
                  className={
                    styles.drawerValue
                  }
                >
                  {
                    selectedCandidate.timeInJob
                  }
                </span>
              </div>

              <div
                className={
                  styles.drawerInfoLine
                }
              >
                <span
                  className={
                    styles.drawerLabel
                  }
                >
                  Time in current stage
                </span>

                <span
                  className={
                    styles.drawerValue
                  }
                >
                  {
                    selectedCandidate.timeInStage
                  }
                </span>
              </div>

              <Link
                href={`/candidates/${selectedCandidate.candidateId}`}
                className={
                  styles.drawerViewProfileLink
                }
              >
                View full profile
              </Link>
            </div>
          </>
        )}
      </div>

      {selectedCandidate && (
        <div
          className={
            styles.drawerOverlay
          }
          onClick={() =>
            setSelectedCandidate(
              null,
            )
          }
        />
      )}

      {/* DRAWER: Drop Candidate */}
      <div
        className={`${
          styles.drawer
        } ${
          isDropDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div
          className={
            styles.drawerHeader
          }
        >
          <h2>
            Drop Candidate
          </h2>

          <button
            onClick={() =>
              setIsDropDrawerOpen(
                false,
              )
            }
          >
            <X
              size={20}
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSaveDrop
          }
          className={
            styles.drawerForm
          }
        >
          <div
            className={
              styles.inputGroup
            }
          >
            <label>
              Reason
            </label>

            <input
              type="text"
              required
              value={
                dropForm.reason
              }
              onChange={(e) =>
                setDropForm({
                  ...dropForm,
                  reason:
                    e.target.value,
                })
              }
            />
          </div>

          <div
            className={
              styles.inputGroup
            }
          >
            <label>
              Observations
            </label>

            <textarea
              rows={5}
              value={
                dropForm.observations
              }
              onChange={(e) =>
                setDropForm({
                  ...dropForm,
                  observations:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className={
              styles.saveBtn
            }
          >
            Confirm Drop
          </button>
        </form>
      </div>

      {/* DRAWER: Edit Job Details */}
      <div
        className={`${
          styles.drawer
        } ${
          isEditJobDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div
          className={
            styles.drawerHeader
          }
        >
          <h2>
            Edit Job Details
          </h2>

          <button
            onClick={() =>
              setIsEditJobDrawerOpen(
                false,
              )
            }
          >
            <X
              size={20}
            />
          </button>
        </div>

        {jobEditForm && (
          <form
            onSubmit={
              handleSaveEditJob
            }
            className={
              styles.drawerForm
            }
          >
            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                Position Name
              </label>

              <input
                type="text"
                required
                value={
                  jobEditForm.title
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    title:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                City
              </label>

              <input
                type="text"
                value={
                  jobEditForm.city
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    city:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                State
              </label>

              <input
                type="text"
                value={
                  jobEditForm.state
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    state:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                Country
              </label>

              <input
                type="text"
                value={
                  jobEditForm.country
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    country:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                Work Type
              </label>

              <select
                value={
                  jobEditForm.workType
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    workType:
                      e.target.value,
                  })
                }
              >
                <option value="Remote">
                  Remote
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="In Person">
                  In Person
                </option>
              </select>
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                Minimum Salary
              </label>

              <input
                type="number"
                value={
                  jobEditForm.salaryMin
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    salaryMin:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                Maximum Salary
              </label>

              <input
                type="number"
                value={
                  jobEditForm.salaryMax
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    salaryMax:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                Currency
              </label>

              <select
                value={
                  jobEditForm.currency
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    currency:
                      e.target.value,
                  })
                }
              >
                <option value="BRL">
                  BRL
                </option>

                <option value="USD">
                  USD
                </option>
              </select>
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                Frequency
              </label>

              <select
                value={
                  jobEditForm.frequency
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    frequency:
                      e.target.value,
                  })
                }
              >
                <option value="Hourly">
                  Hourly
                </option>

                <option value="Monthly">
                  Monthly
                </option>

                <option value="Annual">
                  Annual
                </option>
              </select>
            </div>

            <div
              className={
                styles.inputGroup
              }
            >
              <label>
                Contract Details
              </label>

              <select
                value={
                  jobEditForm.employmentType
                }
                onChange={(e) =>
                  setJobEditForm({
                    ...jobEditForm,
                    employmentType:
                      e.target.value,
                  })
                }
              >
                <option value="Full Time">
                  Full Time
                </option>

                <option value="Part Time">
                  Part Time
                </option>
              </select>
            </div>

            <button
              type="submit"
              className={
                styles.saveBtn
              }
            >
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* DRAWER: New / Edit Note */}
      <div
        className={`${
          styles.drawer
        } ${
          isNoteDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div
          className={
            styles.drawerHeader
          }
        >
          <h2>
            {editingNoteId
              ? "Edit Note"
              : "New Note"}
          </h2>

          <button
            onClick={() =>
              setIsNoteDrawerOpen(
                false,
              )
            }
          >
            <X
              size={20}
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSaveNote
          }
          className={
            styles.drawerForm
          }
        >
          <div
            className={
              styles.inputGroup
            }
          >
            <label>
              Title
            </label>

            <input
              type="text"
              required
              value={
                noteForm.title
              }
              onChange={(e) =>
                setNoteForm({
                  ...noteForm,
                  title:
                    e.target.value,
                })
              }
            />
          </div>

          <div
            className={
              styles.inputGroup
            }
          >
            <label>
              Note
            </label>

            <textarea
              rows={8}
              value={
                noteForm.body
              }
              onChange={(e) =>
                setNoteForm({
                  ...noteForm,
                  body:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className={
              styles.saveBtn
            }
          >
            {editingNoteId
              ? "Save Changes"
              : "Save Note"}
          </button>
        </form>
      </div>

      {/* DRAWER: Add / Edit Interview Script */}
      <div
        className={`${
          styles.drawer
        } ${
          isScriptDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div
          className={
            styles.drawerHeader
          }
        >
          <h2>
            {editingScriptId
              ? "Edit Script"
              : "Add Interview"}
          </h2>

          <button
            onClick={() =>
              setIsScriptDrawerOpen(
                false,
              )
            }
          >
            <X
              size={20}
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSaveScript
          }
          className={
            styles.drawerForm
          }
        >
          <div
            className={
              styles.inputGroup
            }
          >
            <label>
              Interview Script
            </label>

            <textarea
              rows={10}
              required
              value={
                scriptForm.text
              }
              onChange={(e) =>
                setScriptForm({
                  text:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className={
              styles.saveBtn
            }
          >
            {editingScriptId
              ? "Save Changes"
              : "Save Script"}
          </button>
        </form>
      </div>

      {/* DRAWER: Add Document */}
      <div
        className={`${
          styles.drawer
        } ${
          isAttachmentDrawerOpen
            ? styles.drawerOpen
            : ""
        }`}
      >
        <div
          className={
            styles.drawerHeader
          }
        >
          <h2>
            Add Document
          </h2>

          <button
            onClick={() =>
              setIsAttachmentDrawerOpen(
                false,
              )
            }
          >
            <X
              size={20}
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSaveAttachment
          }
          className={
            styles.drawerForm
          }
        >
          <div
            className={
              styles.inputGroup
            }
          >
            <label>
              Document Type
            </label>

            <select
              value={
                attachmentForm.type
              }
              onChange={(e) =>
                setAttachmentForm({
                  ...attachmentForm,
                  type:
                    e.target.value,
                })
              }
            >
              {JOB_ATTACHMENT_TYPES.map(
                (type) => (
                  <option
                    key={
                      type
                    }
                    value={
                      type
                    }
                  >
                    {
                      type
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          <div
            className={
              styles.inputGroup
            }
          >
            <label>
              File
            </label>

            <div
              className={
                styles.fileChooseRow
              }
            >
              <button
                type="button"
                className={
                  styles.chooseFileBtn
                }
                onClick={() =>
                  attachmentInputRef.current?.click()
                }
              >
                Choose File
              </button>

              <span
                className={
                  styles.fileNameText
                }
              >
                {attachmentForm.file
                  ? attachmentForm.file.name
                  : "No file chosen"}
              </span>

              <input
                ref={
                  attachmentInputRef
                }
                type="file"
                className={
                  styles.hiddenFileInput
                }
                onChange={(e) =>
                  setAttachmentForm({
                    ...attachmentForm,
                    file:
                      e.target.files?.[0] ||
                      null,
                  })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className={
              styles.saveBtn
            }
            disabled={
              !attachmentForm.file
            }
          >
            Upload Document
          </button>
        </form>
      </div>
    </div>
  );
}