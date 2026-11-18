const TINTAS = ["azul", "rosa", "amarelo"];

/** Modalidades como carimbos de tinta, cada uma levemente torta. */
export function ListaModalidades({ modalidades }: { modalidades: string[] }) {
  return (
    <ul className="carimbos">
      {modalidades.map((m, i) => (
        <li key={m} className={`carimbo carimbo--${TINTAS[i % TINTAS.length]}`} style={{ "--giro": `${[-3, 2, -1.5, 3][i % 4]}deg` } as React.CSSProperties}>
          {m}
        </li>
      ))}
    </ul>
  );
}
