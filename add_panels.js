const fs = require('fs');

const filePath = 'src/app/profile/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Rename "Автоматични Дневници" to "Дигитални Дневници"
content = content.replace('Автоматични Дневници', 'Дигитални Дневници');

// 2. Add Cloud Archive to Left Column
const cloudArchivePanel = `                  {/* Panel 3: Cloud Archive */}
                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4-4 4 4"></path></svg>
                        Облачен Архив
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">256-BIT КРИПТИРАН</span>
                    </div>
                    <div className="space-y-2 relative z-10">
                       <div className="bg-white/5 border border-white/5 p-2 rounded-lg flex items-center gap-3">
                         <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-[10px]">📄</div>
                         <div>
                           <div className="text-[9px] text-white/90 font-bold">Удостоверение_БАБХ.pdf</div>
                           <div className="text-[7px] text-white/50">Качено преди 2 дни</div>
                         </div>
                       </div>
                       <div className="bg-white/5 border border-white/5 p-2 rounded-lg flex items-center gap-3 opacity-60">
                         <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-[10px]">📄</div>
                         <div>
                           <div className="text-[9px] text-white/90 font-bold">Договор_ДДД.pdf</div>
                           <div className="text-[7px] text-white/50">Качено преди 1 седмица</div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>`;
// Replace the closing div of the left column
content = content.replace(/(\s*)<\/div>\s*\{\/\* CENTER COLUMN: Login\/Register Card \*\/\}/, '\n' + cloudArchivePanel + '\n\n$1{/* CENTER COLUMN: Login/Register Card */}');

// 3. Add Smart Notifications to Right Column
const smartNotificationsPanel = `                  {/* Panel 6: Smart Notifications */}
                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                        Смарт Известия
                      </span>
                      <div className="relative">
                        <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">АКТИВНИ</span>
                        <div className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                      <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-2 border-amber-400 p-2 rounded-r-lg">
                        <div className="text-[9px] font-bold text-amber-400 mb-0.5">⚠️ Изтичащ Срок</div>
                        <div className="text-[8px] text-white/70">Мед. книжка на Иван П. изтича след 5 дни.</div>
                      </div>
                      <div className="bg-white/5 border-l-2 border-white/10 p-2 rounded-r-lg">
                        <div className="text-[9px] font-bold text-white/60 mb-0.5">ℹ️ Ново съобщение</div>
                        <div className="text-[8px] text-white/40">Д-р Николова ви изпрати документ.</div>
                      </div>
                    </div>
                  </div>
                </div>`;

content = content.replace(/(\s*)<\/div>\s*<\/div>\s*<\/div>\s*\}\)\}\s*<\/div>\s*\{\/\* 3\. LOGGED-IN DASHBOARD \*\/\}/, '\n' + smartNotificationsPanel + '\n              </div>\n            </div>\n          )}\n        </div>\n      )}\n      {/* 3. LOGGED-IN DASHBOARD */}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully inserted new panels.');
