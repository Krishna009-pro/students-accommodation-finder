import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Users, Zap } from "lucide-react";

interface AIInsightCardProps {
  insights: string[];
}

const insightIcons = [Lightbulb, TrendingUp, Users, Zap];

export const AIInsightCard = ({ insights }: AIInsightCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card rounded-2xl border border-border p-5 shadow-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">AI Insights</h3>
          <p className="text-sm text-muted-foreground">Personalized recommendations</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insightIcons[index % insightIcons.length];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 p-3 bg-muted/50 rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm leading-relaxed">{insight}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
