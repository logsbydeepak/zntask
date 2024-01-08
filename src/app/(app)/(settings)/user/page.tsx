import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import { CheckIcon, LoaderIcon, XIcon } from 'lucide-react'

import * as Layout from '@/app/(app)/app-layout'
import { genInitials } from '@/components/avatar'
import { Head } from '@/components/head'
import { getUserWithAuth } from '@/data/user'

import {
  AddGoogleAuth,
  EditEmail,
  EditName,
  EditPicture,
  RemoveGoogleAuth,
  RemovePasswordAuth,
  ResetPassword,
} from './edit'

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
          <Item.Key>PICTURE</Item.Key>
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
          <Item.Key>NAME</Item.Key>
          <Item.Content>{`${user.firstName} ${user.lastName}`}</Item.Content>
          <Item.Action>
            <EditName />
          </Item.Action>
        </Item.Wrapper>

        <Item.Separator />

        <Item.Wrapper>
          <Item.Key>EMAIL</Item.Key>
          <Item.Content>{user.email}</Item.Content>
          <Item.Action>
            <EditEmail />
          </Item.Action>
        </Item.Wrapper>
      </Item.Container>

      <Item.Container>
        <Item.Wrapper>
          <Item.Key>GOOGLE</Item.Key>
          <Item.Content>
            {user.auth.google ? <Check /> : <Cross />}
          </Item.Content>
          <Item.Action>
            {user.auth.google ? <RemoveGoogleAuth /> : <AddGoogleAuth />}
          </Item.Action>
        </Item.Wrapper>

        <Item.Separator />

        <Item.Wrapper>
          <Item.Key>PASSWORD</Item.Key>
          <Item.Content>
            {user.auth.credential ? <Check /> : <Cross />}
          </Item.Content>
          <Item.Action>
            {user.auth.credential && <RemovePasswordAuth />}
          </Item.Action>
        </Item.Wrapper>
        <Item.Separator />
        <Item.Wrapper>
          <ResetPassword />
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
  return (
    <div className="flex flex-wrap gap-8 p-4 text-sm sm:flex-nowrap">
      {children}
    </div>
  )
}

function ItemKey({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-full text-xs font-medium text-gray-600 sm:inline-block sm:w-20">
      {children}
    </p>
  )
}

function ItemContent({ children }: { children: React.ReactNode }) {
  return <div className="truncate">{children}</div>
}

function ItemAction({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto flex items-center justify-center sm:inline-block">
      {children}
    </div>
  )
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

function Check() {
  return (
    <IconContainer>
      <CheckIcon />
    </IconContainer>
  )
}

function Cross() {
  return (
    <IconContainer>
      <XIcon />
    </IconContainer>
  )
}

function IconContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
      <span className="size-4">{children}</span>
    </div>
  )
}
