import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import heroIllustration from "@/assets/hero-illustration.jpg";

interface CoverPageProps {
  title?: string;
  author?: string;
  onTitleChange?: (title: string) => void;
  onAuthorChange?: (author: string) => void;
}

export const CoverPage = ({ title, author, onTitleChange, onAuthorChange }: CoverPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-300"></div>
      
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Logo / Title */}
        <div className="text-center space-y-4 animate-fadeIn">
          <h1 className="font-bubblegum text-7xl md:text-8xl bg-gradient-magical bg-clip-text text-transparent drop-shadow-lg">
            The Tale Maker
          </h1>
          <p className="font-patrick text-3xl md:text-4xl text-primary animate-bounce">
            Think, Write, Fly !
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-magical opacity-20 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-4 shadow-playful overflow-hidden">
            <img 
              src={heroIllustration} 
              alt="A young girl with an otter friend in a magical forest" 
              className="w-full h-auto rounded-2xl object-cover"
            />
            <Badge className="absolute top-8 left-8 bg-accent text-accent-foreground font-bubblegum text-xl px-6 py-2 shadow-lg">
              AUTHOR
            </Badge>
          </div>
        </div>

        {/* Story Title and Author Fields */}
        <div className="space-y-6 bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-soft">
          <div className="space-y-3">
            <label className="font-patrick text-2xl text-foreground block">
              Story Title
            </label>
            <Input 
              value={title || ""}
              onChange={(e) => onTitleChange?.(e.target.value)}
              placeholder="Enter your story title..." 
              className="font-caveat text-2xl h-14 border-2 border-primary/30 focus:border-primary bg-white/90"
            />
          </div>
          
          <div className="space-y-3">
            <label className="font-patrick text-2xl text-foreground block">
              Author
            </label>
            <Input 
              value={author || ""}
              onChange={(e) => onAuthorChange?.(e.target.value)}
              placeholder="Your name..." 
              className="font-caveat text-2xl h-14 border-2 border-secondary/30 focus:border-secondary bg-white/90"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
