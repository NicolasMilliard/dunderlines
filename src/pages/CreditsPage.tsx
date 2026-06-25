import { MoveLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { RouteLink } from '../components/RouteLink';

type ExternalLinkProps = {
  children: ReactNode;
  href: string;
};

function ExternalLink({ children, href }: ExternalLinkProps) {
  return (
    <a
      className="font-medium text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export function CreditsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col">
        <RouteLink
          className="flex w-fit items-center gap-1 text-sm font-medium text-black/55 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
          to="home"
        >
          <MoveLeft size={16} />
          Back to Dunderlines
        </RouteLink>

        <div className="flex flex-1 items-center py-16">
          <div>
            <h1 className="font-title mt-2 text-3xl text-black">
              I declare credits!
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/65">
              Dunderlines is a small interactive experiment built from a visual
              idea I loved and a generous archive of The Office scripts.
            </p>

            <div className="mt-10 grid gap-8">
              <section className="border-t border-black/10 pt-5">
                <h2 className="text-sm font-semibold text-black">
                  Visual inspiration
                </h2>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  The visual direction is inspired by{' '}
                  <ExternalLink href="https://x.com/boknowsdata">
                    Bo McCready
                  </ExternalLink>{' '}
                  and his{' '}
                  <ExternalLink href="https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fbpytsdp3slzc1.png">
                    original design
                  </ExternalLink>
                  . I wanted to keep that simple line-based idea and turn it
                  into something interactive.
                </p>
              </section>

              <section className="border-t border-black/10 pt-5">
                <h2 className="text-sm font-semibold text-black">
                  Scripts and transcript work
                </h2>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  The scripts come from{' '}
                  <ExternalLink href="https://x.com/brensudol">
                    Brendan Sudol
                  </ExternalLink>
                  , creator of{' '}
                  <ExternalLink href="https://scrantonicity.co/">
                    Scrantonicity
                  </ExternalLink>
                  . I adapted that work and made a few adjustments so it could
                  support the word-counting feature used in Dunderlines.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
