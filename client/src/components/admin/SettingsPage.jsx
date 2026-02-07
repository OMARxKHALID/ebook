import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock, Bell } from "lucide-react";
import { authApi } from "@/lib/api";
import { fetchProfile } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/theme-provider";

import { ProfileSettings } from "./settings/ProfileSettings";
import { SecuritySettings } from "./settings/SecuritySettings";
import { PreferenceSettings } from "./settings/PreferenceSettings";
import { AdminPageHeader } from "./shared/AdminPageHeader";
import { SEO } from "../SEO";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SettingsPage() {
  const { user } = useSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, profileForm]);

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data) => {
    setIsProfileLoading(true);
    try {
      await authApi.updateProfile(data);
      dispatch(fetchProfile());
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true);
    try {
      await authApi.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <SEO
        title="Account Settings"
        description="Update your admin profile, password, and system preferences."
        noindex={true}
      />
      <AdminPageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <Tabs
        defaultValue="profile"
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-muted/50 p-1 h-10 inline-flex border rounded-lg">
          <TabsTrigger
            value="profile"
            className="px-4 data-[state=active]:bg-background data-[state=active]:text-primary transition-all flex items-center gap-2 h-full rounded-md text-sm font-medium"
          >
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="px-4 data-[state=active]:bg-background data-[state=active]:text-primary transition-all flex items-center gap-2 h-full rounded-md text-sm font-medium"
          >
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="px-4 data-[state=active]:bg-background data-[state=active]:text-primary transition-all flex items-center gap-2 h-full rounded-md text-sm font-medium"
          >
            <Bell className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <TabsContent value="profile" forceMount className="mt-0">
              <ProfileSettings
                user={user}
                form={profileForm}
                onSubmit={onProfileSubmit}
                isLoading={isProfileLoading}
                containerVariants={containerVariants}
              />
            </TabsContent>
          )}

          {activeTab === "security" && (
            <TabsContent value="security" forceMount className="mt-0">
              <SecuritySettings
                form={passwordForm}
                onSubmit={onPasswordSubmit}
                isLoading={isPasswordLoading}
                containerVariants={containerVariants}
              />
            </TabsContent>
          )}

          {activeTab === "preferences" && (
            <TabsContent value="preferences" forceMount className="mt-0">
              <PreferenceSettings
                theme={theme}
                isDark={isDark}
                onThemeChange={setTheme}
                containerVariants={containerVariants}
              />
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
