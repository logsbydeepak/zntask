import { google } from "googleapis"
import * as jose from "jose"
import { z } from "zod"

import { env } from "#/env"
import { zEmail, zRequired } from "#/utils/zSchema"

import { r } from "./handler"

const zGoogleLoginRedirectQuerySchema = z.object({
  code: zRequired,
})

const zGoogleTokenResSchema = z.object({
  tokens: z.object({
    id_token: zRequired,
  }),
})

const zGoogleIdTokenDataSchema = z.object({
  email: zEmail,
  given_name: zRequired,
  family_name: z.string().nullable().optional(),
  picture: z.string().url().nullable().optional(),
})

type OAuth2Client = InstanceType<typeof google.auth.OAuth2>

export class GC {
  client: OAuth2Client

  constructor(URL: string) {
    this.client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      URL
    )
  }

  genURL() {
    return this.client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      prompt: "select_account",
    })
  }

  async getData(code: string) {
    try {
      const parsedQuery = zGoogleLoginRedirectQuerySchema.safeParse({ code })
      if (!parsedQuery.success) {
        return r("INVALID_INPUT")
      }

      const googleTokenRes = await this.client.getToken(parsedQuery.data.code)
      const parsedGoogleTokenRes =
        zGoogleTokenResSchema.safeParse(googleTokenRes)
      if (!parsedGoogleTokenRes.success) {
        return r("INVALID_INPUT")
      }

      const tokenData = jose.decodeJwt(
        parsedGoogleTokenRes.data.tokens.id_token
      )

      const parsedTokenData = zGoogleIdTokenDataSchema.safeParse(tokenData)
      if (!parsedTokenData.success) {
        return r("INVALID_INPUT")
      }
      return r("OK", { ...parsedTokenData.data })
    } catch (error) {
      return r("ERROR")
    }
  }
}
