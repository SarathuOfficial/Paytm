// backend/routes/user.js
const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})


router.post("/signin", async (req, res) => {
    const parsedBody = signinBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token,
        });
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    });
});


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader; // Extract token from Authorization header

    if (!token) return res.sendStatus(401); // If token is not provided, send 401 Unauthorized status

    jwt.verify(token, JWT_SECRET, async(err, decoded) => {
        if (err) return res.sendStatus(403); // If token is invalid, send 403 Forbidden status

        try {
            // Fetch the user from the database using the userId from the decoded token
            const user = await User.findById(decoded.userId);
            if (!user) return res.sendStatus(404); // If user is not found, send 404 Not Found status

            req.user = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.username
            }; // Set user details in the request object
            next(); // Move to the next middleware or route handler
        } catch (err) {
            console.error(err);
            res.sendStatus(500); // Send 500 Internal Server Error status if there's a database error
        }
    });
};

// Route to get the authenticated user's details
router.get("/me", authenticateToken, (req, res) => {
    res.json({
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.username
    });
});

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;