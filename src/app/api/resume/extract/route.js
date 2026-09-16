// src/app/api/resume/structure/route.js

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Schema da ferramenta = schema dos dados que o ResumeTemplate espera.
// Forçar o Claude a usar essa "tool" garante retorno em JSON válido,
// sem precisar fazer parsing frágil de texto livre.
const EXTRACT_TOOL = {
  name: "extract_resume_data",
  description:
    "Extrai e organiza as informações de um currículo em campos estruturados.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Nome completo do candidato" },
      currentRole: {
        type: "string",
        description: "Cargo atual ou mais recente do candidato",
      },
      location: { type: "string", description: "Cidade/país do candidato" },
      contact: {
        type: "object",
        properties: {
          phone: { type: "string" },
          email: { type: "string" },
          address: { type: "string" },
          website: { type: "string" },
        },
      },
      profile: {
        type: "string",
        description: "Resumo profissional / perfil do candidato",
      },
      qualifications: {
        type: "array",
        items: { type: "string" },
        description: "Lista de competências e qualificações",
      },
      languages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            level: { type: "string" },
          },
          required: ["name"],
        },
      },
      experience: {
        type: "array",
        items: {
          type: "object",
          properties: {
            role: { type: "string" },
            company: { type: "string" },
            period: { type: "string" },
            bullets: { type: "array", items: { type: "string" } },
          },
          required: ["role", "company"],
        },
      },
      education: {
        type: "array",
        items: {
          type: "object",
          properties: {
            institution: { type: "string" },
            degree: { type: "string" },
            period: { type: "string" },
            gpa: { type: "string" },
          },
          required: ["institution", "degree"],
        },
      },
      certifications: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: [
      "name",
      "profile",
      "qualifications",
      "experience",
      "education",
    ],
  },
};

export async function POST(request) {
  try {
    const { text, jobTitle } = await request.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Texto do currículo ausente ou muito curto." },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      tools: [EXTRACT_TOOL],
      tool_choice: { type: "tool", name: "extract_resume_data" },
      messages: [
        {
          role: "user",
          content: `Extraia as informações do currículo abaixo e organize nos campos da ferramenta "extract_resume_data".

Regras:
- Se um campo não existir no texto, retorne string vazia ("") ou array vazio ([]) — nunca invente informação.
- "bullets" de cada experiência devem ser reescritos de forma concisa, mantendo o sentido original.
- Preserve datas e nomes exatamente como aparecem no texto original.
- Não inclua a vaga "${jobTitle || ""}" nos dados — ela é tratada separadamente.

Texto do currículo:
"""
${text}
"""`,
        },
      ],
    });

    const toolUse = message.content.find(
      (block) => block.type === "tool_use"
    );

    if (!toolUse) {
      return NextResponse.json(
        { error: "Não foi possível estruturar os dados do currículo." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      data: {
        ...toolUse.input,
        jobTitle: jobTitle || "",
        photoUrl: null, // preenchido no frontend a partir do upload de foto
      },
    });
  } catch (err) {
    console.error("Erro ao estruturar currículo:", err);
    return NextResponse.json(
      { error: "Erro interno ao estruturar os dados do currículo." },
      { status: 500 }
    );
  }
}