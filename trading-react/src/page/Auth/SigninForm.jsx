"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useDispatch } from "react-redux";
import { login } from "@/State/Auth/Action";
import { useNavigate } from "react-router-dom";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function SigninForm() {
  const dispatch=useDispatch();
  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate=useNavigate()
  const onSubmit = (data) => {
    dispatch(login({data,navigate}))
    console.log("Signin Data:", data);
    
  };

  return (
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
                className="w-full bg-[#1a2236] border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
          Sign In
        </Button>
      </form>
    </div>
  );
}