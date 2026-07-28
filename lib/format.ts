export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CATEGORY_ICON: Record<string, string> = {
  Transfer: "⇄",
  Groceries: "🛒",
  Dining: "🍔",
  Bills: "🧾",
  Income: "💰",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Other: "•",
};

export function iconFor(category?: string): string {
  return CATEGORY_ICON[category ?? "Other"] ?? "•";
}
