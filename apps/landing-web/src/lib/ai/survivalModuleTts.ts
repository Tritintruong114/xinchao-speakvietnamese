import { uploadSurvivalAudioBuffer } from '@/lib/survivalStorage';

export async function synthesizeAndUploadSlot(opts: {
  prefix: string;
  text: string;
  fetchAudio: (text: string) => Promise<{ buffer: Buffer | null; error: string | null }>;
}): Promise<{ url: string | null; error: string | null }> {
  const { buffer, error } = await opts.fetchAudio(opts.text);
  if (error || !buffer) {
    return { url: null, error: error ?? 'No audio buffer' };
  }
  return uploadSurvivalAudioBuffer({
    prefix: opts.prefix,
    subpath: 'tts',
    buffer,
    contentType: 'audio/mpeg',
    fileExtension: '.mp3',
  });
}
