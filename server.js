import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
app.use('/images', express.static('images'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Resume Schema
const resumeSchema = new mongoose.Schema({
  resumeUrl: {type: String, required: true, unique: true},
  belongsToUser: {type: String, required: true, unique: true},
})
const Resume = mongoose.model('Resume', resumeSchema)

// Avatar Picture Schema
const avatarSchema = new mongoose.Schema({
  avatarUrl: {type: String, required: true, unique: true},
  belongsToUser: {type: String, required: true, unique: true},
})
const Avatar = mongoose.model('Avatar', avatarSchema)

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ email, password: hashedPassword });
        await user.save();

        const userForToken = {
          userId: user._id,
          password: user.password
        }

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({token, message: 'User registered successfully', });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const userForToken = {
          userId: user._id,
          password: user.password
        }

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Users Routes
app.get('/api/users', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// Search Users Logic
app.get('/api/search-users', async (req, res) => {
    try {
      const { query } = req.query;
  
      if (!query) {
        return res.json([]);
      }
  
      const users = await User.find({
        name: { $regex: query, $options: "i" },
      });
  
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });  

// Handle Upload Resume Logic 
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
})

const upload = multer({ storage: fileStorageEngine });

// Resume Routes
app.get('/api/resume', async (req, res) => {
  const authenticationHeader = req.headers['authorization']
  const token = authenticationHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const resume = await Resume.findOne({belongsToUser: decoded.userId})

  if (!resume) {
    console.log('The user has no resume')
    return
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

app.get('/api/resumes/:id', async (req, res) => {
  const userId = req.params.id
  const resume = await Resume.findOne({belongsToUser: userId})
  
  if (!resume) {
    res.json({error: 'User does not exist'})
    return
  }

  res.json({path: resume.resumeUrl})
})

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
