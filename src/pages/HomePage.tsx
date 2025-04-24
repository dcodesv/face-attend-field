
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Camera, QrCode } from 'lucide-react';
import { initFaceRecognition } from '@/lib/faceRecognition';
import { useEffect } from 'react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializar el sistema de reconocimiento facial al cargar la página
    const initFace = async () => {
      try {
        await initFaceRecognition();
      } catch (error) {
        console.error("Error initializing face recognition:", error);
      }
    };
    
    initFace();
  }, []);

  return (
    <div className="container max-w-md py-8 px-4 h-full flex flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">FaceAttend</h1>
        <p className="text-gray-500">Sistema de asistencia por reconocimiento facial</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 flex-grow">
        {/* Tarjeta de Enrolamiento */}
        <Card 
          className="transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          onClick={() => navigate('/enroll')}
        >
          <CardContent className="flex items-center p-6">
            <div className="mr-4 bg-app-grey p-3 rounded-full">
              <User size={24} className="text-app-blue" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Enrolar Empleado</h2>
              <p className="text-sm text-gray-500">Registrar nuevo rostro con código de empleado</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Tarjeta de Marcar Asistencia */}
        <Card 
          className="transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          onClick={() => navigate('/attendance')}
        >
          <CardContent className="flex items-center p-6">
            <div className="mr-4 bg-app-grey p-3 rounded-full">
              <Camera size={24} className="text-app-blue" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Marcar Asistencia</h2>
              <p className="text-sm text-gray-500">Registrar entrada/salida por reconocimiento facial</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Tarjeta de Ver Reportes */}
        <Card 
          className="transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          onClick={() => navigate('/records')}
        >
          <CardContent className="flex items-center p-6">
            <div className="mr-4 bg-app-grey p-3 rounded-full">
              <QrCode size={24} className="text-app-blue" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Ver Registros</h2>
              <p className="text-sm text-gray-500">Consultar historial de asistencias</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <footer className="mt-10 text-center text-xs text-gray-400">
        <p>FaceAttend © 2025 • v1.0</p>
      </footer>
    </div>
  );
};

export default HomePage;
