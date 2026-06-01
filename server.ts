import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// -------------------------------------------------------------------------
// SERVER INITIALIZATION & DISK DATABASE ENGINE (SIMULATED MONGODB COLLECTIONS)
// -------------------------------------------------------------------------
// This replaces MongoDB using simple read/write JSON operations to disk, 
// making it 100% durable, zero-install, and readable for 4th graders and teaching!

const DB_FILE = path.join(process.cwd(), "db_chefdoor.json");

interface DbData {
  users: any[];
  chefs: any[];
  bookings: any[];
}

const DEFAULT_CHEFS = [
  {
    id: "chef-1",
    name: "Chef Priya Nair",
    photoUrl: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    specialties: ["South Indian Tiffin", "Traditional Malabar Festivities", "Rayalaseema Ragi Sangati", "Nattu Kodi Kura", "Filter Coffee Delights"],
    pricePerHour: 550,
    experience: 8,
    serviceArea: "Indiranagar, Bengaluru",
    about: "With over 8 years of culinary excellence in high-end southern bistros, I bring authentic South Indian, Andhra, and signature Rayalaseema taste profiles directly to your home kitchen using freshly ground organic spices.",
    reviews: [
      { id: "r-1", userName: "Aditya Goel", rating: 5, comment: "Chef Priya curated an exquisite traditional Malabar dinner for our leadership team. Outstanding curation and hygiene!", date: "2026-05-15" },
      { id: "r-2", userName: "Ritu Sen", rating: 5, comment: "Exceptionally neat, precise, and polite. Loved the organic filter coffee setup!", date: "2026-05-20" }
    ]
  },
  {
    id: "chef-2",
    name: "Chef Anand Raju",
    photoUrl: "https://images.unsplash.com/photo-1577219491130-c838527e57be?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    specialties: ["Nellore Chepala Pulusu", "Rayalaseema Natukodi Pulusu", "Gongura Chicken Curry", "Andhra Thali Meals"],
    pricePerHour: 650,
    experience: 12,
    serviceArea: "Gachibowli, Hyderabad",
    about: "Native expert of Andhra and Rayalaseema hot grills and state dinner banquets. Bringing spicy rustic flavors, organic farm-fresh preparation, and top professional kitchen hygiene standard to your events.",
    reviews: [
      { id: "r-3", userName: "Vikram Malhotra", rating: 5, comment: "The slow-cooked Nellore Pulusu was absolutely sensational. Highly professional kitchen setup.", date: "2026-05-12" }
    ]
  },
  {
    id: "chef-3",
    name: "Chef Kavitha Reddy",
    photoUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    specialties: ["Andhra Gongura Delicacies", "Hyderabadi Dum Handi", "Rayalaseema Spice Delights", "Organic Millets Healthy Meals"],
    pricePerHour: 450,
    experience: 5,
    serviceArea: "Kundanbagh, Hyderabad",
    about: "Certified nutrition consultant and executive chef covering Rayalaseema and Andhra specialties. Focuses on regional wholesome grains, natural cold-pressed oil, and ancestral spice blends.",
    reviews: [
      { id: "r-4", userName: "Nikhil Joshi", rating: 5, comment: "Superb healthy millet bowls and Andhra style. Exactly the diet-specific local catering we were searching for.", date: "2026-05-22" }
    ]
  },
  {
    id: "chef-4",
    name: "Chef Rajesh Srinivasan",
    photoUrl: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=400&auto=format&fit=crop&q=80",
    rating: 5.0,
    specialties: ["South Indian Fusion", "Guntur Chilli Sizzlers", "Coorg Pandi Curry Deluxe", "Ambur Biryani Specialties"],
    pricePerHour: 750,
    experience: 15,
    serviceArea: "Jayanagar, Bengaluru",
    about: "Over 15 years as premium executive sous chef. Unmatched skill in organizing large-scale regional South Indian, Coorg, and elite Tamilian Ambur wedding banquets directly inside your private kitchen.",
    reviews: [
      { id: "r-5", userName: "Siddharth Mehra", rating: 5, comment: "The South Indian fusion entrees are of international standard. Exceptionally clean and professional cutting boards.", date: "2026-05-28" }
    ]
  }
];

