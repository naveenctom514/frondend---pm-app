const ADMIN_ROUTES_ARR = ["dashboard","/customer", "/task", "/members", "/team"];


export const USER_BASED_ROUTES = {
  admin: [...ADMIN_ROUTES_ARR, { path: "/customer" }],
};
