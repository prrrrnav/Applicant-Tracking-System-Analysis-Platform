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
        size: 22,
        color: "4F46E5",
        font: "Calibri",
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "C7D2FE" },
    },
    spacing: { before: 280, after: 120 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: "Calibri" })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

function line(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: options.size ?? 20,
        bold: options.bold ?? false,
        color: options.color ?? "1E293B",
        font: "Calibri",
        italics: options.italic ?? false,
      }),
    ],
    alignment: options.align ?? AlignmentType.LEFT,
    spacing: { after: options.spaceAfter ?? 60 },
  });
}

function emptyLine() {
  return new Paragraph({ children: [new TextRun("")], spacing: { after: 60 } });
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
          size: 48,
          color: "1E293B",
          font: "Calibri Light",
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 80 },
    })
  );

  // ── Title ──
  if (r.title) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: r.title,
            size: 22,
            color: "4F46E5",
            bold: true,
            font: "Calibri",
          }),
        ],
        spacing: { after: 100 },
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
          new TextRun({ text: p, size: 18, color: "475569", font: "Calibri" }),
          ...(i < parts.length - 1
            ? [new TextRun({ text: "  ·  ", size: 18, color: "94A3B8", font: "Calibri" })]
            : []),
        ]),
        spacing: { after: 60 },
      })
    );
  }

  children.push(emptyLine());

  // ── Summary ──
  if (r.summary) {
    children.push(heading("Professional Summary"));
    children.push(line(r.summary, { spaceAfter: 80 }));
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
            new TextRun({ text: `${label}: `, bold: true, size: 20, font: "Calibri", color: "1E293B" }),
            new TextRun({ text: items, size: 20, font: "Calibri", color: "374151" }),
          ],
          spacing: { after: 60 },
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
            new TextRun({ text: exp.role ?? "", bold: true, size: 22, font: "Calibri", color: "1E293B" }),
            new TextRun({ text: exp.company ? `  ·  ${exp.company}` : "", size: 20, font: "Calibri", color: "4F46E5" }),
            ...(exp.period
              ? [new TextRun({ text: `  —  ${exp.period}`, size: 18, font: "Calibri", color: "94A3B8" })]
              : []),
          ],
          spacing: { before: 120, after: 80 },
        })
      );
      for (const b of exp.bullets ?? []) children.push(bullet(b));
      children.push(emptyLine());
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
            new TextRun({ text: proj.name ?? "", bold: true, size: 22, font: "Calibri", color: "1E293B" }),
            ...(stack ? [new TextRun({ text: `  ·  ${stack}`, size: 18, font: "Calibri", color: "4F46E5" })] : []),
            ...(proj.period
              ? [new TextRun({ text: `  —  ${proj.period}`, size: 18, font: "Calibri", color: "94A3B8" })]
              : []),
          ],
          spacing: { before: 120, after: 80 },
        })
      );
      for (const b of proj.bullets ?? []) children.push(bullet(b));
      children.push(emptyLine());
    }
  }

  // ── Education ──
  if (r.education?.length > 0) {
    children.push(heading("Education"));
    for (const edu of r.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree ?? "", bold: true, size: 22, font: "Calibri", color: "1E293B" }),
          ],
          spacing: { before: 100, after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution ?? "", size: 20, font: "Calibri", color: "374151" }),
            ...(edu.location ? [new TextRun({ text: `  ·  ${edu.location}`, size: 20, font: "Calibri", color: "94A3B8" })] : []),
            ...(edu.period ? [new TextRun({ text: `  —  ${edu.period}`, size: 18, font: "Calibri", color: "94A3B8" })] : []),
          ],
          spacing: { after: 80 },
        })
      );
    }
  }

  // ── Certifications ──
  if (r.certifications?.length > 0) {
    children.push(heading("Certifications"));
    for (const c of r.certifications) children.push(line(`• ${c}`, { spaceAfter: 60 }));
  }

  // ── Achievements ──
  if (r.achievements?.length > 0) {
    children.push(heading("Achievements"));
    for (const a of r.achievements) children.push(line(`• ${a}`, { spaceAfter: 60 }));
  }

  // ── Build & save ──
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${(r.name ?? "optimized-resume").replace(/\s+/g, "-")}.docx`);
}