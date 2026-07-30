// src/data/mockData.js

export const candidatesData = [
  {
    id: "ATS-BR-10254",
    slug: "isabella-silva",
    firstName: "Isabella",
    lastName: "Silva",
    location: "Curitiba, Paraná, Brazil",
    appliedJob: "Web Developer",
    jobSlug: "web-dev",
    pipelineStage: "applied", // applied, interview, offer, hired
    avatar: "https://i.pravatar.cc/150?img=47",
    tags: ["APPLIED", "LINKEDIN", "ACTIVE SEARCH", "TOP FIT", "FOLLOW UP"],
    gender: "Female",
    email: "isabella.silva@email.com",
    phone: "+55 41 99876-5432",
    linkedin: "https://www.linkedin.com/in/isabellasilva-hr",
    languages: "Portuguese (Native)   English (Fluent)   Spanish (Professional)",
    createdDate: "2024-05-15",
    contractPreferences: {
      type: "Full-time",
      modality: "Hybrid (2 days in-office)",
      salaryExpectation: "R$ 12.000,00 per Month",
    },
    skills: ["Project Management", "Agile (Scrum)", "Talent Acquisition", "Node.js", "React"],
  },
  {
    id: "CAND-2026-003",
    slug: "diogo-pinto",
    firstName: "Diogo",
    lastName: "Pinto",
    location: "Belo Horizonte, MG, Brazil",
    appliedJob: "Web Developer",
    jobSlug: "web-dev",
    pipelineStage: "interview",
    avatar: "https://i.pravatar.cc/150?img=11",
    tags: ["INTERVIEW", "TOP FIT"],
    gender: "Male",
    email: "diogo.pinto@dev.io",
    phone: "+55 (31) 97777-3333",
    linkedin: "https://www.linkedin.com/in/diogopinto",
    languages: "Portuguese (Native)   English (Fluent)",
    createdDate: "2026-01-10",
    contractPreferences: {
      type: "Full-time",
      modality: "Remote",
      salaryExpectation: "R$ 10.000,00 per Month",
    },
    skills: ["Node.js", "MongoDB", "React", "TypeScript"],
  },
];

export const jobsData = [
  {
    id: "JOB-001",
    title: "Web Developer",
    slug: "web-dev",
    department: "Engineering",
    location: "Curitiba - Hybrid",
  },
  {
    id: "JOB-002",
    title: "Product Management Consultant",
    slug: "product-management-consultant",
    department: "Product",
    location: "Remote",
  },
];