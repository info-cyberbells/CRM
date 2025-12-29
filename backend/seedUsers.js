// import sequelize from "./config/db.js";
// import User from "./models/user.js";
// import { faker } from "@faker-js/faker";4
// import bcrypt from "bcryptjs";

// async function seedUsers() {
//   try {
//     await sequelize.sync({ force: true }); // Drops table if exists and recreates
    
//     const totalUsers = 10000;
//     const batchSize = 1000;
//     const batches = Math.ceil(totalUsers / batchSize);
    
//     // Set to track used emails to ensure uniqueness
//     const usedEmails = new Set();
    
//     console.log(`Starting to insert ${totalUsers} users in ${batches} batches of ${batchSize}...`);
    
//     for (let batch = 0; batch < batches; batch++) {
//       const users = [];
//       const currentBatchSize = Math.min(batchSize, totalUsers - (batch * batchSize));
      
//       console.log(`Generating batch ${batch + 1}/${batches} with ${currentBatchSize} users...`);
      
//       for (let i = 0; i < currentBatchSize; i++) {
//         // Generate unique email
//         let email;
//         do {
//           email = faker.internet.email();
//         } while (usedEmails.has(email));
        
//         usedEmails.add(email);
        
//         const plainPassword = faker.internet.password({ length: 10 });
//         const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
//         users.push({
//           name: faker.person.fullName(),
//           email: email,
//           password: hashedPassword,
//           role: faker.helpers.arrayElement(["Admin", "Sale", "Tech"]),
//           phone: faker.phone.number(),
//           address: faker.location.streetAddress(),
//           city: faker.location.city(),
//           state: faker.location.state(),
//           country: faker.location.country(),
//           isActive: faker.datatype.boolean(),
//           createdAt: faker.date.past(),
//           updatedAt: new Date(),
//         });
//       }

//       await User.bulkCreate(users);
//       console.log(`✅ Batch ${batch + 1}/${batches} inserted successfully! (${Math.min((batch + 1) * batchSize, totalUsers)} total users so far)`);
//     }
    
//     // Verify the count
//     const count = await User.count();
//     console.log(`🎉 All done! Total users in database: ${count}`);
    
//     process.exit(0);
//   } catch (error) {
//     console.error("Error seeding users:", error);
//     process.exit(1);
//   }
// }

// seedUsers();