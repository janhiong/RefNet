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
  belongsToUser: {type: String, required: true},
})
const Resume = mongoose.model('Resume', resumeSchema)

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

        res.status(201).json({ message: 'User registered successfully' });
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
          email: user.email,
          password: user.password
        }

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });
        const id = user._id

        res.json({ token, id, user: { email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

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

app.get('/api/resumes:id'), async (req, res) => {
  return res.status(200)
}

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

// Resume Route
app.post('/api/upload-resume', upload.single('image'), async (req, res) => {
  const authenticationHeader = req.headers['authorization']
  const token = authenticationHeader.split(' ')[1]
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const resumeUrl = await req.file.path

  await Resume.create({
    resumeUrl,
    belongsToUser: decoded.email,
  })

  res.json({path: resumeUrl})
})

app.get('/api/resumes', async (req, res) => {
  const resumes = await Resume.find({}) 
  res.json(resumes)
})

app.get('/api/users', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
