const mongoose = require('mongoose');

const petitionSchema =  mongoose.Schema(
    {
        petitionName: String,
        // signatureId: TBD,
        // data: TBD
    }
)

const Petition = mongoose.model('Petition', petitionSchema);

module.exports = Petition;