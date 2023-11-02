import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import {
  ActionContainer,
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'
import { checkToken } from '@/data/utils'
import { zRequired } from '@/utils/zSchema'

import { Action, Form } from './form'

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
    <>
      <FormContainer>
        <Logo />
        <Title>Add Password</Title>
        <SubTitle>Add password to your account</SubTitle>
        {isTokenValid ? (
          <Form token={validate.data.token} />
        ) : (
          <Message>
            {token.code === 'TOKEN_EXPIRED' && 'time out'}
            {token.code === 'INVALID_TOKEN' && 'invalid token'}
          </Message>
        )}
      </FormContainer>
      <ActionContainer>
        <Action />
      </ActionContainer>
    </>
  )
}

function Message({ children }: { children: React.ReactNode }) {
  return <p className="pt-7 text-sm font-medium text-red-600">{children}</p>
}
