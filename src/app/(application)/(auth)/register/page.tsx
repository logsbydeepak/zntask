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
  title: 'Register',
}

export default function Page() {
  return (
    <JotaiProvider>
      <FormContainer>
        <Logo />
        <Title>Register your zntask account</Title>
        <SubTitle>Start managing your time</SubTitle>
        <Form />
      </FormContainer>
      <ActionContainer>
        <Action />
      </ActionContainer>
    </JotaiProvider>
  )
}
