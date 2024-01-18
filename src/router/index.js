/* Developed By Taipei Urban Intelligence Center 2023 */

// Lead Developer:  Igor Ho (FE Engineer)
// Data Pipelines:  Iima Yu (Data Scientist)
// Design and UX: Roy Lin (Prev. Consultant), Chu Chen (Researcher)
// Systems: Ann Shih (Systems Engineer)
// Testing: Jack Huang (Data Scientist), Ian Huang (Data Analysis Intern)

/* Department of Information Technology, Taipei City Government */

import { createRouter, createWebHistory } from "vue-router";
import { useContentStore } from "../store/contentStore";
import { useMapStore } from "../store/mapStore";
import { useAuthStore } from "../store/authStore";
import DashboardView from "../views/DashboardView.vue";
import MapView from "../views/MapView.vue";
import ComponentView from "../views/ComponentView.vue";
import ComponentInfoView from "../views/ComponentInfoView.vue";

const routes = [
	{
		path: "/",
		redirect: "/dashboard",
	},
	{
		path: "/dashboard",
		name: "dashboard",
		component: DashboardView,
	},
	{
		path: "/mapview",
		name: "mapview",
		component: MapView,
	},
	{
		path: "/component",
		name: "component",
		component: ComponentView,
	},
	{
		path: "/component/:index",
		name: "component-info",
		component: ComponentInfoView,
	},
	{
		path: "/admin",
		redirect: "/admin/overview",
	},
	{
		path: "/admin/overview",
		name: "admin-overview",
		component: () => import("../views/admin/AdminOverview.vue"),
	},
	{
		path: "/admin/dashboard",
		name: "admin-dashboard",
		component: () => import("../views/admin/AdminDashboard.vue"),
	},
	{
		path: "/admin/edit-component",
		name: "admin-edit-component",
		component: () => import("../views/admin/AdminEditComponent.vue"),
	},
	{
		path: "/admin/issue",
		name: "admin-issue",
		component: () => import("../views/admin/AdminIssue.vue"),
	},
	{
		path: "/:pathMatch(.*)*",
		name: "notFoundRedirect",
		redirect: "/dashboard",
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	base: import.meta.env.BASE_URL,
	routes,
});

// Sets route name to currentPath in authStore
router.beforeEach((to) => {
	const authStore = useAuthStore();

	if (to.name.includes("admin")) {
		authStore.setCurrentPath("admin");
		return;
	}
	authStore.setCurrentPath(to.name);
});

router.beforeEach((to) => {
	const contentStore = useContentStore();
	const mapStore = useMapStore();
	// Pass in route info to contentStore if the path starts with /dashboard or /mapview
	if (
		to.path.toLowerCase() === "/dashboard" ||
		to.path.toLowerCase() === "/mapview"
	) {
		contentStore.setRouteParams(to.path, to.query.index);
	} else {
		contentStore.clearCurrentDashboard();
	}
	// Get Component data if the path is component-info
	if (to.name === "component-info") {
		contentStore.getCurrentComponentData(to.params.index);
	}
	// Clear the entire mapStore if the path doesn't start with /mapview
	if (to.path.toLowerCase() !== "/mapview") {
		mapStore.clearEntireMap();
	}
	// Clear only map layers if the path starts with /mapview
	else if (to.path.toLowerCase() === "/mapview") {
		mapStore.clearOnlyLayers();
	}
});

export default router;
