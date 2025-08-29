import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  AccessibilityRole,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import { ThemedView } from '@/components/ThemedView';

const BotaoTema = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => (
  <Pressable
    onPress={onToggle}
    style={({ pressed }) => [
      styles.themeToggle,
      pressed && { opacity: 0.7 },
    ]}
    accessibilityRole="button"
    accessibilityLabel="Alternar tema"
  >
    <FontAwesome
      name={isDark ? 'sun-o' : 'moon-o'}
      size={24}
      color={isDark ? '#fff' : '#333'}
    />
  </Pressable>
);

const UmidadeDisplay = ({
  umidade,
  sugestao,
  corTexto,
  ultimaAtualizacao,
  statusConexao,
}: {
  umidade: number | null;
  sugestao: string;
  corTexto: string;
  ultimaAtualizacao: string | null;
  statusConexao: string;
}) => (
  <View style={styles.centered}>
    <Text
      style={[styles.mainValue, { color: corTexto }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      accessibilityLabel={`Umidade do solo ${umidade ?? '--'} porcento`}
    >
      {umidade ?? '--'}%
    </Text>
    <Text style={styles.sugestao} accessibilityRole="text">
      {sugestao}
    </Text>
    <Text style={styles.lastUpdate} accessibilityRole="text">
      Última atualização: {ultimaAtualizacao ?? '...'} • {statusConexao}
    </Text>
  </View>
);

const BarraProgresso = ({
  progressoAnimado,
  corFundo,
  corBarra,
  valorAtual,
}: {
  progressoAnimado: Animated.AnimatedInterpolation<string>;
  corFundo: string;
  corBarra: string;
  valorAtual: number | null;
}) => (
  <View style={[styles.progressBackground, { backgroundColor: corFundo }]}>
    <Animated.View
      style={[
        styles.progressFill,
        {
          backgroundColor: corBarra,
          width: progressoAnimado,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: valorAtual ?? 0 }}
    />
  </View>
);

const InfoExtra = ({
  icone,
  corIcone,
  texto,
  isDark,
}: {
  icone: React.ReactNode;
  corIcone: string;
  texto: string;
  isDark: boolean;
}) => (
  <View style={styles.extraInfo}>
    {icone}
    <Text style={[styles.extraText, isDark && styles.textDark]}>{texto}</Text>
  </View>
);

export default function SensorScreen() {
  const [sensorData, setSensorData] = useState({
    umidade: null as number | null,
    temperatura: null as number | null,
    umidadeAr: null as number | null,
  });
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string | null>(null);
  const [statusConexao, setStatusConexao] = useState('Conectando...');
  const progress = React.useRef(new Animated.Value(0)).current;

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Cor do texto da umidade
  const corUmidade = React.useMemo(() => {
    if (sensorData.umidade === null) return '#6b7280'; // cinza
    if (sensorData.umidade <= 20) return '#dc2626'; // vermelho
    if (sensorData.umidade < 50) return '#f59e0b'; // amarelo
    return '#16a34a'; // verde
  }, [sensorData.umidade]);

  // Sugestão com base na umidade
  const sugestaoUmidade = React.useMemo(() => {
    if (sensorData.umidade === null) return 'Aguardando dados...';
    if (sensorData.umidade <= 20) return 'Irrigação imediata necessária.';
    if (sensorData.umidade < 50) return 'Umidade moderada. Acompanhar.';
    return 'Umidade do solo ideal.';
  }, [sensorData.umidade]);

  // Atualiza animação da barra de progresso
  useEffect(() => {
    if (sensorData.umidade !== null) {
      Animated.timing(progress, {
        toValue: sensorData.umidade,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [sensorData.umidade, progress]);

  // WebSocket - conexão e eventos
  useEffect(() => {
    const ws = new WebSocket('ws://192.168.18.8:4000');

    ws.onopen = () => {
      setStatusConexao('Conectado');
      console.log('Frontend: Conectado ao WebSocket');
    };

    ws.onclose = () => {
      setStatusConexao('Desconectado');
      console.log('Frontend: Conexão WebSocket fechada. Tentando reconectar em 3 segundos...');
      setTimeout(() => {
        setStatusConexao('Reconectando...');
        ws.close();
      }, 3000);
    };

    ws.onerror = (error) => {
      setStatusConexao('Erro de conexão');
      console.error('Frontend: Erro no WebSocket:', error);
    };

    ws.onmessage = (event) => {
      try {
        const dados = JSON.parse(event.data);
        const umidade = dados.umidade ?? dados.umidadeSolo ?? null;
        const temperatura = dados.temperatura ?? null;
        const umidadeAr = dados.umidadeAr ?? null;

        setSensorData({ umidade, temperatura, umidadeAr });
        setUltimaAtualizacao(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Frontend: Erro ao processar dados:', error);
      }
    };

    return () => ws.close();
  }, []);

  // Function to control the relay
  const controlRelay = async (state: 'on' | 'off') => {
    try {
      const response = await fetch('http://192.168.18.8:4000/api/relay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      if (response.ok) {
        console.log(`Comando de relé '${state}' enviado com sucesso.`);
        // Optional: Add visual feedback to the user
      } else {
        console.error('Erro ao enviar comando de relé:', response.statusText);
        // Optional: Add error feedback to the user
      }
    } catch (error) {
      console.error('Erro de rede ao controlar relé:', error);
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <ThemedView style={styles.container}>
      <BotaoTema isDark={isDark} onToggle={toggleTheme} />

      <Text style={[styles.title, isDark && styles.titleDark]} accessibilityRole="header">
        Monitor de Umidade do Solo
      </Text>

      <UmidadeDisplay
        umidade={sensorData.umidade}
        sugestao={sugestaoUmidade}
        corTexto={corUmidade}
        ultimaAtualizacao={ultimaAtualizacao}
        statusConexao={statusConexao}
      />

      <BarraProgresso
        progressoAnimado={progressWidth}
        corFundo={isDark ? '#374151' : '#e5e7eb'}
        corBarra={corUmidade}
        valorAtual={sensorData.umidade}
      />

      <View style={styles.extraContainer}>
        <InfoExtra
          icone={<FontAwesome name="thermometer-half" size={20} color="#dc2626" />}
          corIcone="#dc2626"
          texto={`Temperatura: ${sensorData.temperatura ?? '--'}°C`}
          isDark={isDark}
        />
        <InfoExtra
          icone={<FontAwesome name="tint" size={20} color="#3b82f6" />}
          corIcone="#3b82f6"
          texto={`Umidade do Ar: ${sensorData.umidadeAr ?? '--'}%`}
          isDark={isDark}
        />
      </View>

      {/* Relay Control */}
      <View style={styles.relayControlContainer}>
        <Text style={[styles.relayControlTitle, isDark && styles.textDark]}>Controle da Bomba D'água</Text>
        <View style={styles.relayButtonsContainer}>
          <Pressable
            onPress={() => controlRelay('on')}
            style={({ pressed }) => [
              styles.relayButton,
              styles.relayButtonOn,
              pressed && styles.relayButtonPressed,
            ]}
          >
            <Text style={styles.relayButtonText}>Ligar Bomba</Text>
          </Pressable>
          <Pressable
            onPress={() => controlRelay('off')}
            style={({ pressed }) => [
              styles.relayButton,
              styles.relayButtonOff,
              pressed && styles.relayButtonPressed,
            ]}
          >
            <Text style={styles.relayButtonText}>Desligar Bomba</Text>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'transparent', // ThemedView já controla bg
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(200,200,200,0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  titleDark: {
    color: '#f3f4f6',
  },
  centered: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  mainValue: {
    fontSize: 72,
    fontWeight: '900',
  },
  sugestao: {
    fontSize: 16,
    marginTop: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  lastUpdate: {
    fontSize: 12,
    marginTop: 6,
    color: '#9ca3af',
    textAlign: 'center',
  },
  progressBackground: {
    height: 16,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  extraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  extraText: {
    fontSize: 16,
    color: '#374151',
  },
  textDark: {
    color: '#d1d5db',
  },
  relayControlContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  relayControlTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
  },
  relayButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  relayButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  relayButtonOn: {
    backgroundColor: '#22c55e', // green-500
  },
  relayButtonOff: {
    backgroundColor: '#ef4444', // red-500
  },
  relayButtonPressed: {
    opacity: 0.8,
  },
  relayButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
