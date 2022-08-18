const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "index",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "create-receipt",
        component: () => import("pages/CreateReceipt.vue"),
        name: "createReceipt",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "receipt/:id",
        component: () => import("pages/CreateReceipt.vue"),
        name: "receipt",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "login",
        component: () => import("pages/LoginPage.vue"),
        name: "login",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
