import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const Navigation = ({ currentPage, totalPages, onPrevious, onNext }: NavigationProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-playful border-2 border-primary/20 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentPage === 0}
          className="rounded-full hover:bg-primary/10 disabled:opacity-30"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-2 min-w-[120px] justify-center">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-bubblegum text-lg">
            {currentPage + 1} / {totalPages}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentPage === totalPages - 1}
          className="rounded-full hover:bg-primary/10 disabled:opacity-30"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
