export function makeCircleSvg(radius, label) {
  const minSvgWidth = 260;
  const minSvgHeight = 160;
  const margin = 24;
  const maxLabelWidth = 90;

  // Keep the diagram readable by limiting the rendered radius while preserving value labels.
  const drawRadius = Math.min(radius, 56);
  const cx = margin + drawRadius;
  const cy = margin + drawRadius;
  const diameter = radius * 2;

  const svgWidth = Math.max(minSvgWidth, cx + drawRadius + maxLabelWidth + margin);
  const svgHeight = Math.max(minSvgHeight, cy + drawRadius + margin);

  const textX = cx + drawRadius + 16;
  const textY = cy - 6;

  return `
    <svg width="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMinYMin meet" aria-label="${label}" role="img">
      <circle cx="${cx}" cy="${cy}" r="${drawRadius}" fill="#fdeecf" stroke="#a86812" stroke-width="2"></circle>
      <line x1="${cx}" y1="${cy}" x2="${cx + drawRadius}" y2="${cy}" stroke="#a86812" stroke-width="2"></line>
      <text x="${cx + drawRadius / 2}" y="${cy - 8}" text-anchor="middle" fill="#7f4f10" font-size="12">r = ${radius / 8}</text>
      <text x="${textX}" y="${textY}" fill="#7f4f10" font-size="12">d = ${diameter / 8}</text>
    </svg>
  `;
}