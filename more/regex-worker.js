self.addEventListener('message', (event) => {
  const { id, pattern, flags, text, maxMatches } = event.data;
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        value: match[0],
        groups: match.groups ? Object.keys(match.groups) : [],
      });
      if (matches.length >= maxMatches) break;
      if (!regex.global) break;
      if (match[0] === '') regex.lastIndex++;
    }
    self.postMessage({ id, matches, truncated: matches.length >= maxMatches });
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
});
