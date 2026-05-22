const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'ИИ ПРОЕКТИ', 'DANKA', 'src', 'app', 'profile', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">';
const formWrapperStart = '<div className="lg:col-span-5 relative z-10 flex flex-col">';

const startIndex = content.indexOf(startMarker);
const formWrapperIndex = content.indexOf(formWrapperStart, startIndex);

if (startIndex === -1 || formWrapperIndex === -1) {
  console.error("Could not find markers.");
  process.exit(1);
}

const replacement1 = `
            <div className="space-y-12 pb-12">
              {/* Main Glowing Title Section */}
              <div className="text-center max-w-4xl mx-auto space-y-6 pt-4 animate-fade-in">
                <div className="inline-block relative">
                  <div className="absolute inset-0 bg-brand-gold/20 blur-3xl rounded-full"></div>
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white relative z-10">
                    Вашият сигурен вход към <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-300 to-emerald-400 animate-pulse">спокойни</span> БАБХ проверки
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl mx-auto font-medium">
                  Забравете за дебелите хартиени папки и хаотичните записки. „БАБХ Спокойствие“ дигитализира целия Ви HACCP архив, ДХП дневници и обучения в едно модерно уеб приложение.
                </p>
                <div className="flex items-center justify-center gap-6 pt-2">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-brand-gold font-sans">1,200+</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Активни обекта</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                    <span className="block text-2xl font-black text-brand-gold font-sans">99.8%</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Одобрени дневници</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                    <span className="block text-2xl font-black text-brand-gold font-sans">100%</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">БАБХ Гаранция</span>
                  </div>
                </div>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start relative z-10 max-w-6xl mx-auto">
              
                {/* LEFT COLUMN: 2 Animated Panels */}
                <div className="space-y-6 hidden lg:block">
                  {/* Panel 1: HACCP Monitor */}
                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        HACCP Монитор
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold animate-pulse">ОПТИМАЛНО</span>
                    </div>
                    <div className="flex justify-center py-2 relative z-10">
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90 animate-[spin_10s_linear_infinite]" viewBox="0 0 36 36">
                          <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-emerald-400" strokeWidth="3" strokeDasharray="98, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-base font-black text-white font-mono">98%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Panel 2: Logbooks */}
                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Автоматични Дневници
                      </span>
                    </div>
                    <div className="space-y-3 relative z-10">
                       <div className="bg-white/5 border border-white/5 p-2 rounded-lg flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                         <span className="text-[9px] text-white/80 font-mono">t° Хладилник: 2.1°C (OK)</span>
                       </div>
                       <div className="bg-white/5 border border-white/5 p-2 rounded-lg flex items-center gap-2 opacity-70">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                         <span className="text-[9px] text-white/80 font-mono">Почистване: Завършено</span>
                       </div>
                       <div className="bg-white/5 border border-white/5 p-2 rounded-lg flex items-center gap-2 opacity-40">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                         <span className="text-[9px] text-white/80 font-mono">Доставка #12: Одобрена</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* CENTER COLUMN: Login/Register Card */}
                <div className="lg:col-span-1 relative z-20 flex flex-col w-full mx-auto max-w-lg">
`;

const part1 = content.substring(0, startIndex);
let restOfFile = content.substring(formWrapperIndex + formWrapperStart.length);

const rightPanels = `
                {/* RIGHT COLUMN: 2 Animated Panels */}
                <div className="space-y-6 hidden lg:block">
                  {/* Panel 3: Audit */}
                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
                        БАБХ Одит
                      </span>
                      <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider animate-pulse">ОДОБРЕН</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 relative z-10 overflow-hidden">
                      <div className="absolute left-0 top-0 w-full h-0.5 bg-blue-400/50 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse"></div>
                      <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider block">Официален Статус:</span>
                      <h5 className="text-[10px] font-bold text-white">„Обектът разполага с пълна дигитална HACCP система.“</h5>
                    </div>
                  </div>

                  {/* Panel 4: Training */}
                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        Обучения
                      </span>
                      <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">3/3 ЗАВЪРШЕНИ</span>
                    </div>
                    <div className="space-y-3 relative z-10">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[8px] font-bold text-white/50 uppercase">
                          <span>Хигиена</span>
                          <span className="text-rose-400">100%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-400 h-full w-full shadow-[0_0_10px_rgba(251,113,133,0.5)]"></div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[8px] font-bold text-white/50 uppercase">
                          <span>Алергени</span>
                          <span className="text-rose-400">100%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-400 h-full w-full shadow-[0_0_10px_rgba(251,113,133,0.5)]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;

// Use regex to tolerate \r\n line endings correctly!
const searchRegex = / {16}<\/div>\r?\n {14}<\/div>\r?\n {14}\r?\n {12}<\/div>/;
const replaceEndStr = "                </div>\\n              </div>\\n" + rightPanels + "\\n              \\n            </div>\\n          </div>";

if (!searchRegex.test(restOfFile)) {
  console.error("Could NOT find the end of the form block!");
  process.exit(1);
}

restOfFile = restOfFile.replace(searchRegex, "                </div>\n              </div>\n" + rightPanels + "\n              \n            </div>\n          </div>");

fs.writeFileSync(filePath, part1 + replacement1 + restOfFile, 'utf8');
console.log("Successfully refactored layout to Bento Grid!");
