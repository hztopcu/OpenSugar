/** State types for server action forms (do not put "use server" here). */

export type AddGlucoseState = { error?: string; success?: boolean; value?: number };
export type AddMedicationState = { error?: string; success?: boolean };
export type AddMedicationLogState = { error?: string; success?: boolean };
export type AddLabResultState = { error?: string; success?: boolean };