function initDatabase(): DbData {
  if (fs.existsSync(DB_FILE)) {
    try {
      const existing = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(existing);
      if (parsed.users && parsed.chefs && parsed.bookings) {
        return parsed;
      }
    } catch (e) {
      console.error("Database reading error, resetting with default data:", e);
    }
  }

  const initialData: DbData = {
    users: [
      { id: "demo-user", email: "ananya@chefdoor.in", name: "Ananya Iyer", password: "123", role: "User" },
      { id: "demo-chef", email: "priya@chefdoor.in", name: "Chef Priya Nair", password: "123", role: "Chef", chefProfileId: "chef-1" }
    ],
    chefs: DEFAULT_CHEFS,
    bookings: [
      {
        id: "booking-1",
        userId: "demo-user",
        userName: "Ananya Iyer",
        chefId: "chef-1",
        chefName: "Chef Priya Nair",
        cookingType: "Weekend Family Celebration",
        date: "2026-06-05",
        startTime: "13:00",
        duration: 3,
        address: "7th Cross Road, Indiranagar, Bengaluru, KA 560038",
        specialInstructions: "Please use native Malabar stone-ground spices and minimize refined oils.",
        totalPrice: 1650,
        status: "Pending",
        paymentMethod: "UPI",
        paymentStatus: "Unpaid"
      }
    ]
  };

  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(data: DbData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Could not write database to disk:", error);
  }
}

let db = initDatabase();

