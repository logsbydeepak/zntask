import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import { Loader2Icon, LoaderIcon } from 'lucide-react'

import * as Layout from '@/app/(app)/app-layout'
import { genInitials } from '@/components/avatar'
import { Head } from '@/components/head'
import { getUserWithAuth } from '@/data/user'

import { EditEmail, EditName, EditPicture, Update } from './edit'

const getUserWithAuthData = unstable_cache(
  async () => {
    return await getUserWithAuth()
  },
  ['user-with-auth'],
  {
    tags: ['user'],
  }
)

export default async function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>User</Layout.Title>
        <Head title="User" />
      </Layout.Header>
      <Layout.Content>
        <Suspense fallback={<Loading />}>
          <UserInformation />
        </Suspense>
      </Layout.Content>
    </Layout.Root>
  )
}

function Loading() {
  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
      <LoaderIcon className="size-6 animate-spin text-gray-400" />
    </div>
  )
}

async function UserInformation() {
  const user = await getUserWithAuthData()

  return (
    <div className="space-y-8">
      <Item.Container>
        <Item.Wrapper>
          <Item.Key>Picture</Item.Key>
          <Item.Content>
            <Picture
              profilePicture={user.profilePicture}
              firstName={user.firstName}
              lastName={user.lastName}
            />
          </Item.Content>
          <Item.Action>
            <EditPicture />
          </Item.Action>
        </Item.Wrapper>

        <Item.Separator />

        <Item.Wrapper>
          <Item.Key>Name</Item.Key>
          <Item.Content>{`${user.firstName} ${user.lastName}`}</Item.Content>
          <Item.Action>
            <EditName />
          </Item.Action>
        </Item.Wrapper>

        <Item.Separator />

        <Item.Wrapper>
          <Item.Key>Email</Item.Key>
          <Item.Content>{user.email}</Item.Content>
          <Item.Action>
            <EditEmail />
          </Item.Action>
        </Item.Wrapper>
      </Item.Container>

      <Item.Container>
        <Item.Wrapper>
          <Item.Key>Google</Item.Key>
          <Item.Content>{user.auth.google.toString()}</Item.Content>
          <Item.Action>
            <EditName />
          </Item.Action>
        </Item.Wrapper>

        <Item.Separator />

        <Item.Wrapper>
          <Item.Key>Password</Item.Key>
          <Item.Content>{user.auth.credential.toString()}</Item.Content>
          <Item.Action>
            <EditName />
          </Item.Action>
        </Item.Wrapper>
      </Item.Container>
    </div>
  )
}

function Picture({
  profilePicture,
  firstName,
  lastName,
}: {
  profilePicture: string | null
  firstName: string
  lastName?: string | null
}) {
  const initials = genInitials(firstName, lastName)

  return (
    <div className="flex size-24 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
      {profilePicture && (
        <Image
          src={profilePicture}
          width={96}
          height={96}
          quality={100}
          alt="avatar"
          className="size-full rounded-full object-cover"
        />
      )}

      {!profilePicture && (
        <p className="text-4xl font-medium tracking-wider text-gray-600">
          {initials}
        </p>
      )}
    </div>
  )
}

function ItemContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-100">
      {children}
    </div>
  )
}

function ItemWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex px-4 py-4 text-sm">{children}</div>
}

function ItemKey({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex w-[30%] items-center text-xs font-medium text-gray-500">
      {children}{' '}
    </p>
  )
}

function ItemContent({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full items-center">{children}</div>
}

function ItemAction({ children }: { children: React.ReactNode }) {
  return <div className="flex w-[20%] items-center justify-end">{children}</div>
}

function ItemSeparator() {
  return <div className="border-b border-gray-100" />
}

const Item = {
  Key: ItemKey,
  Content: ItemContent,
  Action: ItemAction,
  Container: ItemContainer,
  Wrapper: ItemWrapper,
  Separator: ItemSeparator,
}
