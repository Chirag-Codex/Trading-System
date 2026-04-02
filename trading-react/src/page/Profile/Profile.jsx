
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { VerifiedIcon, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AccountVerificationForm from "./AccountVerificationForm";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "@/State/Auth/Action";
import { toast } from "react-hot-toast";

function Profile() {
  const [showDialog, setShowDialog] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if 2FA is enabled from user data
    if (auth.user?.twoFactorAuth?.enabled) {
      setIsTwoFactorEnabled(true);
    }
  }, [auth.user]);

  const handleEnableTwoStepVerification = async () => {
    // Refresh user data to get updated 2FA status
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const updatedUser = await dispatch(getUser(jwt));
        if (updatedUser?.twoFactorAuth?.enabled) {
          setIsTwoFactorEnabled(true);
          toast.success("2FA has been successfully enabled!");
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
    setShowDialog(false);
  };

  return (
    <div className="flex flex-col items-center mb-5 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="pt-10 w-full lg:w-[60%] px-4">
        <Card className="bg-[#1a2236] border border-gray-700 shadow-xl">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl text-white">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem] text-gray-300 font-medium">Email:</p>
                  <p className="text-gray-400">{auth.user?.email}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] text-gray-300 font-medium">Full Name:</p>
                  <p className="text-gray-400">{auth.user?.fullName}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] text-gray-300 font-medium">Date Of Birth:</p>
                  <p className="text-gray-400">24-08-2005</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] text-gray-300 font-medium">Nationality:</p>
                  <p className="text-gray-400">Indian</p>
                </div>
              </div>
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem] text-gray-300 font-medium">Address:</p>
                  <p className="text-gray-400">PTU</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] text-gray-300 font-medium">City:</p>
                  <p className="text-gray-400">Jalandhar</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] text-gray-300 font-medium">Post Code:</p>
                  <p className="text-gray-400">144603</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] text-gray-300 font-medium">Country:</p>
                  <p className="text-gray-400">India</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className="w-full lg:w-[60%] bg-[#1a2236] border border-gray-700 shadow-xl">
            <CardHeader className="pb-7 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-400" />
                <CardTitle className="text-white text-xl">Two-Step Verification</CardTitle>
                {isTwoFactorEnabled ? (
                  <Badge className="bg-green-600 space-x-2 text-white ml-auto">
                    <VerifiedIcon className="h-4 w-4" />
                    <span>Enabled</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500 text-white ml-auto">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Disabled
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!isTwoFactorEnabled ? (
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                    You'll be required to enter a verification code from your email when logging in.
                  </p>
                  <Button 
                    onClick={() => setShowDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Enable Two-Step Verification
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <VerifiedIcon className="h-5 w-5" />
                    <p className="text-sm font-semibold">
                      Your account is protected with two-factor authentication
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 pl-7">
                    Every time you sign in, you'll need to enter a verification code sent to your email.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2FA Setup Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a2236] border border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Enable Two-Factor Authentication
            </DialogTitle>
          </DialogHeader>
          <AccountVerificationForm 
            onSuccess={handleEnableTwoStepVerification}
            onClose={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Profile;