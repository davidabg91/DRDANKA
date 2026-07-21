import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY е неконфигуриран в настройките на сървъра." },
        { status: 500 }
      );
    }

    const { image, mimeType } = await req.json();
    if (!image || !mimeType) {
      return NextResponse.json(
        { error: "Липсва снимка или файлов формат." },
        { status: 400 }
      );
    }

    // Clean base64 header if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const promptText = `
Анализирай тази снимка на фактура, стокова разписка или касов бон за доставка на хранителни стоки.
Извлечи следните данни за Дневника за входящ контрол на храните на български език:
1. Дата на приемане на стоката (date) във формат YYYY-MM-DD. Ако няма изрична дата на доставка, използвай датата на документа.
2. Името на фирмата Доставчик (supplier).
3. Адрес на доставчика (supplierAddress) - град, улица и номер, ако са изписани върху документа. Остави празно, ако липсват.
4. Телефон за контакт с доставчика (supplierPhone) - ако е изписан върху документа. Остави празно, ако липсва.
5. Номер на документа/фактурата (documentNumber) - например номер на фактура или касов бон.
6. Всички хранителни продукти/стоки от списъка (items) със следните детайли:
   - Име на храната (foodName)
   - Партиден номер (batch) - потърси означения като L, Л, Партида, Batch, Lot или подобни кодове
   - Срок на годност (expiryDate) във формат YYYY-MM-DD
   - Количество (quantity) - например 5 кг, 12 бр, 3.5 л
`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            date: { type: "STRING" },
            supplier: { type: "STRING" },
            supplierAddress: { type: "STRING" },
            supplierPhone: { type: "STRING" },
            documentNumber: { type: "STRING" },
            items: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  foodName: { type: "STRING" },
                  batch: { type: "STRING" },
                  expiryDate: { type: "STRING" },
                  quantity: { type: "STRING" },
                },
                required: ["foodName"],
              },
            },
          },
          required: ["supplier", "items"],
        },
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      let detail = "Неуспешна комуникация с ИИ платформата на Google.";
      try {
        const parsedErr = JSON.parse(errText);
        if (parsedErr.error?.message) {
          detail += ` Детайли: ${parsedErr.error.message}`;
        }
      } catch {}
      return NextResponse.json(
        { error: detail },
        { status: 500 }
      );
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json(
        { error: "ИИ не успя да генерира структуриран отговор." },
        { status: 500 }
      );
    }

    // Parse JSON returned by Gemini
    const result = JSON.parse(candidateText.trim());
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scan receipt error:", error);
    return NextResponse.json(
      { error: "Възникна грешка при сканирането: " + error.message },
      { status: 500 }
    );
  }
}
