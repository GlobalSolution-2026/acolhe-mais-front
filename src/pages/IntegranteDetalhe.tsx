import { useParams } from 'react-router-dom';

export default function IntegranteDetalhe() {
  const { rm } = useParams();

  return (
    <div className="container mx-auto p-4 pt-24">
      <h1 className="text-2xl font-bold">Detalhes do Integrante</h1>
      <p className="mt-4">A visualizar o perfil do RM: {rm}</p>
    </div>
  );
}