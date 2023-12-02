import { Metadata } from 'next'

import {
  FormContainer,
  Logo,
  SubTitle,
  Title,
} from '@/app/(application)/(auth)/components'
import { getUserLogin } from '@/data/auth'

import { Form } from './form'

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
    <FormContainer>
      <Logo />
      <Title>Login to zntask</Title>
      <SubTitle>Continue where you left</SubTitle>
      <Form />
    </FormContainer>
  )
}
