import { router } from './main'
import { ref } from './util'
import { renderAsync } from './util/renderAsync'

const getUser = async (id: string) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return (await response.json()) as User
}

export default function UserPage() {
  const id = router.params().id
  const el = ref()

  const initial = renderAsync(el, {
    loading: () => <h1>Loading...</h1>,
    error: (err) => <h1>Error: {JSON.stringify(err)}</h1>,
    data: async () => {
      const user = await getUser(id)
      return (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <p>{user.website}</p>
        </div>
      )
    },
  })

  return <div ref={el}>{initial}</div>
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
