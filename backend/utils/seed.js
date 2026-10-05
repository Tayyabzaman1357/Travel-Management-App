import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Hotel from '../models/Hotel.js'
import Flight from '../models/Flight.js'
import Destination from '../models/Destination.js'
import Tour from '../models/Tour.js'
import { users, hotels, flights, destinations, tours } from './seedData.js'

// Hash explicitly — insertMany() does not guarantee the model's pre-save hook runs
const hashUsers = () => users.map((u) => ({ ...u, password: bcrypt.hashSync(u.password, 10) }))

const seed = async () => {
  try {
    await connectDB()

    const report = {}

    if ((await User.countDocuments()) === 0) {
      await User.insertMany(hashUsers())
      report.users = users.length
    } else {
      report.users = 'skipped (existing)'
    }

    if ((await Hotel.countDocuments()) === 0) {
      await Hotel.insertMany(hotels)
      report.hotels = hotels.length
    } else {
      report.hotels = 'skipped (existing)'
    }

    if ((await Flight.countDocuments()) === 0) {
      await Flight.insertMany(flights)
      report.flights = flights.length
    } else {
      report.flights = 'skipped (existing)'
    }

    if ((await Destination.countDocuments()) === 0) {
      await Destination.insertMany(destinations)
      report.destinations = destinations.length
    } else {
      report.destinations = 'skipped (existing)'
    }

    if ((await Tour.countDocuments()) === 0) {
      await Tour.insertMany(tours)
      report.tours = tours.length
    } else {
      report.tours = 'skipped (existing)'
    }

    console.log('\n🌱 Seed complete:')
    console.table(report)
    console.log('\nDemo logins:')
    console.log('  Admin → admin@wanderlust.com / admin123')
    console.log('  User  → user@wanderlust.com / user123\n')
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seed()
