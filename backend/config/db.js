import dns from 'node:dns'
import mongoose from 'mongoose'

// Some local DNS servers (e.g. home routers) refuse Node's c-ares SRV queries,
// which breaks MongoDB Atlas `mongodb+srv://` connection strings with
// `querySrv ECONNREFUSED`. Use a public resolver so SRV records resolve.
dns.setServers(['8.8.8.8', '1.1.1.1'])

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Copy backend/.env.example to backend/.env and set your MongoDB Atlas connection string.')
  }
  mongoose.set('strictQuery', true)
  const conn = await mongoose.connect(uri)
  console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  return conn
}

export const isConnected = () => mongoose.connection.readyState === 1
