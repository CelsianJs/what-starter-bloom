import { Link, route } from 'what-framework/router';

export default function NotFound() {
  return (
    <section class="empty-state page-enter">
      <p class="eyebrow">404</p>
      <h1>This garden path is overgrown.</h1>
      <p>No Bloom page exists for <code>{route.path}</code>.</p>
      <Link class="button primary" href="/catalog">Return to catalog</Link>
    </section>
  );
}
