import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div className="wrap">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="display" style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "16px 0 24px" }}>
          Panne sèche
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 28 }}>Cette page n&apos;existe pas ou a été déplacée.</p>
        <Link href="/" className="btn btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}
