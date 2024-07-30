import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  let body: unknown | { error: { message: string } } | undefined
  let status: number

  try {
    const res = await fetch(`https://api.etherscan.io/api
   ?module=account
   &action=tokenbalance
   &contractaddress=0x5B7533812759B45C2B44C19e320ba2cD2681b542
   &address=0x0000000000000000000000000000000000000000
   &tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`)
    const json = await res.json()

    body = json
    status = 200
    response.setHeader('Cache-Control', 'public, s-maxage=10')
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(errorMessage)
    body = { error: { message: errorMessage } }
    status = 500
  }

  return response.status(status).json(body)
}
