const Visitor = require('../models/Visitor');

const addVisitor = async (req, res) => {
  const { name, phone, email, proofId, vehicleType, vehicleNumber, purposeOfVisit } = req.body;

  try {
    const photoPath = req.file.path; // Retrieve the path of the uploaded photo

    const newVisitor = new Visitor({
      name,
      phone,
      email,
      proofId,
      vehicleType,
      vehicleNumber,
      purposeOfVisit,
      photo: photoPath, // Save the path in the photo field
      checkIn: new Date(), // Store the current date and time as a Date object
    });

    await newVisitor.save();
    res.json({ message: 'Visitor added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateVisitor = async (req, res) => {
  const { visitorId } = req.params;
  const { name, phone, email, proofId, vehicleType, vehicleNumber, purposeOfVisit, photo } = req.body;

  try {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    const updateData = {
      name,
      phone,
      email,
      proofId,
      vehicleType,
      vehicleNumber,
      purposeOfVisit,
      photo: visitor.photo,
    };

    if (photo !== undefined && photo.trim() !== '') {
      updateData.photo = photo;
    }

    await Visitor.updateOne({ _id: visitorId }, updateData);

    res.json({ message: 'Visitor record updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().select('-password').sort({ createdAt: -1 });

    res.json(visitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchVisitors = async (req, res) => {
  const { q } = req.query;

  try {
    const searchResults = await Visitor.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const checkoutVisitor = async (req, res) => {
  const { visitorId } = req.params;

  try {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    visitor.checkOut = new Date();
    visitor.outTime = visitor.checkOut; // Update the outTime field as well
    await visitor.save();

    res.json({ message: 'Visitor check-out updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteVisitor = async (req, res) => {
  const { visitorId } = req.params;

  try {
    const result = await Visitor.deleteOne({ _id: visitorId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addVisitor, updateVisitor, getVisitors, searchVisitors, checkoutVisitor, deleteVisitor, };