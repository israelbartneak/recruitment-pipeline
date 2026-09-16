// src/app/jobs-board/mockJobInterviews.js
export const JOB_CONVERSATION_TYPE_COLORS = {
  "Candidate Interview": { color: "#15803d", bg: "#dcfce7" },
  "Client Interview": { color: "#6d28d9", bg: "#ede9fe" },
  Update: { color: "#1d4ed8", bg: "#dbeafe" },
  "Job Offer": { color: "#c2410c", bg: "#ffedd5" },
  Onboarding: { color: "#0369a1", bg: "#e0f2fe" },
  "Follow-up Call": { color: "#334155", bg: "#f1f5f9" },
  Other: { color: "#475569", bg: "#f1f5f9" },
};

export const JOB_METHOD_COLORS = {
  Video: { color: "#1d4ed8", bg: "#dbeafe" },
  Phone: { color: "#334155", bg: "#f1f5f9" },
  "In Person": { color: "#15803d", bg: "#dcfce7" },
  Messaging: { color: "#c2410c", bg: "#ffedd5" },
  Other: { color: "#475569", bg: "#f1f5f9" },
};

export const mockJobInterviews = [
  {
    id: "ji1",
    jobId: "web-dev",
    candidateId: "isabella-monteiro",
    date: "14/08/2026",
    participants: "Rafael Sousa, Bryan Santana",
    conversationType: "Client Interview",
    method: "Video",
    createdBy: "Bryan Santana",
    fileUrl: "#",
  },
];