import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, city, state, country } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      city,
      state,
      country,
    });

    const { password: _, ...userData } = user.toJSON();

    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// CREATE AGENT BY ADMIN
export const createAgent = async (req, res) => {
  try {
    
    const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1] || req.headers.authtoken;

    if(!token){
      return res.status(401).json({success: false, message: "No token provided"});
    }

    let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

     if (decoded.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can create agents"
            });
        }
        
      const { name, email, password, role, phone, address, city, state, country } = req.body;

      if (!name || !email || !password || !role || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, Email, Password, Phone and Role are required fields"
            });
        }

      if (!["Sale", "Tech"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be Sale or Tech only"
            });
        }

      const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const agent = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            address,
            city,
            state,
            country,
        });

        return res.status(201).json({
            success: true,
            message: "Agent created successfully",
            data: {
                id: agent.id,
                name: agent.name,
                email: agent.email,
                role: agent.role
            }
        });

  } catch (error) {

     return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    
  }
}

// UPDATE USER DETAILS BY ADMIN
export const updateAgentDetails = async (req, res)=>{
  try {
    
    const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1] || req.headers.authtoken;
    
    if(!token){
      return res.status(401).json({success: false, message: "No token provided"});
    }

    let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

      if (decoded.role !== "Admin") {
        return res.status(403).json({
          success: false,
          message: "Only Admin can update agent details"
        });
      }

      const { id } = req.params;

      const { name, email, phone, address, city, state, country } = req.body;

      const agent = await User.findByPk(id);

      if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    if (email && email !== agent.email) {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    await agent.update({
      name: name || agent.name,
      email: email || agent.email,
      phone: phone || agent.phone,
      address: address || agent.address,
      city: city || agent.city,
      state: state || agent.state,
      country: country || agent.country,
    });

    return res.status(200).json({
      success: true,
      message: "Agent updated successfully",
      data: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    })
  }
};

// VIEW AGENT DETAILS BY ADMIN
export const viewAgentDetails = async (req, res) => {
  try {

    const token =
      req.cookies?.authToken ||
      req.headers.authorization?.split(" ")[1] ||
      req.headers.authtoken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    if (decoded.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admin can view agent details"
      });
    }

    const { id } = req.params;

    const agent = await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    if (!["Sale", "Tech"].includes(agent.role)) {
      return res.status(400).json({
        success: false,
        message: "You can only view Sale or Tech agents"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Agent details fetched successfully",
      data: agent
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

// get all agents 
export const getAllAgents = async (req, res) => {
  try {

    const token =
      req.cookies?.authToken ||
      req.headers.authorization?.split(" ")[1] ||
      req.headers.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admin can access this"
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows: agents, count } = await User.findAndCountAll({
      where: {
        role: {
          [Op.in]: ["Sale", "Tech"]
        }
      },
      attributes: { exclude: ["password"] },
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit
      },
      agents
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch agents",
      error: error.message
    });
  }
};