// src/app/dashboard/components/ResumeTemplate.js
"use client";
import styles from "./resumeTemplate.module.css";

/**
 * Estrutura de dados esperada (data):
 * {
 *   photoUrl: string | null,              // opcional — usa avatar padrão se ausente
 *   name: string,
 *   currentRole: string,                  // cargo atual/último cargo do candidato
 *   jobTitle: string,                     // nome da vaga para a qual está sendo gerado o currículo
 *   location: string,
 *   contact: { phone?, email?, address?, website? },
 *   profile: string,
 *   qualifications: string[],             // skills / competências
 *   languages: { name: string, level: string }[],
 *   experience: {
 *     role: string,
 *     company: string,
 *     period: string,
 *     bullets: string[]
 *   }[],
 *   education: {
 *     institution: string,
 *     degree: string,
 *     period: string,
 *     gpa?: string
 *   }[],
 *   certifications?: string[],
 * }
 */

const DEFAULT_AVATAR = "/default-avatar.png"; // troque pelo caminho real do asset padrão da empresa

function Section({ title, children, isEmpty }) {
  if (isEmpty) return null;
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

export default function ResumeTemplate({ data }) {
  if (!data) return null;

  const {
    photoUrl,
    name,
    currentRole,
    jobTitle,
    location,
    contact = {},
    profile,
    qualifications = [],
    languages = [],
    experience = [],
    education = [],
    certifications = [],
  } = data;

  return (
    <div className={styles.resumePage}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.photoWrapper}>
          <img
            src={photoUrl || DEFAULT_AVATAR}
            alt={name || "Candidato"}
            className={styles.photo}
          />
        </div>

        <Section title="Localização" isEmpty={!location}>
          <p className={styles.plainText}>{location}</p>
        </Section>

        <Section
          title="Contato"
          isEmpty={!contact.phone && !contact.email && !contact.address && !contact.website}
        >
          <ul className={styles.plainList}>
            {contact.phone && <li>{contact.phone}</li>}
            {contact.email && <li>{contact.email}</li>}
            {contact.address && <li>{contact.address}</li>}
            {contact.website && <li>{contact.website}</li>}
          </ul>
        </Section>

        <Section title="Qualificação" isEmpty={qualifications.length === 0}>
          <ul className={styles.bulletList}>
            {qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </Section>

        <Section title="Idiomas" isEmpty={languages.length === 0}>
          <ul className={styles.bulletList}>
            {languages.map((l, i) => (
              <li key={i}>
                {l.name} {l.level && <span className={styles.muted}>({l.level})</span>}
              </li>
            ))}
          </ul>
        </Section>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.name}>{name || "Nome do Candidato"}</h1>
          {currentRole && <p className={styles.role}>{currentRole}</p>}
          {jobTitle && <span className={styles.jobBadge}>Candidatura: {jobTitle}</span>}
        </header>

        <Section title="Perfil" isEmpty={!profile}>
          <p className={styles.plainText}>{profile}</p>
        </Section>

        <Section title="Experiência Profissional" isEmpty={experience.length === 0}>
          {experience.map((exp, i) => (
            <div key={i} className={styles.expItem}>
              <div className={styles.expHeader}>
                <div>
                  <strong className={styles.expRole}>{exp.role}</strong>
                  <div className={styles.expCompany}>{exp.company}</div>
                </div>
                <span className={styles.expPeriod}>{exp.period}</span>
              </div>
              {exp.bullets?.length > 0 && (
                <ul className={styles.bulletList}>
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>

        <Section title="Educação" isEmpty={education.length === 0}>
          {education.map((edu, i) => (
            <div key={i} className={styles.eduItem}>
              <div className={styles.eduHeader}>
                <div>
                  <strong className={styles.eduDegree}>{edu.degree}</strong>
                  <div className={styles.eduInstitution}>{edu.institution}</div>
                </div>
                <span className={styles.eduPeriod}>{edu.period}</span>
              </div>
              {edu.gpa && <div className={styles.muted}>GPA: {edu.gpa}</div>}
            </div>
          ))}

          {certifications.length > 0 && (
            <div className={styles.certBlock}>
              <span className={styles.certLabel}>Certificações:</span>
              <ul className={styles.bulletList}>
                {certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      </main>
    </div>
  );
}