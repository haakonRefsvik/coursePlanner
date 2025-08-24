const courseColors = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A8",
  "#FFA533", "#33FFF2", "#A833FF", "#FF3333",
  "#33FFAA", "#FFD433"
];

let colorIndex = 0;

export function getNextColor(): string {
  const color = courseColors[colorIndex];
  colorIndex = (colorIndex + 1) % courseColors.length; // cycle back to start
  return color;
}
