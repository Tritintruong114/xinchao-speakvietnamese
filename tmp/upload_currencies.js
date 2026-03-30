const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://iazpvkobzxuxabecngzt.supabase.co';
const supabaseKey = 'sb_publishable_5G46bJ925avPMhMQCPrbjw_OLbGk5Lt';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile(denomination, filename) {
  const filePath = path.join(__dirname, '../assets/currencies', filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  const fileBuffer = fs.readFileSync(filePath);
  const targetPath = `${denomination}/${filename}`;

  console.log(`Uploading ${filename} to ${targetPath}...`);
  const { data, error } = await supabase.storage
    .from('currencies')
    .upload(targetPath, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) {
    console.error(`Error uploading ${filename}:`, error.message);
  } else {
    const { data: { publicUrl } } = supabase.storage.from('currencies').getPublicUrl(targetPath);
    console.log(`Successfully uploaded ${filename}!`);
    console.log(`Public URL: ${publicUrl}`);
  }
}

async function main() {
  const dirPath = path.join(__dirname, '../assets/currencies');
  try {
    const files = fs.readdirSync(dirPath);
    console.log(`Found ${files.length} files to upload.`);

    for (const filename of files) {
      if (!filename.endsWith('.png') && !filename.endsWith('.jpg')) continue;

      // Extract denomination from filename (e.g., "F-5000.png" -> "5000")
      const denomMatch = filename.match(/[BF]-(\d+)\./);
      if (denomMatch && denomMatch[1]) {
        await uploadFile(denomMatch[1], filename);
      } else {
        console.warn(`Could not determine denomination for: ${filename}`);
      }
    }
    console.log('All uploads completed!');
  } catch (err) {
    console.error('Fatal error scanning directory:', err.message);
  }
}

main();
