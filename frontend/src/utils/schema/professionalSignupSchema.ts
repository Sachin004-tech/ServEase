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
    phone: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .nonempty("Phone number is required"),
    address: z.string().min(5, "Address must be at least 5 characters long").nonempty("Address is required"),
    experience: z.string().nonempty("Experience is required"),
    file: z
        .any()
        .refine((files) => files?.length > 0, "Proof of work/CV is required")
        .refine(
            (files) => files?.[0]?.size <= 5000000,
            `Max file size is 5MB.`
        ),
    terms: z.literal(true, {
        message: "You must accept the terms and conditions",
    }),
});

export type ProfessionalSignupFormValues = z.infer<typeof professionalSignupSchema>;
