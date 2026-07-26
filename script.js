/* ============================================================================
   Pediatric BP Reference — lookup logic
   Data: AAP 2017 Clinical Practice Guideline (Pediatrics 2017;140:e20171904),
   as reproduced in the UpToDate tables "Blood pressure levels for males /
   females by age and height percentile" (Graphic 63856 v22.0 / 52646 v21.0).

   Array order for every row = the 7 height columns:
   [5th, 10th, 25th, 50th, 75th, 90th, 95th] height percentile.
   h  = height in cm for those columns
   s* = systolic mmHg, d* = diastolic mmHg
   p50 / p90 / p95 / p95x = 50th, 90th, 95th, 95th + 12 mmHg
   ========================================================================== */

const HEIGHT_PERCENTILES = [5, 10, 25, 50, 75, 90, 95];

const BP_DATA = {
  male: {
    1:  { h:[77.2,78.3,80.2,82.4,84.6,86.7,87.9],
          s50:[85,85,86,86,87,88,88],      s90:[98,99,99,100,100,101,101],
          s95:[102,102,103,103,104,105,105], s95x:[114,114,115,115,116,117,117],
          d50:[40,40,40,41,41,42,42],      d90:[52,52,53,53,54,54,54],
          d95:[54,54,55,55,56,57,57],      d95x:[66,66,67,67,68,69,69] },
    2:  { h:[86.1,87.4,89.6,92.1,94.7,97.1,98.5],
          s50:[87,87,88,89,89,90,91],      s90:[100,100,101,102,103,103,104],
          s95:[104,105,105,106,107,107,108], s95x:[116,117,117,118,119,119,120],
          d50:[43,43,44,44,45,46,46],      d90:[55,55,56,56,57,58,58],
          d95:[57,58,58,59,60,61,61],      d95x:[69,70,70,71,72,73,73] },
    3:  { h:[92.5,93.9,96.3,99.0,101.8,104.3,105.8],
          s50:[88,89,89,90,91,92,92],      s90:[101,102,102,103,104,105,105],
          s95:[106,106,107,107,108,109,109], s95x:[118,118,119,119,120,121,121],
          d50:[45,46,46,47,48,49,49],      d90:[58,58,59,59,60,61,61],
          d95:[60,61,61,62,63,64,64],      d95x:[72,73,73,74,75,76,76] },
    4:  { h:[98.5,100.2,102.9,105.9,108.9,111.5,113.2],
          s50:[90,90,91,92,93,94,94],      s90:[102,103,104,105,105,106,107],
          s95:[107,107,108,108,109,110,110], s95x:[119,119,120,120,121,122,122],
          d50:[48,49,49,50,51,52,52],      d90:[60,61,62,62,63,64,64],
          d95:[63,64,65,66,67,67,68],      d95x:[75,76,77,78,79,79,80] },
    5:  { h:[104.4,106.2,109.1,112.4,115.7,118.6,120.3],
          s50:[91,92,93,94,95,96,96],      s90:[103,104,105,106,107,108,108],
          s95:[107,108,109,109,110,111,112], s95x:[119,120,121,121,122,123,124],
          d50:[51,51,52,53,54,55,55],      d90:[63,64,65,65,66,67,67],
          d95:[66,67,68,69,70,70,71],      d95x:[78,79,80,81,82,82,83] },
    6:  { h:[110.3,112.2,115.3,118.9,122.4,125.6,127.5],
          s50:[93,93,94,95,96,97,98],      s90:[105,105,106,107,109,110,110],
          s95:[108,109,110,111,112,113,114], s95x:[120,121,122,123,124,125,126],
          d50:[54,54,55,56,57,57,58],      d90:[66,66,67,68,68,69,69],
          d95:[69,70,70,71,72,72,73],      d95x:[81,82,82,83,84,84,85] },
    7:  { h:[116.1,118.0,121.4,125.1,128.9,132.4,134.5],
          s50:[94,94,95,97,98,98,99],      s90:[106,107,108,109,110,111,111],
          s95:[110,110,111,112,114,115,116], s95x:[122,122,123,124,126,127,128],
          d50:[56,56,57,58,58,59,59],      d90:[68,68,69,70,70,71,71],
          d95:[71,71,72,73,73,74,74],      d95x:[83,83,84,85,85,86,86] },
    8:  { h:[121.4,123.5,127.0,131.0,135.1,138.8,141.0],
          s50:[95,96,97,98,99,99,100],     s90:[107,108,109,110,111,112,112],
          s95:[111,112,112,114,115,116,117], s95x:[123,124,124,126,127,128,129],
          d50:[57,57,58,59,59,60,60],      d90:[69,70,70,71,72,72,73],
          d95:[72,73,73,74,75,75,75],      d95x:[84,85,85,86,87,87,87] },
    9:  { h:[126.0,128.3,132.1,136.3,140.7,144.7,147.1],
          s50:[96,97,98,99,100,101,101],   s90:[107,108,109,110,112,113,114],
          s95:[112,112,113,115,116,118,119], s95x:[124,124,125,127,128,130,131],
          d50:[57,58,59,60,61,62,62],      d90:[70,71,72,73,74,74,74],
          d95:[74,74,75,76,76,77,77],      d95x:[86,86,87,88,88,89,89] },
    10: { h:[130.2,132.7,136.7,141.3,145.9,150.1,152.7],
          s50:[97,98,99,100,101,102,103],  s90:[108,109,111,112,113,115,116],
          s95:[112,113,114,116,118,120,121], s95x:[124,125,126,128,130,132,133],
          d50:[59,60,61,62,63,63,64],      d90:[72,73,74,74,75,75,76],
          d95:[76,76,77,77,78,78,78],      d95x:[88,88,89,89,90,90,90] },
    11: { h:[134.7,137.3,141.5,146.4,151.3,155.8,158.6],
          s50:[99,99,101,102,103,104,106], s90:[110,111,112,114,116,117,118],
          s95:[114,114,116,118,120,123,124], s95x:[126,126,128,130,132,135,136],
          d50:[61,61,62,63,63,63,63],      d90:[74,74,75,75,75,76,76],
          d95:[77,78,78,78,78,78,78],      d95x:[89,90,90,90,90,90,90] },
    12: { h:[140.3,143.0,147.5,152.7,157.9,162.6,165.5],
          s50:[101,101,102,104,106,108,109], s90:[113,114,115,117,119,121,122],
          s95:[116,117,118,121,124,126,128], s95x:[128,129,130,133,136,138,140],
          d50:[61,62,62,62,62,63,63],      d90:[75,75,75,75,75,76,76],
          d95:[78,78,78,78,78,79,79],      d95x:[90,90,90,90,90,91,91] },
    13: { h:[147.0,150.0,154.9,160.3,165.7,170.5,173.4],
          s50:[103,104,105,108,110,111,112], s90:[115,116,118,121,124,126,126],
          s95:[119,120,122,125,128,130,131], s95x:[131,132,134,137,140,142,143],
          d50:[61,60,61,62,63,64,65],      d90:[74,74,74,75,76,77,77],
          d95:[78,78,78,78,80,81,81],      d95x:[90,90,90,90,92,93,93] },
    14: { h:[153.8,156.9,162.0,167.5,172.7,177.4,180.1],
          s50:[105,106,109,111,112,113,113], s90:[119,120,123,126,127,128,129],
          s95:[123,125,127,130,132,133,134], s95x:[135,137,139,142,144,145,146],
          d50:[60,60,62,64,65,66,67],      d90:[74,74,75,77,78,79,80],
          d95:[77,78,79,81,82,83,84],      d95x:[89,90,91,93,94,95,96] },
    15: { h:[159.0,162.0,166.9,172.2,177.2,181.6,184.2],
          s50:[108,110,112,113,114,114,114], s90:[123,124,126,128,129,130,130],
          s95:[127,129,131,132,134,135,135], s95x:[139,141,143,144,146,147,147],
          d50:[61,62,64,65,66,67,68],      d90:[75,76,78,79,80,81,81],
          d95:[78,79,81,83,84,85,85],      d95x:[90,91,93,95,96,97,97] },
    16: { h:[162.1,165.0,169.6,174.6,179.5,183.8,186.4],
          s50:[111,112,114,115,115,116,116], s90:[126,127,128,129,131,131,132],
          s95:[130,131,133,134,135,136,137], s95x:[142,143,145,146,147,148,149],
          d50:[63,64,66,67,68,69,69],      d90:[77,78,79,80,81,82,82],
          d95:[80,81,83,84,85,86,86],      d95x:[92,93,95,96,97,98,98] },
    17: { h:[163.8,166.5,170.9,175.8,180.7,184.9,187.5],
          s50:[114,115,116,117,117,118,118], s90:[128,129,130,131,132,133,134],
          s95:[132,133,134,135,137,138,138], s95x:[144,145,146,147,149,150,150],
          d50:[65,66,67,68,69,70,70],      d90:[78,79,80,81,82,82,83],
          d95:[81,82,84,85,86,86,87],      d95x:[93,94,96,97,98,98,99] }
  },

  female: {
    1:  { h:[75.4,76.6,78.6,80.8,83.0,84.9,86.1],
          s50:[84,85,86,86,87,88,88],      s90:[98,99,99,100,101,102,102],
          s95:[101,102,102,103,104,105,105], s95x:[113,114,114,115,116,117,117],
          d50:[41,42,42,43,44,45,46],      d90:[54,55,56,56,57,58,58],
          d95:[59,59,60,60,61,62,62],      d95x:[71,71,72,72,73,74,74] },
    2:  { h:[84.9,86.3,88.6,91.1,93.7,96.0,97.4],
          s50:[87,87,88,89,90,91,91],      s90:[101,101,102,103,104,105,106],
          s95:[104,105,106,106,107,108,109], s95x:[116,117,118,118,119,120,121],
          d50:[45,46,47,48,49,50,51],      d90:[58,58,59,60,61,62,62],
          d95:[62,63,63,64,65,66,66],      d95x:[74,75,75,76,77,78,78] },
    3:  { h:[91.0,92.4,94.9,97.6,100.5,103.1,104.6],
          s50:[88,89,89,90,91,92,93],      s90:[102,103,104,104,105,106,107],
          s95:[106,106,107,108,109,110,110], s95x:[118,118,119,120,121,122,122],
          d50:[48,48,49,50,51,53,53],      d90:[60,61,61,62,63,64,65],
          d95:[64,65,65,66,67,68,69],      d95x:[76,77,77,78,79,80,81] },
    4:  { h:[97.2,98.8,101.4,104.5,107.6,110.5,112.2],
          s50:[89,90,91,92,93,94,94],      s90:[103,104,105,106,107,108,108],
          s95:[107,108,109,109,110,111,112], s95x:[119,120,121,121,122,123,124],
          d50:[50,51,51,53,54,55,55],      d90:[62,63,64,65,66,67,67],
          d95:[66,67,68,69,70,70,71],      d95x:[78,79,80,81,82,82,83] },
    5:  { h:[103.6,105.3,108.2,111.5,114.9,118.1,120.0],
          s50:[90,91,92,93,94,95,96],      s90:[104,105,106,107,108,109,110],
          s95:[108,109,109,110,111,112,113], s95x:[120,121,121,122,123,124,125],
          d50:[52,52,53,55,56,57,57],      d90:[64,65,66,67,68,69,70],
          d95:[68,69,70,71,72,73,73],      d95x:[80,81,82,83,84,85,85] },
    6:  { h:[110.0,111.8,114.9,118.4,122.1,125.6,127.7],
          s50:[92,92,93,94,96,97,97],      s90:[105,106,107,108,109,110,111],
          s95:[109,109,110,111,112,113,114], s95x:[121,121,122,123,124,125,126],
          d50:[54,54,55,56,57,58,59],      d90:[67,67,68,69,70,71,71],
          d95:[70,71,72,72,73,74,74],      d95x:[82,83,84,84,85,86,86] },
    7:  { h:[115.9,117.8,121.1,124.9,128.8,132.5,134.7],
          s50:[92,93,94,95,97,98,99],      s90:[106,106,107,109,110,111,112],
          s95:[109,110,111,112,113,114,115], s95x:[121,122,123,124,125,126,127],
          d50:[55,55,56,57,58,59,60],      d90:[68,68,69,70,71,72,72],
          d95:[72,72,73,73,74,74,75],      d95x:[84,84,85,85,86,86,87] },
    8:  { h:[121.0,123.0,126.5,130.6,134.7,138.5,140.9],
          s50:[93,94,95,97,98,99,100],     s90:[107,107,108,110,111,112,113],
          s95:[110,111,112,113,115,116,117], s95x:[122,123,124,125,127,128,129],
          d50:[56,56,57,59,60,61,61],      d90:[69,70,71,72,72,73,73],
          d95:[72,73,74,74,75,75,75],      d95x:[84,85,86,86,87,87,87] },
    9:  { h:[125.3,127.6,131.3,135.6,140.1,144.1,146.6],
          s50:[95,95,97,98,99,100,101],    s90:[108,108,109,111,112,113,114],
          s95:[112,112,113,114,116,117,118], s95x:[124,124,125,126,128,129,130],
          d50:[57,58,59,60,60,61,61],      d90:[71,71,72,73,73,73,73],
          d95:[74,74,75,75,75,75,75],      d95x:[86,86,87,87,87,87,87] },
    10: { h:[129.7,132.2,136.3,141.0,145.8,150.2,152.8],
          s50:[96,97,98,99,101,102,103],   s90:[109,110,111,112,113,115,116],
          s95:[113,114,114,116,117,119,120], s95x:[125,126,126,128,129,131,132],
          d50:[58,59,59,60,61,61,62],      d90:[72,73,73,73,73,73,73],
          d95:[75,75,76,76,76,76,76],      d95x:[87,87,88,88,88,88,88] },
    11: { h:[135.6,138.3,142.8,147.8,152.8,157.3,160.0],
          s50:[98,99,101,102,104,105,106], s90:[111,112,113,114,116,118,120],
          s95:[115,116,117,118,120,123,124], s95x:[127,128,129,130,132,135,136],
          d50:[60,60,60,61,62,63,64],      d90:[74,74,74,74,74,75,75],
          d95:[76,77,77,77,77,77,77],      d95x:[88,89,89,89,89,89,89] },
    12: { h:[142.8,145.5,149.9,154.8,159.6,163.8,166.4],
          s50:[102,102,104,105,107,108,108], s90:[114,115,116,118,120,122,122],
          s95:[118,119,120,122,124,125,126], s95x:[130,131,132,134,136,137,138],
          d50:[61,61,61,62,64,65,65],      d90:[75,75,75,75,76,76,76],
          d95:[78,78,78,78,79,79,79],      d95x:[90,90,90,90,91,91,91] },
    13: { h:[148.1,150.6,154.7,159.2,163.7,167.8,170.2],
          s50:[104,105,106,107,108,108,109], s90:[116,117,119,121,122,123,123],
          s95:[121,122,123,124,126,126,127], s95x:[133,134,135,136,138,138,139],
          d50:[62,62,63,64,65,65,66],      d90:[75,75,75,76,76,76,76],
          d95:[79,79,79,79,80,80,81],      d95x:[91,91,91,91,92,92,93] },
    14: { h:[150.6,153.0,156.9,161.3,165.7,169.7,172.1],
          s50:[105,106,107,108,109,109,109], s90:[118,118,120,122,123,123,123],
          s95:[123,123,124,125,126,127,127], s95x:[135,135,136,137,138,139,139],
          d50:[63,63,64,65,66,66,66],      d90:[76,76,76,76,77,77,77],
          d95:[80,80,80,80,81,81,82],      d95x:[92,92,92,92,93,93,94] },
    15: { h:[151.7,154.0,157.9,162.3,166.7,170.6,173.0],
          s50:[105,106,107,108,109,109,109], s90:[118,119,121,122,123,123,124],
          s95:[124,124,125,126,127,127,128], s95x:[136,136,137,138,139,139,140],
          d50:[64,64,64,65,66,67,67],      d90:[76,76,76,77,77,78,78],
          d95:[80,80,80,81,82,82,82],      d95x:[92,92,92,93,94,94,94] },
    16: { h:[152.1,154.5,158.4,162.8,167.1,171.1,173.4],
          s50:[106,107,108,109,109,110,110], s90:[119,120,122,123,124,124,124],
          s95:[124,125,125,127,127,128,128], s95x:[136,137,137,139,139,140,140],
          d50:[64,64,65,66,66,67,67],      d90:[76,76,76,77,78,78,78],
          d95:[80,80,80,81,82,82,82],      d95x:[92,92,92,93,94,94,94] },
    17: { h:[154.4,154.7,158.7,163.0,167.4,171.3,173.7],
          s50:[107,108,109,110,110,110,111], s90:[120,121,123,124,124,125,125],
          s95:[125,125,126,127,128,128,128], s95x:[137,137,138,139,140,140,140],
          d50:[64,64,65,66,66,66,67],      d90:[76,76,77,77,78,78,78],
          d95:[80,80,80,81,82,82,82],      d95x:[92,92,92,93,94,94,94] }
  }
};

