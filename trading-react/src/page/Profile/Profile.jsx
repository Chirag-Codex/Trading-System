import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { VerifiedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AccountVerificationForm from "./AccountVerificationForm";
import { useSelector } from "react-redux";
function Profile() {
    const handleEnableTwoStepVerification = () => {
        console.log("Two Step Verification Data:");
      }
      const {auth}=useSelector(store=>store)
  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Email:</p>
                  <p className="text-gray-400">{auth.user?.email}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">FullName:</p>
                  <p className="text-gray-400">{auth.user?.fullName}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">Date Of Birth:</p>
                  <p className="text-gray-400">24-08-2005</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">Nationality:</p>
                  <p className="text-gray-400">Indian</p>
                </div>
              </div>
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Address:</p>
                  <p className="text-gray-400">PTU</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">City:</p>
                  <p className="text-gray-400">Jalandhar</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">PostCode:</p>
                  <p className="text-gray-400">144603</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">Country:</p>
                  <p className="text-gray-400">India</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 ">
          <Card className="w-[50%]">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>2 Step Verification</CardTitle>
                {true ? (
                  <Badge className="bg-green-600 space-x-2 text-white">
                    <VerifiedIcon />
                    <span>Enabled</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500">Disabled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
             
              <Dialog>
                <DialogTrigger>
                     <Button>Enabled Two Step Verification</Button>
                     </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Verify Your Account</DialogTitle>
                  </DialogHeader>
                  <AccountVerificationForm handleSubmit={handleEnableTwoStepVerification}/>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
