import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, GraduationCap, CheckCircle, FileText, Heart, Quote, Star, BadgeCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";


export default function About() {
  const credentials = [
    {
      title: "Образование и Научна степен",
      desc: "Доктор по контрол на храните и ветеринарно-санитарна експертиза. Магистър по безопасност на храните.",
      icon: GraduationCap,
    },
    {
      title: "27 Години Професионален Опит",
      desc: "Дългогодишен опит като ветеринарен лекар в системата за държавен контрол, на ръководни позиции и като одитор.",
      icon: Award,
    },
    {
      title: "Сертифициран Одитор",
      desc: "Лицензиран водещ одитор за международните стандарти ISO 22000, IFS Food и ISO 9001.",
      icon: ShieldCheck,
    },
  ];

  const values = [
    {
      title: "Безкомпромисен професионализъм",
      desc: "Нашите системи не са просто документи, които да покажете при проверка. Те са проектирани да работят реално и да гарантират безопасността на всяка сервирана или произведена порция.",
    },
    {
      title: "Партньорство с бизнеса",
      desc: "Ние не сме критични проверяващи, а Ваши съветници. Работим рамо до рамо с Вас, за да намерим най-лесния и икономически изгоден начин да отговорите на изискванията на закона.",
    },
    {
      title: "Пълна регулаторна сигурност",
      desc: "Следим постоянно динамичните промени в законодателството на България и ЕС, за да може Вашият бизнес винаги да изпреварва новите нормативни изисквания.",
    },
  ];

  return (
    <div className="bg-brand-light pb-24">
      {/* Page Header */}
      <section className="bg-brand-green py-12 sm:py-16 text-center relative overflow-hidden border-b border-brand-gold/20">
        {/* Luxury Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/15 via-brand-green/95 to-brand-green pointer-events-none"></div>
        {/* Subtle grid overlay for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-[9px] sm:text-[10px] font-black uppercase text-brand-gold tracking-[0.2em] shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
              <span className="relative rounded-full h-1.5 w-1.5 bg-brand-gold"></span>
            </span>
            ЗА МЕН · ЕКСПЕРТИЗА И ДОВЕРИЕ
          </span>
          
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            За <span className="text-brand-gold italic font-medium font-serif block sm:inline-block hover:scale-[1.01] transition-transform duration-300">Д-р Данка Николова</span>
          </h1>

          <div className="flex items-center justify-center gap-3 py-1">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-brand-gold/45"></div>
            <div className="w-1 h-1 rounded-full bg-brand-gold"></div>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-brand-gold/45"></div>
          </div>

          <p className="font-serif text-xs sm:text-sm lg:text-base text-white/95 max-w-2xl mx-auto leading-relaxed font-light italic text-pretty">
            „Повече от четвърт век отдаденост на безопасността на храните, защитата на здравето и подкрепата на българския хранителен бизнес.“
          </p>



        </div>
      </section>

      {/* Sticky Navigation (Placed outside section to stick globally) */}
      <div className="sticky top-[85px] z-30 w-full flex justify-center -mt-6 mb-6 px-2 sm:px-4 pointer-events-none transition-all duration-300">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 bg-brand-green/90 backdrop-blur-md py-1.5 px-2 sm:py-2.5 sm:px-6 rounded-2xl border border-brand-gold/20 shadow-xl shadow-black/20 pointer-events-auto">
          <a href="#info" className="px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-xl border border-white/20 text-white text-[9px] sm:text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all shadow-sm">
            Информация
          </a>
          <a href="#reviews" className="px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark text-[9px] sm:text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-brand-gold/20 flex items-center gap-1 sm:gap-2">
            Отзиви <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-brand-dark" />
          </a>
        </div>
      </div>

      {/* Main Bio Section */}
      <section id="info" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Visual Portrait */}
          <div className="lg:col-span-5">
            <div className="relative border border-brand-gold/30 rounded-2xl p-2 bg-white shadow-2xl">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
                <Image
                  src="/698517272_122192018888592298_1962692581428285218_n.jpg"
                  alt="Д-р Данка Николова"
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">
                    Главен консултант
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Д-р Данка Николова
                  </h3>
                  <p className="text-[10px] text-white/70 font-light mt-1">
                    27+ години реален опит в безопасността на храните
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Biography Text */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              align="left"
              className="!mb-0"
              badgeText="ЗА МЕН"
              title="Коя съм аз и защо да ми се доверите?"
            />
            <div className="text-sm text-brand-dark/80 space-y-4 leading-relaxed">
              <p>
                Казвам се д-р Данка Николова — ветеринарен лекар с над 27 години реален опит в контрола и безопасността на храните. Познавам процеса отвътре — така, както повечето хора никога няма да го видят.
              </p>
              <div className="bg-white border border-brand-green/10 shadow-sm p-6 space-y-4 my-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-gold"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-brand-green/10 transition-colors duration-500"></div>
                
                <div className="flex items-start gap-3 relative z-10">
                  <BadgeCheck className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-brand-green leading-relaxed">
                    Работила съм в системата на държавния контрол.
                  </p>
                </div>
                <div className="flex items-start gap-3 relative z-10">
                  <BadgeCheck className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-brand-green leading-relaxed">
                    Била съм пряка част от контролните органи.
                  </p>
                </div>
                <div className="flex items-start gap-3 relative z-10">
                  <BadgeCheck className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-brand-green leading-relaxed">
                    Заемала съм и ръководни позиции в системата.
                  </p>
                </div>
              </div>
              <p>
                През моята кариера съм виждала десетки случаи, в които обекти получават отказ за регистрация, процедурите се забавят с месеци, а бизнесите губят големи суми пари още преди да започнат. И това не се случва защото идеите или обектите им са лоши, а защото не знаят как да приложат изискванията правилно.
              </p>
              <p>
                Благодарение на опита си от двете страни на процеса, знам в детайли какво реално се гледа при проверка за регистрация, къде най-често се допускат грешки и как да ги избегнете още от първия път. Имам богат практически опит в изграждането и внедряването на критични системи като <strong>HACCP</strong>, <strong>ДПХП/ДХП</strong>, <strong>ISO 22000</strong> и <strong>FSSC 22000</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {credentials.map((cred, i) => {
            const Icon = cred.icon;
            return (
              <div
                key={i}
                className="bg-white border border-brand-green/5 rounded-xl p-6 shadow-sm hover:border-brand-gold/30 hover:shadow-md transition-all duration-300"
              >
                <div className="bg-brand-green/5 p-3 rounded-lg border border-brand-green/10 text-brand-green inline-block mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-brand-green mb-2">
                  {cred.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">
                  {cred.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Core Values Section */}
        <div className="bg-white border border-brand-green/5 rounded-2xl p-8 sm:p-12 shadow-sm mb-20">
          <SectionHeading
            badgeText="ЦЕННОСТИ"
            title="Нашите професионални ценности"
            subtitle="Принципите, които ни водят при разработването на всяка HACCP и ISO система."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center space-x-2 text-brand-gold">
                  <Heart className="h-5 w-5 fill-brand-gold" />
                  <h3 className="font-serif text-base font-bold text-brand-green">
                    {val.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="reviews" className="mb-20 scroll-mt-24">
          <SectionHeading
            badgeText={
              <div className="flex items-center gap-2">
                <span>ОТЛИЧНА ОЦЕНКА</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
              </div>
            }
            title="Какво казват хората, които вече направиха регистрацията си правилно"
            subtitle="Истории на реални бизнеси, преминали през процедурите бързо, лесно и без стрес."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-brand-gold text-brand-gold drop-shadow-sm group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${star * 50}ms`}} />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-dark/40 uppercase tracking-wider font-semibold">Преди 3 седмици</span>
                </div>
                
                <h3 className="text-sm sm:text-base font-bold text-brand-green mb-3 leading-snug">
                  "Бяхме притеснени дали изобщо ще успеем да регистрираме пекарната си за закуски и козунаци"
                </h3>
                <div className="text-xs sm:text-sm text-brand-dark/70 space-y-3 leading-relaxed">
                  <p>
                    Много време се лутахме и не знаехме как да подредим нещата правилно… Месеци наред обикаляхме между различни институции, без да получим ясна посока.
                  </p>
                  <p>
                    С помощта на д-р Николова най-накрая получихме яснота. Подредихме всичко, направихме нужните стъпки и подготвихме обекта както трябва.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-brand-green/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-[#0a1f17] text-brand-gold flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                  СМ
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-brand-green flex items-center gap-1.5">
                    Северина М.
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  </h4>
                  <span className="text-[10px] text-brand-dark/50 font-medium">Собственик на Пекарна за закуски</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-brand-gold text-brand-gold drop-shadow-sm group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${star * 50}ms`}} />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-dark/40 uppercase tracking-wider font-semibold">Преди 1 месец</span>
                </div>
                
                <h3 className="text-sm sm:text-base font-bold text-brand-green mb-3 leading-snug">
                  "След срещата с д-р Николова осъзнах, че нещата не са толкова сложни, колкото изглеждат"
                </h3>
                <div className="text-xs sm:text-sm text-brand-dark/70 space-y-3 leading-relaxed">
                  <p>
                    Преди това идеята ни да регистрираме мини мандра по Наредба №26 за директни доставки звучеше почти невъзможна.
                  </p>
                  <p>
                    С нейна помощ получихме яснота какво точно се изисква и как да го приложим на практика.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-brand-green/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-[#0a1f17] text-brand-gold flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                  ВР
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-brand-green flex items-center gap-1.5">
                    Виктория Р.
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  </h4>
                  <span className="text-[10px] text-brand-dark/50 font-medium">Собственик на мини мандра</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-brand-gold text-brand-gold drop-shadow-sm group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${star * 50}ms`}} />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-dark/40 uppercase tracking-wider font-semibold">Преди 2 месеца</span>
                </div>
                
                <h3 className="text-sm sm:text-base font-bold text-brand-green mb-3 leading-snug">
                  "Проектът ми за производство на месни заготовки беше върнат три пъти от БАБХ"
                </h3>
                <div className="text-xs sm:text-sm text-brand-dark/70 space-y-3 leading-relaxed">
                  <p>
                    Всеки път правех корекции, но без ясна посока. В един момент вече бях напълно объркан и не знаех какво да променя.
                  </p>
                  <p>
                    След срещата с д-р Николова всичко се изясни – получих конкретни насоки, разбрах изискванията, направихме нужните корекции и процесът тръгна напред.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-brand-green/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-[#0a1f17] text-brand-gold flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                  КТ
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-brand-green flex items-center gap-1.5">
                    Крум Т.
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  </h4>
                  <span className="text-[10px] text-brand-dark/50 font-medium">Собственик на цех за месо</span>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-brand-gold text-brand-gold drop-shadow-sm group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${star * 50}ms`}} />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-dark/40 uppercase tracking-wider font-semibold">Преди 1 седмица</span>
                </div>
                
                <h3 className="text-sm sm:text-base font-bold text-brand-green mb-3 leading-snug">
                  "Професионалист като нея би ми спестил много нерви и пари, защото във бизнеса всяка грешка се заплаща!"
                </h3>
                <div className="text-xs sm:text-sm text-brand-dark/70 space-y-3 leading-relaxed">
                  <p>
                    Щастлива съм, че срещнах Д-р Николова. Откривам заведение и нейните съвети и консултации ми бяха изключително ценни! Подкрепена в точния момент! Имах много въпроси, на които получих бърз професионален отговор!
                  </p>
                  <p>
                    Изключително важно и решаващо за първите стъпки в бизнеса е да бъдеш правилно консултиран и да тръгнеш в правилната посока!
                  </p>
                  <p>
                    Не се колебайте да се консултирате с Д-р Николова, тя е верният партньор до вас!
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-brand-green/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-[#0a1f17] text-brand-gold flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                  АК
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-brand-green flex items-center gap-1.5">
                    Албена Колева
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  </h4>
                  <span className="text-[10px] text-brand-dark/50 font-medium">Собственик на заведение</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA link */}
        <div className="text-center bg-brand-green text-white rounded-2xl p-8 sm:p-12 border border-brand-gold/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="font-serif text-xl sm:text-3xl font-bold">Нека защитим бизнеса Ви заедно</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Не чакайте предписания или глоби. Свържете се с д-р Данка Николова за професионален преглед на Вашата дейност и осигурете пълно нормативно съответствие.
            </p>
            <div className="pt-2">
              <Link
                href="/consultations"
                className="inline-flex items-center px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest transition-colors rounded shadow-lg"
              >
                Заяви онлайн одит
              </Link>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
