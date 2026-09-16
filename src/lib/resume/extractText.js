// src/lib/resume/extractText.js

import mammoth from "mammoth";

/**
 * Extrai texto bruto de um buffer de arquivo, de acordo com o tipo.
 * Suporta: PDF, DOCX (.docx apenas — .doc antigo não é suportado pelo mammoth), TXT.
 */
export async function extractText(buffer, mimeType, fileName = "") {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (mimeType === "application/pdf" || extension === "pdf") {
    return extractFromPdf(buffer);
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  ) {
    return extractFromDocx(buffer);
  }

  if (mimeType === "text/plain" || extension === "txt") {
    return buffer.toString("utf-8");
  }

  throw new Error("UNSUPPORTED_FILE_TYPE");
}

async function extractFromPdf(buffer) {
  // Importa o arquivo interno da lib diretamente (não o pacote "pdf-parse"
  // na raiz). O index.js do pacote tem um código de debug que tenta ler
  // um PDF de teste que não existe no nosso projeto e quebra com ENOENT
  // quando empacotado pelo Next.js. Importar o lib/pdf-parse.js pula esse bug.
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractFromDocx(buffer) {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}