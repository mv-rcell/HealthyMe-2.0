
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";

const AdButton = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-primary hover:text-primary/80 hover:bg-primary/5"
      asChild
    >
      <Link to="/advideo" className="flex items-center gap-2">
        <VideoIcon className="h-4 w-4" />
        <span>Watch Promo</span>
      </Link>
    </Button>
  );
};

export default AdButton;
