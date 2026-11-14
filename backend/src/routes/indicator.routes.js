const router = require('express').Router();
const { pool } = require('../database');
const { auth, unlocked } = require('../middleware/auth');
const {
  loadModel,
  buildProfile,
  predictProbability,
  classify,
  summarizeModel,
} = require('../utils/riskModel');

router.use(auth, unlocked);

router.get('/', async (req, res, next) => {
  try {
    const model = loadModel();

    const [records] = await pool.execute(
      'SELECT tipo FROM REGISTRO_SIGILOSO WHERE id_usuario=? LIMIT 300',
      [req.user.id]
    );

    const base = {
      aviso: model.aviso,
      ressalva:
        'O indicador mede a chance estimada de a violência já ter se repetido em casos parecidos, não a gravidade nem o perigo atual. Uma faixa baixa não significa ausência de risco. Em perigo, ligue 190; para orientação, 180.',
      registrosAnalisados: records.length,
      modelo: summarizeModel(model),
    };

    if (records.length === 0) {
      return res.json({
        ...base,
        disponivel: false,
        nivel: null,
        probabilidadeEstimada: null,
        variaveisUsadas: [],
        mensagem:
          'Cadastre ao menos um registro na aba Registros para gerar a estimativa.',
      });
    }

    const profile = buildProfile(records, model);
    const probability = predictProbability(model, profile);

    res.json({
      ...base,
      disponivel: true,
      nivel: classify(model, probability),
      probabilidadeEstimada: Math.round(probability * 1000) / 10,
      variaveisUsadas: Object.entries(profile)
        .filter(([, value]) => value !== null)
        .map(([variavel, valor]) => ({ variavel, valor })),
      mensagem:
        'Estimativa da chance de a violência já ter ocorrido outras vezes em casos com perfil parecido na base pública.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
