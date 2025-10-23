import { exec } from "child_process";

export async function migrateTenantSchema(realm: string, tenant: string): Promise<void> {
  const schemaName = `${realm}_${tenant}`;

  if (!process.env.FLYWAY_DATABASE_URL) {
    throw new Error("Missing FLYWAY_DATABASE_URL environment variable");
  }
  if (!process.env.DATABASE_USER || !process.env.DATABASE_PASSWORD) {
    throw new Error("Missing DATABASE_USER or DATABASE_PASSWORD in environment");
  }

  const cmd = `
    flyway -url=${process.env.FLYWAY_DATABASE_URL} \
           -user=${process.env.DATABASE_USER} \
           -password=${process.env.DATABASE_PASSWORD} \
           -schemas=${schemaName} \
           -defaultSchema=${schemaName} \
           -table=schema_version \
           -locations=filesystem:/app/sql/migrations \
           -baselineOnMigrate=true \
           migrate
  `;

  console.log(`▶️ Running migrations for schema: ${schemaName}`);

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Migration failed for ${schemaName}`);
        console.error(stderr);
        reject(new Error(stderr));
      } else {
        console.log(`✅ Migration succeeded for ${schemaName}`);
        console.log(stdout);
        resolve();
      }
    });
  });
}