/* ---------------------------------------------------------------- lookup -- */

/**
 * Pick the reference height column closest to the measured height.
 * Returns index, the charted height, the gap in cm, and whether the
 * measured height sits outside the charted 5th–95th range.
 */
function matchHeightColumn(row, heightCm) {
  let index = 0;
  let smallestGap = Infinity;

  row.h.forEach((refHeight, i) => {
    const gap = Math.abs(refHeight - heightCm);
    if (gap < smallestGap) {
      smallestGap = gap;
      index = i;
    }
  });

  const belowChart = heightCm < row.h[0];
  const aboveChart = heightCm > row.h[row.h.length - 1];

  return {
    index,
    refHeight: row.h[index],
    heightPercentile: HEIGHT_PERCENTILES[index],
    gap: +(heightCm - row.h[index]).toFixed(1),
    outOfRange: belowChart || aboveChart,
    direction: belowChart ? 'below' : aboveChart ? 'above' : 'within'
  };
}

function lookupThresholds(sex, age, heightCm) {
  const row = BP_DATA[sex]?.[age];
  if (!row) return null;

  const column = matchHeightColumn(row, heightCm);
  const i = column.index;

  return {
    column,
    rows: [
      { key: 'p50',  label: '50th percentile',      note: 'Median for age, sex, and stature', systolic: row.s50[i],  diastolic: row.d50[i]  },
      { key: 'p90',  label: '90th percentile',      note: 'Elevated BP at or above this',     systolic: row.s90[i],  diastolic: row.d90[i]  },
      { key: 'p95',  label: '95th percentile',      note: 'Stage 1 hypertension at or above', systolic: row.s95[i],  diastolic: row.d95[i]  },
      { key: 'p95x', label: '95th percentile + 12', note: 'Stage 2 hypertension at or above', systolic: row.s95x[i], diastolic: row.d95x[i] }
    ]
  };
}

