import { gallery } from "@/data/gallery";
import { Reveal } from "@/components/ui/Reveal";
import { Gallery } from "./Gallery";

export function Clients() {
  return (
    <section id="clients" style={{ paddingTop: 0 }} aria-labelledby="clients-title">
      <div className="wrap">
        <Reveal>
          <Gallery
            categories={gallery}
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
