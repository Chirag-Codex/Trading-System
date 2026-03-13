import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DollarSignIcon, WalletIcon } from "lucide-react";
import {
  CopyIcon,
  DownloadIcon,
  ReloadIcon,
  ShuffleIcon,
  UpdateIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import TopupForm from "./TopupForm";
import WithdrawalForm from "./WithdrawalForm";
import TransferForm from "./TransferForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { depositMoney, getUserWalletRequest, getWalletTransactions } from "@/State/Wallet/Action";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Wallet() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { wallet } = useSelector((store) => store);
  
  const handleFetchUserWallet = () => {
    dispatch(getUserWalletRequest(localStorage.getItem("jwt")));
  };
  const handleFetchWalletTransaction=()=>{
    dispatch(getWalletTransactions(localStorage.getItem('jwt')))
  }
  const query = useQuery();
  
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const rawOrderId = query.get("order_id") || query.get("razorpay_order_id") || query.get("order_Id");

  useEffect(() => {
    if (!razorpayPaymentId && !paymentId) {
       handleFetchUserWallet();
       handleFetchWalletTransaction();
    }
  }, []); 

  useEffect(() => {
    if (razorpayPaymentId || paymentId) {
      dispatch(
        depositMoney({
          jwt: localStorage.getItem("jwt"),
          orderId: rawOrderId || "", 
          paymentId: razorpayPaymentId || paymentId,
          navigate
        }),
      );
    }
  }, [razorpayPaymentId, paymentId, rawOrderId]);

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon size={30} />
                <div>
                  <CardTitle className="text-2xl">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200 text-sm">#{wallet.userWallet?.id}</p>
                    <CopyIcon
                      size={5}
                      className="cursor-pointer hover:text-slate-300"
                    />
                  </div>
                </div>
              </div>
              <div>
                <ReloadIcon
                  onClick={handleFetchUserWallet}
                  size={20}
                  className="cursor-pointer w-6 h-6 hover:text-gray-300"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSignIcon />
              <span className="text-2xl font-semibold">
                {wallet.userWallet?.balance?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex gap-7 mt-5">
              <Dialog>
                <DialogTrigger>
                  <div
                    className="h-24 w-24 hover:text-gray-400 
                    cursor-pointer flex flex-col items-center justify-center
                    rounded-md shadow-slate-800 shadow-md"
                  >
                    <UploadIcon size={30} />
                    <span className="text-sm mt-2">Add Money</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Top up your wallet</DialogTitle>
                  </DialogHeader>
                  <TopupForm />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <div
                    className="h-24 w-24 hover:text-gray-400 
                    cursor-pointer flex flex-col items-center justify-center
                    rounded-md shadow-slate-800 shadow-md"
                  >
                    <DownloadIcon size={30} />
                    <span className="text-sm mt-2">Withdrawal</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                  </DialogHeader>
                  <WithdrawalForm />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <div
                    className="h-24 w-24 hover:text-gray-400 
                    cursor-pointer flex flex-col items-center justify-center
                    rounded-md shadow-slate-800 shadow-md"
                  >
                    <ShuffleIcon size={30} />
                    <span className="text-sm mt-2">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Transfer to other wallet
                    </DialogTitle>
                  </DialogHeader>
                  <TransferForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-semibold">Recent Transactions</h1>
            <UpdateIcon 
                onClick={() => dispatch(getWalletTransactions(localStorage.getItem("jwt")))}
                className="cursor-pointer hover:text-gray-400 h-4 w-4" 
            />
          </div>
          <div className="space-y-5">
            {wallet.transactions && wallet.transactions.length > 0 ? (
                wallet.transactions.map((item, i) => (
                    <Card
                        key={i}
                        className="w-full px-6 py-5 grid grid-cols-[auto_1fr_auto]
                        items-center gap-4 text-left hover:bg-muted/40 transition-colors"
                    >
                        <Avatar className="h-11 w-11" onClick={handleFetchWalletTransaction}>
                            <AvatarFallback className="bg-muted">
                                <ShuffleIcon />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{item.type || "Transaction"}</span>
                            <span className="text-sm text-gray-500">{item.date || "Recent"}</span>
                        </div>
                        <div className="text-right">
                            <span className={`font-semibold text-lg ${item.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {item.amount > 0 ? '+' : ''}${item.amount || 0}
                            </span>
                        </div>
                    </Card>
                ))
            ) : (
                <p className="text-gray-500 text-sm pl-2">No recent transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;