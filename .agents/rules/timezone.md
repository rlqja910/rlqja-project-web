# Timezone Policy

- 🚨 **CRITICAL RULE**: ALL database timestamps MUST be stored as literal KST (Korean Standard Time) using `LocalDateTime`.
- ❌ **NEVER USE**: `ZonedDateTime`, `OffsetDateTime`, or `Instant` for entity fields. The user wants the raw DB values to look exactly like Korean time without timezone offsets.
- ❌ **NEVER USE**: `LocalDateTime.now()` without a timezone. The EC2 server is in UTC, so this will store UTC time!
- ✅ **ALWAYS USE**: `LocalDateTime.now(ZoneId.of("Asia/Seoul"))` when initializing or updating entity timestamps (e.g., `createdAt`, `updatedAt`).
- ❌ **NEVER USE**: The frontend hack of appending `+ 'Z'` to date strings (e.g., `new Date(dateString + 'Z')`). Since the backend returns exact KST strings (e.g., `"2026-08-21T16:23:29"`), the browser will naturally parse it as local KST. Appending `'Z'` will incorrectly shift the time by another 9 hours.
