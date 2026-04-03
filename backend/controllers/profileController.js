import User from "../models/user.js";
import bcrypt from "bcrypt";
import ActivityLog from "../models/activitylogs.js";

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

    const oldData = {
      name: user.name,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      profileImage: user.profileImage,
    };

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

    const changes = [];

    if (updateData.name && updateData.name !== oldData.name)
      changes.push(`name: ${oldData.name} → ${updateData.name}`);

    if (updateData.phone !== undefined && updateData.phone !== oldData.phone)
      changes.push(`phone: ${oldData.phone || "empty"} → ${updateData.phone || "empty"}`);

    if (updateData.address !== undefined && updateData.address !== oldData.address)
      changes.push(`address: ${oldData.address || "empty"} → ${updateData.address || "empty"}`);

    if (updateData.city !== undefined && updateData.city !== oldData.city)
      changes.push(`city: ${oldData.city || "empty"} → ${updateData.city || "empty"}`);

    if (updateData.state !== undefined && updateData.state !== oldData.state)
      changes.push(`state: ${oldData.state || "empty"} → ${updateData.state || "empty"}`);

    if (updateData.country !== undefined && updateData.country !== oldData.country)
      changes.push(`country: ${oldData.country || "empty"} → ${updateData.country || "empty"}`);

    if (updateData.profileImage) {
      changes.push(
        oldData.profileImage
          ? `profile picture: changed to new picture`
          : `profile picture: added`
      );
    }

    if (updateData.password) changes.push(`password: changed`);

    if (changes.length > 0) {
      await ActivityLog.create({
        userId,
        userRole: req.user.role,
        action: "PROFILE_UPDATED",
        entityType: "user",
        description: `${user.name} updated their profile`,
        metadata: changes.join(" | "),
      });
    }

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