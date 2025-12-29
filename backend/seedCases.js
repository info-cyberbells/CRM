// import sequelize from "./config/db.js";
// import User from "./models/user.js";
// import Case from "./models/case.js";
// import { faker } from "@faker-js/faker";

// async function seedCases() {
//   try {
//     // Get all existing users to assign as sale and tech users
//     const users = await User.findAll();
    
//     if (users.length === 0) {
//       console.error("❌ No users found! Please run the user seeder first.");
//       process.exit(1);
//     }
    
//     console.log(`📋 Found ${users.length} users to assign to cases`);
    
//     const totalCases = 10000;
//     const batchSize = 1000;
//     const batches = Math.ceil(totalCases / batchSize);
    
//     // Set to track used customerIDs to ensure uniqueness
//     const usedCustomerIDs = new Set();
    
//     // Predefined arrays for realistic data
//     const operatingSystems = ["Windows 10", "Windows 11", "macOS Monterey", "macOS Ventura", "macOS Big Sur", "Ubuntu 20.04", "Ubuntu 22.04"];
//     const securitySoftwares = ["Norton 360", "McAfee Total Protection", "Bitdefender", "Kaspersky", "Avast", "AVG", "Windows Defender", "Malwarebytes"];
//     const plans = ["Basic Support", "Premium Support", "Ultimate Care", "Business Pro", "Home Essential", "Advanced Security"];
//     const planDurations = ["1 Month", "3 Months", "6 Months", "1 Year", "2 Years"];
//     const modelNumbers = ["HP-Pavilion-15", "Dell-Inspiron-3000", "Lenovo-ThinkPad-E14", "ASUS-VivoBook-15", "Acer-Aspire-5", "MacBook-Pro-13", "MacBook-Air-M1", "Surface-Laptop-4"];
//     const commonIssues = [
//       "Computer running slow",
//       "Virus/Malware infection",
//       "Blue screen of death",
//       "Software installation issues",
//       "Email setup problems",
//       "Internet connectivity issues",
//       "Printer not working",
//       "System crash/freezing",
//       "Data recovery needed",
//       "Password reset required"
//     ];
    
//     console.log(`Starting to insert ${totalCases} cases in ${batches} batches of ${batchSize}...`);
    
//     for (let batch = 0; batch < batches; batch++) {
//       const cases = [];
//       const currentBatchSize = Math.min(batchSize, totalCases - (batch * batchSize));
      
//       console.log(`Generating batch ${batch + 1}/${batches} with ${currentBatchSize} cases...`);
      
//       for (let i = 0; i < currentBatchSize; i++) {
//         // Generate unique customerID
//         let customerID;
//         do {
//           customerID = `CUS${faker.number.int({ min: 100000, max: 999999 })}`;
//         } while (usedCustomerIDs.has(customerID));
        
//         usedCustomerIDs.add(customerID);
        
//         // Random sale and tech users
//         const saleUser = faker.helpers.arrayElement(users);
//         const techUser = faker.helpers.arrayElement(users);
        
//         // Generate validity date (between 1 month to 2 years from now)
//         const validityDate = faker.date.future({ years: 2 });
        
//         cases.push({
//           customerID: customerID,
//           customerName: faker.person.fullName(),
//           phone: faker.phone.number(),
//           altPhone: faker.datatype.boolean(0.3) ? faker.phone.number() : null, // 30% chance of alt phone
//           email: faker.internet.email(),
//           address: faker.location.streetAddress(),
//           city: faker.location.city(),
//           state: faker.location.state(),
//           country: faker.location.country(),
//           remoteID: `REM${faker.number.int({ min: 100000, max: 999999 })}`,
//           remotePass: faker.internet.password({ length: 8 }),
//           operatingSystem: faker.helpers.arrayElement(operatingSystems),
//           computerPass: faker.internet.password({ length: 6 }),
//           issue: faker.helpers.arrayElement(commonIssues),
//           modelNo: faker.helpers.arrayElement(modelNumbers),
//           workToBeDone: `Fix ${faker.helpers.arrayElement(commonIssues).toLowerCase()} and optimize system performance`,
//           specialNotes: faker.datatype.boolean(0.4) ? faker.lorem.sentences(2) : null, // 40% chance of special notes
//           securitySoftware: faker.helpers.arrayElement(securitySoftwares),
//           plan: faker.helpers.arrayElement(plans),
//           planDuration: faker.helpers.arrayElement(planDurations),
//           validity: validityDate,
//           saleAmount: parseFloat(faker.commerce.price({ min: 50, max: 500, dec: 2 })),
//           status: faker.helpers.arrayElement(["Open", "Pending", "Closed", "Void", "Refund", "Chargeback"]),
//           caseDurationTimer: faker.number.int({ min: 0, max: 7200 }), // 0 to 2 hours in seconds
//           saleUserId: saleUser.id,
//           techUserId: techUser.id,
//           createdAt: faker.date.past({ years: 1 }),
//           updatedAt: new Date(),
//         });
//       }

//       await Case.bulkCreate(cases);
//       console.log(`✅ Batch ${batch + 1}/${batches} inserted successfully! (${Math.min((batch + 1) * batchSize, totalCases)} total cases so far)`);
//     }
    
//     // Verify the count
//     const count = await Case.count();
//     console.log(`🎉 All done! Total cases in database: ${count}`);
    
//     // Show some statistics
//     const statusCounts = await Case.findAll({
//       attributes: [
//         'status',
//         [sequelize.fn('COUNT', sequelize.col('status')), 'count']
//       ],
//       group: ['status']
//     });
    
//     console.log('\n📊 Case Status Distribution:');
//     statusCounts.forEach(stat => {
//       console.log(`   ${stat.status}: ${stat.dataValues.count}`);
//     });
    
//     process.exit(0);
//   } catch (error) {
//     console.error("Error seeding cases:", error);
//     process.exit(1);
//   }
// }

// seedCases();