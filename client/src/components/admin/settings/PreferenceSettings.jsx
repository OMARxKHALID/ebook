import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor } from "lucide-react";

export function PreferenceSettings({
  theme,
  isDark,
  onThemeChange,
  containerVariants,
}) {
  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="border shadow-sm">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg">Preferences</CardTitle>
          <CardDescription className="text-xs">
            Customize your experience with theme and display settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <div className="space-y-3">
            <Label className="text-xs font-medium">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => onThemeChange(themeOption.value)}
                    className={`
                      relative flex flex-col items-center gap-2 p-3 rounded-md border transition-all
                      ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-xs font-medium ${isActive ? "text-primary" : "text-foreground"}`}
                    >
                      {themeOption.label}
                    </span>
                    {isActive && (
                      <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Choose how the interface appears. System theme will match your
              device settings.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Label className="text-xs font-medium">Current Theme</Label>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isDark ? (
                <>
                  <Moon className="h-3.5 w-3.5" />
                  <span>Dark mode is active</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5" />
                  <span>Light mode is active</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
