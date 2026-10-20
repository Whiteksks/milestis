import { Polar } from "@polar-sh/sdk"
import { getPolarConfig } from '@/config/server'

export function getPolarClient(): Polar {
  return new Polar(getPolarConfig())
}
