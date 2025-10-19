import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import paperclipImg from "@/assets/paperclip.png";
import { useRef, useState } from "react";

interface StoryPageProps {
  pageNumber: number;
  prompt: string;
  imagePosition?: "left" | "right";
  image?: string;
  text?: string;
  onImageChange?: (image: string) => void;
  onTextChange?: (text: string) => void;
}

export const StoryPage = ({ 
  pageNumber, 
  prompt, 
  imagePosition = "left",
  image,
  text,
  onImageChange,
  onTextChange
}: StoryPageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(image);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        onImageChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              setPreviewImage(result);
              onImageChange?.(result);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-playful border-4 border-primary/20">
          {/* Page Number */}
          <div className="flex justify-between items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-magical flex items-center justify-center shadow-soft">
              <span className="font-bubblegum text-2xl text-white">{pageNumber}</span>
            </div>
          </div>

          {/* Content Grid */}
          <div className={`grid md:grid-cols-2 gap-8 ${imagePosition === "right" ? "md:flex-row-reverse" : ""}`}>
            {/* Image Box Section */}
            <div className={`space-y-6 ${imagePosition === "right" ? "md:order-2" : ""}`}>
              <div 
                className="relative bg-gradient-to-br from-muted to-white rounded-2xl border-4 border-dashed border-primary/40 aspect-[3/4] flex items-center justify-center group hover:border-primary transition-colors cursor-pointer overflow-hidden"
                onClick={handleImageClick}
                onPaste={handlePaste}
                tabIndex={0}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <img 
                  src={paperclipImg} 
                  alt="Paper clip" 
                  className="absolute -top-4 -right-4 w-12 h-12 rotate-45 opacity-70 z-10"
                />
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Uploaded" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center space-y-2 opacity-50 group-hover:opacity-70 transition-opacity">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">🖼️</span>
                    </div>
                    <p className="font-patrick text-xl text-muted-foreground">
                      Click or paste your picture here
                    </p>
                  </div>
                )}
              </div>
              
              {/* Prompt Quote */}
              <Card className="p-6 bg-gradient-to-r from-secondary/10 to-primary/10 border-l-4 border-secondary">
                <p className="font-caveat text-2xl text-foreground leading-relaxed italic">
                  "{prompt}"
                </p>
              </Card>
            </div>

            {/* Writing Lines Section */}
            <div className={`space-y-4 ${imagePosition === "right" ? "md:order-1" : ""}`}>
              <div className="relative">
                <img 
                  src={paperclipImg} 
                  alt="Paper clip" 
                  className="absolute -top-4 -left-4 w-12 h-12 -rotate-12 opacity-70"
                />
              </div>
              
              <Textarea
                value={text || ""}
                onChange={(e) => onTextChange?.(e.target.value)}
                placeholder="Continue your story..."
                className="min-h-[300px] font-caveat text-xl border-2 border-primary/20 focus:border-primary bg-white/90 resize-none leading-loose"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
