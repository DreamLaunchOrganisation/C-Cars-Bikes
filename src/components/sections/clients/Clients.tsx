import { getContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Gallery } from "./Gallery";

export async function Clients() {
  const { clients } = await getContent();
  if (clients.length === 0) return null;

  return (
    <section id="clients" style={{ paddingTop: 0 }} aria-labelledby="clients-title">
      <div className="wrap">
        <Reveal>
          <Gallery
            photos={clients}
            heading={
              <>
                <p className="eyebrow">Nos clients</p>
                <h2 id="clients-title" className="display">
                  Passés par l&apos;atelier
                </h2>
              </>
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
