"use client";

/**
 * Задължителното съгласие преди плащане (ЗЗП чл. 57, т. 1 и т. 13; чл. 55).
 * Без изрично искане цифровото съдържание / услугата да започне веднага и
 * потвърждение за правото на отказ, клиентът може да се откаже в 14 дни и да
 * си върне парите дори след като е ползвал купеното. Сървърът записва
 * съгласието в заявката и в Stripe (`consent`), за да има доказателство.
 */

import Link from "next/link";

/**
 * digital      — PDF наръчници, книги, видео курсове (достъп веднага);
 * service      — live обучения в Zoom, консултации, присъствени обучения;
 * subscription — месечният абонамент „БАБХ Спокойствие".
 */
export type ConsentKind = "digital" | "service" | "subscription";

const TERMS = (
  <Link href="/terms" target="_blank" className="font-bold text-brand-green underline underline-offset-2 hover:text-brand-gold">
    Общите условия
  </Link>
);

export default function PurchaseConsent({
  kind,
  checked,
  onChange,
}: {
  kind: ConsentKind;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none text-left">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#0A1F18] cursor-pointer"
      />
      <span className="text-[11px] leading-relaxed text-brand-dark/75">
        {kind === "digital" && (
          <>
            Съгласявам се с {TERMS} и искам достъпът до цифровото съдържание да започне веднага след плащането.
            Разбирам, че така губя правото си на отказ в 14-дневен срок.
          </>
        )}
        {kind === "service" && (
          <>
            Съгласявам се с {TERMS} и искам услугата да започне в 14-дневния срок за отказ. Разбирам, че при отказ
            дължа сумата за вече предоставеното, а след пълното изпълнение на услугата губя правото си на отказ.
          </>
        )}
        {kind === "subscription" && (
          <>
            Съгласявам се с {TERMS} и с автоматичното месечно таксуване на картата ми до спирането му от профила.
            Искам достъпът да започне веднага и разбирам, че при отказ в 14-дневен срок дължа сумата за вече
            ползвания период.
          </>
        )}{" "}
        Личните ми данни се обработват според{" "}
        <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-brand-gold">
          Политиката за поверителност
        </Link>
        .
      </span>
    </label>
  );
}
