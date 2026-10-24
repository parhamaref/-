import type { ReactElement } from 'react';
import { RouterProvider, matchPath, useRouter } from './router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Listings } from './pages/Listings';
import { PropertyDetail } from './pages/PropertyDetail';
import { Agents } from './pages/Agents';
import { AgentDetail } from './pages/AgentDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { GetStarted } from './pages/GetStarted';
import { Saved } from './pages/Saved';
import { Legal } from './pages/Legal';
import { NotFound } from './pages/NotFound';
import { Admin } from './pages/admin/Admin';

interface RouteDefinition {
  pattern: string;
  render: (params: Record<string, string>) => ReactElement;
}

const ROUTES: RouteDefinition[] = [
  { pattern: '/', render: () => <Home /> },
  { pattern: '/listings', render: () => <Listings /> },
  { pattern: '/property/:slug', render: (params) => <PropertyDetail slug={params.slug} /> },
  { pattern: '/agents', render: () => <Agents /> },
  { pattern: '/agents/:slug', render: (params) => <AgentDetail slug={params.slug} /> },
  { pattern: '/about', render: () => <About /> },
  { pattern: '/contact', render: () => <Contact /> },
  { pattern: '/get-started', render: () => <GetStarted /> },
  { pattern: '/saved', render: () => <Saved /> },
  { pattern: '/privacy', render: () => <Legal kind="privacy" /> },
  { pattern: '/terms', render: () => <Legal kind="terms" /> },
  { pattern: '/admin', render: () => <Admin section="dashboard" /> },
  { pattern: '/admin/properties', render: () => <Admin section="properties" /> },
  { pattern: '/admin/agents', render: () => <Admin section="agents" /> },
  { pattern: '/admin/inquiries', render: () => <Admin section="inquiries" /> },
  { pattern: '/admin/settings', render: () => <Admin section="settings" /> },
];

function Routes() {
  const { pathname } = useRouter();
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  for (const route of ROUTES) {
    const params = matchPath(route.pattern, path);
    if (params) return route.render(params);
  }

  return (
    <Layout>
      <NotFound />
    </Layout>
  );
}

export function NestoraApp() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  );
}


