import { 
  AppContainer, 
  createLocalNamedComponentLoader,
} from '@orbusinfinity-shared/app-container';
import type {
  NavigationItem,
  RouteConfig,
} from '@orbusinfinity-shared/app-container';
import { ChartMultiple24Filled, ChartMultiple24Regular, bundleIcon } from '@fluentui/react-icons';

const DashboardIcon = bundleIcon(ChartMultiple24Filled, ChartMultiple24Regular);

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
];

function App() {
  return (
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
  );
}

export default App;
