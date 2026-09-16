// src/app/jobs-board/inactive/page.js
"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { mockJobs } from "../mockJobs";
import styles from "./inactiveJobs.module.css";

export default function InactiveJobsPage() {
  const router = useRouter();

  const inactiveJobs = mockJobs.filter((j) => j.status === "INACTIVE");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/jobs-board")}>
          <ArrowLeft size={16} />
        </button>
        <div className={styles.titleArea}>
          <h1>Inactive Jobs</h1>
          <span className={styles.totalBadge}>
            {inactiveJobs.length} archived positions
          </span>
        </div>
      </header>

      <section className={styles.grid}>
        {inactiveJobs.length > 0 ? (
          inactiveJobs.map((job) => (
            <div
              key={job.id}
              className={styles.jobCard}
              onClick={() => router.push(`/jobs-board/${job.id}`)}
            >
              <img src={job.logoUrl} alt={job.company} className={styles.logo} />
              <div className={styles.info}>
                <h4>{job.title}</h4>
                <span className={styles.company}>{job.company}</span>
                <span className={styles.meta}>
                  <MapPin size={12} /> {job.city}, {job.state} - {job.country}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>No inactive jobs.</p>
        )}
      </section>
    </div>
  );
}