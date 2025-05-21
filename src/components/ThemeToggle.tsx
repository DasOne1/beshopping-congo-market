
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{ opacity: theme === 'dark' ? 0 : 1, rotate: theme === 'dark' ? -90 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{ opacity: theme === 'dark' ? 1 : 0, rotate: theme === 'dark' ? 0 : 90 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        </motion.div>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
