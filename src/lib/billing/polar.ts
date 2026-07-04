import { Polar } from "@polar-sh/sdk"

export function getPolarClient(): Polar {
  const accessToken = process.env.POLAR_ACCESS_TOKEN
  if (!accessToken) throw new Error("POLAR_ACCESS_TOKEN is not set")

  const server = process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production"

  return new Polar({
    accessToken,
    server,
  })
}
