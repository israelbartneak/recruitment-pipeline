"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import styles from "./candidates.module.css";
import { mockCandidates } from "./mockCandidates";
import { mockJobs } from "../jobs-board/mockJobs";
import {
  mockCandidateJobs,
  PIPELINE_STAGES,
} from "../jobs-board/mockCandidateJobs";

function getLatestApplication(candidateId) {
  const entries = mockCandidateJobs.filter(
    (e) => e.candidateId === candidateId,
  );

  if (entries.length === 0) return null;

  const latest = entries.reduce((a, b) =>
    new Date(a.matchCreatedDate.split("/").reverse().join("-")) >
    new Date(b.matchCreatedDate.split("/").reverse().join("-"))
      ? a
      : b,
  );

  const job = mockJobs.find((j) => j.id === latest.jobId);
  const stage = PIPELINE_STAGES.find((s) => s.key === latest.stage);

  return {
    jobTitle: job ? job.title : "-",
    stageLabel: stage ? stage.label : "-",
    stageColor: stage ? stage.color : "#64748b",
  };
}

export default function CandidatesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    city: "",
    state: "",
    country: "",
    appliedJob: "",
    phone: "",
    email: "",
    languages: "",
    pastPositions: "",
    keywords: "",
  });

  const [candidates] = useState(mockCandidates);

  const CANDIDATES_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      city: "",
      state: "",
      country: "",
      appliedJob: "",
      phone: "",
      email: "",
      languages: "",
      pastPositions: "",
      keywords: "",
    });

    setCurrentPage(1);
  };

  const filteredCandidates = candidates.filter((cand) => {
    const checkMatch = (field, filterValue) => {
      if (!filterValue) return true;

      if (Array.isArray(field)) {
        return field.some((item) =>
          item.toLowerCase().includes(filterValue.toLowerCase()),
        );
      }

      return field?.toLowerCase().includes(filterValue.toLowerCase());
    };

    const fullName = `${cand.firstName} ${cand.lastName}`;

    return (
      checkMatch(fullName, filters.name) &&
      checkMatch(cand.city, filters.city) &&
      checkMatch(cand.state, filters.state) &&
      checkMatch(cand.country, filters.country) &&
      checkMatch(cand.appliedJob, filters.appliedJob) &&
      checkMatch(cand.phone, filters.phone) &&
      checkMatch(cand.email, filters.email) &&
      checkMatch(cand.languages, filters.languages) &&
      checkMatch(cand.pastPositions, filters.pastPositions) &&
      checkMatch(cand.keywords, filters.keywords)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCandidates.length / CANDIDATES_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * CANDIDATES_PER_PAGE;

  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + CANDIDATES_PER_PAGE,
  );

  return (
    <div className={`${styles.container} ${styles.containerFullHeight}`}>
      <header className={styles.header}>
        <div>
          <h1>Candidates</h1>
          <div className={styles.accentLine}></div>
        </div>

        <button className={styles.addBtn}>
          <span className={styles.addBtnPlus}>+</span>
          Add Candidate
        </button>
      </header>

      {/* Advanced Search Accordion */}
      <section className={styles.filterCard}>
        <div className={styles.cardHeader}>
          <div className={styles.titleGroup}>
            <SlidersHorizontal size={16} color="#FE5102" />
            <h2>Advanced Search</h2>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.clearBtn}
              onClick={handleClearFilters}
            >
              <RotateCcw size={14} />
              Clear Filters
            </button>

            <button
              className={styles.toggleAccordionBtn}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              title={
                isFilterOpen
                  ? "Collapse search panel"
                  : "Expand search panel"
              }
            >
              {isFilterOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className={styles.filterGrid}>
            <div
              className={styles.inputGroup}
              style={{ gridColumn: "span 2" }}
            >
              <label>Candidate Name</label>

              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleInputChange}
                placeholder="e.g. Rodrigo Carreirão"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Country</label>

              <input
                type="text"
                name="country"
                value={filters.country}
                onChange={handleInputChange}
                placeholder="e.g. Brazil"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>State</label>

              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleInputChange}
                placeholder="e.g. PR"
              />
            </div>

            <div
              className={styles.inputGroup}
              style={{ gridColumn: "span 2" }}
            >
              <label>City</label>

              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleInputChange}
                placeholder="e.g. Curitiba"
              />
            </div>

            <div
              className={styles.inputGroup}
              style={{ gridColumn: "span 2" }}
            >
              <label>Job / Process Applied</label>

              <input
                type="text"
                name="appliedJob"
                value={filters.appliedJob}
                onChange={handleInputChange}
                placeholder="e.g. Backend Web Developer"
              />
            </div>

            <div
              className={styles.inputGroup}
              style={{ gridColumn: "span 2" }}
            >
              <label>Keywords</label>

              <input
                type="text"
                name="keywords"
                value={filters.keywords}
                onChange={handleInputChange}
                placeholder="e.g. Next.js, AI, SaaS"
              />
            </div>

            <div
              className={styles.inputGroup}
              style={{ gridColumn: "span 2" }}
            >
              <label>Past Work Positions</label>

              <input
                type="text"
                name="pastPositions"
                value={filters.pastPositions}
                onChange={handleInputChange}
                placeholder="e.g. Product Owner"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Languages</label>

              <input
                type="text"
                name="languages"
                value={filters.languages}
                onChange={handleInputChange}
                placeholder="e.g. English"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={filters.phone}
                onChange={handleInputChange}
                placeholder="e.g. +55 (41)"
              />
            </div>

            <div
              className={styles.inputGroup}
              style={{ gridColumn: "span 2" }}
            >
              <label>Email Address</label>

              <input
                type="text"
                name="email"
                value={filters.email}
                onChange={handleInputChange}
                placeholder="e.g. candidate@email.com"
              />
            </div>
          </div>
        )}
      </section>

      {/* Results Table */}
      <h3 className={styles.resultsTitle}>
        Candidates Found ({filteredCandidates.length}){" "}
        <span className={styles.totalRegisteredNote}>
          ({candidates.length} total in database)
        </span>
      </h3>

      <section className={styles.tableWrapper}>
        <table className={styles.listTable}>
          <colgroup>
            <col style={{ width: "3%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>

          <thead>
            <tr>
              <th>ID</th>
              <th>CANDIDATE NAME</th>
              <th>LOCATION</th>
              <th>CURRENT POSITION</th>
              <th>APPLICATION</th>
              <th>STATUS</th>
              <th>LANGUAGES</th>
              <th>PHONE</th>
              <th>EMAIL</th>
              <th>SOURCE</th>
              <th>CREATED BY</th>
              <th>CREATED DATE</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCandidates.length > 0 ? (
              paginatedCandidates.map((cand, index) => {
                const application = getLatestApplication(cand.id);

                return (
                  <tr key={cand.id}>
                    <td className={styles.truncateCell}>
                      {startIndex + index + 1}
                    </td>

                    <td className={styles.truncateCell}>
                      <Link
                        href={`/candidates/${cand.id}`}
                        className={styles.candidateNameCell}
                      >
                        <img
                          src={cand.photoUrl}
                          alt={`${cand.firstName} ${cand.lastName}`}
                          className={styles.candidateThumb}
                        />

                        <span>
                          {cand.firstName} {cand.lastName}
                        </span>
                      </Link>
                    </td>

                    <td
                      className={styles.truncateCell}
                      title={`${cand.city}, ${cand.state}`}
                    >
                      {cand.city}, {cand.state}
                    </td>

                    <td
                      className={styles.truncateCell}
                      title={cand.currentPosition}
                    >
                      {cand.currentPosition || "-"}
                    </td>

                    <td
                      className={`${styles.truncateCell} ${styles.applicationCell}`}
                      title={
                        application
                          ? application.jobTitle
                          : cand.appliedJob
                      }
                    >
                      {application
                        ? application.jobTitle
                        : cand.appliedJob}
                    </td>

                    <td className={styles.truncateCell}>
                      {application ? (
                        <span
                          className={styles.statusBadgeSmall}
                          style={{
                            color: application.stageColor,
                            backgroundColor: `${application.stageColor}1A`,
                          }}
                        >
                          {application.stageLabel}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td
                      className={styles.truncateCell}
                      title={cand.languages.join(", ")}
                    >
                      {cand.languages.join(", ")}
                    </td>

                    <td
                      className={styles.truncateCell}
                      title={cand.phone}
                    >
                      {cand.phone}
                    </td>

                    <td
                      className={styles.truncateCell}
                      title={cand.email}
                    >
                      {cand.email}
                    </td>

                    <td className={styles.truncateCell}>
                      {cand.source || "-"}
                    </td>

                    <td className={styles.truncateCell}>
                      {cand.createdBy || "-"}
                    </td>

                    <td className={styles.truncateCell}>
                      {cand.createdDate}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className={styles.emptyState}
                >
                  No candidates found matching the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.paginationFooter}>
          <button
            className={styles.pageNavBtn}
            onClick={() =>
              setCurrentPage((p) => Math.max(1, p - 1))
            }
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>

          <div className={styles.pageNumbers}>
            {Array.from(
              { length: totalPages },
              (_, i) => i + 1,
            ).map((page) => (
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
            ))}
          </div>

          <button
            className={styles.pageNavBtn}
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(totalPages, p + 1),
              )
            }
            disabled={safeCurrentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}