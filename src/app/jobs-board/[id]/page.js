// src/app/jobs-board/[id]/page.js
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  MoreVertical,
  Eye,
  Clock,
  Zap,
  X,
} from "lucide-react";
import { mockJobs } from "../mockJobs";
import styles from "./jobPosition.module.css";

const STAGES = [
  { key: "new", label: "New Candidates", color: "#64748b" },
  { key: "qualified", label: "Qualified", color: "#64748b" },
  { key: "outreached", label: "Outreached", color: "#0ea5e9" },
  { key: "replied", label: "Replied", color: "#0ea5e9" },
  { key: "scheduled", label: "Scheduled", color: "#0ea5e9" },
  { key: "screened", label: "Screened", color: "#eab308" },
  { key: "creating_material", label: "Creating Material", color: "#eab308" },
  { key: "send_to_client", label: "Send to Client", color: "#b45309" },
  { key: "submitted", label: "Submitted", color: "#b45309" },
  { key: "client_interview", label: "Client Interview", color: "#c2410c" },
  { key: "offered", label: "Offered", color: "#7c3aed" },
  { key: "hired", label: "Hired", color: "#15803d" },
  { key: "started", label: "Started", color: "#15803d" },
  { key: "probation_passed", label: "Probation Passed", color: "#15803d" },
];

const TABS = ["Candidates", "Description", "Notes", "Interview Script", "Attachments"];

function getMatchStyle(match) {
  if (match >= 60) return { color: "#15803d", bg: "#dcfce7" };
  if (match >= 40) return { color: "#c2410c", bg: "#ffedd5" };
  return { color: "#dc2626", bg: "#fee2e2" };
}

