import { Metadata } from 'next'

import {
  ActionContainer,
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'
import { JotaiProvider } from '@/components/client-providers'

import { Action, Form } from './form'

export const metadata: Metadata = {
  title: 'Login',
}

export default function Page() {
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
