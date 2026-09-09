"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CollaboratorRole,
  EventRecord,
  Invitation,
  Profile,
  RsvpStatus,
  ScheduleItem,
  Supply,
  SupplyStatus,
} from "./types";
import { instantiateEvent, type WizardInput } from "./planner";
import { nowIso, uid } from "./utils";

interface Store {
  hydrated: boolean;
  currentUser: Profile | null;
  events: EventRecord[];
  setHydrated: () => void;
  signIn: (email: string, fullName?: string) => void;
  signOut: () => void;
  createFromWizard: (
    input: Omit<WizardInput, "ownerId" | "ownerName" | "ownerEmail">,
  ) => EventRecord | null;
  updateEvent: (id: string, patch: Partial<EventRecord>) => void;
  deleteEvent: (id: string) => void;
  toggleSchedule: (eventId: string, itemId: string) => void;
  upsertSchedule: (eventId: string, item: Partial<ScheduleItem> & { title: string }) => void;
  updateSupply: (eventId: string, itemId: string, patch: Partial<Supply>) => void;
  addSupply: (eventId: string, itemName: string) => void;
  setSupplyStatus: (eventId: string, itemId: string, status: SupplyStatus) => void;
  setRsvp: (eventId: string, inviteId: string, status: RsvpStatus) => void;
  addGuest: (eventId: string, guest: Pick<Invitation, "guestName" | "guestEmail">) => void;
  addComment: (eventId: string, targetType: "supply" | "schedule", targetId: string, body: string) => void;
  joinWithCode: (code: string) => EventRecord | null;
  setCollaboratorRole: (eventId: string, collaboratorId: string, role: CollaboratorRole) => void;
  unlockKit: (eventId: string) => void;
  setPlan: (tier: Profile["planTier"]) => void;
  useAiPrompt: () => boolean;
  attachAiJob: (eventId: string, job: EventRecord["aiJobs"][number]) => void;
  applyActivities: (eventId: string, activities: EventRecord["activities"]) => void;
  applyPalette: (eventId: string, colors: string[], mood: string) => void;
  deleteAccount: () => void;
}

