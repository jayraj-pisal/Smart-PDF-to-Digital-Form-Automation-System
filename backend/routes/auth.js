const router=require("express").Router();
const db=require("../db");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users(email,password,role) VALUES(?,?,?)",
      [email, hash, "student"]
    );

    res.json({ msg: "User registered successfully" });

  } catch (err) {

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ msg: "Email already exists" });
    }

    console.log(err);
    res.status(500).json({ msg: "Registration error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secret",
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Login error" });
  }
});

module.exports=router;