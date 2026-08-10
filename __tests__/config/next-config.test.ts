import nextConfig from "@/next.config";

describe("next.config resume URL wiring", () => {
  it("rewrites /resume.pdf to the volume-backed path", async () => {
    const result = await nextConfig.rewrites!();
    const rules = Array.isArray(result) ? result : result.beforeFiles ?? [];
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/resume.pdf",
          destination: "/documents/resume.pdf",
        }),
      ])
    );
  });

  it("permanently redirects the old dated resume URL", async () => {
    const rules = await nextConfig.redirects!();
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/michael-delamorena-resume-2026-04.pdf",
          destination: "/resume.pdf",
          permanent: true,
        }),
      ])
    );
  });

  it("sets a 24h cache header for /documents PDFs", async () => {
    const rules = await nextConfig.headers!();
    const doc = rules.find((r) => r.source.startsWith("/documents"));
    expect(doc).toBeDefined();
    expect(doc!.headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "Cache-Control",
          value: expect.stringContaining("max-age=86400"),
        }),
      ])
    );
  });
});