/* ------------------------------------------------------- classification -- */
/**
 * AAP 2017 staging. Ages 1–12 use the lower of the percentile cutoff and the
 * fixed adult cutoff. Ages 13 and older use the fixed cutoffs only.
 * The higher of the systolic and diastolic stages sets the overall stage.
 */
function classify(age, thresholds, systolic, diastolic) {
  const byKey = {};
  thresholds.rows.forEach(r => { byKey[r.key] = r; });

  let stage2, stage1, elevated;

  if (age >= 13) {
    stage2   = { s: 140, d: 90 };
    stage1   = { s: 130, d: 80 };
    elevated = { s: 120, d: Infinity };
  } else {
    stage2   = { s: Math.min(byKey.p95x.systolic, 140), d: Math.min(byKey.p95x.diastolic, 90) };
    stage1   = { s: Math.min(byKey.p95.systolic, 130),  d: Math.min(byKey.p95.diastolic, 80) };
    elevated = { s: Math.min(byKey.p90.systolic, 120),  d: byKey.p90.diastolic };
  }

  if (systolic >= stage2.s || diastolic >= stage2.d) {
    return { level: 'stage2', label: 'Stage 2 hypertension',
             detail: 'At or above the 95th percentile + 12 mmHg (or 140/90).' };
  }
  if (systolic >= stage1.s || diastolic >= stage1.d) {
    return { level: 'stage1', label: 'Stage 1 hypertension',
             detail: 'At or above the 95th percentile (or 130/80).' };
  }
  if (systolic >= elevated.s || diastolic >= elevated.d) {
    return { level: 'elevated', label: 'Elevated blood pressure',
             detail: 'At or above the 90th percentile but below the 95th.' };
  }
  return { level: 'normal', label: 'Normal blood pressure',
           detail: 'Below the 90th percentile for age, sex, and stature.' };
}

