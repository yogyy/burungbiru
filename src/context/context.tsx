import * as React from "react";

export type Loading = {
  loading: boolean;
};

export interface LoadingContextInterface {
  loading: Loading;
  setLoading: React.Dispatch<React.SetStateAction<Loading>>;
}

const defaultState = {
  loading: { loading: false },
  setLoading: () => {},
} as LoadingContextInterface;

export const LoadingContext = React.createContext(defaultState);

type LoadingProvider = {
  children: React.ReactNode;
};
export default function LoadingProvider({ children }: LoadingProvider) {
  const [loading, setLoading] = React.useState<Loading>({
    loading: false,
  });

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
export const useLoadingContext = () => React.useContext(LoadingContext);
