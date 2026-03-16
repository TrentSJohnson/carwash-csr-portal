import 'dotenv/config';
import mongoose from 'mongoose';

import Member from './models/Member.js';
import Plan from './models/Plan.js';
import Vehicle from './models/Vehicle.js';
import Subscription from './models/Subscription.js';
import Transaction from './models/Transaction.js';
import Activity from './models/Activity.js';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function seed() {
  await mongoose.connect(process.env.MONGO_API_CONNECTION_STRING);
  console.log('MongoDB connected');

  // Clear all collections (order matters for readability, no hard FK constraints in Mongo)
  await Activity.deleteMany({});
  await Transaction.deleteMany({});
  await Subscription.deleteMany({});
  await Vehicle.deleteMany({});
  await Member.deleteMany({});
  await Plan.deleteMany({});
  console.log('Cleared existing data');

  // --- Plans ---
  const [basic, silver, gold, unlimited] = await Plan.insertMany([
    { plan_name: 'Basic Wash',  monthly_price: 9.99,  features: 'Exterior wash only' },
    { plan_name: 'Silver',      monthly_price: 19.99, features: 'Exterior wash + vacuum' },
    { plan_name: 'Gold',        monthly_price: 29.99, features: 'Full service wash + wax' },
    { plan_name: 'Unlimited',   monthly_price: 49.99, features: 'Unlimited washes + detailing discount' },
  ]);
  console.log('Seeded plans');

  // --- Members ---
  const [alice, marcus, jordan] = await Member.insertMany([
    { first_name: 'Alice',  last_name: 'Thompson', email: 'alice@example.com',  phone: '512-555-0101', account_status: 'Active' },
    { first_name: 'Marcus', last_name: 'Rivera',   email: 'marcus@example.com', phone: '512-555-0202', account_status: 'Active' },
    { first_name: 'Jordan', last_name: 'Lee',      email: 'jordan@example.com', phone: '512-555-0303', account_status: 'Paused' },
  ]);
  console.log('Seeded members');

  // --- Vehicles ---
  const [aliceCivic, aliceTesla, marcusTruck, jordanCamry] = await Vehicle.insertMany([
    { member_id: alice._id,  license_plate: 'ABC-1234', state: 'TX', make_model: '2019 Honda Civic',    rfid_tag_id: 'RFID-AA001' },
    { member_id: alice._id,  license_plate: 'EFG-3456', state: 'TX', make_model: '2022 Tesla Model 3',  rfid_tag_id: 'RFID-AA002' },
    { member_id: marcus._id, license_plate: 'XYZ-5678', state: 'TX', make_model: '2021 Ford F-150',     rfid_tag_id: 'RFID-BB001' },
    { member_id: jordan._id, license_plate: 'QRS-9012', state: 'TX', make_model: '2020 Toyota Camry',   rfid_tag_id: 'RFID-CC001' },
  ]);
  console.log('Seeded vehicles');

  // --- Subscriptions ---
  const [subAliceGold, subAliceSilver, subMarcusUnlimited, subJordanBasic] = await Subscription.insertMany([
    {
      member_id: alice._id,  plan_id: gold._id,     vehicle_id: aliceCivic._id,
      start_date: daysAgo(90), next_billing_date: daysAgo(-5), status: 'Active',
    },
    {
      member_id: alice._id,  plan_id: silver._id,   vehicle_id: aliceTesla._id,
      start_date: daysAgo(60), next_billing_date: daysAgo(-5), status: 'Active',
    },
    {
      member_id: marcus._id, plan_id: unlimited._id, vehicle_id: marcusTruck._id,
      start_date: daysAgo(120), next_billing_date: daysAgo(-3), status: 'Active',
    },
    {
      member_id: jordan._id, plan_id: basic._id,    vehicle_id: jordanCamry._id,
      start_date: daysAgo(45), next_billing_date: daysAgo(15), status: 'Paused',
    },
  ]);
  console.log('Seeded subscriptions');

  // --- Transactions ---
  await Transaction.insertMany([
    // Older history
    { member_id: alice._id,  subscription_id: subAliceGold._id,        amount: 29.99, status: 'Paid',   timestamp: daysAgo(60) },
    { member_id: marcus._id, subscription_id: subMarcusUnlimited._id,  amount: 49.99, status: 'Paid',   timestamp: daysAgo(90) },
    { member_id: marcus._id, subscription_id: subMarcusUnlimited._id,  amount: 49.99, status: 'Paid',   timestamp: daysAgo(60) },
    { member_id: jordan._id, subscription_id: subJordanBasic._id,      amount: 9.99,  status: 'Paid',   timestamp: daysAgo(45) },
    // Last month (within 30 days)
    { member_id: alice._id,  subscription_id: subAliceGold._id,        amount: 29.99, status: 'Paid',   timestamp: daysAgo(28) },
    { member_id: alice._id,  subscription_id: subAliceSilver._id,      amount: 19.99, status: 'Paid',   timestamp: daysAgo(28) },
    { member_id: marcus._id, subscription_id: subMarcusUnlimited._id,  amount: 49.99, status: 'Paid',   timestamp: daysAgo(25) },
    { member_id: jordan._id, subscription_id: subJordanBasic._id,      amount: 9.99,  status: 'Failed', timestamp: daysAgo(15) },
    { member_id: alice._id,  subscription_id: subAliceGold._id,        amount: 29.99, status: 'Paid',   timestamp: daysAgo(10) },
    { member_id: marcus._id, subscription_id: subMarcusUnlimited._id,  amount: 49.99, status: 'Paid',   timestamp: daysAgo(8) },
    // Last week (within 7 days)
    { member_id: alice._id,  subscription_id: subAliceSilver._id,      amount: 19.99, status: 'Paid',   timestamp: daysAgo(6) },
    { member_id: marcus._id, subscription_id: subMarcusUnlimited._id,  amount: 49.99, status: 'Paid',   timestamp: daysAgo(5) },
    { member_id: alice._id,  subscription_id: subAliceGold._id,        amount: 29.99, status: 'Paid',   timestamp: daysAgo(3) },
    { member_id: jordan._id, subscription_id: subJordanBasic._id,      amount: 9.99,  status: 'Failed', timestamp: daysAgo(2) },
    { member_id: alice._id,  subscription_id: subAliceSilver._id,      amount: 19.99, status: 'Failed', timestamp: daysAgo(1) },
  ]);
  console.log('Seeded transactions');

  // --- Activities ---
  await Activity.insertMany([
    { member_id: alice._id,  csr_id: 'Ashley Brooks',  action_taken: 'Edit Info',   notes: 'Updated phone number per member request.',         timestamp: daysAgo(30) },
    { member_id: marcus._id, csr_id: 'Kevin Carter',  action_taken: 'Transfer',    notes: 'Transferred subscription to new vehicle.',         timestamp: daysAgo(8) },
    { member_id: jordan._id, csr_id: 'Ashley Brooks', action_taken: 'Edit Info',   notes: 'Corrected email address.',                         timestamp: daysAgo(6) },
    { member_id: jordan._id, csr_id: 'Kevin Carter',  action_taken: 'Cancel Sub',  notes: 'Member requested pause due to travel.',            timestamp: daysAgo(1) },
    { member_id: alice._id,  csr_id: 'Kevin Carter',  action_taken: 'Edit Info',   notes: 'Added second vehicle to account.',                 timestamp: daysAgo(.5) },
    { member_id: marcus._id, csr_id: 'Ashley Brooks', action_taken: 'Transfer',    notes: 'Member traded in old truck, updated vehicle info.', timestamp: daysAgo(0) },
  ]);
  console.log('Seeded activities');

  console.log('\nSeed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
