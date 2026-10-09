import { seedDatabase } from '../src/lib/seed';

seedDatabase()
  .then(() => {
    console.log('Database successfully seeded with demo accounts.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to seed database:', err);
    process.exit(1);
  });
