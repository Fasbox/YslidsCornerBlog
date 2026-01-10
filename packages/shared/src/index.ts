import { z } from "zod";

export const SectionSchema = z.enum(["TECH", "FASEC"]);
export type Section = z.infer<typeof SectionSchema>;
