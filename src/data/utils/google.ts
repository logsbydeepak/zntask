import { env } from 'process'
import { google } from 'googleapis'
import * as jose from 'jose'
import { z } from 'zod'

import { zEmail, zRequired } from '@/utils/zSchema'

import { r } from './handler'

const scope = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
]

export function googleClient(URL: string) {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    URL
  )
}

export const generateGoogleAuthUrl = (redirectURL: string) => {
  return googleClient(redirectURL).generateAuthUrl({
    access_type: 'offline',
    scope,
    prompt: 'select_account',
  })
}

type GoogleClientType = ReturnType<typeof googleClient>

export const googleLoginRedirectQuerySchema = z.object({
  code: zRequired,
})

export const googleTokenResSchema = z.object({
  tokens: z.object({
    id_token: zRequired,
  }),
})

export const googleIdTokenDataSchema = z.object({
  email: zEmail,
  given_name: zRequired,
  family_name: z.string().nullable(),
  picture: z.string().url().nullable(),
})

export async function getGoogleData(
  googleClient: GoogleClientType,
  query: any
) {
  try {
    const parsedQuery = googleLoginRedirectQuerySchema.safeParse(query)
    if (!parsedQuery.success) {
      return r('INVALID_INPUT')
    }

    const googleTokenRes = await googleClient.getToken(parsedQuery.data.code)
    const parsedGoogleTokenRes = googleTokenResSchema.safeParse(googleTokenRes)
    if (!parsedGoogleTokenRes.success) {
      return r('INVALID_INPUT')
    }

    const tokenData = jose.decodeJwt(parsedGoogleTokenRes.data.tokens.id_token)

    const parsedTokenData = googleIdTokenDataSchema.safeParse(tokenData)
    if (!parsedTokenData.success) {
      return r('INVALID_INPUT')
    }
    return r('OK', { ...parsedTokenData.data })
  } catch (error) {
    return r('ERROR')
  }
}
