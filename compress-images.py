#!/usr/bin/env python3
"""
Image compression script for nextelite-blog
Codename: Crane (rev 2 — l1ft0ff 260429: multi-width responsive set)

- Backs up originals with _original suffix
- Emits 4 widths (400, 800, 1200, 2000) × 2 formats (JPEG + WebP) per source image
- Naming convention: <slug>-<width>.<ext>  (e.g. boxing-bodo-ring-purple-800.webp)
- The original-named file (e.g. boxing-bodo-ring-purple.jpg) is preserved as the
  legacy entry-point and rewritten as the 1200-wide JPEG (so existing markup keeps
  working). srcset references the *-400/-800/-1200/-2000 derivatives.
- EXIF orientation baked into pixels via ImageOps.exif_transpose before resize.

Why 4 widths: covers 320px phones (uses 400w) up to 4K (uses 2000w) plus retina.
Why 2 formats: WebP saves ~30% over JPEG; JPEG kept for any older browser fallback.
AVIF skipped per d33p:// section 5.6 (encode cost too high for v1).
"""

from __future__ import annotations
import os
import shutil
from pathlib import Path
from PIL import Image, ImageOps

IMG_DIR = Path("/Users/neminesteffensen/Desktop/nextelite-blog/img")
WIDTHS = (400, 800, 1200, 2000)          # responsive srcset tiers
JPG_QUALITY = 85
WEBP_QUALITY = 82
MIN_SIZE_BYTES = 50 * 1024               # 50KB threshold (we want derivatives for all editorial images)

log_entries = []
total_original = 0
total_new = 0
files_processed = 0
derivatives_created = 0


def get_size_str(size_bytes: int) -> str:
    if size_bytes >= 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f}MB"
    return f"{size_bytes / 1024:.0f}KB"


def emit_derivative(img: Image.Image, target_path: Path, width: int, fmt: str) -> int:
    """Resize img to target width (preserving aspect) and save as fmt. Returns bytes."""
    orig_w, orig_h = img.size
    if width >= orig_w:
        # don't upscale — clone at native size
        out = img.copy()
    else:
        ratio = width / orig_w
        new_h = int(orig_h * ratio)
        out = img.resize((width, new_h), Image.LANCZOS)

    if fmt == "JPEG":
        out.save(target_path, "JPEG", quality=JPG_QUALITY, optimize=True)
    elif fmt == "WEBP":
        out.save(target_path, "WEBP", quality=WEBP_QUALITY, method=6)
    return target_path.stat().st_size


def process_image(filepath: Path) -> None:
    global total_original, total_new, files_processed, derivatives_created

    if "_original" in filepath.stem:
        return
    # skip already-derived files (have width suffix)
    stem = filepath.stem
    if any(stem.endswith(f"-{w}") for w in WIDTHS):
        return

    original_size = filepath.stat().st_size
    if original_size < MIN_SIZE_BYTES:
        return

    ext = filepath.suffix.lower()
    if ext not in (".jpg", ".jpeg", ".png"):
        return

    files_processed += 1
    total_original += original_size

    # Backup with _original suffix (idempotent)
    backup_path = filepath.parent / (filepath.stem + "_original" + filepath.suffix)
    if not backup_path.exists():
        shutil.copy2(filepath, backup_path)

    img = Image.open(filepath)
    img = ImageOps.exif_transpose(img)        # bake EXIF rotation into pixels
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    slug = filepath.stem                      # e.g. "boxing-bodo-ring-purple"
    sizes_log = []

    # Emit -<width>.jpg + -<width>.webp per tier
    for w in WIDTHS:
        jpg_path = filepath.parent / f"{slug}-{w}.jpg"
        webp_path = filepath.parent / f"{slug}-{w}.webp"
        try:
            jpg_size = emit_derivative(img, jpg_path, w, "JPEG")
            webp_size = emit_derivative(img, webp_path, w, "WEBP")
            derivatives_created += 2
            total_new += jpg_size + webp_size
            sizes_log.append(f"{w}w:{get_size_str(jpg_size)}/{get_size_str(webp_size)}")
        except Exception as e:
            sizes_log.append(f"{w}w:ERR({e})")

    # Also rewrite the legacy entry-point (slug.jpg + slug.webp) at 1200w —
    # keeps existing markup that points at /img/<slug>.jpg working.
    legacy_jpg = filepath
    legacy_webp = filepath.with_suffix(".webp")
    emit_derivative(img, legacy_jpg, min(1200, img.size[0]), "JPEG")
    emit_derivative(img, legacy_webp, min(1200, img.size[0]), "WEBP")

    entry = (
        f"  {filepath.name:<60} {img.size[0]}x{img.size[1]} -> "
        + " | ".join(sizes_log)
    )
    log_entries.append(entry)
    img.close()


def main():
    print("=" * 100)
    print("CRANE IMAGE COMPRESSION — nextelite-blog (rev 2: 4-width responsive set)")
    print("=" * 100)
    print()

    image_files = sorted(IMG_DIR.glob("*"))
    image_files = [f for f in image_files if f.suffix.lower() in (".jpg", ".jpeg", ".png")]
    image_files = [f for f in image_files if "_original" not in f.stem]
    image_files = [f for f in image_files if not any(f.stem.endswith(f"-{w}") for w in WIDTHS)]
    image_files = [f for f in image_files if f.stat().st_size >= MIN_SIZE_BYTES]

    print(f"Found {len(image_files)} source images over 500KB to process")
    print(f"Will emit {len(image_files) * len(WIDTHS) * 2} derivatives ({len(WIDTHS)} widths × 2 formats)")
    print()

    for fp in image_files:
        try:
            process_image(fp)
        except Exception as e:
            log_entries.append(f"  ERROR: {fp.name} — {e}")

    print("COMPRESSION LOG:")
    print("-" * 100)
    for entry in log_entries:
        print(entry)

    print()
    print("=" * 100)
    print("SUMMARY")
    print("=" * 100)
    print(f"  Source files processed:  {files_processed}")
    print(f"  Derivatives created:     {derivatives_created}")
    print(f"  Total original size:     {get_size_str(total_original)}")
    print(f"  Total derivative size:   {get_size_str(total_new)}")
    print()
    print("Originals preserved with _original suffix. Use srcset='<slug>-400.jpg 400w, ...'")


if __name__ == "__main__":
    main()
