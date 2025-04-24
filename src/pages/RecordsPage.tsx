
import React, { useState, useEffect } from 'react';
import { getAttendanceRecords, getSavedFaces } from '@/lib/faceRecognition';
import Header from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from 'lucide-react';

interface AttendanceRecord {
  employeeId: string;
  name: string;
  timestamp: number;
  location: string;
}

interface EnrollmentRecord {
  employeeId: string;
  name?: string;
  timestamp: number;
}

const RecordsPage: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [enrolledFaces, setEnrolledFaces] = useState<EnrollmentRecord[]>([]);
  
  useEffect(() => {
    // Cargar registros de asistencia
    const loadRecords = () => {
      const records = getAttendanceRecords();
      setAttendanceRecords(records.sort((a, b) => b.timestamp - a.timestamp));
    };
    
    // Cargar rostros enrolados
    const loadFaces = async () => {
      const faces = await getSavedFaces();
      setEnrolledFaces(faces.sort((a, b) => b.timestamp - a.timestamp));
    };
    
    loadRecords();
    loadFaces();
  }, []);
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header title="Registros" showBackButton />
      
      <div className="flex-1 container p-4">
        <Tabs defaultValue="attendance">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="attendance" className="flex-1">Asistencias</TabsTrigger>
            <TabsTrigger value="enrolled" className="flex-1">Empleados Enrolados</TabsTrigger>
          </TabsList>
          
          {/* Contenido de Asistencias */}
          <TabsContent value="attendance" className="mt-0">
            {attendanceRecords.length === 0 ? (
              <Card>
                <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                  <User size={36} className="text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-500">No hay registros de asistencia</h3>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {attendanceRecords.map((record, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">
                            {record.name !== 'Desconocido' ? record.name : 'Empleado'} ({record.employeeId})
                          </h3>
                          <p className="text-sm text-gray-500">{record.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{formatDate(record.timestamp)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Contenido de Empleados Enrolados */}
          <TabsContent value="enrolled" className="mt-0">
            {enrolledFaces.length === 0 ? (
              <Card>
                <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                  <User size={36} className="text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-500">No hay empleados enrolados</h3>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {enrolledFaces.map((face, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">
                            {face.name || 'Empleado'} <span className="text-gray-500">({face.employeeId})</span>
                          </h3>
                          <p className="text-sm text-gray-500">
                            Enrolado: {formatDate(face.timestamp)}
                          </p>
                        </div>
                        <div className="bg-app-grey h-10 w-10 rounded-full flex items-center justify-center">
                          <User size={20} className="text-app-blue" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecordsPage;
