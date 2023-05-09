export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Click on the links above to navigate</p>
      <a href={`/users/${Math.floor(Math.random() * 10) + 1}`}>Random User</a>
    </div>
  )
}
