"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useDispatch, useSelector } from "react-redux";
import { login, verifyLoginOtp, resetTwoFactorState } from "@/State/Auth/Action";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast } from "react-hot-toast";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function SigninForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localDialogOpen, setLocalDialogOpen] = useState(false);
  
  const authState = useSelector((state) => state.auth);
  const { loading, twoFactorRequired, twoFactorSessionId, twoFactorEmail } = authState;

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2FA dialog control
  useEffect(() => {
    if (twoFactorRequired) {
      setLocalDialogOpen(true);
    } else {
      setLocalDialogOpen(false);
    }
  }, [twoFactorRequired]);

  const onSubmit = async (data) => {
    // Reset dialog state before login attempt
    setLocalDialogOpen(false);
    setOtpValue("");
    setIsSubmitting(true);
    
    try {
      await dispatch(login({ data, navigate }));
      // The useEffect will open the dialog when Redux state updates
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
      form.setValue("password", "");
      setLocalDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!twoFactorSessionId) {
      toast.error("Session expired. Please try logging in again.");
      handleCloseDialog();
      return;
    }

    try {
      await dispatch(verifyLoginOtp(otpValue, twoFactorSessionId));
      console.log("OTP verification successful");
      toast.success("Login successful!");
      handleCloseDialog();
      form.reset();
      navigate("/");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
      setOtpValue("");
    }
  };

  const handleCloseDialog = () => {
    setLocalDialogOpen(false);
    setOtpValue("");
    // Reset Redux 2FA state
    dispatch(resetTwoFactorState());
  };

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center pb-6 text-white">
          Log In
        </h1>
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
                  disabled={loading || isSubmitting}
                  className="w-full bg-[#1a2236] border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-gray-300">Password</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter your password"
                  type="password"
                  disabled={loading || isSubmitting}
                  className="w-full bg-[#1a2236] border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          
          <Button 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2 disabled:opacity-50"
            type="submit"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        
      </div>

      {/* OTP Verification Dialog */}
      <Dialog 
        open={localDialogOpen} 
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange called with:", open);
          if (!open) {
            handleCloseDialog();
          }
        }}
      >
        <DialogContent className="bg-[#1a2236] border border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          <div className="py-5 flex flex-col gap-5 justify-center items-center">
            <p className="text-sm text-gray-300 text-center">
              Please enter the 6-digit OTP sent to<br />
              <span className="text-blue-400 font-semibold text-lg">
                {twoFactorEmail || "your email"}
              </span>
            </p>
            <InputOTP
              value={otpValue}
              maxLength={6}
              onChange={setOtpValue}
              className="gap-2"
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="bg-[#1a2236] border-gray-700 text-white text-2xl w-12 h-12" />
                <InputOTPSlot index={1} className="bg-[#1a2236] border-gray-700 text-white text-2xl w-12 h-12" />
                <InputOTPSlot index={2} className="bg-[#1a2236] border-gray-700 text-white text-2xl w-12 h-12" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} className="bg-[#1a2236] border-gray-700 text-white text-2xl w-12 h-12" />
                <InputOTPSlot index={4} className="bg-[#1a2236] border-gray-700 text-white text-2xl w-12 h-12" />
                <InputOTPSlot index={5} className="bg-[#1a2236] border-gray-700 text-white text-2xl w-12 h-12" />
              </InputOTPGroup>
            </InputOTP>
            <Button 
              onClick={handleVerifyOtp} 
              disabled={loading || otpValue.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
            <button
              onClick={handleCloseDialog}
              className="text-sm text-gray-400 hover:text-gray-300 underline"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}