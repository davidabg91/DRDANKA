"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useAuth, useDankaUsers, useCourses, useTrainings, useEnrollments } from "@/lib/firebaseHooks";
import { auth, db, storage } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject, getMetadata } from "firebase/storage";
import { BUSINESS_CATEGORIES, getSectorForNiche } from "@/data/businessCategories";
import { Course } from "@/lib/courseTypes";
import { Training, Enrollment } from "@/lib/trainingTypes";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { LIBRARY_MATERIALS } from "@/data/library";
import { LIVE_COURSES } from "@/data/live-courses";
import { usePriceOverrides, setPriceOverride, resolvePrice } from "@/lib/priceOverrides";
import RegistersTab from "@/components/registers/RegistersTab";
import AdminReminderComposer from "@/components/registers/AdminReminderComposer";
import { defaultHotPointForSector, isMeatShopNiche } from "@/data/storeRegisters";

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
  Star,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  CreditCard,
  Loader2,
  Video,
  ExternalLink,
  Copy,
  Upload,
  MessageSquare,
  Send,
  Users,
  Search,
  PlusCircle,
  Eye,
  XCircle,
  X,
  Paperclip
} from "lucide-react";

export interface AssignedMaterial {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'test';
  assignedAt: string;
  /** ISO timestamp when the client marked the material as read / submitted the test.
   *  Required for HACCP audit trail — proves the client acknowledged the document. */
  completedAt?: string;
  questions?: Array<{
    id: string;
    text: string;
    options: string[];
    correctIdx: number;
  }>;
  userAnswers?: number[];
  score?: number; // percentage
  status: 'pending' | 'completed';
  fileUrl?: string;
  fileName?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  sentAt: string;
}

