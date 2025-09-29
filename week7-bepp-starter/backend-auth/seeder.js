import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import User from './models/userModel.js'
import Job from './models/jobModel.js'
import connectDB from './config/db.js'

dotenv.config()
connectDB()

// Sample Users
const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    phone_number: '555-1234',
    gender: 'Female',
    date_of_birth: '1995-06-15',
    membership_status: 'Active',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    phone_number: '555-5678',
    gender: 'Male',
    date_of_birth: '1990-03-22',
    membership_status: 'Active',
  },
]

// Sample Jobs
const jobs = [
  {
    title: 'Frontend Developer',
    type: 'Full-Time',
    description: 'Build and maintain user-facing applications.',
    company: {
      name: 'Tech Solutions Inc.',
      contactEmail: 'hr@techsolutions.com',
      contactPhone: '123-456-7890',
    },
  },
  {
    title: 'Backend Engineer',
    type: 'Part-Time',
    description: 'Work on server-side logic and databases.',
    company: {
      name: 'CodeWorks Ltd.',
      contactEmail: 'jobs@codeworks.com',
      contactPhone: '987-654-3210',
    },
  },
]

const importData = async () => {
  try {
    await Job.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)


    const adminUser = createdUsers[0]._id
    const sampleJobs = jobs.map((job) => {
      return { ...job, user_id: adminUser }
    })


    await Job.insertMany(sampleJobs)

    console.log('✅ Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Job.deleteMany()
    await User.deleteMany()

    console.log('❌ Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
