"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { submitProductAction } from "@/app/salj-hos-oss/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sv } from "@/lib/copy/sv";
import { firstProductSchema, type FirstProductInput } from "@/lib/schemas/onboarding";

const copy = sv.onboarding.product;

export function FirstProductForm({ token }: { token: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FirstProductInput>({
    // Validate on the client but send the raw strings; the server parses them again.
    resolver: zodResolver(firstProductSchema, undefined, { raw: true }),
    mode: "onBlur",
    defaultValues: { name: "", price: "", unit: "", vatRate: "12", description: "" },
  });

  async function onSubmit(values: FirstProductInput) {
    setFormError(null);
    const result = await submitProductAction(token, values);
    if (result.ok) router.refresh();
    else setFormError(sv.onboarding.saveError);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="product-name">{copy.name}</FieldLabel>
          <Input id="product-name" aria-invalid={!!errors.name} {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="product-price">{copy.price}</FieldLabel>
            <Input
              id="product-price"
              inputMode="decimal"
              aria-invalid={!!errors.price}
              {...register("price")}
            />
            <FieldError errors={[errors.price]} />
          </Field>
          <Field data-invalid={!!errors.unit}>
            <FieldLabel htmlFor="product-unit">{copy.unit}</FieldLabel>
            <Input id="product-unit" aria-invalid={!!errors.unit} {...register("unit")} />
            <FieldDescription>{copy.unitHint}</FieldDescription>
            <FieldError errors={[errors.unit]} />
          </Field>
        </div>
        <FieldSet>
          <FieldLegend variant="label">{copy.vat}</FieldLegend>
          <div className="flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="12"
                className="size-4 accent-primary"
                {...register("vatRate")}
              />
              {copy.vatFood}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="25"
                className="size-4 accent-primary"
                {...register("vatRate")}
              />
              {copy.vatOther}
            </label>
          </div>
        </FieldSet>
        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="product-description">{copy.description}</FieldLabel>
          <Textarea
            id="product-description"
            rows={4}
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>
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
