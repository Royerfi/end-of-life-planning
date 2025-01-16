import bcrypt from 'bcryptjs'

async function generateHash() {
  const password = 'your-test-password' // Replace with the password you want to use
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  console.log('Password hash:', hash)
}

generateHash()

