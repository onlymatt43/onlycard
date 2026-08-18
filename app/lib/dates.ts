// Shared date formatting — single source, used by EventCard, EventCampaign and FloatingMetaCards.
export function formatDate(d: string) {
  if (!d) return '';
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch { return d; }
}
