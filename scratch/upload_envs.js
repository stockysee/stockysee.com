const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join('c:', 'Users', 'HYPE', 'project', 'villa-engine', 'engine', 'BACKUP-ENGINE', 'BUILD', 'stockysee', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = envContent.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
        const parts = line.split('=');
        const key = parts[0];
        let value = parts.slice(1).join('=');
        if (value.startsWith('"') || value.startsWith("'")) {
            value = value.substring(1, value.length - 1);
        }
        return { key, value };
    });

for (const { key, value } of envVars) {
    if (key === 'NEXT_PUBLIC_APP_URL') {
        console.log(`Skipping ${key}, it should be set to production URL manually if needed.`);
        continue;
    }
    console.log(`Adding ${key}...`);
    try {
        // Use echo to pipe the value to vercel env add
        execSync(`echo ${value} | vercel env add ${key} production`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to add ${key}: ${e.message}`);
    }
}
