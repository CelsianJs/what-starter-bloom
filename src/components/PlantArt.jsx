export function PacketPlant({ plant, className = 'packet-plant' }) {
  return (
    <svg class={className} viewBox="0 0 90 120" role="img" aria-label={`${plant.name} seed packet illustration`}>
      <rect x="10" y="12" width="70" height="96" rx="7" fill="#fffdf1" stroke={plant.color} stroke-width="4" />
      <path d="M45 92 C42 70 42 46 48 28" stroke={plant.color} stroke-width="5" fill="none" stroke-linecap="round" />
      <ellipse cx="34" cy="57" rx="18" ry="8" fill={plant.color} opacity=".78" transform="rotate(-31 34 57)" />
      <ellipse cx="58" cy="49" rx="18" ry="8" fill={plant.color} opacity=".68" transform="rotate(29 58 49)" />
      <circle cx="45" cy="31" r="8" fill="#d9a441" opacity=".82" />
      <path d="M20 24 H70 M20 98 H70" stroke="#d9a441" stroke-width="2" stroke-dasharray="3 4" />
    </svg>
  );
}

export function PlantMark({ plant }) {
  return (
    <svg class="plant-mark" viewBox="0 0 80 80" role="img" aria-label={`${plant.name} illustration`}>
      <circle cx="40" cy="66" r="8" fill="#7b5b36" />
      <path d="M40 64 C38 44 40 28 42 14" stroke={plant.color} stroke-width="5" fill="none" stroke-linecap="round" />
      <ellipse cx="29" cy="38" rx="18" ry="9" fill={plant.color} opacity=".78" transform="rotate(-28 29 38)" />
      <ellipse cx="52" cy="30" rx="19" ry="9" fill={plant.color} opacity=".72" transform="rotate(28 52 30)" />
      <ellipse cx="40" cy="20" rx="12" ry="7" fill="#f0b84a" opacity=".78" />
    </svg>
  );
}
