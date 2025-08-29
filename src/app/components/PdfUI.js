"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";

// Use built-in PDF fonts (Helvetica, Times-Roman, Courier) to avoid external font format issues

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "#0f2734",
    color: "#cde7fb",
    padding: 28,
    fontSize: 10,
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    color: "#3ec1ff",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#1da1f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 3,
    color: "#001824",
  },
  section: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2e4856",
  },
  sectionTitle: {
    color: "#77d1ff",
    fontSize: 12,
    marginBottom: 6,
  },
  row: { flexDirection: "row", gap: 12 },
  col: { flexGrow: 1 },
  logo: { width: 80, height: 80, objectFit: "contain" },
  paletteRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  swatch: { width: 60, height: 60, borderRadius: 30 },
  swatchLabel: { fontSize: 8, marginTop: 4 },
});

function StyleGuidePDF({ data }) {
  const { companyName, website, logoDataUrl, logoVariants = [], descriptions, colors, typography, stationeryImages = [] } = data;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.headerRow}>
          <View>
            <Text style={pdfStyles.title}>Style Guide</Text>
            <Text style={pdfStyles.subtitle}>Example</Text>
          </View>
          <View>
            <Text style={pdfStyles.badge}>{website || "www.example.com"}</Text>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Company Logotype</Text>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text>01. Full Logo</Text>
              <Text>{descriptions.fullLogo || "Description of full logo."}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text>02. Logo Symbol</Text>
              <Text>{descriptions.logoSymbol || "Description of logo symbol."}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text>03. Logo Type</Text>
              <Text>{descriptions.logoType || "Description of logo type."}</Text>
            </View>
          </View>
          <View style={[pdfStyles.row, { alignItems: "center", marginTop: 10 }]}>
            {logoDataUrl ? (
              <Image src={logoDataUrl} style={pdfStyles.logo} />
            ) : (
              <View style={[pdfStyles.logo, { borderWidth: 1, borderColor: "#2e4856", alignItems: "center", justifyContent: "center" }]}>
                <Text>Logo</Text>
              </View>
            )}
            <Text style={{ fontSize: 18, marginLeft: 12, color: "#77d1ff" }}>{companyName || "Company"}</Text>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Different Logotype</Text>
          <Text>{descriptions.differentLogo || "Brief about different logo usages."}</Text>
          <View style={[pdfStyles.row, { marginTop: 8 }]}>
            {["A", "B", "C"].map((k, idx) => {
              const src = logoVariants[idx] || logoDataUrl;
              return (
                <View key={k} style={{ borderWidth: 1, borderColor: "#2e4856", padding: 8, alignItems: "center", width: 110 }}>
                  {src ? (
                    <Image src={src} style={{ width: 70, height: 28, objectFit: "contain" }} />
                  ) : (
                    <Text>Logo</Text>
                  )}
                  <Text style={{ marginTop: 6 }}>Logo {k}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.sectionTitle}>Stationery</Text>
              <Text>{descriptions.stationery || "Stationery overview text."}</Text>
              <View style={[pdfStyles.row, { flexWrap: "wrap", marginTop: 8 }]}>            
                {stationeryImages.map((s, i) => (
                  <View key={i} style={{ borderWidth: 1, borderColor: "#2e4856", padding: 6, marginRight: 6, marginBottom: 6, alignItems: "center" }}>
                    {s?.dataUrl ? (
                      <Image src={s.dataUrl} style={{ width: 120, height: 80, objectFit: "contain" }} />
                    ) : (
                      <View style={{ width: 120, height: 80, alignItems: "center", justifyContent: "center" }}>
                        <Text>No image</Text>
                      </View>
                    )}
                    <Text style={{ marginTop: 4 }}>{s?.label || `Item ${i + 1}`}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.sectionTitle}>Logo Clearspace</Text>
              <Text>{descriptions.clearspace || "Rules for clearspace and sizing."}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.sectionTitle}>Iconography</Text>
              <Text>{descriptions.iconography || "Iconography guidelines."}</Text>
            </View>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.sectionTitle}>Color Palette</Text>
              <View style={pdfStyles.paletteRow}>
                {colors.map((c, idx) => (
                  <View key={idx}>
                    <View style={[pdfStyles.swatch, { backgroundColor: c.hex || "#1da1f2" }]} />
                    <Text style={pdfStyles.swatchLabel}>{c.label || `Color ${idx + 1}`}</Text>
                    <Text style={pdfStyles.swatchLabel}>{c.hex || "#1da1f2"}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.sectionTitle}>Typography</Text>
              <Text style={{ fontFamily: "Helvetica", fontSize: 28, color: "#77d1ff" }}>Ab</Text>
              <Text style={{ fontFamily: "Times-Roman", fontSize: 24, color: "#77d1ff" }}>Ab</Text>
              <View style={{ marginTop: 8 }}>
                <Text>Montserrat — {typography.montserratWeights || "Bold/Book/Light"}</Text>
                <Text>Source Sans Pro — {typography.sourceSansWeights || "Bold/Book/Light"}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default function PdfUI({ data, viewerClassName, downloadClassName }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const timeoutRef = useRef(null);

  const doc = useMemo(() => <StyleGuidePDF data={data} />, [data]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    let active = true;
    timeoutRef.current = setTimeout(async () => {
      try {
        const blob = await pdf(doc).toBlob();
        if (!active) return;
        const url = URL.createObjectURL(blob);
        setBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (e) {
        console.error("Failed to generate PDF", e);
      }
    }, 300);
    return () => {
      active = false;
    };
  }, [doc]);

  return (
    <>
      <div style={{ height: "calc(80vh - 42px)", borderBottom: "1px solid #eee" }}>
        {blobUrl ? (
          <iframe src={blobUrl} className={viewerClassName} style={{ width: "100%", height: "100%", border: 0 }} title="PDF Preview" />
        ) : (
          <div style={{ padding: 12 }}>Preparing preview…</div>
        )}
      </div>
      <div style={{ padding: 8 }}>
        {blobUrl ? (
          <a href={blobUrl} download={`${data.companyName || "style-guide"}.pdf`} className={downloadClassName}>Download PDF</a>
        ) : (
          <span>Preparing PDF...</span>
        )}
      </div>
    </>
  );
}


