import { getUserWithAuth } from './fetch'

export default async function Page() {
  const user = await getUserWithAuth()
  return (
    <>
      <h1>User</h1>
      {JSON.stringify(user.res)}
    </>
  )
}
