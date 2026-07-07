export function makeRectangleSvg(width, height, label) {
  const rectX = 24;
  const rectY = 24;
  const rightMargin = 88;
  const bottomMargin = 24;

  const svgWidth = Math.max(240, rectX + width + rightMargin);
  const svgHeight = Math.max(110, rectY + height + bottomMargin);

  const widthLabelX = rectX + width / 2;
  const widthLabelY = rectY - 8;
  const heightLabelX = rectX + width + 10;
  const heightLabelY = rectY + height / 2 + 4;

  return `
    <svg width="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMinYMin meet" aria-label="${label}" role="img">
      <rect x="${rectX}" y="${rectY}" width="${width}" height="${height}" fill="#d3eef9" stroke="#176b8a" stroke-width="2"></rect>
      <text x="${widthLabelX}" y="${widthLabelY}" text-anchor="middle" fill="#11465d" font-size="12">b = ${width / 8}</text>
      <text x="${heightLabelX}" y="${heightLabelY}" fill="#11465d" font-size="12">h = ${height / 8}</text>
    </svg>
  `;
}
