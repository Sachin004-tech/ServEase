import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format!").nonempty("Email is required!"),
});

export const verifyOTPSchema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits").nonempty("OTP is required"),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least 6 characters, one uppercase letter, one number, and one special character."
        )
        .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyOTPValues = z.infer<typeof verifyOTPSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
