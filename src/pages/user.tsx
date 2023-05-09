import { router } from '../main'

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
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.phone}</p>
      <p>{user.website}</p>
    </div>
  )
}

type User = {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}
