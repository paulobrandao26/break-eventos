export function ListaModalidades({ modalidades }: { modalidades: string[] }) {
  return (
    <div className="tags">
      {modalidades.map((m) => (
        <span key={m} className="tag">{m}</span>
      ))}
    </div>
  );
}
