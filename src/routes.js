import AppShell from './components/AppShell.jsx';
import Build from './pages/Build.jsx';
import Catalog from './pages/Catalog.jsx';
import Home from './pages/Home.jsx';
import Journal from './pages/Journal.jsx';
import NotFound from './pages/NotFound.jsx';
import PlantDetail from './pages/PlantDetail.jsx';
import Plots from './pages/Plots.jsx';

const withShell = (path, component) => ({ path, component, layout: AppShell });

export const routes = [
  withShell('/', Home),
  withShell('/catalog', Catalog),
  withShell('/plants/:slug', PlantDetail),
  withShell('/plots', Plots),
  withShell('/journal', Journal),
  withShell('/build', Build),
  withShell('/404', NotFound),
  withShell('/*', NotFound),
];

export const routeMeta = {
  '/': 'Bloom garden planner',
  '/catalog': 'Seed catalog',
  '/plots': 'Plot plan',
  '/journal': 'Watering journal',
  '/build': 'How it is built',
};
