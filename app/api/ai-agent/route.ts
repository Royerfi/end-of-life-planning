import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'
import { sql } from '@vercel/postgres'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const { userId, question } = await req.json()

  // Fetch user data from the database
  const userData = await sql`
    SELECT 
      u.name, 
      COUNT(d.id) as document_count, 
      COUNT(f.id) as family_member_count, 
      COUNT(r.id) as property_count
    FROM users u
    LEFT JOIN documents d ON u.id = d.user_id
    LEFT JOIN family_members f ON u.id = f.user_id
    LEFT JOIN real_estate r ON u.id = r.user_id
    WHERE u.id = ${userId}
    GROUP BY u.id
  `

  const user = userData.rows[0]

  // Generate a response using OpenAI
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `User ${user.name} has ${user.document_count} documents, ${user.family_member_count} family members, and ${user.property_count} properties registered. They asked: "${question}". Provide a helpful response.`,
    max_tokens: 150,
  })

  return NextResponse.json({ response: completion.data.choices[0].text })
}

