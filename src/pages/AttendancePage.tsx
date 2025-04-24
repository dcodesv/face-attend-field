
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraView from '@/components/camera/CameraView';
import Header from '@/components/layout/Header';
import { recognizeFace, saveAttendanceRecord, getSavedFaces } from '@/lib/faceRecognition';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Camera } from 'lucide-react';

const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [recognized, setRecognized] = useState(false);
  const [employeeData, setEmployeeData] = useState<{employeeId: string; name?: string} | null>(null);
  const [hasFacesEnrolled, setHasFacesEnrolled] = useState(false);

  useEffect(() => {
    // Verificar si hay rostros enrolados
    const checkEnrolledFaces = async () => {
      const faces = await getSavedFaces();
      setHasFacesEnrolled(faces.length > 0);
    };

    checkEnrolledFaces();
  }, []);

  const handleCapture = async (imageData: string) => {
    if (processing) return;
    
    setProcessing(true);
    
    try {
      // Intentar reconocer el rostro
      const result = await recognizeFace(imageData);
      
      if (result) {
        // Rostro reconocido
        setEmployeeData(result);
        setRecognized(true);
        
        // Guardar el registro de asistencia
        saveAttendanceRecord(result.employeeId, result.name);
        
        toast.success('¡Asistencia registrada con éxito!', {
          description: `Empleado: ${result.employeeId}`
        });
      } else {
        // No se reconoció ningún rostro
        toast.error('Rostro no reconocido', {
          description: 'Por favor, intente nuevamente o enrole al empleado.'
        });
      }
    } catch (error) {
      console.error('Error en reconocimiento facial:', error);
      toast.error('Error procesando imagen');
    } finally {
      setProcessing(false);
    }
  };

  if (!hasFacesEnrolled) {
    return (
      <div className="flex flex-col h-screen">
        <Header title="Marcar Asistencia" showBackButton />
        
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
              <User size={48} className="mb-4 text-app-blue" />
              
              <h3 className="text-lg font-semibold mb-2">No hay empleados enrolados</h3>
              <p className="text-gray-500 mb-6">
                Debe enrolar al menos un empleado antes de poder marcar asistencia.
              </p>
              
              <Button 
                onClick={() => navigate('/enroll')}
                className="bg-app-blue hover:bg-app-blue-dark"
              >
                Enrolar Empleado
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (recognized && employeeData) {
    return (
      <div className="flex flex-col h-screen">
        <Header title="Asistencia Registrada" showBackButton />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="container max-w-md p-6 text-center">
            <div className="mb-8">
              <div className="bg-green-100 text-green-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">¡Asistencia Registrada!</h2>
              <p className="text-gray-600">
                {new Date().toLocaleString()}
              </p>
            </div>
            
            <Card className="mb-6">
              <CardContent className="py-6">
                <h3 className="font-semibold text-lg mb-4">Información del Empleado</h3>
                
                <div className="text-left">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">ID Empleado:</span>
                    <span className="font-medium">{employeeData.employeeId}</span>
                  </div>
                  
                  {employeeData.name && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Nombre:</span>
                      <span className="font-medium">{employeeData.name}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Ubicación:</span>
                    <span className="font-medium">Campo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setRecognized(false);
                  setEmployeeData(null);
                }}
                className="w-full bg-app-blue hover:bg-app-blue-dark"
              >
                Registrar Otra Asistencia
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Marcar Asistencia" showBackButton />
      
      <div className="flex-1">
        <CameraView 
          onCapture={handleCapture}
          showFaceGuide={true}
          mode="attendance"
        />
      </div>
    </div>
  );
};

export default AttendancePage;
