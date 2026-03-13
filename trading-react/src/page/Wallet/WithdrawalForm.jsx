import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { withdrawalRequest } from "@/State/Withdrawal/Action";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function WithdrawalForm() {
  const [amount, setAmount] = React.useState("");
  const dispatch=useDispatch();
  const {wallet,withdrawal}=useSelector(store=>store)
  const handleChange = (e) => {
    setAmount(e.target.value);
  };
  const handleSubmit = () => {
    dispatch(withdrawalRequest({jwt:localStorage.getItem('jwt'),amount}))
    console.log("Withdrawal Amount:", amount);
  };
  return (
    <div className="pt-10 space-y-5">
      <div
        className="flex justify-between items-center rounded-md
            bg-slate-900 text-xl font-bold px-5 py-4"
      >
        <p>Available Balance</p>
        <p>${wallet?.balance}</p>
      </div>
      <div className="flex flex-col items-center">
        <h1>Enter Withdrawal Amount</h1>
        <div className="flex items-center justify-center pt-5">
          <Input
            onChange={handleChange}
            value={amount}
            className="py-7 withdrawalInput border-none text-center text-2xl
                     outline-none focus:outline-none px-0"
            placeholder="Enter withdrawal amount"
            type="number"
          />
        </div>
      </div>
      <div>
        <p className="pb-2">Transfer To</p>
        <div className="flex items-center gap-5 border px-5 py-2 rounded-md">
          <img
            src="/src/assets/transfer.png"
            alt="Transfer Icon"
            className="h-8 w-8"
          />
          <div>
            <p className="text-xl font-bold">{withdrawal.PaymentDetails?.bankName}</p>
            <p className="text-xs">{withdrawal.PaymentDetails?.accountNumber}</p>
          </div>
        </div>
      </div>
      <DialogClose className="w-full">
         <Button variant="outline" onClick={handleSubmit} className='w-full py-7 text-xl'>Withdraw</Button>
      </DialogClose>
     
    </div>
  );
}

export default WithdrawalForm;
