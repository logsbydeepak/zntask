import { Metadata } from 'next'

import {
  ActionContainer,
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'
import { JotaiProvider } from '@/components/client-providers'
import { getUserLogin } from '@/data/auth'

import { Action, Form } from './form'

export const metadata: Metadata = {
  title: 'Login',
}

export default async function Page({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}) {
  const data = await getUserLogin(searchParams)
  console.log(data)

  return (
    <JotaiProvider>
      <FormContainer>
        <Logo />
        <Title>Login to zntask</Title>
        <SubTitle>Continue where you left</SubTitle>
        <Form />
      </FormContainer>
      <ActionContainer>
        <Action />
      </ActionContainer>
    </JotaiProvider>
  )
}
