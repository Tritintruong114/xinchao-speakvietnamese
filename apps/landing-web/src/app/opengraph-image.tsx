import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export const alt = 'XinChao — Survival Vietnamese for travelers and expats';

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export default async function Image() {
  const file = await readFile(join(process.cwd(), 'public', 'logo-horizontal.png'));
  const src = `data:image/png;base64,${Buffer.from(file).toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F4F4F0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 36,
            background: '#ffffff',
            border: '4px solid #1A1A1A',
            boxShadow: '12px 12px 0 #1A1A1A',
          }}
        >
          {/* Local asset embedded for reliable OG previews (matches navbar logo). */}
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og ImageResponse */}
          <img src={src} alt="" width={400} height={400} style={{ objectFit: 'contain' }} />
        </div>
        <p
          style={{
            marginTop: 40,
            fontSize: 34,
            fontWeight: 800,
            color: '#1A1A1A',
            letterSpacing: '-0.03em',
            maxWidth: 900,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Survival Vietnamese — travelers & expats
        </p>
      </div>
    ),
    { ...size },
  );
}
