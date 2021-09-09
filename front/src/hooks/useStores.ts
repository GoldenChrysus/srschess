import { useContext } from "react";

import { storeContext } from "../store/StoreProvider";

export const useStores = () => useContext(storeContext);