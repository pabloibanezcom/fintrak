'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Avatar } from '@/components/primitives';
import { type LogoSearchResult, logosService } from '@/services';
import styles from './LogoPicker.module.css';

const OUTPUT_SIZE = 256;

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
  });

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create image blob'));
    }, 'image/png');
  });
}

interface LogoPickerProps {
  currentLogo: string;
  counterpartyName: string;
  onSelect: (url: string) => void;
  onRemove: () => void;
}

type Mode = 'search' | 'crop';

export function LogoPicker({
  currentLogo,
  counterpartyName,
  onSelect,
  onRemove,
}: LogoPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('search');

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LogoSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [isProxying, setIsProxying] = useState(false);

  // Crop state
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && mode === 'search') {
      setQuery(counterpartyName);
      searchInputRef.current?.focus();
    }
    if (!isOpen) {
      setResults([]);
      setError(null);
      setMode('search');
      setManualUrl('');
    }
  }, [isOpen, mode, counterpartyName]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const data = await logosService.search(query.trim());
      setResults(data);
      if (data.length === 0) setError('No results found.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const loadImageForCrop = async (url: string) => {
    setIsProxying(true);
    setError(null);
    try {
      const dataUrl = await logosService.proxy(url);
      setCropImageSrc(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setMode('crop');
    } catch {
      setError('Failed to load image. Please try another.');
    } finally {
      setIsProxying(false);
    }
  };

  const handleUseUrl = () => {
    if (!manualUrl.trim()) return;
    loadImageForCrop(manualUrl.trim());
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUseUrl();
    }
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleCropSave = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    setError(null);
    try {
      const blob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      const s3Url = await logosService.upload(blob);
      onSelect(s3Url);
      setIsOpen(false);
    } catch {
      setError('Failed to save logo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setMode('search');
    setError(null);
  };

  const initials = counterpartyName
    ? counterpartyName
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className={styles.root}>
      {/* Avatar trigger row */}
      <div className={styles.avatarRow}>
        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => setIsOpen((o) => !o)}
          title={isOpen ? 'Close logo picker' : 'Change logo'}
          disabled={isProxying}
        >
          <Avatar
            src={currentLogo || undefined}
            alt={counterpartyName || 'Counterparty'}
            fallback={initials}
            size="lg"
            className={styles.avatar}
          />
          <span className={styles.avatarOverlay}>
            {isProxying ? '…' : isOpen ? 'Close' : 'Change'}
          </span>
        </button>

        <div className={styles.avatarMeta}>
          <span className={styles.avatarLabel}>Logo</span>
          {currentLogo && (
            <button
              type="button"
              className={styles.removeButton}
              onClick={onRemove}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Panel */}
      {isOpen && (
        <div className={styles.panel}>
          {error && <p className={styles.error}>{error}</p>}

          {mode === 'search' && (
            <>
              {/* Search bar */}
              <div className={styles.searchRow}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search for a logo..."
                />
                <button
                  type="button"
                  className={styles.searchButton}
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim()}
                >
                  {isSearching ? 'Searching…' : 'Search'}
                </button>
              </div>

              {/* Results grid */}
              {results.length > 0 && (
                <div className={styles.grid}>
                  {results.map((result) => (
                    <button
                      key={result.url}
                      type="button"
                      className={styles.thumbnail}
                      onClick={() => loadImageForCrop(result.url)}
                      disabled={isProxying}
                      title={result.title}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* URL paste */}
              <div className={styles.separator}>
                <span>or paste a URL</span>
              </div>
              <div className={styles.urlRow}>
                <input
                  type="url"
                  className={styles.searchInput}
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  onKeyDown={handleUrlKeyDown}
                  placeholder="https://example.com/logo.png"
                />
                <button
                  type="button"
                  className={styles.searchButton}
                  onClick={handleUseUrl}
                  disabled={isProxying || !manualUrl.trim()}
                >
                  Use
                </button>
              </div>
            </>
          )}

          {mode === 'crop' && (
            <>
              <div className={styles.cropContainer}>
                <Cropper
                  image={cropImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className={styles.cropControls}>
                <input
                  type="range"
                  className={styles.zoomSlider}
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  aria-label="Zoom"
                />
              </div>

              <div className={styles.cropActions}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={handleBack}
                  disabled={isSaving}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={handleCropSave}
                  disabled={isSaving || !croppedAreaPixels}
                >
                  {isSaving ? 'Saving…' : 'Crop & Save'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
