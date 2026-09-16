// src/app/jobs-board/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Play, Pause, X } from "lucide-react";
import { mockJobs } from "./mockJobs";
import { mockClients } from "../clients/mockClients";
import styles from "./jobs.module.css";

export default function JobsBoardPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [jobs, setJobs] = useState(mockJobs);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const emptyJobForm = {
    positionName: "",
    clientId: "",
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

  const [jobForm, setJobForm] = useState(emptyJobForm);

  const FORMAT_OPTIONS = ["Full Time", "Part Time"];
  const CURRENCY_OPTIONS = ["BRL", "USD"];
  const FREQUENCY_OPTIONS = ["Hourly", "Monthly", "Annual"];

  const handleSaveJob = (e) => {
    e.preventDefault();

    const selectedClient = mockClients.find(
      (c) => c.id === jobForm.clientId,
    );

    const newJob = {
      id: `${(jobForm.positionName || "new-job")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      title: jobForm.positionName || "New Position",
      company: selectedClient ? selectedClient.name : "Unknown Client",
      clientId: jobForm.clientId,
      stage: "new",
      clientStatus: "BPO",
      isHold: false,
      initial: selectedClient ? selectedClient.initials : "??",
      logoColor: "0c4a6e",
      logoUrl: selectedClient ? selectedClient.logoUrl : "",
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

    setJobs([...jobs, newJob]);
    setJobForm(emptyJobForm);
    setIsDrawerOpen(false);
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

  // Vagas inativas moram na página /jobs-board/inactive,
  // não entram no board principal
  const boardJobs = jobs.filter((j) => j.status !== "INACTIVE");

  const visibleJobs = boardJobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "All") {
      return matchesSearch;
    }

    return matchesSearch && j.clientStatus === activeFilter;
  });

  const renderJobCard = (job) => (
    <div key={job.id} className={styles.jobCard}>
      <div className={styles.jobCardTop}>
        <img
          src={job.logoUrl}
          alt={job.company}
          className={styles.jobCardLogo}
        />

        <div className={styles.jobCardInfo}>
          <h4
            className={styles.jobCardTitle}
            onClick={() => router.push(`/jobs-board/${job.id}`)}
          >
            {job.title}
          </h4>

          <span className={styles.jobCardCompany}>
            {job.company}
          </span>

          <span className={styles.jobCardType}>
            {job.employmentType}
          </span>
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
        <div className={`${styles.container} ${styles.containerFullHeight}`}>
           <header className={styles.header}>
        <div>
          <h1>Jobs</h1>
          <div className={styles.accentLine}></div>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => setIsDrawerOpen(true)}
        >
          <Plus size={16} />
          New Job
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
              className={`${styles.filterBtn} ${
                activeFilter === f.value
                  ? styles.filterBtnActive
                  : ""
              }`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Contador de resultados + acesso a Inactive Jobs */}
      <div className={styles.resultsRow}>
        <p className={styles.resultsCount}>
          {visibleJobs.length} jobs found
          {" "}
          <span className={styles.totalRegisteredNote}>
            ({boardJobs.length} total in pipeline)
          </span>
        </p>
        <Link
          href="/jobs-board/inactive"
          className={styles.inactiveLink}
        >
          View Inactive Jobs
        </Link>
      </div>

      <div className={styles.boardWrapper}>
        <div className={styles.board}>
          {/* NEW */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#64748b" }}
                ></span>

                <h3>New Opening</h3>
              </div>

              <span className={styles.badge}>
                {
                  visibleJobs.filter(
                    (j) => j.stage === "new",
                  ).length
                }
              </span>
            </div>

            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "new")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* RECRUITING */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#1d4ed8" }}
                ></span>

                <h3>Sourcing & Screening</h3>
              </div>

              <span className={styles.badge}>
                {
                  visibleJobs.filter(
                    (j) => j.stage === "process",
                  ).length
                }
              </span>
            </div>

            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "process")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* SUBMITTED */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#b45309" }}
                ></span>

                <h3>Client Submission</h3>
              </div>

              <span className={styles.badge}>
                {
                  visibleJobs.filter(
                    (j) => j.stage === "submitted",
                  ).length
                }
              </span>
            </div>

            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "submitted")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* CLIENT INTERVIEW */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#c2410c" }}
                ></span>

                <h3>Client Interview</h3>
              </div>

              <span className={styles.badge}>
                {
                  visibleJobs.filter(
                    (j) => j.stage === "client_interview",
                  ).length
                }
              </span>
            </div>

            <div className={styles.cardList}>
              {visibleJobs
                .filter(
                  (j) => j.stage === "client_interview",
                )
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* OFFER & ONBOARDING */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#7c3aed" }}
                ></span>

                <h3>Offer & Onboarding</h3>
              </div>

              <span className={styles.badge}>
                {
                  visibleJobs.filter(
                    (j) => j.stage === "onboarding",
                  ).length
                }
              </span>
            </div>

            <div className={styles.cardList}>
              {visibleJobs
                .filter((j) => j.stage === "onboarding")
                .map((j) => renderJobCard(j))}
            </div>
          </div>

          {/* CONCLUDED */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.stageTitleLeft}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: "#15803d" }}
                ></span>

                <h3>Concluded</h3>
              </div>

              <span className={styles.badge}>
                {
                  visibleJobs.filter(
                    (j) => j.stage === "concluded",
                  ).length
                }
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

      {/* Drawer: New Job */}
      <div
        className={`${styles.drawer} ${
          isDrawerOpen ? styles.drawerOpen : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <h2>New Job</h2>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
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
                  positionName: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Client</label>

            <select
              required
              value={jobForm.clientId}
              onChange={(e) =>
                setJobForm({
                  ...jobForm,
                  clientId: e.target.value,
                })
              }
            >
              <option value="">
                Select a client...
              </option>

              {mockClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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
                style={{ gridColumn: "1 / -1" }}
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
                    numberOfPositions: e.target.value,
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
                      salaryMin: e.target.value,
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
                      salaryMax: e.target.value,
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
                  description: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className={styles.saveBtn}
          >
            Save Job
          </button>
        </form>
      </div>
    </div>
  );
}