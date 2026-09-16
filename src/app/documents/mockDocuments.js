// src/app/documents/mockDocuments.js
export const mockFolders = [
  { id: "f1", name: "Company Policies", fileCount: 8, color: "#1d4ed8", bg: "#eff6ff" },
  { id: "f2", name: "Client Contracts", fileCount: 14, color: "#15803d", bg: "#f0fdf4" },
  { id: "f3", name: "HR Templates", fileCount: 5, color: "#c2410c", bg: "#fff7ed" },
];

export const DOCUMENT_TYPE_COLORS = {
  Policy: { color: "#0369a1", bg: "#e0f2fe" },
  Contract: { color: "#6d28d9", bg: "#ede9fe" },
  Template: { color: "#15803d", bg: "#dcfce7" },
  Others: { color: "#475569", bg: "#f1f5f9" },
};

export const mockFiles = [
  {
    id: "d1",
    name: "Employee_Handbook_2026.pdf",
    type: "Policy",
    createdBy: "Bryan Santana",
    date: "10/08/2026",
  },
  {
    id: "d2",
    name: "Nimbus_Technology_MSA.pdf",
    type: "Contract",
    createdBy: "Rafael Sousa",
    date: "02/08/2026",
  },
  {
    id: "d3",
    name: "Interview_Scorecard_Template.xlsx",
    type: "Template",
    createdBy: "Bianca Melo",
    date: "28/07/2026",
  },
];