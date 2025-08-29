"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const PdfUI = dynamic(() => import("./components/PdfUI"), { ssr: false });

function toDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export default function HomePage() {
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [logoVariants, setLogoVariants] = useState([null, null, null]); // A, B, C
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [descriptions, setDescriptions] = useState({
    fullLogo: "",
    logoSymbol: "",
    logoType: "",
    differentLogo: "",
    stationery: "",
    clearspace: "",
    iconography: "",
  });
  const [colors, setColors] = useState([
    { label: "Primary", hex: "#1da1f2" },
    { label: "Light", hex: "#ffffff" },
  ]);
  const [stationeryImages, setStationeryImages] = useState([]); // {label, dataUrl}
  const [typography, setTypography] = useState({
    montserratWeights: "Bold/Book/Light",
    sourceSansWeights: "Bold/Book/Light",
  });

  const data = useMemo(
    () => ({ companyName, website, logoDataUrl, logoVariants, descriptions, colors, typography, stationeryImages }),
    [companyName, website, logoDataUrl, logoVariants, descriptions, colors, typography, stationeryImages]
  );

  const onLogoChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await toDataUrl(file);
    setLogoDataUrl(url);
  }, []);

  const onLogoVariantChange = useCallback(async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await toDataUrl(file);
    setLogoVariants((prev) => {
      const copy = prev.slice();
      copy[index] = url;
      return copy;
    });
  }, []);

  const updateColor = (index, key, value) => {
    setColors((prev) => {
      const copy = prev.slice();
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  return (
    <div className={styles.container}>
      <h1>Dynamic Style Guide PDF</h1>
      <div className={styles.grid}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label>
            Company Name
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Co." />
          </label>
          <label>
            Website
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="www.website.com" />
          </label>
          <label>
            Logo Image
            <input type="file" accept="image/*" onChange={onLogoChange} />
          </label>

          <fieldset className={styles.fieldset}>
            <legend>Different Logotype Images</legend>
            <div className={styles.row}>
              <label>
                Logo A (Black BG)
                <input type="file" accept="image/*" onChange={(e) => onLogoVariantChange(0, e)} />
              </label>
              <label>
                Logo B (White BG)
                <input type="file" accept="image/*" onChange={(e) => onLogoVariantChange(1, e)} />
              </label>
              <label>
                Logo C (Blue BG)
                <input type="file" accept="image/*" onChange={(e) => onLogoVariantChange(2, e)} />
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Descriptions</legend>
            {[
              ["fullLogo", "Full Logo"],
              ["logoSymbol", "Logo Symbol"],
              ["logoType", "Logo Type"],
              ["differentLogo", "Different Logotype"],
              ["stationery", "Stationery"],
              ["clearspace", "Logo Clearspace"],
              ["iconography", "Iconography"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <textarea
                  value={descriptions[key]}
                  onChange={(e) => setDescriptions({ ...descriptions, [key]: e.target.value })}
                  rows={2}
                />
              </label>
            ))}
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Color Palette</legend>
            {colors.map((c, i) => (
              <div className={styles.row} key={i}>
                <input
                  value={c.label}
                  onChange={(e) => updateColor(i, "label", e.target.value)}
                  placeholder="Label"
                />
                <input
                  value={c.hex}
                  onChange={(e) => updateColor(i, "hex", e.target.value)}
                  placeholder="#000000"
                />
              </div>
            ))}
            <button type="button" onClick={() => setColors((p) => [...p, { label: "", hex: "#000000" }])}>Add Color</button>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Stationery Images</legend>
            {stationeryImages.map((s, i) => (
              <div className={styles.row} key={i}>
                <input
                  value={s.label}
                  onChange={(e) =>
                    setStationeryImages((prev) => {
                      const copy = prev.slice();
                      copy[i] = { ...copy[i], label: e.target.value };
                      return copy;
                    })
                  }
                  placeholder="Label (e.g., Business Card)"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await toDataUrl(file);
                    setStationeryImages((prev) => {
                      const copy = prev.slice();
                      copy[i] = { ...copy[i], dataUrl: url };
                      return copy;
                    });
                  }}
                />
                <button type="button" onClick={() => setStationeryImages((prev) => prev.filter((_, idx) => idx !== i))}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => setStationeryImages((prev) => [...prev, { label: "", dataUrl: null }])}>Add Stationery</button>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Typography</legend>
            <label>
              Montserrat Weights
              <input
                value={typography.montserratWeights}
                onChange={(e) => setTypography({ ...typography, montserratWeights: e.target.value })}
              />
            </label>
            <label>
              Source Sans Pro Weights
              <input
                value={typography.sourceSansWeights}
                onChange={(e) => setTypography({ ...typography, sourceSansWeights: e.target.value })}
              />
            </label>
          </fieldset>

          <div className={styles.actions}></div>
        </form>

        <div className={styles.preview}>
          <PdfUI data={data} viewerClassName={styles.viewer} downloadClassName={styles.download} />
        </div>
      </div>
    </div>
  );
}


