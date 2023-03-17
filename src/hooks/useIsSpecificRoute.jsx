import { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

const useIsSpecificRoute = routes => {
  const [isSpecificRoute, setIsSpecificRoute] = useState(false);
  const match = useRouteMatch();
  useEffect(() => {
    setIsSpecificRoute(routes?.some(route => route === match?.path));
  }, []);

  return isSpecificRoute;
};

export default useIsSpecificRoute;
