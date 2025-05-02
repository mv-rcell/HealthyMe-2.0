import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProfileCardProps {
  id: string;
  name: string;
  title: string;
  specialty?: string;
  rating?: number;
  description: string;
  imageUrl?: string;
  availability?: string;
  isSpecialist?: boolean;
  category?: string;
  subcategory?: string;
}

const ProfileCard = ({
  id,
  name,
  title,
  specialty,
  rating = 0,
  description,
  imageUrl,
  availability,
  isSpecialist = false,
  category,
  subcategory,
}: ProfileCardProps) => {
  // Generate initials from name for the avatar fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
       <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    ></motion.div>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-full">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{name}</h3>
              {isSpecialist && rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{title}</p>
            {specialty && (
              <span className="inline-block mt-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {specialty}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 line-clamp-3">
          {description}
        </div>

        {availability && (
          <div className="mt-4 flex items-center text-xs text-muted-foreground gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span>{availability}</span>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            size="sm"
            className={cn("flex-1", isSpecialist ? "bg-primary" : "")}
          >
            View Profile
          </Button>
          <Button
            size="sm"
            variant={isSpecialist ? "outline" : "default"}
            className="flex-1 gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Message</span>
          </Button>
          {isSpecialist && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Book
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;