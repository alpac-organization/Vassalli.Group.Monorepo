import defaultLogo from "../../../assets/logos/blanco/vasalli-logo.png";

interface ContentLoadedProps {
  imageUrl?: string;
}
export const ContentLoaded = function ({ imageUrl }: ContentLoadedProps) {
  return (
    <div className="min-h-screen bg-alpac-primary-700 flex justify-center items-center">
      <section className="flex flex-col items-center text-xl gap-7">
        <img src={imageUrl || defaultLogo} width={90} alt="logo loading" />
        <span className="loader"></span>
      </section>
    </div>
  );
};
