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

  return (
    <FormContainer>
      <div className="flex w-full flex-col items-center">
        <Logo />
        <Title>Add Password</Title>
        <SubTitle>Add password to your account</SubTitle>
      </div>
      {isTokenValid ? (
        <Form token={'dsf'} />
      ) : (
        <Message>
          {token.code === 'TOKEN_EXPIRED' && 'time out'}
          {token.code === 'INVALID_TOKEN' && 'invalid token'}
        </Message>
      )}
    </FormContainer>
  )
}

function Message({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-sm font-medium text-red-600">{children}</p>
  )
}
