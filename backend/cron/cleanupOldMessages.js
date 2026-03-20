import cron from "node-cron";
import Message from "../models/Message.js";
import { Op } from "sequelize";

export default function cleanupJob() {
    cron.schedule("0 9 * * *", async () => {
        try {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const deleted = await Message.destroy({
                where: {
                    sent_at: { [Op.lt]: sixMonthsAgo },
                },
            });

            console.log(`🧹 Cleanup: deleted ${deleted} messages older than 6 months`);
        } catch (err) {
            console.error("❌ Cleanup job error:", err.message);
        }
    });
}