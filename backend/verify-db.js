import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

async function verifyAll() {
  console.log('========================================================');
  console.log('       LIVE MYSQL CONNECTION & INTEGRATION TEST         ');
  console.log('========================================================');

  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'portfolio_db';

  console.log(`Connecting to MySQL server:`);
  console.log(`- Host: ${host}`);
  console.log(`- Port: ${port}`);
  console.log(`- User: ${user}`);
  console.log(`- Database Target: ${database}`);
  console.log(`- Password: [CONFIGURED - HIDDEN FOR SECURITY]`);
  console.log('--------------------------------------------------------');

  // Step 1: Connect to MySQL server
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });

  console.log('✓ Successfully connected to MySQL server!');

  // Step 2: Test SELECT 1
  const [selectOne] = await connection.query('SELECT 1 AS live_test');
  console.log(`✓ SELECT 1 query succeeded: Result = ${selectOne[0].live_test}`);

  // Step 3: Ensure portfolio_db exists
  await connection.query(
    'CREATE DATABASE IF NOT EXISTS `portfolio_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
  );
  await connection.changeUser({ database });

  // Step 4: SELECT DATABASE()
  const [currentDb] = await connection.query('SELECT DATABASE() AS active_db');
  console.log(`✓ Active Database confirmed: ${currentDb[0].active_db}`);

  // Step 5: Check and create contact_messages table
  const [tables] = await connection.query('SHOW TABLES');
  const tableNames = tables.map((row) => Object.values(row)[0]);
  console.log(`✓ Existing tables in \`${database}\`:`, tableNames);

  if (!tableNames.includes('contact_messages')) {
    console.log('Table `contact_messages` not found. Creating from schema.sql...');
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS \`contact_messages\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50) DEFAULT NULL,
        \`subject\` VARCHAR(200) NOT NULL,
        \`message\` TEXT DEFAULT NULL,
        \`status\` ENUM('unread', 'read', 'archived', 'replied') NOT NULL DEFAULT 'unread',
        \`ip_address\` VARCHAR(45) DEFAULT NULL,
        \`user_agent\` VARCHAR(255) DEFAULT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_contact_email\` (\`email\`),
        INDEX \`idx_contact_status\` (\`status\`),
        INDEX \`idx_contact_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createTableSql);
    console.log('✓ Created `contact_messages` table successfully!');
  } else {
    console.log('✓ Table `contact_messages` already exists.');
  }

  // Step 6: Insert a distinct test record
  console.log('\n--- Inserting Identifiable Test Record ---');
  const testPayload = {
    name: 'Real Test Runner',
    email: 'integration.verify@example.com',
    phone: '+1 555-0149',
    subject: 'Complete MySQL Integration Test',
    message: 'Testing actual insertion from portfolio backend to local MySQL database.',
    ip_address: '127.0.0.1',
    user_agent: 'VerificationScript/1.0',
  };

  const [insertResult] = await connection.execute(
    `INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      testPayload.name,
      testPayload.email,
      testPayload.phone,
      testPayload.subject,
      testPayload.message,
      testPayload.ip_address,
      testPayload.user_agent,
    ]
  );

  const insertedId = insertResult.insertId;
  console.log(`✓ Record inserted successfully! ID: ${insertedId}`);

  // Step 7: Verify using SELECT * FROM contact_messages ORDER BY id DESC LIMIT 5;
  console.log('\n--- Verifying with SELECT * FROM contact_messages ORDER BY id DESC LIMIT 5 ---');
  const [rows] = await connection.query(
    'SELECT id, name, email, phone, subject, message, status, created_at FROM contact_messages ORDER BY id DESC LIMIT 5'
  );
  console.table(rows);

  // Step 8: Clean up only this test record
  console.log(`\n--- Cleaning Up Only Test Record (ID: ${insertedId}) ---`);
  await connection.execute('DELETE FROM contact_messages WHERE id = ?', [insertedId]);
  console.log(`✓ Test record ID ${insertedId} successfully deleted.`);

  // Verify deletion
  const [verifyRows] = await connection.query('SELECT COUNT(*) AS count FROM contact_messages WHERE id = ?', [insertedId]);
  console.log(`✓ Verified cleanup: Remaining matching test rows = ${verifyRows[0].count}`);

  await connection.end();

  console.log('\n========================================================');
  console.log('   ALL REAL MYSQL INTEGRATION TESTS COMPLETED: SUCCESS  ');
  console.log('========================================================');
}

verifyAll().catch((err) => {
  console.error('\n✗ Verification Failed:', err.message);
  process.exit(1);
});
