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
import AddParcel from "../Components/AddParcel/AddParcel";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import Myparcels from "../Components/Dashboard/Myparcels";
import Payment from "../Components/Payment/Payment";
import PaymentHistory from "../Components/Payment/PaymentHistory";
import TrackParcel from "../Components/TrackParcel/TrackParcel";
import PrivateRoutes from "./PrivateRoute";

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
        path: "add-parcel",
       element:<PrivateRoutes><AddParcel></AddParcel></PrivateRoutes>
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
      // {
      //   path: "forget-pass",
      //   Component: ForgetPass,
      // },
      // {
      //   path: "verify-code",
      //   Component: VerifyCode,
      // },
      // {
      //   path: "reset-pass",
      //   Component: ResetPass,
      // },
    ],
  },
  {
    path:"dashboard",
    element:<PrivateRoutes><DashBoardLayout></DashBoardLayout></PrivateRoutes>,
    children:[
      {
        index:true,Component:Myparcels
      },
      {
        path:"payment/:id",
        Component:Payment
      },
      {
        path:"payment-history",
        Component:PaymentHistory
      },
      {
        path:"track-parcel",
        Component:TrackParcel
      },
    ]

  },
]);

export default router;
