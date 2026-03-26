import { useEffect, useState } from "react";

const urlImages: Record<string, string> = {
    alpac: new URL("@app/assets/logos/color/alpac.png", import.meta.url).href,
    aminsa: new URL("@app/assets/logos/color/aminsa.png", import.meta.url).href,
    avasa: new URL("@app/assets/logos/color/avasa.png", import.meta.url).href,
    tmn: new URL("@app/assets/logos/color/tmn.png", import.meta.url).href,
    vigemsa: new URL("@app/assets/logos/color/vigemsa.png", import.meta.url).href,

    "alpac.white": new URL("@app/assets/logos/blanco/alpac.png", import.meta.url).href,
    "aminsa.white": new URL("@app/assets/logos/blanco/aminsa.png", import.meta.url).href,
    "avasa.white": new URL("@app/assets/logos/blanco/avasa.png", import.meta.url).href,
    "tmn.white": new URL("@app/assets/logos/blanco/tmn.png", import.meta.url).href,
    "vigemsa.white": new URL("@app/assets/logos/blanco/vigemsa.png", import.meta.url).href,
}

export const useImage = function (companyAlias: string) {

    const [urlImage, setUrlImage] = useState(urlImages.alpac);

    useEffect(() => {

        const key = String(companyAlias).toLowerCase();
        const image = urlImages[key];

        if (image) {
            setUrlImage(image);
        } else {
            setUrlImage(urlImages.alpac);
        }
    }, [companyAlias]);

    return {
        urlImage
    }
}