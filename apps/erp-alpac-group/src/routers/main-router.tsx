import { LoginPage } from "@app/modules/auth/ui/pages/login/login.page";
import { HomePage } from "@app/modules/dashboard/ui/pages/home/home.page";
import { ContainerCopyright } from "@app/shared/layouts/container-copyright/container-copyright";
import { Navigate, type RouteObject } from "react-router-dom";
import { AuthGuard, PublicGuard } from "./guardians";
import { DashboardRouter } from "./routes/dashboard/dashboard-router";
import { TicketViewer } from "@app/modules/warehouse/ui/views/ticket-viewer/ticket-viewer";

export const MainRouter: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/auth" replace />,
	},
	{
		element: <PublicGuard />,
		children: [
			{
				path: "auth",
				element: <LoginPage />,
			},
		],
	},
	{
		path: ":alias_company",
		element: <AuthGuard />,

		children: [
			{
				index: true,
				element: <Navigate to="dashboard" replace />,
			},
			{
				path: "dashboard",
				children: DashboardRouter,
			},
			{
				path: "ticket",
				element: <ContainerCopyright />,
				children: [
					{
						path: ":warehouseId/:ticketId",
						element: <TicketViewer />,
					},
				],
			},
			{
				path: "setting",
				element: <ContainerCopyright />,
				children: [
					{
						index: true,
						element: <HomePage />,
					},
				],
			},
		],
	},
	{
		path: "*",
		element: <Navigate to="/auth" replace />,
	},
];
