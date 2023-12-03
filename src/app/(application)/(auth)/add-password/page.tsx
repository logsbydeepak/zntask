import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import {
  AccountQuestion,
  FormContainer,
  Logo,
  Separator,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'
import { ExclamationIcon } from '@/components/icon/exclamation'
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
    <FormContainer>
      <div className="flex w-full flex-col items-center">
        <Logo />
        <Title>Add Password</Title>
        <SubTitle>Add password to your account</SubTitle>
      </div>
      {isTokenValid ? (
        <Form token={validate.data.token} />
      ) : (
        <AlertMessage>{message()}</AlertMessage>
      )}
    </FormContainer>
  )
}

function AlertMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center space-x-2 rounded-lg bg-red-50 p-3 text-center text-xs font-medium text-red-700">
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-700 text-white">
        <ExclamationIcon className="h-3 w-3" />
      </span>
      <p>{children}</p>
    </div>
  )
}
