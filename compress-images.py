#!/usr/bin/env python3
"""
Image compression script for nextelite-blog
Codename: Crane
- Backs up originals with _original suffix
- Resizes images wider than 2000px to max 2000px (respects EXIF orientation first)
- Re-exports JPGs at 85% quality (with EXIF orientation baked into pixel data)
- Creates WebP versions for all JPGs
- Logs all changes with size savings

IMPORTANT: Always call ImageOps.exif_transpose(img) before any resize/save.
This bakes the EXIF rotation into the actual pixel data and sets orientation=1,
so the image displays correctly in all browsers regardless of EXIF support.
"""

from __future__ import annotations
import os
import shutil
from pathlib import Path
from PIL import Image, ImageOps

IMG_DIR = Path("/Users/neminesteffensen/Desktop/nextelite-blog/img")
MAX_WIDTH = 2000
JPG_QUALITY = 85
WEBP_QUALITY = 82
MIN_SIZE_BYTES = 500 * 1024  # 500KB threshold

# Target sizes
HERO_TARGET = 400 * 1024    # 400KB for hero images
INLINE_TARGET = 150 * 1024  # 150KB for inline images

# Hero image patterns (larger images likely used as heroes)
HERO_PATTERNS = ["hero-", "IMG_6434", "IMG_6517", "IMG_6501"]

log_entries = []
total_original = 0
total_new = 0
total_webp = 0
files_processed = 0
webp_created = 0


def is_hero(filename: str) -> bool:
    return any(p in filename for p in HERO_PATTERNS)


def get_size_str(size_bytes: int) -> str:
    if size_bytes >= 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f}MB"
    return f"{size_bytes / 1024:.0f}KB"


def process_image(filepath: Path) -> None:
    global total_original, total_new, total_webp, files_processed, webp_created

    # Skip already-backed-up originals
    if "_original" in filepath.stem:
        return

    original_size = filepath.stat().st_size
    if original_size < MIN_SIZE_BYTES:
        return

    ext = filepath.suffix.lower()
    if ext not in (".jpg", ".jpeg", ".png"):
        return

    files_processed += 1
    total_original += original_size

    # Create backup with _original suffix
    backup_name = filepath.stem + "_original" + filepath.suffix
    backup_path = filepath.parent / backup_name
    if not backup_path.exists():
        shutil.copy2(filepath, backup_path)

    # Open and process
    img = Image.open(filepath)

    # Bake EXIF orientation into pixel data BEFORE any resize or save.
    # Without this, iPhones/cameras tag portrait shots with orientation=6 (90° CW)
    # but store pixels as landscape. Pillow saves raw pixels, drops the tag,
    # and the image appears sideways in browsers that don't apply EXIF rotation.
    img = ImageOps.exif_transpose(img)

    orig_width, orig_height = img.size
    resized = False

    # Convert RGBA to RGB for JPG output
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    # Resize if wider than MAX_WIDTH
    if orig_width > MAX_WIDTH:
        ratio = MAX_WIDTH / orig_width
        new_height = int(orig_height * ratio)
        img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)
        resized = True

    # Save compressed JPG (convert PNG to JPG too for photos)
    if ext == ".png":
        # For PNGs, check if it's a photo (not transparent)
        # Save as both PNG (compressed) and WebP
        jpg_path = filepath.with_suffix(".jpg")
        img.save(filepath, "PNG", optimize=True)
        # Also create a JPG version for photos
        if img.mode == "RGB":
            img.save(jpg_path, "JPEG", quality=JPG_QUALITY, optimize=True)
    else:
        img.save(filepath, "JPEG", quality=JPG_QUALITY, optimize=True)

    new_size = filepath.stat().st_size
    total_new += new_size
    savings = original_size - new_size

    # Create WebP version
    webp_path = filepath.with_suffix(".webp")
    img.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
    webp_size = webp_path.stat().st_size
    total_webp += webp_size
    webp_created += 1

    # Determine target
    target = HERO_TARGET if is_hero(filepath.name) else INLINE_TARGET
    target_str = "HERO" if is_hero(filepath.name) else "INLINE"
    meets_target = "YES" if new_size <= target else "NO"

    dims_str = ""
    if resized:
        dims_str = f" [{orig_width}x{orig_height} -> {img.size[0]}x{img.size[1]}]"

    entry = (
        f"  {filepath.name:<60} "
        f"{get_size_str(original_size):>7} -> {get_size_str(new_size):>7} "
        f"(WebP: {get_size_str(webp_size):>7}) "
        f"saved {get_size_str(savings):>7} "
        f"[{target_str} target {meets_target}]"
        f"{dims_str}"
    )
    log_entries.append(entry)

    img.close()


def main():
    print("=" * 100)
    print("CRANE IMAGE COMPRESSION — nextelite-blog")
    print("=" * 100)
    print()

    # Gather all image files
    image_files = sorted(IMG_DIR.glob("*"))
    image_files = [f for f in image_files if f.suffix.lower() in (".jpg", ".jpeg", ".png")]
    image_files = [f for f in image_files if "_original" not in f.stem]
    image_files = [f for f in image_files if f.stat().st_size >= MIN_SIZE_BYTES]

    print(f"Found {len(image_files)} images over 500KB to process")
    print()

    for fp in image_files:
        try:
            process_image(fp)
        except Exception as e:
            log_entries.append(f"  ERROR: {fp.name} — {e}")

    # Print log
    print("COMPRESSION LOG:")
    print("-" * 100)
    for entry in log_entries:
        print(entry)

    print()
    print("=" * 100)
    print("SUMMARY")
    print("=" * 100)
    print(f"  Files processed:     {files_processed}")
    print(f"  WebP files created:  {webp_created}")
    print(f"  Total original size: {get_size_str(total_original)}")
    print(f"  Total JPG size:      {get_size_str(total_new)}")
    print(f"  Total WebP size:     {get_size_str(total_webp)}")
    print(f"  JPG savings:         {get_size_str(total_original - total_new)} ({(total_original - total_new) / total_original * 100:.1f}%)")
    print(f"  WebP savings:        {get_size_str(total_original - total_webp)} ({(total_original - total_webp) / total_original * 100:.1f}%)")
    print()
    print("Originals preserved with _original suffix. The Crane is ready.")


if __name__ == "__main__":
    main()
