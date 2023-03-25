import { NextApiHandler } from 'next'
import fetch from 'node-fetch'

const engineId = 'stable-diffusion-v1-5'
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
const apiKey = "sk-vlcTxxqetP5TwxZxZZQ5MJY9oflVcn4Z2zmWC722Zn7RztrV"

if (!apiKey) throw new Error('Missing Stability API key.')

const generateImage: NextApiHandler = async (req, res) => {
  const { text } = req.body

  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text,
          },
        ],
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`)
  }

  const responseJSON = (await response.json()) as {
    artifacts: Array<{
      base64: string
      seed: number
      finishReason: string
    }>
  }

  const image = responseJSON.artifacts[0].base64

  res.status(200).json({ image })
}

export default generateImage
