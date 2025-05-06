import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import multer from 'multer'

// Tip:
// When adding new routes, add new routes at the bottom of the file, before [Start Server].
// Then, cluster similar routes together.

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use('/images', express.static('images'))

// *-*-*-*-*-*-*-* //
// MongoDB CONFIG. //
// *-*-*-*-*-*-*-* //

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err))

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})
const User = mongoose.model('User', userSchema)

// Resume Schema
const resumeSchema = new mongoose.Schema({
  resumeUrl: {type: String, required: true, unique: true},
  belongsToUser: {type: String, required: true, unique: true},
})
const Resume = mongoose.model('Resume', resumeSchema)

// Connections Schema
const connectionsSchema = new mongoose.Schema({
  belongsTo: {type: String, required: true, unique: true},
  connected: {type: [String]},
  sent: {type: [String]},
  pending: {type: [String]},
})
const Connection = mongoose.model('Connections', connectionsSchema)

// Avatar Picture Schema
const avatarSchema = new mongoose.Schema({
  avatarUrl: {type: String, required: true, unique: true},
  belongsToUser: {type: String, required: true, unique: true},
})
const Avatar = mongoose.model('Avatar', avatarSchema)

// Profile Schema
const profileSchema = new mongoose.Schema({
  name: {type: String, required: true},
  role: {type: String, required: true},
  bio: {type: String, required: true},
  belongsToUser: {type: String, required: true}
})
const Profile = mongoose.model('Profile', profileSchema)

// *-*-*-*-*-*-*- //
// EXPRESS ROUTES //
// *-*-*-*-*-*-*- //

// Multer config
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
})

const upload = multer({ storage: fileStorageEngine })

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: 'User already exists' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user = new User({ email, password: hashedPassword })
        await user.save()

        await Connection.create({
          belongsTo: user._id,
          connected: [],
          sent: [],
          pending: [],
        })

        const userForToken = {
          userId: user._id,
          password: user.password
        }

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(201).json({token, message: 'User registered successfully', })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

        const userForToken = {
          userId: user._id,
          password: user.password
        }

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.json({ token, user: { email: user.email } })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Users Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find()
    const avatars = await Avatar.find()
    const profiles = await Profile.find()
    const resumes = await Resume.find()

    const result = users.map(user => {
      const userId = String(user._id)

      const avatar = avatars.find(a => a.belongsToUser === userId)
      const profile = profiles.find(p => p.belongsToUser === userId)
      const resume = resumes.find(r => r.belongsToUser === userId)

      return {
        id: userId,
        email: user.email,
        avatarUrl: avatar?.avatarUrl || null,
        profile: profile
          ? {
              name: profile.name,
              role: profile.role,
              bio: profile.bio
            }
          : null,
        resumeUrl: resume?.resumeUrl || null
      }
    })

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/search-users', async (req, res) => {
    try {
      const { query } = req.query
  
      if (!query) {
        return res.json([])
      }
  
      const users = await User.find({
        name: { $regex: query, $options: "i" },
      })
  
      res.json(users)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })  

// Resume Routes
app.get('/api/resume', async (req, res) => {
  const authenticationHeader = req.headers['authorization']
  const token = authenticationHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const resume = await Resume.findOne({belongsToUser: decoded.userId})

  if (!resume) {
    return res.status(200)
  }

  const resumeUrl = resume.resumeUrl
  res.json({path: resumeUrl})
})

app.post('/api/resume', upload.single('image'), async (req, res) => {
  const authenticationHeader = req.headers['authorization']
  
  if (!authenticationHeader) {
    return res.status(401).json({ error: 'No authorization header' })
  }

  const token = authenticationHeader.split(' ')[1]
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const resumeUrl = await req.file.path

  const resume = await Resume.findOne({belongsToUser: decoded.userId})

  if (resume) {
    resume.resumeUrl = resumeUrl
    await resume.save()
  }
  else {
    await Resume.create({
      resumeUrl,
      belongsToUser: decoded.userId,
    })
  }

  res.json({path: resumeUrl})
})

// Avatar Routes
app.get('/api/avatar', async (req, res) => {
  const authenticationHeader = req.headers['authorization']
  const token = authenticationHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const avatar = await Avatar.findOne({belongsToUser: decoded.userId})

  if(!avatar) {
    console.log('The user has no avatar')
    return
  }

  const avatarUrl = avatar.avatarUrl
  res.json({path: avatarUrl})
})

