'use server'
import { DIGITALOCEAN_SERVERLESS, SERVERLESS_TOKEN } from '../components/config'
export async function convertCode(code: string) {
  const response = await fetch(DIGITALOCEAN_SERVERLESS + "react/convert?blocking=true&result=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": SERVERLESS_TOKEN
    },
    body: JSON.stringify({
      code: code
    })
  })
  const result = await response.json();
  return result.code;
}