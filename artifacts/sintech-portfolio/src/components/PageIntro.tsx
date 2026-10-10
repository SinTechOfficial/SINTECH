type PageIntroProps = {
  eyebrow: string;
  title: string;
  copy: string;
};

export function PageIntro({ eyebrow, title, copy }: PageIntroProps) {
  return (
    <header className="container-wide pb-10 pt-16 md:pb-14 md:pt-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1
        tabIndex={-1}
        className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
      >
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{copy}</p>
    </header>
  );
}
