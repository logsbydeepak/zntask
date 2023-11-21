import { env } from 'process'
import { google } from 'googleapis'

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
