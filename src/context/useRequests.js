import { useContext } from "react";
import { RequestsContext } from "./requests-context";

export function useRequests() {
  return useContext(RequestsContext);
}
