// Levenshtein distance function
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  // initialize first row/column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // fill in the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Get top N suggestions based on similarity
export function getSuggestions(
  candidates: string[],
  input: string,
  n: number
): string[] {
  return candidates
    .map((str) => ({
      str,
      distance: levenshtein(str.toLowerCase(), input.toLowerCase()),
    }))
    .sort((a, b) => a.distance - b.distance) // smaller distance = more similar
    .splice(0, n)
    .map((item) => item.str);
}
