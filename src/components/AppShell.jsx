import { Link } from 'what-framework/router';
import { gardenSummary, refreshClock, saveStatus } from '../state/garden.js';
import { useEffect } from 'what-framework';

const nav = [
  ['/', 'Home'],
  ['/catalog', 'Catalog'],
  ['/plots', 'Plots'],
  ['/journal', 'Journal'],
  ['/build', 'Build Notes'],
];

export default function AppShell({ children }) {
  useEffect(() => {
    const timer = setInterval(refreshClock, 60000);
    window.addEventListener('focus', refreshClock);
    return () => { clearInterval(timer); window.removeEventListener('focus', refreshClock); };
  }, []);
  return (
    <div class="site-shell">
      <a class="skip-link" href="#content">Skip to content</a>
      <header class="masthead">
        <div>
          <p class="eyebrow">Garden notebook</p>
          <Link class="brand" href="/" aria-label="Bloom home">Bloom</Link>
        </div>
        <nav class="nav" aria-label="Primary">
          {nav.map(([href, label]) => (
            <Link href={href} activeClass="active" exactActiveClass="active">{label}</Link>
          ))}
        </nav>
      </header>
      <aside class="ribbon" aria-label="Workspace status">
        <span>{gardenSummary().plants} plants</span>
        <span>{gardenSummary().dueToday} due today</span>
        <span>{saveStatus()}</span>
      </aside>
      <main id="content" class="content">
        {children}
      </main>
      <footer class="footer">
        <p>Bloom uses synthetic local garden data. It does not connect to sensors, weather services, or live inventory.</p>
      </footer>
    </div>
  );
}
