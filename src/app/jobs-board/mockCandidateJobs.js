// src/app/jobs-board/mockCandidateJobs.js

// Etapas do pipeline de candidato dentro de uma vaga — usado tanto na página
// da vaga (board com colunas) quanto na aba "Jobs" do perfil do candidato
export const PIPELINE_STAGES = [
  { key: "new", label: "New Candidates", color: "#64748b" },
  { key: "qualified", label: "Qualified", color: "#64748b" },
  { key: "outreached", label: "Outreached", color: "#0ea5e9" },
  { key: "replied", label: "Replied", color: "#0ea5e9" },
  { key: "scheduled", label: "Scheduled", color: "#0ea5e9" },
  { key: "screened", label: "Screened", color: "#eab308" },
  { key: "creating_material", label: "Creating Material", color: "#eab308" },
  { key: "send_to_client", label: "Send to Client", color: "#b45309" },
  { key: "submitted", label: "Submitted", color: "#b45309" },
  { key: "client_interview", label: "Client Interview", color: "#c2410c" },
  { key: "offered", label: "Offered", color: "#7c3aed" },
  { key: "hired", label: "Hired", color: "#15803d" },
  { key: "started", label: "Started", color: "#15803d" },
  { key: "probation_passed", label: "Probation Passed", color: "#15803d" },
];

// Cada entrada liga um candidato a UMA vaga específica, na etapa em que está
// nessa vaga. Um mesmo candidato pode ter várias entradas (uma por vaga).
export const mockCandidateJobs = [
  { id: "cj1", candidateId: "maria-eduarda-f", jobId: "web-dev", stage: "new", dropped: false, match: 45, timeInJob: "2w", timeInStage: "2w", roleLabel: "Analista de marketing", matchCreatedDate: "01/08/2026" },
  { id: "cj2", candidateId: "ana-dalzotto", jobId: "web-dev", stage: "screened", dropped: false, match: 23, timeInJob: "1mo", timeInStage: "1mo", roleLabel: "Media Specialist", matchCreatedDate: "20/07/2026" },
  { id: "cj3", candidateId: "isabella-monteiro", jobId: "web-dev", stage: "send_to_client", dropped: false, match: 11, timeInJob: "1mo", timeInStage: "1mo", roleLabel: "Social Media - Analista Pleno", matchCreatedDate: "15/07/2026" },
  { id: "cj4", candidateId: "lucas-garay", jobId: "web-dev", stage: "submitted", dropped: false, match: 34, timeInJob: "1mo", timeInStage: "1w", roleLabel: "Community Manager", matchCreatedDate: "18/07/2026" },
  { id: "cj5", candidateId: "regeane-aparecida", jobId: "web-dev", stage: "client_interview", dropped: false, match: 34, timeInJob: "1mo", timeInStage: "1w", roleLabel: "Social Media and Video Script", matchCreatedDate: "16/07/2026" },
  { id: "cj6", candidateId: "ana-luiza-ferreira", jobId: "web-dev", stage: "client_interview", dropped: false, match: 66, timeInJob: "1mo", timeInStage: "1w", roleLabel: "Media Marketing Analyst", matchCreatedDate: "14/07/2026" },
  { id: "cj7", candidateId: "gabriela-martins", jobId: "web-dev", stage: "offered", dropped: false, match: 23, timeInJob: "1mo", timeInStage: "4d", roleLabel: "Marketing & Content", matchCreatedDate: "12/07/2026" },
  { id: "cj8", candidateId: "rafael-souza", jobId: "web-dev", stage: "new", dropped: true, match: 50, timeInJob: "1w", timeInStage: "1w", roleLabel: "Content Creator", matchCreatedDate: "10/08/2026" },
  { id: "cj9", candidateId: "paulo-roberto-s", jobId: "web-dev", stage: "client_interview", dropped: false, match: 50, timeInJob: "1w", timeInStage: "1w", roleLabel: "Senior Video Editor", matchCreatedDate: "13/07/2026" },
  { id: "cj10", candidateId: "cyndhara-galdino", jobId: "web-dev", stage: "client_interview", dropped: false, match: 68, timeInJob: "6d", timeInStage: "6d", roleLabel: "Videomaker, Social Media, Editor @ Freelance Professional", matchCreatedDate: "11/07/2026" },

  // Exemplos de candidatos em mais de uma vaga ao mesmo tempo
  { id: "cj11", candidateId: "isabella-monteiro", jobId: "qa-analyst", stage: "screened", dropped: false, match: 40, timeInJob: "3w", timeInStage: "3w", roleLabel: "Social Media - Analista Pleno", matchCreatedDate: "05/07/2026" },
  { id: "cj12", candidateId: "ana-luiza-ferreira", jobId: "devops-eng", stage: "outreached", dropped: true, match: 15, timeInJob: "2mo", timeInStage: "3w", roleLabel: "Media Marketing Analyst", matchCreatedDate: "20/06/2026" },
];