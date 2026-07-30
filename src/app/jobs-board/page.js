// src/app/jobs-board/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Play, Pause } from "lucide-react";
import { mockJobs } from "./mockJobs";
import styles from "./jobs.module.css";

export default function JobsBoardPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [jobs, setJobs] = useState(mockJobs);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("jobId", id);
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, targetStage) => {
    const id = e.dataTransfer.getData("jobId");
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, stage: targetStage } : job)),
    );
  };

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Direct Hire", value: "DIRECT_HIRE" },
    { label: "Temp", value: "TEMP" },
    { label: "EOR", value: "EOR" },
    { label: "BPO", value: "BPO" },
    { label: "Bid", value: "BID" },
    { label: "Internal", value: "INTERNAL" },
  ];

  // Vagas inativas moram na página /jobs-board/inactive, não entram no board principal
  const boardJobs = jobs.filter((j) => j.status !== "INACTIVE");

  const visibleJobs = boardJobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === "All") return matchesSearch;
    return matchesSearch && j.clientStatus === activeFilter;
  });

  const renderJobCard = (job) => (
    <div
      key={job.id}
      className={styles.jobCard}
      draggable
      onDragStart={(e) => onDragStart(e, job.id)}
    >
      <div className={styles.jobCardTop}>
        <img src={job.logoUrl} alt={job.company} className={styles.jobCardLogo} />

        <div className={styles.jobCardInfo}>
          <h4
            className={styles.jobCardTitle}
            onClick={() => router.push(`/jobs-board/${job.id}`)}
          >
            {job.title}
          </h4>
          <span className={styles.jobCardCompany}>{job.company}</span>
          <span className={styles.jobCardType}>{job.employmentType}</span>
        </div>

        {job.isHold ? (
          <span className={styles.statusHold} title="On hold">
            <Pause size={8} fill="#ffffff" color="#ffffff" />
          </span>
        ) : (
          <span className={styles.statusActive} title="Active">
            <Play size={8} fill="#ffffff" color="#ffffff" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Jobs</h1>
          <span className={styles.totalBadge}>
            {boardJobs.length} jobs in pipeline
          </span>
        </div>
        <button className={styles.addBtn}>
          <Plus size={16} /> New Job
        </button>
      </header>

      {/* Busca + Filtros por Tipo de Contrato do Cliente Vinculado */}
      <section className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search job title or client..."
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

      {/* Contador de resultados + acesso a Inactive Jobs, na mesma linha */}
      <div className={styles.resultsRow}>
        <p className={styles.resultsCount}>{visibleJobs.length} jobs found</p>
        <Link href="/jobs-board/inactive" className={styles.inactiveLink}>
          View Inactive Jobs
        </Link>
      </div>

      <div className={styles.boardWrapper}>
        <div className={styles.board}>
          {/* NEW */}
          <div
            className={styles.column}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, "new")}
          >
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#64748b" }}
                ></span>
                <h3>New</h3>
              </div>
              <span className={styles.badge}>
                {visibleJobs.filter((j) => j.stage === "new").length}
              </span>
            </div>
            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "new")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* RECRUITING */}
          <div
            className={styles.column}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, "process")}
          >
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#1d4ed8" }}
                ></span>
                <h3>Recruiting</h3>
              </div>
              <span className={styles.badge}>
                {visibleJobs.filter((j) => j.stage === "process").length}
              </span>
            </div>
            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "process")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* SUBMITTED */}
          <div
            className={styles.column}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, "submitted")}
          >
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#b45309" }}
                ></span>
                <h3>Submitted</h3>
              </div>
              <span className={styles.badge}>
                {visibleJobs.filter((j) => j.stage === "submitted").length}
              </span>
            </div>
            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "submitted")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* CLIENT INTERVIEW */}
          <div
            className={styles.column}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, "client_interview")}
          >
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#c2410c" }}
                ></span>
                <h3>Client Interview</h3>
              </div>
              <span className={styles.badge}>
                {visibleJobs.filter((j) => j.stage === "client_interview").length}
              </span>
            </div>
            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "client_interview")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* OFFER & ONBOARDING */}
          <div
            className={styles.column}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, "onboarding")}
          >
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#7c3aed" }}
                ></span>
                <h3>Offer & Onboarding</h3>
              </div>
              <span className={styles.badge}>
                {visibleJobs.filter((j) => j.stage === "onboarding").length}
              </span>
            </div>
            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "onboarding")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* CONCLUDED */}
          <div
            className={styles.column}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, "concluded")}
          >
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#15803d" }}
                ></span>
                <h3>Concluded</h3>
              </div>
              <span className={styles.badge}>
                {visibleJobs.filter((j) => j.stage === "concluded").length}
              </span>
            </div>
            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "concluded")
                .map((j) => renderJobCard(j))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}