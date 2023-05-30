const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    proofId: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    purposeOfVisit: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
  },
  { timestamps: true }
);

visitorSchema.methods.updateVisitor = async function (updateData) {
  try {
    if (updateData.photo) {
      // Update the visitor's photo if provided in the updateData
      this.photo = updateData.photo;
    }

    this.name = updateData.name;
    this.phone = updateData.phone;
    this.email = updateData.email;
    this.proofId = updateData.proofId;
    this.vehicleType = updateData.vehicleType;
    this.vehicleNumber = updateData.vehicleNumber;
    this.purposeOfVisit = updateData.purposeOfVisit;

    const validationErrors = this.validateSync(); // Check for validation errors

    if (validationErrors) {
      console.log('Validation errors:', validationErrors);
      throw new Error('Visitor validation failed');
    }

    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error occurred while updating visitor');
  }
};

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;