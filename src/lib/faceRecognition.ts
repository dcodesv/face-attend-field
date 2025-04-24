
// Interface para guardar los datos de rostros
export interface FaceData {
  employeeId: string;
  faceDescriptor: number[];
  name?: string;
  timestamp: number;
}

// Variables para el sistema de reconocimiento facial simplificado
let faceMatcher: any = null;

export const initFaceRecognition = async (): Promise<void> => {
  try {
    console.log("Inicializando sistema de reconocimiento facial simulado");
    
    // Cargar datos de rostros guardados previamente
    await loadSavedFaces();
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error inicializando reconocimiento facial:", error);
    return Promise.reject(error);
  }
};

// Función para simular la detección de rostros en una imagen
export const detectFace = async (imageElement: HTMLImageElement): Promise<any> => {
  try {
    // Esta es una simulación simplificada - en un entorno real usaríamos
    // un modelo de ML para detectar rostros
    console.log("Simulando detección de rostro");
    
    // Simulamos que siempre detectamos un rostro para simplificar
    const simulatedFaceDetection = {
      boundingBox: {
        x: Math.random() * 50,
        y: Math.random() * 50,
        width: 200,
        height: 200
      },
      landmarks: Array(68).fill(0).map(() => ({ x: Math.random() * 300, y: Math.random() * 300 })),
      faceScore: 0.98
    };
    
    return simulatedFaceDetection;
  } catch (error) {
    console.error("Error detectando rostro:", error);
    return null;
  }
};

// Función para extraer características del rostro (simulado)
export const extractFaceFeatures = async (imageElement: HTMLImageElement): Promise<number[] | null> => {
  const faceDetection = await detectFace(imageElement);
  
  if (!faceDetection) {
    return null;
  }
  
  try {
    // Para simulación, creamos un vector de características aleatorio simulado
    // En un caso real, estas características se extraerían del rostro detectado
    const descriptor = Array.from({length: 128}, () => Math.random() * 2 - 1);
    
    return descriptor;
  } catch (error) {
    console.error("Error extrayendo características faciales:", error);
    return null;
  }
};

// Función para guardar un nuevo rostro en la base de datos
export const saveFace = async (
  employeeId: string, 
  imageData: string,
  name?: string
): Promise<boolean> => {
  try {
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = async () => {
        const descriptor = await extractFaceFeatures(img);
        
        if (!descriptor) {
          console.error("No se pudo extraer las características faciales");
          resolve(false);
          return;
        }
        
        const faceData: FaceData = {
          employeeId,
          faceDescriptor: descriptor,
          name,
          timestamp: Date.now(),
        };
        
        // Guardar en localStorage (en una aplicación real sería en una base de datos)
        const savedFaces = await getSavedFaces();
        savedFaces.push(faceData);
        localStorage.setItem('savedFaces', JSON.stringify(savedFaces));
        
        // Actualizar el faceMatcher con los nuevos datos
        await loadSavedFaces();
        
        console.log(`Rostro guardado para el empleado ${employeeId}`);
        resolve(true);
      };
      
      img.onerror = () => {
        console.error("Error cargando la imagen");
        resolve(false);
      };
      
      img.src = imageData;
    });
  } catch (error) {
    console.error("Error guardando rostro:", error);
    return false;
  }
};

// Función para reconocer un rostro
export const recognizeFace = async (imageData: string): Promise<{employeeId: string, name?: string} | null> => {
  try {
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = async () => {
        const descriptor = await extractFaceFeatures(img);
        
        if (!descriptor) {
          console.error("No se pudo extraer las características faciales");
          resolve(null);
          return;
        }
        
        // Buscar la mejor coincidencia entre los rostros guardados
        const savedFaces = await getSavedFaces();
        
        if (savedFaces.length === 0) {
          console.log("No hay rostros guardados para comparar");
          resolve(null);
          return;
        }
        
        let bestMatch = null;
        let highestSimilarity = -1;
        
        // Calcular similitud con cada rostro guardado
        for (const face of savedFaces) {
          const similarity = cosineSimilarity(descriptor, face.faceDescriptor);
          
          if (similarity > highestSimilarity && similarity > 0.8) { // Umbral de similitud
            highestSimilarity = similarity;
            bestMatch = face;
          }
        }
        
        if (bestMatch) {
          console.log(`Rostro reconocido: Empleado ${bestMatch.employeeId}`);
          resolve({
            employeeId: bestMatch.employeeId,
            name: bestMatch.name
          });
        } else {
          console.log("No se encontró coincidencia");
          resolve(null);
        }
      };
      
      img.onerror = () => {
        console.error("Error cargando la imagen");
        resolve(null);
      };
      
      img.src = imageData;
    });
  } catch (error) {
    console.error("Error reconociendo rostro:", error);
    return null;
  }
};

// Función para cargar los rostros guardados
const loadSavedFaces = async (): Promise<void> => {
  const savedFaces = await getSavedFaces();
  console.log(`Caras guardadas cargadas: ${savedFaces.length}`);
};

// Función auxiliar para obtener los rostros guardados
export const getSavedFaces = async (): Promise<FaceData[]> => {
  const facesStr = localStorage.getItem('savedFaces');
  return facesStr ? JSON.parse(facesStr) : [];
};

// Función para calcular similitud del coseno entre dos vectores
const cosineSimilarity = (vec1: number[], vec2: number[]): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    normA += vec1[i] * vec1[i];
    normB += vec2[i] * vec2[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Función para guardar registro de asistencia
export const saveAttendanceRecord = (employeeId: string, name?: string): void => {
  const record = {
    employeeId,
    name: name || 'Desconocido',
    timestamp: Date.now(),
    location: 'Campo'
  };
  
  const records = getAttendanceRecords();
  records.push(record);
  localStorage.setItem('attendanceRecords', JSON.stringify(records));
};

// Obtener registros de asistencia
export const getAttendanceRecords = () => {
  const records = localStorage.getItem('attendanceRecords');
  return records ? JSON.parse(records) : [];
};