/* -------------------------------------------------------------- the app -- */

const form         = document.getElementById('bp-form');
const sexInputs    = document.querySelectorAll('input[name="sex"]');
const ageInput     = document.getElementById('age');
const heightInput  = document.getElementById('height');
const systolicIn   = document.getElementById('systolic');
const diastolicIn  = document.getElementById('diastolic');
const resetBtn     = document.getElementById('reset');

const placeholder  = document.getElementById('placeholder');
const results      = document.getElementById('results');
const patientLine  = document.getElementById('patient-line');
const heightNote   = document.getElementById('height-note');
const ladder       = document.getElementById('ladder');
const reading      = document.getElementById('reading');
const errorBox     = document.getElementById('form-error');

const FIELD_ERRORS = {
  age: document.getElementById('age-error'),
  height: document.getElementById('height-error'),
  bp: document.getElementById('bp-error')
};

function selectedSex() {
  const checked = document.querySelector('input[name="sex"]:checked');
  return checked ? checked.value : null;
}

function clearErrors() {
  errorBox.textContent = '';
  errorBox.hidden = true;
  Object.values(FIELD_ERRORS).forEach(el => { el.textContent = ''; });
  [ageInput, heightInput, systolicIn, diastolicIn].forEach(el => {
    el.setAttribute('aria-invalid', 'false');
  });
}

