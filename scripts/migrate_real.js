const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const sql = fs.readFileSync('/Users/truongtritin/Github/xinchao-speak-vietnamese/supabase/migrations/20260408_create_survival_dynamic_tables.sql', 'utf8');
  const { error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) console.error("Error:", error);
  else console.log("Database tables created successfully.");
}
run();
