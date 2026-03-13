"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { DialogClose } from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { addPaymentDetails } from "@/State/Withdrawal/Action";

const schema = z.object({
  accountHolderName: z.string().min(3, "Name must be at least 3 characters"),
  ifsc: z.string().min(11, "Invalid IFSC code").max(11, "IFSC must be 11 characters"),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  confirmAccountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  bankName: z.string().min(2, "Bank name is required"),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

export default function PaymentDetailsForm({ onSuccess }) {
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      accountHolderName: "",
      ifsc: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const jwt = localStorage.getItem('jwt');

      const paymentData = {
        accountHolderName: data.accountHolderName,
        accountNumber: data.accountNumber,
        ifsc: data.ifsc.toUpperCase(),
        bankName: data.bankName
      };
      
      console.log("Submitting payment details:", paymentData);
      
      await dispatch(addPaymentDetails({
        jwt,
        paymentDetails: paymentData
      }));
      
      toast.success("Payment details added successfully!");
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error submitting payment details:", error);
      toast.error("Failed to add payment details");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md rounded-xl bg-[#0b1220] p-6 shadow-xl">
        <h2 className="text-white text-lg font-semibold mb-6">
          Payment Details
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="accountHolderName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-gray-300">
                  Account Holder Name
                </FieldLabel>
                <Input
                  {...field}
                  className="w-full bg-transparent border border-gray-700 text-white focus:border-white"
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="ifsc"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-gray-300">
                  IFSC Code
                </FieldLabel>
                <Input
                  {...field}
                  className="w-full bg-transparent border border-gray-700 text-white uppercase focus:border-white"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="accountNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-gray-300">
                  Account Number
                </FieldLabel>
                <Input
                  {...field}
                  type="text"
                  className="w-full bg-transparent border border-gray-700 text-white focus:border-white"
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          
          <Controller
            name="confirmAccountNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-gray-300">
                  Confirm Account Number
                </FieldLabel>
                <Input
                  {...field}
                  type="text" // Changed from "password"
                  className="w-full bg-transparent border border-gray-700 text-white focus:border-white"
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="bankName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-gray-300">
                  Bank Name
                </FieldLabel>
                <Input
                  {...field}
                  className="w-full bg-transparent border border-gray-700 text-white focus:border-white"
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          
          <div className='pt-4 w-full'>
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}