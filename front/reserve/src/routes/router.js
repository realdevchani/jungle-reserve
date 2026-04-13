import { createBrowserRouter } from "react-router-dom";
import HeaderAndFooterLayout from "pages/layout/HeaderAndFooterLayout";
import Home from "pages/Home";
import Login from "pages/login";
import PinSetup from "pages/PinSetup";
import Room from "pages/Room";
import Reserve from "pages/Reserve";
import CheckIn from "pages/CheckIn";
import Away from "pages/Away";
import AdminLogin from "pages/admin/AdminLogin";
import Dashboard from "pages/admin/Dashboard";
import Users from "pages/admin/Users";
import Upload from "pages/admin/Upload";
import Holidays from "pages/admin/Holidays";
import Issues from "pages/admin/Issues";
import QrCodes from "pages/admin/QrCodes";
import Layout from "pages/admin/Layout/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderAndFooterLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "pin/setup",
        element: <PinSetup />,
      },
      {
        path: "room/:id",
        element: <Room />,
      },
      {
        path: "reserve/:id",
        element: <Reserve />,
      },
      {
        path: "checkin/:id",
        element: <CheckIn />,
      },
      {
        path: "away/:id",
        element: <Away />,
      },
      {
        path: "*",
        element: <Holidays />,
      },
    ],
    
  },      {
        path: "admin",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "login",
            element: <AdminLogin />
          },
          {
            path: "holidays",
            element: <Holidays />
          },
          {
            path: "issues",
            element: <Issues />
          },
          {
            path: "qrcodes",
            element: <QrCodes />
          },
          {
            path: "users",
            element: <Users />,
            children: [
              {
                path: "upload",
                element:<Upload />
              }
            ]
          }
        ]
      },
]);

export default router;
