"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, useDankaUsers } from "@/lib/firebaseHooks";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { BUSINESS_CATEGORIES, getSectorForNiche } from "@/data/businessCategories";

import { 
  User, 
  Building, 
  Calendar, 
  Printer, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Bell, 
  Clock, 
  Plus, 
  Trash2, 
  Settings, 
  LogOut, 
  Lock, 
  FileText, 
  Check, 
  Activity, 
  FileCheck, 
  Sparkles,
  ChevronRight,
  ShieldAlert,
  MessageSquare,
  Send,
  Users,
  Search,
  PlusCircle,
  Eye,
  XCircle
} from "lucide-react";

export interface AssignedMaterial {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'test';
  assignedAt: string;
  questions?: Array<{
    id: string;
    text: string;
    options: string[];
    correctIdx: number;
  }>;
  userAnswers?: number[];
  score?: number; // percentage
  status: 'pending' | 'completed';
}

export interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  sentAt: string;
}

export interface DankaUser {
  email: string;
  password: string;
  firmName: string;
  eik: string;
  contact: string;
  phone: string;
  sector?: string;
  niche: string;
  desc: string;
  address: string;
  manager: string;
  status: 'pending' | 'approved' | 'expired';
  role: 'user' | 'admin';
  assignedDocs: AssignedMaterial[];
  messages: Message[];
}

// Mock templates for HACCP/DHP document generator
const DOCUMENT_TEMPLATES = {
  dhp: {
    title: "Система за самоконтрол (Добри Хигиенни Практики)",
    content: (firm: any) => `
РЕПУБЛИКА БЪЛГАРИЯ
ОБЕКТ: ${firm.name || "[Име на Фирма]"}
АДРЕС НА ОБЕКТА: ${firm.address || "[Адрес на Обекта]"}
УПРАВИТЕЛ: ${firm.manager || "[Име на Управител]"}
ЕИК: ${firm.eik || "[Булстат / ЕИК]"}

ДОБРИ ХИГИЕННИ И ПРОИЗВОДСТВЕНИ ПРАКТИКИ (ДХП / ДПП)
(съгласно изискванията на чл. 17 от Закона за храните)

1. ЛИЧНА ХИГИЕНА НА ПЕРСОНАЛА
Всички лица, работещи в обекта, преминават задължителен медицински преглед и притежават лична здравна книжка. Преди започване на работа персоналът облича чисто работно облекло, измива и дезинфекцира ръцете си.
2. ВХОДЯЩ КОНТРОЛ НА СУРОВИНИ
Хранителните стоки се приемат само от регистрирани по Закона за храните доставчици. За всяка доставка се проверява: партиден номер, срок на годност, температура на съхранение при транспорта и състояние на опаковката. Данните се записват в Дневника за входящ контрол.
3. СЪХРАНЕНИЕ НА ХРАНИТЕ
Храните се съхраняват при хладилни условия съобразно указанията на производителя (за бързоразвалящи се храни) или при стайна температура в сухи складове. Отчитането на хладилните температури се извършва двукратно (сутрин и вечер) в Дневника за температурния режим.
4. ПОЧИСТВАНЕ И ДЕЗИНФЕКЦИЯ
Обектът се почиства ежедневно по утвърден график с разрешени от МЗ дезинфекционни препарати. Резултатите се вписват ежедневно в Дневника по дезинфекционния режим.
    `
  },
  pest: {
    title: "Програма за мониторинг на вредители (ДДД)",
    content: (firm: any) => `
РЕПУБЛИКА БЪЛГАРИЯ
ОБЕКТ: ${firm.name || "[Име на Фирма]"}
АДРЕС НА ОБЕКТА: ${firm.address || "[Адрес на Обекта]"}
УПРАВИТЕЛ: ${firm.manager || "[Име на Управител]"}
ЕИК: ${firm.eik || "[Булстат / ЕИК]"}

ИНСТРУКЦИЯ И ПРОГРАМА ЗА ДЕЗИНСЕКЦИЯ И ДЕРАТИЗАЦИЯ (ДДД)

1. ЦЕЛ
Програмата цели предотвратяване на проникването и развитието на вредители (гризачи, насекоми) в помещенията на обекта, които могат да доведат до механично или микробиологично замърсяване на храните.
2. ОРГАНИЗАЦИЯ НА ТРЕТИРАНИЯТА
Обектът има сключен договор с лицензирана ДДД фирма. Обработките срещу вредители се извършват по график (поне веднъж месечно) или извънредно при сигнал.
3. МЕРКИ ЗА ЗАЩИТА
Всички отвори, прозорци и вентилационни канали са защитени с мрежи. Хранителните отпадъци се съхраняват в затворени контейнери с капаци и се извозват ежедневно. Преди всяка ДДД обработка хранителните продукти се покриват или прибират в хладилни съоръжения.
    `
  },
  allergens: {
    title: "Процедура за управление на алергени и етикетиране",
    content: (firm: any) => `
РЕПУБЛИКА БЪЛГАРИЯ
ОБЕКТ: ${firm.name || "[Име на Фирма]"}
АДРЕС НА ОБЕКТА: ${firm.address || "[Адрес на Обекта]"}
УПРАВИТЕЛ: ${firm.manager || "[Име на Управител]"}
ЕИК: ${firm.eik || "[Булстат / ЕИК]"}

ПРОЦЕДУРА ЗА УПРАВЛЕНИЕ НА АЛЕРГЕНИТЕ И ЕТИКЕТИРАНЕТО
(съгласно Регламент (ЕС) № 1169/2011)

1. ИДЕНТИФИЦИРАНЕ НА АЛЕРГЕНИ
При входящия контрол на суровини се следи за съдържанието на някои от 14-те основни алергена (глутен, мляко, яйца, ядки, фъстъци, соя, риба, целина, горчица, сусам, серен диоксид, ракообразни, мекотели, лупина).
2. ПРЕДОТВРАТЯВАНЕ НА КРЪСТОСАНО ЗАМЪРСЯВАНЕ
При подготовка на храните се използват отделни дъски за рязане, прибори и посуда за ястия, декларирани като „без съдържание на алергени“. Плотовете се измиват основно след обработка на глутенови или ядкови съставки.
3. ИНФОРМИРАНЕ НА КЛИЕНТИТЕ
Обектът излага Писмена Легенда за алергените на достъпно за клиентите място или в менюто с храните. Всеки персонал е обучен да отговаря на запитвания на клиенти с алергии.
    `
  },
  haccp: {
    title: "Система НАССР (Критични Контролни Точки)",
    content: (firm: any) => `
РЕПУБЛИКА БЪЛГАРИЯ
ОБЕКТ: ${firm.name || "[Име на Фирма]"}
АДРЕС НА ОБЕКТА: ${firm.address || "[Адрес на Обекта]"}
УПРАВИТЕЛ: ${firm.manager || "[Име на Управител]"}
ЕИК: ${firm.eik || "[Булстат / ЕИК]"}

СИСТЕМА ЗА АНАЛИЗ НА ОПАСНОСТИТЕ И КРИТИЧНИ КОНТРОЛНИ ТОЧКИ (НАССР)

1. КРИТИЧНИ КОНТРОЛНИ ТОЧКИ (ККТ)
В съответствие с технологичния процес са идентифицирани следните ККТ:
- ККТ 1: Приемане (Входящ контрол) и Съхранение на охладени/замразени животински суровини. Критична граница: Температура на охладени храни ≤ 4°C, замразени ≤ -18°C.
- ККТ 2: Термична обработка (Cooking). Критична граница: Вътрешна температура на продукта в центъра ≥ 75°C.
2. МОНИТОРИНГ И КОРЕКТИВНИ ДЕЙСТВИЯ
Отговорните служители извършват измервания на всяка критична точка. При превишаване на температурата:
- Доставката се отказва при входящ контрол.
- При термична обработка – времето на печене се удължава до достигане на нормата.
    `
  }
};

// Course contents for reading inside profile
const COURSE_CONTENTS = {
  labeling: {
    title: "15 златни правила за етикетиране на храните",
    content: `
15 ЗЛАТНИ ПРАВИЛА ЗА ЕТИКЕТИРАНЕ НА ХРАНИТЕ
Практичен наръчник от д-р Данка Николова

Правило 1: Името на храната трябва да бъде точно и да не подвежда купувача.
Правило 2: Списъкът на съставките е задължителен и започва с най-голямото количество.
Правило 3: Всеки алерген трябва да е подчертан, удебелен или с различен цвят в съставките.
Правило 4: Количеството на определени съставки (напр. плодово съдържание) трябва да се посочва в проценти.
Правило 5: Нетното количество се изразява в литри, сантилитри, милилитри, килограми или грамове.
Правило 6: Датата на минимална трайност („Най-добър до...“) или срок на годност („Използвай преди...“) е задължителна.
Правило 7: Условията за съхранение (напр. от 0°C до 4°C) трябва да са ясно указани за бързоразвалящи се храни.
Правило 8: Бизнес името и адресът на производителя или вносителя трябва да присъстват.
Правило 9: Страната на произход е задължителна за месо, плодове, зеленчуци и мед.
Правило 10: Указанията за употреба се добавят, ако без тях е трудно правилното консумиране.
Правило 11: Действителното алкохолно съдържание по обем се посочва за напитки с над 1.2 об.%.
Правило 12: Хранителната декларация (енергийна стойност, мазнини, въглехидрати, протеини, сол) е задължителна за пакетирани храни.
Правило 13: Текстът на етикета в България задължително трябва да бъде на български език.
Правило 14: Шрифтът на задължителната информация не може да бъде по-малък от 1.2 мм височина на буквата "х".
Правило 15: Здравните претенции на етикета изискват научно доказателство и одобрение от ЕО.
    `
  },
  meat: {
    title: "Практическо ръководство за обекти с месо",
    content: `
ПРАКТИЧЕСКО МИНИ РЪКОВОДСТВО ЗА ОБЕКТИ С МЕСО И МЕСНИ ПРОДУКТИ
Как да избегнеш отказ, забавяне и излишни разходи при регистрация в БАБХ

Раздел 1: Подготовка на обекта и сграден фонд
Подовете трябва да са гладки, лесни за измиване и дезинфекция. Задължително е разделянето на зоните (чиста зона за разфасовка и мръсна зона за приемане и отпадъци).
Раздел 2: Водоснабдяване и вентилация
Обектът трябва да разполага с достатъчно топла и студена питейна вода. Вентилацията трябва да предотвратява конденз по стените и таваните.
Раздел 3: Хладилна верига
Охладено месо се съхранява от 0°C до 4°C (за птици – до 2°C, за мляно месо – до 2°C). Замразено месо – под -18°C. Хладилниците трябва да са оборудвани с термометри.
Раздел 4: Документация пред БАБХ
Изисква се подаване на заявление по образец, НАССР система със специфични ККТ за месо, ДХП процедури, договори за ДДД и екарисаж.
    `
  }
};