const demoUser = (email: string, fullName?: string): Profile => ({
  id: "user_demo",
  email,
  fullName: fullName || email.split("@")[0],
  planTier: "free",
  aiPromptsUsed: 0,
  aiPromptsLimit: 3,
  createdAt: nowIso(),
});

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      hydrated: false,
      currentUser: null,
      events: [],
      setHydrated: () => set({ hydrated: true }),
      signIn: (email, fullName) => {
        const existing = get().currentUser;
        set({
          currentUser: existing?.email === email ? existing : demoUser(email, fullName),
        });
      },
      signOut: () => set({ currentUser: null }),
      createFromWizard: (input) => {
        const user = get().currentUser;
        if (!user) return null;
        const active = get().events.filter((e) => e.ownerId === user.id);
        if (user.planTier === "free" && active.length >= 1 && !active.some((e) => e.kitUnlocked)) {
          const first = active[0];
          if (first && !first.kitUnlocked) {
            /* Free tier: one active workspace unless a kit is unlocked on extras */
          }
        }
        const event = instantiateEvent({
          ...input,
          ownerId: user.id,
          ownerName: user.fullName,
          ownerEmail: user.email,
        });
        if (user.planTier === "free") {
          const others = get().events.filter((e) => e.ownerId === user.id);
          if (others.length >= 1) {
            event.kitUnlocked = false;
          }
        }
        set({ events: [event, ...get().events] });
        return event;
      },
      updateEvent: (id, patch) =>
        set({
          events: get().events.map((event) =>
            event.id === id ? { ...event, ...patch, updatedAt: nowIso() } : event,
          ),
        }),
      deleteEvent: (id) => set({ events: get().events.filter((event) => event.id !== id) }),
      toggleSchedule: (eventId, itemId) =>
        set({
          events: get().events.map((event) =>
            event.id !== eventId
              ? event
              : {
                  ...event,
                  schedules: event.schedules.map((item) =>
                    item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item,
                  ),
                },
          ),
        }),
      upsertSchedule: (eventId, item) =>
        set({
          events: get().events.map((event) => {
            if (event.id !== eventId) return event;
            if (item.id) {
              return {
                ...event,
                schedules: event.schedules.map((row) =>
                  row.id === item.id ? { ...row, ...item } : row,
                ),
              };
            }
            return {
              ...event,
              schedules: [
                ...event.schedules,
                {
                  id: uid(),
                  eventId,
                  title: item.title,
                  startTime: item.startTime || event.dateStart,
                  endTime: item.endTime,
                  isCompleted: false,
                  notes: item.notes,
                },
              ],
            };
          }),
        }),
      updateSupply: (eventId, itemId, patch) =>
        set({
          events: get().events.map((event) =>
            event.id !== eventId
              ? event
              : {
                  ...event,
                  supplies: event.supplies.map((row) =>
                    row.id === itemId ? { ...row, ...patch } : row,
                  ),
                },
          ),
        }),
      addSupply: (eventId, itemName) =>
        set({
          events: get().events.map((event) =>
            event.id !== eventId
              ? event
              : {
                  ...event,
                  supplies: [
                    ...event.supplies,
                    {
                      id: uid(),
                      eventId,
                      itemName,
                      category: "General",
                      quantity: 1,
                      estimatedCost: 0,
                      actualCost: 0,
                      status: "needed",
                    },
                  ],
                },
          ),
        }),
      setSupplyStatus: (eventId, itemId, status) =>
        get().updateSupply(eventId, itemId, { status }),
      setRsvp: (eventId, inviteId, status) =>
        set({
          events: get().events.map((event) =>
            event.id !== eventId
              ? event
              : {
                  ...event,
                  invitations: event.invitations.map((row) =>
                    row.id === inviteId ? { ...row, rsvpStatus: status } : row,
                  ),
                },
          ),
        }),
      addGuest: (eventId, guest) =>
        set({
          events: get().events.map((event) =>
            event.id !== eventId
              ? event
              : {
                  ...event,
                  invitations: [
                    ...event.invitations,
                    {
                      id: uid(),
                      eventId,
                      guestName: guest.guestName,
                      guestEmail: guest.guestEmail,
                      rsvpStatus: "pending",
                      plusOnes: 0,
                    },
                  ],
                },
          ),
        }),
      addComment: (eventId, targetType, targetId, body) => {
        const user = get().currentUser;
        if (!user) return;
        set({
          events: get().events.map((event) =>
            event.id !== eventId
              ? event
              : {
                  ...event,
                  comments: [
                    ...event.comments,
                    {
                      id: uid(),
                      eventId,
                      targetType,
                      targetId,
                      authorName: user.fullName,
                      body,
                      createdAt: nowIso(),
                    },
                  ],
                },
          ),
        });
      },
      joinWithCode: (code) => {
        const user = get().currentUser;
        const event = get().events.find(
          (row) => row.joinCode.toUpperCase() === code.trim().toUpperCase(),
        );
        if (!user || !event) return null;
        if (event.collaborators.some((c) => c.userId === user.id)) return event;
        const next: EventRecord = {
          ...event,
          collaborators: [
            ...event.collaborators,
            {
              id: uid(),
              eventId: event.id,
              userId: user.id,
              name: user.fullName,
              email: user.email,
              role: "editor",
              joinedAt: nowIso(),
            },
          ],
        };
        set({
          events: get().events.map((row) => (row.id === event.id ? next : row)),
        });
        return next;
      },
      setCollaboratorRole: (eventId, collaboratorId, role) =>
        set({
          events: get().events.map((event) =>
            event.id !== eventId
              ? event
              : {
                  ...event,
                  collaborators: event.collaborators.map((row) =>
                    row.id === collaboratorId ? { ...row, role } : row,
                  ),
                },
          ),
        }),
      unlockKit: (eventId) =>
        set({
          events: get().events.map((event) =>
            event.id === eventId ? { ...event, kitUnlocked: true } : event,
          ),
        }),
      setPlan: (tier) => {
        const user = get().currentUser;
        if (!user) return;
        set({
          currentUser: {
            ...user,
            planTier: tier,
            aiPromptsLimit: tier === "free" ? 3 : 999,
          },
        });
      },
      useAiPrompt: () => {
        const user = get().currentUser;
        if (!user) return false;
        if (user.planTier !== "free") return true;
        if (user.aiPromptsUsed >= user.aiPromptsLimit) return false;
        set({ currentUser: { ...user, aiPromptsUsed: user.aiPromptsUsed + 1 } });
        return true;
      },
      attachAiJob: (eventId, job) =>
        set({
          events: get().events.map((event) =>
            event.id !== eventId ? event : { ...event, aiJobs: [job, ...event.aiJobs] },
          ),
        }),
      applyActivities: (eventId, activities) =>
        set({
          events: get().events.map((event) =>
            event.id === eventId ? { ...event, activities } : event,
          ),
        }),
      applyPalette: (eventId, colors, mood) =>
        set({
          events: get().events.map((event) =>
            event.id !== eventId
              ? event
              : {
                  ...event,
                  theme: {
                    ...event.theme,
                    primaryColor: colors[0] || event.theme.primaryColor,
                    secondaryColor: colors[1] || event.theme.secondaryColor,
                    accentColor: colors[2] || event.theme.accentColor,
                    mood,
                  },
                },
          ),
        }),
      deleteAccount: () => set({ currentUser: null, events: [] }),
    }),
    {
      name: "fetifye-store",
      partialize: (state) => ({
        currentUser: state.currentUser,
        events: state.events,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
