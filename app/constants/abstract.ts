export const VerificationStatusToLabel: Record<number, string> = {
    0: "pending",
    1: "approved",
    2: "rejected",
}

export const LabelToVerificationStatus: Record<string, number> = {
    "pending": 0,
    "approved": 1,
    "rejected": 2,
}