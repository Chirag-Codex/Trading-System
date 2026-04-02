"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "react-hot-toast";
import { sendResetPasswordOtp, verifyResetOtp, verifyResetPasswordOtp, resetPasswordState } from "@/State/Auth/Action";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, resetPasswordToken, resetPasswordOtpSent } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(sendResetPasswordOtp(data.email));
      toast.success("OTP sent to your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Could not send reset email.");
    }
  };

  const onVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!resetPasswordToken) {
      toast.error("Reset session expired. Please try again.");
      return;
    }

    try {
      // Step 1: Verify OTP to get reset token
      const otpResult = await dispatch(verifyResetOtp(resetPasswordToken, otp));
      
      if (otpResult.resetToken) {
        // Step 2: Reset password with the reset token
        await dispatch(verifyResetPasswordOtp(otpResult.resetToken, newPassword));
        toast.success("Password changed successfully. Please login.");
        form.reset();
        setOtp("");
        setNewPassword("");
        dispatch(resetPasswordState());
        navigate("/signin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to reset password.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center pb-6 text-white">
        Forgot Password
      </h1>
      <p className="text-gray-400 text-center pb-6">
        {resetPasswordOtpSent
          ? "Enter the OTP sent to your email and choose a new password."
          : "Enter your email address and we'll send you a reset code."}
      </p>

      {resetPasswordOtpSent ? (
        <div className="space-y-4">
          <div>
            <Field>
              <FieldLabel className="text-gray-300">OTP Code</FieldLabel>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                type="text"
                maxLength={6}
                className="w-full bg-[#1a2236] border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Field>
          </div>
          <div>
            <Field>
              <FieldLabel className="text-gray-300">New Password</FieldLabel>
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Choose new password"
                type="password"
                className="w-full bg-[#1a2236] border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Field>
          </div>

          <Button
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold mt-2"
            onClick={onVerify}
            disabled={loading}
          >
            Reset Password
          </Button>

          <Button
            className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold mt-2"
            onClick={() => {
              dispatch(resetPasswordState());
              setOtp("");
              setNewPassword("");
            }}
          >
            Start Over
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-gray-300">Email</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter your email"
                  type="email"
                  className="w-full bg-[#1a2236] border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2"
            type="submit"
            disabled={loading}
          >
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
}