"use client";

import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUp";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from 'axios';

export default function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceUserName = useDebounceValue(username, 300);

  const router = useRouter();
  const { toast } = useToast();

  // zod Implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debounceUserName) {
        setLoader(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debounceUserName}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setLoader(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debounceUserName]);

  return <>Hello</>;
}
