import User from "../models/user.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; 

        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      phone,
      address,
      city,
      state,
      country,
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};

    // ✅ NAME (strict validation)
    if (name !== undefined) {
      const trimmedName = name?.trim();

      if (!trimmedName) {
        return res.status(400).json({
          message: "Name cannot be empty"
        });
      }

      updateData.name = trimmedName;
    }

    // ✅ OPTIONAL FIELDS (allow empty & null)
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;

    // 📸 PROFILE IMAGE
    if (req.file) {
        const filePath = `uploads/employeeImg/${req.file.filename}`;

        const fullUrl = `${req.protocol}://${req.get("host")}/${filePath}`;

        updateData.profileImage = fullUrl;
    }

    // 🔐 PASSWORD CHANGE
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect"
        });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 🚀 UPDATE ONLY CHANGED FIELDS
    await user.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,  
        role: user.role,    
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};