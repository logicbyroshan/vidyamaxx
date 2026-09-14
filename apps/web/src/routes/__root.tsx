import * as React from 'react';
import { createRootRoute } from '@tanstack/react-router';
import { AppShell } from '../layouts/AppShell';
import { Error404, Error500 } from '../pages/ErrorPages';

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <AppShell />
    </React.Fragment>
  ),
  notFoundComponent: () => <Error404 />,
  errorComponent: () => <Error500 />,
});
