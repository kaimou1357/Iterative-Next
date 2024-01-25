"use server";
import { redirect } from "next/navigation";
import { CONVERTER_URL } from "../components/config";

export async function convertCode(code: string) {
  const response = await fetch(
    CONVERTER_URL + "/build",
    {
      method: "POST",
      body: code
    },
  );
  const respCode = await response.text();
  return respCode;
}

export async function navigatetoProject(id: string) {
  redirect(`/tool/${id}`);
}
