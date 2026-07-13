export const formatDate = (raw, includeTime = false) => {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    
    // Some dates are just "YYYY-MM-DD", let's include time if requested and it has a time component
    // We can also just rely on includeTime flag
    if (includeTime) {
      options.hour = 'numeric';
      options.minute = 'numeric';
    }
    
    return d.toLocaleString('en-US', options);
  } catch {
    return raw;
  }
};
