"use client";

import React, { useEffect, useState } from "react";
import styles from "./AuthForm.module.scss";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const schemaStep1 = z.object({
  countryCode: z.string().min(1, "Select a country code"),
  phone: z.string().min(5, "Enter valid phone number"),
});

const schemaStep2 = schemaStep1.extend({
  otp: z.string().min(4, "Enter OTP"),
});

type FormData = z.infer<typeof schemaStep2>;

type CountryOption = {
  name: string;
  dialCode: string;
};

export default function AuthForm() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [otpSent, setOtpSent] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const form = useForm<FormData>({
  resolver: zodResolver(otpSent ? schemaStep2 : schemaStep1),
});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    // Fetch country data
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
    .then((res) => res.json())
    .then((data: any[]) => {
      const list = data
        .map((c) => {
          const root: string = c.idd?.root ?? "";
          const suffix: string = c.idd?.suffixes?.[0] ?? "";
          return {
            name: c.name.common as string,
            dialCode: root + suffix,
          };
        })
        .filter((c) => c.dialCode);

      const sorted = list.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(sorted);
    });
  }, []);

  const onSubmit = (data: FormData) => {
    console.log(data);
    if (!otpSent) {
      setOtpSent(true);
      setTimeout(() => {
        alert("OTP sent (simulated)");
      }, 1000);
    } else {
      login(data.phone, data.countryCode);
      router.push("/dashboard"); // ✅ redirect
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <select {...register("countryCode")}>
        <option value="">Select Country Code</option>
        {countries.map((c) => (
          <option key={c.dialCode + Math.random()} value={c.dialCode}>
            {c.name} ({c.dialCode})
          </option>
        ))}
      </select>
      {errors.countryCode && <p>{errors.countryCode.message}</p>}

      <input placeholder="Phone Number" {...register("phone")} />
      {errors.phone && <p>{errors.phone.message}</p>}

      {otpSent && (
        <>
          <input placeholder="Enter OTP" {...register("otp")} />
          {errors.otp && <p>{errors.otp.message}</p>}
        </>
      )}

      <button type="submit">{otpSent ? "Verify OTP" : "Send OTP"}</button>
    </form>
  );
}
