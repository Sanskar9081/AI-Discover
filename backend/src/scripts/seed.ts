import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env before importing models to ensure DB connects properly
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { Category } from '../models/Category';
import { Tool } from '../models/Tool';
import { Prompt } from '../models/Prompt';
import { Setting } from '../models/Setting';
import { User } from '../models/User';
import { FeaturedItem } from '../models/FeaturedItem';
import { Ad } from '../models/Ad';

import categoriesData from '../data/categories.json';
import toolsData from '../data/tools.json';
import promptsData from '../data/prompts.json';

const categories: any[] = categoriesData;
const tools: any[] = toolsData;
const prompts: any[] = promptsData;
const ads: any[] = [];

async function runSeed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in environment.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.');

  console.log('--- CLEARING COLLECTIONS ---');
  await Category.deleteMany({});
  await Tool.deleteMany({});
  await Prompt.deleteMany({});
  await Ad.deleteMany({});
  
  console.log('--- SEEDING CATEGORIES ---');
  let categoryCount = 0;
  for (const cat of categories) {
    await Category.findOneAndUpdate(
      { name: cat.name },
      { $set: { icon: cat.icon, color: cat.color } },
      { upsert: true, new: true }
    );
    categoryCount++;
  }
  console.log(`Inserted ${categoryCount} new categories.`);

  console.log('--- SEEDING TOOLS ---');
  let toolCount = 0;
  for (const t of tools) {
    const cat = await Category.findOne({ name: categories.find(c => c.id === t.category)?.name || t.category });
    await Tool.findOneAndUpdate(
      { $or: [{ name: t.name }, { url: t.url }] },
      { $set: {
        name: t.name,
        description: t.description,
        category: cat ? cat._id : null,
        pricing: t.pricing,
        logo: t.logo,
        url: t.url,
        featured: t.featured,
        trending: t.trending,
        features: t.features,
        easeOfUse: t.easeOfUse,
        mainFunctionality: t.mainFunctionality,
        freePlan: t.freePlan,
        rating: t.rating,
        reviewCount: t.reviewCount,
        isNew: t.isNew,
        isPremium: t.isPremium,
        useCase: t.useCase,
        tags: t.tags,
        couponCode: t.couponCode,
        views: t.views,
        clicks: t.clicks,
        status: t.status || 'approved'
      }},
      { upsert: true, new: true }
    );
    toolCount++;
  }
  console.log(`Inserted ${toolCount} new tools.`);

  console.log('--- SEEDING PROMPTS ---');
  let promptCount = 0;
  for (const p of prompts) {
    const cat = await Category.findOne({ name: p.category });
    const suggested = await Tool.findOne({ name: p.suggestedTool });
    await Prompt.findOneAndUpdate(
      { title: p.title },
      { $set: {
        title: p.title,
        prompt: p.prompt,
        category: cat ? cat._id : null,
        beforeImage: p.beforeImage,
        afterImage: p.afterImage,
        author: p.author,
        instagram: p.instagram,
        featured: p.featured,
        suggestedTool: p.suggestedTool,
        suggestedToolId: suggested ? suggested._id : null,
        status: p.status || 'approved'
      }},
      { upsert: true, new: true }
    );
    promptCount++;
  }
  console.log(`Inserted ${promptCount} new prompts.`);
  
  if (ads && ads.length > 0) {
    console.log('--- SEEDING ADS ---');
    let adCount = 0;
    for (const a of ads) {
      const existing = await Ad.findOne({ name: a.name });
      if (!existing) {
        await Ad.create({
          name: a.name,
          description: a.description,
          image: a.image,
          video: a.video,
          url: a.url,
          type: a.type,
          placement: a.placement,
          status: 'active'
        });
        adCount++;
      }
    }
    console.log(`Inserted ${adCount} new ads.`);
  }

  console.log('--- SEEDING SETTINGS ---');
  const existingSettings = await Setting.find({});
  let settingCount = 0;
  if (existingSettings.length === 0) {
    await Setting.create({ key: 'maintenance_mode', value: JSON.stringify({ enabled: false }), type: 'json' });
    await Setting.create({ key: 'site_title', value: JSON.stringify({ title: 'AI Discover' }), type: 'json' });
    settingCount = 2;
  }
  console.log(`Inserted ${settingCount} new settings.`);

  console.log('--- SEEDING FEATURED ITEMS ---');
  await FeaturedItem.deleteMany({});
  const featuredTools = await Tool.find({ featured: true }).limit(5);
  let featuredCount = 0;
  for (let i = 0; i < featuredTools.length; i++) {
    await FeaturedItem.create({
      item_type: 'tool',
      item_id: featuredTools[i]._id,
      order_index: i
    });
    featuredCount++;
  }
  console.log(`Inserted ${featuredCount} featured items.`);

  console.log('\n--- FINAL COUNTS ---');
  console.log(`users: ${await User.countDocuments()}`);
  console.log(`tools: ${await Tool.countDocuments()}`);
  console.log(`categories: ${await Category.countDocuments()}`);
  console.log(`prompts: ${await Prompt.countDocuments()}`);
  console.log(`featuredItems: ${await FeaturedItem.countDocuments()}`);
  console.log(`settings: ${await Setting.countDocuments()}`);
  console.log(`ads: ${await Ad.countDocuments()}`);

  console.log('\nSeeding complete.');
  process.exit(0);
}

runSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
