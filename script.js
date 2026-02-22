const BASE_PRICE = 30000;
const PLAY_ADD_LIMIT = 15000;

const PLAY_POINTS = {
  oral: 3000,
  cosplay: 3000,
  deepKiss: 2000,
  foot: 2000,
  hard: 5000
};

// ===== 写真アップロード処理 =====
document.getElementById("photoUpload").addEventListener("change", handleImage);

function handleImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  const reader = new FileReader();

  reader.onload = ev => img.src = ev.target.result;
  img.onload = () => analyzeImage(img);

  reader.readAsDataURL(file);
}

function analyzeImage(img) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const score = calculatePhotoScore(imageData, canvas.width, canvas.height);

  document.getElementById("photo").value = score;
}

// ===== 写真スコア算出 =====
function aspectScore(w, h) {
  const ratio = h / w;
  if (ratio >= 1.6) return 30;
  if (ratio >= 1.4) return 20;
  return 10;
}

function brightnessScore(imageData) {
  let total = 0;
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    total += (d[i] + d[i+1] + d[i+2]) / 3;
  }
  const avg = total / (d.length / 4);
  if (avg >= 180) return 25;
  if (avg >= 130) return 20;
  if (avg >= 90) return 10;
  return 5;
}

function contrastScore(imageData) {
  let min = 255, max = 0;
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (d[i] + d[i+1] + d[i+2]) / 3;
    min = Math.min(min, v);
    max = Math.max(max, v);
  }
  const diff = max - min;
  if (diff >= 150) return 25;
  if (diff >= 100) return 20;
  if (diff >= 60) return 10;
  return 5;
}

function calculatePhotoScore(imageData, w, h) {
  let score = 0;
  score += aspectScore(w, h);
  score += brightnessScore(imageData);
  score += contrastScore(imageData);
  return Math.min(100, score);
}

// ===== 出演料計算 =====
function ageFactor(age) {
  if (age <= 22) return 1.2;
  if (age <= 25) return 1.1;
  if (age <= 29) return 1.0;
  if (age <= 34) return 0.9;
  return 0.8;
}

function bmiFactor(heightCm, weightKg) {
  const h = heightCm / 100;
  const bmi = weightKg / (h * h);
  if (bmi <= 20.9) return 1.15;
  if (bmi <= 22.9) return 1.1;
  if (bmi <= 24.9) return 1.0;
  if (bmi <= 26.9) return 0.9;
  return 0.8;
}

function styleFactor(bust, waist) {
  let f = 1.0;
  if (bust >= 85) f += 0.1;
  else if (bust >= 80) f += 0.05;
  else if (bust < 75) f -= 0.05;

  if (waist <= 58) f += 0.05;
  else if (waist <= 62) f += 0.03;
  return f;
}

function photoFactor(score) {
  if (score >= 90) return 1.2;
  if (score >= 80) return 1.1;
  if (score >= 70) return 1.0;
  if (score >= 60) return 0.9;
  return 0.8;
}

function rank(price) {
  if (price >= 60000) return "S";
  if (price >= 50000) return "A";
  if (price >= 40000) return "B";
  if (price >= 30000) return "C";
  return "D";
}

function calculate() {
  const age = Number(document.getElementById("age").value);
  if (age < 20) {
    alert("20歳以上のみ診断可能です");
    return;
  }

  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);
  const bust = Number(document.getElementById("bust").value);
  const waist = Number(document.getElementById("waist").value);
  const photo = Number(document.getElementById("photo").value) || 70;

  const plays = [...document.querySelectorAll("input[type=checkbox]:checked")]
    .map(p => p.value);

  let playAdd = plays.reduce((sum, p) => sum + (PLAY_POINTS[p] || 0), 0);
  playAdd = Math.min(playAdd, PLAY_ADD_LIMIT);

  const base =
    BASE_PRICE *
    ageFactor(age) *
    bmiFactor(height, weight) *
    styleFactor(bust, waist) *
    photoFactor(photo);

  const price = base + playAdd;
  const min = Math.round(price * 0.9);
  const max = Math.round(price * 1.1);

  document.getElementById("result").innerHTML = `
    <h2>${min.toLocaleString()}円 〜 ${max.toLocaleString()}円</h2>
    <p>評価ランク：${rank(price)}</p>
    <p>写真スコア：${photo}点</p>
  `;
}
