import { google } from 'googleapis'
import * as jose from 'jose'
import { z } from 'zod'

import { env } from '@/env.mjs'
import { zEmail, zRequired } from '@/utils/zSchema'

import { r } from './handler'

const scope = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
]
export const googleURL = {
  login: `${env.BASE_URL}/google?type=login`,
  register: `${env.BASE_URL}/google?type=register`,
  user: `${env.BASE_URL}/google?type=new`,
}

export function googleClient(URL: string) {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    URL
  )
}

export function generateGoogleURL(url: string) {
  return googleClient(url).generateAuthUrl({
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

export async function getGoogleData({
  code,
  URL,
}: {
  code: string
  URL: string
}) {
  try {
    const parsedQuery = zGoogleLoginRedirectQuerySchema.safeParse({ code })
    if (!parsedQuery.success) {
      return r('INVALID_INPUT')
    }

    const googleTokenRes = await googleClient(URL).getToken(
      parsedQuery.data.code
    )
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
