export function makeTriangleSvg(a, b, c, angleLabel = "", anglePosition = "left", showAngleArc = false) {
  let angleLabelX = 64;
  let angleLabelY = 112;

  if (anglePosition === "top") {
    angleLabelX = 166;
    angleLabelY = 44;
  } else if (anglePosition === "right") {
    angleLabelX = 188;
    angleLabelY = 100;
  }

  const angleText = angleLabel
    ? `<text x="${angleLabelX}" y="${angleLabelY}" fill="#145f3d" font-size="12">${angleLabel}</text>`
    : "";

  let angleArc = "";
  if (showAngleArc) {
    if (anglePosition === "left") {
      angleArc = `<path d="M52 120 A22 22 0 0 0 48 106" fill="none" stroke="#145f3d" stroke-width="2"></path>`;
    } else if (anglePosition === "top") {
      angleArc = `<path d="M180 54 A24 24 0 0 0 164 42" fill="none" stroke="#145f3d" stroke-width="2"></path>`;
    } else if (anglePosition === "right") {
      angleArc = `<path d="M180 98 A20 20 0 0 1 167 112" fill="none" stroke="#145f3d" stroke-width="2"></path>`;
    }
  }

  return `
    <svg width="250" height="150" viewBox="0 0 250 150" aria-label="Rettvinklet trekant" role="img">
      <polygon points="30,120 180,120 180,30" fill="#e4f6ec" stroke="#1d7b4f" stroke-width="2"></polygon>
      <path d="M170 120 L170 110 L180 110" fill="none" stroke="#1d7b4f" stroke-width="2"></path>
      <text x="100" y="136" fill="#145f3d" font-size="12">${a}</text>
      <text x="190" y="82" fill="#145f3d" font-size="12">${b}</text>
      <text x="104" y="50" fill="#145f3d" font-size="12">${c}</text>
      <text x="186" y="116" fill="#145f3d" font-size="12">90°</text>
      ${angleArc}
      ${angleText}
    </svg>
  `;
}
