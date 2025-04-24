
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CameraView from '@/components/camera/CameraView';
import Header from '@/components/layout/Header';
import { saveFace } from '@/lib/faceRecognition';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { User } from 'lucide-react';

const EnrollPage: React.FC = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'camera' | 'preview'>('form');
  const [loading, setLoading] = useState(false);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setStep('preview');
  };

  const handleEnroll = async () => {
    if (!employeeId || !capturedImage) {
      toast.error('Se requieren todos los datos');
      return;
    }

    setLoading(true);
    try {
      const success = await saveFace(employeeId, capturedImage, employeeName);
      
      if (success) {
        toast.success('Empleado enrolado con éxito');
        navigate('/');
      } else {
        toast.error('No se pudo enrolar al empleado');
        setStep('camera');
      }
    } catch (error) {
      console.error('Error enrolling face:', error);
      toast.error('Error al enrolar, intente nuevamente');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setStep('camera');
  };
  
  const startCapture = () => {
    if (!employeeId.trim()) {
      toast.error('Por favor ingrese un código de empleado');
      return;
    }
    setStep('camera');
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Enrolar Empleado" showBackButton />
      
      <div className="flex-1 overflow-y-auto">
        {step === 'form' && (
          <div className="container max-w-md py-6 px-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-app-grey p-4 rounded-full">
                    <User size={40} className="text-app-blue" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Código de Empleado *</Label>
                    <Input
                      id="employeeId"
                      placeholder="Ej. EMP001"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Nombre del Empleado (Opcional)</Label>
                    <Input
                      id="employeeName"
                      placeholder="Ej. Juan Pérez"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button 
                  onClick={startCapture} 
                  className="w-full bg-app-blue hover:bg-app-blue-dark"
                  disabled={!employeeId.trim()}
                >
                  Continuar para Capturar Rostro
                </Button>
              </CardFooter>
            </Card>
            
            <p className="mt-4 text-sm text-gray-500 text-center">
              El código de empleado se utilizará como identificador único
            </p>
          </div>
        )}
        
        {step === 'camera' && (
          <div className="h-full">
            <CameraView onCapture={handleCapture} showFaceGuide={true} mode="enroll" />
          </div>
        )}
        
        {step === 'preview' && capturedImage && (
          <div className="container max-w-md py-6 px-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 text-center">
                  Confirmar Imagen
                </h3>
                
                <div className="overflow-hidden rounded-lg mb-4">
                  <img 
                    src={capturedImage} 
                    alt="Vista previa"
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Código: {employeeId}</p>
                  {employeeName && <p className="text-sm text-gray-500">Nombre: {employeeName}</p>}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  onClick={handleEnroll}
                  className="w-full bg-app-blue hover:bg-app-blue-dark"
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Confirmar y Guardar'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleRetake}
                  className="w-full"
                  disabled={loading}
                >
                  Volver a Capturar
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollPage;
