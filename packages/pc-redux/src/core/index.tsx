export { default as createApp } from "./CreateApp";
export { default as createPage } from "./CreatePage";

export { default as RegisterPage } from "./RegisterPage";
export { default as RegisterApp } from "./RegisterApp";

export type { ICProps, IPageConfig } from "./CreatePage";
export type { IAppConfig } from "./CreateApp";

import type { IMenuProps } from "../components/layouts/proLayout";
import type { IRouteProps } from "./RoutesComponent";

interface IRouteMenuItem extends IMenuProps, IRouteProps {
  children?: IRouteMenuItem[];
}

export type { IRouteProps, IRouteMenuItem };
