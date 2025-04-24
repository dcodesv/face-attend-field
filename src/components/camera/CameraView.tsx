
import React, { useRef, useState, useEffect } from 'react';
import { Camera } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Camera as CameraIcon } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  showFaceGuide?: boolean;
  mode: 'enroll' | 'attendance';
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, showFaceGuide = true, mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Request camera permissions and start the camera stream
    const startCamera = async () => {
      try {
        const permission = await Camera.requestPermissions();
        const hasPermission = permission.camera === 'granted';
        setCameraPermission(hasPermission);
        
        if (hasPermission) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreaming(true);
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast.error('No se pudo acceder a la cámara');
        setCameraPermission(false);
      }
    };

    startCamera();

    // Clean up function to stop all video streams when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        setStreaming(false);
      }
    };
  }, []);

  const captureImage = () => {
    if (!streaming || processing) return;
    
    setProcessing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && canvas) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (context) {
          // Draw the current video frame on the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to image data
          const imageData = canvas.toDataURL('image/jpeg');
          onCapture(imageData);
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error('No se pudo capturar la imagen');
    } finally {
      setProcessing(false);
    }
  };

  if (cameraPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <User size={48} className="mb-4 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold">Permiso de cámara denegado</h3>
        <p className="mb-4 text-gray-500">
          Para usar esta función, necesitamos acceder a la cámara del dispositivo.
          Por favor, active los permisos de cámara en la configuración de su dispositivo.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="camera-container flex-1">
        <video 
          ref={videoRef}
          className="camera-view"
          autoPlay
          playsInline
          muted
        />
        {showFaceGuide && (
          <>
            <div className="face-overlay"></div>
            <div className="pulse-ring"></div>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <Button 
          onClick={captureImage}
          disabled={!streaming || processing}
          size="lg"
          className="rounded-full w-16 h-16 bg-white border border-app-grey-dark shadow-lg"
        >
          <CameraIcon size={28} className="text-app-blue" />
        </Button>
        {mode === 'enroll' && (
          <p className="mt-4 text-white text-sm font-medium text-shadow">
            Centre el rostro y tome la foto
          </p>
        )}
        {mode === 'attendance' && (
          <p className="mt-4 text-white text-sm font-medium text-shadow">
            Posicione su rostro para registrar asistencia
          </p>
        )}
      </div>
    </div>
  );
};

export default CameraView;
