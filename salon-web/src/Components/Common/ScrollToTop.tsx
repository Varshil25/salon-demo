import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const location = useLocation(); // Get the current location object

  useEffect(() => {
    // Scroll to the top whenever the pathname changes (i.e., when the route changes)
    window.scrollTo(0, 0);
  }, [location]); // Trigger effect on location change (pathname change)

  return null; // This component doesn't render anything, it's just for side effects
};

export default ScrollToTop;
