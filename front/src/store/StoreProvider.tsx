import { createContext, ReactNode } from 'react';

import { store, PrimaryStore} from "./PrimaryStore";

interface IStores {
  store: PrimaryStore;
}

interface IProviderProps {
  children: ReactNode;
}

export const storeContext = createContext<IStores>({ store });

export const StoreProvider = ({ children }: IProviderProps) => {
  return <storeContext.Provider value={{ store }}>{children}</storeContext.Provider>;
};