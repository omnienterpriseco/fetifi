export type PlanTier = "free" | "pro" | "enterprise";
export type CollaboratorRole = "owner" | "editor" | "viewer";
export type SupplyStatus = "needed" | "purchased" | "borrowed" | "delivered";
export type VolunteerStatus = "invited" | "accepted" | "declined";
export type RsvpStatus = "pending" | "accepted" | "declined";
export type PrintableType =
  | "invitation"
  | "place_card"
  | "banner"
  | "game_sheet"
  | "menu";
export type AiJobType = "planner" | "activity" | "budget" | "inspiration" | "check";
export type AiJobStatus = "queued" | "processing" | "completed" | "failed";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  planTier: PlanTier;
  aiPromptsUsed: number;
  aiPromptsLimit: number;
  createdAt: string;
}

export interface Theme {
  id: string;
  eventId: string;
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  bannerUrl?: string;
  mood: string;
}

export interface ScheduleItem {
  id: string;
  eventId: string;
  title: string;
  startTime: string;
  endTime?: string;
  assignedTo?: string;
  isCompleted: boolean;
  notes?: string;
}

export interface Supply {
  id: string;
  eventId: string;
  itemName: string;
  category: string;
  quantity: number;
  estimatedCost: number;
  actualCost: number;
  status: SupplyStatus;
  assignedTo?: string;
}

export interface BudgetItem {
  id: string;
  eventId: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
}

export interface Volunteer {
  id: string;
  eventId: string;
  roleName: string;
  description: string;
  assignedUserId?: string;
  assignedName?: string;
  status: VolunteerStatus;
}

export interface Printable {
  id: string;
  eventId: string;
  title: string;
  type: PrintableType;
  body: string;
  createdAt: string;
}

export interface Collaborator {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  eventId: string;
  guestName: string;
  guestEmail?: string;
  rsvpStatus: RsvpStatus;
  plusOnes: number;
  dietaryRestrictions?: string;
}

export interface Comment {
  id: string;
  eventId: string;
  targetType: "supply" | "schedule" | "task";
  targetId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface AiJob {
  id: string;
  eventId: string;
  jobType: AiJobType;
  status: AiJobStatus;
  promptPayload: Record<string, unknown>;
  resultPayload?: Record<string, unknown>;
  createdAt: string;
}

export interface EventRecord {
  id: string;
  organizationId?: string;
  ownerId: string;
  title: string;
  description: string;
  eventType: string;
  dateStart: string;
  dateEnd?: string;
  locationName: string;
  totalBudget: number;
  joinCode: string;
  kitUnlocked: boolean;
  createdAt: string;
  updatedAt: string;
  theme: Theme;
  schedules: ScheduleItem[];
  supplies: Supply[];
  budgets: BudgetItem[];
  volunteers: Volunteer[];
  printables: Printable[];
  collaborators: Collaborator[];
  invitations: Invitation[];
  comments: Comment[];
  aiJobs: AiJob[];
  activities: Activity[];
  plannerNotes: string[];
  qualityScore: number;
}

export interface Activity {
  id: string;
  eventId: string;
  title: string;
  ageRange: string;
  durationMinutes: number;
  suppliesNeeded: string[];
  steps: string[];
}

export interface AppState {
  currentUser: Profile | null;
  events: EventRecord[];
}
