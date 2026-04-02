import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useDispatch, useSelector } from "react-redux";
import { sendTwoFactorOtp, enableTwoFactorAuth } from "@/State/Auth/Action";
import { toast } from "react-hot-toast";

function AccountVerificationForm({ onSuccess, onClose }) {
  const [value, setValue] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(true);
  
  const dispatch = useDispatch();
  const { auth, loading } = useSelector((store) => store);
  const { user } = auth;

  const handleSendOtp = async () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsSendingOtp(true);
    try {
      const result = await dispatch(sendTwoFactorOtp(user?.email, password));
      if (result?.success) {
        setShowPasswordInput(false);
        setShowOtpInput(true);
        toast.success("OTP sent to your email!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send OTP. Please check your password.");
      setPassword("");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmitOtp = async () => {
    if (value.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await dispatch(enableTwoFactorAuth(value));
      toast.success("Two-factor authentication enabled successfully!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      // Reset states
      setValue("");
      setPassword("");
      setShowPasswordInput(true);
      setShowOtpInput(false);
    } catch (error) {
      toast.error(error.message || "Invalid OTP. Please try again.");
      setValue("");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="space-y-5 mt-5 w-full">
        {showPasswordInput && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <p className="text-gray-300">Email:</p>
              <p className="text-blue-400 font-semibold">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to verify identity"
                className="w-full p-2 bg-[#1a2236] border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && password) {
                    handleSendOtp();
                  }
                }}
              />
              <p className="text-xs text-gray-500">
                We need your password to verify your identity before enabling 2FA
              </p>
            </div>
            <Button
              onClick={handleSendOtp}
              disabled={isSendingOtp || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
            >
              {isSendingOtp ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                "Send Verification OTP"
              )}
            </Button>
          </div>
        )}

        {showOtpInput && (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-300">
                Please enter the 6-digit OTP sent to
              </p>
              <p className="text-blue-400 font-semibold text-lg">{user?.email}</p>
            </div>
            <div className="flex justify-center">
              <InputOTP 
                value={value} 
                maxLength={6} 
                onChange={setValue}
                className="gap-2"
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
            </div>
            <Button
              onClick={handleSubmitOtp}
              disabled={loading || value.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying & Enabling...
                </span>
              ) : (
                "Verify & Enable 2FA"
              )}
            </Button>
            <button
              onClick={() => {
                setShowOtpInput(false);
                setShowPasswordInput(true);
                setValue("");
                setPassword("");
              }}
              className="w-full text-sm text-gray-400 hover:text-gray-300 underline"
            >
              ← Back to password entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountVerificationForm;