"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordForm() {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Forgot Password Data:", data);
    // Handle forgot password logic here
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center pb-6 text-white">
        Forgot Password
      </h1>
      <p className="text-gray-400 text-center pb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
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
        >
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}