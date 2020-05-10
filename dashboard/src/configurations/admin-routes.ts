import AdminHome from "modules/admin-home-page";
import LoginPage from "modules/users/components/loginPage";
import UsersListPage from "modules/users/components/usersListPage";
import CommitteesListPage from "modules/committees/components/committeesListPage";
import BestMembersListPage from "modules/best-members/components/page";

import { RouteStructure } from "configurations/interfaces/route.interface";

export let adminRoutes: RouteStructure[] = [
  {
    path: "/",
    label: "Home",
    component: AdminHome,
    adminOnly: true
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/users",
    label: "Users",
    component: UsersListPage,
    adminOnly: true
  },
  {
    path: "/committees",
    label: "Committees",
    component: CommitteesListPage,
    adminOnly: true
  },
  {
    path: "/best-members",
    label: "Best Members",
    component: BestMembersListPage,
    adminOnly: true
  },
];
