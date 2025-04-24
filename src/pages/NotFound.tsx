
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-5xl font-bold text-app-blue mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
      <p className="text-gray-500 mb-8 text-center">
        La página que está buscando no existe o ha sido movida.
      </p>
      <Button className="bg-app-blue hover:bg-app-blue-dark" asChild>
        <a href="/">Volver al inicio</a>
      </Button>
    </div>
  );
};

export default NotFound;
