export type MagicBentoItem = {
  color: string;
  textColor?: string;
  borderColor?: string;
  title: string;
  description: string;
  label: string;
};

export const landingMagicBentoItems: MagicBentoItem[] = [
  {
    color: "rgba(44, 62, 80, 0.88)",
    textColor: "#f4f7fa",
    title: "Events discovery",
    description: "Browse live campus activities, save favorites, and register with one clear flow.",
    label: "Students",
  },
  {
    color: "rgba(52, 79, 107, 0.88)",
    textColor: "#f4f7fa",
    title: "Club operations",
    description: "Launch events, manage attendance, and keep your members aligned from one workspace.",
    label: "Club leads",
  },
  {
    color: "rgba(74, 122, 155, 0.9)",
    textColor: "#f4f7fa",
    title: "Admin oversight",
    description: "Review approvals, track adoption, and monitor campus-wide activity with confidence.",
    label: "Admins",
  },
  {
    color: "rgba(91, 141, 216, 0.88)",
    textColor: "#f4f7fa",
    title: "AI assistant",
    description: "Surface recommendations, planning help, and fast answers without leaving the portal.",
    label: "Guidance",
  },
  {
    color: "rgba(74, 122, 155, 0.82)",
    textColor: "#f4f7fa",
    title: "Calendar sync",
    description: "Keep personal schedules, club timelines, and event dates readable across devices.",
    label: "Planning",
  },
  {
    color: "rgba(44, 62, 80, 0.82)",
    textColor: "#f4f7fa",
    title: "Participation record",
    description: "Track certificates, achievements, and involvement history in one polished profile.",
    label: "Growth",
  },
];

export const signupMagicBentoItems: MagicBentoItem[] = [
  {
    color: "rgba(44, 62, 80, 0.88)",
    textColor: "#f4f7fa",
    title: "Role-aware onboarding",
    description: "Start with the correct student, club lead, or admin flow from the first screen.",
    label: "Access",
  },
  {
    color: "rgba(52, 79, 107, 0.88)",
    textColor: "#f4f7fa",
    title: "Verified identity",
    description: "Secure account creation connects smoothly with the existing auth and email flow.",
    label: "Trust",
  },
  {
    color: "rgba(74, 122, 155, 0.9)",
    textColor: "#f4f7fa",
    title: "Campus-ready workspace",
    description: "Move from signup into events, clubs, calendars, and participation without extra friction.",
    label: "Launch",
  },
  {
    color: "rgba(91, 141, 216, 0.88)",
    textColor: "#f4f7fa",
    title: "AI guidance",
    description: "Built-in assistance helps users discover what to do next once they enter CollegiaX.",
    label: "Assist",
  },
];
