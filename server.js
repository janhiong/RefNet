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

// Connections Route
app.get('/api/check-connection-status', async (req, res) => {
  const authenticationHeader = req.headers['authorization']

  if (!authenticationHeader) {
    return res.status(401).json({ error: 'No authorization header' })
  }

  const token = authenticationHeader.split(' ')[1]
  let decoded

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const { targetUserId } = req.query
  const currentUserId = decoded.userId

  if (currentUserId === targetUserId) {
    return res.status(400).json({ error: 'Cannot check connection status with yourself' })
  }

  let userConn = await Connection.findOne({ belongsTo: currentUserId })
  let targetConn = await Connection.findOne({ belongsTo: targetUserId })

  if (!userConn || !targetConn) {
    return res.status(404).json({ error: 'Connection data not found' })
  }

  const isConnected = userConn.connected.includes(targetUserId)
  const isPending = userConn.pending.includes(targetUserId)
  const hasSent = userConn.sent.includes(targetUserId)

  res.json({
    isConnected,
    isPending,
    hasSent,
    message: isConnected
      ? 'Users are connected'
      : isPending
      ? 'Connection request is pending'
      : hasSent
      ? 'Connection request has been sent'
      : 'No connection request sent'
  })
})

app.post('/api/toggle-connection', async (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Missing token' })

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }

  const { targetUserId } = req.body
  const currentUserId = decoded.userId

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: 'Cannot connect to yourself' })
  }

  let userConn = await Connection.findOne({ belongsTo: currentUserId })
  let targetConn = await Connection.findOne({ belongsTo: targetUserId })

  if (!userConn) {
    userConn = new Connection({ belongsTo: currentUserId, connected: [], sent: [], pending: [] })
  }

  if (!targetConn) {
    targetConn = new Connection({ belongsTo: targetUserId, connected: [], sent: [], pending: [] })
  }

  const isConnected = userConn.connected.includes(targetUserId)
  const isPending = userConn.pending.includes(targetUserId)
  const hasSent = userConn.sent.includes(targetUserId)

  if (isConnected) {
    userConn.connected = userConn.connected.filter(id => id !== targetUserId)
    targetConn.connected = targetConn.connected.filter(id => id !== currentUserId)
    await userConn.save()
    await targetConn.save()

    return res.status(200).json({ message: 'Connection removed', userConn, targetConn })
  }

  if (isPending) {
    userConn.pending = userConn.pending.filter(id => id !== targetUserId)
    userConn.connected.push(targetUserId)

    targetConn.sent = targetConn.sent.filter(id => id !== currentUserId)
    targetConn.connected.push(currentUserId)

    await userConn.save()
    await targetConn.save()

    return res.status(200).json({ message: 'Connection request accepted', userConn, targetConn })
  }

  if (hasSent) {
    userConn.sent = userConn.sent.filter(id => id !== targetUserId)
    targetConn.pending = targetConn.pending.filter(id => id !== currentUserId)

    await userConn.save()
    await targetConn.save()

    return res.status(200).json({ message: 'Connection request cancelled', userConn, targetConn })
  }

  userConn.sent.push(targetUserId)
  targetConn.pending.push(currentUserId)

  await userConn.save()
  await targetConn.save()

  res.status(200).json({ message: 'Connection request sent', userConn, targetConn })
})

app.get('/api/my-connections', async (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Missing token' })
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }

  const currentUserId = decoded.userId

  const connection = await Connection.findOne({ belongsTo: currentUserId })

  if (!connection) {
    return res.json({
      connected: [],
      sent: [],
      pending: []
    })
  }

  res.json({
    connected: connection.connected,
    sent: connection.sent,
    pending: connection.pending
  })
})



// New routes go here


// Start Server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
