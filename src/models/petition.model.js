const mongoose = require('mongoose');

const petitionSchema = mongoose.Schema({
  petitionName: String,
  petitionContent: String,
  signRequestId: String,
  signatures: [
    {
      signatureId: String,
      isUsed: Boolean,
    },
  ],
  data: String,
});

petitionSchema.index({ petitionName: 'text' });

const Petition = mongoose.model('Petition', petitionSchema);

module.exports = Petition;