app.post('/api/avatar', upload.single('image'), async (req, res) => {
  const authenticationHeader = req.headers['authorization']
  
  if (!authenticationHeader) {
    return res.status(401).json({ error: 'No authorization header' })
  }

  const token = authenticationHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const avatarUrl = await req.file.path

  const avatar = await Avatar.findOne({belongsToUser: decoded.userId})

  if(avatar) {
    avatar.avatarUrl = avatarUrl
    await avatar.save()
  }
  else {
    await Avatar.create({
      avatarUrl,
      belongsToUser: decoded.userId
    })
  }

  res.json({path: avatarUrl})
})

// Resume routes
app.get('/api/resumes/:id', async (req, res) => {
  const userId = req.params.id
  const resume = await Resume.findOne({belongsToUser: userId})
  
  if (!resume) {
    res.json({error: 'User does not exist'})
    return
  }

  res.json({path: resume.resumeUrl})
})

// Profile routes
app.get('/api/profile', async (req, res) => {
  const authenticationHeader = req.headers['authorization']
  const token = authenticationHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const profile = await Profile.findOne({belongsToUser: decoded.userId})

  if (!profile) {
    return res.status(200)
  }

  res.json(profile)
})

app.post('/api/profile', async (req, res) => {
  const authenticationHeader = req.headers['authorization']
  
  if (!authenticationHeader) {
    return res.status(401).json({ error: 'No authorization header' })
  }

  const token = authenticationHeader.split(' ')[1] 
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const body = req.body
  const {name, role, bio} = body
  const profile = await Profile.findOne({belongsToUser: decoded.userId})

  if (profile) {
    profile.name = name
    profile.role = role
    profile.bio = bio
    await profile.save()
  }
  else {
    profile = await Profile.create({
      name: name,
      role: role,
      bio: bio,
      belongsToUser: decoded.userId,
    })
  }

  res.json(profile)
})

// Connections
app.post('/api/send-connection-request', async (req, res) => {
  const { targetUserId } = req.body
  const authenticationHeader = req.headers['authorization']
  const token = authenticationHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  if (decoded.userId === targetUserId) {
    return res.status(400).json({ message: 'You cannot send a connection request to yourself' })
  }

  let userConn = await Connection.findOne({ belongsTo: decoded.userId })
  let targetConn = await Connection.findOne({ belongsTo: targetUserId })

  if (!userConn) {
    userConn = new Connection({
      belongsTo: decoded.userId,
      connected: [],
      pending: [],
    })
    await userConn.save()
  }
  else {
    if (userConn.sent.includes(targetUserId)) {
      return res.status(400).json({ message: 'Connection request already sent' })
    }
    userConn.sent.push(targetUserId)
    await userConn.save()
  }

  if (!targetConn) {
    targetConn = new Connection({
      belongsTo: targetUserId,
      connected: [],
      sent: [],
      pending: [decoded.userId],
    })
    await targetConn.save()
  }
  else {
    targetConn.pending.push(decoded.userId)
    await targetConn.save()
  }

  res.status(200).json({
    message: 'Connection request sent successfully',
    userConn: userConn,
    targetConn: targetConn,
  })
})

app.post('/api/accept-connection-request', async (req, res) => {
  const { targetUserId } = req.body
  const authenticationHeader = req.headers['authorization']
  const token = authenticationHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const acceptingUserId = decoded.userId
  const requestSenderId = targetUserId

  if (acceptingUserId === requestSenderId) {
    return res.status(400).json({ message: 'You cannot accept a connection request from yourself' })
  }

  const acceptingUserConn = await Connection.findOne({ belongsTo: acceptingUserId })
  const senderUserConn = await Connection.findOne({ belongsTo: requestSenderId })

  if (!acceptingUserConn || !senderUserConn) {
    return res.status(400).json({ message: 'Connection not found' })
  }

  if (!acceptingUserConn.pending.includes(requestSenderId)) {
    return res.status(400).json({ message: 'No connection request found from this user' })
  }

  acceptingUserConn.pending = acceptingUserConn.pending.filter(id => id !== requestSenderId)
  acceptingUserConn.connected.push(requestSenderId)

  senderUserConn.sent = senderUserConn.sent.filter(id => id !== acceptingUserId)
  senderUserConn.connected.push(acceptingUserId)

  await acceptingUserConn.save()
  await senderUserConn.save()

  res.status(200).json({
    message: 'Connection request accepted successfully',
    userConn: acceptingUserConn,
    targetConn: senderUserConn,
  })
})

// New routes go here


// Start Server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
