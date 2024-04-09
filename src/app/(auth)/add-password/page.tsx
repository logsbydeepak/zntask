import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { Logo, SubTitle, Title } from '@/app/(auth)/components'
import { Alert } from '@/components/ui/alert'
import { checkToken } from '@/data/utils'
import { zRequired } from '@/utils/zSchema'

import { Form } from './form'

export const metadata: Metadata = {
  title: 'Add password',
}

const schema = z.object({
  token: zRequired,
})

export default async function Page({
  searchParams,
}: {
  searchParams: unknown
}) {
  const validate = schema.safeParse(searchParams)
  if (!validate.success) {
    redirect('/')
  }

  const token = await checkToken(validate.data.token)
  const isTokenValid = token.code === 'OK'

  const message = () => {
    if (token.code === 'TOKEN_EXPIRED') {
      return 'Time period expired, try again'
    } else if (token.code === 'INVALID_TOKEN') {
      return 'Invalid token, try again'
    } else {
      return 'Something went wrong, try again'
    }
  }

  return (
    <>
      <div className="flex w-full flex-col items-center">
        <Logo />
        <Title>Add Password</Title>
        <SubTitle>Add password to your account</SubTitle>
      </div>
      {isTokenValid ? (
        <Form token={validate.data.token} />
      ) : (
        <Alert align="center" message={message()} type="destructive" isOpen />
      )}
    </>
  )
}
