const { Inngest } = require("inngest");
const User = require("../models/user");

// Create Inngest instance
const inngest = new Inngest({ id: "movie-ticket-booking" });

/**
 * Sync user creation from Clerk to MongoDB
 */
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`.trim(),
      image: image_url,
    };

    await User.create(userData);
    console.log("User created in MongoDB:", userData);
    return { success: true };
  }
);

/**
 * Sync user update from Clerk to MongoDB
 */
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedData = {
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`.trim(),
      image: image_url,
    };

    await User.findByIdAndUpdate(id, updatedData, { new: true });
    console.log("User updated in MongoDB:", updatedData);
    return { success: true };
  }
);

/**
 * Sync user deletion from Clerk to MongoDB
 */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
    console.log("User deleted from MongoDB:", id);
    return { success: true };
  }
);

// Export functions
const functions = [syncUserCreation, syncUserUpdate, syncUserDeletion];
module.exports = { inngest, functions };
