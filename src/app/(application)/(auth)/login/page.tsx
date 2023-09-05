import { Metadata } from 'next'

import {
  ActionContainer,
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'

import { Action, Form } from './form'

export const metadata: Metadata = {
  title: 'Login',
}

export const runtime = 'edge'
export default function Page() {
  return (
    <>
      <FormContainer>
        <Logo />
        <Title>Login to zntask</Title>
        <SubTitle>Continue where you left</SubTitle>
        <Form />
      </FormContainer>
      <ActionContainer>
        <Action />
      </ActionContainer>
    </>
  )
}