// -------------------------------------------------------------------------
// EXPRESS APP CONFIG & MIDDLEWARE
// -------------------------------------------------------------------------
async function runServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple static API status check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date().toISOString() });
  });

  // Auth: Register
  app.post("/api/auth/register", (req, res) => {
    const { email, name, password, role, isNewChef, specialties, pricePerHour, experience, serviceArea, about } = req.body;
    
    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: "Please write all the information in the fields!" });
    }

    const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "A helper with this email already exists!" });
    }

    const userId = "u-" + Math.random().toString(36).substring(2, 9);
    const newUser: any = {
      id: userId,
      email: email.toLowerCase(),
      name,
      password,
      role
    };

    if (role === "Chef") {
      const chefId = "chef-" + Math.random().toString(36).substring(2, 9);
      const newChefProfile = {
        id: chefId,
        name,
        photoUrl: `https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80`, // Defaults to Maya's avatar, client can change
        rating: 5.0,
        specialties: specialties || ["Family Favourites"],
        pricePerHour: Number(pricePerHour) || 20,
        experience: Number(experience) || 1,
        serviceArea: serviceArea || "Anywhere",
        about: about || "Passionate local home cook waiting to share sweet recipes!",
        reviews: []
      };

      db.chefs.push(newChefProfile);
      newUser.chefProfileId = chefId;
    }

    db.users.push(newUser);
    saveDatabase(db);

    // Don't return password
    const { password: _, ...cleanUser } = newUser;
    res.status(201).json({ user: cleanUser });
  });

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Tell us both your email and password!" });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return res.status(400).json({ error: "The email or password didn't match. Ask your tutor if you forgot!" });
    }

    const { password: _, ...cleanUser } = user;
    res.json({ user: cleanUser });
  });

  // Get all chefs
  app.get("/api/chefs", (req, res) => {
    res.json(db.chefs);
  });

  // Get individual chef by ID
  app.get("/api/chefs/:id", (req, res) => {
    const chef = db.chefs.find(c => c.id === req.params.id);
    if (!chef) {
      return res.status(404).json({ error: "Oh no! Chef not found on our planet." });
    }
    res.json(chef);
  });

  // Update Chef Profile Specialties/Details
  app.put("/api/chefs/:id", (req, res) => {
    const { specialties, pricePerHour, experience, serviceArea, about, name, photoUrl } = req.body;
    const chefIndex = db.chefs.findIndex(c => c.id === req.params.id);
    if (chefIndex === -1) {
      return res.status(404).json({ error: "Chef not found." });
    }

    const currentChef = db.chefs[chefIndex];
    db.chefs[chefIndex] = {
      ...currentChef,
      name: name || currentChef.name,
      photoUrl: photoUrl || currentChef.photoUrl,
      specialties: specialties || currentChef.specialties,
      pricePerHour: Number(pricePerHour) || currentChef.pricePerHour,
      experience: Number(experience) || currentChef.experience,
      serviceArea: serviceArea || currentChef.serviceArea,
      about: about || currentChef.about
    };

    saveDatabase(db);
    res.json(db.chefs[chefIndex]);
  });

  // Create a Booking request
  app.post("/api/bookings", (req, res) => {
    const { userId, userName, chefId, chefName, cookingType, date, startTime, duration, address, specialInstructions, totalPrice } = req.body;
    
    if (!userId || !chefId || !cookingType || !date || !startTime || !duration || !address) {
      return res.status(400).json({ error: "Missing simple booking details. Make sure you filled everything!" });
    }

    const newBooking = {
      id: "booking-" + Math.random().toString(36).substring(2, 9),
      userId,
      userName,
      chefId,
      chefName,
      cookingType,
      date,
      startTime,
      duration: Number(duration),
      address,
      specialInstructions: specialInstructions || "",
      totalPrice: Number(totalPrice),
      status: "Pending" as const,
      paymentMethod: "UPI",
      paymentStatus: "Unpaid" as const
    };

    db.bookings.push(newBooking);
    saveDatabase(db);

    res.status(201).json(newBooking);
  });

  // Get Bookings for a User or Chef
  app.get("/api/bookings", (req, res) => {
    const { userId, chefId } = req.query;
    let filtered = db.bookings;

    if (userId) {
      filtered = filtered.filter(b => b.userId === userId);
    } else if (chefId) {
      filtered = filtered.filter(b => b.chefId === chefId);
    }

    res.json(filtered);
  });

  // Update Booking Status / Payments / Ratings
  app.put("/api/bookings/:id", (req, res) => {
    const { status, paymentMethod, paymentStatus, rating, comment } = req.body;
    const bookingIndex = db.bookings.findIndex(b => b.id === req.params.id);
    if (bookingIndex === -1) {
      return res.status(404).json({ error: "Booking not found." });
    }

    const booking = db.bookings[bookingIndex];

    if (status) {
      booking.status = status;
    }
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }
    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    // Handlers rating after service completed
    if (rating && comment) {
      booking.ratingGiven = Number(rating);
      
      // Also inject the review to the corresponding Chef's profile
      const chef = db.chefs.find(c => c.id === booking.chefId);
      if (chef) {
        const newReview = {
          id: "r-" + Math.random().toString(36).substring(2, 9),
          userName: booking.userName,
          rating: Number(rating),
          comment,
          date: new Date().toISOString().split("T")[0]
        };
        chef.reviews = chef.reviews || [];
        chef.reviews.push(newReview);

        // Compute average rating
        const sum = chef.reviews.reduce((acc, r) => acc + r.rating, 0);
        chef.rating = Number((sum / chef.reviews.length).toFixed(1));
      }
    }

    db.bookings[bookingIndex] = booking;
    saveDatabase(db);
    res.json(booking);
  });

  // Force database state re-seed (ideal for quick prototype resetting)
  app.post("/api/seed/reset", (req, res) => {
    db = {
      users: [
        { id: "demo-user", email: "ananya@chefdoor.in", name: "Ananya Iyer", password: "123", role: "User" },
        { id: "demo-chef", email: "priya@chefdoor.in", name: "Chef Priya Nair", password: "123", role: "Chef", chefProfileId: "chef-1" }
      ],
      chefs: DEFAULT_CHEFS,
      bookings: [
        {
          id: "booking-1",
          userId: "demo-user",
          userName: "Ananya Iyer",
          chefId: "chef-1",
          chefName: "Chef Priya Nair",
          cookingType: "Weekend Family Celebration",
          date: "2026-06-05",
          startTime: "13:00",
          duration: 3,
          address: "7th Cross Road, Indiranagar, Bengaluru, KA 560038",
          specialInstructions: "Please use native Malabar stone-ground spices and minimize refined oils.",
          totalPrice: 1650,
          status: "Pending",
          paymentMethod: "UPI",
          paymentStatus: "Unpaid"
        }
      ]
    };
    saveDatabase(db);
    res.json({ message: "Successfully reset database to clean starting state", db });
  });

  // -------------------------------------------------------------------------
  // DEV MIDDLEWARE & PRODUCTION STATIC SERVING
  // -------------------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ChefDoor Backend server running on http://localhost:${PORT}`);
  });
}

runServer();
