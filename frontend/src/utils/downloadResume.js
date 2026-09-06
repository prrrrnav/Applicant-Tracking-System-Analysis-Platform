import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";

// ── helpers ───────────────────────────────────────────────────────────────────

function heading(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 18,
        color: "4F46E5",
        font: "Calibri",
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "C7D2FE" },
    },
    spacing: { before: 120, after: 45 },
    keepNext: true,
  });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 17, font: "Calibri" })],
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 15, line: 190 },
  });
}

function line(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: options.size ?? 17,
        bold: options.bold ?? false,
        color: options.color ?? "1E293B",
        font: "Calibri",
        italics: options.italic ?? false,
      }),
    ],
    alignment: options.align ?? AlignmentType.LEFT,
    spacing: { after: options.spaceAfter ?? 30, line: 190 },
    keepNext: options.keepNext ?? false,
  });
}

// ── main export ───────────────────────────────────────────────────────────────

export async function downloadOptimizedResume(r) {
  if (!r) return;

  const children = [];

  // ── Name ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: (r.name ?? "Resume").toUpperCase(),
          bold: true,
          size: 34,
          color: "1E293B",
          font: "Calibri Light",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 25 },
    })
  );

  // ── Title ──
  if (r.title) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: r.title,
            size: 18,
            color: "4F46E5",
            bold: true,
            font: "Calibri",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 30 },
      })
    );
  }

  // ── Contact ──
  if (r.contact) {
    const parts = [
      r.contact.location,
      r.contact.phone,
      r.contact.email,
      r.contact.github,
      r.contact.linkedin,
    ].filter(Boolean);

    children.push(
      new Paragraph({
        children: parts.flatMap((p, i) => [
          new TextRun({ text: p, size: 16, color: "475569", font: "Calibri" }),
          ...(i < parts.length - 1
            ? [new TextRun({ text: "  ·  ", size: 16, color: "94A3B8", font: "Calibri" })]
            : []),
        ]),
        alignment: AlignmentType.CENTER,
        spacing: { after: 30 },
      })
    );
  }

  // ── Summary ──
  if (r.summary) {
    children.push(heading("Professional Summary"));
    children.push(line(r.summary, { align: AlignmentType.JUSTIFIED, spaceAfter: 40 }));
  }

  // ── Skills ──
  if (r.skills && Object.keys(r.skills).length > 0) {
    children.push(heading("Technical Skills"));
    for (const [key, values] of Object.entries(r.skills)) {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const items = Array.isArray(values) ? values.join(", ") : values;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${label}: `, bold: true, size: 17, font: "Calibri", color: "1E293B" }),
            new TextRun({ text: items, size: 17, font: "Calibri", color: "374151" }),
          ],
          spacing: { after: 20, line: 190 },
        })
      );
    }
  }

  // ── Experience ──
  if (r.experience?.length > 0) {
    children.push(heading("Professional Experience"));
    for (const exp of r.experience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role ?? "", bold: true, size: 18, font: "Calibri", color: "1E293B" }),
            new TextRun({ text: exp.company ? `  ·  ${exp.company}` : "", size: 17, font: "Calibri", color: "4F46E5" }),
            ...(exp.period
              ? [new TextRun({ text: `  —  ${exp.period}`, size: 16, font: "Calibri", color: "94A3B8" })]
              : []),
          ],
          spacing: { before: 45, after: 25, line: 190 },
          keepNext: true,
        })
      );
      for (const b of exp.bullets ?? []) children.push(bullet(b));
    }
  }

  // ── Projects ──
  if (r.projects?.length > 0) {
    children.push(heading("Technical Projects"));
    for (const proj of r.projects) {
      const stack = proj.stack?.join(", ") ?? "";
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name ?? "", bold: true, size: 18, font: "Calibri", color: "1E293B" }),
            ...(stack ? [new TextRun({ text: `  ·  ${stack}`, size: 16, font: "Calibri", color: "4F46E5" })] : []),
            ...(proj.period
              ? [new TextRun({ text: `  —  ${proj.period}`, size: 16, font: "Calibri", color: "94A3B8" })]
              : []),
          ],
          spacing: { before: 45, after: 25, line: 190 },
          keepNext: true,
        })
      );
      for (const b of proj.bullets ?? []) children.push(bullet(b));
    }
  }

  // ── Education ──
  if (r.education?.length > 0) {
    children.push(heading("Education"));
    for (const edu of r.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree ?? "", bold: true, size: 18, font: "Calibri", color: "1E293B" }),
          ],
          spacing: { before: 35, after: 15, line: 190 },
          keepNext: true,
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution ?? "", size: 17, font: "Calibri", color: "374151" }),
            ...(edu.location ? [new TextRun({ text: `  ·  ${edu.location}`, size: 17, font: "Calibri", color: "94A3B8" })] : []),
            ...(edu.period ? [new TextRun({ text: `  —  ${edu.period}`, size: 16, font: "Calibri", color: "94A3B8" })] : []),
          ],
          spacing: { after: 25, line: 190 },
        })
      );
    }
  }

  // ── Certifications ──
  if (r.certifications?.length > 0) {
    children.push(heading("Certifications"));
    for (const c of r.certifications) {
      children.push(line(`• ${c}`, { align: AlignmentType.JUSTIFIED, spaceAfter: 20 }));
    }
  }

  // ── Achievements ──
  if (r.achievements?.length > 0) {
    children.push(heading("Achievements"));
    for (const a of r.achievements) {
      children.push(line(`• ${a}`, { align: AlignmentType.JUSTIFIED, spaceAfter: 20 }));
    }
  }

  // ── Build & save ──
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 450, bottom: 450, left: 650, right: 650 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${(r.name ?? "optimized-resume").replace(/\s+/g, "-")}.docx`);
}