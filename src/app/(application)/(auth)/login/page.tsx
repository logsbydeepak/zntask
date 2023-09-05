import {
  ActionContainer,
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'

import { Action, Form } from './form'

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
