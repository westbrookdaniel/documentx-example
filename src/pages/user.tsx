import { router } from '../main'

type User = {
  id: number
  name: string
  username: string
  email: string
}

const getUser = async (id: string) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return (await response.json()) as User
}

export default async function UserPage() {
  if (typeof document === 'undefined') return <div>Loading...</div>
  const id = router.params().id
  const user = await getUser(id)
  return (
    <>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.username}</p>
    </>
  )
}
