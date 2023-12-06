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

export const googleClient = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.BASE_URL}/google`
)

export const generateGoogleAuthUrl = () => {
  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope,
    prompt: 'select_account',
  })
}

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
  family_name: z.string().nullable(),
  picture: z.string().url().nullable(),
})

export async function getGoogleData({ code }: { code: string }) {
  try {
    const parsedQuery = zGoogleLoginRedirectQuerySchema.safeParse({ code })
    if (!parsedQuery.success) {
      return r('INVALID_INPUT')
    }

    const googleTokenRes = await googleClient.getToken(parsedQuery.data.code)
    const parsedGoogleTokenRes = zGoogleTokenResSchema.safeParse(googleTokenRes)
    if (!parsedGoogleTokenRes.success) {
      return r('INVALID_INPUT')
    }

    const tokenData = jose.decodeJwt(parsedGoogleTokenRes.data.tokens.id_token)

    const parsedTokenData = zGoogleIdTokenDataSchema.safeParse(tokenData)
    if (!parsedTokenData.success) {
      return r('INVALID_INPUT')
    }
    return r('OK', { ...parsedTokenData.data })
  } catch (error) {
    return r('ERROR')
  }
}
