const fs = require('fs');
const path = require('path');

const MODEL_PATH = path.join(__dirname, '..', '..', 'data', 'modelo_ds.json');
let cache = null;

function loadModel() {
  if (!cache) {
    cache = JSON.parse(fs.readFileSync(MODEL_PATH, 'utf8'));
  }
  return cache;
}

const sigmoid = (z) => 1 / (1 + Math.exp(-z));

function buildProfile(records, model) {
  const types = new Set(records.map((r) => r.tipo).filter(Boolean));

  const profile = {};
  for (const col of Object.keys(model.modelo.categoricas)) {
    profile[col] = null;
  }

  if (records.length > 0) {
    profile.viol_fisic = types.has('Agressão física') ? 'Sim' : 'Não';
    profile.viol_psico =
      types.has('Ameaça verbal') || types.has('Controle') ? 'Sim' : 'Não';
  }

  return profile;
}

function predictProbability(model, profile) {
  let z = model.modelo.intercepto;

  for (const [col, p] of Object.entries(model.modelo.numericas)) {
    const raw = profile[col];
    const value = raw === undefined || raw === null ? p.media : Number(raw);
    z += ((value - p.media) / p.escala) * p.coef;
  }

  for (const [col, coefs] of Object.entries(model.modelo.categoricas)) {
    const value = profile[col];

    if (value === undefined || value === null) {
      const freqs = model.modelo.frequencias[col];
      z += Object.entries(coefs).reduce(
        (sum, [cat, coef]) => sum + coef * (freqs[cat] ?? 0),
        0
      );
    } else {
      z += coefs[value] ?? 0;
    }
  }

  return sigmoid(z);
}

function classify(model, probability) {
  if (probability >= model.faixas.alto) return 'Alto';
  if (probability >= model.faixas.moderado) return 'Moderado';
  return 'Baixo';
}

function summarizeModel(model) {
  const cv = model.metricas.validacaoCruzada;
  const teste = model.metricas.teste;

  return {
    tipo: model.modelo.tipo,
    geradoEm: model.geradoEm,
    base: model.base,
    alvo: model.alvo,
    validacaoCruzada: { folds: cv.folds, estrategia: cv.estrategia, ...cv.regressaoLogistica },
    teste: teste.regressaoLogistica,
    baselineAcuracia: teste.baselineAcuracia,
    matrizConfusao: model.metricas.matrizConfusaoRegressaoLogistica,
  };
}

module.exports = {
  loadModel,
  buildProfile,
  predictProbability,
  classify,
  summarizeModel,
};