function flagField(input, errorEl, message) {
  errorEl.textContent = message;
  input.setAttribute('aria-invalid', 'true');
}

function validate() {
  clearErrors();
  const problems = [];

  const sex = selectedSex();
  if (!sex) problems.push('Choose a sex to continue.');

  const age = Number(ageInput.value);
  if (ageInput.value === '' || !Number.isFinite(age)) {
    flagField(ageInput, FIELD_ERRORS.age, 'Enter an age.');
    problems.push('age');
  } else if (!Number.isInteger(age) || age < 1 || age > 17) {
    flagField(ageInput, FIELD_ERRORS.age, 'These tables cover whole years from 1 to 17.');
    problems.push('age');
  }

  const height = Number(heightInput.value);
  if (heightInput.value === '' || !Number.isFinite(height)) {
    flagField(heightInput, FIELD_ERRORS.height, 'Enter a height in centimetres.');
    problems.push('height');
  } else if (height < 45 || height > 220) {
    flagField(heightInput, FIELD_ERRORS.height, 'Enter a height between 45 and 220 cm.');
    problems.push('height');
  }

  // Measured BP is optional, but if one box is filled the other is needed.
  const sysRaw = systolicIn.value.trim();
  const diaRaw = diastolicIn.value.trim();
  const systolic = Number(sysRaw);
  const diastolic = Number(diaRaw);
  let measured = null;

  if (sysRaw !== '' || diaRaw !== '') {
    if (sysRaw === '' || diaRaw === '') {
      flagField(sysRaw === '' ? systolicIn : diastolicIn, FIELD_ERRORS.bp,
                'Enter both systolic and diastolic, or leave both blank.');
      problems.push('bp');
    } else if (!Number.isFinite(systolic) || !Number.isFinite(diastolic) ||
               systolic < 40 || systolic > 250 || diastolic < 20 || diastolic > 180) {
      flagField(systolicIn, FIELD_ERRORS.bp, 'Enter a reading between 40/20 and 250/180 mmHg.');
      problems.push('bp');
    } else if (diastolic >= systolic) {
      flagField(diastolicIn, FIELD_ERRORS.bp, 'Diastolic must be lower than systolic.');
      problems.push('bp');
    } else {
      measured = { systolic, diastolic };
    }
  }

  if (problems.length) {
    if (!sex) {
      errorBox.textContent = 'Choose a sex to continue.';
      errorBox.hidden = false;
    }
    return null;
  }

  return { sex, age, height, measured };
}

