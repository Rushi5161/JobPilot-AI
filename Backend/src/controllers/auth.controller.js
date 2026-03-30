const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

function createJWT(user) {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET || "default-secret",
    { expiresIn: "1d" }
  )
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email and password are required",
      })
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    })

    if (isUserAlreadyExists) {
      return res.status(409).json({
        message: "Account already exists with this email address or username",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    })

    const token = createJWT(user)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("registerUserController error", error)

    if (error.name === "ValidationError" || error.code === 11000) {
      const duplicateField = error.keyValue ? Object.keys(error.keyValue)[0] : "email/username"
      return res.status(400).json({
        message: error.message || `Invalid or duplicate ${duplicateField}`,
      })
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    })
  }
}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      })
    }

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    const token = createJWT(user)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("loginUserController error", error)
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    })
  }
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token

    if (token) {
      await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    return res.status(200).json({
      message: "User logged out successfully",
    })
  } catch (error) {
    console.error("logoutUserController error", error)
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    })
  }
}


/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
  try {
    const user = await userModel.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("getMeController error", error)
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    })
  }
}


module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)



    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}