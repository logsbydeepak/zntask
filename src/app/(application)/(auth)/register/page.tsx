import { Metadata } from 'next'

import {
  ActionContainer,
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'

import { Action, Form, StateProvider } from './form'

export const metadata: Metadata = {
  title: 'Register',
}

export default function Page() {
  return (
    <StateProvider>
      <FormContainer>
        <Logo />
        <Title>Register your zntask account</Title>
        <SubTitle>Start managing your time</SubTitle>
        <Form />
      </FormContainer>
      <ActionContainer>
        <Action />
      </ActionContainer>
    </StateProvider>
  )
}
