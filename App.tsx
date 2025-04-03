import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const CapivaraLabScreen = () => {
  

//----------------------------------------------------------------------------------------

  const [data, setData] = useState<{ day: string; value: number }[]>([]);
  const [ultimaLeitura, setUltimaLeitura] = useState<{
    co2Level: number;
    airQuality: string;
    location: string;
    timestamp: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseHistorico = await fetch("http://localhost:3001/sensor/media-semana");
        const resultHistorico = await responseHistorico.json();

        if (!responseHistorico.ok) throw new Error(resultHistorico.message || "Erro ao buscar dados");

        const formattedData = resultHistorico.dados.map((dado: any) => ({
          day: dado.day,
          value: dado.value,
        }));

        setData(formattedData);

        const responseUltimaLeitura = await fetch("http://localhost:3001/sensor/media-semana");
        const resultUltimaLeitura = await responseUltimaLeitura.json();

        if (!responseUltimaLeitura.ok) throw new Error(resultUltimaLeitura.message || "Erro ao buscar última leitura");

        setUltimaLeitura(resultUltimaLeitura.dados);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAirQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "boa":
        return "bg-green-500";
      case "moderada":
        return "bg-yellow-500";
      case "ruim":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
           {/* Logo */}
        <View style={styles.logoContainer}>
            <Image 
              source={require('./assets/CapivaraLab-SF.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       
        <View style={styles.card}>

  
          {/* CO2 Level */}
          <View style={styles.infoRow}>
            <Ionicons name="analytics-outline" size={24} color="#3b82f6" />
            <Text style={styles.infoLabel}>Nível de CO<Text style={styles.subscript}>2</Text>:</Text>
            <View style={styles.valueContainer}>
              <View style={styles.dotYellow} />
              <Text style={styles.infoValue}> {ultimaLeitura ? `${ultimaLeitura.co2Level} PPM` : "2000 PPM"}</Text>
            </View>
          </View>

          {/* Air Quality */}
          <View style={styles.infoRow}>
            <Ionicons name="cloud-outline" size={24} color="#3b82f6" />
            <Text style={styles.infoLabel}>Qualidade do Ar:</Text>
            <View style={styles.airQualityBadge}>
              <Text style={styles.airQualityText}> {ultimaLeitura ? `${ultimaLeitura.airQuality}` : "Moderada"}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.infoRow}>
            <FontAwesome5 name="map-marker-alt" size={24} color="#f43f5e" />
            <Text style={styles.infoLabel}>Localização:</Text>
            <Text style={styles.infoValue}> {ultimaLeitura ? `${ultimaLeitura.location}` : "IFMA-Campus Timon"}</Text>
          </View>

          {/* Last Update */}
          <View style={styles.updateRow}>
            <MaterialIcons name="access-time" size={24} color="#6b7280" />
            <View style={styles.updateInfo}>
              <Text style={styles.updateLabel}>Última Atualização:</Text>
              <Text style={styles.updateTime}> {ultimaLeitura ? `${formatarData(ultimaLeitura.timestamp)}` : "31/03/2025, 22:37:42"}</Text>
            </View>
          </View>

          <Text style={styles.updateNote}>
            As informações serão atualizadas a cada 10 minutos
          </Text>
        </View>

        {/* Refresh Button */}
       {/* <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>Atualizar Página</Text>
        </TouchableOpacity>
        */}
        

        {/* History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>
            Histórico de CO<Text style={styles.subscript}>2</Text> - Semanal
          </Text>
          <View style={styles.graphContainer}>
            {/* Y-axis labels */}
            <View style={styles.yAxisLabels}>
              <Text style={styles.yAxisText}>2500</Text>
              <Text style={styles.yAxisText}>2000</Text>
              <Text style={styles.yAxisText}>1500</Text>
              <Text style={styles.yAxisText}>1000</Text>
              <Text style={styles.yAxisText}>500</Text>
              <Text style={styles.yAxisText}>0</Text>
            </View>
            
            {/* Graph area - in a real app, you would place your chart component here */}
            <View style={styles.graphArea}>
              {/* This is where you would render your actual chart */}
              <View style={styles.yAxis} />
            </View>
          </View>
          
          <Text style={styles.xAxisLabel}>Últimos 7 dias</Text>
        </View>
      </ScrollView>
      
      {/* Navigation Button */}
      <View style={styles.navButtonContainer}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>N</Text>
        </TouchableOpacity>
      </View>
      
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 80, // Add padding to account for footer
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 60,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1f2937',
  },
  infoValue: {
    fontSize: 16,
    marginLeft: 8,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  subscript: {
    fontSize: 12,
    lineHeight: 20,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  dotYellow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f59e0b',
    marginRight: 8,
  },
  airQualityBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  airQualityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  updateInfo: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  updateTime: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight:"bold"

  },
  updateNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historySection: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  graphContainer: {
    flexDirection: 'row',
    height: 300,
    marginBottom: 10,
  },
  yAxisLabels: {
    width: 50,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisText: {
    color: '#6b7280',
    fontSize: 12,
  },
  graphArea: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#6b7280',
  },
  xAxisLabel: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginTop: 10,
  },
  navButtonContainer: {
    position: 'absolute',
    left: 20,
    bottom: 80,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
});

export default CapivaraLabScreen;