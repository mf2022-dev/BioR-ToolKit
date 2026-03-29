// =============================================================================
// BioR Platform - SPA HTML Shell
// =============================================================================
// Assembles the complete SPA HTML document from:
//   - styles.ts  (CSS)
//   - scripts/   (JavaScript)
// This is the only file that produces the final HTML string.
// =============================================================================

import { getSPAStyles } from './styles';
import { getFrontendJS } from './scripts/index';

export function getSPAHTML(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BioR - Biological Response Network</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2300A86B'/><text x='50%25' y='55%25' dominant-baseline='central' text-anchor='middle' fill='white' font-family='system-ui' font-weight='900' font-size='18'>B</text></svg>">
  <link rel="stylesheet" href="/static/bior-design-system.css">
  <link rel="stylesheet" href="/static/tailwind.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js"><\/script>
  <style>
${getSPAStyles()}
  </style>
</head>
<body class="h-full" style="background:var(--bior-bg-page);color:var(--bior-text-primary)">
  <div id="app"></div>
  <div id="toasts" class="toast-container"></div>
  <div id="modal"></div>
  <script>
${getFrontendJS()}
  <\/script>
</body>
</html>`;
}
