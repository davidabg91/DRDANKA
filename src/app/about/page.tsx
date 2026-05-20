import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, GraduationCap, CheckCircle, FileText, Heart, Quote } from "lucide-react";


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
      <section className="bg-brand-green py-20 text-center relative overflow-hidden border-b border-brand-gold/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase text-brand-gold tracking-widest block">
            ЕКСПЕРТИЗА И ДОВЕРИЕ
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            За Д-р Данка Николова
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Повече от четвърт век отдаденост на безопасността на храните, защитата на здравето и подкрепата на българския хранителен бизнес.
          </p>
        </div>
      </section>

      {/* Main Bio Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
              Коя съм аз и защо да ми се доверите?
            </h2>
            <div className="text-sm text-brand-dark/80 space-y-4 leading-relaxed">
              <p>
                Казвам се д-р Данка Николова — ветеринарен лекар с над 27 години реален опит в контрола и безопасността на храните. Познавам процеса отвътре — така, както повечето хора никога няма да го видят.
              </p>
              <div className="bg-brand-light border-l-2 border-brand-gold p-4 space-y-2.5 my-5 rounded-r-xl">
                <p className="flex items-center text-xs sm:text-sm font-semibold text-brand-green">
                  <span className="text-brand-gold mr-2">👉</span> Работила съм в системата на държавния контрол.
                </p>
                <p className="flex items-center text-xs sm:text-sm font-semibold text-brand-green">
                  <span className="text-brand-gold mr-2">👉</span> Била съм пряка част от контролните органи.
                </p>
                <p className="flex items-center text-xs sm:text-sm font-semibold text-brand-green">
                  <span className="text-brand-gold mr-2">👉</span> Заемала съм и ръководни позиции в системата.
                </p>
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
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Нашите професионални ценности
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/60">
              Принципите, които ни водят при разработването на всяка HACCP и ISO система.
            </p>
          </div>

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
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase text-brand-gold tracking-widest block">
              ОТЗИВИ И РЕЗУЛТАТИ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Какво казват хората, които вече направиха регистрацията си правилно
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/60">
              Истории на реални бизнеси, преминали през процедурите бързо, лесно и без стрес.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white border border-brand-green/5 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-brand-gold/30 hover:shadow-md transition-all duration-300">
              <div className="space-y-4">
                <Quote className="h-8 w-8 text-brand-gold/40" />
                <p className="text-sm font-semibold text-brand-green italic leading-snug">
                  "Бяхме притеснени дали изобщо ще успеем да регистрираме пекарната си за закуски и козунаци".
                </p>
                <div className="text-xs text-brand-dark/70 space-y-2 leading-relaxed">
                  <p>
                    Много време се лутахме и не знаехме как да подредим нещата правилно… Месеци наред обикаляхме между различни институции, без да получим ясна посока.
                  </p>
                  <p>
                    С помощта на д-р Николова най-накрая получихме яснота. Подредихме всичко, направихме нужните стъпки и подготвихме обекта както трябва.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-green/5">
                <div className="space-y-1.5">
                  <div className="flex text-xs text-brand-green font-semibold space-x-2">
                    <span>✔ Регистрацията мина успешно</span>
                  </div>
                  <div className="flex text-xs text-brand-green font-semibold space-x-2">
                    <span>✔ Стартирахме спокойно</span>
                  </div>
                  <div className="flex text-xs text-brand-green font-semibold space-x-2">
                    <span>✔ Вече сме сигурни, че всичко е направено правилно</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-serif text-sm font-bold text-brand-green">Северина М.</h4>
                  <span className="text-[10px] text-brand-dark/50 block mt-0.5">Собственик на Пекарна за закуски и козунаци</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-brand-green/5 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-brand-gold/30 hover:shadow-md transition-all duration-300">
              <div className="space-y-4">
                <Quote className="h-8 w-8 text-brand-gold/40" />
                <p className="text-sm font-semibold text-brand-green italic leading-snug">
                  "След срещата с д-р Николова осъзнах, че нещата не са толкова сложни, колкото изглеждат".
                </p>
                <div className="text-xs text-brand-dark/70 space-y-2 leading-relaxed">
                  <p>
                    Преди това идеята ни да регистрираме мини мандра по Наредба №26 за директни доставки звучеше почти невъзможна.
                  </p>
                  <p>
                    С нейна помощ получихме яснота какво точно се изисква и как да го приложим на практика.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-green/5">
                <div className="space-y-1.5">
                  <div className="flex text-xs text-brand-green font-semibold space-x-2">
                    <span>✔ Имахме конкретен план</span>
                  </div>
                  <div className="flex text-xs text-brand-green font-semibold space-x-2">
                    <span>✔ Върнахме си мотивацията</span>
                  </div>
                  <div className="flex text-xs text-brand-green font-semibold space-x-2">
                    <span>✔ Видяхме възможност да отворим за месец</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-serif text-sm font-bold text-brand-green">Виктория Р.</h4>
                  <span className="text-[10px] text-brand-dark/50 block mt-0.5">Бъдещ собственик на мини мандра (директни доставки)</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-brand-green/5 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-brand-gold/30 hover:shadow-md transition-all duration-300">
              <div className="space-y-4">
                <Quote className="h-8 w-8 text-brand-gold/40" />
                <p className="text-sm font-semibold text-brand-green italic leading-snug">
                  "Проектът ми за производство на месни заготовки беше върнат три пъти от БАБХ."
                </p>
                <div className="text-xs text-brand-dark/70 space-y-2 leading-relaxed">
                  <p>
                    Всеки път правех корекции, но без ясна посока. В един момент вече бях напълно объркан и не знаех какво да променя.
                  </p>
                  <p>
                    След срещата с д-р Николова всичко се изясни – получих конкретни насоки, разбрах изискванията, направихме нужните корекции и процесът тръгна напред.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-green/5">
                <div className="space-y-1.5">
                  <div className="flex text-xs text-brand-green font-semibold space-x-2">
                    <span>✔ Преодоляхме три поредни отказа</span>
                  </div>
                  <div className="flex text-xs text-brand-green font-semibold space-x-2">
                    <span>✔ Сега имам яснота, увереност и сигурност</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-serif text-sm font-bold text-brand-green">Крум Т.</h4>
                  <span className="text-[10px] text-brand-dark/50 block mt-0.5">Собственик на цех за месни заготовки и разфасовки</span>
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
