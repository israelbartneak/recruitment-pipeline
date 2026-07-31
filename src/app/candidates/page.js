"use client";
import { useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  RotateCcw,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import styles from "./candidates.module.css";

export default function CandidatesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);

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

  const [candidates] = useState([
    {
      id: "CAND-2026-001",
      firstName: "Rodrigo",
      lastName: "Carreirão",
      city: "Curitiba",
      state: "PR",
      country: "Brazil",
      phone: "+55 (41) 99999-1111",
      email: "rodrigo.c@frontall.com",
      appliedJob: "Product Management Consultant",
      languages: ["Portuguese", "English"],
      pastPositions: ["Product Owner", "Scrum Master"],
      keywords: ["Agile", "Roadmap", "SaaS"],
    },
    {
      id: "CAND-2026-002",
      firstName: "Gustavo",
      lastName: "Hammer",
      city: "São Paulo",
      state: "SP",
      country: "Brazil",
      phone: "+55 (11) 98888-2222",
      email: "gustavo.h@outlook.com",
      appliedJob: "SaaS IT Engineer",
      languages: ["Portuguese", "English", "Spanish"],
      pastPositions: ["Full Stack Developer", "DevOps"],
      keywords: ["AI", "Integrations", "Cloud"],
    },
    {
      id: "CAND-2026-003",
      firstName: "Alexandre",
      lastName: "Pinto",
      gender: "Male",
      city: "Belo Horizonte",
      state: "MG",
      country: "Brazil",
      phone: "+55 (31) 97777-3333",
      email: "alexandre.pinto@dev.io",
      appliedJob: "Backend Web Developer",
      languages: ["Portuguese", "English"],
      pastPositions: ["Software Developer"],
      keywords: ["Node.js", "MongoDB", "React"],
    },
    {
      id: "CAND-2026-004",
      firstName: "Alexandre",
      lastName: "Valença",
      city: "Florianópolis",
      state: "SC",
      country: "Brazil",
      phone: "+55 (48) 96666-4444",
      email: "alexandre.v@sistemas.com.br",
      appliedJob: "Full Stack Developer",
      languages: ["Portuguese"],
      pastPositions: ["Backend Developer"],
      keywords: ["TypeScript", "Express", "SQL"],
    },
    {
      id: "CAND-2026-005",
      firstName: "John",
      lastName: "Doe",
      city: "Miami",
      state: "FL",
      country: "United States",
      phone: "+1 (305) 555-0199",
      email: "john.doe@techrec.com",
      appliedJob: "Backend Web Developer",
      languages: ["English"],
      pastPositions: ["Software Engineer"],
      keywords: ["Next.js", "MongoDB", "TypeScript"],
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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

  // Função auxiliar para gerar o slug da URL limpo sem acentos
  const generateSlug = (firstName, lastName) => {
    return `${firstName}-${lastName}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Candidates</h1>
          <span className={styles.totalBadge}>
            {candidates.length} talents in database
          </span>
        </div>
        <button className={styles.addBtn}>
          <UserPlus size={16} /> Add Candidate
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
            <button className={styles.clearBtn} onClick={handleClearFilters}>
              <RotateCcw size={14} /> Clear Filters
            </button>
            <button
              className={styles.toggleAccordionBtn}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              title={
                isFilterOpen ? "Collapse search panel" : "Expand search panel"
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
            <div className={styles.inputGroup} style={{ gridColumn: "span 2" }}>
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

            <div className={styles.inputGroup} style={{ gridColumn: "span 2" }}>
              <label>City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleInputChange}
                placeholder="e.g. Curitiba"
              />
            </div>
            <div className={styles.inputGroup} style={{ gridColumn: "span 2" }}>
              <label>Job / Process Applied</label>
              <input
                type="text"
                name="appliedJob"
                value={filters.appliedJob}
                onChange={handleInputChange}
                placeholder="e.g. Backend Web Developer"
              />
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: "span 2" }}>
              <label>Keywords</label>
              <input
                type="text"
                name="keywords"
                value={filters.keywords}
                onChange={handleInputChange}
                placeholder="e.g. Next.js, AI, SaaS"
              />
            </div>
            <div className={styles.inputGroup} style={{ gridColumn: "span 2" }}>
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
            <div className={styles.inputGroup} style={{ gridColumn: "span 2" }}>
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
        Candidates Found ({filteredCandidates.length})
      </h3>

      <section className={styles.tableWrapper}>
        <table className={styles.listTable}>
          <thead>
            <tr>
              <th style={{ width: "130px" }}>SYSTEM ID</th>
              <th style={{ width: "180px" }}>CANDIDATE</th>
              <th style={{ width: "220px" }}>LOCATION</th>
              <th style={{ width: "220px" }}>JOB / PROCESS</th>
              <th>HISTORY</th>
              <th style={{ width: "180px" }}>LANGUAGES</th>
              <th style={{ width: "200px" }}>CONTACTS</th>
              <th className={styles.actionsColumn}></th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((cand) => (
                <tr key={cand.id}>
                  <td className={styles.idCell}>{cand.id}</td>
                  <td className={styles.primaryText}>
                    <Link
                      href={`/candidates/${generateSlug(
                        cand.firstName,
                        cand.lastName,
                      )}`}
                      className={styles.candidateNameLink}
                    >
                      {cand.firstName} {cand.lastName}
                    </Link>
                  </td>

                  <td>
                    <div className={styles.cellItem}>
                      <MapPin size={13} className={styles.cellIcon} />
                      <span>
                        {cand.city}, {cand.state} - {cand.country}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className={styles.jobItem}>
                      <Briefcase size={13} className={styles.cellIcon} />
                      <span>{cand.appliedJob}</span>
                    </div>
                  </td>

                  <td className={styles.historyCell}>
                    {cand.pastPositions.join(", ")}
                  </td>

                  <td>
                    <div className={styles.cellItem}>
                      <Globe size={13} className={styles.cellIcon} />
                      <span>{cand.languages.join(", ")}</span>
                    </div>
                  </td>

                  <td>
                    <div className={styles.contactGroup}>
                      <div className={styles.cellItem}>
                        <Phone size={11} className={styles.cellIcon} />{" "}
                        {cand.phone}
                      </div>
                      <div
                        className={styles.cellItem}
                        style={{ marginTop: "3px" }}
                      >
                        <Mail size={11} className={styles.cellIcon} />{" "}
                        {cand.email}
                      </div>
                    </div>
                  </td>

                  <td className={styles.actionsColumn}>
                    <button className={styles.actionRowBtn}>
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.emptyState}>
                  No candidates found matching the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}