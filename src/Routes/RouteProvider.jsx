import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import AuthenticationLayout from "../Layouts/AuthenticationLayout";
import Login from "../Components/Login/Login";
import Registration from "../Components/Registration/Registration";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "book-parcel",
        Component: Home,
      },
      {
        path: "view-booking",
        Component: Home,
      },
      {
        path: "track-parcel",
        Component: Home,
      },
      {
        path: "branches",
        Component: Home,
      },
    ],
  },
  {
    path: "authentication",
    Component: AuthenticationLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: "registration",
        Component: Registration,
      },
    ],
  },
]);

export default router;
