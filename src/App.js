import React, { useEffect } from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getSession } from "./redux/services/authService";
import { Navigation } from "./components/navigation/Navigation";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Navbar } from "./components/navbar/Navbar";
import { AuthenticatedRoutes } from "./components/authenticated-routes/AuthenticatedRoutes";
import { Login } from "./pages/login/Login";
import { ForgotPassword } from "./pages/forgot-password/ForgotPassword";
import { ResetPassword } from "./pages/reset-password/ResetPassword";
import { PageNotFound } from "./pages/page-not-found/PageNotFound";

import { NotificationPage } from "./pages/notification/NotificationPage";
import { AdminNavigation } from "./components/navigation/AdminNavigation";
import Members from "./pages/Members";
import Team from "./pages/Team";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  let custom_menu;
  if (isAuthenticated) {
    if (user.user.type === "admin") {
      custom_menu = <AdminNavigation />;
    } else {
      custom_menu = <Navigation />;
    }
  }

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  const ADMIN_ROUTES = (
    <>
      <Route path="/members" element={<Members />} />
      <Route path="/team" element={<Team />} />
    </>
  );

  const USER_ROUTES = <></>;

  return (
    <div className="App">
      <Layout>
        {isAuthenticated && (
          <Sidebar menu={custom_menu} />
        )}
        <Layout.Content className="content">
          {pathname !== "/" && <Navbar menu={custom_menu} />}
          <div
            className="relative"
            style={
              isAuthenticated && !pathname.startsWith("/e/call")
                ? {}
                : {
                    height: "100vh",
                    overflowY: "auto",
                  }
            }
          >
            {process.env.REACT_APP_ENVIRONMENT === "qa" && (
              <span className="bg-red-500 text-white p-2 rounded absolute w-[4rem] flex left-[50%] right-[50%]">
                Testing{" "}
              </span>
            )}
            <Routes>
              <Route index element={<Login />} />{" "}
              <Route path={`/forgot-password`} element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
         
              <Route element={<AuthenticatedRoutes />}>
                <Route path="/notifications" element={<NotificationPage />} />

                {ADMIN_ROUTES}
                {USER_ROUTES}
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;
