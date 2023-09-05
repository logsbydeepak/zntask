import { Container } from '@/app/(application)/(auth)/components'

import { Form } from './form'

export default function Page() {
  return (
    <Container className="md:my-64">
      <h1>Login</h1>
      <Form />
    </Container>
  )
}
