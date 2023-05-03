import { router } from './main'
import { ref } from './util'
import { bindAsync } from './util/bindAsync'

const getUser = async (id: string) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  )
  return (await response.json()) as User
}

export const UserPage = () => {
  const id = router.params().id
  const el = ref()

  const initial = bindAsync(el, getUser(id), {
    loading: () => <h1>Loading...</h1>,
    error: (err) => <h1>Error: {err.message}</h1>,
    data: (user) => (
      <div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p>{user.website}</p>
      </div>
    ),
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
