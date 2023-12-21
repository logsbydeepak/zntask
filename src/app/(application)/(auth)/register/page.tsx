import { Metadata } from 'next'

import { Logo, SubTitle, Title } from '@/app/(application)/(auth)/components'

import { Form } from './form'

export const metadata: Metadata = {
  title: 'Register',
}

export default function Page() {
  return (
    <>
      <div className="flex w-full flex-col items-center">
        <Logo />
        <Title>Register your zntask account</Title>
        <SubTitle>Start managing your time</SubTitle>
      </div>
      <Form />
    </>
  )
}
