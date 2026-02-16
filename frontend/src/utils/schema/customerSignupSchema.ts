import { z } from "zod";

export const customerSignupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").nonempty("Name is required"),
    username: z.string().min(4, "Username must be at least 4 characters long and unique").nonempty("Username is required"),
    email: z.string().email("Invalid email format").nonempty("Email is required"),
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least 6 characters, one uppercase letter, one number, and one special character."
        )
        .nonempty("Password is required"),
    phone: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .nonempty("Phone number is required"),
    address: z.string().min(5, "Address must be at least 5 characters long").nonempty("Address is required"),
    terms: z.literal(true, {
        message: "You must accept the terms and conditions",
    }),
});

export type CustomerSignupFormValues = z.infer<typeof customerSignupSchema>;
