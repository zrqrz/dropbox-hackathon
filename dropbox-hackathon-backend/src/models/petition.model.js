const mongoose = require('mongoose');

const petitionSchema =  mongoose.Schema(
    {
        petitionName: String,
        signRequestId: String,
        signatures: [
            {   
                signatureId: String,
                isUsed: Boolean
            }
        ],
        data: String
    }
);


const Petition = mongoose.model('Petition', petitionSchema);

module.exports = Petition;