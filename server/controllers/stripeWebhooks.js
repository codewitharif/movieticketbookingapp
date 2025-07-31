const Stripe = require("stripe");
const Booking = require("../models/booking");
const { inngest } = require("../inngest/index");

exports.stripeWebhhoks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("❌ Stripe signature error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { bookingId } = session.metadata;

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });

        // send confirmation email

        console.log("📤 Sending email event for booking:", bookingId);
        await inngest.send({
          name: "app/show.booked",
          data: { bookingId },
        });
        console.log("✅ Email event sent to Inngest");
        break;
      }

      default:
        console.log("unhandeled event type :", event.type);
    }
    return res.json({ received: true });
  } catch (error) {
    console.log("webhook processing error", error);
    return res.status(500).send("Internal server error");
  }
};
