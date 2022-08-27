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
          label: "Home",
        },
      },
      {
        path: "create-receipt",
        component: () => import("pages/CreateReceipt.vue"),
        name: "createReceipt",
        meta: {
          requireAuth: true,
          label: "New Receipt",
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
        meta: {
          label: "Login",
        },
      },
      {
        path: "receipts",
        component: () => import("pages/ReceiptsPage.vue"),
        name: "receipts",
        meta: {
          label: "Receipts",
          requireAuth: true,
        },
      },
      {
        path: "users",
        component: () => import("pages/UsersPage.vue"),
        name: "users",
        meta: {
          label: "Users",
          admin: true,
          requireAuth: true,
        },
      },
      {
        path: "user/:id",
        component: () => import("pages/UserPage.vue"),
        name: "user",
        meta: {
          admin: true,
          requireAuth: true,
        },
      },
      {
        path: "change-password",
        component: () => import("pages/ChangePasswordPage.vue"),
        name: "changePassword",
        meta: {
          requireAuth: true,
          label: "Change Password",
        },
      },
      {
        path: "subscription",
        component: () => import("pages/SubscriptionPage.vue"),
        name: "subscription",
        meta: {
          requireAuth: true,
          label: "Subscription",
        },
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
