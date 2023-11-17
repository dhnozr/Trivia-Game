import { useState } from 'react';
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

import Layout from './Layout';
import HomePage from './HomePage';

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={route}></RouterProvider>
    </>
  );
}

export default App;
