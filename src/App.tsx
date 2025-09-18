import {
  AppContainer,
  createLocalNamedComponentLoader,
} from '@orbusinfinity-shared/app-container';
import type {
  NavigationItem,
  RouteConfig,
} from '@orbusinfinity-shared/app-container';
import {
  ChartMultiple24Filled,
  ChartMultiple24Regular,
  ContentView24Filled,
  ContentView24Regular,
  bundleIcon,
} from '@fluentui/react-icons';
import { ApolloProvider } from '@apollo/client/react';
import { type ApolloClient } from '@apollo/client';
import { EntityCacheProvider } from '@orbusinfinity-shared/apollo-cache';

const DashboardIcon = bundleIcon(ChartMultiple24Filled, ChartMultiple24Regular);
const TodoIcon = bundleIcon(ContentView24Filled, ContentView24Regular);

// Navigation configuration for Remote-2
const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    icon: <DashboardIcon />,
    label: 'Dashboard',
    path: '/',
    type: 'route',
    enabled: true,
    order: 1,
  },
  {
    id: 'todos',
    icon: <TodoIcon />,
    label: 'TODO Tiles',
    path: '/todos',
    type: 'route',
    enabled: true,
    order: 2,
  },
];

// Route configuration for Remote-2
const routeConfigs: RouteConfig[] = [
  {
    id: 'dashboard',
    path: '/',
    exact: true,
    componentLoader: createLocalNamedComponentLoader(
      () => import('./components/DashboardMock'),
      'default'
    ),
    enabled: true,
    title: 'Dashboard',
    description: 'Analytics dashboard component showcase',
  },
  {
    id: 'todos',
    path: '/todos',
    exact: true,
    componentLoader: createLocalNamedComponentLoader(
      () => import('./components/TodoTiles'),
      'default'
    ),
    enabled: true,
    title: 'TODO Tiles',
    description: 'Manage your TODO items in a tile view',
  },
];

interface AppProps {
  client: ApolloClient;
}

function App({ client }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <EntityCacheProvider apolloClient={client}>
        <AppContainer
          layoutProps={{
            headerProps: {
              appName: 'Remote-2 Dashboard',
              showSearch: false,
              showHelp: false,
              showNotifications: false,
              showSettings: false,
              showUserMenu: false,
            },
            sidebarProps: {
              navigationItems,
            },
            mainContentProps: {
              routes: routeConfigs,
            },
          }}
        />
      </EntityCacheProvider>
    </ApolloProvider>
  );
}

export default App;
