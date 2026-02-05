import { Document, Packer, Paragraph, TextRun }  from 'docx'

const generateDocxBuffer = async (analysisText) => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun(analysisText)],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
export {generateDocxBuffer}