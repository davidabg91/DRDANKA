import React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Video, ArrowRight } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  content: React.ReactNode;
}

export const BLOG_POSTS: BlogPost[] = [
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
