import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import AuthenticationLayout from "../Layouts/AuthenticationLayout";
import Login from "../Components/Login/Login";
import Registration from "../Components/Registration/Registration";
import Coverage from "../Components/CoverageMap/Coverage";
import ForgetPass from "../Components/ResetPassword/ForgetPass";
import VerifyCode from "../Components/ResetPassword/VerifyCode";
import ResetPass from "../Components/ResetPassword/ResetPass";

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
        path: "coverage",
        Component: Coverage,
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
      {
        path: "forget-pass",
        Component: ForgetPass,
      },
      {
        path: "verify-code",
        Component: VerifyCode,
      },
      {
        path: "reset-pass",
        Component: ResetPass,
      },
    ],
  },
]);

export default router;
