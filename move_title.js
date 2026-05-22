const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'ИИ ПРОЕКТИ', 'DANKA', 'src', 'app', 'profile', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. We replace the old header section
const oldHeaderStart = '{/* 1. Header Hero Banner - Hidden on print */}';
const oldHeaderRegex = /\{\/\* 1\. Header Hero Banner - Hidden on print \*\/\}\r?\n\s*<section className=\{`\$\{!isLoggedIn \? "bg-transparent border-b border-white\/5" : "bg-brand-green border-b border-brand-gold\/15"\} py-10 text-center relative overflow-hidden print:hidden`\}>\r?\n\s*<div className="absolute inset-0 bg-\[radial-gradient\(ellipse_at_center,_var\(--tw-gradient-stops\)\)\] from-brand-gold\/5 via-transparent to-transparent opacity-75 pointer-events-none"><\/div>\r?\n\s*<div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-2">\r?\n\s*<span className="text-\[10px\] font-bold uppercase text-brand-gold tracking-widest block">\r?\n\s*СИСТЕМА ЗА ХРАНИТЕЛНА БЕЗОПАСНОСТ\r?\n\s*<\/span>\r?\n\s*<h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">\r?\n\s*\{userRole === "admin" \? "Административен Панел & Управление" : "Клиентски Портал и Записи"\}\r?\n\s*<\/h1>\r?\n\s*\{isLoggedIn && \(\r?\n\s*<p className="text-xs text-white\/80 max-w-2xl mx-auto font-medium">\r?\n\s*\{userRole === "admin" \? \(\r?\n\s*<>Администратор: <span className="text-brand-gold font-bold">д-р Данка Николова<\/span><\/>\r?\n\s*\) : \(\r?\n\s*<>Обект: <span className="text-brand-gold font-bold">\{firmInfo.name \|\| "Неконфигуриран"\}<\/span> \(\{firmInfo.niche\}\)<\/>\r?\n\s*\)\}\r?\n\s*<\/p>\r?\n\s*\)\}\r?\n\s*<\/div>\r?\n\s*<\/section>/;

const newHeader = `{/* 1. Header Hero Banner - Hidden on print */}
      <section className={\`\${!isLoggedIn ? "bg-transparent border-b border-white/5 pt-16 pb-8" : "bg-brand-green border-b border-brand-gold/15 py-10"} text-center relative overflow-hidden print:hidden\`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        
        {isLoggedIn ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-2">
            <span className="text-[10px] font-bold uppercase text-brand-gold tracking-widest block">
              СИСТЕМА ЗА ХРАНИТЕЛНА БЕЗОПАСНОСТ
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {userRole === "admin" ? "Административен Панел & Управление" : "Клиентски Портал и Записи"}
            </h1>
            <p className="text-xs text-white/80 max-w-2xl mx-auto font-medium">
              {userRole === "admin" ? (
                <>Администратор: <span className="text-brand-gold font-bold">д-р Данка Николова</span></>
              ) : (
                <>Обект: <span className="text-brand-gold font-bold">{firmInfo.name || "Неконфигуриран"}</span> ({firmInfo.niche})</>
              )}
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6 animate-fade-in">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-brand-gold/20 blur-3xl rounded-full"></div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white relative z-10">
                Вашият сигурен вход към <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-300 to-emerald-400 animate-pulse">спокойни</span> БАБХ проверки
              </h1>
            </div>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl mx-auto font-medium">
              Забравете за дебелите хартиени папки и хаотичните записки. „БАБХ Спокойствие“ дигитализира целия Ви HACCP архив, ДХП дневници и обучения в едно модерно уеб приложение.
            </p>
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="text-center">
                <span className="block text-2xl font-black text-brand-gold font-sans">24/7</span>
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Смарт Контрол</span>
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
        )}
      </section>`;

if (!oldHeaderRegex.test(content)) {
  console.error("Could not find the old header section to replace!");
  process.exit(1);
}

content = content.replace(oldHeaderRegex, newHeader);

// 2. We remove the Main Glowing Title Section where it previously was
const titleBlockRegex = /\{\/\* Main Glowing Title Section \*\/\}\r?\n\s*<div className="text-center max-w-4xl mx-auto space-y-6 pt-4 animate-fade-in">[\s\S]*?<\/div>\r?\n\s*<\/div>/;

if (!titleBlockRegex.test(content)) {
  console.error("Could not find the old title block to remove!");
  process.exit(1);
}

content = content.replace(titleBlockRegex, "");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully moved title and removed the old one.");
