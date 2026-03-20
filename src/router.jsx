import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { Overview } from './pages/Overview';
import { Control } from './pages/Control';
import { Alarms } from './pages/Alarms';
import { Trends } from './pages/Trends';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'control',
        element: <Control />,
      },
      {
        path: 'alarms',
        element: <Alarms />,
      },
      {
        path: 'trends',
        element: <Trends />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
