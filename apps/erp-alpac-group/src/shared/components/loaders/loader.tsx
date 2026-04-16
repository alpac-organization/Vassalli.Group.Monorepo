export const Loader = function ({
  title = "Cargando módulos...",
}: {
  title?: string;
}) {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#1a1f2b]/60 backdrop-blur-[1px] transition-opacity">
      <section className="flex flex-col items-center gap-5 rounded-2xl p-8">
        <span className="loader" />
        <p className="animate-pulse text-sm font-medium tracking-wide text-gray-300">
          {title}
        </p>
      </section>
    </div>
  );
};
