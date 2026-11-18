const TAMANHO_MAX_ARQUIVO = 10 * 1024 * 1024; // 10 MB

/**
 * Reduz a foto (largura máxima de 1200px, JPEG) e devolve em base64.
 * Isso mantém o evento leve para caber no armazenamento do navegador.
 */
export async function reduzirImagem(arquivo: File, larguraMax = 1200, qualidade = 0.82): Promise<string> {
  if (!arquivo.type.startsWith("image/")) throw new Error("Escolha um arquivo de imagem (JPG, PNG ou WebP).");
  if (arquivo.size > TAMANHO_MAX_ARQUIVO) throw new Error("A foto é grande demais. Use uma de até 10 MB.");

  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, larguraMax / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a foto neste navegador.");
  ctx.fillStyle = "#ffffff"; // PNG com fundo transparente vira branco no JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", qualidade);
}
