import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { BrowseServices } from "./pages/BrowseServices";
import { ClientDashboard } from "./pages/ClientDashboard";
import { PostTask } from "./pages/PostTask";
import { RequestDetails } from "./pages/RequestDetails";
import { CompareOffers } from "./pages/CompareOffers";
import { JobWorkspace } from "./pages/JobWorkspace";
import { ProviderDashboard } from "./pages/ProviderDashboard";
import { CreateService } from "./pages/CreateService";
import { BrowseTasks } from "./pages/BrowseTasks";
import { ProviderProfile } from "./pages/ProviderProfile";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Messages } from "./pages/Messages";
import { ServiceDetail } from "./pages/ServiceDetail";
import { SupportPage } from "./pages/SupportPage";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/services",
    Component: BrowseServices,
  },
  {
    path: "/services/:id",
    Component: ServiceDetail,
  },
  {
    path: "/client/dashboard",
    Component: ClientDashboard,
  },
  {
    path: "/client/post-task",
    Component: PostTask,
  },
  {
    path: "/client/edit-task/:taskId",
    Component: PostTask,
  },
  {
    path: "/client/request/:taskId",
    Component: RequestDetails,
  },
  {
    path: "/client/compare-offers/:taskId",
    Component: CompareOffers,
  },
  {
    path: "/client/tasks/:taskId/offers",
    Component: CompareOffers,
  },
  {
    path: "/client/jobs/:jobId",
    Component: JobWorkspace,
  },
  {
    path: "/provider/dashboard",
    Component: ProviderDashboard,
  },
  {
    path: "/provider/create-service",
    Component: CreateService,
  },
  {
    path: "/provider/edit-service/:serviceId",
    Component: CreateService,
  },
  {
    path: "/provider/tasks",
    Component: BrowseTasks,
  },
  {
    path: "/providers/:providerId",
    Component: ProviderProfile,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/messages",
    Component: Messages,
  },
  {
    path: "/support/help",
    Component: SupportPage,
  },
  {
    path: "/support/safety",
    Component: SupportPage,
  },
  {
    path: "/support/contact",
    Component: SupportPage,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
