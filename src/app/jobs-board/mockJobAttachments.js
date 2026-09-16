// src/app/jobs-board/mockJobAttachments.js
export const JOB_ATTACHMENT_TYPES = [
  "Legal Forms",
  "Contract",
  "Time Sheets",
  "Supporting Documents",
  "Confidential",
  "Others",
];

export const JOB_ATTACHMENT_TYPE_COLORS = {
  "Legal Forms": { color: "#0369a1", bg: "#e0f2fe" },
  Contract: { color: "#6d28d9", bg: "#ede9fe" },
  "Time Sheets": { color: "#1d4ed8", bg: "#dbeafe" },
  "Supporting Documents": { color: "#15803d", bg: "#dcfce7" },
  Confidential: { color: "#dc2626", bg: "#fee2e2" },
  Others: { color: "#475569", bg: "#f1f5f9" },
};

export const mockJobAttachments = [
  {
    id: "ja1",
    jobId: "web-dev",
    name: "Job_Requisition_WebDev.pdf",
    type: "Legal Forms",
    createdBy: "Bryan Santana",
    date: "01/07/2026",
  },
  {
    id: "ja2",
    jobId: "web-dev",
    name: "Client_Approval_Email.pdf",
    type: "Supporting Documents",
    createdBy: "Rafael Sousa",
    date: "03/07/2026",
  },
];