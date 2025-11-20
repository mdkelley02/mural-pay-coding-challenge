import { User } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  login: () => void;
  logout: () => void;
}

export default create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      login: () =>
        set({
          user: {
            id: "1",
            email: "admin@merchantinc.com",
            name: "Admin User",
            role: "admin",
          },
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
