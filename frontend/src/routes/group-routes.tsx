import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminDispatchers from "@/pages/admin/admin-dispatchers";
import AdminServices from "@/pages/admin/admin-service";
import CalledClient from "@/pages/client/called";
import TicketDetails from "@/pages/client/called-details";
import CardProfileDispatcher from "@/pages/client/card-profile-dispatcher";
import InitialSearchDisp from "@/pages/client/initial-search-disp";
import ProfileClient from "@/pages/client/profile";
import CalledDispatcher from "@/pages/dispatcher/called";
import TicketDetailsDispatcher from "@/pages/dispatcher/called-details";
import HomeDispatcher from "@/pages/dispatcher/home";
import ProfilePage from "@/pages/dispatcher/profile";
import Login from "@/pages/login.tsx";
import ClientRecord from "@/pages/record/client-record.tsx";
import DispatcherRecord from "@/pages/record/dispatcher-record.tsx";
import Home from "../pages/home.tsx";
import { FRONTEND_ROUTES } from "./frontend-routes.ts";


export const publicRoutes = [
    {
        path: FRONTEND_ROUTES.HOME,
        element: <Home />,
    },

    {
        path: FRONTEND_ROUTES.LOGIN,
        element: <Login />,
    },

    {
        path: FRONTEND_ROUTES.REGISTER.CLIENT,
        element: <ClientRecord />,
    },

    {
        path: FRONTEND_ROUTES.REGISTER.DISPATCHER,
        element: <DispatcherRecord />,
    },
];


export const clientRoutes = [
    {
        path: FRONTEND_ROUTES.CLIENT.SEARCH_DISPATCHER,
        element: <InitialSearchDisp />,
    },

    {
        path: FRONTEND_ROUTES.CLIENT.PROFILE,
        element: <ProfileClient />,
    },

    {
        path: FRONTEND_ROUTES.CLIENT.TICKET,
        element: <CalledClient />,
    },

    {
        path: FRONTEND_ROUTES.CLIENT.TICKET_DETAILS,
        element: <TicketDetails />,
    },

    {
        path: FRONTEND_ROUTES.CLIENT.CARD_PROFILE_DISPATCHER,
        element: <CardProfileDispatcher />,
    },
];


export const dispatcherRoutes = [
    {
        path: FRONTEND_ROUTES.DISPATCHER.INITIAL,
        element: <HomeDispatcher />,
    },

    {
        path: FRONTEND_ROUTES.DISPATCHER.PROFILE,
        element: <ProfilePage />,
    },

    {
        path: FRONTEND_ROUTES.DISPATCHER.TICKET,
        element: <CalledDispatcher />,
    },

    {
        path: FRONTEND_ROUTES.DISPATCHER.TICKET_DETAILS,
        element: <TicketDetailsDispatcher />,
    },
];


export const adminRoutes = [
    {
        path: FRONTEND_ROUTES.ADMIN.INITIAL,
        element: <AdminDashboard />,
    },

    {
        path: FRONTEND_ROUTES.ADMIN.DISPATCHERS,
        element: <AdminDispatchers />,
    },

    {
        path: FRONTEND_ROUTES.ADMIN.SERVICES,
        element: <AdminServices />,
    },
];
