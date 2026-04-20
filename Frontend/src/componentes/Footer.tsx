type FooterProps = {
  total: number;
  completed: number;
  pending: number;
  deleted: number;
};

function Footer({ total, completed, pending, deleted }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-stats">
        <div className="stat">
          <span className="label">Total</span>
          <span className="value">{total}</span>
        </div>

        <div className="stat completed">
          <span className="label">Completadas</span>
          <span className="value">{completed}</span>
        </div>

        <div className="stat pending">
          <span className="label">Pendientes</span>
          <span className="value">{pending}</span>
        </div>

        <div className="stat deleted">
          <span className="label">Eliminadas</span>
          <span className="value">{deleted}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;