// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Import custom modules
const connectDB = require('./db/connectDB.js');
const authRoutes = require('./routes/routes.js');
const userRoutes = require('./routes/user.js'); 
const productRoutes = require('./routes/productRoutes');
const itemRoutes = require('./routes/itemroutes');
const managerRoutes = require("./routes/ManagerRoutes.js");
const deliveryPersonRoutes = require('./routes/DeliperRoutes.js');
const tableRoutes = require('./Routes/tableRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
const cartRoutes = require('./routes/CartRoutes.js');
const packagingMaterialsRoutes = require('./routes/packMatRoutes.js');
const packingOrdersRoutes = require('./routes/packOrdRoutes.js');
const complaintsRoutes = require('./routes/complaintRoutes.js');
const returnRoutes = require('./routes/returnRoutes.js');
const AdmincartRoutes = require("./routes/AdminCartRoute.js")
//const AdminRoutes = require("./routes/AdminRoute.js");
//const AdminUserRoutes = require("./routes/AdminUserRoutes.js");
const Admin = require("./models/Admin.js"); // Adjust the path as necessary



// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON and static files
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('uploads'));


// CORS configuration to allow any localhost port in development
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or CURL requests)
      if (!origin) return callback(null, true);

      // Allow localhost origins on any port
      const allowedLocalhostPattern = /^http:\/\/localhost:\d+$/;
      if (allowedLocalhostPattern.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and credentials to be sent with the request
  })
);


// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Enable in production (HTTPS)
      sameSite: "lax", // Adjust based on needs
      maxAge: 10 * 60 * 1000, // 10 minutes session timeout
    },
  })
);

// Route handling
app.use("/api/auth", authRoutes);         // Auth routes
app.use("/api", userRoutes);              // User routes
app.use("/api/items", itemRoutes);        // Item routes
app.use('/api/products', productRoutes);  // Product routes
app.use('/api', tableRoutes);
app.use('/api', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/packaging-materials', packagingMaterialsRoutes);
app.use('/api/packing-orders', packingOrdersRoutes);
app.use("/api/managers", managerRoutes);  // Manager routes (commented out)
app.use('/api/delivery-person', deliveryPersonRoutes);  // Delivery person routes (commented out)
app.use('/api/complaints', complaintsRoutes);
app.use('/api', returnRoutes);
app.use("/api/cartItems",AdmincartRoutes );
//app.use("/api/admin", AdminRoutes);
//app.use("/api/AdUsers", AdminUserRoutes);

// Serve frontend in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve index.html for any other requests
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Connect to the database
connectDB();



//////////////////////////////////////////////////////
// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  contactNo: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("AdminUser", userSchema);

// Admin Registration
app.post("/admin/register", async (req, res) => {
  const { name, role, email, password } = req.body;

  // Validate input fields
  if (!name || !role || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Admin already exists with this email",
        });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      name,
      role,
      email,
      password: hashedPassword,
    });

    // Save admin to the database
    await newAdmin.save();

    // Send success response
    res
      .status(201)
      .json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// Admin Login
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, "secretKey", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err); // Add this line
    res.status(500).json({ error: err.message });
  }
});

// Get all users
app.get("/AdUsers", async (req, res) => {
  const { search, sort } = req.query;
  const query = {};

  if (search) {
    query.name = new RegExp(search, "i"); // Case-insensitive search
  }

  const sortOptions = {};

  if (sort === "asc") {
    sortOptions.name = 1; // Sort by name ascending
  } else if (sort === "desc") {
    sortOptions.name = -1; // Sort by name descending
  } else if (sort === "createdAtAsc") {
    sortOptions.createdAt = 1; // Sort by createdAt ascending
  } else if (sort === "createdAtDesc") {
    sortOptions.createdAt = -1; // Sort by createdAt descending
  }

  try {
    const users = await User.find(query).sort(sortOptions).exec();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
app.delete("/AdUsers/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
///////////////////////////////////////////////////////

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
