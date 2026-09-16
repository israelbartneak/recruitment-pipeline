// src/app/candidates/mockCandidateDocuments.js
export const CANDIDATE_DOCUMENT_TYPES = [
  "Legal Forms",
  "Pay Info",
  "Application",
  "Time Sheets",
  "Summary",
  "Resume",
  "Documentation",
  "Supporting Documents",
  "Confidential",
  "Job Offer",
  "Others",
];

export const CANDIDATE_DOCUMENT_TYPE_COLORS = {
  "Legal Forms": { color: "#0369a1", bg: "#e0f2fe" },
  "Pay Info": { color: "#15803d", bg: "#dcfce7" },
  Application: { color: "#1d4ed8", bg: "#dbeafe" },
  "Time Sheets": { color: "#c2410c", bg: "#ffedd5" },
  Summary: { color: "#334155", bg: "#f1f5f9" },
  Resume: { color: "#6d28d9", bg: "#ede9fe" },
  Documentation: { color: "#0369a1", bg: "#e0f2fe" },
  "Supporting Documents": { color: "#15803d", bg: "#dcfce7" },
  Confidential: { color: "#dc2626", bg: "#fee2e2" },
  "Job Offer": { color: "#c2410c", bg: "#ffedd5" },
  Others: { color: "#475569", bg: "#f1f5f9" },
};

export const mockCandidateDocuments = [
  {
    id: "cd1",
    candidateId: "isabella-monteiro",
    name: "Signed_Contract_Isabella.pdf",
    type: "Legal Forms",
    createdBy: "Bryan Santana",
    date: "10/08/2026",
  },
  {
    id: "cd2",
    candidateId: "isabella-monteiro",
    name: "Bank_Details_Isabella.pdf",
    type: "Pay Info",
    createdBy: "Rafael Sousa",
    date: "11/08/2026",
  },
  {
    id: "cd3",
    candidateId: "isabella-monteiro",
    name: "RG_CPF_Isabella.pdf",
    type: "Supporting Documents",
    createdBy: "Bianca Melo",
    date: "05/08/2026",
  },
];