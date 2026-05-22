const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const chatPanel = `                  {/* Panel 4: Chat */}
                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        Чат с Д-р Данка
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <div className="space-y-3 relative z-10">
                       <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-sm w-[85%]">
                         <div className="text-[9px] text-white/90 leading-relaxed">Здравейте! Виждам, че днес имате инспекция от БАБХ. Нуждаете ли се от съдействие?</div>
                         <div className="text-[7px] text-white/40 text-right mt-1">10:42 ч.</div>
                       </div>
                       <div className="bg-brand-gold/20 border border-brand-gold/30 p-3 rounded-2xl rounded-tr-sm w-[85%] ml-auto">
                         <div className="text-[9px] text-brand-dark font-medium leading-relaxed">Да, проверяват ни температурите в момента. Всичко е в дневниците!</div>
                         <div className="text-[7px] text-brand-dark/50 text-right mt-1">10:45 ч.</div>
                       </div>
                    </div>
                  </div>
                </div>`;

code = code.replace(/<\/div>\s*\{\/\* CENTER COLUMN: Login\/Register Card \*\/\}/, '\n' + chatPanel + '\n\n                {/* CENTER COLUMN: Login/Register Card */}');

fs.writeFileSync('src/app/profile/page.tsx', code, 'utf8');
console.log('Chat panel added successfully!');
