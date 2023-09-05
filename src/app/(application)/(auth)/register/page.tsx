import {
  ActionContainer,
  Container,
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'

import { Action, Form } from './form'

export default function Page() {
  return (
    <Container className="md:my-36">
      <FormContainer>
        <Logo />
        <Title>Create your zntask account</Title>
        <SubTitle>Start managing your time</SubTitle>
        <Form />
      </FormContainer>
      <ActionContainer>
        <Action />
      </ActionContainer>
    </Container>
  )
}
