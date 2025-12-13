/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const loadingListeners: Array<(loading: boolean) => void> = [];

export const setLoadingGlobal = (loading: boolean) => {
  loadingListeners.forEach((listener) => listener(loading));
};

export const adicionarLoadingListener = (
  listener: (loading: boolean) => void
) => {
  loadingListeners.push(listener);
};

export const removerLoadingListener = (
  listener: (loading: boolean) => void
) => {
  const index = loadingListeners.indexOf(listener);
  if (index > -1) {
    loadingListeners.splice(index, 1);
  }
};

function LoadingGlobal() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const listener = (loading: boolean) => {
      setIsLoading(loading);
    };

    adicionarLoadingListener(listener);

    return () => {
      removerLoadingListener(listener);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-neutral-700 font-medium">Carregando...</p>
      </div>
    </div>
  );
}

export default LoadingGlobal;
