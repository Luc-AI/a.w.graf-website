export function Divider({ flush = false }: { flush?: boolean }) {
  return (
    <div className={`container${flush ? '' : ' section-pad-top'}`}>
      <div className="divider-line" />
    </div>
  );
}