export default function ProfilePage() {
  // Authentication states
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const { users: firebaseUsers, loading: usersLoading, setFullUser, updateUser } = useDankaUsers();

  const saveUsers = (newUsers: DankaUser[]) => {
    setUsersList(newUsers);
    // Sync changed users to Firestore
    newUsers.forEach(nu => {
      const oldUser = usersList.find(ou => ou.email === nu.email);
      if (!oldUser || JSON.stringify(oldUser) !== JSON.stringify(nu)) {
        setFullUser(nu.email, nu);
      }
    });
  };

  useEffect(() => {
    if (!usersLoading && firebaseUsers.length > 0) {
      setUsersList(firebaseUsers);
    }
  }, [firebaseUsers, usersLoading]);

  useEffect(() => {
    if (!authLoading) {
      if (firebaseUser) {
        setIsLoggedIn(true);
        setCurrentUserEmail(firebaseUser.email || "");
        
        if (firebaseUser.email === "d.nikolova.haccp@gmail.com") {
          setUserRole("admin");
        } else {
          const matchedUser = firebaseUsers.find(u => u.email === firebaseUser.email);
          if (matchedUser) {
            setUserRole(matchedUser.role);
            setFirmInfo({
              name: matchedUser.firmName,
              eik: matchedUser.eik,
              address: matchedUser.address,
              manager: matchedUser.manager,
              niche: matchedUser.niche
            });
          }
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUserEmail("");
        setUserRole("user");
      }
    }
  }, [firebaseUser, authLoading, firebaseUsers]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Multi-user & Admin state variables
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [usersList, setUsersList] = useState<DankaUser[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<"candidates" | "users" | "materials" | "messages" | "logs">("candidates");

  // Admin Materials form states
  const [materialType, setMaterialType] = useState<"document" | "test">("document");
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialContent, setNewMaterialContent] = useState("");
  const [newMaterialTarget, setNewMaterialTarget] = useState("all");
  const [newTestQuestions, setNewTestQuestions] = useState<Array<{ id: string; text: string; options: string[]; correctIdx: number }>>([]);
  
  // Draft Question builder states
  const [draftQuestionText, setDraftQuestionText] = useState("");
  const [draftQuestionOpt1, setDraftQuestionOpt1] = useState("");
  const [draftQuestionOpt2, setDraftQuestionOpt2] = useState("");
  const [draftQuestionOpt3, setDraftQuestionOpt3] = useState("");
  const [draftQuestionCorrect, setDraftQuestionCorrect] = useState(0);

  // Admin Chat state
  const [adminActiveChatEmail, setAdminActiveChatEmail] = useState("");
  const [adminChatMessageText, setAdminChatMessageText] = useState("");

  // Admin Logs Auditor state
  const [auditUserEmail, setAuditUserEmail] = useState("");
  const [auditSelectedDate, setAuditSelectedDate] = useState("");
  const [auditLogs, setAuditLogs] = useState<any>({
    incoming: [],
    fridges: [],
    hygiene: { desinfection: false, surfaces: false, floors: false, waste: false },
    staff: { checkPassed: false, healthy: true },
    thermal: [],
    fryer: { fryerUsed: false, oilQualityOk: true, oilChanged: false }
  });

  // Admin User search/filter state
  const [usersSearchQuery, setUsersSearchQuery] = useState("");

  // User assigned materials states
  const [activeAssignedMaterial, setActiveAssignedMaterial] = useState<AssignedMaterial | null>(null);
  const [userTestAnswers, setUserTestAnswers] = useState<number[]>([]);
  const [userChatMessageText, setUserChatMessageText] = useState("");

  // Application form states (now merged with registration)
  const [applyFirmName, setApplyFirmName] = useState("");
  const [applyEik, setApplyEik] = useState("");
  const [applyContact, setApplyContact] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [applySector, setApplySector] = useState("Заведения за обществено хранене (ЗОХ)");
  const [applyNiche, setApplyNiche] = useState("Ресторанти");
  const [applyDesc, setApplyDesc] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // Approval flow states
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingFirmName, setPendingFirmName] = useState("");

  // User details states
  const [firmInfo, setFirmInfo] = useState({
    name: "",
    eik: "",
    address: "",
    manager: "",
    niche: "Заведение за хранене" // Default niche
  });

  // Navigation tabs in profile
  const [activeTab, setActiveTab] = useState("logs"); // logs, haccp, assigned, courses, chat, tools, settings

  // Daily logs state
  const [selectedDate, setSelectedDate] = useState("");
  const [logIncoming, setLogIncoming] = useState<any[]>([]);
  const [logFridges, setLogFridges] = useState<any[]>([]);
  const [logHygiene, setLogHygiene] = useState<any>({
    desinfection: false,
    surfaces: false,
    floors: false,
    waste: false
  });
  const [logStaff, setLogStaff] = useState<any>({
    checkPassed: false,
    healthy: true
  });
  const [logThermal, setLogThermal] = useState<any[]>([]);
    const [logTraceability, setLogTraceability] = useState<any[]>([{ product: "", batchOut: "", rawMaterial: "", batchIn: "", amount: "" }]);
  const [logDisposal, setLogDisposal] = useState<any[]>([{ product: "", batch: "", amount: "", reason: "", method: "" }]);
  const [logFryer, setLogFryer] = useState<any>({
    fryerUsed: false,
    oilQualityOk: true,
    oilChanged: false
  });

  // Tools state: Self-Audit Questionnaire
  const [auditAnswers, setAuditAnswers] = useState<any>({});
  const [auditScore, setAuditScore] = useState<number | null>(null);

  // Tools state: Expiration Tracker
  const [dueDates, setDueDates] = useState({
    dddContract: "2026-06-15",
    healthCards: "2026-09-01",
    waterAnalysis: "2026-11-20"
  });

  // Tools state: Food shelf-life calculator
  const [foodType, setFoodType] = useState("milk");
  const [openedTime, setOpenedTime] = useState("");
  const [calculatedExpiry, setCalculatedExpiry] = useState("");

  // Document modal viewer
  const [activeDocKey, setActiveDocKey] = useState<string | null>(null);
  // Course modal reader
  const [activeCourseKey, setActiveCourseKey] = useState<string | null>(null);

      // Load state and initial date on client mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    // Initialize danka_users if not present
    let users: DankaUser[] = [];
    const storedUsers = localStorage.getItem("danka_users");
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    } else {
      users = [
        {
          email: "d.nikolova.haccp@gmail.com",
          password: "davida9166",
          firmName: "БАБХ Спокойствие",
          eik: "123456789",
          contact: "д-р Данка Николова",
          phone: "0888888888",
          niche: "Консултации",
          desc: "Администратор на системата",
          address: "гр. София, ул. БАБХ 1",
          manager: "д-р Данка Николова",
          status: "approved",
          role: "admin",
          assignedDocs: [],
          messages: []
        },
        {
          email: "kristian.cafe@gmail.com",
          password: "password123",
          firmName: "Кофи Шоп ЕООД",
          eik: "207554321",
          contact: "Кристиан Иванов",
          phone: "0877123456",
          niche: "Заведение за хранене",
          desc: "Уютно квартално кафене със 20 места на закрито. Предлагаме кафе, чай, сладкиши, сандвичи.",
          address: "гр. София, ул. Шипка 12",
          manager: "Кристиан Иванов",
          status: "pending",
          role: "user",
          assignedDocs: [],
          messages: []
        },
        {
          email: "danka_client@gmail.com",
          password: "password123",
          firmName: "Вкусни Мигове ЕООД",
          eik: "207654321",
          contact: "Георги Георгиев",
          phone: "0888123456",
          niche: "Заведение за хранене",
          desc: "Ресторант с българска национална кухня, 50 места.",
          address: "гр. София, бул. Витоша 45",
          manager: "Георги Георгиев",
          status: "approved",
          role: "user",
          assignedDocs: [
            {
              id: "dhp-initial",
              title: "Инструкция за хигиена на персонала",
              content: "Персоналът е длъжен да спазва строга лична хигиена. Работното облекло се сменя ежедневно. Ръцете се мият и дезинфекцират при всяко влизане в работната зона.",
              type: "document",
              assignedAt: today,
              status: "pending"
            }
          ],
          messages: [
            {
              id: "msg-1",
              sender: "user",
              text: "Здравейте д-р Николова, имам въпрос относно дневника за хладилници.",
              sentAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: "msg-2",
              sender: "admin",
              text: "Здравейте! Разбира се, с какво мога да помогна?",
              sentAt: new Date(Date.now() - 1800000).toISOString()
            }
          ]
        }
      ];
      // localStorage.setItem("danka_users", JSON.stringify(users));
    }

    // Ensure the admin user is always in the users array
    const adminExists = users.some(u => u.email.toLowerCase().trim() === "d.nikolova.haccp@gmail.com");
    if (!adminExists) {
      const adminUser: DankaUser = {
        email: "d.nikolova.haccp@gmail.com",
        password: "davida9166",
        firmName: "БАБХ Спокойствие",
        eik: "123456789",
        contact: "д-р Данка Николова",
        phone: "0888888888",
        niche: "Консултации",
        desc: "Администратор на системата",
        address: "гр. София, ул. БАБХ 1",
        manager: "д-р Данка Николова",
        status: "approved",
        role: "admin",
        assignedDocs: [],
        messages: []
      };
      users = [adminUser, ...users];
      // localStorage.setItem("danka_users", JSON.stringify(users));
    }

    setUsersList(users);

    // Simulated check auth
    const storedAuth = localStorage.getItem("danka_auth_logged");
    const storedEmail = localStorage.getItem("danka_current_user_email") || "";
    if (storedAuth === "true" && storedEmail) {
      const loggedUser = users.find(u => u.email.toLowerCase().trim() === storedEmail.toLowerCase().trim());
      if (loggedUser) {
        setIsLoggedIn(true);
        setCurrentUserEmail(loggedUser.email);
        setUserRole(loggedUser.role);
        if (loggedUser.role === "user") {
          setFirmInfo({
            name: loggedUser.firmName,
            eik: loggedUser.eik,
            address: loggedUser.address,
            manager: loggedUser.manager || loggedUser.contact,
            niche: loggedUser.niche
          });
        }
      }
    }
  }, []);

  // Sync date-based logs when selectedDate changes or when user details change
  useEffect(() => {
    if (!isLoggedIn || !selectedDate || userRole !== "user" || !currentUserEmail) return;
    const key = `danka_logs_${currentUserEmail.replace("@", "_").replace(".", "_")}_${selectedDate}`;
    const storedLogs = localStorage.getItem(key);
    if (storedLogs) {
      const parsed = JSON.parse(storedLogs);
      setLogIncoming(parsed.incoming || []);
      setLogFridges(parsed.fridges || []);
      setLogHygiene(parsed.hygiene || { desinfection: false, surfaces: false, floors: false, waste: false });
      setLogStaff(parsed.staff || { checkPassed: false, healthy: true });
      setLogThermal(parsed.thermal || []);
      setLogFryer(parsed.fryer || { fryerUsed: false, oilQualityOk: true, oilChanged: false });
    } else {
      // Default empty structures based on niche
      setLogIncoming([
        { product: "Охладено пилешко месо", supplier: "Метро Кеш & Кери", batch: "P2981-L", temp: "2", expiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], compliant: true }
      ]);
      setLogFridges([
        { name: "Хладилна витрина (салати)", tempAm: "3", tempPm: "4" },
        { name: "Хладилник за месо", tempAm: "1", tempPm: "2" },
        { name: "Основен фризер", tempAm: "-19", tempPm: "-18" }
      ]);
      setLogHygiene({ desinfection: false, surfaces: false, floors: false, waste: false });
      setLogStaff({ checkPassed: false, healthy: true });
      setLogThermal([
        { product: "Готвено пилешко филе", time: "11:30", tempCook: "78", cooled: true }
      ]);
      setLogFryer({ fryerUsed: false, oilQualityOk: true, oilChanged: false });
    }
  }, [selectedDate, isLoggedIn, userRole, currentUserEmail]);

  // Sync audited logs when auditor selects another user/date
  useEffect(() => {
    if (userRole !== "admin" || !auditUserEmail || !auditSelectedDate) return;
    const key = `danka_logs_${auditUserEmail.replace("@", "_").replace(".", "_")}_${auditSelectedDate}`;
    const storedLogs = localStorage.getItem(key);
    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs));
    } else {
      setAuditLogs({
        incoming: [],
        fridges: [],
        hygiene: { desinfection: false, surfaces: false, floors: false, waste: false },
        staff: { checkPassed: false, healthy: true },
        thermal: [],
        fryer: { fryerUsed: false, oilQualityOk: true, oilChanged: false }
      });
    }
  }, [auditUserEmail, auditSelectedDate, userRole]);

  // Print helper writing to a hidden iframe to prevent printing the whole page
  const handlePrintText = (title: string, content: string) => {
    let iframe = document.getElementById("print-iframe") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "print-iframe";
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace;
                padding: 40px;
                color: #000;
                line-height: 1.5;
                font-size: 14px;
                white-space: pre-wrap;
              }
              @media print {
                body { padding: 0; margin: 0; }
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 250);
    }
  };

  // Print label helper writing to a hidden iframe
  const handlePrintLabel = (product: string, opened: string, expiry: string) => {
    let iframe = document.getElementById("print-iframe") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "print-iframe";
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 15px;
                text-align: center;
                color: #000;
              }
              .label-card {
                border: 2px solid #000;
                padding: 10px;
                border-radius: 5px;
                display: inline-block;
                width: 250px;
              }
              .title { font-weight: bold; font-size: 16px; margin-bottom: 5px; text-transform: uppercase; }
              .detail { font-size: 12px; margin: 3px 0; }
              .highlight { font-weight: bold; font-size: 13px; }
            </style>
          </head>
          <body>
            <div class="label-card">
              <div class="title">ЕТИКЕТ ЗА ОТВОРЕНА ХРАНА</div>
              <div class="detail">Продукт: <span class="highlight">${product}</span></div>
              <div class="detail">Отворен на: ${opened}</div>
              <div class="detail">Годен до: <span class="highlight">${expiry}</span></div>
              <div class="detail" style="margin-top: 10px; font-size: 10px; border-top: 1px dashed #000; padding-top: 5px;">
                Контрол по НАССР / БАБХ Спокойствие
              </div>
            </div>
          </body>
        </html>
      `);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 250);
    }
  };

      // Sign In handler checking local users array
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      alert("Моля, попълнете имейл и парола.");
      return;
    }
    const cleanEmail = authEmail.trim().toLowerCase();

    try {
      if (cleanEmail === "d.nikolova.haccp@gmail.com" && authPassword === "davida9166") {
        try {
          await signInWithEmailAndPassword(auth, cleanEmail, authPassword);
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
             await createUserWithEmailAndPassword(auth, cleanEmail, authPassword);
             await setDoc(doc(db, "users", cleanEmail), {
                email: cleanEmail,
                password: "---",
                firmName: "БАБХ Спокойствие",
                eik: "123456789",
                contact: "д-р Данка Николова",
                phone: "0888888888",
                niche: "Консултации",
                desc: "Администратор на системата",
                address: "гр. София, ул. БАБХ 1",
                manager: "д-р Данка Николова",
                status: "approved",
                role: "admin",
                assignedDocs: [],
                messages: []
             });
          } else {
             alert("Грешка при вход: " + err.message);
          }
        }
        return;
      }

      await signInWithEmailAndPassword(auth, cleanEmail, authPassword);
      const matchedUser = firebaseUsers.find(u => u.email === cleanEmail);
      if (matchedUser) {
        if (matchedUser.status === "pending") {
          setPendingEmail(matchedUser.email);
          setPendingFirmName(matchedUser.firmName);
          setIsPendingApproval(true);
          await signOut(auth);
          return;
        } else if (matchedUser.status === "expired") {
          alert("Абонаментът на този профил е изтекъл. Моля свържете се с администратор.");
          await signOut(auth);
          return;
        }
      }
    } catch (err: any) {
      alert("Грешка при вход. Моля проверете имейл и парола.");
    }
  };

  // Register & Apply handler
  const handleRegisterAndApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !applyFirmName || !applyContact || !applyPhone || !applyDesc) {
      alert("Моля, попълнете всички полета с червена звездичка (*).");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert("Паролите не съвпадат.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const pendingUser: DankaUser = {
        email: regEmail,
        password: "---",
        firmName: applyFirmName,
        eik: applyEik || "Няма въведен",
        contact: applyContact,
        phone: applyPhone,
        sector: applySector,
        niche: applyNiche,
        desc: applyDesc,
        address: "Не е въведен",
        manager: applyContact,
        status: "pending",
        role: "user",
        assignedDocs: [],
        messages: []
      };
      
      const updatedList = [...usersList, pendingUser];
      saveUsers(updatedList);
      
      setPendingEmail(regEmail);
      setPendingFirmName(applyFirmName);
      setIsPendingApproval(true);
      await signOut(auth);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        alert("Този имейл вече е регистриран.");
      } else {
        alert("Грешка при регистрация: " + err.message);
      }
    }
  };


  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setCurrentUserEmail("");
    setUserRole("user");
    setActiveTab("logs");
  };

  // Admin approves candidate
  const handleApproveCandidate = (email: string) => {
    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, status: "approved" as const };
      }
      return u;
    });
    saveUsers(updatedUsers);
    alert(`Обектът с имейл ${email} беше успешно одобрен!`);
  };

  // Admin toggles user active/expired status
  const handleToggleUserStatus = (email: string, currentStatus: string) => {
    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const nextStatus = currentStatus === "approved" ? "expired" as const : "approved" as const;
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveUsers(updatedUsers);
  };

  // Admin deletes user
  const handleDeleteUser = (email: string) => {
    if (!confirm(`Сигурни ли сте, че искате да изтриете потребител ${email}?`)) return;
    const updatedUsers = usersList.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    saveUsers(updatedUsers);
  };

  const handleSaveFirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail) return;
    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
        return {
          ...u,
          firmName: firmInfo.name,
          eik: firmInfo.eik,
          address: firmInfo.address,
          manager: firmInfo.manager,
          niche: firmInfo.niche
        };
      }
      return u;
    });
    saveUsers(updatedUsers);
    localStorage.setItem("danka_firm_info", JSON.stringify(firmInfo));
    alert("Фирмените настройки бяха успешно запазени!");
  };

  // Admin assigns document
  const handleAssignDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle || !newMaterialContent) {
      alert("Моля попълнете заглавие и съдържание.");
      return;
    }

    const newDoc: AssignedMaterial = {
      id: "doc_" + Date.now(),
      title: newMaterialTitle,
      content: newMaterialContent,
      type: "document",
      assignedAt: new Date().toISOString().split("T")[0],
      status: "pending"
    };

    const updatedUsers = usersList.map(u => {
      if (u.role === "user" && (newMaterialTarget === "all" || u.email.toLowerCase() === newMaterialTarget.toLowerCase())) {
        return {
          ...u,
          assignedDocs: [...u.assignedDocs, newDoc]
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    
    // Reset inputs
    setNewMaterialTitle("");
    setNewMaterialContent("");
    alert("Документът беше успешно изпратен!");
  };

  // Admin adds question draft to new test
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftQuestionText || !draftQuestionOpt1 || !draftQuestionOpt2 || !draftQuestionOpt3) {
      alert("Моля попълнете текста на въпроса и трите опции.");
      return;
    }

    const newQ = {
      id: "q_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      text: draftQuestionText,
      options: [draftQuestionOpt1, draftQuestionOpt2, draftQuestionOpt3],
      correctIdx: draftQuestionCorrect
    };

    setNewTestQuestions([...newTestQuestions, newQ]);
    
    // Clear question builder fields
    setDraftQuestionText("");
    setDraftQuestionOpt1("");
    setDraftQuestionOpt2("");
    setDraftQuestionOpt3("");
    setDraftQuestionCorrect(0);
  };

  // Admin deletes question draft
  const handleDeleteDraftQuestion = (idx: number) => {
    const updated = [...newTestQuestions];
    updated.splice(idx, 1);
    setNewTestQuestions(updated);
  };

  // Admin assigns test
  const handleAssignTest = () => {
    if (!newMaterialTitle) {
      alert("Моля въведете заглавие на теста.");
      return;
    }
    if (newTestQuestions.length === 0) {
      alert("Моля добавете поне един въпрос.");
      return;
    }

    const newTest: AssignedMaterial = {
      id: "test_" + Date.now(),
      title: newMaterialTitle,
      content: "Интерактивен тест с избор на отговори.",
      type: "test",
      assignedAt: new Date().toISOString().split("T")[0],
      questions: newTestQuestions,
      status: "pending"
    };

    const updatedUsers = usersList.map(u => {
      if (u.role === "user" && (newMaterialTarget === "all" || u.email.toLowerCase() === newMaterialTarget.toLowerCase())) {
        return {
          ...u,
          assignedDocs: [...u.assignedDocs, newTest]
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    
    setNewMaterialTitle("");
    setNewTestQuestions([]);
    alert("Тестът беше успешно изпратен!");
  };

  // Admin deletes an assigned material from a user's record
  const handleDeleteAssignedMaterial = (userEmail: string, materialId: string) => {
    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === userEmail.toLowerCase()) {
        return {
          ...u,
          assignedDocs: u.assignedDocs.filter(d => d.id !== materialId)
        };
      }
      return u;
    });
    saveUsers(updatedUsers);
  };

  // Admin sends chat message
  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminActiveChatEmail || !adminChatMessageText.trim()) return;

    const newMsg: Message = {
      id: "msg_" + Date.now(),
      sender: "admin",
      text: adminChatMessageText.trim(),
      sentAt: new Date().toISOString()
    };

    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === adminActiveChatEmail.toLowerCase()) {
        return {
          ...u,
          messages: [...u.messages, newMsg]
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    setAdminChatMessageText("");
  };

  // User sends chat message
  const handleSendUserMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail || !userChatMessageText.trim()) return;

    const newMsg: Message = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: userChatMessageText.trim(),
      sentAt: new Date().toISOString()
    };

    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
        return {
          ...u,
          messages: [...u.messages, newMsg]
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    setUserChatMessageText("");
  };

  // User solves an assigned test
  const handleSolveTest = () => {
    if (!activeAssignedMaterial || !activeAssignedMaterial.questions || !currentUserEmail) return;
    
    const questions = activeAssignedMaterial.questions;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userTestAnswers[idx] === q.correctIdx) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);

    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
        const updatedDocs = u.assignedDocs.map(doc => {
          if (doc.id === activeAssignedMaterial.id) {
            return {
              ...doc,
              status: "completed" as const,
              userAnswers: userTestAnswers,
              score: scorePercent
            };
          }
          return doc;
        });
        return {
          ...u,
          assignedDocs: updatedDocs
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    
    alert(`Тестът е решен успешно! Вашият резултат е: ${scorePercent}% (${correctCount}/${questions.length} верни отговора).`);
    setActiveAssignedMaterial(null);
    setUserTestAnswers([]);
  };

  // Mark assigned document as completed (read)
  const handleCompleteDocument = (materialId: string) => {
    if (!currentUserEmail) return;
    
    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
        const updatedDocs = u.assignedDocs.map(doc => {
          if (doc.id === materialId) {
            return {
              ...doc,
              status: "completed" as const
            };
          }
          return doc;
        });
        return {
          ...u,
          assignedDocs: updatedDocs
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    alert("Документът е отбелязан като прочетен!");
  };

  // Print a clean, formatted report of the audited user's logs
  const handlePrintAuditedLogs = () => {
    if (!auditUserEmail || !auditSelectedDate) return;
    const user = usersList.find(u => u.email.toLowerCase() === auditUserEmail.toLowerCase());
    if (!user) return;

    let text = `====================================================
