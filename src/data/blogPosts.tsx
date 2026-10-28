import React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Video, ArrowRight, Phone, ClipboardCheck, SearchCheck } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  /** Shorter <title> for search results (≤ ~60 chars). Falls back to `title`. */
  seoTitle?: string;
  summary: string;
  /** Human-readable Bulgarian date, e.g. "28 октомври 2026 г." — see postIsoDate(). */
  date: string;
  readTime: string;
  image: string;
  imageAlt?: string;
  tags: string[];
  keywords?: string[];
  /** Rendered under the article and mirrored as FAQPage JSON-LD. */
  faq?: { question: string; answer: string }[];
  /** External sources the post is based on — rendered and emitted as `citation`. */
  sources?: { name: string; url: string }[];
  content: React.ReactNode;
}

const BG_MONTHS: Record<string, string> = {
  януари: "01", февруари: "02", март: "03", април: "04", май: "05", юни: "06",
  юли: "07", август: "08", септември: "09", октомври: "10", ноември: "11", декември: "12",
};

/** "28 октомври 2026 г." → "2026-10-28" (for <time>, JSON-LD and the sitemap). */
export function postIsoDate(post: Pick<BlogPost, "date">): string | undefined {
  const m = post.date.match(/(\d{1,2})\s+([а-я]+)\s+(\d{4})/i);
  const month = m && BG_MONTHS[m[2].toLowerCase()];
  return m && month ? `${m[3]}-${month}-${m[1].padStart(2, "0")}` : undefined;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "babh-zatvori-kuhnya-mayka-prosledimost",
    title: "БАБХ затвори кухня майка на търговска верига. Ще издържи ли Вашият обект същата проверка?",
    seoTitle: "БАБХ затвори кухня майка: хигиена и проследимост",
    summary: "На 27 октомври 2026 г. БАБХ затвори кухнята майка на търговска верига в Пловдив и два свързани обекта в София и Пазарджик заради лоша хигиена и липса на проследимост. Д-р Данка Николова обяснява какво точно е проверено, колко струва едно затваряне и как да подготвите обекта си за същата проверка.",
    date: "28 октомври 2026 г.",
    readTime: "10 мин. четене",
    image: "/blog_kuhnya_mayka_babh.webp",
    imageAlt: "Схема: суровини, кухня майка в Пловдив и обекти в София и Пазарджик с прекъсната проследимост и печат „Затворено“ от БАБХ",
    tags: ["Актуално", "БАБХ проверка", "Проследимост", "Хигиена", "Санкции"],
    keywords: [
      "БАБХ затвори кухня майка",
      "проследимост на храните",
      "проверка БАБХ 2026",
      "затваряне на обект за храни",
      "Регламент 178/2002 проследимост",
      "дневник за входящ контрол",
      "производствен дневник партида",
      "система за самоконтрол",
      "HACCP проверка",
    ],
    sources: [
      {
        name: "NOVA — „Затвориха заради лоша хигиена кухня майка на търговска верига“ (27.10.2026)",
        url: "https://nova.bg/news/view/2026/10/27/557037/",
      },
      {
        name: "Регламент (ЕО) № 178/2002 — общи принципи на законодателството в областта на храните (чл. 18, проследимост)",
        url: "https://eur-lex.europa.eu/legal-content/BG/TXT/?uri=CELEX:32002R0178",
      },
      {
        name: "Регламент (ЕО) № 852/2004 — хигиена на храните",
        url: "https://eur-lex.europa.eu/legal-content/BG/TXT/?uri=CELEX:32004R0852",
      },
    ],
    faq: [
      {
        question: "Какво означава „липса на проследимост“ при проверка от БАБХ?",
        answer: "Че обектът не може да докаже с документи от кои суровини (доставчик, партида, срок) е приготвена дадена храна и къде е изпратена готовата продукция. Регламент (ЕО) № 178/2002, чл. 18, изисква всеки бизнес с храни да знае „една стъпка назад“ — от кого е получил — и „една стъпка напред“ — на кого е доставил.",
      },
      {
        question: "Може ли БАБХ да затвори обект веднага, още при проверката?",
        answer: "Да. При сериозни несъответствия с хигиената или при риск за здравето на потребителите БАБХ може да спре дейността на обекта с принудителна административна мярка до отстраняване на нарушенията. Ако обектът снабдява други обекти, спирането може да обхване и тях — както се случи с кухнята майка в Пловдив и двата свързани обекта в София и Пазарджик.",
      },
      {
        question: "Кои дневници доказват проследимостта в заведение или цех?",
        answer: "Дневникът за входящ контрол (доставчик, документ, партида, срок на годност, температура при приемане), списъкът на одобрените доставчици, производствените дневници и контролните карти с партида и срок на приготвените храни, записите за експедиция до други обекти и етикетите с партида. Към тях се добавят дневниците за бракувана продукция, хигиена и температури.",
      },
      {
        question: "Задължително ли е дневниците да се водят дигитално?",
        answer: "Не. Хартиените дневници са законни. Дигиталните обаче напомнят кога да се попълни запис, пазят реалните дати и часове, не се губят и се показват на инспектора за минути. Така не изглеждат попълнени наведнъж преди проверката.",
      },
      {
        question: "Колко струва да подготвя обекта си за такава проверка?",
        answer: "Дигиталните дневници „БАБХ Спокойствие“ започват от 19 € на месец (Старт), а за обект с топла точка пакетът е 29 € (Оптимум). За всеки следващ обект на същата фирма има 30% отстъпка, а първите 14 дни са безплатни. Еднократният одит „Проверка преди проверката“ струва 150–300 € според обекта и включва писмен доклад с план за коригиращи действия.",
      },
    ],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <div className="bg-red-50 border-l-4 border-red-600 p-4 sm:p-5 rounded-r-lg flex items-start gap-3">
          <span className="text-xl shrink-0">🚨</span>
          <p className="text-sm font-semibold text-red-900 leading-relaxed">
            АКТУАЛНО, 27.10.2026: БАБХ затвори кухнята майка на търговска верига в Пловдив и два обекта в София и Пазарджик, които тя зарежда. Причините са лоша хигиена и липса на данни за проследяване на приготвените храни.
          </p>
        </div>

        <p>
          Новината обиколи медиите за часове. Става дума за <strong>централна кухня на голяма търговска верига</strong>, с отдели по качество, процедури и бюджети, която въпреки това е затворена при проверка. Ако това може да се случи на верига, може да се случи и на всеки ресторант, сладкарница, магазин с топла витрина или кетъринг.
        </p>
        <p>
          В тази статия разглеждам какво точно са установили инспекторите и защо „проследимостта“ спира цели вериги. Ще видите и колко струва едно затваряне, и как с 10 въпроса да проверите още днес дали Вашият обект би издържал същата проверка.
        </p>

        <div className="bg-brand-light border border-brand-gold/30 rounded-2xl p-5 sm:p-6">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-green mb-3">Накратко: какво беше установено</h2>
          <ul className="space-y-2 text-sm text-brand-dark/85">
            <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span><span><strong>Затворени 3 обекта:</strong> кухнята майка в Пловдив и 2 обекта в София и Пазарджик, които тя снабдява с готови кулинарни изделия.</span></li>
            <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span><span><strong>Причини:</strong> лоша хигиена и <strong>липса на данни за проследимост</strong>. Не е ясно от какви суровини е приготвена храната, нито по какъв път готовите изделия са стигнали до магазините.</span></li>
            <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span><span><strong>В други обекти:</strong> около 50 кг храни с изтекъл срок на годност, храни с променен произход и нарушения в етикетирането.</span></li>
            <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span><span><strong>В склад на друга верига:</strong> храни с изтекъл срок, съхранявани заедно с годни за консумация.</span></li>
            <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span><span><strong>КЗП:</strong> 4 наказателни постановления на големи вериги за общо 110 000 € за заблуждаващи търговски практики. Обявената цена се различава от маркираната на касата, а част от промоциите са фалшиви.</span></li>
            <li className="flex gap-2"><span className="text-brand-gold font-bold shrink-0">→</span><span><strong>Проверките продължават.</strong> БАБХ, КЗП и НАП обикалят складовете и обектите на търговските вериги.</span></li>
          </ul>
          <p className="text-xs text-brand-dark/55 mt-4">
            Данните са от съвместния брифинг на д-р Кремена Стоева, директор на Дирекция „Контрол на храните“ към БАБХ, и Мая Манолова, председател на КЗП, по информация на{" "}
            <a href="https://nova.bg/news/view/2026/10/27/557037/" target="_blank" rel="noopener" className="underline hover:text-brand-gold">NOVA</a>.
          </p>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Какво е „кухня майка“ и защо една грешка там спира няколко обекта</h2>
        <p>
          Кухнята майка, или централната кухня, приготвя храна, която после се разпраща до много обекти: магазини, щандове, кафенета, кетъринг точки. Икономически моделът е отличен. От гледна точка на безопасността обаче <strong>всяка грешка в кухнята се умножава по броя на обектите</strong>, които тя зарежда.
        </p>
        <p>
          Затова БАБХ не спира само кухнята. Щом не може да се докаже какво е влязло в храната и къде е отишла тя, рискът се приема за целия път на продукта. Така два обекта в други градове затварят заради документи, които дори не се водят при тях.
        </p>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">💡 Съвет от експерта</span>
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            &ldquo;Ако приготвяте храна за повече от един обект, проследимостта е основата на бизнеса Ви, а не формалност. Без нея инспекторът не може да ограничи проблема до една партида и спира всичко.&rdquo;
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Проследимост: изискването, което провали проверката</h2>
        <p>
          Проследимостта е изискване на <strong>чл. 18 от Регламент (ЕО) № 178/2002</strong> и важи за всеки бизнес с храни, от павилиона до хлебозавода. Принципът е „една стъпка назад, една стъпка напред“. Трябва да можете да докажете <strong>от кого сте получили</strong> всяка суровина и <strong>на кого сте предали</strong> всеки продукт.
        </p>
        <p>
          На практика инспекторът взима продукт от витрината и пита: <em>„От кои партиди суровини е приготвено това и кога? В кои обекти е изпратено същото?“</em> Ако отговорът е „ще проверя“ или „някъде в папките“, проследимост няма.
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-green/20">
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tl-lg">Звено</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light">Какво трябва да докажете</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tr-lg">С какъв запис</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-brand-green/10">
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Стъпка назад</td>
                <td className="py-3 px-4 text-brand-dark/80">Доставчик, документ, партида, срок на годност и температура на всяка приета суровина</td>
                <td className="py-3 px-4 text-brand-dark/80">Дневник за входящ контрол + списък на доставчиците</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Вътре в обекта</td>
                <td className="py-3 px-4 text-brand-dark/80">Коя партида суровина в коя партида готов продукт е влязла, кога и при каква температура е обработена</td>
                <td className="py-3 px-4 text-brand-dark/80">Производствен дневник / контролни карти с партида и срок</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Стъпка напред</td>
                <td className="py-3 px-4 text-brand-dark/80">Къде, кога и в какво количество е изпратен всеки готов продукт</td>
                <td className="py-3 px-4 text-brand-dark/80">Записи за експедиция + етикет с партида и срок</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Отклонения</td>
                <td className="py-3 px-4 text-brand-dark/80">Какво е бракувано, отделено или изтеглено и защо</td>
                <td className="py-3 px-4 text-brand-dark/80">Дневник за бракувана продукция</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">„Лоша хигиена“ означава и липса на доказателства</h2>
        <p>
          Когато в протокола пише „лоша хигиена“, рядко става дума само за мръсен под. Инспекторът проверява дали хигиената се <strong>управлява</strong>: има ли график за почистване и дезинфекция, записвано ли е кой, кога и с какъв препарат е почистил, валидни ли са здравните книжки, има ли договор и записи за ДДД обработки.
        </p>
        <p>
          Показателна е и находката в склада на друга верига: <strong>храни с изтекъл срок, съхранявани заедно с годни</strong>. Решението е просто — обозначена зона за блокирана продукция и запис в дневника за брак в момента, в който срокът изтече. Без такава процедура един пропуснат кашон може да стане акт.
        </p>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Колко струва едно затваряне: сметката, която никой не прави</h2>
        <p>
          Глобата е най-малкият разход. Ето <strong>примерна сметка</strong> за малко заведение с топла кухня, спряно за 10 дни, докато отстрани нарушенията и мине повторна проверка:
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-green/20">
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tl-lg">Разход</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tr-lg text-right">Примерна сума</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-brand-green/10">
              <tr><td className="py-3 px-4 text-brand-dark/85">Пропуснат оборот (1 500 € на ден × 10 дни)</td><td className="py-3 px-4 text-right font-semibold">15 000 €</td></tr>
              <tr><td className="py-3 px-4 text-brand-dark/85">Заплати на персонал, който не работи</td><td className="py-3 px-4 text-right font-semibold">3 000 €</td></tr>
              <tr><td className="py-3 px-4 text-brand-dark/85">Наем и сметки за затворен обект</td><td className="py-3 px-4 text-right font-semibold">800 €</td></tr>
              <tr><td className="py-3 px-4 text-brand-dark/85">Бракувани суровини и готова храна</td><td className="py-3 px-4 text-right font-semibold">2 000 €</td></tr>
              <tr><td className="py-3 px-4 text-brand-dark/85">Имуществена санкция за юридическо лице (от)</td><td className="py-3 px-4 text-right font-semibold">1 000 €</td></tr>
              <tr className="bg-red-50"><td className="py-3 px-4 font-bold text-red-900">Общо, без загубата на репутация</td><td className="py-3 px-4 text-right font-black text-red-900">≈ 21 800 €</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-brand-dark/55">Сумите са илюстративни и зависят от обекта. Загубата на доверие след новина с името на обекта не се вижда в таблицата, но често е най-голямата.</p>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-5 sm:p-6 rounded-2xl my-6">
          <p className="text-sm sm:text-base text-brand-dark/90 leading-relaxed">
            📊 <strong>За сравнение:</strong> дигиталните дневници за обект с топла точка (пакет „Оптимум“) струват <strong>29 € на месец, или 348 € годишно</strong>. В горния пример 10 дни затворен обект струват колкото <strong>над 60 години</strong> водене на системата.
          </p>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Самопроверка: бихте ли издържали тази проверка днес?</h2>
        <p>Отговорете честно с „да“ или „не“. Ако поне на един въпрос отговорът е „не“ или „не съм сигурен“, рискът при Вас е същият.</p>

        <ol className="space-y-3 mt-4">
          {[
            "Можете ли за 5 минути да покажете от кой доставчик и от коя партида е всяка суровина в хладилника Ви?",
            "Записвате ли партидата, срока на годност и температурата при всяка доставка, а не „после“?",
            "Имат ли приготвените от Вас храни записана партида, дата на производство и срок на годност?",
            "Ако снабдявате и други обекти, знаете ли коя партида къде и в какво количество е изпратена?",
            "Отделени и обозначени ли са храните с изтекъл срок от годните, и записани ли са като брак?",
            "Попълвани ли са температурните дневници всеки ден, а не наведнъж в края на месеца?",
            "Има ли записан график за почистване и дезинфекция с име на отговорника и използвания препарат?",
            "Валидни ли са личните здравни книжки на всички служители, включително на новоназначените?",
            "Актуален ли е договорът за ДДД обработки и пазите ли записите от последните обработки?",
            "Знае ли персоналът какво да направи при отклонение (висока температура, повредена опаковка) и записва ли го?",
          ].map((q, i) => (
            <li key={i} className="flex gap-3 bg-white border border-brand-green/10 rounded-xl p-3 sm:p-4">
              <span className="font-serif font-black text-brand-gold text-lg leading-none w-7 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm text-brand-dark/85">{q}</span>
            </li>
          ))}
        </ol>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Как „БАБХ Спокойствие“ затваря всеки от тези пропуски</h2>
        <p>
          Платформата я създадох след 27 години в официалния контрол на храните. Знам какво иска инспекторът и в какъв вид. Ето как нарушенията от тази проверка се покриват в системата:
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-green/20">
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tl-lg">Нарушение от проверката</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light">Какво прави системата</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tr-lg">Пакет</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-brand-green/10">
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Няма данни за използваните суровини</td>
                <td className="py-3 px-4 text-brand-dark/80">Дневник за входящ контрол с доставчик, документ, партида, срок и температура. Снимате фактурата или стоковата разписка и системата сама попълва продуктите, партидите и сроковете. Списъкът на доставчиците също се попълва сам.</td>
                <td className="py-3 px-4 text-brand-dark/80 whitespace-nowrap">от Старт</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Няма данни за пътя на готовите изделия</td>
                <td className="py-3 px-4 text-brand-dark/80">Контролни карти и производствени дневници с партида и срок (скара, готвени ястия, супи, печива), плюс допълнителни записи според дейността на обекта</td>
                <td className="py-3 px-4 text-brand-dark/80 whitespace-nowrap">Оптимум / Професионал</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Лоша хигиена</td>
                <td className="py-3 px-4 text-brand-dark/80">Чек-лист за хигиена преди работа; ежедневен, седмичен и месечен контрол на хигиената; списък на препаратите; записи за ДДД</td>
                <td className="py-3 px-4 text-brand-dark/80 whitespace-nowrap">Старт / Оптимум</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Храни с изтекъл срок сред годните</td>
                <td className="py-3 px-4 text-brand-dark/80">Дневник за бракувана продукция и ежедневни напомняния. Блокираната храна се отделя и записва веднага.</td>
                <td className="py-3 px-4 text-brand-dark/80 whitespace-nowrap">от Старт</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Персонал и срокове</td>
                <td className="py-3 px-4 text-brand-dark/80">Лична хигиена, здравни книжки с напомняне преди изтичане, обучения. От „Оптимум“ нагоре и срокове на договорите за ДДД и други.</td>
                <td className="py-3 px-4 text-brand-dark/80 whitespace-nowrap">от Старт</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Неподготвен обект при внезапна проверка</td>
                <td className="py-3 px-4 text-brand-dark/80">Онлайн подготовка за проверка от БАБХ на всеки 4 месеца и директна връзка с мен. Във VIP — месечна проверка на записите и съдействие след проверка.</td>
                <td className="py-3 px-4 text-brand-dark/80 whitespace-nowrap">Професионал / VIP</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-10">Ползите за Вас като собственик</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            ["🔔", "Никога не пропускате запис", "Системата Ви казва всеки ден какво да попълните: температури, хигиена, доставки."],
            ["⚙️", "Рутината се попълва сама", "Повтарящите се записи се попълват автоматично и персоналът губи минути, не часове."],
            ["🔎", "Проследимост за минути", "Партида, доставчик и срок на всяка суровина са на едно място, подредени по дни. Показвате ги веднага, без да ровите в папки."],
            ["🖨️", "Готови документи за БАБХ", "Всеки дневник се разпечатва като официален документ с един клик."],
            ["🏪", "Няколко обекта в един профил", "За вериги и кухни майки: всеки следващ обект е с 30% отстъпка."],
            ["👩‍⚕️", "Експерт до Вас", "Не сте сами с предписанието. От „Професионал“ нагоре имате пряка връзка с д-р Николова."],
          ].map(([icon, title, text]) => (
            <div key={title} className="bg-white border border-brand-green/10 rounded-xl p-4 flex gap-3">
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <h4 className="font-bold text-brand-green text-sm">{title}</h4>
                <p className="text-xs sm:text-sm text-brand-dark/75 mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Пакетите: изберете нивото на защита</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {[
            { name: "Старт", price: 19, text: "Основните дневници по самоконтрол: входящ контрол, температури, персонал, брак." },
            { name: "Оптимум", price: 29, text: "За обекти с топла точка: скара, фритюрник, фурна, витрини, пълна хигиена, ДДД." },
            { name: "Професионал", price: 49, text: "Записи според дейността, подготовка за проверка на всеки 4 месеца, връзка с експерт.", featured: true },
            { name: "VIP Спокойствие", price: 88, text: "Всичко, плюс месечна проверка на документацията и съдействие след проверка от БАБХ." },
          ].map((p) => (
            <div key={p.name} className={`rounded-xl p-4 border flex flex-col ${p.featured ? "bg-brand-green text-white border-brand-gold" : "bg-white border-brand-green/10"}`}>
              <span className={`text-[10px] font-black uppercase tracking-wider ${p.featured ? "text-brand-gold" : "text-brand-gold-dark"}`}>{p.featured ? "Най-избиран" : "Пакет"}</span>
              <h4 className={`font-serif font-bold text-base mt-1 ${p.featured ? "text-white" : "text-brand-green"}`}>{p.name}</h4>
              <p className={`font-black text-2xl mt-1 ${p.featured ? "text-brand-gold" : "text-brand-green"}`}>{p.price} €<span className="text-xs font-semibold opacity-70"> / месец</span></p>
              <p className={`text-xs mt-2 leading-relaxed ${p.featured ? "text-white/80" : "text-brand-dark/70"}`}>{p.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-dark/60">
          Първите 14 дни са безплатни. Пълно сравнение на пакетите има на страницата{" "}
          <Link href="/babh-sistema#paketi" className="text-brand-green font-semibold underline hover:text-brand-gold">Автоматични БАБХ дневници</Link>.
        </p>

        <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-6 sm:p-8 border border-brand-gold/20 shadow-xl my-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark bg-brand-gold px-2.5 py-1 rounded">
            ⚡ Започнете днес, не след проверката
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold mt-3 mb-2">14 дни безплатно, без банкова карта</h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Регистрирайте обекта си и системата сама подбира нужните дневници според вида му: магазин, топла точка, месо. Още от първия ден водите записи, които ще покажете на инспектора.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer group"
            >
              Изпробвайте безплатно 14 дни
              <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/babh-sistema"
              className="inline-flex items-center justify-center border border-white/25 hover:border-brand-gold text-white hover:text-brand-gold font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              Как работи системата
            </Link>
          </div>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Не само софтуер: експерт, който познава проверките отвътре</h2>
        <p>
          Дневниците показват, че работите правилно всеки ден. Понякога обаче трябва някой да погледне обекта отстрани, преди да го е направил инспекторът. Затова системата е част от цялостно обслужване:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white border border-brand-gold/30 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold"><SearchCheck className="h-3.5 w-3.5" /> 150–300 €</span>
              <h4 className="font-bold text-brand-green text-sm mt-1">„Проверка преди проверката“</h4>
              <p className="text-xs text-brand-dark/70 mt-1">Одит на обекта на място по чек-листа на инспектора: системи, потоци, дневници, етикети, проследимост. Получавате писмен доклад и план за коригиращи действия.</p>
            </div>
            <Link href="/services#proverka-predi-proverkata" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-4">Заявете одит <ArrowRight className="h-3 w-3 ml-1" /></Link>
          </div>
          <div className="bg-white border border-brand-green/10 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green"><ClipboardCheck className="h-3.5 w-3.5" /> 5–10 работни дни</span>
              <h4 className="font-bold text-brand-green text-sm mt-1">HACCP система за Вашия обект</h4>
              <p className="text-xs text-brand-dark/70 mt-1">Анализ на опасностите, ККТ, проследимост и процедура за изтегляне, разработени за Вашето меню и Вашата технология. Без шаблони от интернет.</p>
            </div>
            <Link href="/haccp-sistema" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-4">Вижте услугата <ArrowRight className="h-3 w-3 ml-1" /></Link>
          </div>
          <div className="bg-white border border-brand-green/10 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green"><Video className="h-3.5 w-3.5" /> Онлайн, на живо</span>
              <h4 className="font-bold text-brand-green text-sm mt-1">Обучение на екипа</h4>
              <p className="text-xs text-brand-dark/70 mt-1">Персонал, който разбира защо пише партидата, я пише. Курсове по НАССР и ДПХП с Вашите реални казуси.</p>
            </div>
            <Link href="/live/haccp-osnovi" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-4">Курсът НАССР основи <ArrowRight className="h-3 w-3 ml-1" /></Link>
          </div>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Какво да направите още тази седмица</h2>
        <ol className="list-decimal pl-5 space-y-3 mt-4 text-brand-dark/85">
          <li><strong>Направете тест за проследимост.</strong> Вземете един готов продукт и засечете колко време Ви трябва, за да покажете суровините и партидите му. Ако е повече от 10 минути, имате проблем.</li>
          <li><strong>Прегледайте хладилниците и склада.</strong> Изтекли срокове вън, обозначена зона за брак, запис в дневника.</li>
          <li><strong>Проверете сроковете</strong> на здравните книжки, договора за ДДД и последното обучение на персонала.</li>
          <li><strong>Спрете попълването „наведнъж“.</strong> Записите трябва да носят реалната дата и час. Пробвайте дигиталните дневници <Link href="/profile" className="text-brand-green font-semibold underline hover:text-brand-gold">14 дни безплатно</Link>.</li>
          <li><strong>Ако не сте сигурни, попитайте.</strong> Десетминутният разговор е безплатен и често спестява хиляди евро.</li>
        </ol>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-5 rounded-xl my-6">
          <p className="text-sm text-brand-dark/85 leading-relaxed">
            📌 Прочетете още:{" "}
            <Link href="/blog/sistema-za-samokontrol-dnevnici" className="text-brand-green font-bold underline hover:text-brand-gold">какви дневници изисква БАБХ и как да ги водите</Link>,{" "}
            <Link href="/blog/kontrol-surovini-babh" className="text-brand-green font-bold underline hover:text-brand-gold">защо контролът започва от суровините</Link> и{" "}
            <Link href="/blog/haccp-dokumenti-babh" className="text-brand-green font-bold underline hover:text-brand-gold">защо попълването „на око“ не работи</Link>.
          </p>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mt-10">Заключение</h2>
        <p>
          Случаят с кухнята майка показва нещо, което виждам от години: обектите рядко затварят заради една голяма грешка. Затварят, защото <strong>не могат да докажат</strong>, че работят правилно. Проследимостта и хигиената се доказват с ежедневни записи, а не се „оправят“ в деня на проверката.
        </p>
        <p>
          Добрата новина е, че това вече не изисква папки, химикалки и вечери над дневниците. С правилната система, обучен екип и експерт до Вас следващата проверка минава спокойно.
        </p>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <Phone className="h-3.5 w-3.5" /> Безплатен разговор
            </span>
            <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
              Не сте сигурни дали обектът Ви би издържал?
            </h4>
            <p className="text-xs text-brand-dark/80 max-w-md">
              Обадете се на <a href="tel:0887902198" className="font-bold text-brand-green underline">0887 902 198</a> или запазете 10-минутен разговор. Ще Ви кажа откъде да започнете.
            </p>
          </div>
          <Link
            href="/consultations#booking"
            className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 hover:text-white group"
          >
            Запазете разговор
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    )
  },
  {
    id: "abonamentna-sistema-babh",
    title: "ЕКСКЛУЗИВНО: Първата в България цялостна абонаментна система за безопасност на храните",
    summary: "НОВИНА: Представяме ви първата и единствена по рода си система в България, която съчетава специализиран софтуер, професионални обучения и 24/7 човешка експертиза за 100% сигурност пред БАБХ.",
    date: "22 май 2026 г.",
    readTime: "5 мин. четене",
    image: "/blog_subscription_exclusive.webp",
    tags: ["Ексклузивно", "Новини", "Иновация", "Абонамент"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <div className="bg-brand-gold/10 border-l-4 border-brand-gold p-4 rounded-r-lg mb-6 flex items-start gap-3">
          <span className="text-xl">🚨</span>
          <p className="text-sm font-semibold text-brand-green leading-relaxed">
            ВАЖНО ЗА БИЗНЕСА: За първи път на българския пазар стартира ексклузивна комплексна система, изградена изцяло върху реалния опит и спецификите на официалния контрол на храните у нас.
          </p>
        </div>
        <p>
          Дигитализацията в хранителния бизнес вече не е просто тенденция – тя е необходимост. Въпреки това, много собственици на заведения и производители се сблъскват с огромен проблем, когато се опитат да внедрят софтуер за управление на безопасността на храните.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Защо масовите платформи се провалят в България?</h3>
        <p>
          Пазарът е пълен с различни "универсални" системи за управление, но повечето от тях имат няколко фатални недостатъка:
        </p>
        <ul className="list-disc pl-5 space-y-3 mt-4 text-brand-dark/80">
          <li>Те са <strong>generic (общи)</strong> – направени са да работят навсякъде, което означава, че не работят перфектно никъде.</li>
          <li><strong>НЕ са съобразени с България</strong> – липсват им специфичните изисквания на родното законодателство.</li>
          <li><strong>НЕ познават БАБХ</strong> – инспекторите имат конкретни изисквания за начина, по който изглеждат и се водят дневниците, които чуждите софтуери не покриват.</li>
          <li><strong>НЕ дават човешка консултация</strong> – софтуерът може да Ви напомни да измерите температурата, но няма да Ви каже какво да правите, ако инспекторът е на вратата с предписание.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <h4 className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2 flex items-center">
            <span className="text-brand-gold text-lg mr-2">🔥</span> Силният differentiator на нашия проект
          </h4>
          <ul className="space-y-2 mt-4 text-sm font-medium">
            <li className="flex items-center"><span className="text-emerald-500 mr-2">🟢</span> Изцяло съобразен с Българското законодателство</li>
            <li className="flex items-center"><span className="text-emerald-500 mr-2">🟢</span> Разработен от реален експерт с 27 години опит</li>
            <li className="flex items-center"><span className="text-emerald-500 mr-2">🟢</span> 24/7 човешка консултация и подкрепа</li>
            <li className="flex items-center"><span className="text-emerald-500 mr-2">🟢</span> Подготовка и защита при реални проверки от БАБХ</li>
            <li className="flex items-center"><span className="text-emerald-500 mr-2">🟢</span> Генериране на реални, законово признати документи</li>
            <li className="flex items-center"><span className="text-emerald-500 mr-2">🟢</span> Вградени обучения за Вашия персонал</li>
          </ul>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Какво реално представлява нашата система? 🧠</h3>
        <p>
          Това вече <strong>НЕ е "прост сайт"</strong>. Това е мощна екосистема, която обединява пет различни бизнес инструмента в едно завършено решение:
        </p>
        
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-green/20">
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tl-lg">Тип платформа</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tr-lg">Какво реално осигурява</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-brand-green/10">
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">SaaS</td>
                <td className="py-3 px-4 text-brand-dark/80">Облачен софтуер с automation, dashboard и дигитални дневници.</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">LMS</td>
                <td className="py-3 px-4 text-brand-dark/80">Система за обучение на персонала с издаване на сертификати.</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">CRM</td>
                <td className="py-3 px-4 text-brand-dark/80">Управление на клиентите и комуникация чрез вграден чат.</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Compliance platform</td>
                <td className="py-3 px-4 text-brand-dark/80">Генератор на документи, стриктно спазващ регулациите и законите.</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Consulting</td>
                <td className="py-3 px-4 text-brand-dark/80">Човешка експертиза на един клик разстояние.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">🚨 Всичко необходимо на едно място</h3>
        <p>
          Ако Вашият бизнес се нуждае от автоматизация, интелигентно табло (dashboard), система за обучения със сертификати, управление на дневниците, чат с експерт и генератор на документи – Вие вече имате решението.
        </p>
        <p>
          Не оставяйте бизнеса си на случайността или на неадаптирани чуждестранни софтуери. Изберете системата, която познава Вашия бизнес и Вашите инспектори.
        </p>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <GraduationCap className="h-3.5 w-3.5" /> Обучения и Материали
            </span>
            <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
              Подгответе своя персонал и обекта си
            </h4>
            <p className="text-xs text-brand-dark/80 max-w-md">
              Разгледайте пълния каталог с нашите професионални видео обучения, наръчници за БАБХ и курсове на живо с д-р Николова.
            </p>
          </div>
          <Link 
            href="/training" 
            className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 hover:text-white group"
          >
            Вижте обученията
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    )
  },
  {
    id: "kak-da-registiram-obekt-babh",
    title: "Как да регистрирам обект за търговия с храни в БАБХ – ръководство стъпка по стъпка (2026)",
    summary: "Отваряте заведение, магазин, сладкарница или онлайн търговия с храни? Ето точните стъпки, документи и срокове за регистрация на обект в БАБХ, за да стартирате законно и без глоби.",
    date: "28 юли 2026 г.",
    readTime: "8 мин. четене",
    image: "/blog_registration.webp",
    tags: ["БАБХ регистрация", "Ръководство", "Стартиране на бизнес", "Документи"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Всеки бизнес, който произвежда, преработва, съхранява или предлага храни в България, е задължен по закон да бъде <strong>регистриран в Българската агенция по безопасност на храните (БАБХ)</strong>, преди да започне дейност. Това важи за ресторанти, кафенета, сладкарници, магазини, пекарни, каравани, кетъринг, дори за онлайн търговия с храни от дома.
        </p>
        <p>
          Добрата новина: в повечето случаи става дума за <strong>регистрация по уведомителен режим</strong>, а не за тежко лицензиране. Лошата новина: една пропусната стъпка или липсващ документ може да отложи старта Ви с месеци или да доведе до глоба. В това ръководство ще намерите точния път — стъпка по стъпка.
        </p>

        <div className="bg-brand-gold/10 border-l-4 border-brand-gold p-4 rounded-r-lg my-8 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-semibold text-brand-green leading-relaxed">
            Работа без регистрация в БАБХ се санкционира със значителни глоби и принудително затваряне на обекта. Регистрацията трябва да е налична ПРЕДИ първия работен ден.
          </p>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Стъпка 1: Определете точния тип на обекта си</h3>
        <p>
          Първо трябва да сте наясно какъв обект регистрирате, защото това определя изискванията към него. Най-честите категории са:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4 text-brand-dark/80">
          <li><strong>Обект за обществено хранене:</strong> ресторант, кафене, бар, сладкарница, бистро, каравана / food truck.</li>
          <li><strong>Обект за търговия на дребно:</strong> магазин за хранителни стоки, месарница, плод-зеленчук.</li>
          <li><strong>Обект за производство:</strong> пекарна, сладкарски цех, млекопреработка, месопреработка.</li>
          <li><strong>Обект за съхранение или дистрибуция:</strong> склад, логистичен център.</li>
          <li><strong>Търговия от разстояние (онлайн):</strong> продажба на храни през сайт или социални мрежи, включително „домашно“ производство.</li>
        </ul>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Стъпка 2: Осигурете подходящо помещение</h3>
        <p>
          Преди да подадете документи, обектът трябва физически да отговаря на хигиенните изисквания. Инспекторите проверяват най-често за:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4 text-brand-dark/80">
          <li>Разделени зони за „чисти“ и „мръсни“ процеси (за да няма кръстосано замърсяване).</li>
          <li>Подходяща настилка, стени и повърхности, които се почистват лесно.</li>
          <li>Течаща топла и студена вода, мивки за ръце, отделни от тези за миене на съдове.</li>
          <li>Хладилно оборудване с възможност за контрол на температурата.</li>
          <li>Складово пространство и условия за разделно съхранение на суровините.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">💡 Съвет от експерта</span>
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Най-скъпата грешка е да наемете или ремонтирате помещение, преди да сте проверили дали планировката му позволява регистрация за желаната дейност. Консултирайте се ПРЕДИ да подпишете договора за наем."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Стъпка 3: Подгответе документите</h3>
        <p>
          Комплектът документи варира според типа обект, но обичайно включва:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4 text-brand-dark/80">
          <li><strong>Заявление за регистрация</strong> по образец на БАБХ (подава се в съответната Областна дирекция по безопасност на храните – ОДБХ).</li>
          <li><strong>Документ за въведена система за управление на безопасността на храните</strong> (НАССР план / система за самоконтрол).</li>
          <li><strong>Данни за групите храни и дейностите</strong>, които ще се извършват в обекта.</li>
          <li><strong>Здравни книжки</strong> на персонала.</li>
          <li>Според дейността – документи за произход на водата, договори за извозване на отпадъци, дезинсекция и дератизация.</li>
        </ol>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-5 rounded-xl my-8">
          <p className="text-sm text-brand-dark/85 leading-relaxed">
            📌 <strong>Ключов момент:</strong> Именно НАССР системата и дневниците по самоконтрол са частта, която обърква повечето собственици. Разгледайте подробно{" "}
            <Link href="/blog/sistema-za-samokontrol-dnevnici" className="text-brand-green font-bold underline hover:text-brand-gold">
              какви дневници изисква БАБХ и как да ги водите
            </Link>.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-6 sm:p-8 border border-brand-gold/20 shadow-xl my-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark bg-brand-gold px-2.5 py-1 rounded">
            ⚡ Направете го автоматично
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold mt-3 mb-2">Системата за самоконтрол я имате готова — не я правете от нулата</h4>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Задължителните дневници и документи за регистрацията са готови в платформата на д-р Николова, съобразени с Вашия тип обект. Попълвате, разпечатвате и подавате в ОДБХ — без да плащате за изготвяне от нулата.
          </p>
          <ul className="space-y-2 mt-4 text-xs sm:text-sm">
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🔔</span> Системата Ви подсеща кога да попълните всеки дневник — не пропускате срок.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">⚙️</span> Повтарящите се записи се попълват автоматично всеки месец.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🖨️</span> Официалните документи се разпечатват готови за пред БАБХ с един клик.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">📱</span> Всичко на едно място — от телефон или компютър, за Вашия тип обект.</li>
          </ul>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer mt-5 group"
          >
            Изпробвайте безплатно 14 дни
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Стъпка 4: Подайте заявлението в ОДБХ</h3>
        <p>
          Заявлението се подава в Областната дирекция по безопасност на храните по местонахождение на обекта. Може да стане на място, по пощата или по електронен път. След подаване:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4 text-brand-dark/80">
          <li>Назначава се комисия, която извършва проверка на обекта на място.</li>
          <li>При съответствие обектът се вписва в регистъра и получавате <strong>удостоверение за регистрация</strong>.</li>
          <li>При констатирани несъответствия получавате указания и срок за отстраняването им.</li>
        </ul>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Стъпка 5: Поддържайте изрядност след регистрацията</h3>
        <p>
          Регистрацията не е еднократно събитие. От първия работен ден нататък обектът подлежи на <strong>периодични проверки</strong>, при които се изисква актуална и правилно водена документация — попълнени дневници, здравни книжки, протоколи от обучения на персонала.
        </p>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-green/20">
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tl-lg">Честа грешка</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tr-lg">Как да я избегнете</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-brand-green/10">
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Стартиране на дейност преди регистрация</td>
                <td className="py-3 px-4 text-brand-dark/80">Планирайте подаването поне 1 месец преди желания старт.</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Липсваща или формална НАССР система</td>
                <td className="py-3 px-4 text-brand-dark/80">Внедрете реална система, съобразена с конкретния Ви обект.</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Помещение, което не отговаря на изискванията</td>
                <td className="py-3 px-4 text-brand-dark/80">Проверете планировката преди наем/ремонт.</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Непопълнени дневници при проверка</td>
                <td className="py-3 px-4 text-brand-dark/80">Водете документацията ежедневно, а не „преди инспекцията“.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-brand-dark/60 mt-4">
          Виж още: <Link href="/blog/greshki-registraciya-babh" className="text-brand-green font-semibold underline hover:text-brand-gold">най-честите грешки при регистрация в БАБХ</Link>.
        </p>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <GraduationCap className="h-3.5 w-3.5" /> Съдействие при регистрация
            </span>
            <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
              Искате регистрация без стрес и забавяния?
            </h4>
            <p className="text-xs text-brand-dark/80 max-w-md">
              Д-р Николова и екипът ѝ подготвят цялата документация и Ви преведат през процеса от помещението до удостоверението за регистрация.
            </p>
          </div>
          <Link
            href="/consultations"
            className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 hover:text-white group"
          >
            Заяви консултация
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Заключение</h3>
        <p>
          Регистрацията на обект за храни в БАБХ е напълно постижима, стига да подходите систематично: правилно помещение, реална система за самоконтрол и пълен комплект документи. Подготовката отнема повече време от самата процедура — затова започнете рано и не оставяйте НАССР частта за последно.
        </p>
        <p className="text-xs text-brand-dark/60 mt-4">
          Ако предпочитате цялата документация да бъде изготвена вместо Вас, вижте услугата <Link href="/haccp-sistema" className="text-brand-green font-semibold underline hover:text-brand-gold">разработка и внедряване на HACCP (ХАСЕП) система</Link> — стандартен срок 5–10 работни дни.
        </p>
      </div>
    )
  },
  {
    id: "sistema-za-samokontrol-dnevnici",
    title: "Система за самоконтрол: какви дневници изисква БАБХ и как да ги водите правилно",
    summary: "Кои са задължителните дневници по самоконтрол за обект с храни, колко често се попълват и какво проверяват инспекторите на БАБХ. Практическо ръководство за собственици на заведения и магазини.",
    date: "30 юли 2026 г.",
    readTime: "7 мин. четене",
    image: "/haccp-prakticheska-sistema.webp",
    tags: ["Система за самоконтрол", "Дневници", "НАССР", "БАБХ проверка"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          „Система за самоконтрол“ звучи сложно, но по същество означава едно: <strong>Вие сами доказвате, че храните във Вашия обект са безопасни</strong> — чрез редовни записи, а не само на думи. Тази система е задължителна за всеки регистриран обект и е първото нещо, което инспекторът на БАБХ иска да види при проверка.
        </p>
        <p>
          В този материал ще разберете кои са основните дневници, колко често се попълват и как да избегнете най-честите санкции, свързани с документацията.
        </p>

        <div className="bg-brand-gold/10 border-l-4 border-brand-gold p-4 rounded-r-lg my-8 flex items-start gap-3">
          <span className="text-xl">📋</span>
          <p className="text-sm font-semibold text-brand-green leading-relaxed">
            Празните или „попълнени наведнъж“ дневници са сред най-честите причини за предписания и глоби. Инспекторите разпознават моментално документация, писана в последния момент.
          </p>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Какво представлява системата за самоконтрол?</h3>
        <p>
          Системата за самоконтрол се изгражда на принципите на <strong>НАССР (HACCP)</strong> — анализ на опасностите и контрол на критичните точки. На практика тя включва писмени процедури и набор от дневници, в които ежедневно се записват ключови показатели: температури, почистване, приемане на стоки и др.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Основните дневници, които БАБХ очаква</h3>
        <p>
          Точният набор зависи от типа обект, но за повечето заведения и магазини задължителни са:
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-green/20">
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tl-lg">Дневник</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light">Какво записвате</th>
                <th className="py-3 px-4 font-bold text-brand-green bg-brand-light rounded-tr-lg">Честота</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-brand-green/10">
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Температурен дневник (хладилници/фризери)</td>
                <td className="py-3 px-4 text-brand-dark/80">Температура на всяко хладилно съоръжение</td>
                <td className="py-3 px-4 text-brand-dark/80">Ежедневно</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Дневник за приемане на стоки</td>
                <td className="py-3 px-4 text-brand-dark/80">Доставчик, партида, срок на годност, температура при доставка</td>
                <td className="py-3 px-4 text-brand-dark/80">При всяка доставка</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Дневник за почистване и дезинфекция</td>
                <td className="py-3 px-4 text-brand-dark/80">Зона, метод, отговорник</td>
                <td className="py-3 px-4 text-brand-dark/80">По график</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Дневник за термична обработка</td>
                <td className="py-3 px-4 text-brand-dark/80">Температура в сърцевината на продукта</td>
                <td className="py-3 px-4 text-brand-dark/80">При готвене/претопляне</td>
              </tr>
              <tr className="hover:bg-brand-light/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-brand-dark">Дневник за нехранителни отпадъци / олио</td>
                <td className="py-3 px-4 text-brand-dark/80">Количество, извозване</td>
                <td className="py-3 px-4 text-brand-dark/80">Периодично</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">💡 Съвет от експерта</span>
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Инспекторът не очаква перфектни температури всеки ден — очаква да види, че когато нещо се отклони, Вие сте го забелязали и сте предприели действие. Записаната коригираща мярка тежи повече от идеалната таблица."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Хартия или дигитални дневници?</h3>
        <p>
          Класическите хартиени дневници са напълно законни, но имат недостатъци: губят се, забравят се и лесно се „наваксват“ преди проверка — което инспекторите разпознават. Все повече обекти преминават към <strong>дигитални дневници</strong>, които напомнят за попълване, пазят историята и се представят на инспектора с няколко клика.
        </p>
        <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-6 sm:p-8 border border-brand-gold/20 shadow-xl my-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark bg-brand-gold px-2.5 py-1 rounded">
            ⚡ Направете го автоматично
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold mt-3 mb-2">Забравете хартиените дневници — водете самоконтрола дигитално</h4>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Точно тези дневници ги имате готови в платформата на д-р Николова, съобразени с Вашия обект (магазин, топла точка, месо). Вместо да пишете на ръка и да наваксвате преди проверка, системата работи с Вас всеки ден.
          </p>
          <ul className="space-y-2 mt-4 text-xs sm:text-sm">
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🔔</span> Подсеща Ви за температури, хигиена, изтичащи здравни книжки и годишно обучение.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">⚙️</span> Повтарящите се записи се попълват автоматично всеки месец.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🖨️</span> Разпечатвате всеки дневник като официален документ за пред БАБХ с един клик.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">📱</span> Попълвате от телефона си, на място в обекта — не наваксвате в края на месеца.</li>
          </ul>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer mt-5 group"
          >
            Изпробвайте безплатно 14 дни
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-5 rounded-xl my-6">
          <p className="text-sm text-brand-dark/85 leading-relaxed">
            📌 Ако тепърва регистрирате обект, вижте и{" "}
            <Link href="/blog/kak-da-registiram-obekt-babh" className="text-brand-green font-bold underline hover:text-brand-gold">
              пълното ръководство за регистрация в БАБХ
            </Link>{" "}— системата за самоконтрол е задължителна част от документите още при подаването.
          </p>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Най-чести грешки при водене на дневниците</h3>
        <ul className="list-disc pl-5 space-y-3 mt-4 text-brand-dark/80">
          <li><strong>Попълване „на едро“:</strong> еднакъв почерк и мастило за цял месец издава, че записите не са правени ежедневно.</li>
          <li><strong>Само „нормални“ стойности:</strong> липсата на каквото и да е отклонение цяла година изглежда неправдоподобно.</li>
          <li><strong>Липса на коригиращи действия:</strong> записана висока температура без последващо действие е по-лошо от липсващ запис.</li>
          <li><strong>Дневници, които не отговарят на реалния обект:</strong> шаблон, свален от интернет, който изисква контроли, каквито при Вас няма.</li>
        </ul>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <BookOpen className="h-3.5 w-3.5" /> Готови решения за самоконтрол
            </span>
            <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
              Не знаете откъде да започнете с дневниците?
            </h4>
            <p className="text-xs text-brand-dark/80">
              Изберете най-подходящото за Вас — готови наръчници и обучения, за да се справите сами, или пълно съдействие от експерт.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-white/80 p-5 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase">Наръчници &amp; обучения</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Практически материали за самоконтрол</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Готови образци на дневници и обяснения как да ги водите правилно.</p>
              </div>
              <Link href="/manuals" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-4 cursor-pointer">
                Вижте наръчниците <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>

            <div className="bg-white/80 p-5 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-green uppercase">Индивидуална консултация</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Система, съобразена с Вашия обект</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Д-р Николова изгражда реална система за самоконтрол за конкретната Ви дейност.</p>
              </div>
              <Link href="/consultations" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-4 cursor-pointer">
                Заяви консултация <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Заключение</h3>
        <p>
          Системата за самоконтрол не е бюрокрация заради бюрокрацията — тя е Вашата защита при проверка и, по-важно, гаранция за безопасността на клиентите Ви. Водете дневниците честно и ежедневно, реагирайте на отклоненията и ги записвайте. Така всяка инспекция от БАБХ ще минава спокойно.
        </p>
        <p className="text-xs text-brand-dark/60 mt-4">
          Дневниците са само една част от системата. Вижте как протича <Link href="/haccp-sistema" className="text-brand-green font-semibold underline hover:text-brand-gold">разработката и внедряването на HACCP (ХАСЕП) система</Link> за конкретен обект.
        </p>
      </div>
    )
  },
  {
    id: "greshki-registraciya-babh",
    title: "Колко ще Ви струва една грешка при регистрацията на нов обект за храни?",
    summary: "Много бизнеси губят време и пари още преди да започнат. Разберете кои са критичните пропуски при БАБХ проверка и как да ги избегнете.",
    date: "18 май 2026 г.",
    readTime: "4 мин. четене",
    image: "/blog_registration.webp",
    tags: ["Регистрация", "БАБХ", "Старт на бизнес"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Стартирането на нов хранителен бизнес — било то малка пекарна, изискан ресторант или сладкарски цех — е изпълнено с ентусиазъм. Но реалността често удря предприемачите още в самото начало, при сблъсъка с нормативната уредба и инспекциите на Българската агенция по безопасност на храните (БАБХ).
        </p>
        
        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Истинската цена на една грешка при регистрация</h3>
        <p>
          Много собственици на бизнес мислят, че ако получат отказ или предписание, просто ще подадат документите отново на следващия ден. Истината обаче е много по-неприятна. Ето какво реално Ви струва всеки документален или физически пропуск в обекта:
        </p>
        
        <ul className="list-disc pl-5 space-y-3 mt-4">
          <li><strong>Нова държавна такса и заявление:</strong> При всеки официален отказ процесът се прекратява и трябва да започнете процедурата отначало, плащайки отново държавни такси.</li>
          <li><strong>Скъпо преустройство на обекта:</strong> Ако сте подредили масите, кухненското оборудване или мивките „на око“ без предварителен технологичен проект, инспекторите могат да изискат пълно преместване за осигуряване на поточност. Това означава разбиване на плочки, пренареждане на тръби и закупуване на нови уреди.</li>
          <li><strong>Забавяне с месеци:</strong> Всеки отказ Ви връща с 15 до 30 дни назад. През това време плащате наем за празен обект, заплати за персонал, който чака да започне, и губите потенциални обороти.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Виждала съм десетки бизнеси, които губят хиляди левове и мотивация още преди да са обслужили първия си клиент. И това не се случва защото идеята им е лоша, а защото не знаят как да приложат изискванията правилно."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Какво реално проверяват инспекторите при откриване?</h3>
        <p>
          Инспекторите не търсят просто „попълнени папки“. Те следят за спазването на три основни стълба:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
          <li><strong>Поточност на процесите:</strong> Кръстосването на чисти и мръсни пътища е най-честата причина за отказ. Суровините не трябва да се засичат с отпадъците или готовия продукт.</li>
          <li><strong>Материална база:</strong> Повърхностите трябва да са лесни за почистване и дезинфекция, мивките да имат топла вода и безконтактно задействане, а вентилационните и хладилните системи да са разчетени за капацитета.</li>
          <li><strong>Професионално разработени системи:</strong> Наличие на системи за самоконтрол (ДПХП и HACCP), които са адаптирани конкретно за Вашето меню и обект, а не просто копирани от интернет.</li>
        </ol>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Как да избегнете тези проблеми?</h3>
        <p>
          Спрете да действате „на сляпо“ и „на късмет“. Най-сигурният начин е да направите предварителен одит на обекта преди официалното посещение на БАБХ. Чрез професионален анализ на пространството и документите ще разберете къде са слабите места и ще ги коригирате навреме, спестявайки нерви, време и пари.
        </p>

        <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-6 sm:p-8 border border-brand-gold/20 shadow-xl my-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark bg-brand-gold px-2.5 py-1 rounded">
            ⚡ Направете го автоматично
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold mt-3 mb-2">Изрядна документация — без ръчна работа и пропуснати срокове</h4>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Най-честите причини за глоба са липсващи или непопълнени дневници. В платформата на д-р Николова те се попълват автоматично, а системата Ви подсеща навреме — така при внезапна проверка сте винаги готови.
          </p>
          <ul className="space-y-2 mt-4 text-xs sm:text-sm">
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🔔</span> Системата Ви подсеща кога да попълните всеки дневник — не пропускате срок.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">⚙️</span> Повтарящите се записи се попълват автоматично всеки месец.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🖨️</span> Официалните документи се разпечатват готови за пред БАБХ с един клик.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">📱</span> Всичко на едно място — от телефон или компютър, за Вашия тип обект.</li>
          </ul>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer mt-5 group"
          >
            Изпробвайте безплатно 14 дни
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <GraduationCap className="h-3.5 w-3.5" /> Свързани обучения и ресурси
            </span>
          </div>
          <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
            Предотвратете грешките при БАБХ регистрация още сега:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/80 p-4 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase">Ръководство (PDF)</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Готов ли е обектът ти за регистрация?</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Практически съвети как да избегнете скъпи преустройства и отказ от инспекторите.</p>
              </div>
              <Link href="/library/meso-i-mesni-produkti" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-3 cursor-pointer">
                Към наръчника <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            
            <div className="bg-white/80 p-4 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-green uppercase">Онлайн курс на живо</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">НАССР Основи с д-р Николова</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Практическо внедряване на ДПХП и НАССР системи с Вашите реални казуси.</p>
              </div>
              <Link href="/live/haccp-osnovi" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-3 cursor-pointer">
                Запиши се за курса <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "greshki-etiketi-hrani",
    title: "Колко струва една грешка в етикета на хранителна стока?",
    summary: "Над 90% от производителите и търговците имат пропуски в етикетите си без да подозират. Научете как една липсваща дума може да спре бизнеса Ви.",
    date: "14 май 2026 г.",
    readTime: "5 мин. четене",
    image: "/blog_labeling.webp",
    tags: ["Етикетиране", "Санкции", "Нормативна уредба"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Етикетът на хранителния продукт е Вашата визитна картичка пред потребителите, но и първото нещо, което инспекторите проверяват. Грешното етикетиране е сред най-честите причини за налагане на сериозни финансови санкции и изтегляне на стоки от търговската мрежа.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Колко струва един грешен етикет?</h3>
        <p>
          Ако смятате, че грешката в етикета е лек пропуск, помислете отново. Законодателството в ЕС е изключително строго и нарушаването му води до:
        </p>
        <ul className="list-disc pl-5 space-y-3 mt-4">
          <li><strong>Глоби и актове:</strong> Финансовите санкции за подвеждаща информация или липса на задължителни реквизити могат да достигнат хиляди левове още при първо нарушение.</li>
          <li><strong>Спиране на продукция и брак:</strong> БАБХ има правото незабавно да спре продажбата на цяла партида стоки и да разпореди изтеглянето им от пазара, което води до директна загуба на суровини и труд.</li>
          <li><strong>Загуба на дистрибутори и клиенти:</strong> Търговските вериги отказват да работят с производители, чиито етикети са рискови, тъй като санкции се налагат и на продавача.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">⚠️ Статистика от практиката</span>
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Над 90% от производителите и търговците имат грешки в етикетите си... и дори не го знаят, докато не дойде проверка или сигнал за алергична реакция от клиент."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Най-честите (и скъпи) пропуски при етикетиране</h3>
        <p>
          В практиката си се сблъсквам с няколко класически грешки, които се повтарят непрекъснато:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
          <li><strong>Неправилно изписване на алергените:</strong> Алергените трябва да бъдат ясно разграничени визуално от останите съставки (чрез шрифт, цвят или получерно изписване). Липсата на подчертаване на съставки като глутен, сусам или млечен протеин е директна заплаха за здравето и води до незабавно изтегляне на продукта.</li>
          <li><strong>Липса на проследимост:</strong> Всеки етикет трябва да съдържа номер на партида, производител или дистрибутор, за да може при проблем продуктът да бъде проследен и изтеглен своевременно.</li>
          <li><strong>Подвеждащи хранителни претенции:</strong> Твърдения като „екологично чист“, „лечебен“ или „без захар“ са строго регламентирани. Използването им без съответните лабораторни анализи и законови основания е абсолютно забранено.</li>
        </ol>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Как да защитите бизнеса си?</h3>
        <p>
          Не оставяйте етикетите на случайността. Инвестицията в професионален преглед на етикетите или практическо обучение по етикетиране е в пъти по-ниска от цената на един спрян продукт или един административен акт.
        </p>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <GraduationCap className="h-3.5 w-3.5" /> Препоръчани обучения по етикетиране
            </span>
          </div>
          <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
            Овладейте правилата за етикетиране и бъдете сигурни при проверки:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/80 p-4 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase">Видео обучение</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Практическо video обучение</h5>
                <p className="text-xs text-brand-dark/70 mt-1">22 детайлни видео лекции, онлайн тест и персонален сертификат от д-р Николова.</p>
              </div>
              <Link href="/library/video-etiketirane" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-3 cursor-pointer">
                Към обучението <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            
            <div className="bg-white/80 p-4 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-green uppercase">Ръководство (PDF)</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Етикетиране: съответствие, контрол и защита</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Пълен наръчник с чек-листи на инспектора и съвети как да действате при санкции.</p>
              </div>
              <Link href="/library/etiketirane-kontrol-zashtita" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-3 cursor-pointer">
                Към наръчника <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "kontrol-surovini-babh",
    title: "Скритият риск: Защо контролът на храните започва от суровините?",
    summary: "Повечето проблеми в производството започват от място, което не гледате — суровината. Научете защо влагата, температурите и записите са ключови.",
    date: "10 май 2026 г.",
    readTime: "4 мин. четене",
    image: "/blog_raw_materials.webp",
    tags: ["Производство", "Суровини", "Качество"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Много производители вярват, че рискът за безопасността на продуктите им започва по време на същинската кулинарна обработка или пакетиране. Истината обаче е съвсем различна — той започва много по-рано. Ако не контролирате суровината, вие губите контрол над крайния продукт още преди той да бъде произведен.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Слабите места при приема на суровини</h3>
        <p>
          В практиката си редовно наблюдавам как суровините се приемат „на око“, съхраняват се при неправилни температури „само за малко“ или документацията им се оставя за попълване „за после“. Тези наглед малки компромиси се натрупват и водят до сериозни проблеми:
        </p>
        <ul className="list-disc pl-5 space-y-3 mt-4">
          <li><strong>Критични точки при брашното и зърнените култури:</strong> В сладкарското и хлебопроизводството влагата в брашното, условията на съхранение и проследимостта на доставчика са критични. Наличието на влага или лошо проветрение води до бързо развитие на плесени и микотоксини, които не изчезват при печене.</li>
          <li><strong>Студено пресовани масла (олио от маслини, сусам, черен кимион):</strong> Тези продукти са изключително чувствителни на светлина и температура. Минимално повишаване на температурата при съхранение променя окислителните процеси, което разваля вкуса и качеството още преди клиентът да ги е отворил.</li>
          <li><strong>Производството на млечни и месни продукти (Наредба № 26):</strong> Тук всяко отклонение от хладилната верига е пагубно. Температурният контрол при доставка на сурово мляко или месо не търпи компромиси. Когато няма ясни записи и проследимост, рисковете са огромни.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Ако няма писмени записи за температурата и партидата на приетата суровина, за закона тази проверка не съществува. При инспекция липсата на проследимост е най-бързият път към глоба."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Как да изградим работещ контрол?</h3>
        <p>
          Всяка сладкарска работилница, фурна или цех трябва да има ясно подредена система за контрол:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
          <li><strong>Контрол на доставчиците:</strong> Работете само с одобрени и регистрирани обекти, които предоставят пълна декларация за съответствие при всяка доставка.</li>
          <li><strong>Задължително измерване на температурата:</strong> Приемайте охладени и замразени продукти само след измерване на температурата с калибриран термометър и я вписвайте в дневника за входящ контрол.</li>
          <li><strong>Ясно обозначаване на алергени:</strong> Суровините, съдържащи алергени (ядки, глутен, яйца, соя, сусам), трябва да се съхраняват физически отделно от останалите, за да се избегне кръстосано замърсяване.</li>
        </ol>

        <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-6 sm:p-8 border border-brand-gold/20 shadow-xl my-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark bg-brand-gold px-2.5 py-1 rounded">
            ⚡ Направете го автоматично
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold mt-3 mb-2">Входящият контрол на суровините — автоматизиран</h4>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Дневникът за приемане на стоки, температурите при доставка и проследимостта на партидите ги водите директно в платформата на д-р Николова — с напомняния да не пропуснете запис и готов печат за пред БАБХ.
          </p>
          <ul className="space-y-2 mt-4 text-xs sm:text-sm">
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🔔</span> Подсеща Ви за входящия контрол и температурите — не пропускате доставка.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">⚙️</span> Повтарящите се записи се попълват автоматично всеки месец.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🖨️</span> Пълна проследимост на партидите, готова за печат при проверка.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">📱</span> Записвате директно при доставката — от телефона, на място.</li>
          </ul>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer mt-5 group"
          >
            Изпробвайте безплатно 14 дни
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <GraduationCap className="h-3.5 w-3.5" /> Свързани обучения и ресурси
            </span>
          </div>
          <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
            Осигурете перфектен входящ контрол и проследимост:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/80 p-4 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase">Ръководство (PDF)</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Обекти с месо и животински продукти</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Мини ръководство за строгите санитарни изисквания и безопасност на суровините.</p>
              </div>
              <Link href="/library/meso-i-mesni-produkti" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-3 cursor-pointer">
                Към наръчника <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            
            <div className="bg-white/80 p-4 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-green uppercase">Онлайн курс на живо</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">НАССР Основи с д-р Николова</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Практически Zoom сесии за внедряване и водене на дневници за самоконтрол.</p>
              </div>
              <Link href="/live/haccp-osnovi" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-3 cursor-pointer">
                Запиши се за курса <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
        <p className="text-xs text-brand-dark/60 mt-4">
          Входящият контрол на суровините е една от критичните контролни точки. Вижте пълния обхват на <Link href="/haccp-sistema" className="text-brand-green font-semibold underline hover:text-brand-gold">внедряването на HACCP (ХАСЕП) система</Link>.
        </p>
      </div>
    )
  },
  {
    id: "e-nomera-dobavki-hrani",
    title: "Е-номерата в храните — митове, истини и законни изисквания",
    summary: "Страхувате ли се от Е-номерата? Научете кои добавки са всъщност напълно естествени витамини и какви са законите за тяхното деклариране.",
    date: "05 май 2026 г.",
    readTime: "3 мин. четене",
    image: "/blog_additives.webp",
    tags: ["Хранителни добавки", "Е-номера", "Потребители"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Темата за хранителните добавки е една от най-обсъжданите и същевременно най-слабо разбраните в обществото. Страхът от т.нар. „Е-номера“ често се дължи на липса на вярна и достъпна информация. Нека разграничим митовете от истината от гледна точка на науката и закона.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Мит или истина: Какво всъщност са Е-номерата?</h3>
        <div className="space-y-4 mt-4">
          <p>
            <strong>1. Всички Е-номера са опасни химикали? — МИТ.</strong><br />
            Е-номерът е просто код, който доказва, че дадена хранителна добавка е преминала през строги тестове за безопасност и е одобрена за употреба в Европейския съюз.
          </p>
          <p>
            <strong>2. Някои Е-номера са напълно естествени вещества? — ИСТИНА.</strong><br />
            Зад много от тези кодове се крият съставки, които консумираме ежедневно в чист вид:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>E300</strong> — Витамин C (аскорбинова киселина)</li>
            <li><strong>E330</strong> — Лимонена киселина (намираща се естествено в лимоните и цитрусите)</li>
            <li><strong>E440</strong> — Пектин (натурален желиращ агент, извличан от ябълки)</li>
          </ul>
          <p>
            <strong>3. Производителите могат да използват добавки без ограничение? — МИТ.</strong><br />
            Употребата на всяка добавка е строго регламентирана от законодателството. Има определени максимално допустими граници, които гарантират, че дори при ежедневна консумация няма риск за здравето на потребителите.
          </p>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Какво изисква законът за етикетирането на добавки?</h3>
        <p>
          Като производител или търговец на храни сте длъжни да информирате потребителите за всяка използвана добавка. Етикетът трябва задължително да посочва:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
          <li><strong>Функционалната категория:</strong> Например консервант, оцветител, антиоксидант, емулгатор.</li>
          <li><strong>Специфичното наименование или E-номер:</strong> Например „консервант: натриев бензоат“ или „консервант: Е211“.</li>
        </ol>
        <p>
          Присъствието на добавки в състава без коректно отразяване на етикета е сериозно нарушение, което се наказва с глоби при инспекция от БАБХ.
        </p>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <GraduationCap className="h-3.5 w-3.5" /> Свързани обучения и наръчници
            </span>
          </div>
          <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
            Научете правилата за етикетиране на съставки и добавки:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/80 p-4 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase">Ръководство (PDF)</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">15 златни правила за етикетиране</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Практически наръчник за деклариране на съставки, алергени и хранителна стойност.</p>
              </div>
              <Link href="/library/etiketirane-na-hrani" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-3 cursor-pointer">
                Към наръчника <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            
            <div className="bg-white/80 p-4 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-green uppercase">Видео курс</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Практическо видео обучение по етикетиране</h5>
                <p className="text-xs text-brand-dark/70 mt-1">22 видео лекции с примери, тест за проверка на знанията и официален сертификат.</p>
              </div>
              <Link href="/library/video-etiketirane" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-3 cursor-pointer">
                Към курса <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "haccp-dokumenti-babh",
    title: "Документацията по безопасност: Защо попълването на листи „на око“ не работи?",
    summary: "HACCP и ДПХП не са просто купчина хартия за пред БАБХ инспектора. Научете как да обучите персонала си и да превърнете системата в реална защита.",
    date: "01 май 2026 г.",
    readTime: "4 мин. четене",
    image: "/blog_staff_training.webp",
    tags: ["Документи", "Обучение на персонал", "HACCP"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Много собственици на ресторанти и магазини разглеждат папкита със системи за самоконтрол (ДПХП и HACCP) като досадна бюрокрация, която се прави единствено за да се покаже на инспектора при проверка. Това разбиране обаче е най-сигурният начин да си довлечете глоби или сериозни аварии.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Проблемът: Купчина документи, които никой не разбира</h3>
        <p>
          Когато системата е поръчана „по шаблон“, без да е съобразена с реалните процеси в обекта, се получава пропаст между документите и практиката. Персоналът започва да попълва дневниците за температура, дезинфекция и входящ контрол механично, най-често в края на седмицата или непосредствено преди проверка.
        </p>
        <p>
          Инспекторите на БАБХ имат огромен опит и веднага разпознават кога документите са попълвани ретроспективно „на око“ с една и съща химикалка. Липсата на реални записи, липсата на проследимост на съставките и непопълнените температурни графици са първите неща, за които се пишат предписания и глоби.
        </p>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Ако екипът Ви не разбира защо прави дадено записване или как да реагира при температурно отклонение, Вашата HACCP система не работи. Решението не е в трупането на повече хартия, а в реалното обучение на хората."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Как да превърнете документацията в работещ инструмент?</h3>
        <p>
          Следването на тези три прости правила ще Ви гарантира спокойствие при всяка внезапна проверка:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
          <li><strong>Опростете дневниците:</strong> Изисквайте от Вашия консултант да направи дневниците възможно най-кратки, ясни и удобни за попълване на работното място.</li>
          <li><strong>Практическо обучение на персонала:</strong> Инвестирайте време да обясните на служителите си защо дезинфекцията на плотовете се описва, какво е кръстосано замърсяване и как се контролират алергените. Когато хората разбират логиката, те попълват записите с лекота.</li>
          <li><strong>Реален вътрешен одит:</strong> Правете периодични проверки на дневниците и хигиената сами (или с външен одитор). Така ще откриете и отстраните грешките навреме, преди БАБХ да ги е видяла.</li>
        </ol>

        <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-6 sm:p-8 border border-brand-gold/20 shadow-xl my-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark bg-brand-gold px-2.5 py-1 rounded">
            ⚡ Направете го автоматично
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold mt-3 mb-2">Спрете да попълвате „на око“ — системата го прави вместо Вас</h4>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Дигиталните дневници в платформата на д-р Николова Ви подсещат кога да запишете температура, хигиена или входящ контрол, попълват повтарящото се автоматично и генерират официалните документи за печат. Няма как да изглеждат „писани с една химикалка преди проверката“.
          </p>
          <ul className="space-y-2 mt-4 text-xs sm:text-sm">
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🔔</span> Системата Ви подсеща кога да попълните всеки дневник — не пропускате срок.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">⚙️</span> Повтарящите се записи се попълват автоматично всеки месец.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🖨️</span> Официалните документи се разпечатват готови за пред БАБХ с един клик.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">📱</span> Реални записи с реални дати — вместо ретроспективно попълване преди проверка.</li>
          </ul>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer mt-5 group"
          >
            Изпробвайте безплатно 14 дни
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <Video className="h-3.5 w-3.5" /> Онлайн курс на живо
            </span>
            <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
              Практически курс по разработване, въвеждане и поддържане на НАССР система
            </h4>
            <p className="text-xs text-brand-dark/80 max-w-md">
              Спрете да попълвате Дневниците „на око“. Включете се в нашия Zoom курс и разберете как да настроите и управлявате Вашата HACCP система реално и лесно.
            </p>
          </div>
          <Link 
            href="/live/haccp-osnovi" 
            className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 hover:text-white group"
          >
            Запишете се за курса
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <p className="text-xs text-brand-dark/60 mt-4">
          Ако документацията Ви трябва да бъде изградена от нулата, вижте услугата <Link href="/haccp-sistema" className="text-brand-green font-semibold underline hover:text-brand-gold">разработка и внедряване на HACCP (ХАСЕП) система</Link>.
        </p>
      </div>
    )
  },
  {
    id: "alergeni-meniu-karavana",
    title: "МЕНЮ С АЛЕРГЕНИ – ПОДВИЖЕН ОБЕКТ ЗА ТЪРГОВИЯ С ХРАНИ (КАРАВАНА)",
    summary: "Как правилно да маркирате алергените в менюто на каравана, камион за храна или друг преместваем обект. Специфични изисквания и съвети за съвместимост с БАБХ.",
    date: "21 май 2026 г.",
    readTime: "4 мин. четене",
    image: "/food_truck_cover.webp",
    tags: ["Алергени", "Подвижен обект", "БАБХ изисквания", "Каравана"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Подвижните обекти за търговия с храни — популярните каравани, фууд тръкове (food trucks) и временни павилиони — преживяват истински бум през последните години. Те предлагат гъвкавост, атрактивен дизайн и бързо обслужване. За закона обаче преместваемият характер на обекта не означава по-ниски критерии за безопасност.
        </p>
        <p>
          Едно от най-важните изисквания на Българската агенция по безопасност на храните (БАБХ) и европейското законодателство е <strong>ясното и писмено информиране на клиентите за съдържанието на алергени</strong> в предлаганите храни.
        </p>

        <div className="my-8">
          <img 
            src="/alergeni.webp" 
            alt="Списък и маркиране на алергени в менюто на каравана" 
            className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg border border-brand-gold/30"
          />
          <span className="text-xs text-brand-dark/50 text-center block mt-2">Фигура 1: Основните 14 групи алергени, подлежащи на задължително деклариране</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Защо менюто с алергени е критично за караваните?</h3>
        <p>
          За разлика от класическите ресторанти с големи кухни, при караваните пространството е изключително ограничено. Това създава две основни предизвикателства:
        </p>
        <ul className="list-disc pl-5 space-y-3 mt-4">
          <li><strong>Висок риск от кръстосано замърсяване:</strong> Поради близостта на работните зони, следи от алерген (например глутен от хлебчетата за бургери или сусам от поръската) лесно могат да попаднат в иначе „безопасно“ ястие.</li>
          <li><strong>Динамично меню:</strong> Асортиментът на караваните често се променя според сезона, фестивала или наличността на суровини. Всяка промяна в рецептата изисква незабавна актуализация на информацията за алергените.</li>
        </ul>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Какви са законовите изисквания според Регламент (ЕС) № 1169/2011?</h3>
        <p>
          Регламентът задължава всички обекти, предлагащи непакетирани храни (каквито са и ястията, приготвени на място в караваната), да предоставят информация за 14-те основни групи алергени. Информацията трябва да бъде:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
          <li><strong>Писмена и лесно достъпна:</strong> Не е достатъчно персоналът просто да знае съставките „наизуст“. Информацията трябва да е пред очите на клиента.</li>
          <li><strong>Ясна и четлива:</strong> Обозначенията в менюто трябва да са лесни за разбиране (например чрез номерация, икони или съкращения, обяснени в легенда).</li>
          <li><strong>Налична преди покупката:</strong> Клиентът трябва да може да се запознае с алергените още докато избира какво да поръча от витрината или гишето.</li>
        </ol>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Практически съвети за внедряване в подвижен обект</h3>
        <p>
          За да сте напълно изрядни при проверка от БАБХ и да защитите здравето на своите клиенти, следвайте тези стъпки:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
          <li><strong>Легенда в главното меню:</strong> Поставете малки номера или символи до всяко ястие (напр. 1 за глутен, 3 за яйца, 7 за мляко) и разположете легенда с дешифриране на видно място до гишето за поръчки.</li>
          <li><strong>Информационна папка за алергените:</strong> Подгответе класьор с пълния състав и алергенния профил на всяко ястие (т.нар. технологични карти или рецептурници) и го дръжте на лесно достъпно място в караваната. Добавете надпис на гишето: <em>„При въпроси относно алергени, моля попитайте нашия персонал за подробната папка със съставките.“</em></li>
          <li><strong>Обучение на екипа:</strong> Всеки служител на гишето или скарата трябва да знае точно кои съставки се използват и как да реагира при запитване от клиент с алергия.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-6 rounded-r-xl my-8">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">💡 Съвет от експерта</span>
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "При караваните инспекторите проверяват изключително строго дали легендата за алергените е физически изложена на гишето. Липсата на такава писмена информация се класифицира като сериозно нарушение на Закона за храните."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl my-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-green px-2.5 py-1 rounded">
              <GraduationCap className="h-3.5 w-3.5" /> Внедряване на изискванията за алергени
            </span>
            <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green">
              Имате нужда от съдействие с Вашето меню?
            </h4>
            <p className="text-xs text-brand-dark/80">
              Изберете най-удобния за Вас начин — професионално изготвяне от наш експерт или практическо обучение, за да се подготвите сами.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-white/80 p-5 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-green uppercase">Готова услуга</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Изготвяне на Меню с Алергени</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Нашите експерти ще изработят Вашето меню съгласно изискванията на БАБХ и ще подготвят папката на обекта.</p>
              </div>
              <Link href="/services" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline mt-4 cursor-pointer">
                Вижте услугата <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            
            <div className="bg-white/80 p-5 rounded-xl border border-brand-green/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase">Обучение & Наръчници</span>
                <h5 className="font-bold text-brand-green text-sm mt-1">Правила за етикетиране и съставки</h5>
                <p className="text-xs text-brand-dark/70 mt-1">Научете как сами да маркирате алергените с нашия практически наръчник или видео курс.</p>
              </div>
              <div className="flex gap-4 mt-4">
                <Link href="/library/etiketirane-na-hrani" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline cursor-pointer">
                  Наръчник (PDF)
                </Link>
                <Link href="/library/video-etiketirane" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline cursor-pointer">
                  Видео курс
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-6 sm:p-8 border border-brand-gold/20 shadow-xl my-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark bg-brand-gold px-2.5 py-1 rounded">
            ⚡ Направете го автоматично
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold mt-3 mb-2">Менюто с алергени — винаги актуално и готово за печат</h4>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            В платформата на д-р Николова водите регистър с алергените на всяко ястие. Промените ли рецепта, легендата се обновява и я разпечатвате актуална за гишето — без ръчно преправяне и без риск от пропуск при проверка.
          </p>
          <ul className="space-y-2 mt-4 text-xs sm:text-sm">
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🔔</span> Подсеща Ви да обновите менюто при всяка промяна в рецептите.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">⚙️</span> Алергенната легенда се генерира автоматично от състава на ястията.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">🖨️</span> Разпечатвате актуалната легенда за гишето с един клик.</li>
            <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5 shrink-0">📱</span> Управлявате всичко от телефона — дори в тясната каравана.</li>
          </ul>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer mt-5 group"
          >
            Изпробвайте безплатно 14 дни
            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-8">Заключение</h3>
        <p>
          Правилното маркиране на алергените в мобилния Ви обект не само ще Ви спести сериозни глоби при инспекция, но и ще изгради доверие у клиентите. Когато хората виждат, че се грижите за тяхната безопасност и сте информирани, те се връщат отново и препоръчват Вашия обект.
        </p>
      </div>
    )
  }
];
