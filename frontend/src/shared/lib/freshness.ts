/** How trustworthy the timestamp of a data set is. Never show "stale" data as current. */
export type Freshness = "current" | "stale" | "partial" | "unavailable";
