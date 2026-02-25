import { z } from "zod";
import type { TamboComponent } from "@tambo-ai/react";
import { StarRating } from "../components/star-rating";
import { SummaryCard } from "../components/summary-card";

export const starRatingComponent: TamboComponent = {
  name: "StarRating",
  description:
    "A star-rating input (1-5 stars). Use to ask the user to rate something — e.g. how a recipe turned out, difficulty of a hike, quality of a repair.",
  component: StarRating,
  propsSchema: z.object({
    question: z.string().describe("The question to display above the stars"),
    maxStars: z
      .number()
      .optional()
      .describe("Number of stars (default 5)"),
  }),
};

export const summaryCardComponent: TamboComponent = {
  name: "SummaryCard",
  description:
    "A structured summary card displaying key-value pairs. Use at the end of a logging conversation to present a concise recap of the activity.",
  component: SummaryCard,
  propsSchema: z.object({
    title: z.string().describe("Card title, e.g. 'Hike Summary'"),
    entries: z
      .array(
        z.object({
          label: z.string().describe("Field label, e.g. 'Distance'"),
          value: z.string().describe("Field value, e.g. '4.2 miles'"),
        }),
      )
      .describe("Key-value pairs to display"),
  }),
};

export const components: TamboComponent[] = [
  starRatingComponent,
  summaryCardComponent,
];
