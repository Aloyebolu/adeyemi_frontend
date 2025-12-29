import Image from "next/image";
import { Bell, Bookmark, Share2, ChevronRight } from "lucide-react";
import { Announcement } from "@/types/student.types";
import { useDialog } from "@/context/DialogContext";
import React from "react";
import More from "./StudentAnnouncements.More";

interface StudentAnnouncementsProps {
  announcements: Announcement[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const StudentAnnouncements: React.FC<StudentAnnouncementsProps> = ({
  announcements,
  activeCategory,
  onCategoryChange
}) => {
  // const categories = ["all", "Academic", "Financial", "Event", "Accommodation"];
  const categories = ["all"];

  const { openDialog } = useDialog();

  // Validate URL for Next.js Image
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const AnnouncementImage = ({ src, alt }: { src: string; alt: string }) => {
    return isValidUrl(src) ? (
      <img
        src={src}
        alt={alt}
        className="object-cover transition-transform group-hover:scale-105"
        // placeholder="blur"
        // blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..." // optional
      />
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
        No Image
      </div>
    );
  };

  const handleReadMore = (announcement: Announcement) => {
    openDialog("custom", {
      title: "Details",
      component: ()=> <More announcement={announcement} />
    });
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell size={20} /> Announcements
        </h3>
        <div className="flex gap-1">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Announcement Cards */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
          >
            <div className="relative h-40 overflow-hidden">
              <AnnouncementImage src={announcement.image} alt={announcement.title} />

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    announcement.priority === "high"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : announcement.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {announcement.category}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">
                  <Bookmark size={14} />
                </button>
                <button className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">
                  <Share2 size={14} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {announcement.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {announcement.description}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(announcement.date).toLocaleDateString()}</span>
                <button
                  onClick={() => handleReadMore(announcement)}
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  Read More <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
