const courseColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#FFA533",
  "#33FFF2",
  "#A833FF",
  "#FF3333",
  "#33FFAA",
  "#FFD433",
];

let colorIndex = 0;

export function getNextColor(id: string): string {
  colorIndex = (colorIndex + 1) % courseColors.length; // cycle back to start
  const hashColor = "#" + betterHash(id, 6).toUpperCase();
  return hashColor;
}

function betterHash(str: string, n: number): string {
  let h1 = 0x811c9dc5; // FNV offset basis
  let h2 = 0x01000193; // prime

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, h2); // 32-bit multiply
    h1 >>>= 0;

    // mix into h2 as well
    h2 ^= c + h1;
    h2 = Math.imul(h2, 0x85ebca6b);
    h2 >>>= 0;
  }

  // combine h1 and h2 into a long hex string
  let hex = (h1.toString(16) + h2.toString(16)).padStart(n, "0");

  // repeat until it’s long enough
  while (hex.length < n) {
    hex += hex; // repeat pattern
  }

  // return exactly n hex digits
  return hex.slice(0, n);
}