const DONUT_RADIUS = 6.5;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export default function JobPositionPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Candidates");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const job = mockJobs.find((j) => j.id === params.id);

  const [candidates, setCandidates] = useState([
    { id: "c1", name: "Maria Eduarda F.", role: "Analista de marketing", stage: "new", initial: "ME", color: "#64748b", dropped: false, match: 45, timeInJob: "2w", timeInStage: "2w" },
    { id: "c2", name: "Ana Dalzotto", role: "Media Specialist", stage: "screened", initial: "AD", color: "#eab308", dropped: false, match: 23, timeInJob: "1mo", timeInStage: "1mo" },
    { id: "c3", name: "Isabella Monteiro", role: "Social Media - Analista Pleno", stage: "send_to_client", initial: "IM", color: "#b45309", dropped: false, match: 11, timeInJob: "1mo", timeInStage: "1mo" },
    { id: "c4", name: "Lucas Garay", role: "Community Manager", stage: "submitted", initial: "LG", color: "#b45309", dropped: false, match: 34, timeInJob: "1mo", timeInStage: "1w" },
    { id: "c5", name: "Regeane Aparecida", role: "Social Media and Video Script", stage: "client_interview", initial: "RA", color: "#c2410c", dropped: false, match: 34, timeInJob: "1mo", timeInStage: "1w" },
    { id: "c6", name: "Ana Luiza Ferreira", role: "Media Marketing Analyst", stage: "client_interview", initial: "AF", color: "#c2410c", dropped: false, match: 66, timeInJob: "1mo", timeInStage: "1w" },
    { id: "c7", name: "Gabriela Martins", role: "Marketing & Content", stage: "offered", initial: "GM", color: "#7c3aed", dropped: false, match: 23, timeInJob: "1mo", timeInStage: "4d" },
    { id: "c8", name: "Rafael Souza", role: "Content Creator", stage: "new", initial: "RS", color: "#64748b", dropped: true, match: 50, timeInJob: "1w", timeInStage: "1w" },
    { id: "c9", name: "Paulo Roberto S.", role: "Senior Video Editor", stage: "client_interview", initial: "PRS", color: "#7c3aed", dropped: false, match: 50, timeInJob: "1w", timeInStage: "1w" },
    { id: "c10", name: "Cyndhara Galdino", role: "Videomaker, Social Media, Editor @ Freelance Professional", stage: "client_interview", initial: "CGS", color: "#eab308", dropped: false, match: 68, timeInJob: "6d", timeInStage: "6d" },
  ]);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("candidateId", id);
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, targetStage) => {
    const id = e.dataTransfer.getData("candidateId");
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: targetStage } : c)),
    );
  };

  if (!job) {
    return (
      <div className={styles.container}>
        <p>Job not found.</p>
      </div>
    );
  }

  const renderCandidateCard = (candidate) => {
    const matchStyle = getMatchStyle(candidate.match);

    return (
      <div
        key={candidate.id}
        className={styles.card}
        draggable
        onDragStart={(e) => onDragStart(e, candidate.id)}
        style={{ "--stage-color": candidate.color }}
      >
        <div className={styles.cardTop}>
          <div className={styles.cardTopLeft}>
            <div className={styles.candidateAvatar} style={{ backgroundColor: candidate.color }}>
              {candidate.initial}
            </div>
            <div className={styles.candidateDetails}>
              <h4 className={styles.candidateName}>{candidate.name}</h4>
              <span className={styles.candidateRole}>{candidate.role}</span>
            </div>
          </div>
          <button className={styles.menuBtn} title="More options">
            <MoreVertical size={14} />
          </button>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.matchWrapper}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle
                cx="8"
                cy="8"
                r={DONUT_RADIUS}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2.4"
              />
              <circle
                cx="8"
                cy="8"
                r={DONUT_RADIUS}
                fill="none"
                stroke={matchStyle.color}
                strokeWidth="2.4"
                strokeDasharray={DONUT_CIRCUMFERENCE}
                strokeDashoffset={DONUT_CIRCUMFERENCE * (1 - candidate.match / 100)}
                strokeLinecap="round"
                transform="rotate(-90 8 8)"
              />
            </svg>
            <span className={styles.matchValue} style={{ color: matchStyle.color }}>
              {candidate.match}%
            </span>
          </span>

          <span className={styles.timesGroup}>
            <span className={styles.timeItem} title="Time in job">
              <Clock size={11} /> {candidate.timeInJob}
            </span>
            <span className={styles.timeItem} title="Time in this stage">
              <Zap size={11} /> {candidate.timeInStage}
            </span>
          </span>

          <button
            className={styles.eyeBtn}
            title="View candidate profile"
            onClick={() => setSelectedCandidate(candidate)}
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={() => router.push("/jobs-board")}>
              <ArrowLeft size={16} />
            </button>
            <div className={styles.jobLogo} style={{ backgroundColor: job.logoColor }}>
              {job.initial}
            </div>
            <div>
              <div className={styles.titleRow}>
                <h1>{job.title}</h1>
                <span className={`${styles.statusBadge} ${job.status === "ACTIVE" ? styles.active : styles.onHold}`}>
                  {job.status === "ACTIVE" ? "ACTIVE" : "ON HOLD"}
                </span>
              </div>
              <div className={styles.companyName}>{job.company}</div>
              <div className={styles.metaRow}>
                <span>
                  <MapPin size={13} /> {job.location}
                </span>
                <span>
                  <DollarSign size={13} /> R$ {job.salaryMin} - {job.salaryMax} BRL
                </span>
              </div>
            </div>
          </div>
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

      {activeTab === "Candidates" ? (
        <div className={styles.boardWrapper}>
          <div className={styles.board}>
            {STAGES.map((stage) => (
              <div
                key={stage.key}
                className={styles.column}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, stage.key)}
              >
                <div className={styles.columnHeader}>
                  <div className={styles.stageTitleLeft}>
                    <span className={styles.stageDot} style={{ backgroundColor: stage.color }}></span>
                    <h3>{stage.label}</h3>
                  </div>
                  <span className={styles.badge}>
                    {candidates.filter((c) => c.stage === stage.key && !c.dropped).length}
                  </span>
                </div>
                <div className={styles.cardList}>
                  {candidates
                    .filter((c) => c.stage === stage.key && !c.dropped)
                    .map((c) => renderCandidateCard(c))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.placeholderTab}>
          <p>{activeTab} content coming soon.</p>
        </div>
      )}

      {/* Drawer lateral do perfil do candidato */}
      <div className={`${styles.drawer} ${selectedCandidate ? styles.drawerOpen : ""}`}>
        {selectedCandidate && (
          <>
            <div className={styles.drawerHeader}>
              <h2>Candidate Profile</h2>
              <button onClick={() => setSelectedCandidate(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div
                className={styles.drawerAvatar}
                style={{ backgroundColor: selectedCandidate.color }}
              >
                {selectedCandidate.initial}
              </div>
              <h3 className={styles.drawerName}>{selectedCandidate.name}</h3>
              <p className={styles.drawerRole}>{selectedCandidate.role}</p>

              <div
                className={styles.drawerMatch}
                style={getMatchStyle(selectedCandidate.match) && {
                  color: getMatchStyle(selectedCandidate.match).color,
                  backgroundColor: getMatchStyle(selectedCandidate.match).bg,
                }}
              >
                {selectedCandidate.match}% Match with this job
              </div>

              <div className={styles.drawerInfoLine}>
                <span className={styles.drawerLabel}>Time in job</span>
                <span className={styles.drawerValue}>{selectedCandidate.timeInJob}</span>
              </div>
              <div className={styles.drawerInfoLine}>
                <span className={styles.drawerLabel}>Time in current stage</span>
                <span className={styles.drawerValue}>{selectedCandidate.timeInStage}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Overlay que fecha o drawer ao clicar fora */}
      {selectedCandidate && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}