ОФИЦИАЛЕН БАБХ ОДИТ НА САМОКОНТРОЛНИ ДНЕВНИЦИ
====================================================
Обект: ${user.firmName}
ЕИК: ${user.eik}
МОЛ: ${user.manager || user.contact}
Адрес: ${user.address || "Не е посочен"}
Дата на одит: ${auditSelectedDate}
----------------------------------------------------\n\n`;

    // 1. Входящ контрол
    text += `1. ДНЕВНИК ЗА ВХОДЯЩ КОНТРОЛ НА ХРАНИ:\n`;
    if (!auditLogs.incoming || auditLogs.incoming.length === 0) {
      text += `Няма записани доставки.\n`;
    } else {
      auditLogs.incoming.forEach((row: any, i: number) => {
        text += ` - Доставка #${i+1}: Продукт: ${row.product} | Доставчик: ${row.supplier} | Партида: ${row.batch} | t: ${row.temp}°C | Годен до: ${row.expiry} | Опаковка: ${row.compliant ? "ИЗРЯДНА" : "БРАК"}\n`;
      });
    }
    text += `\n`;

    // 2. Хладилници
    text += `2. ТЕМПЕРАТУРЕН ДНЕВНИК НА ХЛАДИЛНИЦИ:\n`;
    if (!auditLogs.fridges || auditLogs.fridges.length === 0) {
      text += `Няма записани хладилни температури.\n`;
    } else {
      auditLogs.fridges.forEach((row: any) => {
        text += ` - Съоръжение: ${row.name} | t° Сутрин: ${row.tempAm || "-"}°C | t° Вечер: ${row.tempPm || "-"}°C\n`;
      });
    }
    text += `\n`;

    // 3. Хигиена
    text += `3. ДЕЗИНФЕКЦИЯ И ХИГИЕНЕН РЕЖИМ:\n`;
    text += ` - Дезинфекция на инвентар: ${auditLogs.hygiene?.desinfection ? "ИЗВЪРШЕНО" : "НЕ Е ОТБЕЛЯЗАНО"}\n`;
    text += ` - Почистване на работни плотове: ${auditLogs.hygiene?.surfaces ? "ИЗВЪРШЕНО" : "НЕ Е ОТБЕЛЯЗАНО"}\n`;
    text += ` - Измиване на подове: ${auditLogs.hygiene?.floors ? "ИЗВЪРШЕНО" : "НЕ Е ОТБЕЛЯЗАНО"}\n`;
    text += ` - Извозване на отпадъци: ${auditLogs.hygiene?.waste ? "ИЗВЪРШЕНО" : "НЕ Е ОТБЕЛЯЗАНО"}\n`;
    text += `\n`;

    // 4. Персонал
    text += `4. ЛИЧНА ХИГИЕНА И ЗДРАВЕН СТАТУС:\n`;
    text += ` - Входящ филтър на смяна: ${auditLogs.staff?.checkPassed ? "ИЗВЪРШЕН" : "НЕ Е ОТБЕЛЯЗАНО"}\n`;
    text += ` - Здравословен статус на екипа: ${auditLogs.staff?.healthy ? "ИЗРЯДЕН (ВСИЧКИ ЗДРАВИ)" : "ИМА ОТСТРАНЕНИ СЛУЖИТЕЛИ"}\n`;
    text += `\n`;

    // 5. Термична обработка
    if (user.niche === "Заведение за хранене" || user.niche === "Пекарна или производство") {
      text += `5. ДНЕВНИК ЗА ТЕРМИЧНА ОБРАБОТКА (ГОТВЕНЕ):\n`;
      if (!auditLogs.thermal || auditLogs.thermal.length === 0) {
        text += `Няма записани топлинни обработки.\n`;
      } else {
        auditLogs.thermal.forEach((row: any, i: number) => {
          text += ` - Ястие #${i+1}: ${row.product} | Час: ${row.time} | t° в ядрото: ${row.tempCook}°C | Бързо охлаждане: ${row.cooled ? "ДА" : "НЕ СЕ ИЗИСКВА"}\n`;
        });
      }
      text += `\n`;
    }

    // 6. Фритюрник
    if (user.niche === "Заведение за хранене" || user.niche === "Каравана или павилион") {
      text += `6. КОНТРОЛ НА ФРИТЮРНА МАЗНИНА:\n`;
      text += ` - Използвани фритюрници: ${auditLogs.fryer?.fryerUsed ? "ДА" : "НЕ"}\n`;
      if (auditLogs.fryer?.fryerUsed) {
        text += ` - Качество на олиото: ${auditLogs.fryer?.oilQualityOk ? "ГОДНО" : "НЕГОДНО (ЗА БРАК)"}\n`;
        text += ` - Подменено олио: ${auditLogs.fryer?.oilChanged ? "ДА (НАПЪЛНО ПОДМЕНЕНО)" : "НЕ"}\n`;
      }
      text += `\n`;
    }

    text += `----------------------------------------------------\n`;
    text += `Одитът извършен от: д-р Данка Николова\n`;
    text += `Подпис: ............................\n`;

    handlePrintText(`Одит_${user.firmName}_${auditSelectedDate}`, text);
  };

  // Save current date logbooks
  const handleSaveLogs = () => {
    if (!currentUserEmail) return;
    const key = `danka_logs_${currentUserEmail.replace("@", "_").replace(".", "_")}_${selectedDate}`;
    const logsData = {
      incoming: logIncoming,
      fridges: logFridges,
      hygiene: logHygiene,
      staff: logStaff,
      thermal: logThermal,
      fryer: logFryer
    };
    setDoc(doc(db, "logs", key), logsData)
      .then(() => alert(`Ежедневните дневници за дата ${selectedDate} бяха успешно запазени!`))
      .catch((err) => alert("Възникна грешка при запазване: " + err.message));
  };

  // Print function helper
  const handlePrint = () => {
    window.print();
  };

  // Add Row to Delivery control table
  const addDeliveryRow = () => {
    setLogIncoming([...logIncoming, { product: "", supplier: "", batch: "", temp: "", expiry: "", compliant: true }]);
  };

  // Delete Row from Delivery control table
  const deleteDeliveryRow = (index: number) => {
    const updated = [...logIncoming];
    updated.splice(index, 1);
    setLogIncoming(updated);
  };

  // Update Delivery Row field
  const updateDeliveryRow = (index: number, field: string, value: any) => {
    const updated = [...logIncoming];
    updated[index][field] = value;
    setLogIncoming(updated);
  };

  // Add Row to Cooking temp table
  const addThermalRow = () => {
    setLogThermal([...logThermal, { product: "", time: "", tempCook: "", cooled: false }]);
  };

  // Delete Row from Cooking temp table
  const deleteThermalRow = (index: number) => {
    const updated = [...logThermal];
    updated.splice(index, 1);
    setLogThermal(updated);
  };

  // Update Cooking Row field
  const updateThermalRow = (index: number, field: string, value: any) => {
    const updated = [...logThermal];
    updated[index][field] = value;
    setLogThermal(updated);
  };

  // Update fridge temperature
  const updateFridgeTemp = (index: number, field: 'tempAm' | 'tempPm', value: string) => {
    const updated = [...logFridges];
    updated[index][field] = value;
    setLogFridges(updated);
  };

  // Run Self-Audit Evaluation
  const runSelfAudit = () => {
    let score = 0;
    const totalQuestions = 15;
    let answeredCount = 0;

    for (let i = 1; i <= totalQuestions; i++) {
      if (auditAnswers[`q${i}`] === "yes") {
        score += 1;
        answeredCount++;
      } else if (auditAnswers[`q${i}`] === "no" || auditAnswers[`q${i}`] === "partial") {
        answeredCount++;
      }
    }

    if (answeredCount === 0) {
      alert("Моля, отговорете поне на няколко въпроса.");
      return;
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    setAuditScore(percentage);
  };

  // Calculate Food Expiry Time
  const calculateFoodExpiry = () => {
    if (!openedTime) {
      alert("Моля, изберете дата и час на отваряне.");
      return;
    }
    const openDate = new Date(openedTime);
    let hoursToAdd = 48; // default

    if (foodType === "milk") hoursToAdd = 48; // 2 days
    else if (foodType === "meat") hoursToAdd = 72; // 3 days
    else if (foodType === "eggs_pasteurised") hoursToAdd = 120; // 5 days
    else if (foodType === "canned_open") hoursToAdd = 24; // 24 hours
    else if (foodType === "cooked_dish") hoursToAdd = 48; // 48 hours

    const expiryDate = new Date(openDate.getTime() + hoursToAdd * 60 * 60 * 1000);
    
    const formatted = expiryDate.toLocaleString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    setCalculatedExpiry(formatted);
  };

  // Unread Messages Calculation
  const currentUserObj = usersList.find(u => u.email === currentUserEmail);
  const hasUnreadUserMessages = currentUserObj?.messages?.some((m: any) => m.sender === "admin" && !m.isRead) || false;
  const hasUnreadAdminMessages = usersList.some(u => u.messages?.some((m: any) => m.sender === "user" && !m.isRead));
  
  const handleOpenUserChat = () => {
    setActiveTab("chat");
    if (currentUserObj && currentUserObj.messages?.some((m: any) => m.sender === "admin" && !m.isRead)) {
      const updatedMessages = currentUserObj.messages.map((m: any) => 
        m.sender === "admin" ? { ...m, isRead: true } : m
      );
      saveUsers(usersList.map(u => u.email === currentUserObj.email ? { ...u, messages: updatedMessages } : u));
    }
  };

  const handleOpenAdminUserChat = (email: string) => {
    setAdminActiveChatEmail(email);
    const userToUpdate = usersList.find(u => u.email === email);
    if (userToUpdate && userToUpdate.messages?.some((m: any) => m.sender === "user" && !m.isRead)) {
      const updatedMessages = userToUpdate.messages.map((m: any) => 
        m.sender === "user" ? { ...m, isRead: true } : m
      );
      saveUsers(usersList.map(u => u.email === email ? { ...u, messages: updatedMessages } : u));
    }
  };

  return (
    <div className="bg-brand-light min-h-screen pb-20">
      {/* 1. Header Hero Banner - Hidden on print */}
      <section className="bg-brand-green py-10 text-center relative overflow-hidden border-b border-brand-gold/15 print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-2">
          <span className="text-[10px] font-bold uppercase text-brand-gold tracking-widest block">
            СИСТЕМА ЗА ХРАНИТЕЛНА БЕЗОПАСНОСТ
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {userRole === "admin" ? "Административен Панел & Управление" : "Клиентски Портал и Записи"}
          </h1>
          {isLoggedIn && (
            <p className="text-xs text-white/80 max-w-2xl mx-auto font-medium">
              {userRole === "admin" ? (
                <>Администратор: <span className="text-brand-gold font-bold">д-р Данка Николова</span></>
              ) : (
                <>Обект: <span className="text-brand-gold font-bold">{firmInfo.name || "Неконфигуриран"}</span> ({firmInfo.niche})</>
              )}
            </p>
          )}
        </div>
      </section>

      {/* 2. AUTHENTICATION SCREENS (LOGIN / REGISTER / APPLY) - Hidden on print */}
      {!isLoggedIn && (
        <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 print:hidden animate-fade-in">
          {isPendingApproval ? (
            <div className="max-w-xl mx-auto bg-white border border-brand-gold/30 p-8 rounded-2xl shadow-xl space-y-6 text-center animate-fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full bg-brand-gold/10 animate-ping"></div>
                <div className="relative w-16 h-16 rounded-full bg-brand-gold/25 text-brand-gold flex items-center justify-center border border-brand-gold/45">
                  <Clock className="h-8 w-8 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-brand-green">Профилът Ви чака одобрение</h2>
                <p className="text-xs text-brand-gold font-bold uppercase tracking-widest">Статус: В процес на разглеждане</p>
                <p className="text-sm text-brand-dark/75 max-w-md mx-auto leading-relaxed pt-2">
                  Заявлението за обект <span className="font-bold text-brand-green">{pendingFirmName || "Вашия обект"}</span> е регистрирано успешно с имейл <code className="bg-brand-light px-1.5 py-0.5 rounded border font-mono text-xs">{pendingEmail}</code>.
                </p>
                <p className="text-xs text-brand-dark/65 max-w-sm mx-auto leading-normal">
                  За да се гарантира съответствието на НАССР документацията, д-р Данка Николова трябва лично да прегледа описаната дейност на обекта и да активира акаунта Ви. Това обикновено отнема до 24 часа.
                </p>
              </div>

              {/* Visual Process Timeline */}
              <div className="grid grid-cols-3 gap-2 py-4 relative">
                <div className="absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-brand-green/10 -z-10"></div>
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px] font-bold mx-auto border border-brand-green">✓</div>
                  <span className="text-[9px] font-bold uppercase block text-brand-dark/50">1. Кандидатстване</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center text-[10px] font-bold mx-auto border border-brand-gold animate-pulse">2</div>
                  <span className="text-[9px] font-bold uppercase block text-brand-green">2. Преглед</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-brand-light text-brand-dark/45 flex items-center justify-center text-[10px] font-bold mx-auto border border-brand-green/15">3</div>
                  <span className="text-[9px] font-bold uppercase block text-brand-dark/45">3. Одобрение & Вход</span>
                </div>
              </div>


              <div className="pt-2">
                <button
                  onClick={() => { setIsPendingApproval(false); setAuthMode("login"); }}
                  className="text-xs text-brand-dark/50 hover:text-brand-green underline"
                >
                  ← Обратно към Вход
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: What to expect from the system */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-green/5 border border-brand-green/20 rounded-full text-[10px] font-black uppercase text-brand-green tracking-[0.15em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
                  ДИГИТАЛЕН ПОРТАЛ
                </span>
                
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
                  Какво Ви дава дигиталният портал <span className="text-brand-gold font-semibold">„БАБХ Спокойствие“</span>?
                </h2>
                
                <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed">
                  Това е пълна платформа за ресторанти, магазини, фурни, цехове и други обекти в хранителния сектор. Чрез нея премахвате хаотичните папки и сте напълно подготвени за държавни проверки.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5 border-l-2 border-brand-gold pl-4">
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-brand-green">1. Автоматичен НАССР & ДХП</h4>
                    <p className="text-[11px] sm:text-xs text-brand-dark/75 leading-relaxed">
                      Генериране на персонализирани системи за самоконтрол, ДХП процедури, мерки за алергени и ДДД програми според профила на фирмата Ви.
                    </p>
                  </div>

                  <div className="space-y-1.5 border-l-2 border-brand-gold pl-4">
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-brand-green">2. Дигитални Дневници</h4>
                    <p className="text-[11px] sm:text-xs text-brand-dark/75 leading-relaxed">
                      Входящ контрол на храни, хладилни температури, ежедневна хигиена и здраве на персонала. Попълвате бързо онлайн и печат при проверка.
                    </p>
                  </div>

                  <div className="space-y-1.5 border-l-2 border-brand-gold pl-4">
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-brand-green">3. Вградени Обучения</h4>
                    <p className="text-[11px] sm:text-xs text-brand-dark/75 leading-relaxed">
                      Достъп до лицензирани практически наръчници за правила при етикетиране и хигиенни норми, написани лично от д-р Данка Николова.
                    </p>
                  </div>

                  <div className="space-y-1.5 border-l-2 border-brand-gold pl-4">
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-brand-green">4. Интелигентен Тракер</h4>
                    <p className="text-[11px] sm:text-xs text-brand-dark/75 leading-relaxed">
                      Калкулатор за срок на годност на отворени храни и напомняния за изтичащи договори с ДДД фирми, здравни книжки и воден анализ.
                    </p>
                  </div>
                </div>

                <div className="bg-brand-light p-4 rounded-xl border border-brand-gold/20 flex gap-3 items-start">
                  <div className="p-1 bg-brand-green/10 text-brand-green rounded">
                    <Sparkles className="h-4 w-4 text-brand-gold" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-bold text-brand-green uppercase tracking-wide">Пълна защита от глоби и актове</h5>
                    <p className="text-[11px] text-brand-dark/80 leading-relaxed">
                      Всички документи и логика на системата са съобразени с актуалните изисквания на Закона за храните и БАБХ, което Ви гарантира 100% нормативно съответствие.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Forms Box */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-brand-green/10 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
                
                {/* Form Tabs Switcher */}
                <div className="flex bg-brand-light p-1 rounded-xl border border-brand-green/5">
                  <button 
                    onClick={() => setAuthMode("login")}
                    className={`flex-1 text-center py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${authMode === "login" ? "bg-brand-green text-white shadow" : "text-brand-dark hover:bg-brand-green/5"}`}
                  >
                    Вход
                  </button>
                  <button 
                    onClick={() => setAuthMode("register")}
                    className={`flex-1 text-center py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${authMode === "register" ? "bg-brand-green text-white shadow" : "text-brand-dark hover:bg-brand-green/5"}`}
                  >
                    Регистрация & Кандидатстване
                  </button>
                </div>

                {authMode === "login" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-brand-green">Вход в портала</h3>
                      <p className="text-[11px] text-brand-dark/60">Въведете акаунта си за достъп до Вашите БАБХ дневници и папки.</p>
                    </div>
                    {/* Simulated Credentials Tip */}
                    <div className="bg-brand-gold/10 border border-brand-gold/25 p-3 rounded-lg text-[10px] text-brand-dark/95 flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Бърз достъп за тестване:</span>
                        Въведете произволен имейл/парола за демонстрация.
                      </div>
                    </div>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Имейл адрес</label>
                        <input 
                          type="email" 
                          required 
                          value={authEmail} 
                          onChange={(e) => setAuthEmail(e.target.value)} 
                          placeholder="name@business.com" 
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Парола</label>
                        <input 
                          type="password" 
                          required 
                          value={authPassword} 
                          onChange={(e) => setAuthPassword(e.target.value)} 
                          placeholder="••••••••" 
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Влизане в системата
                      </button>
                    </form>
                  </div>
                )}

                {authMode === "register" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-brand-green">Регистрация и Кандидатстване</h3>
                      <p className="text-[11px] text-brand-dark/60">
                        Попълнете акаунта и данните за обекта. Заявлението ще бъде прегледано от д-р Данка Николова за одобрение.
                      </p>
                    </div>
                    
                    <form onSubmit={handleRegisterAndApply} className="space-y-3">
                      {/* Section: Account Info */}
                      <div className="bg-brand-light p-3 rounded-lg border border-brand-green/5 space-y-2.5">
                        <span className="text-[9px] font-extrabold text-brand-green uppercase tracking-wider block">1. Данни за Профила</span>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Имейл адрес *</label>
                          <input 
                            type="email" 
                            required 
                            value={regEmail} 
                            onChange={(e) => setRegEmail(e.target.value)} 
                            placeholder="name@business.com" 
                            className="w-full text-xs px-3 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Парола *</label>
                            <input 
                              type="password" 
                              required 
                              value={regPassword} 
                              onChange={(e) => setRegPassword(e.target.value)} 
                              placeholder="••••••••" 
                              className="w-full text-xs px-3 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Повторете парола *</label>
                            <input 
                              type="password" 
                              required 
                              value={regConfirmPassword} 
                              onChange={(e) => setRegConfirmPassword(e.target.value)} 
                              placeholder="••••••••" 
                              className="w-full text-xs px-3 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section: Business Activity Info */}
                      <div className="bg-brand-light p-3 rounded-lg border border-brand-green/5 space-y-2.5">
                        <span className="text-[9px] font-extrabold text-brand-green uppercase tracking-wider block">2. Данни за Обекта & Кандидатстване</span>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Име на Обект / Фирма *</label>
                          <input 
                            type="text" 
                            required 
                            value={applyFirmName} 
                            onChange={(e) => setApplyFirmName(e.target.value)} 
                            placeholder="напр. Ресторант Витоша" 
                            className="w-full text-xs px-3 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">ЕИК / Булстат</label>
                            <input 
                              type="text" 
                              value={applyEik} 
                              onChange={(e) => setApplyEik(e.target.value)} 
                              placeholder="207654321" 
                              className="w-full text-xs px-3 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white font-mono"
                            />
                          </div>
                                                    <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Основен Сектор</label>
                            <select 
                              value={applySector} 
                              onChange={(e) => {
                                const newSector = e.target.value;
                                setApplySector(newSector);
                                setApplyNiche(BUSINESS_CATEGORIES[newSector][0]);
                              }} 
                              className="w-full text-xs px-2 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white"
                            >
                              {Object.keys(BUSINESS_CATEGORIES).map(sector => (
                                <option key={sector} value={sector}>{sector}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Специфичен Обект / Категория</label>
                            <select 
                              value={applyNiche} 
                              onChange={(e) => setApplyNiche(e.target.value)} 
                              className="w-full text-xs px-2 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white"
                            >
                              {BUSINESS_CATEGORIES[applySector]?.map(niche => (
                                <option key={niche} value={niche}>{niche}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Лице за контакт *</label>
                            <input 
                              type="text" 
                              required 
                              value={applyContact} 
                              onChange={(e) => setApplyContact(e.target.value)} 
                              placeholder="Иван Петров" 
                              className="w-full text-xs px-3 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Телефон *</label>
                            <input 
                              type="tel" 
                              required 
                              value={applyPhone} 
                              onChange={(e) => setApplyPhone(e.target.value)} 
                              placeholder="0888123456" 
                              className="w-full text-xs px-3 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Опишете дейността си *</label>
                          <textarea 
                            required
                            value={applyDesc} 
                            onChange={(e) => setApplyDesc(e.target.value)} 
                            placeholder="Опишете накратко обекта: брой места, специфично меню (месо, риба, млечни), капацитет, оборудване и специфични нужди..." 
                            rows={3.5}
                            className="w-full text-xs px-3 py-2 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-white leading-relaxed resize-none"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer mt-2"
                      >
                        Изпрати Заявление & Регистрирай обект
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    )}

                        {/* 3. LOGGED-IN DASHBOARD */}
      {isLoggedIn && (
        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar Menu - Hidden on print */}
            <aside className="lg:col-span-3 bg-white border border-brand-green/5 rounded-2xl p-5 shadow-md space-y-6 print:hidden">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-brand-dark/45 tracking-widest block">
                  {userRole === "admin" ? "Админ Меню" : "Навигация"}
                </span>
                <nav className="flex flex-col gap-1.5 font-sans">
                  {userRole === "admin" ? (
                    <>
                      <button 
                        onClick={() => setActiveAdminTab("candidates")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeAdminTab === "candidates" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <Clock className="h-4 w-4" />
                        Кандидати
                      </button>
                      <button 
                        onClick={() => setActiveAdminTab("users")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeAdminTab === "users" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <Users className="h-4 w-4" />
                        Потребители
                      </button>
                      <button 
                        onClick={() => setActiveAdminTab("materials")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeAdminTab === "materials" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <FileCheck className="h-4 w-4" />
                        Материали & Тестове
                      </button>
                      <button 
                        onClick={() => setActiveAdminTab("messages")}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeAdminTab === "messages" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Чат с Клиенти
                        {hasUnreadAdminMessages && (
                          <span className="absolute right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm"></span>
                        )}
                      </button>
                      <button 
                        onClick={() => setActiveAdminTab("logs")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeAdminTab === "logs" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <Search className="h-4 w-4" />
                        Одит на Дневници
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setActiveTab("logs")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeTab === "logs" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <Calendar className="h-4 w-4" />
                        БАБХ Дневници
                      </button>
                      <button 
                        onClick={() => setActiveTab("haccp")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeTab === "haccp" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <FileText className="h-4 w-4" />
                        НАССР Документи
                      </button>
                      <button 
                        onClick={() => setActiveTab("assigned")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeTab === "assigned" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <FileCheck className="h-4 w-4" />
                        Документи & Тестове
                      </button>
                      <button 
                        onClick={() => setActiveTab("courses")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeTab === "courses" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <BookOpen className="h-4 w-4" />
                        Моите Обучения
                      </button>
                      <button 
                        onClick={handleOpenUserChat}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeTab === "chat" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Чат с Администратор
                        {hasUnreadUserMessages && (
                          <span className="absolute right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm"></span>
                        )}
                      </button>
                      <button 
                        onClick={() => setActiveTab("tools")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeTab === "tools" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <Activity className="h-4 w-4" />
                        Инструменти
                      </button>
                      <button 
                        onClick={() => setActiveTab("settings")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left border-0 w-full ${activeTab === "settings" ? "bg-brand-green text-white" : "bg-transparent text-brand-dark hover:bg-brand-light"}`}
                      >
                        <Settings className="h-4 w-4" />
                        Фирма и Профил
                      </button>
                    </>
                  )}
                </nav>
              </div>

              <div className="border-t border-brand-green/5 pt-4">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer border-0 bg-transparent text-left font-sans"
                >
                  <LogOut className="h-4 w-4" />
                  Излизане
                </button>
              </div>
            </aside>

            {/* Right Main Content Area */}
            <main className="lg:col-span-9 space-y-8">
              {userRole === "admin" ? (
                // ==================== ADMIN PANELS ====================
                <>
                  {/* ADMIN TAB 1: CANDIDATES */}
                  {activeAdminTab === "candidates" && (() => {
                    const pendingCandidates = usersList.filter(u => u.status === "pending" && u.role === "user");
                    return (
                      <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                            <Clock className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className="font-serif text-xl font-bold text-brand-green">Кандидати за Абонамент</h2>
                            <p className="text-xs text-brand-dark/50">Прегледайте и одобрете заявленията за нови обекти</p>
                          </div>
                        </div>

                        {pendingCandidates.length === 0 ? (
                          <div className="text-center py-10 border border-dashed border-brand-green/10 rounded-xl space-y-2">
                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                            <p className="text-xs text-brand-dark/50 italic font-medium">Няма чакащи кандидати за одобрение в момента.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-6 pt-2 font-sans">
                            {pendingCandidates.map((candidate) => (
                              <div 
                                key={candidate.email} 
                                className="border border-brand-green/10 rounded-2xl p-5 sm:p-6 bg-brand-light/35 space-y-4 hover:border-brand-gold/45 transition-colors"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-brand-green/5 pb-3">
                                  <div>
                                    <span className="text-[9px] font-bold uppercase bg-brand-gold text-brand-dark px-2 py-0.5 rounded-full mb-1 inline-block">
                                      {candidate.niche}
                                    </span>
                                    <h3 className="font-serif text-lg font-bold text-brand-green">{candidate.firmName}</h3>
                                    <p className="text-[10px] text-brand-dark/50 font-mono">ЕИК: {candidate.eik}</p>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      onClick={() => handleApproveCandidate(candidate.email)}
                                      className="px-4 py-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow flex items-center gap-1 border-0"
                                    >
                                      <Check className="h-4 w-4" /> Одобри
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(candidate.email)}
                                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer border border-red-200 flex items-center gap-1"
                                    >
                                      <Trash2 className="h-4 w-4" /> Откажи
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                  <div className="space-y-1">
                                    <span className="text-brand-dark/45 font-bold uppercase text-[9px] block">Лице за контакт</span>
                                    <p className="font-semibold text-brand-dark/95">{candidate.contact}</p>
                                    <p className="text-brand-dark/70 font-mono">{candidate.phone}</p>
                                    <p className="text-brand-dark/70 font-mono">{candidate.email}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-brand-dark/45 font-bold uppercase text-[9px] block">Адрес на обекта</span>
                                    <p className="text-brand-dark/80">{candidate.address || "Не е въведен"}</p>
                                  </div>
                                  <div className="space-y-1 md:col-span-1">
                                    <span className="text-brand-dark/45 font-bold uppercase text-[9px] block">Описание на дейността</span>
                                    <p className="text-brand-dark/80 italic leading-relaxed line-clamp-3">
                                      „{candidate.desc}“
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* ADMIN TAB 2: ACTIVE USERS */}
                  {activeAdminTab === "users" && (() => {
                    const activeUsers = usersList.filter(u => u.role === "user" && (u.status === "approved" || u.status === "expired"));
                    const filteredUsers = activeUsers.filter(u => 
                      u.firmName.toLowerCase().includes(usersSearchQuery.toLowerCase()) || 
                      u.email.toLowerCase().includes(usersSearchQuery.toLowerCase())
                    );
                    return (
                      <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-green/5 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                              <Users className="h-6 w-6" />
                            </div>
                            <div>
                              <h2 className="font-serif text-xl font-bold text-brand-green">Управление на Клиенти</h2>
                              <p className="text-xs text-brand-dark/50">Прегледайте абонаментите и управлявайте достъпа на обектите</p>
                            </div>
                          </div>

                          {/* Search Input */}
                          <div className="relative w-full sm:w-64 font-sans">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/40" />
                            <input 
                              type="text" 
                              value={usersSearchQuery}
                              onChange={(e) => setUsersSearchQuery(e.target.value)}
                              placeholder="Търси фирма или имейл..."
                              className="w-full text-xs pl-10 pr-4 py-2 rounded-lg border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-brand-light/40"
                            />
                          </div>
                        </div>

                        {filteredUsers.length === 0 ? (
                          <p className="text-xs text-brand-dark/50 italic text-center py-8">Няма намерени клиенти по зададения критерий.</p>
                        ) : (
                          <div className="overflow-x-auto font-sans">
                            <table className="w-full text-xs text-left border-collapse border border-brand-green/10">
                              <thead>
                                <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                                  <th className="border border-brand-green/10 p-3">Фирма / Обект</th>
                                  <th className="border border-brand-green/10 p-3">Контакти</th>
                                  <th className="border border-brand-green/10 p-3 text-center">Статус Абонамент</th>
                                  <th className="border border-brand-green/10 p-3 text-center">Промяна Абонамент</th>
                                  <th className="border border-brand-green/10 p-3 text-center">Изтриване</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredUsers.map((u) => (
                                  <tr key={u.email} className="hover:bg-brand-light/30 transition-colors">
                                    <td className="border border-brand-green/10 p-3 space-y-1">
                                      <span className="font-bold text-brand-green block">{u.firmName}</span>
                                      <span className="text-[10px] text-brand-dark/50 block font-medium uppercase tracking-wide">{u.niche}</span>
                                      <span className="text-[10px] text-brand-dark/50 block font-mono">ЕИК: {u.eik}</span>
                                    </td>
                                    <td className="border border-brand-green/10 p-3 space-y-0.5">
                                      <p className="font-semibold">{u.contact}</p>
                                      <p className="text-brand-dark/60 font-mono">{u.phone}</p>
                                      <p className="text-brand-dark/60 font-mono">{u.email}</p>
                                    </td>
                                    <td className="border border-brand-green/10 p-3 text-center">
                                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${u.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {u.status === "approved" ? "Активен" : "Изтекъл"}
                                      </span>
                                    </td>
                                    <td className="border border-brand-green/10 p-3 text-center">
                                      <button 
                                        onClick={() => handleToggleUserStatus(u.email, u.status)}
                                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer border ${u.status === "approved" ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"}`}
                                      >
                                        {u.status === "approved" ? "Спри абонамент" : "Активирай абонамент"}
                                      </button>
                                    </td>
                                    <td className="border border-brand-green/10 p-3 text-center">
                                      <button 
                                        onClick={() => handleDeleteUser(u.email)}
                                        className="text-red-500 hover:text-red-700 transition-colors p-2 cursor-pointer inline-block border-0 bg-transparent"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* ADMIN TAB 3: MATERIALS & TESTS */}
                  {activeAdminTab === "materials" && (() => {
                    const activeUsers = usersList.filter(u => u.role === "user" && (u.status === "approved" || u.status === "expired"));
                    return (
                      <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                            <FileCheck className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className="font-serif text-xl font-bold text-brand-green">Разпращане на Материали и Тестове</h2>
                            <p className="text-xs text-brand-dark/50">Изпращайте образователни документи или интерактивни тестове</p>
                          </div>
                        </div>

                        {/* Material Type Switcher */}
                        <div className="flex bg-brand-light p-1 rounded-xl border border-brand-green/5 w-full max-w-sm font-sans">
                          <button 
                            onClick={() => setMaterialType("document")}
                            className={`flex-1 text-center py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer border-0 ${materialType === "document" ? "bg-brand-green text-white shadow" : "text-brand-dark bg-transparent hover:bg-brand-green/5"}`}
                          >
                            Нов Документ
                          </button>
                          <button 
                            onClick={() => setMaterialType("test")}
                            className={`flex-1 text-center py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer border-0 ${materialType === "test" ? "bg-brand-green text-white shadow" : "text-brand-dark bg-transparent hover:bg-brand-green/5"}`}
                          >
                            Нов Тест (Куиз)
                          </button>
                        </div>

                        {/* Assign form */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
                          {/* Form controls */}
                          <div className="lg:col-span-7 space-y-4">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Получател:</label>
                              <select 
                                value={newMaterialTarget}
                                onChange={(e) => setNewMaterialTarget(e.target.value)}
                                className="w-full text-xs border border-brand-green/20 rounded-lg p-2.5 bg-brand-light focus:outline-none focus:border-brand-gold font-medium text-brand-dark"
                              >
                                <option value="all">Всички одобрени клиенти (глобално)</option>
                                {activeUsers.map((user) => (
                                  <option key={user.email} value={user.email}>
                                    {user.firmName} ({user.email})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Заглавие на материала:</label>
                              <input 
                                type="text"
                                value={newMaterialTitle}
                                onChange={(e) => setNewMaterialTitle(e.target.value)}
                                placeholder={materialType === "document" ? "напр. Задължителни ДДД дневници" : "напр. Тест по Добри Хигиенни Практики"}
                                className="w-full text-xs border border-brand-green/20 rounded-lg p-2.5 bg-brand-light focus:outline-none focus:border-brand-gold font-medium text-brand-dark"
                              />
                            </div>

                            {materialType === "document" ? (
                              <form onSubmit={handleAssignDocument} className="space-y-4">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Съдържание на документа:</label>
                                  <textarea 
                                    value={newMaterialContent}
                                    onChange={(e) => setNewMaterialContent(e.target.value)}
                                    placeholder="Напишете текста на документа или инструкциите..."
                                    rows={10}
                                    className="w-full text-xs border border-brand-green/20 rounded-lg p-3 bg-brand-light focus:outline-none focus:border-brand-gold leading-relaxed font-mono text-brand-dark"
                                  />
                                </div>
                                <button 
                                  type="submit"
                                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer border-0"
                                >
                                  Изпрати документа
                                </button>
                              </form>
                            ) : (
                              // QUIZ / TEST MAKER FORM
                              <div className="space-y-6">
                                {/* Visual list of currently added questions */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-bold text-brand-green uppercase tracking-wider border-b border-brand-green/5 pb-2">Добавени въпроси ({newTestQuestions.length})</h4>
                                  {newTestQuestions.length === 0 ? (
                                    <p className="text-[11px] text-brand-dark/50 italic font-sans">Все още не сте добавили въпроси към този тест.</p>
                                  ) : (
                                    <div className="space-y-2 max-h-56 overflow-y-auto">
                                      {newTestQuestions.map((q, idx) => (
                                        <div key={q.id} className="bg-brand-light p-3 rounded-lg border border-brand-green/10 flex items-start justify-between gap-3 text-xs">
                                          <div className="space-y-1">
                                            <p className="font-bold text-brand-green">{idx + 1}. {q.text}</p>
                                            <ul className="list-disc list-inside pl-2 space-y-0.5 text-[11px] text-brand-dark/75">
                                              {q.options.map((opt, oIdx) => (
                                                <li key={oIdx} className={oIdx === q.correctIdx ? "text-green-600 font-bold" : ""}>
                                                  {opt} {oIdx === q.correctIdx && "✓ (верен)"}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                          <button 
                                            onClick={() => handleDeleteDraftQuestion(idx)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1 border-0 bg-transparent cursor-pointer"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Question builder box */}
                                <form onSubmit={handleAddQuestion} className="bg-brand-light/40 border border-brand-green/10 p-4 rounded-xl space-y-3">
                                  <span className="text-[10px] font-extrabold text-brand-green uppercase tracking-wide block">Конструктор на Въпрос</span>
                                  
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Текст на въпроса *</label>
                                    <input 
                                      type="text"
                                      value={draftQuestionText}
                                      onChange={(e) => setDraftQuestionText(e.target.value)}
                                      placeholder="напр. При колко градуса се съхранява замразено месо?"
                                      className="w-full text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-white font-medium text-brand-dark"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Опция 1 *</label>
                                      <input 
                                        type="text"
                                        value={draftQuestionOpt1}
                                        onChange={(e) => setDraftQuestionOpt1(e.target.value)}
                                        placeholder="Опция А"
                                        className="w-full text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-white text-brand-dark"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Опция 2 *</label>
                                      <input 
                                        type="text"
                                        value={draftQuestionOpt2}
                                        onChange={(e) => setDraftQuestionOpt2(e.target.value)}
                                        placeholder="Опция Б"
                                        className="w-full text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-white text-brand-dark"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">Опция 3 *</label>
                                      <input 
                                        type="text"
                                        value={draftQuestionOpt3}
                                        onChange={(e) => setDraftQuestionOpt3(e.target.value)}
                                        placeholder="Опция В"
                                        className="w-full text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-white text-brand-dark"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between gap-4 pt-1.5">
                                    <div className="flex items-center gap-2">
                                      <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider">Верен отговор:</label>
                                      <select 
                                        value={draftQuestionCorrect}
                                        onChange={(e) => setDraftQuestionCorrect(parseInt(e.target.value))}
                                        className="text-xs border border-brand-green/20 rounded px-2 py-1 bg-white focus:outline-none focus:border-brand-gold font-bold text-brand-green"
                                      >
                                        <option value={0}>Опция 1</option>
                                        <option value={1}>Опция 2</option>
                                        <option value={2}>Опция 3</option>
                                      </select>
                                    </div>

                                    <button 
                                      type="submit"
                                      className="bg-brand-gold hover:bg-amber-500 text-brand-dark font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded transition-colors cursor-pointer shadow-sm border-0"
                                    >
                                      Добави въпроса
                                    </button>
                                  </div>
                                </form>

                                <button 
                                  onClick={handleAssignTest}
                                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer border-0"
                                >
                                  Изпрати теста ({newTestQuestions.length} въпроса)
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Right column: active list of assigned items for preview */}
                          <div className="lg:col-span-5 bg-brand-light/35 p-5 rounded-2xl border border-brand-green/10 space-y-4 font-sans">
                            <h4 className="text-xs font-bold text-brand-green uppercase tracking-wider border-b border-brand-green/5 pb-2">Преглед на текущи възлагания</h4>
                            
                            <div className="space-y-4 max-h-[450px] overflow-y-auto">
                              {activeUsers.map((user) => {
                                if (user.assignedDocs.length === 0) return null;
                                return (
                                  <div key={user.email} className="space-y-2 bg-white p-3.5 rounded-xl border border-brand-green/5 shadow-sm text-xs">
                                    <span className="font-bold text-brand-green block leading-tight">{user.firmName}</span>
                                    <span className="text-[10px] text-brand-dark/50 block font-mono">{user.email}</span>
                                    
                                    <div className="space-y-1.5 pt-2 border-t border-brand-green/5">
                                      {user.assignedDocs.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between text-[11px] gap-2 p-1.5 bg-brand-light/50 rounded">
                                          <span className="truncate max-w-[150px] font-medium" title={doc.title}>{doc.title}</span>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${doc.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                              {doc.status === "completed" ? (doc.type === "document" ? "Прочетен" : `${doc.score}%`) : "Чака"}
                                            </span>
                                            <button 
                                              onClick={() => handleDeleteAssignedMaterial(user.email, doc.id)}
                                              className="text-red-400 hover:text-red-600 transition-colors border-0 bg-transparent cursor-pointer font-bold"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                              {activeUsers.every(user => user.assignedDocs.length === 0) && (
                                <p className="text-[11px] text-brand-dark/50 italic py-4 text-center">Все още няма възложени материали на никой потребител.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ADMIN TAB 4: MESSAGES/CHAT */}
                  {activeAdminTab === "messages" && (() => {
                    const chatUsers = usersList.filter(u => u.role === "user" && u.status === "approved");
                    const activeChatUser = chatUsers.find(u => u.email.toLowerCase() === adminActiveChatEmail.toLowerCase());
                    return (
                      <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                            <MessageSquare className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className="font-serif text-xl font-bold text-brand-green">Чат Център с Клиенти</h2>
                            <p className="text-xs text-brand-dark/50">Отговаряйте на запитвания и провеждайте консултации</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 border border-brand-green/10 rounded-2xl overflow-hidden h-[550px] bg-brand-light/10 font-sans">
                          {/* Users List Sidebar */}
                          <div className="md:col-span-4 border-r border-brand-green/10 flex flex-col h-full bg-white">
                            <div className="p-4 border-b border-brand-green/5 bg-brand-light/20">
                              <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">Активни диалози</span>
                            </div>
                            <div className="flex-1 overflow-y-auto divide-y divide-brand-green/5">
                              {chatUsers.map((user) => {
                                const lastMsg = user.messages[user.messages.length - 1];
                                const isSelected = user.email.toLowerCase() === adminActiveChatEmail.toLowerCase();
                                return (
                                  <button 
                                    key={user.email}
                                    onClick={() => setAdminActiveChatEmail(user.email)}
                                    className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors cursor-pointer hover:bg-brand-light/40 border-0 bg-transparent ${isSelected ? "bg-brand-light/70 border-l-4 border-brand-gold" : ""}`}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-brand-green text-white font-bold flex items-center justify-center text-xs shrink-0">
                                      {user.contact?.slice(0, 2).toUpperCase() || "КЛ"}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <span className="text-xs font-bold text-brand-green block truncate leading-tight">{user.firmName}</span>
                                      <span className="text-[10px] text-brand-dark/50 block truncate">{user.contact}</span>
                                      {lastMsg && (
                                        <p className="text-[10px] text-brand-dark/65 truncate font-medium mt-0.5">
                                          {lastMsg.sender === "admin" ? "Вие: " : ""}{lastMsg.text}
                                        </p>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                              {chatUsers.length === 0 && (
                                <p className="text-xs text-brand-dark/50 italic p-4 text-center font-sans">Няма регистрирани клиенти за чат.</p>
                              )}
                            </div>
                          </div>

                          {/* Chat Messages Panel */}
                          <div className="md:col-span-8 flex flex-col h-full bg-brand-light/5">
                            {activeChatUser ? (
                              <>
                                {/* Header */}
                                <div className="bg-brand-green px-5 py-3 flex items-center justify-between text-white border-b border-brand-gold/15">
                                  <div className="flex items-center gap-3 font-sans">
                                    <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-dark font-bold flex items-center justify-center text-xs shrink-0">
                                      {activeChatUser.contact?.slice(0, 2).toUpperCase() || "КЛ"}
                                    </div>
                                    <div>
                                      <span className="text-xs font-bold block leading-tight">{activeChatUser.firmName}</span>
                                      <span className="text-[9px] text-white/70 block">МОЛ: {activeChatUser.contact} ({activeChatUser.phone})</span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                                    {activeChatUser.niche}
                                  </span>
                                </div>

                                {/* Messages List */}
                                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                                  {activeChatUser.messages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-center p-6 text-xs text-brand-dark/50 italic">
                                      Няма съобщения в този диалог. Изпратете първото съобщение по-долу.
                                    </div>
                                  ) : (
                                    activeChatUser.messages.map((msg) => {
                                      const isAdmin = msg.sender === "admin";
                                      return (
                                        <div 
                                          key={msg.id}
                                          className={`flex gap-3 max-w-[85%] ${isAdmin ? "ml-auto flex-row-reverse" : ""}`}
                                        >
                                          <div className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center border shrink-0 ${isAdmin ? "bg-brand-gold border-brand-gold text-brand-dark" : "bg-brand-green border-brand-green text-white"}`}>
                                            {isAdmin ? "ДН" : (activeChatUser.contact?.slice(0, 2).toUpperCase() || "КЛ")}
                                          </div>
                                          <div className={`space-y-1 p-3 rounded-2xl shadow-sm text-xs leading-relaxed ${isAdmin ? "bg-brand-green text-white rounded-tr-none" : "bg-white text-brand-dark rounded-tl-none border border-brand-green/5"}`}>
                                            <p>{msg.text}</p>
                                            <span className={`text-[8px] block text-right font-mono ${isAdmin ? "text-white/60" : "text-brand-dark/40"}`}>
                                              {new Date(msg.sentAt).toLocaleTimeString("bg-BG", { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                {/* Chat Footer Form */}
                                <form onSubmit={handleSendAdminMessage} className="bg-white p-3 border-t border-brand-green/10 flex gap-2.5 items-center">
                                  <input 
                                    type="text" 
                                    value={adminChatMessageText}
                                    onChange={(e) => setAdminChatMessageText(e.target.value)}
                                    placeholder={`Изпрати съобщение до ${activeChatUser.contact}...`}
                                    className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-brand-light/30 text-brand-dark"
                                  />
                                  <button 
                                    type="submit" 
                                    className="p-2.5 bg-brand-green hover:bg-brand-green/90 text-white rounded-xl transition-all cursor-pointer border-0 shadow-sm"
                                  >
                                    <Send className="h-4 w-4" />
                                  </button>
                                </form>
                              </>
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 p-6">
                                <MessageSquare className="h-12 w-12 text-brand-dark/20" />
                                <h4 className="text-sm font-bold text-brand-green">Няма избран диалог</h4>
                                <p className="text-xs text-brand-dark/50 max-w-sm">
                                  Изберете клиент от списъка вляво, за да започнете диалог.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ADMIN TAB 5: LOGS AUDIT */}
                  {activeAdminTab === "logs" && (() => {
                    const chatUsers = usersList.filter(u => u.role === "user" && u.status === "approved");
                    return (
                      <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fade-in">
                        {/* Selection header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-green/5 pb-4 font-sans">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                              <Search className="h-6 w-6" />
                            </div>
                            <div>
                              <h2 className="font-serif text-xl font-bold text-brand-green">Одит на Клиентски Дневници</h2>
                              <p className="text-xs text-brand-dark/50">Преглеждайте попълнените дневници на одобрените обекти</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] font-bold text-brand-dark/70 uppercase">Обект:</label>
                              <select 
                                value={auditUserEmail}
                                onChange={(e) => setAuditUserEmail(e.target.value)}
                                className="text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-brand-light font-medium text-brand-dark"
                              >
                                <option value="">-- Изберете обект --</option>
                                {chatUsers.map((user) => (
                                  <option key={user.email} value={user.email}>
                                    {user.firmName} ({user.email})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-2">
                              <label className="text-[11px] font-bold text-brand-dark/70 uppercase">Дата:</label>
                              <input 
                                type="date" 
                                value={auditSelectedDate} 
                                onChange={(e) => setAuditSelectedDate(e.target.value)} 
                                className="text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-brand-light font-medium text-brand-dark"
                              />
                            </div>

                            {auditUserEmail && (
                              <button 
                                onClick={handlePrintAuditedLogs}
                                className="bg-brand-gold hover:bg-amber-500 text-brand-dark font-bold text-xs uppercase px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow border-0"
                              >
                                <Printer className="h-3.5 w-3.5" />
                                Одит печат (А4)
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Display audited logs */}
                        {!auditUserEmail ? (
                          <div className="text-center py-12 text-xs text-brand-dark/50 italic border border-dashed border-brand-green/10 rounded-xl">
                            Моля, изберете клиентски обект от падащото меню горе, за да стартирате одит на дневниците.
                          </div>
                        ) : (() => {
                          const targetUserObj = chatUsers.find(u => u.email.toLowerCase() === auditUserEmail.toLowerCase());
                          return (
                            <div className="space-y-6">
                              {/* 1. Входящ Контрол */}
                              <div className="border border-brand-green/10 rounded-xl p-4 space-y-3 bg-brand-light/10">
                                <h3 className="font-serif text-sm font-bold text-brand-green">1. Дневник за входящ контрол на суровини</h3>
                                {(!auditLogs.incoming || auditLogs.incoming.length === 0) ? (
                                  <p className="text-xs text-brand-dark/50 italic font-sans">Няма записани данни.</p>
                                ) : (
                                  <div className="overflow-x-auto font-sans">
                                    <table className="w-full text-xs text-left border-collapse border border-brand-green/10 bg-white">
                                      <thead>
                                        <tr className="bg-brand-green/5 text-[9px] font-bold text-brand-green uppercase">
                                          <th className="border border-brand-green/10 p-2">Продукт / Суровина</th>
                                          <th className="border border-brand-green/10 p-2">Доставчик</th>
                                          <th className="border border-brand-green/10 p-2">Партида</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-16">t° (°C)</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-24">Срок на годност</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-24">Статус</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {auditLogs.incoming.map((row: any, idx: number) => (
                                          <tr key={idx} className="hover:bg-brand-light/20 text-brand-dark">
                                            <td className="border border-brand-green/10 p-2 font-medium">{row.product}</td>
                                            <td className="border border-brand-green/10 p-2">{row.supplier}</td>
                                            <td className="border border-brand-green/10 p-2 font-mono text-[11px]">{row.batch}</td>
                                            <td className="border border-brand-green/10 p-2 text-center font-mono">{row.temp}</td>
                                            <td className="border border-brand-green/10 p-2 text-center font-mono">{row.expiry}</td>
                                            <td className="border border-brand-green/10 p-2 text-center">
                                              <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${row.compliant ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {row.compliant ? "Изрядна" : "Брак"}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {/* 2. Хладилници */}
                              <div className="border border-brand-green/10 rounded-xl p-4 space-y-3 bg-brand-light/10">
                                <h3 className="font-serif text-sm font-bold text-brand-green">2. Дневник за температурния режим на хладилни съоръжения</h3>
                                {(!auditLogs.fridges || auditLogs.fridges.length === 0) ? (
                                  <p className="text-xs text-brand-dark/50 italic font-sans">Няма записани данни.</p>
                                ) : (
                                  <div className="overflow-x-auto font-sans">
                                    <table className="w-full text-xs text-left border-collapse border border-brand-green/10 bg-white">
                                      <thead>
                                        <tr className="bg-brand-green/5 text-[9px] font-bold text-brand-green uppercase">
                                          <th className="border border-brand-green/10 p-2">Хладилно съоръжение</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-28">t° Сутрин (°C)</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-28">t° Вечер (°C)</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-32">Статус</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {auditLogs.fridges.map((row: any, idx: number) => {
                                          const isFreezer = row.name.toLowerCase().includes("фризер");
                                          const amTemp = parseFloat(row.tempAm);
                                          const pmTemp = parseFloat(row.tempPm);
                                          const isAmOk = isFreezer ? (amTemp <= -18) : (amTemp >= 0 && amTemp <= 4);
                                          const isPmOk = isFreezer ? (pmTemp <= -18) : (pmTemp >= 0 && pmTemp <= 4);
                                          const isOk = isAmOk && isPmOk;
                                          return (
                                            <tr key={idx} className="hover:bg-brand-light/20 text-brand-dark">
                                              <td className="border border-brand-green/10 p-2 font-medium">{row.name}</td>
                                              <td className={`border border-brand-green/10 p-2 text-center font-mono ${!isAmOk ? "text-red-600 font-bold" : ""}`}>{row.tempAm}°C</td>
                                              <td className={`border border-brand-green/10 p-2 text-center font-mono ${!isPmOk ? "text-red-600 font-bold" : ""}`}>{row.tempPm}°C</td>
                                              <td className="border border-brand-green/10 p-2 text-center">
                                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${isOk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                  {isOk ? "Норма" : "Нарушение"}
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {/* 3 & 4. Hygiene and Staff */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                                {/* Hygiene check list */}
                                <div className="border border-brand-green/10 rounded-xl p-4 space-y-3 bg-brand-light/10 text-xs">
                                  <h3 className="font-serif text-sm font-bold text-brand-green border-b border-brand-green/5 pb-2">3. Дневник по дезинфекция</h3>
                                  <div className="space-y-2 pt-1">
                                    <div className="flex items-center justify-between p-1.5 bg-white border border-brand-green/5 rounded text-brand-dark">
                                      <span>Дезинфекция на инвентар и прибори:</span>
                                      <span className={`font-bold ${auditLogs.hygiene?.desinfection ? "text-green-600" : "text-brand-dark/40"}`}>
                                        {auditLogs.hygiene?.desinfection ? "✓ Да" : "✗ Не"}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between p-1.5 bg-white border border-brand-green/5 rounded text-brand-dark">
                                      <span>Почистване на работни повърхности:</span>
                                      <span className={`font-bold ${auditLogs.hygiene?.surfaces ? "text-green-600" : "text-brand-dark/40"}`}>
                                        {auditLogs.hygiene?.surfaces ? "✓ Да" : "✗ Не"}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between p-1.5 bg-white border border-brand-green/5 rounded text-brand-dark">
                                      <span>Подобряване и измиване на подове:</span>
                                      <span className={`font-bold ${auditLogs.hygiene?.floors ? "text-green-600" : "text-brand-dark/40"}`}>
                                        {auditLogs.hygiene?.floors ? "✓ Да" : "✗ Не"}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between p-1.5 bg-white border border-brand-green/5 rounded text-brand-dark">
                                      <span>Извозване на хранителни отпадъци:</span>
                                      <span className={`font-bold ${auditLogs.hygiene?.waste ? "text-green-600" : "text-brand-dark/40"}`}>
                                        {auditLogs.hygiene?.waste ? "✓ Да" : "✗ Не"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Staff Check */}
                                <div className="border border-brand-green/10 rounded-xl p-4 space-y-3 bg-brand-light/10 text-xs">
                                  <h3 className="font-serif text-sm font-bold text-brand-green border-b border-brand-green/5 pb-2">4. Лична хигиена и здравен статус</h3>
                                  <div className="space-y-3 pt-1">
                                    <div className="flex items-center justify-between p-1.5 bg-white border border-brand-green/5 rounded text-brand-dark">
                                      <span>Извършен входящ филтър:</span>
                                      <span className={`font-bold ${auditLogs.staff?.checkPassed ? "text-green-600" : "text-brand-dark/40"}`}>
                                        {auditLogs.staff?.checkPassed ? "✓ Извършен" : "✗ Не"}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between p-1.5 bg-white border border-brand-green/5 rounded text-brand-dark">
                                      <span>Здравословно състояние:</span>
                                      <span className={`font-bold ${auditLogs.staff?.healthy ? "text-green-600" : "text-red-600"}`}>
                                        {auditLogs.staff?.healthy ? "Да (Изрядни)" : "Не (Отстранени служители)"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 5. Thermal Cook (optional) */}
                              {auditLogs.thermal && auditLogs.thermal.length > 0 && (
                                <div className="border border-brand-green/10 rounded-xl p-4 space-y-3 bg-brand-light/10">
                                  <h3 className="font-serif text-sm font-bold text-brand-green">5. Дневник за термична обработка (Cooking logs)</h3>
                                  <div className="overflow-x-auto font-sans">
                                    <table className="w-full text-xs text-left border-collapse border border-brand-green/10 bg-white">
                                      <thead>
                                        <tr className="bg-brand-green/5 text-[9px] font-bold text-brand-green uppercase">
                                          <th className="border border-brand-green/10 p-2">Ястие / Продукт</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-20">Час</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-28">t° в ядрото (°C)</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-36">Правилно охлаждане</th>
                                          <th className="border border-brand-green/10 p-2 text-center w-28">Статус</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {auditLogs.thermal.map((row: any, idx: number) => {
                                          const tempVal = parseFloat(row.tempCook);
                                          const isTempOk = tempVal >= 75;
                                          return (
                                            <tr key={idx} className="hover:bg-brand-light/20 text-brand-dark">
                                              <td className="border border-brand-green/10 p-2 font-medium">{row.product}</td>
                                              <td className="border border-brand-green/10 p-2 text-center font-mono">{row.time}</td>
                                              <td className={`border border-brand-green/10 p-2 text-center font-mono ${!isTempOk ? "text-red-600 font-bold" : ""}`}>{row.tempCook}°C</td>
                                              <td className="border border-brand-green/10 p-2 text-center font-medium">{row.cooled ? "Да" : "Не се изисква"}</td>
                                              <td className="border border-brand-green/10 p-2 text-center">
                                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${isTempOk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                  {isTempOk ? "Норма" : "Критично (<75°C)"}
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                              {/* 6. Fryer check (optional) */}
                              {auditLogs.fryer && auditLogs.fryer.fryerUsed && (
                                <div className="border border-brand-green/10 rounded-xl p-4 space-y-3 bg-brand-light/10 text-xs font-sans">
                                  <h3 className="font-serif text-sm font-bold text-brand-green border-b border-brand-green/5 pb-2">6. Дневник за фритюрна мазнина</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-brand-dark">
                                    <div className="p-2.5 bg-white border border-brand-green/5 rounded flex justify-between items-center">
                                      <span>Фритюрник използван:</span>
                                      <span className="font-bold text-brand-green">Да</span>
                                    </div>
                                    <div className="p-2.5 bg-white border border-brand-green/5 rounded flex justify-between items-center">
                                      <span>Качество на мазнината:</span>
                                      <span className={`font-bold ${auditLogs.fryer.oilQualityOk ? "text-green-600" : "text-red-600"}`}>
                                        {auditLogs.fryer.oilQualityOk ? "Годна" : "Негодна (Брак)"}
                                      </span>
                                    </div>
                                    <div className="p-2.5 bg-white border border-brand-green/5 rounded flex justify-between items-center">
                                      <span>Подмяна извършена:</span>
                                      <span className="font-bold text-green-600">
                                        {auditLogs.fryer.oilChanged ? "Да" : "Не"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </>
              ) : (
                <>
                  {(() => {
                    const currentUser = usersList.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
                    return (
                      <>
                        {/* TAB 1: DAILY LOGBOOKS (ДНЕВНИЦИ) */}
              {activeTab === "logs" && (
                <div className="space-y-6">
                  {/* Control panel - Hidden on print */}
                  <div className="bg-white border border-brand-green/5 p-5 rounded-2xl shadow-md flex flex-wrap gap-4 items-center justify-between print:hidden">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-brand-green leading-snug">Ежедневни Дневници по Самоконтрол</h2>
                        <p className="text-[10px] text-brand-dark/50">Попълвайте записи онлайн и ги печатайте за инспекторите</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-brand-dark/70 uppercase">Изберете дата:</label>
                        <input 
                          type="date" 
                          value={selectedDate} 
                          onChange={(e) => setSelectedDate(e.target.value)} 
                          className="text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-brand-light"
                        />
                      </div>
                      <button 
                        onClick={handlePrint}
                        className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Печат на всичко
                      </button>
                    </div>
                  </div>

                  {/* PRINT VIEW HEADER - Visible only on print */}
                  <div className="hidden print:block space-y-4 mb-6 border-b-2 border-brand-dark pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="font-serif text-xl font-bold uppercase">ЕЖЕДНЕВНИ ЗАПИСИ ПО СИСТЕМАТА ЗА САМОКОНТРОЛ</h1>
                        <p className="text-xs">Обект: {firmInfo.name} | ЕИК: {firmInfo.eik}</p>
                        <p className="text-xs">Адрес: {firmInfo.address} | Управител: {firmInfo.manager}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold block border border-brand-dark px-3 py-1 bg-brand-light">
                          ДАТА: {selectedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logbook Forms Container */}
                  <div className="space-y-8">
                    
                    {/* FORM 1: Входящ Контрол на храни */}
                    <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                      <div className="flex items-center justify-between border-b border-brand-green/5 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-brand-gold" />
                          <h3 className="font-serif text-base font-bold text-brand-green">1. Дневник за входящ контрол на суровини</h3>
                        </div>
                        <button 
                          onClick={addDeliveryRow}
                          className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Plus className="h-3.5 w-3.5" /> Добави доставка
                        </button>
                      </div>

                      {logIncoming.length === 0 ? (
                        <p className="text-xs text-brand-dark/50 italic py-2 text-center">Няма въведени доставяни храни за тази дата.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse border border-brand-green/10">
                            <thead>
                              <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                                <th className="border border-brand-green/10 p-2.5">Продукт / Суровина</th>
                                <th className="border border-brand-green/10 p-2.5">Доставчик</th>
                                <th className="border border-brand-green/10 p-2.5">Партида / Номер</th>
                                <th className="border border-brand-green/10 p-2.5 w-20 text-center">t° при трансп. (°C)</th>
                                <th className="border border-brand-green/10 p-2.5 w-28 text-center">Срок на годност</th>
                                <th className="border border-brand-green/10 p-2.5 w-24 text-center">Изрядна опаковка</th>
                                <th className="border border-brand-green/10 p-2.5 w-12 text-center print:hidden">Изтрий</th>
                              </tr>
                            </thead>
                            <tbody>
                              {logIncoming.map((row, idx) => (
                                <tr key={idx} className="hover:bg-brand-light/40 transition-colors">
                                  <td className="border border-brand-green/10 p-1.5">
                                    <input 
                                      type="text" 
                                      value={row.product} 
                                      onChange={(e) => updateDeliveryRow(idx, "product", e.target.value)}
                                      placeholder="напр. Домати" 
                                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5">
                                    <input 
                                      type="text" 
                                      value={row.supplier} 
                                      onChange={(e) => updateDeliveryRow(idx, "supplier", e.target.value)}
                                      placeholder="напр. Метро" 
                                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5">
                                    <input 
                                      type="text" 
                                      value={row.batch} 
                                      onChange={(e) => updateDeliveryRow(idx, "batch", e.target.value)}
                                      placeholder="напр. L3981" 
                                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none font-mono"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5 text-center">
                                    <input 
                                      type="text" 
                                      value={row.temp} 
                                      onChange={(e) => updateDeliveryRow(idx, "temp", e.target.value)}
                                      placeholder="4" 
                                      className="w-full text-center px-1 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5 text-center">
                                    <input 
                                      type="date" 
                                      value={row.expiry} 
                                      onChange={(e) => updateDeliveryRow(idx, "expiry", e.target.value)}
                                      className="px-1 py-0.5 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5 text-center">
                                    <select
                                      value={row.compliant ? "yes" : "no"}
                                      onChange={(e) => updateDeliveryRow(idx, "compliant", e.target.value === "yes")}
                                      className="text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none p-1 font-bold text-brand-green"
                                    >
                                      <option value="yes" className="text-green-600 font-bold">Да (ОК)</option>
                                      <option value="no" className="text-red-600 font-bold">Не (Брак)</option>
                                    </select>
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5 text-center print:hidden">
                                    <button 
                                      onClick={() => deleteDeliveryRow(idx)}
                                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* FORM 2: Температурен Дневник за хладилници */}
                    <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                      <div className="border-b border-brand-green/5 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-brand-gold" />
                          <h3 className="font-serif text-base font-bold text-brand-green">2. Дневник за температурния режим на хладилните съоръжения</h3>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse border border-brand-green/10">
                          <thead>
                            <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                              <th className="border border-brand-green/10 p-2.5">Хладилно съоръжение (Име / №)</th>
                              <th className="border border-brand-green/10 p-2.5 w-36 text-center">Температура Сутрин (°C)</th>
                              <th className="border border-brand-green/10 p-2.5 w-36 text-center">Температура Вечер (°C)</th>
                              <th className="border border-brand-green/10 p-2.5 w-40 text-center">Норматив (Препоръчително)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {logFridges.map((row, idx) => (
                              <tr key={idx} className="hover:bg-brand-light/40 transition-colors">
                                <td className="border border-brand-green/10 p-2.5 font-bold text-brand-green">
                                  {row.name}
                                </td>
                                <td className="border border-brand-green/10 p-1.5 text-center">
                                  <input 
                                    type="text" 
                                    value={row.tempAm} 
                                    onChange={(e) => updateFridgeTemp(idx, "tempAm", e.target.value)}
                                    placeholder="напр. 3" 
                                    className="w-full text-center px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                  />
                                </td>
                                <td className="border border-brand-green/10 p-1.5 text-center">
                                  <input 
                                    type="text" 
                                    value={row.tempPm} 
                                    onChange={(e) => updateFridgeTemp(idx, "tempPm", e.target.value)}
                                    placeholder="напр. 4" 
                                    className="w-full text-center px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                  />
                                </td>
                                <td className="border border-brand-green/10 p-2.5 text-center text-[10px] text-brand-dark/50 italic">
                                  {row.name.toLowerCase().includes("фризер") ? "под -18 °C" : "от 0 до 4 °C"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* TWO-COLUMN GRID FOR HYGIENE AND HEALTH CHECK */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* FORM 3: Почистване и Дезинфекция */}
                      <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                        <div className="border-b border-brand-green/5 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-brand-gold" />
                            <h3 className="font-serif text-base font-bold text-brand-green">3. Дневник по дезинфекция</h3>
                          </div>
                        </div>

                        <p className="text-[10px] text-brand-dark/50 italic leading-snug">Отбележете извършените ежедневни хигиенни процедури в обекта:</p>
                        
                        <div className="space-y-3.5">
                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logHygiene.desinfection} 
                              onChange={(e) => setLogHygiene({...logHygiene, desinfection: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Дезинфекция на инвентар и прибори</span>
                              <span className="text-[10px] text-brand-dark/60 block">Обработка на дъски, ножове, тигани, контейнери</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logHygiene.surfaces} 
                              onChange={(e) => setLogHygiene({...logHygiene, surfaces: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Почистване на работни повърхности</span>
                              <span className="text-[10px] text-brand-dark/60 block">Дезинфекциране на плотове и метални повърхности</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logHygiene.floors} 
                              onChange={(e) => setLogHygiene({...logHygiene, floors: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Подобряване и измиване на подове</span>
                              <span className="text-[10px] text-brand-dark/60 block">Ежедневно забърсване и измиване със саниращи разтвори</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logHygiene.waste} 
                              onChange={(e) => setLogHygiene({...logHygiene, waste: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Извозване на хранителни отпадъци</span>
                              <span className="text-[10px] text-brand-dark/60 block">Изхвърляне на кофите, почистване на контейнери и дезинфекция</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* FORM 4: Здравен Статус / Лична Хигиена */}
                      <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                        <div className="border-b border-brand-green/5 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-brand-gold" />
                            <h3 className="font-serif text-base font-bold text-brand-green">4. Лична хигиена и здравен статус</h3>
                          </div>
                        </div>

                        <p className="text-[10px] text-brand-dark/50 italic leading-snug">Декларация на управителя за здравословно състояние на екипа:</p>

                        <div className="space-y-4 bg-brand-light/40 p-4 rounded-xl border border-brand-green/5">
                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logStaff.checkPassed} 
                              onChange={(e) => setLogStaff({...logStaff, checkPassed: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block text-brand-green">Извършен входящ филтър на персонала</span>
                              <span className="text-[10px] text-brand-dark/60 block">Служителите са проверени преди започване на смяна</span>
                            </div>
                          </label>

                          <div className="flex items-center justify-between border-t border-brand-green/5 pt-3">
                            <span className="text-xs font-bold">Персоналът е здрав и изряден:</span>
                            <select
                              value={logStaff.healthy ? "healthy" : "sick"}
                              onChange={(e) => setLogStaff({...logStaff, healthy: e.target.value === "healthy"})}
                              className="text-xs font-bold border border-brand-green/10 rounded px-2.5 py-1 bg-white focus:outline-none focus:border-brand-gold text-brand-green"
                            >
                              <option value="healthy" className="text-green-600 font-bold">Да (Всички ОК)</option>
                              <option value="sick" className="text-red-600 font-bold">Не (Има временно отстранени)</option>
                            </select>
                          </div>
                        </div>

                        <div className="text-[10px] text-brand-dark/50 leading-relaxed border-l-2 border-brand-gold/30 pl-3">
                          <span className="font-bold block text-brand-dark/70">БАБХ Стандарт:</span>
                          Лица с гнойни рани, кожни обриви или грипоподобни симптоми се отстраняват незабавно от кухнята.
                        </div>
                      </div>
                    </div>

                    {/* NICHE-SPECIFIC FORM: 5. Термична Обработка (cooking temp log) - Rendered if Niche is Заведение or Пекарна/Производство */}
                    {(getSectorForNiche(firmInfo.niche) === "Заведения за обществено хранене (ЗОХ)" || getSectorForNiche(firmInfo.niche).includes("Производство") || getSectorForNiche(firmInfo.niche).includes("Консервирани") || getSectorForNiche(firmInfo.niche).includes("Сладкарски")) && (
                      <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                        <div className="flex items-center justify-between border-b border-brand-green/5 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-brand-gold" />
                            <h3 className="font-serif text-base font-bold text-brand-green">5. Дневник за температурна (термична) обработка</h3>
                          </div>
                          <button 
                            onClick={addThermalRow}
                            className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer print:hidden"
                          >
                            <Plus className="h-3.5 w-3.5" /> Добави запис
                          </button>
                        </div>

                        <p className="text-[10px] text-brand-dark/50 italic leading-snug">Задължително вписване на t° при печене/варене/пържене (минимална t° в ядрото 75°C):</p>

                        {logThermal.length === 0 ? (
                          <p className="text-xs text-brand-dark/50 italic py-2 text-center">Няма въведени топлинни обработки за тази дата.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse border border-brand-green/10">
                              <thead>
                                <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                                  <th className="border border-brand-green/10 p-2.5">Приготвено ястие / Продукт</th>
                                  <th className="border border-brand-green/10 p-2.5 w-24 text-center">Час</th>
                                  <th className="border border-brand-green/10 p-2.5 w-36 text-center">t° в центъра (°C)</th>
                                  <th className="border border-brand-green/10 p-2.5 w-40 text-center">Правилно охлаждане</th>
                                  <th className="border border-brand-green/10 p-2.5 w-12 text-center print:hidden">Изтрий</th>
                                </tr>
                              </thead>
                              <tbody>
                                {logThermal.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-brand-light/40 transition-colors">
                                    <td className="border border-brand-green/10 p-1.5">
                                      <input 
                                        type="text" 
                                        value={row.product} 
                                        onChange={(e) => updateThermalRow(idx, "product", e.target.value)}
                                        placeholder="напр. Пиле с картофи" 
                                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                      />
                                    </td>
                                    <td className="border border-brand-green/10 p-1.5 text-center">
                                      <input 
                                        type="text" 
                                        value={row.time} 
                                        onChange={(e) => updateThermalRow(idx, "time", e.target.value)}
                                        placeholder="12:00" 
                                        className="w-full text-center px-1 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                      />
                                    </td>
                                    <td className="border border-brand-green/10 p-1.5 text-center">
                                      <input 
                                        type="text" 
                                        value={row.tempCook} 
                                        onChange={(e) => updateThermalRow(idx, "tempCook", e.target.value)}
                                        placeholder="78" 
                                        className="w-full text-center px-1 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                      />
                                    </td>
                                    <td className="border border-brand-green/10 p-1.5 text-center">
                                      <select
                                        value={row.cooled ? "yes" : "no"}
                                        onChange={(e) => updateThermalRow(idx, "cooled", e.target.value === "yes")}
                                        className="text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none p-1 font-bold text-brand-green"
                                      >
                                        <option value="yes" className="text-green-600 font-bold">Да (Бързо охлаждане)</option>
                                        <option value="no" className="text-brand-gold font-bold">Не се изисква</option>
                                      </select>
                                    </td>
                                    <td className="border border-brand-green/10 p-1.5 text-center print:hidden">
                                      <button 
                                        onClick={() => deleteThermalRow(idx)}
                                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* NICHE-SPECIFIC FORM: 6. Контрол на фритюрна мазнина - Rendered if Niche is Заведение or Каравана */}
                    {(getSectorForNiche(firmInfo.niche) === "Заведения за обществено хранене (ЗОХ)" || getSectorForNiche(firmInfo.niche) === "МТХ – Мобилни търговски обекти") && (
                      <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                        <div className="border-b border-brand-green/5 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-brand-gold" />
                            <h3 className="font-serif text-base font-bold text-brand-green">6. Дневник за фритюрна мазнина</h3>
                          </div>
                        </div>

                        <div className="bg-brand-light/40 p-4 rounded-xl border border-brand-green/5 space-y-4">
                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logFryer.fryerUsed} 
                              onChange={(e) => setLogFryer({...logFryer, fryerUsed: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Фритюрниците са използвани на тази дата</span>
                              <span className="text-[10px] text-brand-dark/60 block">Следи се качеството на олиото след употреба</span>
                            </div>
                          </label>

                          {logFryer.fryerUsed && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-green/5 pt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold">Качество на мазнината:</span>
                                <select
                                  value={logFryer.oilQualityOk ? "ok" : "bad"}
                                  onChange={(e) => setLogFryer({...logFryer, oilQualityOk: e.target.value === "ok"})}
                                  className="text-xs border border-brand-green/10 rounded px-2.5 py-1 bg-white focus:outline-none focus:border-brand-gold font-bold text-brand-green"
                                >
                                  <option value="ok" className="text-green-600 font-bold">Годна (Добра)</option>
                                  <option value="bad" className="text-red-600 font-bold">Негодна (Потъмняла)</option>
                                </select>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold">Извършена ли е подмяна:</span>
                                <select
                                  value={logFryer.oilChanged ? "yes" : "no"}
                                  onChange={(e) => setLogFryer({...logFryer, oilChanged: e.target.value === "yes"})}
                                  className="text-xs border border-brand-green/10 rounded px-2.5 py-1 bg-white focus:outline-none focus:border-brand-gold font-bold text-brand-green"
                                >
                                  <option value="no" className="text-brand-dark/60">Не</option>
                                  <option value="yes" className="text-green-600 font-bold">Да (Напълно подменена)</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Save Button - Hidden on print */}
                  <div className="flex justify-end gap-3 print:hidden">
                    <button 
                      onClick={handleSaveLogs}
                      className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-brand-green/10"
                    >
                      Запази Дневници за тази дата
                    </button>
                  </div>

                  {/* SIGNATURE FIELDS - Visible only on print */}
                  <div className="hidden print:grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-dashed border-brand-dark/40 text-xs">
                    <div>
                      <p className="font-bold">ПОДПИС НА ИЗВЪРШИЛ КОНТРОЛА:</p>
                      <p className="mt-8 border-b border-brand-dark w-48"></p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">ПОДПИС НА УПРАВИТЕЛ / ОТГОВОРНИК:</p>
                      <p className="mt-8 border-b border-brand-dark w-48 ml-auto"></p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AUTO-GENERATED HACCP & DHP DOCUMENTS */}
              {activeTab === "haccp" && (
                <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                    <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-brand-green">Автоматичен Генератор на БАБХ Документи</h2>
                      <p className="text-xs text-brand-dark/50">Генерирайте Вашата регламентирана папка с попълнени корпоративни данни</p>
                    </div>
                  </div>

                  <div className="bg-brand-gold/10 border border-brand-gold/25 p-4 rounded-xl text-xs leading-relaxed space-y-2">
                    <span className="font-bold block text-brand-green uppercase tracking-wider">Как работи?</span>
                    <p>
                      Системата взема данните за Вашата фирма (Име, ЕИК, Адрес и Управител), които сте въвели в настройките, и ги вгражда динамично в готови официални декларации и процедури. Изберете документ от списъка по-долу, прегледайте го и го отпечатайте на А4.
                    </p>
                  </div>

                  {/* List of Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="border border-brand-green/5 rounded-xl p-4 hover:border-brand-gold/45 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">Задължително по Закон</span>
                        <h4 className="font-serif text-sm font-bold text-brand-green">Система за самоконтрол (ДХП)</h4>
                        <p className="text-[10px] text-brand-dark/60 leading-normal">
                          Процедури за лична хигиена, входящ контрол на суровините, почистване, дезинфекция и управление на отпадъци.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveDocKey("dhp")}
                        className="mt-4 bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-bold text-[10px] uppercase py-2 rounded transition-colors w-full cursor-pointer text-center"
                      >
                        Прегледай и генерирай
                      </button>
                    </div>

                    <div className="border border-brand-green/5 rounded-xl p-4 hover:border-brand-gold/45 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">Задължително по Закон</span>
                        <h4 className="font-serif text-sm font-bold text-brand-green">Програма за мониторинг на вредители (ДДД)</h4>
                        <p className="text-[10px] text-brand-dark/60 leading-normal">
                          Инструкции за борба с гризачи и насекоми, сключени договори и мониторингови карти за безопасност.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveDocKey("pest")}
                        className="mt-4 bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-bold text-[10px] uppercase py-2 rounded transition-colors w-full cursor-pointer text-center"
                      >
                        Прегледай и генерирай
                      </button>
                    </div>

                    <div className="border border-brand-green/5 rounded-xl p-4 hover:border-brand-gold/45 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">ЕС 1169/2011</span>
                        <h4 className="font-serif text-sm font-bold text-brand-green">Процедура за управление на алергени</h4>
                        <p className="text-[10px] text-brand-dark/60 leading-normal">
                          Методология за маркиране на алергени в съставките, предпазване от кръстосано замърсяване и легенда за меню.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveDocKey("allergens")}
                        className="mt-4 bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-bold text-[10px] uppercase py-2 rounded transition-colors w-full cursor-pointer text-center"
                      >
                        Прегледай и генерирай
                      </button>
                    </div>

                    <div className="border border-brand-green/5 rounded-xl p-4 hover:border-brand-gold/45 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full">ККТ Контрол</span>
                        <h4 className="font-serif text-sm font-bold text-brand-green">Система НАССР (План и граници)</h4>
                        <p className="text-[10px] text-brand-dark/60 leading-normal">
                          Анализ на опасностите при печене, охлаждане, съхранение и определяне на Критични Контролни Точки.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveDocKey("haccp")}
                        className="mt-4 bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-bold text-[10px] uppercase py-2 rounded transition-colors w-full cursor-pointer text-center"
                      >
                        Прегледай и генерирай
                      </button>
                    </div>
                  </div>

                  {/* DOCUMENT PREVIEW MODAL SCREEN */}
                  {activeDocKey && (
                    <div className="border-2 border-brand-gold/30 rounded-xl p-6 bg-brand-light/30 relative space-y-4">
                      <div className="flex items-center justify-between border-b border-brand-green/5 pb-2">
                        <h4 className="font-serif text-sm font-bold text-brand-green">Генериран Документ: {(DOCUMENT_TEMPLATES as any)[activeDocKey].title}</h4>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handlePrintText((DOCUMENT_TEMPLATES as any)[activeDocKey].title, (DOCUMENT_TEMPLATES as any)[activeDocKey].content(firmInfo))}
                            className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-[10px] uppercase px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="h-3 w-3" /> Принтирай А4
                          </button>
                          <button 
                            onClick={() => setActiveDocKey(null)}
                            className="text-xs text-brand-dark/50 hover:text-brand-dark font-bold hover:underline"
                          >
                            Затвори
                          </button>
                        </div>
                      </div>

                      {/* Clean pre-formatted paper preview */}
                      <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed p-4 border border-brand-green/10 bg-white rounded shadow-sm text-brand-dark max-h-96 overflow-y-auto">
                        {(DOCUMENT_TEMPLATES as any)[activeDocKey].content(firmInfo)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              
              {/* CLIENT TAB 3: ASSIGNED (ДОКУМЕНТИ & ТЕСТОВЕ) */}
              {activeTab === "assigned" && (() => {
                const assignedDocs = currentUser?.assignedDocs || [];
                return (
                  <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fade-in font-sans">
                    <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                      <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="font-serif text-xl font-bold text-brand-green">Възложени Документи & Тестове</h2>
                        <p className="text-xs text-brand-dark/50">Преглеждайте и изпълнявайте материалите, изпратени от д-р Николова</p>
                      </div>
                    </div>

                    {assignedDocs.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-brand-green/10 rounded-xl space-y-2">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                        <p className="text-xs text-brand-dark/50 italic font-medium">Нямате нови възложени материали или тестове.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {assignedDocs.map((material) => (
                          <div 
                            key={material.id} 
                            className={`border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                              material.status === "completed" 
                                ? "bg-green-50/20 border-green-200" 
                                : "bg-brand-light/30 border-brand-green/10 hover:border-brand-gold/45"
                            }`}
                          >
                            <div className="space-y-1">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                material.type === "test" 
                                  ? "bg-amber-100 text-amber-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {material.type === "test" ? "Тест" : "Документ"}
                              </span>
                              <h3 className="font-serif text-base font-bold text-brand-green">{material.title}</h3>
                              <p className="text-[10px] text-brand-dark/50 font-mono">
                                Изпратен на: {new Date(material.assignedAt).toLocaleDateString("bg-BG")}
                              </p>
                              {material.status === "completed" && material.type === "test" && (
                                <p className="text-xs font-bold text-green-700">
                                  Резултат: {material.score}% ({material.userAnswers?.filter((ans, idx) => ans === material.questions?.[idx].correctIdx).length || 0}/{material.questions?.length} верни)
                                </p>
                              )}
                            </div>

                            <div className="shrink-0">
                              {material.status === "completed" ? (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold bg-green-100/50 px-3 py-1.5 rounded-lg">
                                  <CheckCircle className="h-4 w-4" /> Изпълнен
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveAssignedMaterial(material);
                                    if (material.type === "test") {
                                      setUserTestAnswers(new Array(material.questions?.length || 0).fill(-1));
                                    }
                                  }}
                                  className="px-4 py-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow border-0"
                                >
                                  {material.type === "test" ? "Реши Теста" : "Прочети"}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
{/* TAB 3: MY PURCHASED COURSES */}
              {activeTab === "courses" && (
                <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                    <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-brand-green">Моите Закупени Материали и Наръчници</h2>
                      <p className="text-xs text-brand-dark/50">Всички Ваши образователни ресурси за самоподготовка на едно място</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="border border-brand-green/5 rounded-xl p-5 flex flex-col justify-between hover:border-brand-gold/30 transition-all duration-300">
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold uppercase bg-brand-gold text-brand-dark px-2 py-0.5 rounded-full">Пълен Достъп</span>
                        <h4 className="font-serif text-base font-bold text-brand-green">15 златни правила за етикетиране на храните</h4>
                        <p className="text-xs text-brand-dark/60 leading-normal">
                          Практически указания, съобразени с българското законодателство и Регламент 1169 за етикети, алергени и шрифтове.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveCourseKey("labeling")}
                        className="mt-6 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase py-3 rounded-lg transition-colors w-full cursor-pointer text-center shadow-md"
                      >
                        Прочети наръчника
                      </button>
                    </div>

                    <div className="border border-brand-green/5 rounded-xl p-5 flex flex-col justify-between hover:border-brand-gold/30 transition-all duration-300">
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold uppercase bg-brand-gold text-brand-dark px-2 py-0.5 rounded-full">Пълен Достъп</span>
                        <h4 className="font-serif text-base font-bold text-brand-green">Практическо ръководство за обекти с месо</h4>
                        <p className="text-xs text-brand-dark/60 leading-normal">
                          Пълно ръководство за изискванията на БАБХ при обекти за месни продукти, съхранение, рязане и етикетиране.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveCourseKey("meat")}
                        className="mt-6 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase py-3 rounded-lg transition-colors w-full cursor-pointer text-center shadow-md"
                      >
                        Прочети наръчника
                      </button>
                    </div>
                  </div>

                  {/* COURSE READING VIEWER */}
                  {activeCourseKey && (
                    <div className="border border-brand-gold/30 rounded-xl p-6 bg-brand-light/30 relative space-y-4 pt-5 mt-6">
                      <div className="flex items-center justify-between border-b border-brand-green/5 pb-2">
                        <h4 className="font-serif text-sm font-bold text-brand-green">Наръчник: {(COURSE_CONTENTS as any)[activeCourseKey].title}</h4>
                        <button 
                          onClick={() => setActiveCourseKey(null)}
                          className="text-xs text-brand-dark/50 hover:text-brand-dark font-bold hover:underline"
                        >
                          Затвори четенето
                        </button>
                      </div>
                      <pre className="font-sans text-xs sm:text-sm whitespace-pre-wrap leading-relaxed p-6 border border-brand-green/10 bg-white rounded shadow-sm text-brand-dark max-h-[500px] overflow-y-auto">
                        {(COURSE_CONTENTS as any)[activeCourseKey].content}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              
              {/* CLIENT TAB 5: CHAT (ЧАТ С АДМИНИСТРАТОР) */}
              {activeTab === "chat" && (() => {
                const messages = currentUser?.messages || [];
                return (
                  <div className="bg-white border border-brand-green/5 rounded-2xl shadow-md overflow-hidden animate-fade-in flex flex-col h-[600px] font-sans">
                    {/* Header */}
                    <div className="bg-brand-green px-5 py-4 flex items-center justify-between text-white border-b border-brand-gold/15">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-gold text-brand-dark font-bold flex items-center justify-center text-xs shrink-0">
                          ДН
                        </div>
                        <div>
                          <h3 className="font-serif text-sm sm:text-base font-bold leading-tight">д-р Данка Николова</h3>
                          <p className="text-[10px] text-white/70 block">Главен консултант по безопасност на храните</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full">
                        Администратор
                      </span>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 p-5 overflow-y-auto bg-brand-light/5 space-y-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-xs text-brand-dark/50 italic">
                          <MessageSquare className="h-8 w-8 text-brand-dark/20" />
                          <p>Нямате предишни съобщения с администратора.</p>
                          <p className="max-w-xs font-normal">Задайте своите въпроси относно Вашите НАССР системи, дневници или предстоящи БАБХ проверки.</p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isMe = msg.sender === "user";
                          return (
                            <div 
                              key={msg.id}
                              className={`flex gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
                            >
                              <div className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center border shrink-0 ${isMe ? "bg-brand-green border-brand-green text-white" : "bg-brand-gold border-brand-gold text-brand-dark"}`}>
                                {isMe ? (currentUser?.contact?.slice(0, 2).toUpperCase() || "КЛ") : "ДН"}
                              </div>
                              <div className={`space-y-1 p-3 rounded-2xl shadow-sm text-xs leading-relaxed ${isMe ? "bg-brand-green text-white rounded-tr-none" : "bg-white text-brand-dark rounded-tl-none border border-brand-green/5"}`}>
                                <p>{msg.text}</p>
                                <span className={`text-[8px] block text-right font-mono ${isMe ? "text-white/60" : "text-brand-dark/40"}`}>
                                  {new Date(msg.sentAt).toLocaleTimeString("bg-BG", { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer Form */}
                    <form onSubmit={handleSendUserMessage} className="bg-white p-3 border-t border-brand-green/10 flex gap-2.5 items-center">
                      <input 
                        type="text" 
                        value={userChatMessageText}
                        onChange={(e) => setUserChatMessageText(e.target.value)}
                        placeholder="Въведете съобщение към д-р Николова..."
                        className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-brand-light/30 text-brand-dark"
                      />
                      <button 
                        type="submit" 
                        className="p-2.5 bg-brand-green hover:bg-brand-green/90 text-white rounded-xl transition-all cursor-pointer border-0 shadow-sm"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                );
              })()}
{/* TAB 4: USEFUL SYSTEM TOOLS (ИНСТРУМЕНТИ) */}
              {activeTab === "tools" && (
                <div className="space-y-8">
                  
                  {/* TOOL 1: SELF-AUDIT CALCULATOR */}
                  <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                      <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                        <ShieldAlert className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-brand-green">Калкулатор за БАБХ самоодит</h2>
                        <p className="text-[10px] text-brand-dark/50">Проверете готовността на Вашия обект преди инспекторите</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* List of self-audit questions */}
                      {[
                        { id: "q1", text: "Разполагате ли с попълнена папка Система за самоконтрол (ДХП / НАССР) в обекта?" },
                        { id: "q2", text: "Всички хладилни съоръжения имат ли работещи термометри?" },
                        { id: "q3", text: "Водят ли се ежедневни дневници за температурата на хладилниците?" },
                        { id: "q4", text: "Всички служители притежават ли заверени лични здравни книжки?" },
                        { id: "q5", text: "Имате ли изложена легенда за 14-те основни алергена в обекта?" },
                        { id: "q6", text: "Всички пакетирани суровини в склада имат ли четливи етикети на български език?" },
                        { id: "q7", text: "Продуктите с изтекъл срок на годност бракуват ли се веднага в отделно маркирано място?" },
                        { id: "q8", text: "Стените, подовете и таваните в кухнята без дупки, мухъл и пукнатини ли са?" },
                        { id: "q9", text: "Имате ли сключен валиден договор с ДДД фирма за борба с вредители?" },
                        { id: "q10", text: "Имате ли отделни мивки за измиване на яйца, зеленчуци и ръце на персонала?" },
                      ].map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 hover:bg-brand-light/30 rounded-lg border border-transparent hover:border-brand-green/5 transition-all text-xs">
                          <span className="font-medium text-brand-dark/90">{item.text}</span>
                          <div className="flex gap-2.5 shrink-0">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name={item.id} 
                                value="yes" 
                                checked={auditAnswers[item.id] === "yes"}
                                onChange={(e) => setAuditAnswers({...auditAnswers, [item.id]: e.target.value})}
                                className="text-brand-green focus:ring-brand-gold"
                              />
                              <span>Да</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name={item.id} 
                                value="no" 
                                checked={auditAnswers[item.id] === "no"}
                                onChange={(e) => setAuditAnswers({...auditAnswers, [item.id]: e.target.value})}
                                className="text-brand-green focus:ring-brand-gold"
                              />
                              <span className="text-red-500 font-medium">Не</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name={item.id} 
                                value="partial" 
                                checked={auditAnswers[item.id] === "partial"}
                                onChange={(e) => setAuditAnswers({...auditAnswers, [item.id]: e.target.value})}
                                className="text-brand-green focus:ring-brand-gold"
                              />
                              <span className="text-brand-gold">Частично</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-green/5 pt-5">
                      <button 
                        onClick={runSelfAudit}
                        className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Изчисли резултат
                      </button>

                      {auditScore !== null && (
                        <div className="flex items-center gap-3 bg-brand-light p-3 rounded-lg border border-brand-green/5">
                          <span className="text-xs font-bold text-brand-dark/70">Резултат:</span>
                          <span className={`text-xl font-extrabold ${auditScore >= 80 ? "text-green-600" : auditScore >= 50 ? "text-brand-gold" : "text-red-600"}`}>
                            {auditScore}%
                          </span>
                          <span className="text-[10px] text-brand-dark/60 font-medium">
                            {auditScore >= 80 
                              ? "Отлична готовност! Обектът е защитен." 
                              : auditScore >= 50 
                              ? "Имате пропуски! Отстранете ги за избягване на глоби." 
                              : "Критичен риск! Свържете се спешно с нас!"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TOOL 2: CONTRACT & EXPIRATION CALENDAR */}
                  <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                      <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-brand-green">Календар за изтичащи срокове</h2>
                        <p className="text-[10px] text-brand-dark/50">Проследявайте задължителните дати за външни контроли</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-brand-light/50 border border-brand-green/5 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">Ежемесечен одит</span>
                        <span className="text-xs font-bold block">ДДД Обработка (Вредители)</span>
                        <div className="flex justify-between items-center text-[10px] text-brand-dark/60 pt-2 border-t border-brand-green/5">
                          <span>Краен срок:</span>
                          <span className="font-bold text-brand-green">{dueDates.dddContract}</span>
                        </div>
                      </div>

                      <div className="bg-brand-light/50 border border-brand-green/5 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">Годишен одит</span>
                        <span className="text-xs font-bold block">Анализ на питейна вода</span>
                        <div className="flex justify-between items-center text-[10px] text-brand-dark/60 pt-2 border-t border-brand-green/5">
                          <span>Краен срок:</span>
                          <span className="font-bold text-brand-green">{dueDates.waterAnalysis}</span>
                        </div>
                      </div>

                      <div className="bg-brand-light/50 border border-brand-green/5 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">Постоянен статус</span>
                        <span className="text-xs font-bold block">Здравни книжки (персонал)</span>
                        <div className="flex justify-between items-center text-[10px] text-brand-dark/60 pt-2 border-t border-brand-green/5">
                          <span>Следващ одит:</span>
                          <span className="font-bold text-brand-green">{dueDates.healthCards}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TOOL 3: STORAGE SHELF-LIFE CALCULATOR */}
                  <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                      <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-brand-green">Калкулатор за срок на годност</h2>
                        <p className="text-[10px] text-brand-dark/50">Изчислете кога изтичат отворените суровини според изискванията</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Вид суровина / съставка:</label>
                          <select 
                            value={foodType} 
                            onChange={(e) => setFoodType(e.target.value)} 
                            className="w-full text-xs border border-brand-green/20 rounded-lg p-2 bg-brand-light focus:outline-none focus:border-brand-gold"
                          >
                            <option value="milk">Прясно мляко (отворено, хладилник) - 48 часа</option>
                            <option value="meat">Сурово мляно месо (охладено) - 72 часа</option>
                            <option value="eggs_pasteurised">Пастьоризиран яйчен меланж - 120 часа</option>
                            <option value="canned_open">Отворени консерви (метални опаковки) - 24 часа</option>
                            <option value="cooked_dish">Сготвени ястия (готови за консумация) - 48 часа</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Дата и час на отваряне / приготвяне:</label>
                          <input 
                            type="datetime-local" 
                            value={openedTime}
                            onChange={(e) => setOpenedTime(e.target.value)}
                            className="w-full text-xs border border-brand-green/20 rounded-lg p-2 bg-brand-light focus:outline-none focus:border-brand-gold"
                          />
                        </div>

                        <button 
                          onClick={calculateFoodExpiry}
                          className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer w-full"
                        >
                          Изчисли срок на брак
                        </button>
                      </div>

                      {calculatedExpiry && (
                        <div className="bg-brand-light p-5 rounded-xl border border-brand-green/5 text-center space-y-3">
                          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">ЕТИКЕТ ЗА ПРОСЛЕДИМОСТ</span>
                          
                          <div className="border border-dashed border-brand-dark/20 p-4 bg-white rounded space-y-1 inline-block text-left w-full">
                            <span className="text-[10px] block font-bold text-brand-green uppercase">ОБЕКТ: {firmInfo.name || "Вкусни Мигове"}</span>
                            <span className="text-xs font-bold block">Продукт: {
                              foodType === "milk" ? "Прясно мляко" :
                              foodType === "meat" ? "Мляно месо" :
                              foodType === "eggs_pasteurised" ? "Яйчен меланж" :
                              foodType === "canned_open" ? "Отворена консерва" : "Сготвено ястие"
                            }</span>
                            <span className="text-[10px] text-brand-dark/60 block">Отворен на: {openedTime.replace("T", " ")}</span>
                            <span className="text-xs font-bold text-red-600 block mt-1">ГОДЕН ДО: {calculatedExpiry}</span>
                          </div>

                          <button 
                            onClick={() => {
                              const product = foodType === "milk" ? "Прясно мляко" :
                                              foodType === "meat" ? "Мляно месо" :
                                              foodType === "eggs_pasteurised" ? "Яйчен меланж" :
                                              foodType === "canned_open" ? "Отворена консерва" : "Сготвено ястие";
                              handlePrintLabel(product, openedTime.replace("T", " "), calculatedExpiry);
                            }}
                            className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-[10px] uppercase px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer mx-auto shadow"
                          >
                            <Printer className="h-3 w-3" /> Принтирай етикет
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: FIRM PROFILE SETTINGS (ФИРМА И ПРОФИЛ) */}
              {activeTab === "settings" && (
                <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                    <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-brand-green">Фирма и Обект</h2>
                      <p className="text-[10px] text-brand-dark/50">Въведете детайлите на фирмата за авто-генериране на документи</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveFirm} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Наименование на Фирмата</label>
                        <input 
                          type="text" 
                          required
                          value={firmInfo.name} 
                          onChange={(e) => setFirmInfo({...firmInfo, name: e.target.value})} 
                          placeholder="напр. Ресторант Вечер ЕООД"
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Булстат / ЕИК</label>
                        <input 
                          type="text" 
                          required
                          value={firmInfo.eik} 
                          onChange={(e) => setFirmInfo({...firmInfo, eik: e.target.value})} 
                          placeholder="напр. 207123456"
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Адрес на обекта</label>
                      <input 
                        type="text" 
                        required
                        value={firmInfo.address} 
                        onChange={(e) => setFirmInfo({...firmInfo, address: e.target.value})} 
                        placeholder="напр. гр. Пловдив, ул. Главна 12"
                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Име на управител / МОЛ</label>
                        <input 
                          type="text" 
                          required
                          value={firmInfo.manager} 
                          onChange={(e) => setFirmInfo({...firmInfo, manager: e.target.value})} 
                          placeholder="напр. Иван Иванов"
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                        />
                      </div>
                                            <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Основен Сектор</label>
                        <select 
                          value={getSectorForNiche(firmInfo.niche)} 
                          onChange={(e) => {
                            const newSector = e.target.value;
                            setFirmInfo({...firmInfo, niche: BUSINESS_CATEGORIES[newSector][0]});
                          }} 
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50 font-medium"
                        >
                          {Object.keys(BUSINESS_CATEGORIES).map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Специфичен Обект / Категория</label>
                        <select 
                          value={firmInfo.niche} 
                          onChange={(e) => setFirmInfo({...firmInfo, niche: e.target.value})} 
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50 font-medium"
                        >
                          {BUSINESS_CATEGORIES[getSectorForNiche(firmInfo.niche)]?.map(niche => (
                            <option key={niche} value={niche}>{niche}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors cursor-pointer w-full"
                    >
                      Запази настройките на фирмата
                    </button>
                  </form>
                </div>
              )}

            
                      </>
                    );
                  })()}
                </>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}