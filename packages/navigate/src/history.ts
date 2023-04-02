import { createBrowserHistory, createHashHistory } from "history";
import { useEnv } from "@szero/hooks";
const { route = {} } = useEnv();

export type RouteType = "Browser" | "Hash";

let history: any;
const { type = "Browser" } = route || {};
if (type && type == "Hash") {
  history = createHashHistory({ window });
} else {
  history = createBrowserHistory({ window });
}

export { history };
