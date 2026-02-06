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
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your experience with theme and display settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => onThemeChange(themeOption.value)}
                    className={`
                      relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all
                      ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      }
                    `}
                  >
                    <Icon
                      className={`h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}
                    >
                      {themeOption.label}
                    </span>
                    {isActive && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              Choose how the interface appears. System theme will match your
              device settings.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Current Theme</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isDark ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark mode is active</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
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
