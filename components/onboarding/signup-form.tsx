"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpAction } from "@/app/salj-hos-oss/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { sv } from "@/lib/copy/sv";
import { signupSchema, type SignupInput } from "@/lib/schemas/onboarding";

const copy = sv.sell.form;

export function SignupForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: { contactName: "", farmName: "", email: "", sells: "", website: "" },
  });

  async function onSubmit(values: SignupInput) {
    setFormError(null);
    const result = await signUpAction(values);
    if (result.ok) setSentTo(values.email.trim().toLowerCase());
    else setFormError(copy.genericError);
  }

  if (sentTo) {
    return (
      <div role="status" className="space-y-2">
        <h3 className="font-heading text-xl font-semibold">{copy.successTitle}</h3>
        <p>{copy.successText(sentTo)}</p>
        <p className="text-sm text-muted-foreground">{copy.successHint}</p>
      </div>
    );
  }

  const field = (name: "contactName" | "farmName" | "email" | "sells", autoComplete: string) => (
    <Field data-invalid={!!errors[name]}>
      <FieldLabel htmlFor={`signup-${name}`}>{copy[name]}</FieldLabel>
      <Input
        id={`signup-${name}`}
        type={name === "email" ? "email" : "text"}
        autoComplete={autoComplete}
        aria-invalid={!!errors[name]}
        {...register(name)}
      />
      {name === "sells" ? <FieldDescription>{copy.sellsHint}</FieldDescription> : null}
      <FieldError errors={[errors[name]]} />
    </Field>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {field("contactName", "name")}
        {field("farmName", "organization")}
        {field("email", "email")}
        {field("sells", "off")}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label htmlFor="signup-website">{copy.honeypot}</label>
          <input id="signup-website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>
        <p className="text-sm text-muted-foreground">
          {copy.consent}{" "}
          <Link href="/integritet" className="underline underline-offset-4">
            {copy.privacyLink}
          </Link>
        </p>
        {formError ? (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        ) : null}
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? copy.submitting : copy.submit}
        </Button>
      </FieldGroup>
    </form>
  );
}