export interface DankaUser {
  email: string;
  /** @deprecated Firebase Auth manages passwords — never write this to Firestore. Kept optional only for legacy localStorage seed compatibility. */
  password?: string;
  /** Business name. Empty string for bookstore-only buyers (no business profile). */
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
  /**
   * Business subscription status. Separate from `status` (which gates login).
   *   - 'none'              — bookstore-only buyer, no subscription
   *   - 'pending'           — applied for subscription, awaiting admin approval
   *   - 'awaiting_payment'  — admin approved & set a fee; user must pay before access
   *   - 'approved'          — full subscriber, all tabs unlocked
   *   - 'expired'           — subscription lapsed
   * Missing on legacy docs → treat as 'approved' so existing clients keep access.
   */
  subscriptionStatus?: 'none' | 'pending' | 'awaiting_payment' | 'approved' | 'expired' | 'trial';
  trialStartedAt?: string;
  /** Subscription fee in EUR set by admin upon approval. 0 = paid offline (cash). */
  subscriptionFeeEur?: number;
  /** ISO timestamp when subscription was actually paid (online or marked-cash). */
  subscriptionPaidAt?: string;
  /** ISO date (YYYY-MM-DD) when the subscription expires. Admin-managed. */
  expiresAt?: string;
  role: 'user' | 'admin';
  /** Course ids the user has paid for and may read. */
  purchasedCourseIds?: string[];
  assignedDocs: AssignedMaterial[];
  messages: Message[];
  customFridges?: string[];
  /** Freezers (≤ −18°C) — separate from fridges (0…+4°C) for the temperature check-lists. */
  customFreezers?: string[];
  /** Staff list used across the self-control registers (staff hygiene card, health books, trainings, workwear). */
  customEmployees?: { name: string; role: string }[];
  /** Обектът има топла точка (скара, фритюрник, дюнер…) — включва допълнителните контролни карти.
   *  Missing → derived from the business sector (ЗОХ / МТХ default to true). */
  hasHotPoint?: boolean;
  /** Уредите от топлата точка в обекта (ids от HOT_APPLIANCES) — филтрират картите и дневните напомняния. */
  hotAppliances?: string[];
  /** Обиколката на дневниците е показана веднъж — не се повтаря. */
  registersTourSeen?: boolean;
  autoDuner?: boolean;
  autoPrework?: boolean;
  autoTemps?: boolean;
  autoStaffHygiene?: boolean;
  autoCleaning?: boolean;
  autoFryerOil?: boolean;
  autoBaking?: boolean;
  autoCookedMeals?: boolean;
  autoResidue?: boolean;
  /** Нарисуван електронен подпис (PNG data URL) за автоматично попълване в картите/документите. */
  signature?: string;
  /** Как да се подписва обектът: "draw" — с електронния подпис; "manual" — на ръка след печат. */
  signatureMode?: "draw" | "manual";
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

export default function ProfilePage() {
  // Authentication states
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const { users: firebaseUsers, loading: usersLoading, setFullUser, updateUser, sendPasswordReset } = useDankaUsers();
  // Catalogs are now curated in /src/data/ — admin sees them as read-only stats.
  // The legacy 'Course' / 'Training' shape is kept here as an adapter so the
  // existing list/buyer/expansion UI keeps working without rewriting it.
  const allCourses: Course[] = LIBRARY_MATERIALS.map(m => ({
    id: m.slug,
    slug: m.slug,
    title: m.title,
    description: m.tagline,
    priceEur: m.priceEur,
    type: m.type === "pdf" ? "pdf" : "link",
    coverImageUrl: m.card.cover,
    fileSizeMb: 0,
    filePath: "",
    externalUrl: m.contentUrl,
    published: true,
    createdAt: "",
    updatedAt: "",
  }));
  const allTrainings: Training[] = LIVE_COURSES.map(c => ({
    id: c.slug,
    slug: c.slug,
    title: c.title,
    shortDesc: c.tagline,
    bullets: [],
    priceEur: c.priceEur,
    type: c.platform === "zoom" ? "zoom" : "zoom", // unify to closest legacy enum
    coverImageUrl: c.card.cover,
    hasCertificate: c.hasCertificate,
    published: true,
    createdAt: "",
    updatedAt: "",
  }));
  const { enrollments: allEnrollments } = useEnrollments();
  const { overrides: priceOverrides } = usePriceOverrides();
  /** Local edit buffer per slug while admin types a new price (string for the input). */
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const ADMIN_EMAIL = "d.nikolova.haccp@gmail.com";

  const saveUsers = (newUsers: DankaUser[]) => {
    setUsersList(newUsers);
    // Sync only the fields that actually changed for each user. Sending the
    // full document via setDoc was rejected by the Firestore rules when local
    // state had drifted from the server (e.g. status mismatch). updateDoc only
    // touches the fields we pass — leaves role/status alone unless changed.
    newUsers.forEach(nu => {
      const oldUser = usersList.find(ou => ou.email === nu.email);
      if (!oldUser) {
        // New user — must use setDoc (create). setFullUser strips password.
        setFullUser(nu.email, nu);
        return;
      }
      const diff: Partial<DankaUser> = {};
      (Object.keys(nu) as Array<keyof DankaUser>).forEach((k) => {
        if (k === "password") return; // never persist
        if (JSON.stringify((oldUser as any)[k]) !== JSON.stringify((nu as any)[k])) {
          (diff as any)[k] = (nu as any)[k];
        }
      });
      if (Object.keys(diff).length > 0) {
        updateUser(nu.email, diff);
      }
    });
  };

  useEffect(() => {
    if (!usersLoading && firebaseUsers.length > 0) {
      setUsersList(firebaseUsers);
    }
  }, [firebaseUsers, usersLoading]);


  // Auto-create admin Firestore doc on first admin login (no plaintext password).
  useEffect(() => {
    if (authLoading || usersLoading || !firebaseUser) return;
    if (firebaseUser.email !== ADMIN_EMAIL) return;
    const adminInDb = firebaseUsers.find(u => u.email === ADMIN_EMAIL);
    if (adminInDb) return;
    setFullUser(ADMIN_EMAIL, {
      email: ADMIN_EMAIL,
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
  }, [authLoading, usersLoading, firebaseUser, firebaseUsers]);

  useEffect(() => {
    if (!authLoading) {
      if (firebaseUser) {
        setIsLoggedIn(true);
        setCurrentUserEmail((firebaseUser.email || "").toLowerCase());

        if ((firebaseUser.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setUserRole("admin");
        } else {
          const matchedUser = firebaseUsers.find(u => u.email.toLowerCase() === (firebaseUser.email || "").toLowerCase());
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

  // Interactive Showcase states
  const [showcaseTab, setShowcaseTab] = useState<"logbooks" | "haccp" | "audit" | "tests">("logbooks");
  const [mockDeliveryStatus, setMockDeliveryStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [mockTempAm, setMockTempAm] = useState("4.2");
  const [mockTempPm, setMockTempPm] = useState("3.8");
  const [mockTestSelected, setMockTestSelected] = useState<number | null>(null);
  const [mockTestSubmitted, setMockTestSubmitted] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Multi-user & Admin state variables
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [usersList, setUsersList] = useState<DankaUser[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<"candidates" | "users" | "materials" | "courses" | "trainings" | "messages" | "logs">("candidates");

  // Specialized trainings admin state
  const [trainingDraftTitle, setTrainingDraftTitle] = useState("");
  const [trainingDraftShort, setTrainingDraftShort] = useState("");
  const [trainingDraftLongDesc, setTrainingDraftLongDesc] = useState("");
  const [trainingDraftPrice, setTrainingDraftPrice] = useState("");
  const [trainingDraftType, setTrainingDraftType] = useState<"video" | "zoom">("video");
  const [trainingDraftVideoUrl, setTrainingDraftVideoUrl] = useState("");
  const [trainingDraftBullets, setTrainingDraftBullets] = useState("");
  const [trainingDraftHasCertificate, setTrainingDraftHasCertificate] = useState(true);
  const [trainingDraftCover, setTrainingDraftCover] = useState<File | null>(null);
  const [trainingUploadProgress, setTrainingUploadProgress] = useState<number | null>(null);
  const [trainingsViewMode, setTrainingsViewMode] = useState<"manage" | "enrollments">("manage");
  const [enrollmentSearchQuery, setEnrollmentSearchQuery] = useState("");

  // Bookstore courses admin state
  const [courseDraftTitle, setCourseDraftTitle] = useState("");
  const [courseDraftDesc, setCourseDraftDesc] = useState("");
  const [courseDraftLongDesc, setCourseDraftLongDesc] = useState("");
  const [courseDraftPrice, setCourseDraftPrice] = useState("");
  const [courseDraftType, setCourseDraftType] = useState<"pdf" | "link">("pdf");
  const [courseDraftPdf, setCourseDraftPdf] = useState<File | null>(null);
  const [courseDraftExternalUrl, setCourseDraftExternalUrl] = useState("");
  const [courseDraftCover, setCourseDraftCover] = useState<File | null>(null);
  const [courseUploadProgress, setCourseUploadProgress] = useState<number | null>(null);
  const [courseGrantEmail, setCourseGrantEmail] = useState("");
  const [courseGrantTargetId, setCourseGrantTargetId] = useState("");
  const [expandedCourseBuyers, setExpandedCourseBuyers] = useState<string | null>(null);
  const [libraryUploadProgress, setLibraryUploadProgress] = useState<Record<string, number | null>>({});
  const [libraryPdfExists, setLibraryPdfExists] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userRole !== "admin") return;
    LIBRARY_MATERIALS.forEach(async (m) => {
      if (m.type !== "pdf") return;
      try {
        await getMetadata(storageRef(storage, `library/${m.slug}/file.pdf`));
        setLibraryPdfExists(prev => ({ ...prev, [m.slug]: true }));
      } catch {
        setLibraryPdfExists(prev => ({ ...prev, [m.slug]: false }));
      }
    });
  }, [userRole, storage]);

  // Admin Materials form states
  const [materialType, setMaterialType] = useState<"document" | "test">("document");
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialContent, setNewMaterialContent] = useState("");
  const [newMaterialTarget, setNewMaterialTarget] = useState("all");
  const [newTestQuestions, setNewTestQuestions] = useState<Array<{ id: string; text: string; options: string[]; correctIdx: number }>>([]);
  const [assignedFile, setAssignedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Draft Question builder states
  const [draftQuestionText, setDraftQuestionText] = useState("");
  const [draftQuestionOpt1, setDraftQuestionOpt1] = useState("");
  const [draftQuestionOpt2, setDraftQuestionOpt2] = useState("");
  const [draftQuestionOpt3, setDraftQuestionOpt3] = useState("");
  const [draftQuestionCorrect, setDraftQuestionCorrect] = useState(0);

  // Admin Chat state
  const [adminActiveChatEmail, setAdminActiveChatEmail] = useState("");
  const [adminChatMessageText, setAdminChatMessageText] = useState("");

  // Admin Registers Auditor state — selected client whose registers are shown read-only.
  const [auditUserEmail, setAuditUserEmail] = useState("");

  // Admin User search/filter state
  const [usersSearchQuery, setUsersSearchQuery] = useState("");

  // Broadcast (admin → all approved clients) state
  const [broadcastText, setBroadcastText] = useState("");

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
  const [applyAddress, setApplyAddress] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // Logged-in apply-for-subscription modal (bookstore-only buyers wanting full plan)
  const [subApplyOpen, setSubApplyOpen] = useState(false);

  // Admin: "set fee" modal that opens when approving a candidate
  const [feeModalEmail, setFeeModalEmail] = useState<string | null>(null);
  const [feeModalAmount, setFeeModalAmount] = useState("");

  // Client: package selection confirm + success modals
  const [pkgConfirmModal, setPkgConfirmModal] = useState<{ name: string; fee: number } | null>(null);
  const [pkgSuccessModal, setPkgSuccessModal] = useState<{ name: string; fee: number } | null>(null);

  // Client: subscription payment test-checkout modal
  const [subPayOpen, setSubPayOpen] = useState(false);
  const [subPayStatus, setSubPayStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [subPayError, setSubPayError] = useState("");

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

  // Daily logs are handled entirely by <RegistersTab /> (src/components/registers).

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

      // Load state and initial date on client mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    // Initialize danka_users if not present
    let users: DankaUser[] = [];
    const storedUsers = localStorage.getItem("danka_users");
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    } else {
      users = [
        {
          email: ADMIN_EMAIL,
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
    const adminExists = users.some(u => u.email.toLowerCase().trim() === ADMIN_EMAIL);
    if (!adminExists) {
      const adminUser: DankaUser = {
        email: ADMIN_EMAIL,
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
  }, []);

  // Escape HTML to prevent XSS in print iframes (user-supplied strings)
  const escapeHtml = (raw: string) =>
    String(raw)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

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
            <title>${escapeHtml(title)}</title>
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
          <body>${escapeHtml(content)}</body>
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
              <div class="detail">Продукт: <span class="highlight">${escapeHtml(product)}</span></div>
              <div class="detail">Отворен на: ${escapeHtml(opened)}</div>
              <div class="detail">Годен до: <span class="highlight">${escapeHtml(expiry)}</span></div>
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

  // Sign in via Firebase Auth. The admin's Firestore doc is auto-created
  // by ensureAdminDoc() effect below — no hardcoded credentials in client JS.
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      alert("Моля, попълнете имейл и парола.");
      return;
    }
    const cleanEmail = authEmail.trim().toLowerCase();

    try {
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

  // Send password reset email to whatever's in the auth email field.
  const handleForgotPassword = async () => {
    const cleanEmail = authEmail.trim().toLowerCase();
    if (!cleanEmail) {
      alert("Моля въведете имейла си в полето по-горе и натиснете отново „Забравена парола“.");
      return;
    }
    try {
      await sendPasswordReset(cleanEmail);
      alert(`Изпратихме линк за смяна на парола на ${cleanEmail}. Проверете пощата си (и Spam папката).`);
    } catch (err: any) {
      alert("Не успяхме да изпратим линк: " + (err?.message || "неизвестна грешка"));
    }
  };

  // Register & Apply handler
  const handleRegisterAndApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !applyFirmName || !applyContact || !applyPhone || !applyAddress || !applyDesc) {
      alert("Моля, попълнете всички полета с червена звездичка (*).");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert("Паролите не съвпадат.");
      return;
    }

    try {
      const cleanRegEmail = regEmail.trim().toLowerCase();
      await createUserWithEmailAndPassword(auth, cleanRegEmail, regPassword);
      const newUser: DankaUser = {
        email: cleanRegEmail,
        firmName: applyFirmName,
        eik: applyEik || "Няма въведен",
        contact: applyContact,
        phone: applyPhone,
        sector: applySector,
        niche: applyNiche,
        desc: applyDesc,
        address: applyAddress || "Не е въведен",
        manager: applyContact,
        status: "approved",
        subscriptionStatus: "trial",
        trialStartedAt: new Date().toISOString(),
        role: "user",
        assignedDocs: [],
        messages: []
      };
      
      const ok = await setFullUser(cleanRegEmail, newUser);
      if (!ok) return;

      // Clean registration form fields:
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
      setApplyFirmName("");
      setApplyEik("");
      setApplyContact("");
      setApplyPhone("");
      setApplyAddress("");
      setApplyDesc("");
      
      setActiveTab("logs");
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        alert("Този имейл вече е регистриран.");
      } else {
        alert("Грешка при регистрация: " + err.message);
      }
    }
  };


  // Logout handler

  // Auto-mark messages as read when viewing chat.
  // NOTE: we intentionally do NOT depend on usersList — that caused an infinite
  // saveUsers → setUsersList → effect → saveUsers cycle. Instead we run only
  // when the active chat target changes and write a single user via updateUser.
  useEffect(() => {
    const targetEmail =
      userRole === "admin" && activeAdminTab === "messages" ? adminActiveChatEmail :
      userRole !== "admin" && activeTab === "chat" ? currentUserEmail :
      "";
    if (!targetEmail) return;

    const target = usersList.find(u => u.email === targetEmail);
    if (!target || !target.messages) return;

    const incomingSender: "user" | "admin" = userRole === "admin" ? "user" : "admin";
    const hasUnread = target.messages.some((m: any) => m.sender === incomingSender && !m.isRead);
    if (!hasUnread) return;

    const updatedMessages = target.messages.map((m: any) =>
      m.sender === incomingSender ? { ...m, isRead: true } : m
    );
    updateUser(target.email, { messages: updatedMessages });
    setUsersList(prev => prev.map(u =>
      u.email === target.email ? { ...u, messages: updatedMessages } : u
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, activeAdminTab, adminActiveChatEmail, activeTab, currentUserEmail]);

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setCurrentUserEmail("");
    setUserRole("user");
    setActiveTab("logs");
  };

  /**
   * Admin clicks "Approve" on a candidate. Opens a modal asking for the
   * subscription fee in EUR. The actual approval happens in handleConfirmApproval
   * below — admin can set fee=0 to mark the client as paid-in-cash and grant
   * immediate access, or any positive amount to put them in 'awaiting_payment'
   * state until they pay online.
   */
  const handleApproveCandidate = (email: string) => {
    setFeeModalEmail(email);
    setFeeModalAmount("");
  };

  /**
   * Admin submits the fee modal. Two outcomes:
   *   fee  = 0  → client paid offline / cash → subscriptionStatus = 'approved'
   *               with subscriptionPaidAt set to now (full access granted)
   *   fee  > 0  → subscriptionStatus = 'awaiting_payment' + subscriptionFeeEur
   *               saved. Client sees a pay button in their portal until they
   *               complete payment via /api/checkout (or the test flow below).
   */
  const handleConfirmApproval = async () => {
    if (!feeModalEmail) return;
    const fee = parseFloat(feeModalAmount);
    if (Number.isNaN(fee) || fee < 0) {
      alert("Моля въведете валидна сума в EUR (или 0 за платено в кеш).");
      return;
    }

    let updates: Partial<DankaUser>;
    if (fee === 0) {
      const oneYear = new Date();
      oneYear.setFullYear(oneYear.getFullYear() + 1);
      const expiresAt = oneYear.toISOString().split("T")[0]; // YYYY-MM-DD

      updates = {
        status: "approved",
        subscriptionStatus: "approved",
        subscriptionFeeEur: 0,
        subscriptionPaidAt: new Date().toISOString(),
        expiresAt,
      };
    } else {
      updates = {
        status: "approved",
        subscriptionStatus: "awaiting_payment",
        subscriptionFeeEur: Math.round(fee * 100) / 100,
      };
    }

    const ok = await updateUser(feeModalEmail, updates);
    if (ok) {
      const targetEmail = feeModalEmail;
      setFeeModalEmail(null);
      setFeeModalAmount("");
      alert(
        fee === 0
          ? `Обектът ${targetEmail} беше одобрен и получи безплатен достъп (платено в кеш).`
          : `Обектът ${targetEmail} беше одобрен. Сега трябва да заплати ${fee.toFixed(2)} € преди да получи достъп.`
      );
    }
  };

  /**
   * Client selects a subscription package from the packages tab.
   * This updates their subscriptionStatus to 'awaiting_payment' and sets their fee.
   * The user then does a bank transfer, and the admin approves it from the admin panel.
   */
  const handleSelectPackage = (packageName: string, fee: number) => {
    if (!currentUserEmail) return;
    setPkgConfirmModal({ name: packageName, fee });
  };

  const handleConfirmSelectPackage = async () => {
    if (!pkgConfirmModal || !currentUserEmail) return;
    const { name, fee } = pkgConfirmModal;
    setPkgConfirmModal(null);
    try {
      const updates = {
        subscriptionStatus: "awaiting_payment" as const,
        subscriptionFeeEur: fee
      };
      const ok = await updateUser(currentUserEmail, updates);
      if (ok) {
        setPkgSuccessModal({ name, fee });
        setTimeout(() => {
          const el = document.getElementById("bank-details-card");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    } catch (err) {
      console.error("Select package error:", err);
    }
  };

  // Admin toggles user active/expired status
  const handleToggleUserStatus = (email: string, currentStatus: string) => {
    const activating = currentStatus !== "approved";
    let newExpiryForAlert: string | null = null;
    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const nextStatus = activating ? "approved" as const : "expired" as const;
        const next = { ...u, status: nextStatus, subscriptionStatus: nextStatus };
        // При активиране: ако срокът е изтекъл или липсва, задаваме нов (+1 година).
        // Иначе auto-expire ефектът веднага ще върне статуса на "изтекъл" при
        // следващото зареждане и бутонът пак ще показва "Активирай абонамент".
        if (activating && (!u.expiresAt || (daysUntilExpiry(u.expiresAt) ?? -1) < 0)) {
          const d = new Date();
          d.setFullYear(d.getFullYear() + 1);
          next.expiresAt = d.toISOString().split("T")[0];
          newExpiryForAlert = next.expiresAt;
        }
        return next;
      }
      return u;
    });
    saveUsers(updatedUsers);
    if (newExpiryForAlert) {
      alert(`Абонаментът беше подновен до ${newExpiryForAlert}. Можете да коригирате датата от колоната „Изтича на“.`);
    }
  };

  // Admin approves payment for subscription (bank transfer)
  const handleConfirmSubscriptionPayment = (email: string) => {
    if (!confirm(`Сигурни ли сте, че искате да потвърдите плащането по банкова сметка за ${email} и да активирате абонамента?`)) return;
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    const expiresAt = oneYear.toISOString().split("T")[0]; // YYYY-MM-DD

    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const oldMessages = u.messages || [];
        const newMsg: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          sender: 'admin',
          text: "Здравейте! Годишният Ви абонамент за БАБХ Спокойствие е активиран успешно, тъй като банковият Ви превод е получен. Всички функции на портала (дневници, НАССР документи и т.н.) са напълно отключени за период от 1 година. Благодарим Ви!",
          sentAt: new Date().toISOString()
        };
        return {
          ...u,
          subscriptionStatus: "approved" as const,
          subscriptionPaidAt: new Date().toISOString(),
          expiresAt,
          messages: [...oldMessages, newMsg]
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    alert(`Плащането за ${email} е потвърдено и абонаментът е активиран!`);
  };

  // Admin deletes user
  const handleDeleteUser = async (email: string) => {
    if (!confirm(`Сигурни ли сте, че искате да изтриете потребител ${email}?`)) return;
    try {
      const cleanEmail = email.trim().toLowerCase();
      await deleteDoc(doc(db, "users", cleanEmail));
      const updatedUsers = usersList.filter(u => u.email.toLowerCase() !== cleanEmail);
      setUsersList(updatedUsers);
    } catch (err: any) {
      alert("Грешка при изтриване: " + (err?.message || err));
    }
  };

  // Subscription expiry helpers.
  const daysUntilExpiry = (expiresAt?: string): number | null => {
    if (!expiresAt) return null;
    const exp = new Date(expiresAt + "T23:59:59").getTime();
    if (Number.isNaN(exp)) return null;
    return Math.ceil((exp - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const trialDaysLeft = (trialStartedAt?: string): number => {
    if (!trialStartedAt) return 0;
    const start = new Date(trialStartedAt).getTime();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;
    const exp = start + fourteenDays;
    const diff = exp - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Admin sets/changes the expiry date for a client.
  const handleSetExpiresAt = (email: string, expiresAt: string) => {
    const updatedUsers = usersList.map(u =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, expiresAt } : u
    );
    saveUsers(updatedUsers);
  };

  // Admin broadcasts a single chat message to every approved client.
  const handleBroadcastMessage = () => {
    const text = broadcastText.trim();
    if (!text) {
      alert("Моля въведете текст за broadcast съобщението.");
      return;
    }
    if (!confirm(`Ще изпратите това съобщение на всички активни клиенти. Продължавате?`)) return;
    const baseId = "msg_" + Date.now();
    const sentAt = new Date().toISOString();
    const updatedUsers = usersList.map((u, idx) => {
      if (u.role !== "user" || u.status !== "approved") return u;
      const msg: Message = {
        id: `${baseId}_${idx}`,
        sender: "admin",
        text,
        sentAt
      };
      return { ...u, messages: [...(u.messages || []), msg] };
    });
    saveUsers(updatedUsers);
    setBroadcastText("");
    const recipients = updatedUsers.filter(u => u.role === "user" && u.status === "approved").length;
    alert(`Съобщението беше изпратено на ${recipients} клиент${recipients === 1 ? "" : "и"}.`);
  };

  // Admin export of all clients to CSV (downloads in browser).
  const handleExportClientsCsv = () => {
    const cols = ["email", "firmName", "eik", "contact", "phone", "niche", "address", "status", "expiresAt", "assignedCount", "completedCount"];
    const csvEscape = (raw: any) => {
      const s = String(raw ?? "");
      return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = usersList
      .filter(u => u.role === "user")
      .map(u => [
        u.email,
        u.firmName,
        u.eik,
        u.contact,
        u.phone,
        u.niche,
        u.address,
        u.status,
        u.expiresAt || "",
        (u.assignedDocs || []).length,
        (u.assignedDocs || []).filter(d => d.status === "completed").length
      ].map(csvEscape).join(","));
    const csv = "﻿" + cols.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `danka-clients-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Non-subscribed or expired buyers land on 'packages' tab if they try to access locked tabs.
  useEffect(() => {
    if (userRole !== "user" || !currentUserEmail) return;
    const me = usersList.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
    if (!me) return;
    
    const hasTrial = me.status === "approved" && me.subscriptionStatus === "trial" && trialDaysLeft(me.trialStartedAt) >= 0;
    const hasSub = me.status === "approved" && (me.subscriptionStatus ?? "approved") === "approved" && (me.expiresAt ? (daysUntilExpiry(me.expiresAt) ?? 0) >= 0 : true);
    const isSubscribed = hasSub || hasTrial;

    if (!isSubscribed && activeTab !== "courses" && activeTab !== "packages") {
      setActiveTab("packages");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, currentUserEmail, usersList, activeTab]);

  // Auto-mark 'paid' enrollments as 'contacted' when admin opens the
  // Записани sub-tab. Clears the red badge — admin can still see them
  // in the list (status pill turns blue 'Свързан').
  useEffect(() => {
    if (userRole !== "admin") return;
    if (activeAdminTab !== "trainings" || trainingsViewMode !== "enrollments") return;
    const toMark = allEnrollments.filter(e => e.status === "paid");
    if (toMark.length === 0) return;
    const now = new Date().toISOString();
    toMark.forEach(e => {
      setDoc(
        doc(db, "enrollments", e.id),
        { status: "contacted", contactedAt: now },
        { merge: true }
      ).catch(err => console.error("auto-mark enrollment contacted:", err));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, activeAdminTab, trainingsViewMode, allEnrollments.length]);

  // Auto-expire clients whose expiresAt has passed (runs once on admin login).
  useEffect(() => {
    if (userRole !== "admin" || usersLoading) return;
    const toExpire = usersList.filter(u =>
      u.role === "user" && u.status === "approved" &&
      u.expiresAt && (daysUntilExpiry(u.expiresAt) ?? 1) < 0
    );
    if (toExpire.length === 0) return;
    toExpire.forEach(u => updateUser(u.email, { status: "expired", subscriptionStatus: "expired" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, usersLoading, usersList.length]);

  if (authLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium animate-pulse">Зареждане на профила...</p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // Bookstore: admin upload / edit / delete / grant
  // ────────────────────────────────────────────────────────────────────────

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseDraftTitle.trim() || !courseDraftDesc.trim()) {
      alert("Моля попълнете заглавие и кратко описание на курса.");
      return;
    }
    const priceNum = parseFloat(courseDraftPrice);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      alert("Моля въведете валидна цена (лева).");
      return;
    }
    if (courseDraftType === "pdf") {
      if (!courseDraftPdf) {
        alert("Моля прикачете PDF файл за курса.");
        return;
      }
      if (courseDraftPdf.type !== "application/pdf") {
        alert("Файлът трябва да бъде във формат PDF.");
        return;
      }
    } else {
      // type === 'link'
      if (!courseDraftExternalUrl.trim()) {
        alert("Моля въведете линк към курса (URL).");
        return;
      }
      try {
        new URL(courseDraftExternalUrl.trim());
      } catch {
        alert("Линкът не е валиден URL. Започвайте с https://");
        return;
      }
    }

    const courseId = "course_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const pdfPath = `courses/${courseId}/file.pdf`;
    const coverPath = courseDraftCover ? `courses/${courseId}/cover.${(courseDraftCover.name.split(".").pop() || "jpg").toLowerCase()}` : "";

    try {
      // PDF upload only for type='pdf'.
      if (courseDraftType === "pdf" && courseDraftPdf) {
        setCourseUploadProgress(0);
        await new Promise<void>((resolve, reject) => {
          const task = uploadBytesResumable(storageRef(storage, pdfPath), courseDraftPdf);
          task.on(
            "state_changed",
            (snap) => setCourseUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            (err) => reject(err),
            () => resolve()
          );
        });
      }

      // Optional cover image upload.
      let coverImageUrl = "";
      if (courseDraftCover) {
        const coverTask = await uploadBytesResumable(storageRef(storage, coverPath), courseDraftCover);
        coverImageUrl = await getDownloadURL(coverTask.ref);
      }

      const now = new Date().toISOString();
      // SEO-friendly slug from the title, deduped against existing courses.
      const slug = uniqueSlug(
        slugify(courseDraftTitle),
        allCourses.map((x) => x.slug).filter((s): s is string => !!s)
      );
      // Firestore rejects undefined values, so build the object without the
      // optional fields and add them only when populated.
      const newCourse: Course = {
        id: courseId,
        slug,
        title: courseDraftTitle.trim(),
        description: courseDraftDesc.trim(),
        priceEur: Math.round(priceNum * 100) / 100,
        type: courseDraftType,
        published: true,
        createdAt: now,
        updatedAt: now,
      };
      if (courseDraftType === "pdf" && courseDraftPdf) {
        newCourse.filePath = pdfPath;
        newCourse.fileSizeMb = Math.round((courseDraftPdf.size / (1024 * 1024)) * 100) / 100;
      }
      if (courseDraftType === "link") {
        newCourse.externalUrl = courseDraftExternalUrl.trim();
      }
      if (courseDraftLongDesc.trim()) {
        newCourse.longDescription = courseDraftLongDesc.trim();
      }
      if (coverImageUrl) {
        newCourse.coverImageUrl = coverImageUrl;
      }
      await setDoc(doc(db, "courses", courseId), newCourse);

      setCourseUploadProgress(null);
      setCourseDraftTitle("");
      setCourseDraftDesc("");
      setCourseDraftLongDesc("");
      setCourseDraftPrice("");
      setCourseDraftType("pdf");
      setCourseDraftPdf(null);
      setCourseDraftExternalUrl("");
      setCourseDraftCover(null);
      alert("Курсът беше успешно качен!");
    } catch (err: any) {
      setCourseUploadProgress(null);
      console.error("Course upload error:", err);
      alert(`Грешка при качване: ${err?.code || ""} ${err?.message || err}`);
    }
  };

  const handleTogglePublished = async (c: Course) => {
    try {
      await setDoc(doc(db, "courses", c.id), { ...c, published: !c.published, updatedAt: new Date().toISOString() });
    } catch (err: any) {
      alert("Грешка: " + (err?.message || err));
    }
  };

  const handleDeleteCourse = async (c: Course) => {
    if (!confirm(`Изтриване на курс „${c.title}"? Действието е необратимо. Купувачите ще загубят достъп.`)) return;
    try {
      await deleteDoc(doc(db, "courses", c.id));
      // Storage cleanup — file & cover may or may not exist; ignore individual errors.
      try { await deleteObject(storageRef(storage, c.filePath)); } catch { /* ignore */ }
      alert("Курсът беше изтрит.");
    } catch (err: any) {
      alert("Грешка при изтриване: " + (err?.message || err));
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // Trainings: admin create / edit / delete / toggle published
  // ────────────────────────────────────────────────────────────────────────

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingDraftTitle.trim() || !trainingDraftShort.trim()) {
      alert("Моля попълнете заглавие и кратко описание.");
      return;
    }
    const priceNum = parseFloat(trainingDraftPrice);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      alert("Моля въведете валидна цена в евро.");
      return;
    }
    if (trainingDraftType === "video" && !trainingDraftVideoUrl.trim()) {
      alert(`За тип „Видео обучение" е необходим линк към видеото (YouTube, Vimeo и т.н.).`);
      return;
    }

    const trainingId = "training_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const now = new Date().toISOString();
    const bullets = trainingDraftBullets
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      // Optional cover image upload to /trainings/{id}/cover.<ext>
      let coverImageUrl = "";
      if (trainingDraftCover) {
        setTrainingUploadProgress(0);
        const ext = (trainingDraftCover.name.split(".").pop() || "jpg").toLowerCase();
        const coverPath = `trainings/${trainingId}/cover.${ext}`;
        await new Promise<void>((resolve, reject) => {
          const task = uploadBytesResumable(storageRef(storage, coverPath), trainingDraftCover);
          task.on(
            "state_changed",
            (snap) => setTrainingUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            (err) => reject(err),
            async () => {
              coverImageUrl = await getDownloadURL(task.snapshot.ref);
              resolve();
            }
          );
        });
      }
      setTrainingUploadProgress(null);

      const slug = uniqueSlug(
        slugify(trainingDraftTitle),
        allTrainings.map((x) => x.slug).filter((s): s is string => !!s)
      );
      const newTraining: Training = {
        id: trainingId,
        slug,
        title: trainingDraftTitle.trim(),
        shortDesc: trainingDraftShort.trim(),
        bullets,
        priceEur: Math.round(priceNum * 100) / 100,
        type: trainingDraftType,
        hasCertificate: trainingDraftHasCertificate,
        published: true,
        createdAt: now,
        updatedAt: now,
      };
      if (trainingDraftType === "video" && trainingDraftVideoUrl.trim()) {
        newTraining.videoUrl = trainingDraftVideoUrl.trim();
      }
      if (coverImageUrl) {
        newTraining.coverImageUrl = coverImageUrl;
      }
      if (trainingDraftLongDesc.trim()) {
        newTraining.longDescription = trainingDraftLongDesc.trim();
      }

      await setDoc(doc(db, "trainings", trainingId), newTraining);
      // reset
      setTrainingDraftTitle("");
      setTrainingDraftShort("");
      setTrainingDraftLongDesc("");
      setTrainingDraftPrice("");
      setTrainingDraftType("video");
      setTrainingDraftVideoUrl("");
      setTrainingDraftBullets("");
      setTrainingDraftHasCertificate(true);
      setTrainingDraftCover(null);
      alert("Курсът беше успешно добавен!");
    } catch (err: any) {
      setTrainingUploadProgress(null);
      alert("Грешка: " + (err?.message || err));
    }
  };

  const handleToggleTrainingPublished = async (t: Training) => {
    try {
      await setDoc(doc(db, "trainings", t.id), { ...t, published: !t.published, updatedAt: new Date().toISOString() });
    } catch (err: any) {
      alert("Грешка: " + (err?.message || err));
    }
  };

  const handleDeleteTraining = async (t: Training) => {
    const relatedEnrollments = allEnrollments.filter(e => e.trainingId === t.id);
    const cascadeMsg = relatedEnrollments.length > 0
      ? `\n\nЩе бъдат изтрити и ${relatedEnrollments.length} записани участници за този курс.`
      : "";
    if (!confirm(`Изтриване на курс „${t.title}"?${cascadeMsg}`)) return;
    try {
      await deleteDoc(doc(db, "trainings", t.id));
      // Cascade-delete enrollments for this training so the badge doesn't
      // keep counting orphan records.
      await Promise.all(
        relatedEnrollments.map(e => deleteDoc(doc(db, "enrollments", e.id)).catch(() => undefined))
      );
      alert("Курсът беше изтрит.");
    } catch (err: any) {
      alert("Грешка при изтриване: " + (err?.message || err));
    }
  };

  const handleMarkEnrollmentContacted = async (enr: Enrollment) => {
    try {
      await setDoc(doc(db, "enrollments", enr.id), { ...enr, status: "contacted", contactedAt: new Date().toISOString() }, { merge: true });
    } catch (err: any) {
      alert("Грешка: " + (err?.message || err));
    }
  };

  /**
   * Admin uploads a PDF for a library material (code-based catalog).
   * File is stored at /library/{slug}/file.pdf in Firebase Storage.
   * Storage Rules grant read access to admin or any buyer who has the slug
   * in their purchasedCourseIds — same protected pattern as before.
   */
  /** Admin saves a custom price for a slug (library or live). */
  const handleSavePrice = async (slug: string) => {
    const raw = priceDraft[slug];
    if (raw === undefined) return;
    const num = parseFloat(raw);
    if (Number.isNaN(num) || num < 0) {
      alert("Моля въведете валидна цена в EUR.");
      return;
    }
    try {
      await setPriceOverride(slug, Math.round(num * 100) / 100);
      setPriceDraft(p => { const next = { ...p }; delete next[slug]; return next; });
    } catch (err: any) {
      alert("Грешка при запис на цената: " + (err?.message || err));
    }
  };

  /** Admin clears the override — falls back to code default. */
  const handleResetPrice = async (slug: string) => {
    if (!confirm("Премахване на персоналната цена и връщане към default-а от кода?")) return;
    try {
      await setPriceOverride(slug, null);
      setPriceDraft(p => { const next = { ...p }; delete next[slug]; return next; });
    } catch (err: any) {
      alert("Грешка: " + (err?.message || err));
    }
  };

  const handleUploadLibraryPdf = (slug: string, file: File) => {
    if (file.type !== "application/pdf") {
      alert("Файлът трябва да бъде PDF.");
      return;
    }
    const path = `library/${slug}/file.pdf`;
    setLibraryUploadProgress(p => ({ ...p, [slug]: 0 }));
    const task = uploadBytesResumable(storageRef(storage, path), file);
    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setLibraryUploadProgress(p => ({ ...p, [slug]: pct }));
      },
      (err) => {
        console.error("library upload error:", err);
        setLibraryUploadProgress(p => ({ ...p, [slug]: null }));
        alert(`Грешка при качване: ${err?.code || ""} ${err?.message || err}`);
      },
      () => {
        setLibraryUploadProgress(p => ({ ...p, [slug]: null }));
        setLibraryPdfExists(p => ({ ...p, [slug]: true }));
        alert(`PDF-ът за „${slug}" е качен успешно!`);
      }
    );
  };
  const handleGrantCourse = async () => {
    const email = courseGrantEmail.trim().toLowerCase();
    if (!email || !courseGrantTargetId) {
      alert("Моля изберете курс и въведете email на клиента.");
      return;
    }
    const target = usersList.find(u => u.email.toLowerCase() === email);
    if (!target) {
      alert(`Няма потребител с email ${email}. Първо клиентът трябва да си направи акаунт.`);
      return;
    }
    const existing = target.purchasedCourseIds || [];
    if (existing.includes(courseGrantTargetId)) {
      alert("Този потребител вече има достъп до този курс.");
      return;
    }
    const ok = await updateUser(email, { purchasedCourseIds: [...existing, courseGrantTargetId] });
    if (ok) {
      setCourseGrantEmail("");
      setCourseGrantTargetId("");
      alert(`Достъпът беше предоставен на ${email}.`);
    }
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

  /**
   * Logged-in user (e.g. bookstore-only buyer) applies for a full business
   * subscription. Marks subscriptionStatus='pending'. Admin sees them in the
   * Candidates tab and can approve to set subscriptionStatus='approved'.
   */
  const handleApplyForSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail) return;
    if (!applyFirmName.trim() || !applyContact.trim() || !applyPhone.trim() || !applyAddress.trim() || !applyDesc.trim()) {
      alert("Моля попълнете всички полета с * за обекта.");
      return;
    }
    const ok = await updateUser(currentUserEmail, {
      firmName: applyFirmName.trim(),
      eik: applyEik.trim() || "Няма въведен",
      contact: applyContact.trim(),
      phone: applyPhone.trim(),
      sector: applySector,
      niche: applyNiche,
      desc: applyDesc.trim(),
      address: applyAddress.trim(),
      manager: applyContact.trim(),
      subscriptionStatus: "pending",
    });
    if (ok) {
      setSubApplyOpen(false);
      // Reset form
      setApplyFirmName("");
      setApplyEik("");
      setApplyContact("");
      setApplyPhone("");
      setApplyAddress("");
      setApplyDesc("");
      alert("Заявлението е изпратено! Д-р Николова ще го прегледа и ще получите уведомление след одобрение.");
    }
  };

  // Admin assigns document
  const handleAssignDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle || !newMaterialContent) {
      alert("Моля попълнете заглавие и съдържание.");
      return;
    }

    let fileUrl = "";
    let fileName = "";

    if (assignedFile) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        // Upload path: assigned_docs/{recipient}/{timestamp}_{filename}
        const recipientFolder = newMaterialTarget === "all" ? "all" : newMaterialTarget.toLowerCase();
        const storagePath = `assigned_docs/${recipientFolder}/${Date.now()}_${assignedFile.name}`;
        const fileRef = storageRef(storage, storagePath);
        
        const uploadTask = uploadBytesResumable(fileRef, assignedFile);
        
        // Wait for upload task to complete with progress callback
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              reject(error);
            },
            () => {
              resolve();
            }
          );
        });

        fileUrl = await getDownloadURL(fileRef);
        fileName = assignedFile.name;
      } catch (err: any) {
        console.error("Error uploading file:", err);
        alert(`Грешка при качване на файла: ${err.message || err}`);
        setIsUploading(false);
        setUploadProgress(null);
        return;
      }
      setIsUploading(false);
      setUploadProgress(null);
    }

    const newDoc: AssignedMaterial = {
      id: "doc_" + Date.now(),
      title: newMaterialTitle,
      content: newMaterialContent,
      type: "document",
      assignedAt: new Date().toISOString().split("T")[0],
      status: "pending",
      ...(fileUrl ? { fileUrl, fileName } : {})
    };

    const updatedUsers = usersList.map(u => {
      if (u.role === "user" && (newMaterialTarget === "all" || u.email.toLowerCase() === newMaterialTarget.toLowerCase())) {
        return {
          ...u,
          assignedDocs: [...(u.assignedDocs || []), newDoc]
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    
    // Reset inputs
    setNewMaterialTitle("");
    setNewMaterialContent("");
    setAssignedFile(null);
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

    const now = new Date().toISOString();
    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
        const updatedDocs = u.assignedDocs.map(doc => {
          if (doc.id === activeAssignedMaterial.id) {
            return {
              ...doc,
              status: "completed" as const,
              completedAt: now,
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
    
    const now = new Date().toISOString();
    const updatedUsers = usersList.map(u => {
      if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
        const updatedDocs = u.assignedDocs.map(doc => {
          if (doc.id === materialId) {
            return {
              ...doc,
              status: "completed" as const,
              completedAt: now
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
    <div className={!isLoggedIn ? "bg-[#0A100D] min-h-screen pb-20 relative overflow-hidden" : "bg-brand-light min-h-screen pb-20"}>
      {/* SaaS Grid Background for Unauthenticated State */}
      {!isLoggedIn && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,transparent_0%,rgba(10,16,13,0.9)_100%)] pointer-events-none"></div>
        </>
      )}
      
      {/* 1. Header Hero Banner - Hidden on print */}
      <section className={`${!isLoggedIn ? "bg-transparent border-b border-white/5 pt-16 pb-8" : "bg-brand-green border-b border-brand-gold/15 py-10"} text-center relative overflow-hidden print:hidden`}>
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
      </section>

      {/* 2. AUTHENTICATION SCREENS (LOGIN / REGISTER / APPLY) - Hidden on print */}
      {!isLoggedIn && (
        <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 print:hidden animate-fade-in relative z-10">
          {isPendingApproval ? (
            <div className="max-w-xl mx-auto bg-[#FDFBF7] border border-brand-gold/45 p-8 rounded-2xl shadow-xl space-y-6 text-center animate-fade-in text-brand-dark">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full bg-brand-gold/10 animate-ping"></div>
                <div className="relative w-16 h-16 rounded-full bg-brand-gold/25 text-brand-gold flex items-center justify-center border border-brand-gold/45">
                  <Clock className="h-8 w-8 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-brand-green">Профилът Ви чака одобрение</h2>
                <p className="text-xs text-brand-gold-dark font-bold uppercase tracking-widest">Статус: В процес на разглеждане</p>
                <p className="text-sm text-brand-dark/90 max-w-md mx-auto leading-relaxed pt-2">
                  Заявлението за обект <span className="font-bold text-brand-green">{pendingFirmName || "Вашия обект"}</span> е регистрирано успешно с имейл <code className="bg-[#FAF6EE] border border-brand-gold/30 px-1.5 py-0.5 rounded font-mono text-xs text-brand-dark">{pendingEmail}</code>.
                </p>
                <p className="text-xs text-brand-dark/75 max-w-sm mx-auto leading-normal">
                  За да се гарантира съответствието на НАССР документацията, д-р Данка Николова трябва лично да прегледа описаната дейност на обекта и да активира акаунта Ви. Това обикновено отнема до 24 часа.
                </p>
              </div>

              {/* Visual Process Timeline */}
              <div className="grid grid-cols-3 gap-2 py-4 relative">
                <div className="absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-brand-green/20 -z-10"></div>
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px] font-bold mx-auto border border-brand-green">✓</div>
                  <span className="text-[9px] font-bold uppercase block text-brand-dark/70">1. Кандидатстване</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-brand-gold text-brand-green flex items-center justify-center text-[10px] font-bold mx-auto border border-brand-gold animate-pulse">2</div>
                  <span className="text-[9px] font-bold uppercase block text-brand-green font-bold">2. Преглед</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#FAF6EE] text-brand-dark/50 flex items-center justify-center text-[10px] font-bold mx-auto border border-brand-gold/30">3</div>
                  <span className="text-[9px] font-bold uppercase block text-brand-dark/50">3. Одобрение & Вход</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => { setIsPendingApproval(false); setAuthMode("login"); }}
                  className="text-xs text-brand-dark/60 hover:text-brand-green font-semibold underline cursor-pointer transition-colors duration-200"
                >
                  ← Обратно към Вход
                </button>
              </div>
            </div>
          ) : (
            
            <div className="space-y-12 pb-12">


              {/* Bento Grid Layout */}
              <div className="flex flex-col xl:grid xl:grid-cols-3 gap-6 xl:gap-8 items-start relative z-10 max-w-6xl mx-auto">
              
                {/* LEFT COLUMN: 3 Animated Panels */}
                <div className="space-y-6 order-2 xl:order-1 w-full mt-8 xl:mt-0">
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
                        Дигитални Дневници
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
                  {/* Panel 3: Cloud Archive */}
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

                </div>

                {/* CENTER COLUMN: Login/Register Card */}
                <div className="xl:col-span-1 relative z-20 flex flex-col w-full mx-auto max-w-lg order-1 xl:order-2">

                <div className={`bg-white/[0.03] backdrop-blur-3xl text-white p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden border border-white/10 transition-all duration-500 ${authMode === "register" ? "h-full flex flex-col justify-center" : ""}`}>
                  
                  {/* Decorative gradients */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00ffcc]/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>

                  <div className="relative z-10 space-y-6">
                    {/* Form Tabs Switcher */}
                    <div className="flex bg-black/25 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl gap-1 shadow-inner">
                      <button 
                        type="button"
                        onClick={() => setAuthMode("login")}
                        className={`flex-1 text-center py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer border-0 ${authMode === "login" ? "bg-brand-gold text-brand-green shadow-lg shadow-brand-gold/25" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                      >
                        Вход
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAuthMode("register")}
                        className={`flex-1 text-center py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer border-0 ${authMode === "register" ? "bg-brand-gold text-brand-green shadow-lg shadow-brand-gold/25" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                      >
                        Регистрация
                      </button>
                    </div>

                    {authMode === "login" && (
                      <div className="space-y-5 animate-fade-in text-left">
                        <div className="space-y-1">
                          <h3 className="font-serif text-xl font-bold text-white">Вход в портала</h3>
                          <p className="text-[11px] text-white/70 font-medium">Въведете акаунта си за достъп до Вашите БАБХ дневници и папки.</p>
                        </div>
                        
                        <form onSubmit={handleSignIn} className="space-y-4 font-sans">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Имейл адрес</label>
                            <input 
                              type="email" 
                              required 
                              value={authEmail} 
                              onChange={(e) => setAuthEmail(e.target.value)} 
                              placeholder="name@business.com" 
                              className="w-full text-xs px-3.5 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Парола</label>
                            <input 
                              type="password" 
                              required 
                              value={authPassword} 
                              onChange={(e) => setAuthPassword(e.target.value)} 
                              placeholder="••••••••" 
                              className="w-full text-xs px-3.5 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-gold/20 border-0 hover:scale-[1.01] active:scale-[0.99] duration-150 mt-2"
                          >
                            Влизане в системата
                          </button>
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="w-full text-center text-[11px] text-white/60 hover:text-brand-gold underline underline-offset-4 transition-colors duration-200 cursor-pointer pt-1"
                          >
                            Забравена парола?
                          </button>
                        </form>
                      </div>
                    )}

                    {authMode === "register" && (
                      <div className="space-y-5 animate-fade-in text-left">
                        <div className="space-y-1">
                          <h3 className="font-serif text-xl font-bold text-white">Регистрация (14 дни безплатен тест)</h3>
                          <p className="text-[11px] text-white/70 font-medium">
                            Създайте профил за Вашия обект и получете незабавен 14-дневен пробен достъп до всички дневници и документи.
                          </p>
                        </div>
                        
                        <form onSubmit={handleRegisterAndApply} className="space-y-4 font-sans">
                          {/* Section: Account Info */}
                          <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-3.5 shadow-sm">
                            <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest block pl-0.5 border-b border-white/10 pb-1">1. Данни за Профила</span>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Имейл адрес *</label>
                              <input 
                                type="email" 
                                required 
                                value={regEmail} 
                                onChange={(e) => setRegEmail(e.target.value)} 
                                placeholder="name@business.com" 
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Парола *</label>
                                <input 
                                  type="password" 
                                  required 
                                  value={regPassword} 
                                  onChange={(e) => setRegPassword(e.target.value)} 
                                  placeholder="••••••••" 
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Повторете парола *</label>
                                <input 
                                  type="password" 
                                  required 
                                  value={regConfirmPassword} 
                                  onChange={(e) => setRegConfirmPassword(e.target.value)} 
                                  placeholder="••••••••" 
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Section: Business Activity Info */}
                          <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-3.5 shadow-sm">
                            <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest block pl-0.5 border-b border-white/10 pb-1">2. Данни за Обекта & Кандидатстване</span>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Име на Обект / Фирма *</label>
                              <input 
                                type="text" 
                                required 
                                value={applyFirmName} 
                                onChange={(e) => setApplyFirmName(e.target.value)} 
                                placeholder="напр. Ресторант Витоша" 
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1 col-span-2 sm:col-span-1">
                                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">ЕИК / Булстат</label>
                                <input 
                                  type="text" 
                                  value={applyEik} 
                                  onChange={(e) => setApplyEik(e.target.value)} 
                                  placeholder="207654321" 
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm font-mono"
                                />
                              </div>
                              <div className="space-y-1 col-span-2 sm:col-span-1">
                                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Основен Сектор</label>
                                <select 
                                  value={applySector} 
                                  onChange={(e) => {
                                    const newSector = e.target.value;
                                    setApplySector(newSector);
                                    setApplyNiche(BUSINESS_CATEGORIES[newSector][0]);
                                  }} 
                                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/25 transition-all text-white font-medium cursor-pointer"
                                >
                                  {Object.keys(BUSINESS_CATEGORIES).map(sector => (
                                    <option key={sector} value={sector} className="bg-brand-green text-white">{sector}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1 col-span-2">
                                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Специфичен Обект / Категория</label>
                                <select 
                                  value={applyNiche} 
                                  onChange={(e) => setApplyNiche(e.target.value)} 
                                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/25 transition-all text-white font-medium cursor-pointer"
                                >
                                  {BUSINESS_CATEGORIES[applySector]?.map(niche => (
                                    <option key={niche} value={niche} className="bg-brand-green text-white">{niche}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Лице за контакт *</label>
                                <input 
                                  type="text" 
                                  required 
                                  value={applyContact} 
                                  onChange={(e) => setApplyContact(e.target.value)} 
                                  placeholder="Иван Петров" 
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Телефон *</label>
                                <input 
                                  type="tel" 
                                  required 
                                  value={applyPhone} 
                                  onChange={(e) => setApplyPhone(e.target.value)} 
                                  placeholder="0888123456" 
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm font-mono"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Адрес на обекта *</label>
                              <input
                                type="text"
                                required
                                value={applyAddress}
                                onChange={(e) => setApplyAddress(e.target.value)}
                                placeholder="гр. София, ул. Витоша 12"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 shadow-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-white/70 uppercase tracking-widest block pl-0.5">Опишете дейността си *</label>
                              <textarea
                                required
                                value={applyDesc}
                                onChange={(e) => setApplyDesc(e.target.value)}
                                placeholder="Опишете накратко обекта: брой места, специфично меню (месо, риба, млечни), капацитет, оборудване..."
                                rows={4}
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-black/20 backdrop-blur-md transition-all text-white placeholder-white/30 leading-relaxed resize-none shadow-sm"
                              />
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-gold/20 border-0 hover:scale-[1.01] active:scale-[0.99] duration-150 mt-3"
                          >
                            Тествай за 14 дни безплатно!
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                </div>
              </div>

                {/* RIGHT COLUMN: 2 Animated Panels */}
                <div className="space-y-6 order-3 xl:order-3 w-full mt-6 xl:mt-0">
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

                  {/* Panel 5: Chat */}
                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        Чат с Д-р Данка Николова
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
                       <div className="bg-brand-gold border border-brand-gold/80 p-3 rounded-2xl rounded-tr-sm w-[85%] ml-auto shadow-md">
                         <div className="text-[9px] text-brand-dark font-bold leading-relaxed">Да, проверяват ни температурите в момента. Всичко е в дневниците!</div>
                         <div className="text-[7px] text-brand-dark/70 font-semibold text-right mt-1">10:45 ч.</div>
                       </div>
                    </div>
                  </div>
                </div>
              
            </div>
          </div>
          )}
        </div>
      )}                        {/* 3. LOGGED-IN DASHBOARD */}
      {isLoggedIn && (
        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">

          {/* Subscription PAYMENT banner — clients in awaiting_payment state.
              Shown on every tab so the buyer always sees the call to pay. */}
          {userRole === "user" && (() => {
            const me = usersList.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
            if (me?.subscriptionStatus !== "awaiting_payment") return null;
            const fee = me?.subscriptionFeeEur ?? 0;
            return (
              <div className="mb-6 rounded-2xl border bg-gradient-to-r from-brand-gold/20 to-brand-gold/10 border-brand-gold/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Building className="h-6 w-6 text-brand-gold shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-bold text-brand-green mb-0.5">
                    Заявлението Ви за абонамент е одобрено!
                  </p>
                  <p className="text-xs text-brand-dark/70">
                    За да активирате пълния достъп до портала, моля направете банков превод на стойност <strong className="text-brand-green">{fee.toFixed(2)} €</strong>.
                  </p>
                </div>
                <button
                  onClick={() => { setSubPayOpen(true); }}
                  className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full bg-brand-gold text-brand-dark hover:bg-brand-gold-light transition-colors cursor-pointer whitespace-nowrap shadow-md shadow-brand-gold/20 border-0"
                >
                  Данни за превод
                </button>
              </div>
            );
          })()}

          {/* Subscription expiry warning banner — clients only */}
          {userRole === "user" && (() => {
            const me = usersList.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
            const d = daysUntilExpiry(me?.expiresAt);
            if (d === null || d > 14) return null;
            const isExpired = d < 0;
            return (
              <div className={`mb-6 rounded-2xl border p-4 sm:p-5 flex items-start gap-3 print:hidden ${isExpired ? "bg-red-50 border-red-300 text-red-900" : "bg-amber-50 border-amber-300 text-amber-900"}`}>
                <AlertTriangle className={`h-5 w-5 mt-0.5 shrink-0 ${isExpired ? "text-red-600" : "text-amber-600"}`} />
                <div className="flex-1 text-sm">
                  <p className="font-bold mb-1">
                    {isExpired ? "Абонаментът Ви е изтекъл" : d === 0 ? "Абонаментът Ви изтича днес" : `Абонаментът Ви изтича след ${d} дни`}
                  </p>
                  <p className="text-xs opacity-80">
                    {isExpired
                      ? "Свържете се с д-р Николова, за да възстановите достъпа си до системата."
                      : `Дата на изтичане: ${me?.expiresAt}. Свържете се с д-р Николова, за да поднови абонамента си.`}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg bg-brand-gold text-brand-dark hover:bg-brand-gold-light transition-colors cursor-pointer whitespace-nowrap"
                >
                  Свържи се
                </Link>
              </div>
            );
          })()}

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar Menu - Hidden on print */}
            <aside className="lg:col-span-3 bg-white/90 backdrop-blur-sm border border-brand-green/10 rounded-3xl p-6 shadow-xl space-y-6 print:hidden">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-brand-green/5">
                  <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-sm">
                    {userRole === "admin" ? "A" : firmInfo.name?.substring(0, 1) || "K"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-dark truncate max-w-[150px]">
                      {userRole === "admin" ? "д-р Данка Николова" : firmInfo.name || "Клиент"}
                    </h4>
                    <span className="text-[9px] font-black uppercase text-brand-gold tracking-wider">
                      {userRole === "admin" ? "Администратор" : "БАБХ Обект"}
                    </span>
                  </div>
                </div>
                
                <span className="text-[9px] font-black uppercase text-brand-dark/45 tracking-[0.15em] block pt-2 pl-1">
                  Навигация
                </span>
                <nav className="flex flex-col gap-1.5 font-sans">
                  {userRole === "admin" ? (
                    <>
                      <button 
                        onClick={() => setActiveAdminTab("candidates")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left border-0 w-full ${activeAdminTab === "candidates" ? "bg-brand-green text-white border-l-4 border-brand-gold rounded-l-none pl-5 shadow-md shadow-brand-green/15" : "bg-transparent text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/5 hover:pl-5 duration-300"}`}
                      >
                        <Clock className={`h-4 w-4 ${activeAdminTab === "candidates" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                        Кандидати
                      </button>
                      <button 
                        onClick={() => setActiveAdminTab("users")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left border-0 w-full ${activeAdminTab === "users" ? "bg-brand-green text-white border-l-4 border-brand-gold rounded-l-none pl-5 shadow-md shadow-brand-green/15" : "bg-transparent text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/5 hover:pl-5 duration-300"}`}
                      >
                        <Users className={`h-4 w-4 ${activeAdminTab === "users" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                        Потребители
                      </button>
                      <button
                        onClick={() => setActiveAdminTab("materials")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left border-0 w-full ${activeAdminTab === "materials" ? "bg-brand-green text-white border-l-4 border-brand-gold rounded-l-none pl-5 shadow-md shadow-brand-green/15" : "bg-transparent text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/5 hover:pl-5 duration-300"}`}
                      >
                        <FileCheck className={`h-4 w-4 ${activeAdminTab === "materials" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                        Материали & Тестове
                      </button>
                      <button
                        onClick={() => setActiveAdminTab("courses")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left border-0 w-full ${activeAdminTab === "courses" ? "bg-brand-green text-white border-l-4 border-brand-gold rounded-l-none pl-5 shadow-md shadow-brand-green/15" : "bg-transparent text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/5 hover:pl-5 duration-300"}`}
                      >
                        <BookOpen className={`h-4 w-4 ${activeAdminTab === "courses" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                        Курсове (Книжарница)
                      </button>
                      <button
                        onClick={() => setActiveAdminTab("trainings")}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left border-0 w-full ${activeAdminTab === "trainings" ? "bg-brand-green text-white border-l-4 border-brand-gold rounded-l-none pl-5 shadow-md shadow-brand-green/15" : "bg-transparent text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/5 hover:pl-5 duration-300"}`}
                      >
                        <Video className={`h-4 w-4 ${activeAdminTab === "trainings" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                        Обучения & Записани
                        {allEnrollments.filter(e => e.status === "paid").length > 0 && (
                          <span className="absolute right-3 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black leading-none shadow-sm animate-pulse">
                            {allEnrollments.filter(e => e.status === "paid").length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveAdminTab("messages")}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left border-0 w-full ${activeAdminTab === "messages" ? "bg-brand-green text-white border-l-4 border-brand-gold rounded-l-none pl-5 shadow-md shadow-brand-green/15" : "bg-transparent text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/5 hover:pl-5 duration-300"}`}
                      >
                        <MessageSquare className={`h-4 w-4 ${activeAdminTab === "messages" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                        Чат с Клиенти
                        {hasUnreadAdminMessages && (
                          <span className="absolute right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm"></span>
                        )}
                      </button>
                      <button 
                        onClick={() => setActiveAdminTab("logs")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left border-0 w-full ${activeAdminTab === "logs" ? "bg-brand-green text-white border-l-4 border-brand-gold rounded-l-none pl-5 shadow-md shadow-brand-green/15" : "bg-transparent text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/5 hover:pl-5 duration-300"}`}
                      >
                        <Search className={`h-4 w-4 ${activeAdminTab === "logs" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                        Одит на Дневници
                      </button>
                    </>
                  ) : (() => {
                    const me = usersList.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
                    const subStatus = me?.subscriptionStatus ?? "approved"; // legacy default
                    const hasTrial = me?.status === "approved" && subStatus === "trial" && trialDaysLeft(me?.trialStartedAt) >= 0;
                    const hasSub = me?.status === "approved" && subStatus === "approved" && (me?.expiresAt ? (daysUntilExpiry(me.expiresAt) ?? 0) >= 0 : true);
                    const isSubscribed = hasSub || hasTrial;
                    const pendingCount = (me?.assignedDocs || []).filter(d => d.status === "pending").length;

                    const lockedClick = () => {
                      setActiveTab("packages");
                    };
                    const lockedStyle = "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-not-allowed text-left border-0 w-full bg-transparent text-brand-dark/35 hover:bg-brand-dark/5";
                    const activeStyle = (active: boolean) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left border-0 w-full ${active ? "bg-brand-green text-white border-l-4 border-brand-gold rounded-l-none pl-5 shadow-md shadow-brand-green/15" : "bg-transparent text-brand-dark/70 hover:text-brand-green hover:bg-brand-green/5 hover:pl-5 duration-300"}`;

                    const LockBadge = () => <Lock className="h-3 w-3 text-brand-dark/30 ml-auto" />;

                    return (
                      <>
                        {/* Premium tab: БАБХ Дневници */}
                        {isSubscribed ? (
                          <button onClick={() => setActiveTab("logs")} className={activeStyle(activeTab === "logs")}>
                            <Calendar className={`h-4 w-4 ${activeTab === "logs" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                            БАБХ Дневници
                          </button>
                        ) : (
                          <button onClick={lockedClick} className={lockedStyle} title="Изисква абонамент">
                            <Calendar className="h-4 w-4" />
                            <span className="flex-1">БАБХ Дневници</span>
                            <LockBadge />
                          </button>
                        )}

                        {/* Premium tab: НАССР Документи */}
                        {isSubscribed ? (
                          <button onClick={() => setActiveTab("haccp")} className={activeStyle(activeTab === "haccp")}>
                            <FileText className={`h-4 w-4 ${activeTab === "haccp" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                            НАССР Документи
                          </button>
                        ) : (
                          <button onClick={lockedClick} className={lockedStyle} title="Изисква абонамент">
                            <FileText className="h-4 w-4" />
                            <span className="flex-1">НАССР Документи</span>
                            <LockBadge />
                          </button>
                        )}

                        {/* Premium tab: Документи & Тестове */}
                        {isSubscribed ? (
                          <button onClick={() => setActiveTab("assigned")} className={activeStyle(activeTab === "assigned")}>
                            <span className="relative inline-flex">
                              <FileCheck className={`h-4 w-4 ${activeTab === "assigned" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                              {pendingCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black leading-none border border-white shadow-sm animate-pulse">
                                  {pendingCount > 9 ? "9+" : pendingCount}
                                </span>
                              )}
                            </span>
                            <span className="flex-1">Документи &amp; Тестове</span>
                            {pendingCount > 0 && (
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === "assigned" ? "bg-brand-gold text-brand-dark" : "bg-red-100 text-red-700"}`}>
                                {pendingCount} ново{pendingCount === 1 ? "" : "/и"}
                              </span>
                            )}
                          </button>
                        ) : (
                          <button onClick={lockedClick} className={lockedStyle} title="Изисква абонамент">
                            <FileCheck className="h-4 w-4" />
                            <span className="flex-1">Документи &amp; Тестове</span>
                            <LockBadge />
                          </button>
                        )}

                        {/* ALWAYS OPEN: Моите курсове (paid content) */}
                        <button onClick={() => setActiveTab("courses")} className={activeStyle(activeTab === "courses")}>
                          <BookOpen className={`h-4 w-4 ${activeTab === "courses" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                          Моите Обучения
                        </button>

                        {/* ALWAYS OPEN: Абонаментни Пакети */}
                        <button onClick={() => setActiveTab("packages")} className={activeStyle(activeTab === "packages")}>
                          <Building className={`h-4 w-4 ${activeTab === "packages" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                          Абонаментни Пакети
                        </button>

                        {/* Premium tab: Чат */}
                        {isSubscribed ? (
                          <button onClick={handleOpenUserChat} className={`relative ${activeStyle(activeTab === "chat")}`}>
                            <MessageSquare className={`h-4 w-4 ${activeTab === "chat" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                            Чат с Администратор
                            {hasUnreadUserMessages && (
                              <span className="absolute right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm"></span>
                            )}
                          </button>
                        ) : (
                          <button onClick={lockedClick} className={lockedStyle} title="Изисква абонамент">
                            <MessageSquare className="h-4 w-4" />
                            <span className="flex-1">Чат с Администратор</span>
                            <LockBadge />
                          </button>
                        )}

                        {/* Premium tab: Инструменти */}
                        {isSubscribed ? (
                          <button onClick={() => setActiveTab("tools")} className={activeStyle(activeTab === "tools")}>
                            <Activity className={`h-4 w-4 ${activeTab === "tools" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                            Инструменти
                          </button>
                        ) : (
                          <button onClick={lockedClick} className={lockedStyle} title="Изисква абонамент">
                            <Activity className="h-4 w-4" />
                            <span className="flex-1">Инструменти</span>
                            <LockBadge />
                          </button>
                        )}

                        {/* Premium tab: Фирма и Профил */}
                        {isSubscribed ? (
                          <button onClick={() => setActiveTab("settings")} className={activeStyle(activeTab === "settings")}>
                            <Settings className={`h-4 w-4 ${activeTab === "settings" ? "text-brand-gold" : "text-brand-dark/50"}`} />
                            Фирма и Профил
                          </button>
                        ) : (
                          <button onClick={lockedClick} className={lockedStyle} title="Изисква абонамент">
                            <Settings className="h-4 w-4" />
                            <span className="flex-1">Фирма и Профил</span>
                            <LockBadge />
                          </button>
                        )}
                      </>
                    );
                  })()}
                </nav>
              </div>

              <div className="border-t border-brand-green/5 pt-4">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase text-red-600 hover:bg-red-50 hover:pl-5 duration-300 transition-all w-full cursor-pointer border-0 bg-transparent text-left font-sans"
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
                    // Include both legacy 'pending' status applicants AND bookstore
                    // buyers who later applied for subscription (subscriptionStatus = "pending").
                    const pendingCandidates = usersList.filter(u =>
                      u.role === "user" && (
                        u.status === "pending" ||
                        u.subscriptionStatus === "pending"
                      )
                    );
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

                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
                            {/* CSV Export */}
                            <button
                              type="button"
                              onClick={handleExportClientsCsv}
                              className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                              title="Изтегли CSV с всички клиенти"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Експорт CSV
                            </button>
                          </div>
                        </div>

                        {/* Broadcast bar */}
                        <div className="bg-brand-gold/5 border border-brand-gold/30 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-brand-green uppercase tracking-wider whitespace-nowrap">
                            <Send className="h-3.5 w-3.5 text-brand-gold" />
                            Изпрати до всички:
                          </div>
                          <input
                            type="text"
                            value={broadcastText}
                            onChange={(e) => setBroadcastText(e.target.value)}
                            placeholder="напр. Напомняне: проверете дневниците си преди петък"
                            className="flex-1 text-xs px-3 py-2 rounded-lg border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleBroadcastMessage}
                            disabled={!broadcastText.trim()}
                            className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Изпрати
                          </button>
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
                                  <th className="border border-brand-green/10 p-3 text-center">Изтича на</th>
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
                                      {u.subscriptionStatus === "awaiting_payment" ? (
                                        <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                                          Чака плащане ({u.subscriptionFeeEur} €)
                                        </span>
                                      ) : u.subscriptionStatus === "trial" ? (() => {
                                        const d = trialDaysLeft(u.trialStartedAt);
                                        return d >= 0 ? (
                                          <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 animate-pulse">
                                            Тест период ({d} дни)
                                          </span>
                                        ) : (
                                          <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                                            Изтекъл тест
                                          </span>
                                        );
                                      })() : (
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${u.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                          {u.status === "approved" ? "Активен" : "Изтекъл"}
                                        </span>
                                      )}
                                    </td>
                                    <td className="border border-brand-green/10 p-3 text-center">
                                      {(() => {
                                        const d = daysUntilExpiry(u.expiresAt);
                                        const colour =
                                          d === null ? "text-brand-dark/40" :
                                          d < 0 ? "text-red-600 font-bold" :
                                          d <= 14 ? "text-amber-600 font-bold" :
                                          "text-brand-dark/70";
                                        return (
                                          <div className="flex flex-col items-center gap-1">
                                            <input
                                              type="date"
                                              value={u.expiresAt || ""}
                                              onChange={(e) => handleSetExpiresAt(u.email, e.target.value)}
                                              className="text-[10px] font-mono px-2 py-1 rounded border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white cursor-pointer"
                                            />
                                            <span className={`text-[9px] ${colour}`}>
                                              {d === null ? "— не е зададено —" :
                                               d < 0 ? `Изтекъл преди ${-d} дни` :
                                               d === 0 ? "Изтича днес" :
                                               `След ${d} дни`}
                                            </span>
                                          </div>
                                        );
                                      })()}
                                    </td>
                                    <td className="border border-brand-green/10 p-3 text-center">
                                      {u.subscriptionStatus === "awaiting_payment" ? (
                                        <button
                                          onClick={() => handleConfirmSubscriptionPayment(u.email)}
                                          className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer border bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 flex items-center justify-center gap-1 mx-auto"
                                        >
                                          <Check className="h-3 w-3" /> Потвърди плащането
                                        </button>
                                      ) : u.subscriptionStatus === "trial" ? (
                                        <div className="flex flex-col gap-1.5 items-center justify-center">
                                          <button
                                            onClick={() => handleApproveCandidate(u.email)}
                                            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer border bg-green-50 text-green-600 border-green-200 hover:bg-green-100 flex items-center gap-1"
                                          >
                                            <Check className="h-3 w-3" /> Активирай
                                          </button>
                                          <button
                                            onClick={() => handleToggleUserStatus(u.email, u.status)}
                                            className="px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wide transition-colors cursor-pointer border bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                                          >
                                            Спри достъп
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => handleToggleUserStatus(u.email, u.status)}
                                          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer border ${u.status === "approved" ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"}`}
                                        >
                                          {u.status === "approved" ? "Спри абонамент" : "Активирай абонамент"}
                                        </button>
                                      )}
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

                                <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Прикачен файл (незадължително):</label>
                                  <div className="flex flex-wrap items-center gap-3">
                                    <label className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-brand-green/20 hover:border-brand-gold rounded-lg cursor-pointer transition-all shadow-sm text-xs font-bold text-brand-green ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                      <Paperclip className="h-4 w-4 text-brand-gold" />
                                      {assignedFile ? "Избери друг файл" : "Избери файл"}
                                      <input 
                                        type="file" 
                                        disabled={isUploading}
                                        onChange={(e) => setAssignedFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                      />
                                    </label>
                                    {assignedFile && (
                                      <div className="flex items-center gap-2 bg-brand-light px-3 py-1.5 rounded-lg border border-brand-green/5 text-xs text-brand-dark">
                                        <span className="font-medium truncate max-w-[200px]">{assignedFile.name}</span>
                                        <button 
                                          type="button" 
                                          disabled={isUploading}
                                          onClick={() => setAssignedFile(null)}
                                          className="text-red-500 hover:text-red-700 p-0.5 rounded-full hover:bg-red-50 transition-colors border-0 bg-transparent cursor-pointer disabled:opacity-50"
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-brand-dark/40 font-medium">Поддържат се всякакви документи/изображения до 200MB.</p>
                                  
                                  {isUploading && uploadProgress !== null && (
                                    <div className="space-y-1.5 font-sans">
                                      <div className="flex justify-between text-[10px] font-bold text-brand-green">
                                        <span>Качване на файл...</span>
                                        <span>{Math.round(uploadProgress)}%</span>
                                      </div>
                                      <div className="w-full bg-brand-green/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-brand-gold h-full rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <button 
                                  type="submit"
                                  disabled={isUploading}
                                  className="w-full bg-brand-green hover:bg-brand-green/90 disabled:bg-brand-green/60 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
                                >
                                  {isUploading ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin text-brand-gold" />
                                      Изпращане на документа...
                                    </>
                                  ) : (
                                    "Изпрати документа"
                                  )}
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

                  {/* ADMIN TAB 3.5: COURSES (DIGITAL BOOKSTORE) */}
                  {activeAdminTab === "courses" && (
                    <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fade-in">
                      <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                        <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="font-serif text-xl font-bold text-brand-green">Курсове / Дигитална Книжарница</h2>
                          <p className="text-xs text-brand-dark/50">Качете PDF, задайте цена, контролирайте кой клиент има достъп</p>
                        </div>
                      </div>

                      {/* Read-only notice — catalog is now curated in code */}
                      <div className="bg-brand-light/30 p-4 rounded-xl border border-brand-green/10 flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                        <div className="text-xs text-brand-dark/70 leading-relaxed">
                          <p className="font-bold text-brand-green mb-1">Каталогът се поддържа в кода</p>
                          <p>Готовите обучения вече се добавят само от разработчика, за да изглежда всеки курс със свой уникален дизайн. Тук виждате статистика — кои клиенти са купили кои материали.</p>
                        </div>
                      </div>

                      {/* Manual grant access */}
                      <div className="bg-brand-gold/5 border border-brand-gold/25 rounded-xl p-4 space-y-2">
                        <h3 className="font-bold text-brand-green text-sm uppercase tracking-wider flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-brand-gold" />
                          Ръчно предоставяне на достъп
                        </h3>
                        <p className="text-[11px] text-brand-dark/60">За случаи когато клиентът е платил извън сайта (банков превод, кеш). Клиентът трябва вече да има акаунт.</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input type="email" placeholder="email на клиента" value={courseGrantEmail} onChange={(e) => setCourseGrantEmail(e.target.value)} className="flex-1 text-xs px-3 py-2 rounded-lg border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" />
                          <select value={courseGrantTargetId} onChange={(e) => setCourseGrantTargetId(e.target.value)} className="text-xs px-3 py-2 rounded-lg border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white cursor-pointer">
                            <option value="">— избери курс —</option>
                            {allCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                          </select>
                          <button type="button" onClick={handleGrantCourse} className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-brand-gold text-brand-dark hover:bg-brand-gold-light transition-colors cursor-pointer whitespace-nowrap">
                            Предостави
                          </button>
                        </div>
                      </div>

                      {/* Course list */}
                      <div className="space-y-2">
                        <h3 className="font-bold text-brand-green text-sm uppercase tracking-wider">Качени курсове ({allCourses.length})</h3>
                        {allCourses.length === 0 ? (
                          <p className="text-xs text-brand-dark/50 italic py-4 text-center">Все още няма качени курсове.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse border border-brand-green/10">
                              <thead>
                                <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                                  <th className="border border-brand-green/10 p-3 text-left">Курс</th>
                                  <th className="border border-brand-green/10 p-3 text-center">Тип / Размер</th>
                                  <th className="border border-brand-green/10 p-3 text-center">Цена</th>
                                  <th className="border border-brand-green/10 p-3 text-center">Купувачи</th>
                                  <th className="border border-brand-green/10 p-3 text-center">Статус</th>
                                  <th className="border border-brand-green/10 p-3 text-center">PDF файл</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allCourses.map(c => {
                                  const buyers = usersList.filter(u => (u.purchasedCourseIds || []).includes(c.id));
                                  const isExpanded = expandedCourseBuyers === c.id;
                                  return (
                                    <Fragment key={c.id}>
                                    <tr className="hover:bg-brand-light/30">
                                      <td className="border border-brand-green/10 p-3">
                                        <div className="font-bold text-brand-green">{c.title}</div>
                                        <div className="text-[10px] text-brand-dark/50">{c.description}</div>
                                      </td>
                                      <td className="border border-brand-green/10 p-3 text-center text-[10px]">
                                        {(c.type ?? "pdf") === "link" ? (
                                          <a href={c.externalUrl} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline inline-flex items-center gap-1 font-bold">
                                            <ExternalLink className="h-3 w-3" />
                                            Линк
                                          </a>
                                        ) : (
                                          <span className="font-mono">{c.fileSizeMb ?? 0} MB</span>
                                        )}
                                      </td>
                                      <td className="border border-brand-green/10 p-3 text-center">
                                        {(() => {
                                          const live = resolvePrice(c.slug || c.id, priceOverrides, c.priceEur);
                                          const draftVal = priceDraft[c.slug || c.id];
                                          const editing = draftVal !== undefined;
                                          const overridden = priceOverrides[c.slug || c.id] !== undefined;
                                          return (
                                            <div className="flex flex-col items-center gap-1">
                                              <div className="flex items-center gap-1">
                                                <input
                                                  type="number"
                                                  step="0.01"
                                                  min="0"
                                                  value={editing ? draftVal : live.toFixed(2)}
                                                  onChange={(e) => setPriceDraft(p => ({ ...p, [c.slug || c.id]: e.target.value }))}
                                                  className="w-20 text-xs font-mono font-bold text-center px-2 py-1 rounded border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white"
                                                />
                                                <span className="text-xs font-bold text-brand-dark/50">€</span>
                                              </div>
                                              {editing ? (
                                                <button onClick={() => handleSavePrice(c.slug || c.id)} className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-gold text-brand-dark hover:bg-brand-gold-light cursor-pointer">
                                                  Запиши
                                                </button>
                                              ) : overridden ? (
                                                <button onClick={() => handleResetPrice(c.slug || c.id)} className="text-[8px] font-bold uppercase text-brand-dark/40 hover:text-red-600 cursor-pointer">
                                                  върни default
                                                </button>
                                              ) : (
                                                <span className="text-[8px] text-brand-dark/30">default</span>
                                              )}
                                            </div>
                                          );
                                        })()}
                                      </td>
                                      <td className="border border-brand-green/10 p-3 text-center">
                                        {buyers.length > 0 ? (
                                          <button
                                            onClick={() => setExpandedCourseBuyers(isExpanded ? null : c.id)}
                                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                                          >
                                            {buyers.length}
                                            <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                                          </button>
                                        ) : (
                                          <span className="text-[10px] text-brand-dark/40">0</span>
                                        )}
                                      </td>
                                      <td className="border border-brand-green/10 p-3 text-center">
                                        <span className={`inline-block px-2 py-1 rounded-full text-[9px] font-bold uppercase ${c.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                                          {c.published ? "Активен" : "Скрит"}
                                        </span>
                                      </td>
                                      <td className="border border-brand-green/10 p-3 text-center">
                                        {c.type === "link" ? (
                                          <span className="text-[10px] text-brand-dark/45 font-medium italic">
                                            Не се изисква (Видео)
                                          </span>
                                        ) : (() => {
                                          const progress = libraryUploadProgress[c.slug || c.id];
                                          if (progress !== null && progress !== undefined) {
                                            return (
                                              <div className="space-y-1">
                                                <div className="w-full bg-brand-green/10 rounded-full h-1.5 overflow-hidden">
                                                  <div className="h-full bg-brand-gold transition-all" style={{ width: `${progress}%` }} />
                                                </div>
                                                <span className="text-[9px] text-brand-dark/60">{progress}%</span>
                                              </div>
                                            );
                                          }
                                          const exists = libraryPdfExists[c.slug || c.id];
                                          return (
                                            <div className="flex flex-col items-center gap-1.5 justify-center">
                                              {exists ? (
                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                                  <Check className="h-3 w-3" /> Качен
                                                </span>
                                              ) : (
                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                  <AlertTriangle className="h-3 w-3" /> Липсва
                                                </span>
                                              )}
                                              <label className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 rounded border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors cursor-pointer">
                                                <Upload className="h-3 w-3" />
                                                {exists ? "Прекачи" : "Качи PDF"}
                                                <input
                                                  type="file"
                                                  accept="application/pdf"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const f = e.target.files?.[0];
                                                    if (f) handleUploadLibraryPdf(c.slug || c.id, f);
                                                    e.target.value = ""; // reset so the same file can be re-uploaded
                                                  }}
                                                />
                                              </label>
                                            </div>
                                          );
                                        })()}
                                      </td>
                                    </tr>
                                    {isExpanded && buyers.length > 0 && (
                                      <tr>
                                        <td colSpan={6} className="border border-brand-green/10 p-3 bg-brand-light/50">
                                          <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-brand-green">Купувачи ({buyers.length})</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                              {buyers.map(b => (
                                                <div key={b.email} className="bg-white border border-brand-green/10 rounded-lg p-2.5 text-[11px] flex items-start gap-2">
                                                  <Users className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" />
                                                  <div className="flex-1 min-w-0">
                                                    <a href={`mailto:${b.email}`} className="font-mono text-brand-green hover:text-brand-gold block truncate">{b.email}</a>
                                                    {b.firmName && <div className="text-brand-dark/60 truncate">{b.firmName}</div>}
                                                    {b.contact && <div className="text-brand-dark/50">{b.contact}</div>}
                                                    {b.phone && <a href={`tel:${b.phone}`} className="font-mono text-brand-dark/70 hover:text-brand-gold">{b.phone}</a>}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                    </Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB: TRAININGS & ENROLLMENTS */}
                  {activeAdminTab === "trainings" && (
                    <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fade-in">
                      <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                        <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                          <Video className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="font-serif text-xl font-bold text-brand-green">Обучения & Записани</h2>
                          <p className="text-xs text-brand-dark/50">Управление на специализирани онлайн курсове и преглед на записани участници</p>
                        </div>
                      </div>

                      {/* Sub-tabs */}
                      <div className="flex gap-1 border-b border-brand-green/5">
                        <button
                          onClick={() => setTrainingsViewMode("manage")}
                          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${trainingsViewMode === "manage" ? "border-brand-gold text-brand-green" : "border-transparent text-brand-dark/50 hover:text-brand-green"}`}
                        >
                          Управление на курсове ({allTrainings.length})
                        </button>
                        <button
                          onClick={() => setTrainingsViewMode("enrollments")}
                          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${trainingsViewMode === "enrollments" ? "border-brand-gold text-brand-green" : "border-transparent text-brand-dark/50 hover:text-brand-green"}`}
                        >
                          Записани ({allEnrollments.length})
                        </button>
                      </div>

                      {trainingsViewMode === "manage" && (
                        <>
                          {/* Read-only notice — live courses curated in code */}
                          <div className="bg-brand-light/30 p-4 rounded-xl border border-brand-green/10 flex items-start gap-3">
                            <Video className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                            <div className="text-xs text-brand-dark/70 leading-relaxed">
                              <p className="font-bold text-brand-green mb-1">Live курсовете се поддържат в кода</p>
                              <p>Всеки курс има свой уникален дизайн и страница. Тук виждате статистика — кои клиенти са записани за кои live сесии.</p>
                            </div>
                          </div>

                          {/* Training list */}
                          <div className="space-y-2">
                            <h3 className="font-bold text-brand-green text-sm uppercase tracking-wider">Качени курсове ({allTrainings.length})</h3>
                            {allTrainings.length === 0 ? (
                              <p className="text-xs text-brand-dark/50 italic py-4 text-center">Все още няма добавени онлайн обучения.</p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse border border-brand-green/10">
                                  <thead>
                                    <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                                      <th className="border border-brand-green/10 p-3 text-left">Курс</th>
                                      <th className="border border-brand-green/10 p-3 text-center">Тип</th>
                                      <th className="border border-brand-green/10 p-3 text-center">Цена</th>
                                      <th className="border border-brand-green/10 p-3 text-center">Записани</th>
                                      <th className="border border-brand-green/10 p-3 text-center">Статус</th>
                                      <th className="border border-brand-green/10 p-3 text-center">Действия</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allTrainings.map((t) => {
                                      const enrolledCount = allEnrollments.filter(e => e.trainingId === t.id).length;
                                      return (
                                        <tr key={t.id} className="hover:bg-brand-light/30">
                                          <td className="border border-brand-green/10 p-3">
                                            <div className="font-bold text-brand-green">{t.title}</div>
                                            <div className="text-[10px] text-brand-dark/50">{t.shortDesc}</div>
                                            {t.type === "video" && t.videoUrl && (
                                              <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-brand-gold hover:underline mt-1">
                                                <ExternalLink className="h-3 w-3" />
                                                Виж видеото
                                              </a>
                                            )}
                                          </td>
                                          <td className="border border-brand-green/10 p-3 text-center text-[10px]">
                                            {t.type === "video" ? "📹 Видео" : "📞 Zoom"}
                                          </td>
                                          <td className="border border-brand-green/10 p-3 text-center">
                                            {(() => {
                                              const live = resolvePrice(t.slug || t.id, priceOverrides, t.priceEur);
                                              const draftVal = priceDraft[t.slug || t.id];
                                              const editing = draftVal !== undefined;
                                              const overridden = priceOverrides[t.slug || t.id] !== undefined;
                                              return (
                                                <div className="flex flex-col items-center gap-1">
                                                  <div className="flex items-center gap-1">
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      min="0"
                                                      value={editing ? draftVal : live.toFixed(2)}
                                                      onChange={(e) => setPriceDraft(p => ({ ...p, [t.slug || t.id]: e.target.value }))}
                                                      className="w-20 text-xs font-mono font-bold text-center px-2 py-1 rounded border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white"
                                                    />
                                                    <span className="text-xs font-bold text-brand-dark/50">€</span>
                                                  </div>
                                                  {editing ? (
                                                    <button onClick={() => handleSavePrice(t.slug || t.id)} className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-gold text-brand-dark hover:bg-brand-gold-light cursor-pointer">
                                                      Запиши
                                                    </button>
                                                  ) : overridden ? (
                                                    <button onClick={() => handleResetPrice(t.slug || t.id)} className="text-[8px] font-bold uppercase text-brand-dark/40 hover:text-red-600 cursor-pointer">
                                                      върни default
                                                    </button>
                                                  ) : (
                                                    <span className="text-[8px] text-brand-dark/30">default</span>
                                                  )}
                                                </div>
                                              );
                                            })()}
                                          </td>
                                          <td className="border border-brand-green/10 p-3 text-center font-mono">{enrolledCount}</td>
                                          <td className="border border-brand-green/10 p-3 text-center">
                                            <span className={`inline-block px-2 py-1 rounded-full text-[9px] font-bold uppercase ${t.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                                              {t.published ? "Активен" : "Скрит"}
                                            </span>
                                          </td>
                                          <td className="border border-brand-green/10 p-3 text-center space-x-1">
                                            <button onClick={() => handleToggleTrainingPublished(t)} className="text-[9px] font-bold uppercase px-2 py-1 rounded border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white transition-colors cursor-pointer">
                                              {t.published ? "Скрий" : "Покажи"}
                                            </button>
                                            <button onClick={() => handleDeleteTraining(t)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer" title="Изтрий">
                                              <Trash2 className="h-3.5 w-3.5 inline" />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {trainingsViewMode === "enrollments" && (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="relative flex-1 font-sans">
                              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/40" />
                              <input
                                type="text"
                                value={enrollmentSearchQuery}
                                onChange={(e) => setEnrollmentSearchQuery(e.target.value)}
                                placeholder="Търси по име, email, телефон, курс…"
                                className="w-full text-xs pl-10 pr-4 py-2 rounded-lg border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-brand-light/40"
                              />
                            </div>
                          </div>

                          {(() => {
                            const q = enrollmentSearchQuery.toLowerCase();
                            const filtered = allEnrollments.filter(e =>
                              !q ||
                              e.fullName.toLowerCase().includes(q) ||
                              e.email.toLowerCase().includes(q) ||
                              e.phone.toLowerCase().includes(q) ||
                              e.trainingTitle.toLowerCase().includes(q) ||
                              (e.company || "").toLowerCase().includes(q)
                            );
                            if (filtered.length === 0) {
                              return <p className="text-xs text-brand-dark/50 italic py-8 text-center">Няма записани участници по този критерий.</p>;
                            }
                            return (
                              <div className="overflow-x-auto font-sans">
                                <table className="w-full text-xs border-collapse border border-brand-green/10">
                                  <thead>
                                    <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                                      <th className="border border-brand-green/10 p-3 text-left">Участник</th>
                                      <th className="border border-brand-green/10 p-3 text-left">Контакти</th>
                                      <th className="border border-brand-green/10 p-3 text-left">Курс</th>
                                      <th className="border border-brand-green/10 p-3 text-center">Цена</th>
                                      <th className="border border-brand-green/10 p-3 text-center">Статус</th>
                                      <th className="border border-brand-green/10 p-3 text-center">Действия</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filtered.map((enr) => (
                                      <tr key={enr.id} className="hover:bg-brand-light/30">
                                        <td className="border border-brand-green/10 p-3">
                                          <div className="font-bold text-brand-green">{enr.fullName}</div>
                                          {enr.company && <div className="text-[10px] text-brand-dark/50">{enr.company}</div>}
                                          <div className="text-[9px] text-brand-dark/40 font-mono mt-0.5">{new Date(enr.createdAt).toLocaleString("bg-BG")}</div>
                                        </td>
                                        <td className="border border-brand-green/10 p-3">
                                          <a href={`mailto:${enr.email}`} className="text-brand-green hover:text-brand-gold font-mono block">{enr.email}</a>
                                          <a href={`tel:${enr.phone}`} className="text-brand-dark/70 font-mono block mt-0.5">{enr.phone}</a>
                                        </td>
                                        <td className="border border-brand-green/10 p-3">
                                          <div className="font-bold">{enr.trainingTitle}</div>
                                          <div className="text-[10px] text-brand-dark/50">
                                            {enr.trainingType === "video" ? "📹 Видео" : enr.trainingType === "zoom" ? "📞 Zoom" : ""}
                                          </div>
                                        </td>
                                        <td className="border border-brand-green/10 p-3 text-center font-mono font-bold">{enr.priceEur.toFixed(2)} €</td>
                                        <td className="border border-brand-green/10 p-3 text-center">
                                          <span className={`inline-block px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                                            enr.status === "paid" ? "bg-amber-100 text-amber-800" :
                                            enr.status === "contacted" ? "bg-blue-100 text-blue-800" :
                                            enr.status === "completed" ? "bg-green-100 text-green-800" :
                                            "bg-gray-100 text-gray-800"
                                          }`}>
                                            {enr.status === "paid" ? "Платено" : enr.status === "contacted" ? "Свързан" : enr.status === "completed" ? "Завършил" : enr.status}
                                          </span>
                                        </td>
                                        <td className="border border-brand-green/10 p-3 text-center">
                                          {enr.status === "paid" ? (
                                            <button onClick={() => handleMarkEnrollmentContacted(enr)} className="text-[9px] font-bold uppercase px-2 py-1 rounded border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white transition-colors cursor-pointer">
                                              Маркирай свързан
                                            </button>
                                          ) : (
                                            <span className="text-[9px] text-brand-dark/40">—</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  )}

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
                                    onClick={() => handleOpenAdminUserChat(user.email)}
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

                  {/* ADMIN TAB 5: REGISTERS AUDIT */}
                  {activeAdminTab === "logs" && (() => {
                    const auditClients = usersList.filter(u => u.role === "user" && u.status === "approved");
                    const auditTarget = auditClients.find(u => u.email.toLowerCase() === auditUserEmail.toLowerCase());
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
                              <p className="text-xs text-brand-dark/50">Преглед на дневниците по самоконтрол на одобрените обекти — по месец, с печат на всичко попълнено</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-bold text-brand-dark/70 uppercase">Обект:</label>
                            <select
                              value={auditUserEmail}
                              onChange={(e) => setAuditUserEmail(e.target.value)}
                              className="text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-brand-light font-medium text-brand-dark"
                            >
                              <option value="">-- Изберете обект --</option>
                              {auditClients.map((user) => (
                                <option key={user.email} value={user.email}>
                                  {user.firmName} ({user.email})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {!auditTarget ? (
                          <div className="text-center py-12 text-xs text-brand-dark/50 italic border border-dashed border-brand-green/10 rounded-xl">
                            Моля, изберете клиентски обект от падащото меню горе, за да прегледате дневниците му по самоконтрол.
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <AdminReminderComposer
                              key={`composer-${auditTarget.email}`}
                              email={auditTarget.email}
                              firmName={auditTarget.firmName}
                            />
                            <RegistersTab
                              key={auditTarget.email}
                              email={auditTarget.email}
                              firm={{ name: auditTarget.firmName, eik: auditTarget.eik, address: auditTarget.address, manager: auditTarget.manager || auditTarget.contact }}
                              fridges={auditTarget.customFridges ?? []}
                              freezers={auditTarget.customFreezers ?? []}
                              employees={auditTarget.customEmployees ?? []}
                              meat={isMeatShopNiche(auditTarget.niche)}
                              hotPoint={auditTarget.hasHotPoint ?? defaultHotPointForSector(getSectorForNiche(auditTarget.niche))}
                              hotAppliances={auditTarget.hotAppliances ?? []}
                              signature={auditTarget.signature}
                              signatureMode={auditTarget.signatureMode ?? "manual"}
                              readOnly
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                <>
                  {(() => {
                    const currentUser = usersList.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
                    const status = currentUser?.status ?? "pending";
                    const subStatus = currentUser?.subscriptionStatus ?? "approved"; // legacy default = approved
                    const hasTrial = status === "approved" && subStatus === "trial" && trialDaysLeft(currentUser?.trialStartedAt) >= 0;
                    const hasSub = status === "approved" && subStatus === "approved" && (currentUser?.expiresAt ? (daysUntilExpiry(currentUser.expiresAt) ?? 0) >= 0 : true);
                    const isSubscribed = hasSub || hasTrial;

                    // Bookstore-only buyer / pending applicant / awaiting payment / expired:
                    // lock everything except "courses" and "packages".
                    if (!isSubscribed && activeTab !== "courses" && activeTab !== "packages") {
                      const feeEur = currentUser?.subscriptionFeeEur ?? 0;
                      return (
                        <div className="bg-white border border-brand-green/5 p-8 sm:p-10 rounded-2xl shadow-md animate-fade-in space-y-6 max-w-2xl mx-auto text-center">
                          <div className="inline-flex p-4 bg-brand-gold/10 text-brand-gold rounded-2xl mx-auto">
                            <Lock className="h-8 w-8" />
                          </div>
                          <div className="space-y-2">
                            <h2 className="font-serif text-2xl font-bold text-brand-green">
                              {subStatus === "awaiting_payment" ? `Плащане на абонамент` : status === "expired" || subStatus === "expired" ? `Изтекъл абонамент` : `Заключена секция`}
                            </h2>
                            <p className="text-sm text-brand-dark/70 leading-relaxed">
                              {subStatus === "pending" && `Вашето заявление за абонамент е получено и се преглежда от д-р Николова. След одобрение и заплащане на абонамента, всички функции на портала се отключват.`}
                              {subStatus === "awaiting_payment" && `Заявлението Ви е одобрено! За да активирате пълния достъп до портала, моля заплатете годишния абонамент по-долу.`}
                              {(status === "expired" || subStatus === "expired") && `Вашият абонамент „БАБХ Спокойствие" е изтекъл. За да възстановите достъпа си до електронните дневници и НАССР документи, моля свържете се с д-р Николова.`}
                              {status !== "expired" && subStatus !== "expired" && subStatus !== "pending" && subStatus !== "awaiting_payment" && `Тази секция е достъпна само за клиенти с активен абонамент „БАБХ Спокойствие". Закупените от Вас курсове можете да четете в таб „Моите Обучения".`}
                            </p>
                          </div>
                          <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 text-left text-xs text-brand-dark/70 space-y-1.5">
                            <p className="font-bold text-brand-green">С абонамента получавате:</p>
                            <p>✓ Електронни дневници за БАБХ самоконтрол</p>
                            <p>✓ Готови НАССР документи с Ваши данни</p>
                            <p>✓ Документи и тестове, изпратени персонално</p>
                            <p>✓ Директен чат с д-р Николова</p>
                            <p>✓ Инструменти (одит, срокове, етикети)</p>
                          </div>

                          {subStatus === "pending" && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-xl px-4 py-3">
                              ⏳ Заявлението Ви се обработва — обикновено отнема до 24 часа.
                            </div>
                          )}

                          {subStatus === "awaiting_payment" && (
                            <div className="space-y-3">
                              <div className="bg-brand-green/5 border border-brand-green/15 rounded-xl px-4 py-4 flex items-center justify-between">
                                <span className="text-sm font-bold text-brand-green">Годишен абонамент</span>
                                <span className="font-serif text-2xl font-bold text-brand-gold">{feeEur.toFixed(2)} €</span>
                              </div>
                              <button
                                onClick={() => { setSubPayOpen(true); setSubPayStatus("idle"); setSubPayError(""); }}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-gold text-brand-dark font-bold text-sm uppercase tracking-widest hover:bg-brand-gold-light transition-colors cursor-pointer shadow-lg shadow-brand-gold/20"
                              >
                                <CreditCard className="h-4 w-4" />
                                Плати абонамента
                              </button>
                            </div>
                          )}

                          {(status === "expired" || subStatus === "expired") ? (
                            <Link
                              href="/contact"
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-dark font-bold text-sm uppercase tracking-wider hover:bg-brand-gold-light transition-colors cursor-pointer shadow-md shadow-brand-gold/20 text-center"
                            >
                              Свържи се за подновяване
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          ) : subStatus === "none" && (
                            <button
                              onClick={() => setSubApplyOpen(true)}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-dark font-bold text-sm uppercase tracking-wider hover:bg-brand-gold-light transition-colors cursor-pointer shadow-md shadow-brand-gold/20"
                            >
                              Тествай безплатно 14 дни
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            onClick={() => setActiveTab("courses")}
                            className="block mx-auto text-xs text-brand-dark/50 hover:text-brand-gold underline underline-offset-4 cursor-pointer"
                          >
                            ← Към моите курсове
                          </button>
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* TAB 1: ДНЕВНИЦИ ПО САМОКОНТРОЛ (нова система) */}
              {activeTab === "logs" && (
                <RegistersTab
                  email={currentUserEmail}
                  firm={{ name: firmInfo.name, eik: firmInfo.eik, address: firmInfo.address, manager: firmInfo.manager }}
                  fridges={currentUser?.customFridges ?? ["Хладилна витрина №1"]}
                  freezers={currentUser?.customFreezers ?? ["Фризер №1"]}
                  employees={currentUser?.customEmployees ?? []}
                  meat={isMeatShopNiche(currentUser?.niche || firmInfo.niche)}
                  hotPoint={currentUser?.hasHotPoint ?? defaultHotPointForSector(getSectorForNiche(currentUser?.niche || firmInfo.niche))}
                  hotAppliances={currentUser?.hotAppliances ?? []}
                  signature={currentUser?.signature}
                  signatureMode={currentUser?.signatureMode ?? "manual"}
                  tourSeen={currentUser?.registersTourSeen ?? false}
                   autoDuner={currentUser?.autoDuner ?? false}
                  autoPrework={currentUser?.autoPrework ?? false}
                  autoTemps={currentUser?.autoTemps ?? false}
                  autoStaffHygiene={currentUser?.autoStaffHygiene ?? false}
                  autoCleaning={currentUser?.autoCleaning ?? false}
                  autoFryerOil={currentUser?.autoFryerOil ?? false}
                  autoBaking={currentUser?.autoBaking ?? false}
                  autoCookedMeals={currentUser?.autoCookedMeals ?? false}
                  autoResidue={currentUser?.autoResidue ?? false}
                  onTourDone={async () => { await updateUser(currentUserEmail, { registersTourSeen: true }); }}
                  onSaveEquipment={async (patch) => { await updateUser(currentUserEmail, patch); }}
                />
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
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  material.type === "test" 
                                    ? "bg-amber-100 text-amber-800" 
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {material.type === "test" ? "Тест" : "Документ"}
                                </span>
                                {material.fileName && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full">
                                    <Paperclip className="h-3 w-3" /> Файл
                                  </span>
                                )}
                              </div>
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

                            <div className="shrink-0 flex items-center gap-2">
                              {material.status === "completed" ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold bg-green-100/50 px-3 py-1.5 rounded-lg">
                                    <CheckCircle className="h-4 w-4" /> Изпълнен
                                  </span>
                                  {material.type === "test" && material.score !== undefined && material.score >= 80 && (
                                    <button
                                      onClick={() => alert("Сертификатът за това обучение успешно се генерира (демо). В пълната версия тук се изтегля PDF.")}
                                      className="px-3 py-1.5 bg-brand-gold hover:bg-amber-500 text-brand-dark font-bold text-[10px] uppercase rounded-lg flex items-center gap-1 transition-colors shadow-sm cursor-pointer border-0"
                                      title="Изтегли сертификат за преминато обучение"
                                    >
                                      <Download className="h-3.5 w-3.5" /> Сертификат
                                    </button>
                                  )}
                                </>
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
              {activeTab === "courses" && (() => {
                const myIds = currentUser?.purchasedCourseIds || [];
                const myMaterials = LIBRARY_MATERIALS.filter(m => myIds.includes(m.slug));
                return (
                  <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center justify-between gap-3 border-b border-brand-green/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="font-serif text-xl font-bold text-brand-green">Моите обучения</h2>
                          <p className="text-xs text-brand-dark/50">Закупените от Вас материали — отворете в нов раздел</p>
                        </div>
                      </div>
                      <Link href="/library" className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors cursor-pointer whitespace-nowrap">
                        <PlusCircle className="h-3.5 w-3.5" />
                        Купи още
                      </Link>
                    </div>

                    {myMaterials.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-brand-green/10 rounded-xl space-y-3">
                        <BookOpen className="h-10 w-10 text-brand-gold/40 mx-auto" />
                        <p className="text-sm text-brand-dark/60">Все още нямате закупени обучения.</p>
                        <Link href="/library" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-brand-gold text-brand-dark hover:bg-brand-gold-light transition-colors cursor-pointer">
                          Към книжарницата →
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {myMaterials.map(m => {
                          // For PDF type, we serve from Firebase Storage at library/<slug>/file.pdf
                          // through the protected viewer. For video type, fallback to contentUrl.
                          return (
                          <div key={m.slug} className="border border-brand-green/5 rounded-xl p-5 flex flex-col justify-between hover:border-brand-gold/30 transition-all duration-300">
                            <div className="space-y-3">
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                <CheckCircle className="h-3 w-3" /> Закупен
                              </span>
                              <h4 className="font-serif text-base font-bold text-brand-green">{m.title}</h4>
                              <p className="text-xs text-brand-dark/60 leading-normal">{m.tagline}</p>
                              <span className="text-[10px] text-brand-dark/40 font-mono block">
                                {m.type === "video" ? "🎬 Видео обучение" : "📄 PDF Наръчник"}
                              </span>
                            </div>
                            {m.type === "pdf" ? (
                              <Link
                                href={`/library/${m.slug}/viewer`}
                                className="mt-6 inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase py-3 rounded-lg transition-colors w-full cursor-pointer text-center shadow-md"
                              >
                                <BookOpen className="h-4 w-4" />
                                Отвори обучението
                              </Link>
                            ) : !m.contentUrl.includes("REPLACE_ME") ? (
                              <a
                                href={m.contentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase py-3 rounded-lg transition-colors w-full cursor-pointer text-center shadow-md"
                              >
                                <BookOpen className="h-4 w-4" />
                                Отвори видеото
                              </a>
                            ) : (
                              <div className="mt-6 inline-flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs uppercase py-3 rounded-lg w-full text-center" title="contentUrl още не е настроен в src/data/library/">
                                <Clock className="h-4 w-4" />
                                Материалът се подготвя
                              </div>
                            )}
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              
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

              {/* TAB 7: АБОНАМЕНТНИ ПАКЕТИ */}
              {activeTab === "packages" && (
                <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-8 animate-fade-in text-brand-dark">
                  <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                    <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-brand-green">Абонаментни Пакети „БАБХ Спокойствие“</h2>
                      <p className="text-xs text-brand-dark/50">Изберете най-подходящия план за сигурността на Вашия бизнес</p>
                    </div>
                  </div>

                  {status === "approved" && subStatus === "trial" && trialDaysLeft(currentUser?.trialStartedAt) < 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-5 flex items-start gap-4">
                      <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1 text-sm font-sans text-left">
                        <p className="font-bold text-base">Вашият 14-дневен безплатен пробен период изтече!</p>
                        <p className="text-xs text-red-800/90 leading-relaxed">
                          За да запазите достъпа си до дигиталните самоконтролни дневници и автоматичния НАССР генератор, моля изберете един от абонаментните ни планове по-долу и направете банков превод.
                        </p>
                      </div>
                    </div>
                  )}

                  {status === "approved" && subStatus === "trial" && trialDaysLeft(currentUser?.trialStartedAt) >= 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-5 flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-sm font-sans text-left">
                        <p className="font-bold text-base">Вие сте в безплатен пробен период!</p>
                        <p className="text-xs text-emerald-900/80 leading-relaxed">
                          Остават Ви още <strong className="text-emerald-700 font-black">{trialDaysLeft(currentUser?.trialStartedAt)} дни</strong> безплатен пробен достъп. За да си осигурите дългосрочно съответствие и сигурност, можете да изберете абонаментен пакет от предложените по-долу по всяко време.
                        </p>
                      </div>
                    </div>
                  )}

                  {status === "approved" && subStatus === "approved" && (
                    <div className="bg-brand-green/5 border border-brand-green/15 text-brand-green rounded-2xl p-5 flex items-start gap-4">
                      <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
                      <div className="space-y-1 text-sm font-sans text-left">
                        <p className="font-bold text-base">Имате активен абонамент!</p>
                        <p className="text-xs text-brand-dark/70 leading-relaxed">
                          Вашият акаунт е напълно отключен и защитен. Абонаментът Ви изтича на: <strong className="font-mono text-brand-gold-dark font-bold">{currentUser?.expiresAt}</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Program intro */}
                  <div className="bg-brand-green/[0.04] border border-brand-green/10 rounded-3xl p-6 sm:p-7 text-left font-sans">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold-dark mb-2">Абонаментна програма</p>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green leading-snug">
                      Подкрепа, внедряване и поддържане на системи за безопасност на храните
                    </h3>
                    <p className="text-sm text-brand-dark/75 leading-relaxed mt-3 max-w-3xl">
                      Това не е поредното обучение, което ще изгледате и ще забравите. Това е <strong className="text-brand-green">жива професионална общност</strong>, в която всяка седмица работите заедно с д-р Данка Николова, за да изградите система по безопасност на храните, която работи ежедневно и Ви дава спокойствие при всяка проверка от БАБХ.
                    </p>
                  </div>

                  {/* Packages Grid — premium subscription cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 font-sans text-left items-stretch">
                    {/* ─── Търговски обекти ─── */}
                    <div className="group relative flex flex-col rounded-[1.75rem] bg-white ring-1 ring-brand-green/10 p-7 shadow-sm hover:shadow-xl hover:ring-brand-gold/40 hover:-translate-y-1 transition-all duration-300">
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-bold text-brand-green">Търговски обекти</h3>
                        <p className="text-[11px] text-brand-dark/50 leading-relaxed">За магазини, складове, заведения, кетъринг и онлайн търговци на храни</p>
                      </div>
                      <div className="mt-6 flex items-end gap-1.5">
                        <span className="font-serif text-5xl font-black text-brand-dark tabular-nums leading-none">79</span>
                        <span className="font-serif text-2xl font-bold text-brand-gold leading-none mb-0.5">€</span>
                        <span className="text-xs text-brand-dark/45 font-medium mb-1.5">/ месец</span>
                      </div>
                      <div className="h-px bg-brand-green/8 my-6" />
                      <ul className="space-y-3 text-xs text-brand-dark/80 flex-grow">
                        {[
                          <><strong className="text-brand-green">Една среща на живо</strong> всяка седмица (онлайн)</>,
                          <>Решаване на реални казуси и отговори на въпросите Ви</>,
                          <>Авторски шаблони, чек-листи и образци на документи</>,
                          <>Достъп до записите от всички срещи</>,
                          <>Затворена <strong className="text-brand-green">Viber група</strong> за въпроси между срещите</>,
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="mt-0.5 shrink-0 grid place-items-center h-4 w-4 rounded-full bg-brand-gold/15 text-brand-gold"><Check className="h-3 w-3" strokeWidth={3} /></span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleSelectPackage("Търговски обекти", 79)}
                        className="w-full mt-7 py-3.5 bg-brand-green/[0.06] hover:bg-brand-green text-brand-green hover:text-white ring-1 ring-brand-green/15 hover:ring-brand-green font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
                      >
                        Избери план
                      </button>
                    </div>

                    {/* ─── Производители на храни (featured) ─── */}
                    <div className="group relative flex flex-col rounded-[1.75rem] p-7 md:-my-2 md:py-9 bg-gradient-to-br from-[#0D2B1C] via-brand-green to-[#0A2318] text-white shadow-2xl shadow-brand-green/25 ring-1 ring-brand-gold/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                      <div className="absolute top-0 right-0 w-56 h-56 bg-brand-gold/15 rounded-full blur-[70px] pointer-events-none" />
                      <div className="relative flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] bg-brand-gold text-brand-dark px-3 py-1.5 rounded-full shadow-lg shadow-brand-gold/20">
                          <Star className="h-3 w-3" fill="currentColor" /> Най-популярен
                        </span>
                      </div>
                      <div className="relative mt-5 space-y-1">
                        <h3 className="font-serif text-lg font-bold text-white">Производители на храни</h3>
                        <p className="text-[11px] text-white/55 leading-relaxed">За производители, мандри, месо- и рибопреработка, хлебни, сладкарски и готови храни</p>
                      </div>
                      <div className="relative mt-6 flex items-end gap-1.5">
                        <span className="font-serif text-5xl font-black text-white tabular-nums leading-none">119</span>
                        <span className="font-serif text-2xl font-bold text-brand-gold leading-none mb-0.5">€</span>
                        <span className="text-xs text-white/50 font-medium mb-1.5">/ месец</span>
                      </div>
                      <div className="relative h-px bg-white/10 my-6" />
                      <ul className="relative space-y-3 text-xs text-white/85 flex-grow">
                        {[
                          <><strong className="text-brand-gold">Всичко за „Търговски обекти“</strong></>,
                          <>Практически теми по <strong className="text-white">НАССР, ДПХП и технологична документация</strong></>,
                          <>Проследимост, етикетиране и добри производствени практики</>,
                          <>Подготовка за проверки и вътрешен контрол</>,
                          <>Актуална информация при промени в законодателството</>,
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="mt-0.5 shrink-0 grid place-items-center h-4 w-4 rounded-full bg-brand-gold text-brand-dark"><Check className="h-3 w-3" strokeWidth={3} /></span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleSelectPackage("Производители на храни", 119)}
                        className="relative w-full mt-7 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-brand-gold/25 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      >
                        Избери план
                      </button>
                    </div>

                    {/* ─── VIP ─── */}
                    <div className="group relative flex flex-col rounded-[1.75rem] bg-gradient-to-b from-brand-gold/[0.07] to-white ring-1 ring-brand-gold/25 p-7 shadow-sm hover:shadow-xl hover:ring-brand-gold/50 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-brand-gold-dark border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 rounded-full">
                          <Sparkles className="h-3 w-3" /> Premium
                        </span>
                      </div>
                      <div className="mt-5 space-y-1">
                        <h3 className="font-serif text-lg font-bold text-brand-green">Спокойствие VIP одит</h3>
                        <p className="text-[11px] text-brand-dark/50 leading-relaxed">Пълна професионална защита с персонално внимание</p>
                      </div>
                      <div className="mt-6 flex items-end gap-1.5">
                        <span className="font-serif text-5xl font-black text-brand-dark tabular-nums leading-none">199</span>
                        <span className="font-serif text-2xl font-bold text-brand-gold leading-none mb-0.5">€</span>
                        <span className="text-xs text-brand-dark/45 font-medium mb-1.5">/ месец</span>
                      </div>
                      <div className="h-px bg-brand-gold/15 my-6" />
                      <ul className="space-y-3 text-xs text-brand-dark/80 flex-grow">
                        {[
                          <><strong className="text-brand-green">Всичко за „Производители на храни“</strong></>,
                          <><strong className="text-brand-green">Месечен одит</strong> с д-р Данка Николова</>,
                          <>Изготвяне на технологична документация</>,
                          <><strong className="text-brand-green">Директна телефонна връзка</strong> при проверки</>,
                          <>100% защита при казуси с БАБХ</>,
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="mt-0.5 shrink-0 grid place-items-center h-4 w-4 rounded-full bg-brand-gold/15 text-brand-gold"><Check className="h-3 w-3" strokeWidth={3} /></span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleSelectPackage("VIP одит", 199)}
                        className="w-full mt-7 py-3.5 bg-brand-green/[0.06] hover:bg-brand-green text-brand-green hover:text-white ring-1 ring-brand-green/15 hover:ring-brand-green font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
                      >
                        Избери план
                      </button>
                    </div>
                  </div>

                  {/* What you get */}
                  <div className="text-left font-sans">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><Sparkles className="h-5 w-5" /></div>
                      <h3 className="font-serif text-lg font-bold text-brand-green">Какво получавате</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { icon: Video, t: "Седмични срещи на живо", d: "Една онлайн среща всяка седмица с практически теми и демонстрации." },
                        { icon: FileText, t: "Практически теми", d: "ДПХП, НАССР, технологична документация, проследимост, етикетиране и законодателство." },
                        { icon: ShieldCheck, t: "Реални казуси", d: "Решаване на реални казуси и отговори на Вашите конкретни въпроси." },
                        { icon: Download, t: "Достъп до записите", d: "Гледайте записите от всички срещи, ако не можете да присъствате на живо." },
                        { icon: FileCheck, t: "Готови материали", d: "Авторски шаблони, чек-листи, образци на документи и практически материали." },
                        { icon: MessageSquare, t: "Затворена Viber група", d: "Задавайте въпроси между срещите и получавайте професионални насоки." },
                      ].map(({ icon: Icon, t, d }, i) => (
                        <div key={i} className="bg-white border border-brand-green/10 rounded-2xl p-4 hover:border-brand-gold/40 transition-colors">
                          <Icon className="h-5 w-5 text-brand-gold mb-2" />
                          <p className="font-bold text-sm text-brand-green">{t}</p>
                          <p className="text-xs text-brand-dark/65 leading-relaxed mt-1">{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* For whom / When it fits */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left font-sans">
                    <div className="bg-brand-light/30 border border-brand-green/10 rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-brand-green/10 text-brand-green rounded-xl"><Users className="h-5 w-5" /></div>
                        <h3 className="font-serif text-lg font-bold text-brand-green">За кого е подходяща</h3>
                      </div>
                      <ul className="text-xs text-brand-dark/80 space-y-2 leading-relaxed columns-1 sm:columns-2 gap-x-6">
                        {[
                          "Производители на храни",
                          "Малки и средни предприятия",
                          "Мандри и месопреработка",
                          "Производство на рибни продукти",
                          "Хлебни и сладкарски изделия",
                          "Производители на готови храни",
                          "Плодове и зеленчуци",
                          "Магазини и складове за храни",
                          "Заведения за обществено хранене",
                          "Кетъринг и онлайн търговци",
                          "Ферми по Наредба № 26",
                          "Стартиращи хранителни предприятия",
                          "Отговорници по качеството и технолози",
                          "Управители и собственици на обекти",
                        ].map((x, i) => (
                          <li key={i} className="flex items-start gap-2 break-inside-avoid mb-2"><Check className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" /><span>{x}</span></li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-brand-light/30 border border-brand-green/10 rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-brand-green/10 text-brand-green rounded-xl"><Sparkles className="h-5 w-5" /></div>
                        <h3 className="font-serif text-lg font-bold text-brand-green">Подходяща е и ако...</h3>
                      </div>
                      <ul className="text-xs text-brand-dark/80 space-y-2.5 leading-relaxed">
                        {[
                          "Искате сами да поддържате документацията си, без постоянно да разчитате на външни консултанти.",
                          "Предстои Ви регистрация на нов хранителен обект.",
                          "Очаквате проверка от БАБХ.",
                          "Искате да актуализирате НАССР системата и ДПХП.",
                          "Срещате затруднения при воденето на документацията.",
                          "Искате да сте информирани за всяка промяна в законодателството.",
                          "Искате да обменяте опит и добри практики с други оператори.",
                        ].map((x, i) => (
                          <li key={i} className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" /><span>{x}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Important */}
                  <div className="bg-amber-50/60 border border-amber-200/70 rounded-3xl p-6 text-left font-sans">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <h3 className="font-serif text-lg font-bold text-amber-900">Важно</h3>
                    </div>
                    <ul className="text-xs text-amber-900/85 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-2">✓ <span>Работя с <strong>ограничен брой участници</strong>, за да отделя лично внимание на всеки.</span></li>
                      <li className="flex items-start gap-2">✓ <span>Програмата е изцяло практическа и базирана на реални казуси.</span></li>
                      <li className="flex items-start gap-2">✓ <span>Нови теми се добавят всеки месец според промените в законодателството и въпросите на участниците.</span></li>
                    </ul>
                  </div>

                  {/* My promise */}
                  <div className="bg-brand-green text-white rounded-3xl p-6 sm:p-8 text-left font-sans relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="flex items-center gap-3 mb-4 relative">
                      <div className="p-2 bg-brand-gold/20 text-brand-gold rounded-xl"><ShieldCheck className="h-5 w-5" /></div>
                      <h3 className="font-serif text-xl font-bold">Моето обещание</h3>
                    </div>
                    <div className="space-y-3 text-sm text-white/85 leading-relaxed max-w-3xl relative">
                      <p>
                        Като <strong className="text-brand-gold">бивш директор на Областна дирекция по безопасност на храните</strong> и експерт с над 25 години практически опит, ще бъда до Вас, за да решавате реални казуси, да намирате навременни решения и да избягвате грешките, които водят до предписания, санкции или загуба на време и средства.
                      </p>
                      <p>
                        Заедно няма просто да създаваме документация. Ще изграждаме система, която работи ежедневно, защитава бизнеса Ви и Ви дава увереност при всяка проверка от БАБХ. Защото добрата документация се разработва веднъж, но добрата система се поддържа, усъвършенства и развива всеки ден.
                      </p>
                      <p className="text-brand-gold font-semibold">
                        Моята цел е една — вашият бизнес да бъде сигурен, подготвен и спокоен.
                      </p>
                    </div>
                  </div>

                  {/* Bank Account Details */}
                  <div id="bank-details-card" className="bg-brand-green text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl border border-brand-gold/25 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                      <Building className="text-brand-gold h-6 w-6" />
                      Данни за плащане по банков път
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed max-w-2xl font-sans text-left">
                      За да активирате избрания пакет, моля направете банков превод по посочената сметка. В основанието за плащане задължително въведете имейл адреса на Вашия акаунт: <strong className="text-brand-gold">{currentUserEmail}</strong>. След като получим превода, Вашият абонамент ще бъде активиран и ще Ви известим.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-mono text-xs sm:text-sm text-left">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 block font-sans">Получател</span>
                        <span className="font-bold text-white">Данка Василева Крамолинска</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 block font-sans">Банка</span>
                        <span className="font-bold text-white">ЦКБ АД – Клон Плевен</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 col-span-1 md:col-span-2 lg:col-span-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 block font-sans">IBAN</span>
                        <span className="font-bold text-brand-gold select-all">BG98 CECB 9790 1008 5533 00</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 block font-sans">BIC</span>
                        <span className="font-bold text-white select-all">CECBBGSF</span>
                      </div>
                    </div>
                  </div>
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

      {/* DOCUMENT/TEST MODALS */}
      {activeAssignedMaterial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-brand-green/20 relative">
            <div className="flex justify-between items-start mb-6 border-b border-brand-green/10 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-brand-green">{activeAssignedMaterial.title}</h3>
                <p className="text-sm text-brand-dark/50 mt-1">
                  {activeAssignedMaterial.type === "document" ? "Образователен материал" : "Тест за проверка на знанията"}
                </p>
              </div>
              <button 
                onClick={() => {
                  setActiveAssignedMaterial(null);
                  setUserTestAnswers([]);
                }}
                className="text-brand-dark/40 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 absolute top-6 right-6"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {activeAssignedMaterial.type === "document" && (
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none text-brand-dark bg-brand-light/20 p-6 rounded-xl border border-brand-green/5">
                  {activeAssignedMaterial.content.split("\n").map((para, i) => (
                    <p key={i} className="mb-4 leading-relaxed">{para}</p>
                  ))}
                </div>
                {activeAssignedMaterial.fileUrl && (
                  <div className="bg-brand-light/40 border border-brand-green/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-brand-green uppercase tracking-wider">Прикачен официален документ</h4>
                        <p className="text-sm font-medium text-brand-dark max-w-[280px] sm:max-w-md truncate animate-fade-in" title={activeAssignedMaterial.fileName}>
                          {activeAssignedMaterial.fileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <a 
                        href={activeAssignedMaterial.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial text-center px-4 py-2.5 bg-brand-gold hover:bg-amber-500 text-brand-dark hover:text-brand-dark font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline"
                      >
                        <Download className="h-4 w-4" />
                        Изтегли / Отвори
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-brand-green/10">
                  <button
                    onClick={() => handlePrintText(activeAssignedMaterial.title, activeAssignedMaterial.content)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-brand-green/20 hover:border-brand-gold text-brand-green hover:bg-brand-gold/5 font-bold text-sm uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    Принтирай
                  </button>
                  {activeAssignedMaterial.status !== "completed" && (
                    <button
                      onClick={() => handleCompleteDocument(activeAssignedMaterial.id)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-brand-green/20 cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      Маркирай като прочетено
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeAssignedMaterial.type === "test" && (
              <div className="space-y-8">
                {activeAssignedMaterial.questions?.map((q, qIdx) => (
                  <div key={qIdx} className="bg-brand-light/30 p-6 rounded-xl border border-brand-green/10">
                    <h4 className="font-bold text-brand-dark mb-4 text-lg">Въпрос {qIdx + 1}: {q.text}</h4>
                    <div className="space-y-3">
                      {q.options.map((opt, optIdx) => (
                        <label 
                          key={optIdx} 
                          className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${userTestAnswers[qIdx] === optIdx ? "bg-brand-green/10 border-brand-green text-brand-green font-bold shadow-sm" : "bg-white border-brand-green/10 hover:border-brand-green/30 hover:bg-brand-light/50"}`}
                        >
                          <input 
                            type="radio" 
                            name={`q_${qIdx}`}
                            checked={userTestAnswers[qIdx] === optIdx}
                            onChange={() => {
                              const newAns = [...userTestAnswers];
                              newAns[qIdx] = optIdx;
                              setUserTestAnswers(newAns);
                            }}
                            className="w-4 h-4 text-brand-green border-brand-green/30 focus:ring-brand-green"
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                {activeAssignedMaterial.status !== "completed" ? (
                  <div className="flex justify-end pt-6 border-t border-brand-green/10">
                    <button
                      onClick={() => handleSolveTest()}
                      disabled={userTestAnswers.includes(-1)}
                      className="px-8 py-3 bg-brand-green hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-brand-green/20 cursor-pointer"
                    >
                      Предай теста
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-brand-gold/10 text-brand-dark p-6 rounded-xl border border-brand-gold/20 flex flex-col items-center justify-center text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                      <h4 className="font-bold text-lg mb-1">Тестът е успешно завършен!</h4>
                      <p className="text-sm opacity-75">Вашият резултат е: <strong className="text-brand-green">{activeAssignedMaterial.score}%</strong></p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const m = activeAssignedMaterial;
                          let text = `ТЕСТ: ${m.title}\n`;
                          text += `Дата: ${new Date().toLocaleDateString("bg-BG")}\n`;
                          text += `Резултат: ${m.score ?? 0}%\n`;
                          text += `==============================\n\n`;
                          (m.questions || []).forEach((q, i) => {
                            const userIdx = m.userAnswers?.[i];
                            const correct = userIdx === q.correctIdx;
                            text += `Въпрос ${i + 1}: ${q.text}\n`;
                            q.options.forEach((opt, oi) => {
                              const marker = oi === q.correctIdx ? "✓" : oi === userIdx ? "✗" : " ";
                              text += `  [${marker}] ${opt}\n`;
                            });
                            text += `  → ${correct ? "ВЯРЕН" : "ГРЕШЕН"} отговор\n\n`;
                          });
                          handlePrintText(`Тест_${m.title}`, text);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-brand-green/20 hover:border-brand-gold text-brand-green hover:bg-brand-gold/5 font-bold text-sm uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        <Printer className="h-4 w-4" />
                        Принтирай резултата
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────── SUBSCRIPTION APPLY MODAL (bookstore buyer → applies for full plan) ─────────── */}
      {subApplyOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-8 overflow-hidden">
            <div className="bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Абонамент</div>
                  <div className="font-serif text-lg font-bold">Тествай безплатно 14 дни</div>
                </div>
              </div>
              <button onClick={() => setSubApplyOpen(false)} className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplyForSubscription} className="p-6 space-y-4">
              <p className="text-xs text-brand-dark/60 leading-relaxed">
                Попълнете данните за обекта си. Д-р Николова ще прегледа лично заявлението — обикновено до 24 часа.
                След одобрение всички функции на портала се отключват.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Име на Обект / Фирма *</label>
                <input type="text" required value={applyFirmName} onChange={(e) => setApplyFirmName(e.target.value)} placeholder="напр. Ресторант Витоша" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">ЕИК / Булстат</label>
                  <input type="text" value={applyEik} onChange={(e) => setApplyEik(e.target.value)} placeholder="207654321" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Сектор</label>
                  <select
                    value={applySector}
                    onChange={(e) => { setApplySector(e.target.value); setApplyNiche(BUSINESS_CATEGORIES[e.target.value][0]); }}
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white cursor-pointer"
                  >
                    {Object.keys(BUSINESS_CATEGORIES).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Категория обект</label>
                <select value={applyNiche} onChange={(e) => setApplyNiche(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white cursor-pointer">
                  {BUSINESS_CATEGORIES[applySector]?.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Лице за контакт *</label>
                  <input type="text" required value={applyContact} onChange={(e) => setApplyContact(e.target.value)} placeholder="Иван Петров" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Телефон *</label>
                  <input type="tel" required value={applyPhone} onChange={(e) => setApplyPhone(e.target.value)} placeholder="0888123456" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Адрес на обекта *</label>
                <input type="text" required value={applyAddress} onChange={(e) => setApplyAddress(e.target.value)} placeholder="гр. София, ул. Витоша 12" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Опишете дейността *</label>
                <textarea required value={applyDesc} onChange={(e) => setApplyDesc(e.target.value)} rows={3} placeholder="Брой места, меню, оборудване…" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white resize-y" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setSubApplyOpen(false)} className="flex-1 px-5 py-3 rounded-full border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider hover:bg-brand-green/5 transition-colors cursor-pointer">
                  Отказ
                </button>
                <button type="submit" className="flex-1 px-5 py-3 rounded-full bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-wider hover:bg-brand-gold-light transition-colors cursor-pointer shadow-md">
                  Изпрати заявление
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────── ADMIN: SET-FEE-ON-APPROVE MODAL ─────────── */}
      {feeModalEmail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Одобрение</div>
                  <div className="font-serif text-lg font-bold">Определи цена на абонамента</div>
                </div>
              </div>
              <button onClick={() => { setFeeModalEmail(null); setFeeModalAmount(""); }} className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-brand-light/50 border border-brand-green/5 rounded-xl p-3 text-xs">
                <span className="text-brand-dark/50 block mb-0.5">Клиент:</span>
                <span className="font-bold text-brand-green break-all">{feeModalEmail}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Сума за абонамент (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={feeModalAmount}
                  onChange={(e) => setFeeModalAmount(e.target.value)}
                  placeholder="напр. 120.00"
                  className="w-full text-lg font-mono px-4 py-3 rounded-xl border border-brand-green/15 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white"
                  autoFocus
                />
                <p className="text-[10px] text-brand-dark/60 leading-relaxed">
                  Сложете <strong>0</strong>, ако клиентът Ви е платил в кеш / банков превод — достъпът ще се отвори веднага без онлайн плащане.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFeeModalAmount("0")}
                  className="text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green hover:bg-brand-green/5 transition-colors cursor-pointer"
                >
                  0 € (кеш)
                </button>
                <button
                  type="button"
                  onClick={() => setFeeModalAmount("120")}
                  className="text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green hover:bg-brand-green/5 transition-colors cursor-pointer"
                >
                  120 € (стандартен)
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setFeeModalEmail(null); setFeeModalAmount(""); }}
                  className="flex-1 px-5 py-3 rounded-full border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider hover:bg-brand-green/5 transition-colors cursor-pointer"
                >
                  Отказ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApproval}
                  disabled={feeModalAmount === ""}
                  className="flex-1 px-5 py-3 rounded-full bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-wider hover:bg-brand-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-md"
                >
                  Одобри
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── CLIENT: SUBSCRIPTION BANK-PAYMENT MODAL ─────────── */}
      {subPayOpen && (() => {
        const me = usersList.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
        const fee = me?.subscriptionFeeEur ?? 0;
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden font-sans">
              <div className="bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Плащане</div>
                    <div className="font-serif text-lg font-bold">Данни за банков превод</div>
                  </div>
                </div>
                <button
                  onClick={() => { setSubPayOpen(false); }}
                  className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer border-0 bg-transparent"
                  aria-label="Затвори"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-green">Годишен абонамент</span>
                  <span className="font-serif text-2xl font-bold text-brand-gold">{fee.toFixed(2)} €</span>
                </div>

                <div className="bg-brand-green/5 border border-brand-green/10 rounded-2xl p-5 space-y-4 text-brand-dark">
                  <div className="text-center font-bold text-sm uppercase tracking-wider text-brand-green pb-2 border-b border-brand-green/10">
                    🏦 БАНКОВА СМЕТКА
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/45 block">Получател</span>
                      <span className="font-bold text-brand-dark/90">Данка Василева Крамолинска</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/45 block">Банка</span>
                      <span className="font-semibold text-brand-dark/95">ЦКБ АД – Клон Плевен</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/45 block">IBAN</span>
                      <span className="font-mono font-bold text-brand-green text-sm select-all bg-white px-2.5 py-1 rounded border border-brand-green/5 inline-block">BG98 CECB 9790 1008 5533 00</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/45 block">BIC</span>
                      <span className="font-mono font-semibold text-brand-dark/95 select-all bg-white px-2.5 py-1 rounded border border-brand-green/5 inline-block">CECBBGSF</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl p-4 leading-relaxed space-y-1.5">
                  <p className="font-bold">💡 Важно:</p>
                  <p>
                    След като направите банков превод по посочената сметка, администраторът ще активира Вашите права в профила и ще бъдете известени по имейл и с чат съобщение.
                  </p>
                </div>

                <button
                  onClick={() => setSubPayOpen(false)}
                  className="w-full px-6 py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  Затвори
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Package Confirm Modal */}
      {pkgConfirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{background: "rgba(10,30,20,0.65)", backdropFilter: "blur(8px)"}}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-br from-brand-green to-brand-green/80 p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,155,60,0.25),transparent_60%)] pointer-events-none" />
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-brand-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold">Избор на план</h3>
              <p className="text-white/70 text-xs mt-1">Потвърдете Вашия абонаментен пакет</p>
            </div>
            <div className="p-6 space-y-4 font-sans">
              <div className="bg-brand-light/60 border border-brand-green/10 rounded-2xl p-4 text-center space-y-1">
                <p className="text-xs text-brand-dark/50 uppercase tracking-widest font-bold">Избран пакет</p>
                <p className="font-serif text-2xl font-bold text-brand-green">{pkgConfirmModal.name}</p>
                <p className="text-brand-gold font-bold text-lg font-mono">{pkgConfirmModal.fee} € <span className="text-brand-dark/40 text-xs font-sans font-normal">/ месечно</span></p>
              </div>
              <p className="text-xs text-brand-dark/65 leading-relaxed text-center">
                Вашият акаунт ще бъде регистриран за плащане по банков път. Администраторът ще активира достъпа Ви веднага след получаване на превода.
              </p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setPkgConfirmModal(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-brand-dark/70 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer border-0">Отказ</button>
                <button onClick={handleConfirmSelectPackage} className="flex-1 py-3 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer border-0 shadow-lg shadow-brand-green/20">Потвърди</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Success Modal */}
      {pkgSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{background: "rgba(10,30,20,0.65)", backdropFilter: "blur(8px)"}}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-br from-brand-gold to-amber-400 p-6 text-brand-dark text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CheckCircle className="w-8 h-8 text-brand-dark" />
              </div>
              <h3 className="font-serif text-xl font-bold">Планът е избран!</h3>
              <p className="text-brand-dark/70 text-xs mt-1">Следвайте инструкциите за плащане по-долу</p>
            </div>
            <div className="p-6 space-y-4 font-sans">
              <div className="bg-brand-light/60 border border-brand-gold/20 rounded-2xl p-4 text-center space-y-1">
                <p className="text-xs text-brand-dark/50 uppercase tracking-widest font-bold">Активиран пакет</p>
                <p className="font-serif text-2xl font-bold text-brand-green">{pkgSuccessModal.name}</p>
                <p className="text-brand-gold font-bold text-lg font-mono">{pkgSuccessModal.fee} € <span className="text-brand-dark/40 text-xs font-sans font-normal">/ месечно</span></p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <p className="text-emerald-800 font-bold text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Следващи стъпки:
                </p>
                <ol className="text-xs text-emerald-700 space-y-1.5 pl-6 list-decimal leading-relaxed">
                  <li>Направете банков превод по сметката по-долу на тази страница.</li>
                  <li>В основанието напишете имейла си: <strong className="font-mono">{currentUserEmail}</strong></li>
                  <li>Администраторът ще активира достъпа Ви веднага след получаване.</li>
                </ol>
              </div>
              <button onClick={() => setPkgSuccessModal(null)} className="w-full py-3 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer border-0 shadow-lg shadow-brand-green/20">Разбрано — виж банковите данни</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}