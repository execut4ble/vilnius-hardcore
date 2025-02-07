import "dotenv/config";
import postgres from "postgres";
import chalk from "chalk";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env file");
}

const sql = postgres(DATABASE_URL, { prepare: false });

async function setupTriggers() {
  const existingTriggers = await sql`
        SELECT tgname FROM pg_trigger 
        WHERE tgname IN ('set_slug_from_title_event', 'set_slug_from_title_post');
    `;

  const triggerNames = existingTriggers.map((t) => t.tgname);
  const createdTriggers: string[] = [];
  const existingTriggersList: string[] = [];

  if (!triggerNames.includes("set_slug_from_title_event")) {
    await sql`
        CREATE TRIGGER set_slug_from_title_event
        BEFORE INSERT OR UPDATE
        ON "event"
        FOR EACH ROW
        EXECUTE FUNCTION public.set_slug_from_title();
    `;
    createdTriggers.push("set_slug_from_title_event");
  } else {
    existingTriggersList.push("set_slug_from_title_event");
  }

  if (!triggerNames.includes("set_slug_from_title_post")) {
    await sql`
        CREATE TRIGGER set_slug_from_title_post
        BEFORE INSERT OR UPDATE
        ON "post"
        FOR EACH ROW
        EXECUTE FUNCTION public.set_post_slug();
    `;
    createdTriggers.push("set_slug_from_title_post");
  } else {
    existingTriggersList.push("set_slug_from_title_post");
  }

  if (createdTriggers.length > 0) {
    console.log(
      `[${chalk.green("✓")}] Triggers created: ${createdTriggers.join(", ")}`,
    );
  }

  if (existingTriggersList.length > 0) {
    console.log(
      `[${chalk.blue("i")}] Triggers already exist: ${existingTriggersList.join(", ")}`,
    );
  }

  await sql.end();
}

setupTriggers().catch(console.error);
