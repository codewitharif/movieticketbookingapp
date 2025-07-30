const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    showDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(date) {
          return date >= new Date().setHours(0, 0, 0, 0);
        },
        message: "Show date cannot be in the past"
      }
    },
    showTime: {
      type: String,
      required: true,
      trim: true,
    },
    showPrice: {
      type: Number,
      required: true,
      min: [1, "Show price must be at least 1"],
    },
    occupiedSeats: {
      type: Object,
      default: {},
    },
    totalSeats: {
      type: Number,
      default: 100, // Default theater capacity
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'sold-out'],
      default: 'active'
    }
  },
  {
    timestamps: true,
  }
);

// Compound unique index - No duplicate shows for same movie, date, time
ShowSchema.index(
  { movie: 1, showDate: 1, showTime: 1 }, 
  { unique: true }
);

// Other performance indexes
ShowSchema.index({ showDate: 1 });
ShowSchema.index({ movie: 1 });
ShowSchema.index({ status: 1 });
ShowSchema.index({ showDate: 1, status: 1 });

// Virtual for available seats count
ShowSchema.virtual('availableSeats').get(function() {
  const occupiedCount = Object.keys(this.occupiedSeats).length;
  return this.totalSeats - occupiedCount;
});

// Virtual for checking if show is sold out
ShowSchema.virtual('isSoldOut').get(function() {
  return this.availableSeats === 0;
});

// Static method to find shows by movie and date range
ShowSchema.statics.findByMovieAndDateRange = function(movieId, startDate, endDate) {
  return this.find({
    movie: movieId,
    showDate: {
      $gte: startDate,
      $lte: endDate,
    },
    status: 'active'
  }).populate("movie");
};

// Static method to check if a specific show time is available
ShowSchema.statics.isTimeSlotAvailable = async function(movieId, date, time) {
  const existingShow = await this.findOne({
    movie: movieId,
    showDate: new Date(date),
    showTime: time,
  });
  
  return !existingShow;
};


// Instance method to book a seat
ShowSchema.methods.bookSeat = function(seatNumber) {
  if (this.occupiedSeats[seatNumber]) {
    throw new Error('Seat already booked');
  }
  
  if (this.status !== 'active') {
    throw new Error('Show is not active');
  }
  
  this.occupiedSeats[seatNumber] = true;
  
  // Auto update status to sold-out if all seats booked
  if (this.availableSeats <= 1) { // -1 because we just booked one
    this.status = 'sold-out';
  }
  
  return this.save();
};

// Instance method to cancel seat booking
ShowSchema.methods.cancelSeat = function(seatNumber) {
  if (!this.occupiedSeats[seatNumber]) {
    throw new Error('Seat is not booked');
  }
  
  delete this.occupiedSeats[seatNumber];
  
  // Change status back to active if it was sold-out
  if (this.status === 'sold-out') {
    this.status = 'active';
  }
  
  return this.save();
};

// Pre-save middleware
ShowSchema.pre('save', function(next) {
  // Auto-update status based on available seats
  if (this.availableSeats === 0 && this.status === 'active') {
    this.status = 'sold-out';
  }
  next();
});

module.exports = mongoose.model("Show", ShowSchema);