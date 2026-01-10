import { z } from "zod";
export declare const SectionSchema: z.ZodEnum<{
    TECH: "TECH";
    FASEC: "FASEC";
}>;
export type Section = z.infer<typeof SectionSchema>;