function heightNoteText(column, height) {
  const stature = `${height.toFixed(1)} cm sits nearest the ${ordinal(column.heightPercentile)} height percentile column (${column.refHeight} cm)`;
  if (column.outOfRange) {
    const side = column.direction === 'below' ? 'shorter than' : 'taller than';
    return `${stature}. This child is ${side} the charted range, so the nearest column is used — read the result with that in mind.`;
  }
  if (Math.abs(column.gap) >= 0.05) {
    const sign = column.gap > 0 ? '+' : '';
    return `${stature}, a difference of ${sign}${column.gap} cm.`;
  }
  return `${stature}.`;
}

function ordinal(n) {
  const suffix = (n % 100 >= 11 && n % 100 <= 13) ? 'th'
    : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
  return `${n}${suffix}`;
}

function render(patient) {
  const thresholds = lookupThresholds(patient.sex, patient.age, patient.height);
  if (!thresholds) return;

  const sexLabel = patient.sex === 'male' ? 'Male' : 'Female';
  patientLine.textContent = `${sexLabel} · ${patient.age} ${patient.age === 1 ? 'year' : 'years'} · ${patient.height.toFixed(1)} cm`;
  heightNote.textContent = heightNoteText(thresholds.column, patient.height);

  const category = patient.measured
    ? classify(patient.age, thresholds, patient.measured.systolic, patient.measured.diastolic)
    : null;

  // Which rung is the reading standing on?
  let activeKey = null;
  if (category) {
    activeKey = { normal: null, elevated: 'p90', stage1: 'p95', stage2: 'p95x' }[category.level];
  }

  ladder.innerHTML = thresholds.rows.map(row => {
    const isActive = row.key === activeKey;
    return `
      <li class="rung rung--${row.key}${isActive ? ' is-active' : ''}">
        <div class="rung__spine" aria-hidden="true"></div>
        <div class="rung__label">
          <span class="rung__name">${row.label}</span>
          <span class="rung__note">${row.note}</span>
        </div>
        <div class="rung__values">
          <div class="value">
            <span class="value__num">${row.systolic}</span>
            <span class="value__tag">systolic</span>
          </div>
          <span class="value__slash" aria-hidden="true">/</span>
          <div class="value">
            <span class="value__num">${row.diastolic}</span>
            <span class="value__tag">diastolic</span>
          </div>
        </div>
      </li>`;
  }).join('');

  if (category) {
    reading.hidden = false;
    reading.className = `reading reading--${category.level}`;
    reading.innerHTML = `
      <p class="reading__eyebrow">Measured ${patient.measured.systolic}/${patient.measured.diastolic} mmHg</p>
      <p class="reading__verdict">${category.label}</p>
      <p class="reading__detail">${category.detail}${patient.age >= 13 ? ' Ages 13 and over are staged against the fixed adult cutoffs.' : ''}</p>
      <p class="reading__caveat">Confirm with repeat readings on separate occasions before acting on a stage.</p>`;
  } else {
    reading.hidden = true;
    reading.innerHTML = '';
  }

  placeholder.hidden = true;
  results.hidden = false;
  results.classList.remove('is-entering');
  void results.offsetWidth; // restart the entrance animation
  results.classList.add('is-entering');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const patient = validate();
  if (patient) render(patient);
});

resetBtn.addEventListener('click', () => {
  form.reset();
  clearErrors();
  results.hidden = true;
  reading.hidden = true;
  placeholder.hidden = false;
  sexInputs[0].focus();
});

// Clearing a field's error as soon as the clinician starts fixing it.
[ageInput, heightInput, systolicIn, diastolicIn].forEach(input => {
  input.addEventListener('input', () => {
    input.setAttribute('aria-invalid', 'false');
    if (input === ageInput) FIELD_ERRORS.age.textContent = '';
    if (input === heightInput) FIELD_ERRORS.height.textContent = '';
    if (input === systolicIn || input === diastolicIn) FIELD_ERRORS.bp.textContent = '';
  });
});

sexInputs.forEach(input => {
  input.addEventListener('change', () => {
    errorBox.hidden = true;
    errorBox.textContent = '';
  });
});
