import { Metadata } from 'next'

import {
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'

import { Form } from './form'

export const metadata: Metadata = {
  title: 'Register',
}

export default function Page() {
  return (
    <FormContainer>
      <Logo />
      <Title>Register your zntask account</Title>
      <SubTitle>Start managing your time</SubTitle>
      <Form />
    </FormContainer>
  )
}
