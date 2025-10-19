import { Card } from "@/components/ui/card";
import scissorsImg from "@/assets/scissors.png";

export const InstructionsPage = () => {
  const instructions = [
    { emoji: "🧠", text: "Read the ideas from the story guideline to help you think about how to finish your story." },
    { emoji: "🌈", text: "Use your imagination to decide how the story ends." },
    { emoji: "💡", text: "Feel free to explore the prompts on each page—they're here to guide and inspire you as you create your story." },
    { emoji: "✂️", text: "Cut the pictures you like from the image sheet." },
    { emoji: "🖼️", text: "Choose the pictures that go best with your story." },
    { emoji: "📌", text: "Stick the pictures in the boxes on each page." },
    { emoji: "📖✍️", text: "Give your story a title and write your name as the author." },
    { emoji: "🎉", text: "You've created your very own storybook!" },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-playful">
          {/* Header with Scissors */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bubblegum text-5xl md:text-6xl text-primary">
              INSTRUCTIONS
            </h2>
            <img 
              src={scissorsImg} 
              alt="Scissors" 
              className="w-20 h-20 md:w-24 md:h-24 animate-bounce"
            />
          </div>

          {/* Instructions List */}
          <div className="space-y-6">
            {instructions.map((instruction, index) => (
              <Card 
                key={index}
                className="p-6 bg-gradient-to-r from-card to-muted border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-soft hover:scale-[1.02] duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl flex-shrink-0">{instruction.emoji}</span>
                  <p className="font-patrick text-xl md:text-2xl text-foreground leading-relaxed">
                    {instruction.text}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Warning Note */}
          <Card className="mt-8 p-6 bg-accent/10 border-2 border-accent">
            <div className="flex items-start gap-3">
              <span className="text-3xl">⚠️</span>
              <p className="font-patrick text-xl text-foreground">
                Please don't print the image sheet on both sides
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
