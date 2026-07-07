export function makeCircleSvg(radius, label) {
  const cx = 96;
  const cy = 82;
  const diameter = radius * 2;
  const textX = cx + radius + 16;
  const textY = cy - 6;

  return `
    <svg width="100%" viewBox="0 0 260 160" preserveAspectRatio="xMinYMin meet" aria-label="${label}" role="img">
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#fdeecf" stroke="#a86812" stroke-width="2"></circle>
      <line x1="${cx}" y1="${cy}" x2="${cx + radius}" y2="${cy}" stroke="#a86812" stroke-width="2"></line>
      <text x="${cx + radius / 2}" y="${cy - 8}" text-anchor="middle" fill="#7f4f10" font-size="12">r = ${radius / 8}</text>
      <text x="${textX}" y="${textY}" fill="#7f4f10" font-size="12">d = ${diameter / 8}</text>
    </svg>
  `;
}