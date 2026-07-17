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

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const promptText = `
Анализирай тази снимка на ресторантско меню (или лист с рецепти).
Извлечи всички ястия/продукти и техните описани съставки на български език.
За всяко ястие запиши:
- Вид продукт/име на ястието (product) - напр. "Шкембе чорба"
- Съставки (ingredients) - изброени като текст, разделен със запетаи. Ако съставките не са описани директно на менюто, опитай се логически да извлечеш типичните съставки за това ястие (напр. за шкембе чорба: шкембе, мляко, чесън, олио, оцет).
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
            items: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  product: { type: "STRING" },
                  ingredients: { type: "STRING" },
                },
                required: ["product", "ingredients"],
              },
            },
          },
          required: ["items"],
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
      console.error("Gemini Menu API Error:", errText);
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
        { error: "ИИ не успя да генерира структуриран списък с ястия." },
        { status: 500 }
      );
    }

    const result = JSON.parse(candidateText.trim());
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scan menu error:", error);
    return NextResponse.json(
      { error: "Възникна грешка при сканирането на менюто: " + error.message },
      { status: 500 }
    );
  }
}
