"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { saveProfileAction } from "@/app/salj-hos-oss/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sv } from "@/lib/copy/sv";
import { profileSchema, type ProfileInput } from "@/lib/schemas/onboarding";

const copy = sv.onboarding.profile;

export function ProfileForm({
  token,
  initial,
}: {
  token: string;
  initial?: Partial<ProfileInput>;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    // Validate on the client but send the raw strings; the server parses them again.
    resolver: zodResolver(profileSchema, undefined, { raw: true }),
    mode: "onBlur",
    defaultValues: { address: "", phone: "", website: "", story: "", pickup: true, ...initial },
  });

  async function onSubmit(values: ProfileInput) {
    setFormError(null);
    const result = await saveProfileAction(token, values);
    if (result.ok) router.refresh();
    else setFormError(sv.onboarding.saveError);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.address}>
          <FieldLabel htmlFor="profile-address">{copy.address}</FieldLabel>
          <Input
            id="profile-address"
            autoComplete="street-address"
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          <FieldDescription>{copy.addressHint}</FieldDescription>
          <FieldError errors={[errors.address]} />
        </Field>
        <Field data-invalid={!!errors.story}>
          <FieldLabel htmlFor="profile-story">{copy.story}</FieldLabel>
          <Textarea
            id="profile-story"
            rows={7}
            aria-invalid={!!errors.story}
            {...register("story")}
          />
          <FieldDescription>{copy.storyHint}</FieldDescription>
          <FieldError errors={[errors.story]} />
        </Field>
        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="profile-phone">{copy.phone}</FieldLabel>
          <Input
            id="profile-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          <FieldDescription>{copy.phoneHint}</FieldDescription>
          <FieldError errors={[errors.phone]} />
        </Field>
        <Field data-invalid={!!errors.website}>
          <FieldLabel htmlFor="profile-website">{copy.website}</FieldLabel>
          <Input
            id="profile-website"
            type="url"
            autoComplete="url"
            aria-invalid={!!errors.website}
            {...register("website")}
          />
          <FieldError errors={[errors.website]} />
        </Field>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="size-4 accent-primary" {...register("pickup")} />
          {copy.pickup}
        </label>
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
