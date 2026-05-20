"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, X, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  content: React.ReactNode;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "registration-mistakes",
    title: "Колко ще Ви струва една грешка при регистрацията на нов обект за храни?",
    summary: "Много бизнеси губят време и пари още преди да започнат. Разберете кои са критичните пропуски при БАБХ проверка и как да ги избегнете.",
    date: "18 май 2026 г.",
    readTime: "4 мин. четене",
    image: "/blog_registration.png",
    tags: ["Регистрация", "БАБХ", "Старт на бизнес"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Стартирането на нов хранителен бизнес — било то малка пекарна, изискан ресторант или сладкарски цех — е изпълнено с ентусиазъм. Но реалността често удря предприемачите още в самото начало, при сблъсъка с нормативната уредба и инспекциите на Българската агенция по безопасност на храните (БАБХ).
        </p>
        
        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Истинската цена на една грешка при регистрация</h3>
        <p>
          Много собственици на бизнес мислят, че ако получат отказ или предписание, просто ще подадат документите отново на следващия ден. Истината обаче е много по-неприятна. Ето какво реално Ви струва всеки документален или физически пропуск в обекта:
        </p>
        
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Нова държавна такса и заявление:</strong> При всеки официален отказ процесът се прекратява и трябва да започнете процедурата отначало, плащайки отново държавни такси.</li>
          <li><strong>Скъпо преустройство на обекта:</strong> Ако сте подредили масите, кухненското оборудване или мивките „на око“ без предварителен технологичен проект, инспекторите могат да изискат пълно преместване за осигуряване на поточност. Това означава разбиване на плочки, пренареждане на тръби и закупуване на нови уреди.</li>
          <li><strong>Забавяне с месеци:</strong> Всеки отказ Ви връща с 15 до 30 дни назад. През това време плащате наем за празен обект, заплати за персонал, който чака да започне, и губите потенциални обороти.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-5 rounded-r-xl my-6">
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Виждала съм десетки бизнеси, които губят хиляди левове и мотивация още преди да са обслужили първия си клиент. И това не се случва защото идеята им е лоша, а защото не знаят как да приложат изискванията правилно."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Какво реално проверяват инспекторите при откриване?</h3>
        <p>
          Инспекторите не търсят просто „попълнени папки“. Те следят за спазването на три основни стълба:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Поточност на процесите:</strong> Кръстосването на чисти и мръсни пътища е най-честата причина за отказ. Суровините не трябва да се засичат с отпадъците или готовия продукт.</li>
          <li><strong>Материална база:</strong> Повърхностите трябва да са лесни за почистване и дезинфекция, мивките да имат топла вода и безконтактно задействане, а вентилационните и хладилните системи да са разчетени за капацитета.</li>
          <li><strong>Професионално разработени системи:</strong> Наличие на системи за самоконтрол (ДПХП и HACCP), които са адаптирани конкретно за Вашето меню и обект, а не просто копирани от интернет.</li>
        </ol>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Как да избегнете тези проблеми?</h3>
        <p>
          Спрете да действате „на сляпо“ и „на късмет“. Най-сигурният начин е да направите предварителен одит на обекта преди официалното посещение на БАБХ. Чрез професионален анализ на пространството и документите ще разберете къде са слабите места и ще ги коригирате навреме, спестявайки нерви, време и пари.
        </p>
      </div>
    )
  },
  {
    id: "food-labeling-errors",
    title: "Колко струва една грешка в етикета на хранителна стока?",
    summary: "Над 90% от производителите и търговците имат пропуски в етикетите си без да подозират. Научете как една липсваща дума може да спре бизнеса Ви.",
    date: "14 май 2026 г.",
    readTime: "5 мин. четене",
    image: "/blog_labeling.png",
    tags: ["Етикетиране", "Санкции", "Нормативна уредба"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Етикетът на хранителния продукт е Вашата визитна картичка пред потребителите, но и първото нещо, което инспекторите проверяват. Грешното етикетиране е сред най-честите причини за налагане на сериозни финансови санкции и изтегляне на стоки от търговската мрежа.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Колко струва един грешен етикет?</h3>
        <p>
          Ако смятате, че грешката в етикета е лек пропуск, помислете отново. Законодателството в ЕС е изключително строго и нарушаването му води до:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Глоби и актове:</strong> Финансовите санкции за подвеждаща информация или липса на задължителни реквизити могат да достигнат хиляди левове още при първо нарушение.</li>
          <li><strong>Спиране на продукция и брак:</strong> БАБХ има правото незабавно да спре продажбата на цяла партида стоки и да разпореди изтеглянето им от пазара, което води до директна загуба на суровини и труд.</li>
          <li><strong>Загуба на дистрибутори и клиенти:</strong> Търговските вериги отказват да работят с производители, чиито етикети са рискови, тъй като санкции се налагат и на продавача.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-5 rounded-r-xl my-6">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">⚠️ Статистика от практиката</span>
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Над 90% от производителите и търговците имат грешки в етикетите си... и дори не го знаят, докато не дойде проверка или сигнал за алергична реакция от клиент."
          </p>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Най-честите (и скъпи) пропуски при етикетиране</h3>
        <p>
          В практиката си се сблъсквам с няколко класически грешки, които се повтарят непрекъснато:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Неправилно изписване на алергените:</strong> Алергените трябва да бъдат ясно разграничени визуално от останите съставки (чрез шрифт, цвят или получерно изписване). Липсата на подчертаване на съставки като глутен, сусам или млечен протеин е директна заплаха за здравето и води до незабавно изтегляне на продукта.</li>
          <li><strong>Липса на проследимост:</strong> Всеки етикет трябва да съдържа номер на партида, производител или дистрибутор, за да може при проблем продуктът да бъде проследен и изтеглен своевременно.</li>
          <li><strong>Подвеждащи хранителни претенции:</strong> Твърдения като „екологично чист“, „лечебен“ или „без захар“ са строго регламентирани. Използването им без съответните лабораторни анализи и законови основания е абсолютно забранено.</li>
        </ol>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Как да защитите бизнеса си?</h3>
        <p>
          Не оставяйте етикетите на случайността. Инвестицията в професионален преглед на етикетите или практическо обучение по етикетиране е в пъти по-ниска от цената на един спрян продукт или един административен акт.
        </p>
      </div>
    )
  },
  {
    id: "raw-materials-control",
    title: "Скритият риск: Защо контролът на храните започва от суровините?",
    summary: "Повечето проблеми в производството започват от място, което не гледате — суровината. Научете защо влагата, температурите и записите са ключови.",
    date: "10 май 2026 г.",
    readTime: "4 мин. четене",
    image: "/blog_raw_materials.png",
    tags: ["Производство", "Суровини", "Качество"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Много производители вярват, че рискът за безопасността на продуктите им започва по време на същинската кулинарна обработка или пакетиране. Истината обаче е съвсем различна — той започва много по-рано. Ако не контролирате суровината, вие губите контрол над крайния продукт още преди той да бъде произведен.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Слабите места при приема на суровини</h3>
        <p>
          В практиката си редовно наблюдавам как суровините се приемат „на око“, съхраняват се при неправилни температури „само за малко“ или документацията им се оставя за попълване „за после“. Тези наглед малки компромиси се натрупват и водят до сериозни проблеми:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Критични точки при брашното и зърнените култури:</strong> В сладкарското и хлебопроизводството влагата в брашното, условията на съхранение и проследимостта на доставчика са критични. Наличието на влага или лошо проветрение води до бързо развитие на плесени и микотоксини, които не изчезват при печене.</li>
          <li><strong>Студено пресовани масла (олио от маслини, сусам, черен кимион):</strong> Тези продукти са изключително чувствителни на светлина и температура. Минимално повишаване на температурата при съхранение променя окислителните процеси, което разваля вкуса и качеството още преди клиентът да ги е отворил.</li>
          <li><strong>Производството на млечни и месни продукти (Наредба № 26):</strong> Тук всяко отклонение от хладилната верига е пагубно. Температурният контрол при доставка на сурово мляко или месо не търпи компромиси. Когато няма ясни записи и проследимост, рисковете са огромни.</li>
        </ul>

        <div className="bg-brand-light border-l-4 border-brand-gold p-5 rounded-r-xl my-6">
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Ако няма писмени записи за температурата и партидата на приетата суровина, за закона тази проверка не съществува. При инспекция липсата на проследимост е най-бързият път към глоба."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Как да изградим работещ контрол?</h3>
        <p>
          Всяка сладкарска работилница, фурна или цех трябва да има ясно подредена система за контрол:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Контрол на доставчиците:</strong> Работете само с одобрени и регистрирани обекти, които предоставят пълна декларация за съответствие при всяка доставка.</li>
          <li><strong>Задължително измерване на температурата:</strong> Приемайте охладени и замразени продукти само след измерване на температурата с калибриран термометър и я вписвайте в дневника за входящ контрол.</li>
          <li><strong>Ясно обозначаване на алергени:</strong> Суровините, съдържащи алергени (ядки, глутен, яйца, соя, сусам), трябва да се съхраняват физически отделно от останалите, за да се избегне кръстосано замърсяване.</li>
        </ol>
      </div>
    )
  },
  {
    id: "additives-e-numbers",
    title: "Е-номерата в храните — митове, истини и законни изисквания",
    summary: "Страхувате ли се от Е-номерата? Научете кои добавки са всъщност напълно естествени витамини и какви са законите за тяхното деклариране.",
    date: "05 май 2026 г.",
    readTime: "3 мин. четене",
    image: "/blog_additives.png",
    tags: ["Хранителни добавки", "Е-номера", "Потребители"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Темата за хранителните добавки е една от най-обсъжданите и същевременно най-слабо разбраните в обществото. Страхът от т.нар. „Е-номера“ често се дължи на липса на вярна и достъпна информация. Нека разграничим митовете от истината от гледна точка на науката и закона.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Мит или истина: Какво всъщност са Е-номерата?</h3>
        <div className="space-y-4">
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

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Какво изисква законът за етикетирането на добавки?</h3>
        <p>
          Като производител или търговец на храни сте длъжни да информирате потребителите за всяка използвана добавка. Етикетът трябва задължително да посочва:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Функционалната категория:</strong> Например консервант, оцветител, антиоксидант, емулгатор.</li>
          <li><strong>Специфичното наименование или E-номер:</strong> Например „консервант: натриев бензоат“ или „консервант: Е211“.</li>
        </ol>
        <p>
          Присъствието на добавки в състава без коректно отразяване на етикета е сериозно нарушение, което се наказва с глоби при инспекция от БАБХ.
        </p>
      </div>
    )
  },
  {
    id: "haccp-documentation-tips",
    title: "Документацията по безопасност: Защо попълването на листи „на око“ не работи?",
    summary: "HACCP и ДПХП не са просто купчина хартия за пред БАБХ инспектора. Научете как да обучите персонала си и да превърнете системата в реална защита.",
    date: "01 май 2026 г.",
    readTime: "4 мин. четене",
    image: "/blog_staff_training.png",
    tags: ["Документи", "Обучение на персонал", "HACCP"],
    content: (
      <div className="space-y-6 text-sm sm:text-base text-brand-dark/95 leading-relaxed">
        <p>
          Много собственици на ресторанти и магазини разглеждат папкита със системи за самоконтрол (ДПХП и HACCP) като досадна бюрокрация, която се прави единствено за да се покаже на инспектора при проверка. Това разбиране обаче е най-сигурният начин да си довлечете глоби или сериозни аварии.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Проблемът: Купчина документи, които никой не разбира</h3>
        <p>
          Когато системата е поръчана „по шаблон“, без да е съобразена с реалните процеси в обекта, се получава пропаст между документите и практиката. Персоналът започва да попълва дневниците за температура, дезинфекция и входящ контрол механично, най-често в края на седмицата или непосредствено преди проверка.
        </p>
        <p>
          Инспекторите на БАБХ имат огромен опит и веднага разпознават кога документите са попълвани ретроспективно „на око“ с една и съща химикалка. Липсата на реални записи, липсата на проследимост на съставките и непопълнените температурни графици са първите неща, за които се пишат предписания и глоби.
        </p>

        <div className="bg-brand-light border-l-4 border-brand-gold p-5 rounded-r-xl my-6">
          <p className="font-serif text-sm sm:text-base italic text-brand-green leading-relaxed">
            "Ако екипът Ви не разбира защо прави дадено записване или как да реагира при температурно отклонение, Вашата HACCP система не работи. Решението не е в трупането на повече хартия, а в реалното обучение на хората."
          </p>
          <span className="text-xs font-semibold block text-brand-gold mt-2">— д-р Данка Николова</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mt-6">Как да превърнете документацията в работещ инструмент?</h3>
        <p>
          Следването на тези три прости правила ще Ви гарантира спокойствие при всяка внезапна проверка:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Опростете дневниците:</strong> Изисквайте от Вашия консултант да направи дневниците възможно най-кратки, ясни и удобни за попълване на работното място.</li>
          <li><strong>Практическо обучение на персонала:</strong> Инвестирайте време да обясните на служителите си защо дезинфекцията на плотовете се описва, какво е кръстосано замърсяване и как се контролират алергените. Когато хората разбират логиката, те попълват записите с лекота.</li>
          <li><strong>Реален вътрешен одит:</strong> Правете периодични проверки на дневниците и хигиената сами (или с външен одитор). Така ще откриете и отстраните грешките навреме, преди БАБХ да ги е видяла.</li>
        </ol>
      </div>
    )
  }
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    // Lock scroll
    document.body.style.overflow = "hidden";
  };

  const handleClosePost = () => {
    setSelectedPost(null);
    // Unlock scroll
    document.body.style.overflow = "unset";
  };

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      {/* Header section */}
      <section className="bg-brand-green py-20 text-center relative overflow-hidden border-b border-brand-gold/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase text-brand-gold tracking-widest block">
            ПОЛЕЗНИ СЪВЕТИ И СТАТИИ
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Блог за безопасност на храните
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Практическа информация, експертни анализи на законите на БАБХ и съвети за Вашия сигурен и безпроблемен бизнес.
          </p>
        </div>
      </section>

      {/* Grid of articles */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id}
              className="bg-white border border-brand-green/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-gold/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-brand-light">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-4 text-[10px] sm:text-xs text-brand-dark/50">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-brand-green line-clamp-2 leading-snug group-hover:text-brand-gold transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-dark/70 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded bg-brand-light text-brand-green text-[9px] sm:text-[10px] font-semibold border border-brand-green/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => handleOpenPost(post)}
                  className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-brand-green hover:bg-brand-green/90 text-white rounded transition-all duration-300 flex items-center justify-center cursor-pointer hover:shadow-md"
                >
                  Прочети статията
                  <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials Banner to Consultations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-green text-white rounded-2xl p-8 sm:p-12 border border-brand-gold/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <h3 className="font-serif text-xl sm:text-3xl font-bold">Имате ли казус във Вашия обект?</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Не оставяйте проверките на случайността. Запазете час за индивидуална онлайн консултация с д-р Николова и получете ясни отговори и решения.
            </p>
            <div className="pt-2">
              <Link
                href="/consultations"
                className="inline-flex items-center px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest transition-colors rounded shadow-lg cursor-pointer"
              >
                Заяви консултация
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reading modal overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleClosePost}
          ></div>

          {/* Modal Container */}
          <div className="bg-white border border-brand-green/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300 scrollbar-thin">
            {/* Sticky Header inside modal */}
            <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-brand-green/5 flex justify-between items-center z-20">
              <div className="flex items-center space-x-2 text-brand-gold">
                <BookOpen className="h-5 w-5" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-green">Статия от блога</span>
              </div>
              <button 
                onClick={handleClosePost}
                className="text-brand-dark/50 hover:text-brand-dark bg-brand-light p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Banner image inside modal */}
            <div className="relative w-full aspect-[21/9] bg-brand-light">
              <Image 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedPost.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded bg-brand-gold text-brand-dark text-[9px] font-bold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-bold leading-tight">
                  {selectedPost.title}
                </h2>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Meta stats */}
              <div className="flex items-center space-x-6 text-xs text-brand-dark/50 pb-4 border-b border-brand-green/5">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5 text-brand-gold" />
                  Публикувано на: <strong>{selectedPost.date}</strong>
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5 text-brand-gold" />
                  Време за четене: <strong>{selectedPost.readTime}</strong>
                </span>
              </div>

              {/* Render dynamic article content */}
              <div className="prose max-w-none text-brand-dark">
                {selectedPost.content}
              </div>

              {/* In-modal Call to Action */}
              <div className="mt-12 bg-brand-light border border-brand-green/10 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green flex items-center justify-center sm:justify-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-brand-gold" />
                    Не оставяйте бизнеса си в риск!
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-dark/70 max-w-xl">
                    Желаете ли професионална проверка на Вашите етикети, системи за самоконтрол или подготовка за регистрация в БАБХ?
                  </p>
                </div>
                <Link
                  href="/consultations"
                  onClick={handleClosePost}
                  className="px-6 py-3 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-widest transition-colors rounded shadow shrink-0 text-center cursor-pointer"
                >
                  Заяви консултация с д-р Николова
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
