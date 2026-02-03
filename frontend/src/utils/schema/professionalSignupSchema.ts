import { z } from "zod";

export const professionalSignupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").nonempty("Name is required"),
    email: z.string().email("Invalid email format").nonempty("Email is required"),
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least 6 characters, one uppercase letter, one number, and one special character."
        )
        .nonempty("Password is required"),
    skill: z.string().min(2, "Please enter your skills").nonempty("Skill is required"),
    experience: z.string().nonempty("Experience is required"),
    terms: z.literal(true, {
        message: "You must accept the terms and conditions",
    }),
});

export type ProfessionalSignupFormValues = z.infer<typeof professionalSignupSchema>;
