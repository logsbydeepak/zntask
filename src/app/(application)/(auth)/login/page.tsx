import { Metadata } from 'next'

import { Logo, SubTitle, Title } from '@/app/(application)/(auth)/components'

import { Form } from './form'

export const metadata: Metadata = {
  title: 'Login',
}

export default function Page() {
  return (
    <>
      <div className="flex w-full flex-col items-center">
        <Logo />
        <Title>Login to zntask</Title>
        <SubTitle>Continue where you left</SubTitle>
      </div>
      <Form />
    </>
  )
}
