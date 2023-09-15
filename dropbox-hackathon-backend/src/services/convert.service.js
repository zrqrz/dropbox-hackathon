const convertapi = require('convertapi')('aqWlmXYz9a4c9oYt');
const fs = require('fs');

const convertToPDF = async (petition) => {
    fs.writeFile('../dropbox-hackathon-backend/src/temp_files/tmpPetitionFile.txt', petition, function (error) {
        if (error) throw error;
        console.log('Temporory txt file saved in temp_files directory!');
    });
    try {
        const result = await convertapi.convert(
            'pdf',
            {
                File: '../dropbox-hackathon-backend/src/temp_files/tmpPetitionFile.txt',
            },
            'txt'
        );
        result.saveFiles('../dropbox-hackathon-backend/src/temp_files/tmpPetition.pdf');
    } catch (err) {
        console.log('Exception when calling convertAPI:');
        console.log(err);
    }
};

module.exports = {
    convertToPDF
};
