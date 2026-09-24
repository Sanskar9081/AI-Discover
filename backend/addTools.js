const mongoose = require('mongoose');
require('dotenv').config();

const categorySchema = new mongoose.Schema({ name: String }, { strict: false });
const Category = mongoose.model('Category', categorySchema);

const toolSchema = new mongoose.Schema({
  name: String,
  description: String,
  url: String,
  logo: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  pricing: String,
  features: [String],
  tags: [String],
  status: { type: String, default: 'approved' },
  rating: Number,
  reviewCount: Number,
  provider: String
}, { strict: false });
const Tool = mongoose.model('Tool', toolSchema);

const categoriesTarget = [
  "Chat AI", "Image AI", "Video AI", "Audio AI", "Coding AI",
  "Productivity AI", "Marketing", "Design", "Education", "Research"
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    for (const catName of categoriesTarget) {
      // Find or create category
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({ name: catName, color: 'hsl(0, 0%, 50%)', icon: 'Box' });
        console.log(`Created category ${catName}`);
      }

      // Count tools
      const count = await Tool.countDocuments({ category: category._id });
      console.log(`${catName} has ${count} tools.`);
      
      const needed = 20 - count;
      if (needed > 0) {
        console.log(`Adding ${needed} tools for ${catName}...`);
        for (let i = 0; i < needed; i++) {
          const idStr = Math.random().toString(36).substring(7);
          const toolName = `${catName.split(' ')[0]} Tool ${idStr.toUpperCase()}`;
          const domain = `${toolName.replace(/\s+/g, '').toLowerCase()}.com`;
          
          await Tool.create({
            name: toolName,
            description: `A highly advanced AI tool specializing in ${catName.toLowerCase()} workflows.`,
            url: `https://${domain}`,
            logo: `https://logo.clearbit.com/${domain}`,
            category: category._id,
            pricing: Math.random() > 0.5 ? 'Freemium' : (Math.random() > 0.5 ? 'Free' : 'Paid'),
            features: ['AI Powered', 'Cloud Based', 'Fast Processing'],
            tags: ['AI', catName.split(' ')[0].toLowerCase()],
            status: 'approved',
            rating: 3.5 + Math.random() * 1.5,
            reviewCount: Math.floor(Math.random() * 500) + 10,
            provider: 'Independent'
          });
        }
        console.log(`Finished adding tools for ${catName}.`);
      }
    }

    console.log("Database update complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
