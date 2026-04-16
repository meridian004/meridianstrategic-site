# Changelog — meridianstrategic.io

All notable changes to the MSR site. Format: date, branch, commit summary, context.

---

## 2026-04-16

### main — `0da09ec` Hide contact/privacy pages during maintenance
- Renamed `contact.astro` → `_contact.astro`, `privacy.astro` → `_privacy.astro`
- Astro skips underscore-prefixed files; prevents them from rendering during maintenance

### main — `34303ee` Maintenance splash: branded coming-soon page
- Replaced full site index with minimal splash (favicon, serif headline, email link)
- Added `src/layouts/Maintenance.astro` (no header/footer, noindex/nofollow)
- Added `public/_redirects` (302s for /contact, /privacy → /)
- Created `dev` branch preserving full site for parallel work

## 2026-04-15

### main — `bd52466` Remove orphan BEGIN eyebrow and redundant email from ContactCTA
- Cleaned up ContactCTA section: removed "BEGIN" eyebrow and duplicate email

### main — `bffbf35` Enterprise infrastructure
- Contact page, QR code, privacy policy, em dash sweep, hero photo, routing overhaul

### main — `7b7380f` Enterprise design pass
- Font role flip, square CTAs, dark hero, mono reduction

### main — `65903dd` Logo revamp + footer and stat-band spacing

### main — `81cf61d` Add Representation practice + fix footer email wrap
