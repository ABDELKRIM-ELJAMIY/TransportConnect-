const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Annonce = require('./models/Annonce');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const importAnnonces = async () => {
    try {
        const jsonPath = path.join(__dirname, '..', 'annonces_data.json');
        const annoncesData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        console.log(`Found ${annoncesData.length} annonces to import`);

        let importedCount = 0;
        let errorCount = 0;

        for (const annonceData of annoncesData) {
            try {
                const existingAnnonce = await Annonce.findOne({
                    conducteurId: annonceData.conducteurId,
                    'lieuDepart.nom': annonceData.lieuDepart.nom,
                    'destination.nom': annonceData.destination.nom,
                    dateDepart: new Date(annonceData.dateDepart)
                });

                if (existingAnnonce) {
                    console.log(`Annonce already exists: ${annonceData.lieuDepart.nom} → ${annonceData.destination.nom}`);
                    continue;
                }

                const newAnnonce = new Annonce(annonceData);
                await newAnnonce.save();

                console.log(`✓ Imported: ${annonceData.lieuDepart.nom} → ${annonceData.destination.nom}`);
                importedCount++;

            } catch (error) {
                console.error(`✗ Error importing annonce: ${error.message}`);
                errorCount++;
            }
        }

        console.log(`\nImport completed!`);
        console.log(`✓ Successfully imported: ${importedCount} annonces`);
        console.log(`✗ Errors: ${errorCount} annonces`);

        const totalCount = await Annonce.countDocuments();
        console.log(`Total annonces in database: ${totalCount}`);

    } catch (error) {
        console.error('Import error:', error);
    }
};

const runImport = async () => {
    await connectDB();
    await importAnnonces();
    mongoose.connection.close();
    console.log('Import script completed');
};

runImport(); 