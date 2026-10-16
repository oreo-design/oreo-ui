# Focused validation

Weekly validation, zero buckets, weighted averages, peak, metric insight, intensity and CSV passed.
Agent filters, week filters and exact per-hour partitions passed.

Production build: passed (tsc -b and Vite). Existing large-chunk warning only.

Actual native Chrome CSV was compared byte-for-byte with heatmapCsv(selectedWeek()). Browser assertions and limitations are recorded in REVIEW.md.
