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
  title: 'Login',
}

export default function Page() {
  return (
    <StateProvider>
      <FormContainer>
        <Logo />
        <Title>Login to zntask</Title>
        <SubTitle>Continue where you left</SubTitle>
        <Form />
      </FormContainer>
      <ActionContainer>
        <Action />
      </ActionContainer>
    </StateProvider>
  )
}
