import React from 'react';
export default function Header() {
    return (
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold text-green-400">Cuentacuentos Accesible</h1>
        <p className="text-gray-400 mt-2">
          Presiona <strong>Control</strong> para activar el control por voz, o <strong>Z</strong> para escuchar los comandos disponibles.
        </p>
      </div>
    );
  }
  