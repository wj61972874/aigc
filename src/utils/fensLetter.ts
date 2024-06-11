import { get } from "idb-keyval";
import { useEffect, useState } from "react";
export const useCanGenerated = () => {
  const [canGenerated, setCanGenerated] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const value = await get("generatedImgs");
      setCanGenerated(value && value.length === 3);
    };

    fetchData();
  }, []);
  return canGenerated;
};
