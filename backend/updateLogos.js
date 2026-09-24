const mongoose = require('mongoose');
require('dotenv').config();

const toolSchema = new mongoose.Schema({
  name: String,
  url: String,
  logo: String
}, { strict: false });

const Tool = mongoose.model('Tool', toolSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const tools = await Tool.find({ $or: [{ logo: { $exists: false } }, { logo: '' }] });
    console.log('Found ' + tools.length + ' tools without logos.');
    
    let updated = 0;
    for (const tool of tools) {
      if (tool.url) {
        try {
          const urlObj = new URL(tool.url);
          const domain = urlObj.hostname;
          tool.logo = 'https://logo.clearbit.com/' + domain;
          await tool.save();
          updated++;
        } catch (e) {
          console.error('Error with URL ' + tool.url);
        }
      }
    }
    
    console.log('Updated ' + updated + ' tools with Clearbit logos.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
