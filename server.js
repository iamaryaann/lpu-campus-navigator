const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Get complete campus data
app.get('/api/data', (req, res) => {
  try {
    const db = readDB();
    res.json(db);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read database', details: err.message });
  }
});

// Submit a new Mess Review & Rating
app.post('/api/reviews', (req, res) => {
  try {
    const { messId, studentName, rating, mealType, comment } = req.body;
    if (!messId || !studentName || !rating || !comment) {
      return res.status(400).json({ error: 'Please fill all required review fields.' });
    }

    const db = readDB();
    const mess = db.messes.find((m) => m.id === messId);
    if (!mess) {
      return res.status(404).json({ error: 'Mess not found' });
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating)));
    const newReview = {
      id: 'rev-' + Date.now(),
      messId,
      studentName: studentName.trim(),
      rating: numericRating,
      mealType: mealType || 'Dinner',
      comment: comment.trim(),
      timestamp: 'Just now'
    };

    db.reviews.unshift(newReview);

    // Recalculate weighted average rating
    const totalScore = mess.rating * mess.reviewCount + numericRating;
    mess.reviewCount += 1;
    mess.rating = Number((totalScore / mess.reviewCount).toFixed(1));

    writeDB(db);
    res.status(201).json({ review: newReview, updatedMess: mess });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save review', details: err.message });
  }
});

// Update Live Crowd Status for a Mess
app.post('/api/messes/:id/crowd', (req, res) => {
  try {
    const { id } = req.params;
    const { crowdStatus, crowdPercent } = req.body;

    const db = readDB();
    const mess = db.messes.find((m) => m.id === id);
    if (!mess) {
      return res.status(404).json({ error: 'Mess not found' });
    }

    if (crowdStatus) mess.crowdStatus = crowdStatus;
    if (crowdPercent !== undefined) mess.crowdPercent = Number(crowdPercent);

    writeDB(db);
    res.json({ updatedMess: mess });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update crowd status', details: err.message });
  }
});

// Update Mess Menu for a specific Day or Today's Special
app.post('/api/messes/:id/menu', (req, res) => {
  try {
    const { id } = req.params;
    const { day, breakfast, lunch, snacks, dinner, specialToday } = req.body;

    const db = readDB();
    const mess = db.messes.find((m) => m.id === id);
    if (!mess) {
      return res.status(404).json({ error: 'Mess not found' });
    }

    if (day && mess.weeklyMenu[day]) {
      if (breakfast) mess.weeklyMenu[day].breakfast = breakfast;
      if (lunch) mess.weeklyMenu[day].lunch = lunch;
      if (snacks) mess.weeklyMenu[day].snacks = snacks;
      if (dinner) mess.weeklyMenu[day].dinner = dinner;
    }
    if (specialToday) {
      mess.specialToday = specialToday;
    }

    writeDB(db);
    res.json({ updatedMess: mess });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update menu', details: err.message });
  }
});

// Upvote / Crave a Zomato-style Signature Dish
app.post('/api/dishes/:dishId/vote', (req, res) => {
  try {
    const { dishId } = req.params;
    const db = readDB();
    let foundDish = null;

    for (const mess of db.messes) {
      if (mess.signatureDishes) {
        const d = mess.signatureDishes.find((item) => item.id === dishId);
        if (d) {
          d.votes = (d.votes || 100) + 1;
          foundDish = d;
          break;
        }
      }
    }

    if (!foundDish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    writeDB(db);
    res.json({ dish: foundDish });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upvote dish', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`LPU Campus Hub Server running at http://localhost:${PORT}`);
});
