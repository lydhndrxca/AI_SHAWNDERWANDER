#!/usr/bin/env node
// ─── ElevenLabs Audio Batch Generator ───
// Reads voice-manifest.json and dialogue-lines.json, generates all voice lines.
//
// Usage:
//   node generate.js                    — generate all missing lines
//   node generate.js --voice dave       — generate only Dave's lines
//   node generate.js --force            — regenerate even if file exists
//   node generate.js --dry-run          — preview what would be generated

const fs = require('fs');
const path = require('path');
const https = require('https');

const MANIFEST_PATH = path.join(__dirname, 'voice-manifest.json');
const LINES_PATH = path.join(__dirname, 'dialogue-lines.json');
const ENV_PATH = path.join(__dirname, '..', '.env');

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const env = {};
  fs.readFileSync(ENV_PATH, 'utf-8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq > 0) env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  });
  return env;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { voice: null, force: false, dryRun: false, category: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--voice' && args[i + 1]) opts.voice = args[++i];
    if (args[i] === '--category' && args[i + 1]) opts.category = args[++i];
    if (args[i] === '--force') opts.force = true;
    if (args[i] === '--dry-run') opts.dryRun = true;
  }
  return opts;
}

function generateFilename(voiceName, category, lineId, format) {
  return `${voiceName}_${category}_${lineId}.${format.split('_')[0]}`;
}

async function callElevenLabs(apiKey, voiceConfig, text) {
  const voiceId = voiceConfig.voice_id;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const body = JSON.stringify({
    text,
    model_id: voiceConfig.model_id,
    voice_settings: voiceConfig.voice_settings,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        'Accept': 'audio/mpeg',
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        let errBody = '';
        res.on('data', d => errBody += d);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${errBody}`)));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const opts = parseArgs();
  const env = loadEnv();
  const apiKey = env.ELEVEN_LABS_API_KEY || process.env.ELEVEN_LABS_API_KEY;

  if (!apiKey && !opts.dryRun) {
    console.error('ERROR: ELEVEN_LABS_API_KEY not found.');
    console.error('Set it in .env or as an environment variable.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const lines = JSON.parse(fs.readFileSync(LINES_PATH, 'utf-8'));
  const outputDir = path.resolve(__dirname, manifest.audio_settings.output_dir);
  const format = manifest.audio_settings.output_format;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jobs = [];

  for (const [voiceName, categories] of Object.entries(lines)) {
    if (voiceName.startsWith('_')) continue;
    if (opts.voice && opts.voice !== voiceName) continue;

    const voiceConfig = manifest.voices[voiceName];
    if (!voiceConfig) {
      console.warn(`WARN: No voice config for "${voiceName}", skipping.`);
      continue;
    }

    for (const [category, lineArray] of Object.entries(categories)) {
      if (opts.category && opts.category !== category) continue;
      if (!Array.isArray(lineArray)) continue;

      for (const line of lineArray) {
        const filename = generateFilename(voiceName, category, line.id, format);
        const filepath = path.join(outputDir, filename);

        if (!opts.force && fs.existsSync(filepath)) {
          continue;
        }

        jobs.push({
          voiceName,
          category,
          lineId: line.id,
          prompt: line.prompt,
          context: line.context,
          voiceConfig: voiceConfig.eleven_labs,
          filepath,
          filename,
        });
      }
    }
  }

  console.log(`\n  GOLF MIND GAME — Audio Generator`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  Lines to generate: ${jobs.length}`);
  console.log(`  Output: ${outputDir}`);
  if (opts.voice) console.log(`  Voice filter: ${opts.voice}`);
  if (opts.force) console.log(`  Mode: FORCE (regenerating existing files)`);
  if (opts.dryRun) console.log(`  Mode: DRY RUN (no API calls)`);
  console.log('');

  if (opts.dryRun) {
    for (const job of jobs) {
      console.log(`  [${job.voiceName}/${job.category}] ${job.lineId}`);
      console.log(`    "${job.prompt}"`);
      console.log(`    → ${job.filename}`);
      console.log('');
    }
    console.log(`  Total: ${jobs.length} files would be generated.`);
    return;
  }

  if (jobs.length === 0) {
    console.log('  All lines already generated. Use --force to regenerate.');
    return;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const progress = `[${i + 1}/${jobs.length}]`;

    process.stdout.write(`  ${progress} ${job.voiceName}/${job.lineId}... `);

    try {
      const audio = await callElevenLabs(apiKey, job.voiceConfig, job.prompt);
      fs.writeFileSync(job.filepath, audio);
      console.log(`✓ ${(audio.length / 1024).toFixed(1)}KB`);
      success++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }

    // Rate limiting: 150ms between calls
    if (i < jobs.length - 1) await sleep(150);
  }

  console.log(`\n  Done. ${success} generated, ${failed} failed.`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
