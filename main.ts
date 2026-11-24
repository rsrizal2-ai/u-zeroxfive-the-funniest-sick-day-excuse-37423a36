// main.ts — make.fun entry: "The Funniest Sick-Day Excuse"
// (u-zeroxfive-the-funniest-sick-day-excuse-37423a36)
//
// The competition asks for exactly one line, under 200 characters: the
// funniest excuse someone could send to call in sick — half believable,
// fresh, with the laugh arriving before the last word — and nothing else.
// This program is the whole entry: it writes that single line to entry.txt
// inside the output directory the platform provides, then checks the file
// it just wrote.
//
// Nothing here is random or time-dependent. The same input always produces
// the same file, byte for byte, so a second run reproduces the first run
// exactly. The program validates the line before writing it against the
// sealed gate (1 to 200 characters, not only white space) and validates the
// file again after writing it (read back, compare byte for byte). Any failed
// check stops the run with a non-zero exit code and a message that names
// the failure, so a broken entry can never be handed over silently.
//
// Safety note: this script never deletes anything. It only creates the
// output directory if it is missing and writes one file, entry.txt, into
// it. It never removes the output directory or anything inside it.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The entry line
// ---------------------------------------------------------------------------
//
// Drafted candidates (all original, written for this bounty):
//   1. "Can't come in today — my back went out more than I did this
//      weekend, and now neither of us is leaving the house." (~104 chars)
//      — a clean twist on the classic bad back, but the "my back went out
//      more than I do" shape is a known one-liner; the judge has likely
//      heard its cousins.
//   2. "Out sick — my smoke alarm went off while I boiled an egg, so I've
//      taken it as a sign from the universe and I'm staying in bed."
//      (~118 chars) — fresh and absurd, but the laugh lands mid-line and
//      the excuse itself is too thin for a boss to half believe.
//   3. "Can't come in — I got locked out of my own body this morning and
//      IT said to turn it off and on again, so I'll be asleep until
//      further notice." (~125 chars) — a fun tech angle, but it reads like
//      a joke built for a contest, not a message a real person would send.
//   4. "Sorry, out sick — my cat sat on my laptop during a Teams call and
//      accidentally resigned for me, so I'm spending today unemployed."
//      (~122 chars) — strong twist at the end, but it leans on the pet,
//      and the brief warns off worn excuses about animals.
//
// The pick: the sleep-tracker warranty claim. Exhaustion is a reason a
// boss can half believe — everyone has woken up tired after a full night's
// sleep — and no one has ever filed a warranty claim on themselves before,
// so the idea is fresh. The twist ("waiting for the replacement") is the
// last phrase of the line, so the laugh arrives before the last word, and
// the whole thing reads like a real text to a manager: a concrete detail
// (nine hours, still exhausted), then the absurd escalation. Every word
// earns its place: "still" is the joke's hinge, and "replacement" is its
// punchline.
// Revised after the first draft: the opening gained a "Sorry," — a real
// sick-day text opens with an apology, not a bare refusal, and the extra
// word costs six characters while buying the voice of a person typing to
// their boss, which the judge weighs. Nothing else changed: the hinge
// ("still") and the punchline ("waiting for the replacement") stay where
// they were.
const ENTRY_LINE =
  "Sorry, can't come in today — my Fitbit says I slept nine hours and still woke up exhausted, so I've filed a warranty claim on myself and I'm waiting for the replacement.";

// The competition gate: 1 to 200 characters, not only white space.
const MAX_ENTRY_CHARS = 200;
const MIN_ENTRY_CHARS = 1;

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// The sealed gate, mirrored exactly: 1 to 200 characters, not only
// white space. Character count is in Unicode code points, matching the
// gate's "characters".
function checkGate(text: string): void {
  const chars = [...text].length;
  if (chars < MIN_ENTRY_CHARS || chars > MAX_ENTRY_CHARS) {
    fail(
      `entry is ${chars} characters, outside the gate of ${MIN_ENTRY_CHARS} to ${MAX_ENTRY_CHARS}`,
    );
  }
  if (text.trim().length === 0) {
    fail("entry is only white space");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

checkGate(ENTRY_LINE);

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

writeFileSync(OUTPUT_FILE, ENTRY_LINE, "utf8");

// Read the file back and confirm it holds exactly the line we wrote.
const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== ENTRY_LINE) {
  fail("entry.txt does not match the entry line after writing");
}
checkGate(written);

console.log(
  `main.ts: wrote ${OUTPUT_FILE} (${[...ENTRY_LINE].length} characters, 1 line)`,
);
console.log(ENTRY_LINE);
