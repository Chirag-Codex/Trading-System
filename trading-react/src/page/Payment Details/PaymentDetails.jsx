import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPaymentDetails } from "@/State/Withdrawal/Action";

function PaymentDetails() {
  const { withdrawal } = useSelector(store => store);
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      dispatch(getPaymentDetails({ jwt }));
    }
  }, [dispatch]);

  console.log("Payment Details from Redux:", withdrawal?.paymentDetails);

  const handleSuccess = () => {
    setDialogOpen(false);
    // Refresh payment details
    dispatch(getPaymentDetails({ jwt: localStorage.getItem('jwt') }));
  };

  return (
    <div className="px-20">
      <h1 className="flex items-center text-3xl font-bold py-10 px-10">
        Payment Details
      </h1>
      
      {withdrawal?.paymentDetails ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center px-7">
              {withdrawal.paymentDetails?.bankName}
            </CardTitle>
            <CardDescription className="flex items-center px-7">
              A/C NO : {withdrawal.paymentDetails?.accountNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <p className="w-32">A/C Holder</p>
              <p className="text-gray-400">: {withdrawal.paymentDetails?.accountHolderName}</p>
            </div>
            <div className="flex items-center">
              <p className="w-32">IFSC</p>
              <p className="text-gray-400">: {withdrawal.paymentDetails?.ifsc}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className='py-6 pt-6'>
              Add Payment Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>
                Add your bank account details for withdrawals
              </DialogDescription>
            </DialogHeader>
            <PaymentDetailsForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default PaymentDetails;