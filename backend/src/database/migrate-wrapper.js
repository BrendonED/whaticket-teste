const { execSync } = require('child_process');
const path = require('path');

// Register ts-node with transpileOnly to skip type checking
require('ts-node').register({
    transpileOnly: true,
    skipProject: true, // Skip loading tsconfig.json to avoid global type errors
    compilerOptions: {
        module: 'commonjs',
        target: 'es6',
        esModuleInterop: true
    }
});

console.log('Running migrations...');

try {
    // Run sequelize-cli pointing to the TypeScript migration files
    // Since ts-node is registered, it should handle the .ts imports if we were using the library directly.
    // BUT sequelize-cli runs as a separate process usually.

    // Actually, the most robust way to use CLI with TS files in v5 is to use the .sequelizerc
    // pointing to .ts files and having ts-node registered in the env.

    // Let's use the node executable to run the CLI bin, injecting the register
    const sequelizeBin = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'sequelize');

    // Constuindo o comando com as flags corretas
    // Usamos cross-env ou setamos o env diretamente
    const cmd = `npx sequelize-cli db:migrate --env production --config src/config/database.js`;

    console.log(`Executing: ${cmd}`);

    execSync(cmd, {
        stdio: 'inherit',
        env: {
            ...process.env,
            // CRITICAL: This enables ts-node for the child process created by npx/sequelize
            NODE_OPTIONS: '--require ts-node/register/transpile-only'
        }
    });

    console.log('Migrations completed successfully.');
} catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
}
