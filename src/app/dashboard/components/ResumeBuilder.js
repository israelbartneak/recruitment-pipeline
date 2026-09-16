// src/app/dashboard/components/ResumeBuilder.js
"use client";
import { useState, useRef } from "react";
import { FileText, X, Loader2 } from "lucide-react";
import { mockJobs } from "../../jobs-board/mockJobs";
import { mockCandidateJobs } from "../../jobs-board/mockCandidateJobs";
import ResumeTemplate from "./ResumeTemplate";
import styles from "../dashboard.module.css";

// Só vagas que já têm pelo menos um candidato associado
const jobsInProcess = mockJobs.filter((job) =>
  mockCandidateJobs.some((entry) => entry.jobId === job.id),
);

export default function ResumeBuilder() {
  const [resumeFile, setResumeFile] = useState(null);
  const [positionId, setPositionId] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");

  const resumeInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setError("");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const selectedJob = jobsInProcess.find((j) => j.id === positionId);

  const handleGenerate = async () => {
    if (!resumeFile || !positionId) return;

    setError("");
    setIsLoading(true);

    try {
      // 1. Extrair texto bruto do arquivo (Bloco 1)
      setLoadingStep("Lendo o arquivo...");
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const extractRes = await fetch("/api/resume/extract", {
        method: "POST",
        body: formData,
      });
      const extractJson = await extractRes.json();

      if (!extractRes.ok) {
        throw new Error(extractJson.error || "Falha ao ler o arquivo.");
      }

      // 2. Estruturar o texto com a Claude API (Bloco 2)
      setLoadingStep("Organizando as informações...");
      const structureRes = await fetch("/api/resume/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractJson.text,
          jobTitle: selectedJob?.title || "",
        }),
      });
      const structureJson = await structureRes.json();

      if (!structureRes.ok) {
        throw new Error(structureJson.error || "Falha ao estruturar os dados.");
      }

      // 3. Junta a foto (se enviada) aos dados estruturados
      setResumeData({
        ...structureJson.data,
        photoUrl: photoPreview || null,
      });
      setIsPreviewOpen(true);
    } catch (err) {
      console.error("Erro ao gerar currículo:", err);
      setError(err.message || "Erro inesperado ao gerar o currículo.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div className={styles.resumeBuilderCard}>
      <div className={styles.cardHeader}>
        <h2>Resume Builder</h2>
      </div>

      <div className={styles.resumeBuilderBody}>
        <div className={styles.rbFrame}>
          <div className={styles.rbField}>
            <span className={styles.rbLabel}>Candidate Resume File</span>
            <div
              className={styles.rbUploadDropzone}
              onClick={() => resumeInputRef.current?.click()}
            >
              <FileText size={20} color="#64748B" />
              <div>
                <div className={styles.rbUploadTitle}>
                  {resumeFile ? resumeFile.name : "Drop file or click to upload"}
                </div>
                <div className={styles.rbUploadHint}>PDF, DOCX or TXT</div>
              </div>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: "none" }}
                onChange={handleResumeChange}
              />
            </div>
          </div>

          <div className={styles.rbDivider}></div>

          <div className={styles.rbField}>
            <span className={styles.rbLabel}>Position</span>
            <select
              className={styles.rbSelect}
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
            >
              <option value="">Select the job in process...</option>
              {jobsInProcess.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.rbDivider}></div>

          <div className={styles.rbField}>
            <span className={styles.rbLabel}>Candidate Photo (optional)</span>
            <div className={styles.rbPhotoRow}>
              <div className={styles.rbPhotoPreview}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Candidate" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <button
                type="button"
                className={styles.rbUploadPhotoBtn}
                onClick={() => photoInputRef.current?.click()}
              >
                Upload Photo
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </div>
          </div>
        </div>

        {error && <p className={styles.rbErrorText}>{error}</p>}
        <button
          className={styles.rbGenerateBtn}
          onClick={handleGenerate}
          disabled={!resumeFile || !positionId || isLoading}
        >
          {isLoading ? (
            <span className={styles.rbLoadingRow}>
              <Loader2 size={16} className={styles.spinIcon} />
              {loadingStep || "Gerando..."}
            </span>
          ) : (
            "Generate Resume"
          )}
        </button>
      </div>

      {isPreviewOpen && resumeData && (
        <div
          className={styles.rbPreviewOverlay}
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className={styles.rbPreviewModalLarge}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.rbPreviewHeader}>
              <span>Resume Preview</span>
              <button onClick={() => setIsPreviewOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.rbPreviewScrollArea}>
              <ResumeTemplate data={resumeData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}