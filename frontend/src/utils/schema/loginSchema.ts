import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email format!").nonempty("Email is required!"),
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least 6 characters, one uppercase letter, one number, and one special character."
        )
        .nonempty("Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
