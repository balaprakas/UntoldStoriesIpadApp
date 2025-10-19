import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface StoryBuilderPageProps {
  responses?: string[];
  onResponseChange?: (index: number, value: string) => void;
}

export const StoryBuilderPage = ({ responses = [], onResponseChange }: StoryBuilderPageProps) => {
  const prompts = [
    {
      title: "Introduce your Character",
      text: "Write about her name, age, and what she looks like."
    },
    {
      title: "Introduce a Second Character",
      text: "What does he look like? Why is he carrying a satchel made of leaves?"
    },
    {
      title: "Describe the Problem & Add a Magical Twist",
      text: "How do they bring back the creek's magic? Who helps them? Show how they solve the problem using bravery, kindness, or teamwork."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-playful">
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="font-bubblegum text-5xl md:text-6xl bg-gradient-magical bg-clip-text text-transparent mb-2">
              STORY BUILDER
            </h2>
            <p className="font-patrick text-2xl text-muted-foreground">
              Plan your amazing adventure
            </p>
          </div>

          {/* Prompts */}
          <div className="space-y-8">
            {prompts.map((prompt, index) => (
              <Card 
                key={index}
                className="p-8 bg-gradient-to-br from-card via-white to-muted border-2 border-primary/20 hover:shadow-playful transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-magical flex items-center justify-center text-white font-bubblegum text-xl">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bubblegum text-2xl md:text-3xl text-primary mb-3">
                        {prompt.title}
                      </h3>
                      <p className="font-patrick text-xl text-foreground leading-relaxed">
                        {prompt.text}
                      </p>
                    </div>
                  </div>
                  
                  {/* Writing Space */}
                  <Textarea
                    value={responses[index] || ""}
                    onChange={(e) => onResponseChange?.(index, e.target.value)}
                    placeholder="Write your ideas here..."
                    className="mt-6 min-h-[120px] font-caveat text-xl border-2 border-dashed border-primary/30 focus:border-primary bg-white/80 resize-none"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
