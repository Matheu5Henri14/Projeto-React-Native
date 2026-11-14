import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, radius } from '../config/theme';

export const ACADEMIC_NOTICE =
  'Aviso: Este indicador é uma estimativa estritamente acadêmica gerada por modelo estatístico/aprendizado de máquina a partir de dados públicos (SES/MG - SINAN) e não substitui avaliação profissional, policial ou médica.';

const LEVEL_COLORS = {
  Baixo: { background: '#E3F3E5', text: '#1B5E20' },
  Moderado: { background: '#FFF1D6', text: '#8A5200' },
  Alto: { background: '#FDE3E3', text: '#B71C1C' },
};

const pct = (value) =>
  typeof value === 'number'
    ? `${(value * 100).toFixed(1).replace('.', ',')}%`
    : '—';

export default function RiskIndicatorCard({ data, loading, error, onRetry }) {
  const level = data?.nivel;
  const levelColors = LEVEL_COLORS[level];
  const cv = data?.modelo?.validacaoCruzada;
  const base = data?.modelo?.base;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Indicador de risco estimado</Text>

        <View style={styles.tag}>
          <Text style={styles.tagText}>Estimativa acadêmica</Text>
        </View>
      </View>

      {loading && !data && (
        <Text style={styles.muted}>Calculando indicador...</Text>
      )}

      {!!error && !data && (
        <View style={styles.block}>
          <Text style={styles.muted}>{error}</Text>

          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
          >
            <Text style={styles.retry}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      {!!data && !data.disponivel && (
        <Text style={styles.muted}>{data.mensagem}</Text>
      )}

      {!!data && data.disponivel && (
        <View style={styles.block}>
          <View style={styles.levelRow}>
            <View
              style={[
                styles.levelPill,
                { backgroundColor: levelColors?.background },
              ]}
            >
              <Text style={[styles.levelText, { color: levelColors?.text }]}>
                {level}
              </Text>
            </View>

            <Text style={styles.probability}>
              Probabilidade estimada:{' '}
              {String(data.probabilidadeEstimada).replace('.', ',')}%
            </Text>
          </View>

          <Text style={styles.body}>{data.mensagem}</Text>

          <Text style={styles.caveat}>{data.ressalva}</Text>

          <Text style={styles.model}>
            Modelo: {data.modelo?.tipo} · validação cruzada ({cv?.folds} folds)
            · acurácia {pct(cv?.accuracy?.media)} (±{' '}
            {pct(cv?.accuracy?.desvio)}) · recall {pct(cv?.recall?.media)} ·
            AUC {cv?.roc_auc?.media?.toFixed(2).replace('.', ',')}
            {base
              ? ` · base SES/MG 2026 com ${base.registrosComAlvo?.toLocaleString(
                  'pt-BR'
                )} casos com resposta`
              : ''}
            .
          </Text>
        </View>
      )}

      <View style={styles.notice}>
        <Text style={styles.noticeText}>{ACADEMIC_NOTICE}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D9D2E3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: '#EFE6F7',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  block: {
    gap: 8,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  levelPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
  },
  probability: {
    fontSize: 13,
    color: colors.textMuted,
  },
  body: {
    fontSize: 14,
    color: colors.text,
  },
  caveat: {
    fontSize: 12,
    color: colors.textMuted,
  },
  model: {
    fontSize: 11,
    color: colors.textMuted,
  },
  muted: {
    fontSize: 14,
    color: colors.textMuted,
  },
  retry: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  notice: {
    padding: 10,
    backgroundColor: '#EFE6F7',
    borderRadius: radius.sm,
  },
  noticeText: {
    fontSize: 12,
    color: colors.primary,
  },
});
