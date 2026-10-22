// Samma gränser som storage-bucketarna har (migration 0018). Kontrollen här ger ett
// begripligt felmeddelande direkt; den verkliga spärren ligger i Storage.
// Filändelsen härleds från MIME-typen, aldrig från filnamnet, så att sökvägen i
// bucketen alltid blir "<id>.<känd ändelse>".

const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

const CV_EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'text/plain': 'txt',
}

export const IMAGE_ACCEPT = Object.keys(IMAGE_EXTENSIONS).join(',')
export const CV_ACCEPT = Object.keys(CV_EXTENSIONS).join(',')

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_CV_BYTES = 10 * 1024 * 1024

type UploadCheck = { ok: true; ext: string } | { ok: false; error: string }

export function checkImageUpload(file: File): UploadCheck {
  const ext = IMAGE_EXTENSIONS[file.type]
  if (!ext) return { ok: false, error: 'Endast PNG, JPG eller WebP stöds' }
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'Bilden får max vara 5 MB' }
  return { ok: true, ext }
}

export function checkCvUpload(file: File): UploadCheck {
  const ext = CV_EXTENSIONS[file.type]
  if (!ext) return { ok: false, error: 'Endast PDF eller TXT stöds' }
  if (file.size > MAX_CV_BYTES) return { ok: false, error: 'CV får max vara 10 MB' }
  return { ok: true, ext }
}
