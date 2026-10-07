function Botanical({ plant }) {
  const green = '#5d7b4d';
  if (plant.family === 'Root') return <g data-botanical="Root"><path d="M43 49 Q23 52 45 97 Q69 54 49 49Z" fill={plant.color} /><path d="M46 51 Q29 33 25 25 M46 51 Q48 28 49 21 M46 51 Q63 33 68 29" stroke={green} stroke-width="5" fill="none" stroke-linecap="round" /><path d="M39 62h11 M41 72h8 M44 82h6" stroke="#fffdf1" opacity=".6" stroke-width="2" /></g>;
  if (plant.family === 'Fruit') return <g data-botanical="Fruit"><path d="M44 98 Q43 66 49 28 M46 56 L25 40 M46 73 L66 57" fill="none" stroke={green} stroke-width="4" /><path d="M48 30 Q69 27 63 43 Q47 42 48 30 M44 55 Q21 53 25 70 Q41 68 44 55" fill={green} /><circle cx="29" cy="44" r="12" fill={plant.color} /><circle cx="65" cy="64" r="12" fill={plant.color} /><path d="M24 33l5 5 4-5 M60 53l5 5 4-5" stroke={green} fill="none" stroke-width="3" /><circle cx="25" cy="42" r="3" fill="#fffdf1" opacity=".5" /></g>;
  if (plant.family === 'Vine') return <g data-botanical="Vine"><path d="M40 99 Q24 71 45 52 T42 24 M44 55 Q67 43 66 30 Q62 21 57 29" fill="none" stroke={green} stroke-width="3" /><path d="M43 42 Q16 23 22 49 Q35 58 43 42 M46 64 Q71 47 69 72 Q55 82 46 64" fill={green} opacity=".8" /><rect x="39" y="58" width="15" height="38" rx="8" fill={plant.color} transform="rotate(-15 45 76)" /><path d="M44 65l6 23" stroke="#fffdf1" opacity=".5" stroke-width="2" /></g>;
  if (plant.family === 'Flower') return <g data-botanical="Flower"><path d="M45 99V43 M45 80L27 66 M45 68L64 56" stroke={green} stroke-width="4" /><path d="M45 42l-13-18 16 7 13-10-2 17 16 10-20 2-6 18-7-18-17-1Z" fill={plant.color} /><circle cx="47" cy="42" r="7" fill="#d9a441" /><path d="M26 65 Q16 80 43 86 M62 56 Q77 67 46 73" fill={green} opacity=".8" /></g>;
  return <g data-botanical="Herb"><path d="M45 99V28" stroke={green} stroke-width="4" /><path d="M45 45 Q19 19 20 46 Q32 58 45 45 M45 59 Q72 34 72 59 Q59 74 45 59 M45 77 Q18 55 22 81 Q36 91 45 77 M45 36 Q35 18 47 21 Q58 27 45 36" fill={plant.color} /><path d="M28 39l17 7 M45 61l17-9 M28 74l17 5" stroke="#fffdf1" opacity=".5" stroke-width="1.5" /></g>;
}

export function PacketPlant({ plant, className = 'packet-plant' }) {
  return (
    <svg class={className} viewBox="0 0 90 120" role="img" aria-label={`${plant.name} seed packet illustration`}>
      <rect x="10" y="12" width="70" height="96" rx="7" fill="#fffdf1" stroke={plant.color} stroke-width="4" />
      <Botanical plant={plant} />
      <path d="M20 17 H70 M20 103 H70" stroke={plant.color} opacity=".6" stroke-width="1" stroke-dasharray="3 4" />
    </svg>
  );
}

export function PlantMark({ plant }) {
  return (
    <svg class="plant-mark" viewBox="0 0 90 120" role="img" aria-label={`${plant.name} illustration`}>
      <Botanical plant={plant} />
    </svg>
  );
}
