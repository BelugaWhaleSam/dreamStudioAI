import { useState } from 'react'

const Home = () => {
  const [text, setText] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    })

    const { image } = await response.json()

    setImage(image)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Generate Image</button>
      </form>
      {image && <img src={`data:image/png;base64,${image}`} />}
    </div>
  )
}

export default Home
