import node_path from 'node:path';
import type { Request, Response } from 'express';
import { uploadFile } from '../services/s3Service';

export interface LogoSearchResult {
  thumbnail: string;
  url: string;
  title: string;
}

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function getVqd(query: string): Promise<string> {
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  const html = await response.text();
  const match = html.match(/vqd=['"]([^'"]+)['"]/);
  if (!match?.[1]) throw new Error('Could not extract vqd token');
  return match[1];
}

/**
 * Search for logos using DuckDuckGo image search (no API key required).
 */
export async function searchLogos(req: Request, res: Response): Promise<void> {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }

  const query = `${q} logo png`;

  try {
    const vqd = await getVqd(query);

    const searchUrl = new URL('https://duckduckgo.com/i.js');
    searchUrl.searchParams.set('l', 'us-en');
    searchUrl.searchParams.set('o', 'json');
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('vqd', vqd);
    searchUrl.searchParams.set('f', ',,,,,');
    searchUrl.searchParams.set('p', '1');

    const searchResponse = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
        Referer: 'https://duckduckgo.com/',
        Accept: 'application/json, */*',
      },
    });

    if (!searchResponse.ok) {
      res
        .status(502)
        .json({ error: `Image search failed: HTTP ${searchResponse.status}` });
      return;
    }

    const data = (await searchResponse.json()) as {
      results?: Array<{
        title: string;
        image: string;
        thumbnail: string;
      }>;
    };

    const results: LogoSearchResult[] = (data.results || [])
      .slice(0, 12)
      .map((item) => ({
        title: item.title,
        url: item.image,
        thumbnail: item.thumbnail,
      }));

    res.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[LogoController] Search error:', message);
    res.status(500).json({ error: message });
  }
}

const MAX_PROXY_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Download an image from a URL server-side and return it as a base64 data URL.
 * This avoids CORS issues when loading external images in the browser for cropping.
 */
export async function proxyLogo(req: Request, res: Response): Promise<void> {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Query parameter "url" is required' });
    return;
  }

  try {
    const imageResponse = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!imageResponse.ok) {
      res.status(502).json({
        error: `Failed to fetch image: HTTP ${imageResponse.status}`,
      });
      return;
    }

    const contentLength = imageResponse.headers.get('content-length');
    if (contentLength && Number(contentLength) > MAX_PROXY_SIZE) {
      res.status(413).json({ error: 'Image is too large (max 5 MB)' });
      return;
    }

    const contentType =
      (imageResponse.headers.get('content-type') || 'image/png')
        .split(';')[0]
        .trim();

    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    if (buffer.byteLength > MAX_PROXY_SIZE) {
      res.status(413).json({ error: 'Image is too large (max 5 MB)' });
      return;
    }

    const base64 = buffer.toString('base64');
    res.json({ dataUrl: `data:${contentType};base64,${base64}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[LogoController] Proxy error:', message);
    res.status(500).json({ error: message });
  }
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/**
 * Download an image from a URL and upload it to S3 as a counterparty logo.
 * Returns the S3 URL.
 */
export async function pickLogo(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const { url } = req.body as { url?: string };

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Body field "url" is required' });
    return;
  }

  if (!req.user?.id) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const imageResponse = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!imageResponse.ok) {
      res
        .status(502)
        .json({ error: `Failed to download image: HTTP ${imageResponse.status}` });
      return;
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
    };

    // Derive extension from content-type, then URL, then default to .png
    const ext =
      extMap[contentType.split(';')[0].trim()] ||
      node_path.extname(new URL(url).pathname) ||
      '.png';

    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    const s3Url = await uploadFile(buffer, `logo${ext}`, {
      userId: req.user.id,
      mediaType: 'counterparty-logo',
      contentType: contentType.split(';')[0].trim(),
    });

    res.json({ url: s3Url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[LogoController] Pick error:', message);
    res.status(500).json({ error: message });
  }
}
