const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaperInfoSchema = new Schema({
    category: String,
    weight: Number
});

module.exports = mongoose.model('Paper_Info', PaperInfoSchema);