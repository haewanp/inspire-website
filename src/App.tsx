import React from "react";
import { ChevronDown, ChevronRight, Menu, Play, X } from "lucide-react";

type RouteKey = "home" | "about" | "for-one-soul" | "for-all-church" | "join-us";
type SectionKey =
  | "vision-mission"
  | "representative"
  | "faq"
  | "seoul-tuesday-service"
  | "discipleship"
  | "youth-training"
  | "mission-support"
  | "support"
  | null;

type MenuSection = { title: string; highlight: string; items: string[] };
type MenuTarget = { route: RouteKey; section?: SectionKey };

type HeaderProps = {
  menu: MenuSection[];
  navigateTo: (route: RouteKey, section?: SectionKey) => void;
  getMenuItemTarget: (sectionTitle: string, item: string) => MenuTarget | null;
  hoveredIndex: number | null;
  handleEnter: (idx: number) => void;
  handleLeave: () => void;
  hoverTimeout: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openIndex: number | null;
  setOpenIndex: React.Dispatch<React.SetStateAction<number | null>>;
  showHero?: boolean;
};

type SectionTabsProps = {
  items: { key: Exclude<SectionKey, null>; label: string }[];
  activeSection: SectionKey;
  onSelect: (key: Exclude<SectionKey, null>) => void;
};

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image: string;
  imageAlt: string;
};

type SplitSectionProps = {
  id: Exclude<SectionKey, null>;
  registerRef: (key: string) => (node: HTMLElement | null) => void;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  image: string;
  imageAlt: string;
};

const menu: MenuSection[] = [
  { title: "About", highlight: "사역의 비전과 핵심 가치를 소개합니다.", items: ["Vision & Mission", "대표 소개", "FAQ"] },
  { title: "For One Soul", highlight: "예배와 말씀, 제자훈련 중심 사역", items: ["서울화요말씀집회", "제자훈련"] },
  { title: "For All Church", highlight: "교회와 선교 현장을 돕는 지원 사역", items: ["청년공동체 제자훈련 지원", "청년사역자, 해외선교사 지원"] },
  { title: "Join Us", highlight: "후원으로 사역에 동참하는 방법을 안내합니다.", items: ["후원하기"] },
  { title: "Notice", highlight: "공지와 뉴스레터, 집회 자료 모음", items: ["공지사항", "인스파이어 뉴스레터", "화요말씀집회 주보"] },
];

const ministries = [
  { number: "01", title: "서울화요말씀집회", text: "정기 집회를 통해 청년과 성도들이 복음과 말씀 안에서 삶의 방향을 다시 세우도록 돕습니다." },
  { number: "02", title: "제자훈련", text: "단기 이벤트가 아니라 실제 삶의 변화와 사역의 성숙으로 이어지는 훈련 과정을 운영합니다." },
  { number: "03", title: "교회·선교 현장 지원", text: "지역교회, 청년공동체, 선교사역을 실제 필요에 맞게 지원하는 협력 모델을 구축합니다." },
];

const stories = [
  { id: 1, image: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=80", caption: "화요말씀집회 현장" },
  { id: 2, image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80", caption: "말씀과 예배의 시간" },
  { id: 3, image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80", caption: "청년들과의 나눔" },
  { id: 4, image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80", caption: "제자훈련 스케치" },
  { id: 5, image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", caption: "사역 현장 기록" },
  { id: 6, image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80", caption: "예배 준비 모습" },
];

function routeForMenuTitle(title: string): RouteKey | null {
  if (title === "About") return "about";
  if (title === "For One Soul") return "for-one-soul";
  if (title === "For All Church") return "for-all-church";
  if (title === "Join Us") return "join-us";
  return null;
}

function useSectionNavigation(defaultSection: Exclude<SectionKey, null>) {
  const [activeSection, setActiveSection] = React.useState<SectionKey>(defaultSection);
  const refs = React.useRef<Record<string, HTMLElement | null>>({});

  const registerRef = React.useCallback((key: string) => {
    return (node: HTMLElement | null) => {
      refs.current[key] = node;
    };
  }, []);

  const scrollToSection = React.useCallback((key: Exclude<SectionKey, null>) => {
    window.location.hash = key;
    setActiveSection(key);
    refs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  React.useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace("#", "") || defaultSection;
      const next = refs.current[hash];
      if (next) {
        next.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(hash as Exclude<SectionKey, null>);
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [defaultSection]);

  return { activeSection, scrollToSection, registerRef };
}

function SiteHeader({
  menu,
  navigateTo,
  getMenuItemTarget,
  hoveredIndex,
  handleEnter,
  handleLeave,
  hoverTimeout,
  mobileOpen,
  setMobileOpen,
  openIndex,
  setOpenIndex,
  showHero = false,
}: HeaderProps) {
  return (
    <header className={`relative bg-[#0C63AB] text-[#FFFDF6] ${showHero ? "overflow-hidden" : "overflow-visible z-40"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(248,212,0,0.16),transparent_28%),linear-gradient(180deg,rgba(12,99,171,0)_0%,rgba(7,53,99,0.55)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={() => navigateTo("home")} className="text-xl font-semibold tracking-tight">
            Inspire
          </button>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="#" className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/90 transition hover:bg-white/10">
              Contact
            </a>
            <a href="#" className="rounded-full bg-[#F8D400] px-5 py-2.5 text-sm font-medium text-[#12304F] transition hover:-translate-y-0.5 hover:bg-[#FFE45C]">
              후원하기
            </a>
          </div>

          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-full border border-white/20 p-3 lg:hidden" aria-label="Open mobile menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="relative mt-8 hidden border-t border-white/15 pt-4 lg:block" onMouseLeave={handleLeave}>
          <div className="flex items-center gap-8">
            {menu.map((section, idx) => (
              <button key={section.title} type="button" onMouseEnter={() => handleEnter(idx)} className="flex items-center gap-1 py-2 text-sm font-medium text-white/90 transition hover:text-white">
                {section.title}
                <ChevronDown className={`h-4 w-4 transition duration-200 ${hoveredIndex === idx ? "rotate-180" : ""}`} />
              </button>
            ))}
          </div>

          <div
            className={`absolute left-0 right-0 top-full z-30 pt-4 transition duration-200 ${
              hoveredIndex !== null ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            }}
          >
            {hoveredIndex !== null && (
              <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#7FA7C9]/25 bg-[#FFFDF6]/95 px-10 py-10 text-[#12304F] shadow-2xl backdrop-blur">
                <div className="grid grid-cols-[280px_1fr] gap-12">
                  <div className="border-r border-[#7FA7C9]/35 pr-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7FA7C9]">{menu[hoveredIndex].title}</p>
                    {routeForMenuTitle(menu[hoveredIndex].title) ? (
                      <button type="button" onClick={() => navigateTo(routeForMenuTitle(menu[hoveredIndex].title) as RouteKey)} className="mt-3 inline-flex text-2xl font-light text-[#12304F] transition hover:text-[#0C63AB]">
                        {menu[hoveredIndex].title}
                      </button>
                    ) : (
                      <h3 className="mt-3 text-2xl font-light text-[#12304F]">{menu[hoveredIndex].title}</h3>
                    )}
                    <p className="mt-3 text-sm leading-7 text-[#4A6787]">{menu[hoveredIndex].highlight}</p>
                  </div>

                  <div className="grid grid-cols-4 gap-x-10 gap-y-4">
                    {menu[hoveredIndex].items.map((item) => {
                      const itemTarget = getMenuItemTarget(menu[hoveredIndex].title, item);
                      return (
                        <button key={item} type="button" onClick={() => itemTarget && navigateTo(itemTarget.route, itemTarget.section ?? null)} className="group/item flex w-full items-center justify-between border-b border-[#7FA7C9]/25 py-3 text-left text-sm text-[#25486B] transition hover:text-[#0C63AB]">
                          <span>{item}</span>
                          <ChevronRight className="h-4 w-4 opacity-0 transition group-hover/item:opacity-100" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {showHero && (
          <section className="py-20 lg:py-28">
            <div className="max-w-6xl">
              <p className="text-sm uppercase tracking-[0.42em] text-white/65">We Are Inspire</p>
              <h1 className="mt-6 max-w-5xl text-4xl font-light leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                Inspire a Soul with the Word
                <br />
                Inspire all Church with a Soul
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                인스파이어(inspire)는 하나님의 말씀을 통해 한 영혼을 일깨우고(inspire), 그를 통해 모든교회를 격려하여(inspire) 건강하게 세우는 말씀사역단체입니다.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button type="button" onClick={() => navigateTo("about", "vision-mission")} className="inline-flex items-center gap-2 rounded-full bg-[#F8D400] px-6 py-3 text-sm font-medium text-[#12304F] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#FFE45C]">
                  사역 소개 보기
                  <ChevronRight className="h-4 w-4" />
                </button>
                <a href="#" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15">
                  <Play className="h-4 w-4" />
                  예배 Live
                </a>
              </div>
            </div>
          </section>
        )}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#FFFDF6] p-6 text-[#12304F] shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Menu</p>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-full p-2 text-[#25486B] transition hover:bg-[#E9E38A]/40" aria-label="Close mobile menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {menu.map((section, idx) => (
                <div key={section.title} className="border-b border-[#7FA7C9]/35 pb-3">
                  <button type="button" onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="flex w-full items-center justify-between text-left text-base font-medium">
                    {section.title}
                    <ChevronDown className={`h-4 w-4 transition ${openIndex === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openIndex === idx && (
                    <div className="mt-3 space-y-2">
                      {section.items.map((item) => {
                        const itemTarget = getMenuItemTarget(section.title, item);
                        return (
                          <button key={item} type="button" onClick={() => itemTarget && navigateTo(itemTarget.route, itemTarget.section ?? null)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-[#4A6787] transition hover:bg-[#E9E38A]/40">
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[#7FA7C9]/35 bg-[#F7F4D6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_1fr] lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#5E7C9D]">Inspire Ministry</p>
          <h4 className="mt-4 text-2xl font-light">복음으로 한 영혼과 교회를 세우는 사역</h4>
          <p className="mt-4 max-w-xl leading-7 text-[#4A6787]">실제 운영 시에는 이 자리에 주소, 대표 이메일, 전화번호, 후원 계좌, 예배 장소, 저작권 정보를 넣으면 됩니다.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#12304F]">Contact</p>
            <ul className="mt-4 space-y-3 text-[#4A6787]">
              <li>서울시 ○○구 ○○로 00</li>
              <li>hello@inspireministry.kr</li>
              <li>02-000-0000</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-[#12304F]">Links</p>
            <ul className="mt-4 space-y-3 text-[#4A6787]">
              <li><a href="#">개인정보처리방침</a></li>
              <li><a href="#">이용약관</a></li>
              <li><a href="#">후원 안내</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageHero({ eyebrow, title, description, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0C63AB] text-[#FFFDF6]">
      <div className="absolute inset-0 opacity-35">
        <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center lg:py-32">
        <p className="text-sm uppercase tracking-[0.42em] text-white/70">{eyebrow}</p>
        <h1 className="mt-7 text-3xl font-light leading-[1.08] tracking-[-0.035em] md:text-5xl lg:text-6xl">{title}</h1>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/80 md:text-lg">{description}</p>
      </div>
    </section>
  );
}

function SectionTabs({ items, activeSection, onSelect }: SectionTabsProps) {
  return (
    <section className="sticky top-0 z-30 border-b border-[#7FA7C9]/30 bg-[#FFFDF6]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl justify-center gap-3 overflow-x-auto px-6 py-4 lg:px-10">
        {items.map((item) => (
          <button key={item.key} type="button" onClick={() => onSelect(item.key)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${activeSection === item.key ? "bg-[#0C63AB] text-[#FFFDF6]" : "text-[#4A6787] hover:bg-[#F7F4D6]"}`}>
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function SplitSection({ id, registerRef, eyebrow, title, body, image, imageAlt }: SplitSectionProps) {
  return (
    <section ref={registerRef(id)} id={id} className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="max-w-lg">
          <p className="text-sm uppercase tracking-[0.28em] text-[#0C63AB]">{eyebrow}</p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-[-0.03em] lg:text-5xl">{title}</h2>
          <p className="mt-6 text-base leading-8 text-[#4A6787] lg:text-lg">{body}</p>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-[#FFFDF6]">
          <img src={image} alt={imageAlt} className="aspect-[4/5] w-full object-cover object-center transition duration-700 hover:scale-[1.03] lg:aspect-[5/4]" />
        </div>
      </div>
    </section>
  );
}

function InfoCards({ items }: { items: string[][] }) {
  return (
    <section className="bg-[#F7F4D6] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(([title, body]) => (
            <article key={title} className="rounded-[2rem] bg-[#FFFDF6] p-8">
              <h3 className="text-2xl font-light text-[#12304F]">{title}</h3>
              <p className="mt-4 leading-8 text-[#4A6787]">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPage(props: Omit<HeaderProps, "showHero">) {
  const { activeSection, scrollToSection, registerRef } = useSectionNavigation("vision-mission");

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-[#12304F]">
      <SiteHeader {...props} showHero={false} />
      <PageHero
        eyebrow="About"
        title={
          <>
            <span>하나님의 말씀으로</span>
            <br />
            <span>모든 곳을 채우는 Inspire</span>
          </>
        }
        description="인스파이어의 비전과 사역의 방향, 그리고 함께 걸어갈 사람과 질문에 대한 안내를 한 곳에 담았습니다."
        image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80"
        imageAlt="About background"
      />
      <main>
        <SectionTabs items={[{ key: "vision-mission", label: "Vision & Mission" }, { key: "representative", label: "대표 소개" }, { key: "faq", label: "FAQ" }]} activeSection={activeSection} onSelect={scrollToSection} />

        <section ref={registerRef("vision-mission")} id="vision-mission" className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#0C63AB]">Vision & Mission</p>
          <h2 className="mt-7 text-3xl font-light leading-[1.12] tracking-[-0.035em] md:text-4xl lg:text-5xl">
            Inspire All with The Word!
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-[#4A6787]">Inspire는 in(안으로)과 spire(숨을 불어넣다)가 합쳐진 단어입니다. 인스파이어(Inspire) 모든 곳에 하나님의 말씀을 불어넣는 말씀사역단체입니다. </p>
        </section>

        <section className="bg-[#F7F4D6] py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h3 className="text-2xl font-light leading-relaxed md:text-3xl">
              "Inspire a Soul with the Word,
              <br />
              Inspire all Church with a Soul"
            </h3>
          </div>
        </section>

        <SplitSection id="representative" registerRef={registerRef} eyebrow="Representative" title="Who We Are" body="
          샬롬! 인스파이어 대표 김세형 목사입니다.오랜시간 청년사역의 현장에서 깨닫게 된 진리는 우리 하나님은 전능하신 분이라는 것입니다.
          현실은 교회들의 미래가 걱정될 정도로 청년들이 교회를 떠나가고 있지만, 전능하신 주님께서 이 땅의 청년들에게 다시 숨결을 불어넣어 부흥의 파도를 일으키시리라 확신합니다. 
          이를 위해 말씀사역단체인 인스파이어는 각 지역교회 청년들이 자신의 교회를 떠나지 않고도 말씀으로 채워지고, 훈련되어 부흥을 일으키는 예수님의 신실한 제자가 되도록 그들을 지원하며 섬기고자 합니다.
          이스라엘 역사상 가장 암울한 시대에 거룩하고 순결한 7,000명을 예비하신 것처럼 인스파이어를 통해 이 시대에 예수님의 순결하고 신실한 제자들이 준비되고 예비되길 소망합니다." image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=80" imageAlt="대표 소개" />

        <section ref={registerRef("faq")} id="faq" className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#0C63AB]">FAQ</p>
            <h2 className="mt-4 text-3xl font-light md:text-4xl">자주 묻는 질문</h2>
          </div>
          <div className="mt-12 space-y-4">
            {[
              ["인스파이어는 어떤 단체인가요?", "하나님의 말씀으로 모든 곳(한 영혼, 지역교회들, 예배, 음악 등)을 채우는 청년말씀사역단체입니다."],
              ["누가 참여할 수 있나요?", "지역교회 성도, 청년공동체, 사역자 등 말씀과 훈련이 필요한 누구나 함께할 수 있습니다."],
              ["사역 협력은 어떻게 문의하나요?", "후원 및 협력 문의 메뉴를 통해 연결하거나 대표 이메일로 문의할 수 있습니다."],
            ].map(([question, answer]) => (
              <article key={question} className="rounded-[1.5rem] border border-[#7FA7C9]/35 bg-[#FFFDF6] p-6">
                <h3 className="text-lg font-medium text-[#12304F]">{question}</h3>
                <p className="mt-3 leading-7 text-[#4A6787]">{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ForOneSoulPage(props: Omit<HeaderProps, "showHero">) {
  const { activeSection, scrollToSection, registerRef } = useSectionNavigation("seoul-tuesday-service");

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-[#12304F]">
      <SiteHeader {...props} showHero={false} />
      <PageHero
        eyebrow="For One Soul"
        title={
          <>
            <span>Inspire One Soul</span>
            <br />
            <span>with The Word!</span>
          </>
        }
        description="하나님의 말씀으로 한 영혼을 채우는 인스파이어!"
        image="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80"
        imageAlt="예배 배경"
      />
      <main>
        <SectionTabs items={[{ key: "seoul-tuesday-service", label: "서울화요말씀집회" }, { key: "discipleship", label: "제자훈련" }]} activeSection={activeSection} onSelect={scrollToSection} />
        <SplitSection id="seoul-tuesday-service" registerRef={registerRef} eyebrow="Seoul Bible Worship" title="한 영혼을 말씀전문가로 양성하는 Inspire 정기말씀집회"
              body="인스파이어 서울말씀집회는 하나님의 말씀을 더욱 깊이 연구하고 지켜내기 위한 인스파이어 정기집회입니다. 하나님의 말씀으로 한 영혼이 충만히 채워져 늘 새 힘과 능력으로 우리 교회들을 세우고 부흥시키기를 소망합니다. ★ 서울말씀집회를 시작으로 각 지역말씀집회로 확장될 예정입니다" image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80" imageAlt="서울화요말씀집회" />
        <InfoCards items={[["예배 중심", "정기적인 말씀집회와 예배를 통해 한 영혼의 삶을 실제로 다시 세웁니다."], ["말씀 중심", "집회의 강론과 찬양, 전체 흐름이 같은 메시지를 향하도록 구성됩니다."], ["교회 중심", "개인의 변화가 지역교회와 공동체를 건강하게 세우도록 돕습니다."]]} />
        <SplitSection
          id="discipleship"
          registerRef={registerRef}
          eyebrow="Discipleship Training"
          title={
            <>
              <span>한 영혼을 예수님의 온전한 제자로 세우는</span>
              <br />
              <span>Inspire 제자훈련</span>
            </>
          }
          body="인스파이어 제자훈련은 청년 제자훈련프로그램을 받을 수 없는 지역교회 청년들을 대상으로 진행됩니다. 인스파이어는 말씀으로 채워진 청년들이 더욱 힘있게 자신의 교회를 섬기며 세워나갈 수 있도록 지속적인 지원을 아낌없이 제공합니다."
          image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80"
          imageAlt="제자훈련"
        />
      </main>
      <SiteFooter />
    </div>
  );
}

function ForAllChurchPage(props: Omit<HeaderProps, "showHero">) {
  const { activeSection, scrollToSection, registerRef } = useSectionNavigation("youth-training");

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-[#12304F]">
      <SiteHeader {...props} showHero={false} />
      <PageHero
        eyebrow="For All Church"
        title={
          <>
            <span>Inspire the Church with The Word!</span>
          </>
        }
        description="하나님의 말씀으로 한 영혼을 채우는 인스파이어!"
        image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80"
        imageAlt="사역 지원 배경"
      />
      <main>
        <SectionTabs items={[{ key: "youth-training", label: "청년공동체 제자훈련 지원" }, { key: "mission-support", label: "청년사역자, 해외선교사 지원" }]} activeSection={activeSection} onSelect={scrollToSection} />
        <SplitSection
          id="youth-training"
          registerRef={registerRef}
          eyebrow="Youth Community"
          title={
            <>
              <span>지역교회 청년공동체를 말씀중심 공동체로!</span>
              <br />
              <span>Inspire 교회지원 사역</span>
            </>
          }
          body="청년공동체 제자훈련 지원은 지역교회가 감당해야 할 핵심 사역에 더 집중할 수 있도록, 훈련과 운영, 실제 프로그램을 함께 설계하고 지원하는 사역입니다."
          image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80"
          imageAlt="청년공동체 제자훈련 지원"
        />
        <InfoCards items={[["현장 중심", "각 교회의 상황에 맞는 실제적이고 유연한 지원 구조를 설계합니다."], ["집중 지원", "핵심 사역에 더 집중할 수 있도록 인력과 시간의 부담을 덜어줍니다."], ["지속 가능성", "단발성 이벤트가 아니라 장기적으로 이어질 수 있는 구조를 만듭니다."]]} />
        <SplitSection
          id="mission-support"
          registerRef={registerRef}
          eyebrow="Support Ministry"
          title={
            <>
              <span>교회의 미래를 위한</span>
              <br />
              <span>청년사역자, 해외선교사 지원사역</span>
            </>
          }
          body="청년목회자, 청년선교사를 위한 Inspire 의료지원 사역"
          image="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=80"
          imageAlt="청년사역자, 해외선교사 지원"
        />
      </main>
      <SiteFooter />
    </div>
  );
}

function JoinUsPage(props: Omit<HeaderProps, "showHero">) {
  const { activeSection, scrollToSection, registerRef } = useSectionNavigation("support");

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-[#12304F]">
      <SiteHeader {...props} showHero={false} />
      <PageHero
        eyebrow="Join Us"
        title={
          <>
            <span>함께 기도하고,</span>
            <br />
            <span>함께 세워갈 수 있습니다</span>
          </>
        }
        description="인스파이어의 사역에 동참하는 가장 직접적인 방법은 후원입니다. 한 영혼과 교회를 세우는 일에 함께 참여해 주세요."
        image="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80"
        imageAlt="Join Us background"
      />
      <main>
        <SectionTabs items={[{ key: "support", label: "후원하기" }]} activeSection={activeSection} onSelect={scrollToSection} />
        <section ref={registerRef("support")} id="support" className="mx-auto max-w-7xl px-8 py-16 lg:px-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div className="max-w-lg">
              <p className="text-sm uppercase tracking-[0.25em] text-[#0C63AB]">Support</p>
              <h2 className="mt-5 text-4xl font-light leading-tight lg:text-5xl">한 영혼과 교회를 세우는 후원</h2>
              <p className="mt-6 text-base leading-8 text-[#4A6787] lg:text-lg">후원은 인스파이어의 예배, 제자훈련, 교회 지원 사역이 지속되도록 돕는 가장 실제적인 동참입니다. 정기후원과 일시후원을 통해 사역의 필요를 함께 감당할 수 있습니다.</p>
            </div>
            <div className="rounded-[2rem] bg-[#F7F4D6] p-8 lg:p-10">
              <p className="text-sm uppercase tracking-[0.25em] text-[#0C63AB]">Giving Guide</p>
              <h3 className="mt-4 text-3xl font-light">후원 안내</h3>
              <div className="mt-8 space-y-5 text-[#4A6787]">
                {[["정기후원", "매월 정해진 금액으로 사역을 지속적으로 지원합니다."], ["일시후원", "특정 필요와 프로젝트를 위해 자유롭게 후원할 수 있습니다."], ["계좌 안내", "실제 운영 시 이곳에 은행명, 계좌번호, 예금주 정보를 넣으면 됩니다."]].map(([title, body]) => (
                  <div key={title}>
                    <p className="text-sm font-medium text-[#12304F]">{title}</p>
                    <p className="mt-2 leading-7">{body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#" className="inline-flex items-center gap-2 rounded-full bg-[#0C63AB] px-6 py-3 text-sm font-medium text-[#FFFDF6] transition hover:-translate-y-0.5">
                  정기후원 신청
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-full border border-[#7FA7C9]/35 px-6 py-3 text-sm font-medium text-[#12304F] transition hover:bg-white/70">
                  일시후원 안내
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function ChurchHomepageMockup() {
  const [route, setRoute] = React.useState<RouteKey>("home");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const hoverTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const storyCarouselRef = React.useRef<HTMLDivElement | null>(null);

  const navigateTo = (nextRoute: RouteKey, section: SectionKey = null) => {
    setRoute(nextRoute);
    setHoveredIndex(null);
    setMobileOpen(false);
    setOpenIndex(null);
    requestAnimationFrame(() => {
      if (["about", "for-one-soul", "for-all-church", "join-us"].includes(nextRoute) && section) {
        window.location.hash = section;
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const getMenuItemTarget = (sectionTitle: string, item: string): MenuTarget | null => {
    const map: Record<string, MenuTarget> = {
      "About:Vision & Mission": { route: "about", section: "vision-mission" },
      "About:대표 소개": { route: "about", section: "representative" },
      "About:FAQ": { route: "about", section: "faq" },
      "For One Soul:서울화요말씀집회": { route: "for-one-soul", section: "seoul-tuesday-service" },
      "For One Soul:제자훈련": { route: "for-one-soul", section: "discipleship" },
      "For All Church:청년공동체 제자훈련 지원": { route: "for-all-church", section: "youth-training" },
      "For All Church:청년사역자, 해외선교사 지원": { route: "for-all-church", section: "mission-support" },
      "Join Us:후원하기": { route: "join-us", section: "support" },
    };
    return map[`${sectionTitle}:${item}`] ?? null;
  };

  const handleEnter = (idx: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredIndex(idx);
  };

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => setHoveredIndex(null), 150);
  };

  const scrollStories = (direction: "left" | "right") => {
    storyCarouselRef.current?.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  const headerProps = { menu, navigateTo, getMenuItemTarget, hoveredIndex, handleEnter, handleLeave, hoverTimeout, mobileOpen, setMobileOpen, openIndex, setOpenIndex };

  if (route === "about") return <AboutPage {...headerProps} />;
  if (route === "for-one-soul") return <ForOneSoulPage {...headerProps} />;
  if (route === "for-all-church") return <ForAllChurchPage {...headerProps} />;
  if (route === "join-us") return <JoinUsPage {...headerProps} />;

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-[#12304F]">
      <SiteHeader {...headerProps} showHero />
      <main>
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#0C63AB]">Ministry</p>
              <h3 className="mt-5 text-3xl font-light leading-tight tracking-[-0.035em] lg:text-5xl">
                이 외의 일은 고사하고
                <br />
                날마다 내 속에 눌리는 일이 있으니
                <br />
                곧 모든 교회를 위하여 염려하는 것이라
              </h3>
              <p className="mt-6 text-lg leading-8 text-[#4A6787]">교회와 한 영혼을 향한 부담에서 시작된 사역입니다. 말씀과 제자훈련을 통해 실제 삶의 변화가 일어나도록 돕습니다.</p>
            </div>
            <div className="space-y-5">
              {ministries.map((item) => (
                <article key={item.title} className="rounded-[2rem] border border-[#7FA7C9]/25 bg-white/70 p-7 transition hover:-translate-y-1">
                  <div className="flex items-start gap-5">
                    <div className="text-3xl font-light text-[#0C63AB]">{item.number}</div>
                    <div>
                      <h4 className="text-2xl font-light">{item.title}</h4>
                      <p className="mt-3 leading-7 text-[#4A6787]">{item.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#0C63AB]">Story / Notice</p>
              <h3 className="mt-4 text-3xl font-light lg:text-5xl">사역 소식과 이야기</h3>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <button type="button" onClick={() => scrollStories("left")} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#7FA7C9]/35 text-[#25486B] transition hover:border-[#7FA7C9] hover:bg-[#E9E38A]/40" aria-label="이전 스토리 보기">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <button type="button" onClick={() => scrollStories("right")} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#7FA7C9]/35 text-[#25486B] transition hover:border-[#7FA7C9] hover:bg-[#E9E38A]/40" aria-label="다음 스토리 보기">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-12">
            <div ref={storyCarouselRef} className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
              {stories.map((post) => (
                <article key={post.id} className="min-w-[280px] max-w-[280px] overflow-hidden rounded-[2rem] border border-[#7FA7C9]/35 bg-[#FFFDF6] transition hover:-translate-y-1 hover:shadow-sm">
                  <img src={post.image} alt={post.caption} className="h-48 w-full object-cover" />
                  <div className="p-6">
                    <p className="text-sm text-[#5E7C9D]">Story</p>
                    <h4 className="mt-3 text-lg font-light leading-snug">{post.caption}</h4>
                    <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm text-[#0C63AB]">
                      자세히 보기
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0C63AB] py-24 text-[#FFFDF6]">
          <div className="relative mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_1fr] lg:px-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Call To Action</p>
              <h3 className="mt-5 text-3xl font-light leading-tight tracking-[-0.035em] lg:text-5xl">
                함께 기도하고,
                <br />
                함께 세워갈 수 있습니다.
              </h3>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">후원, 협력 문의, 뉴스레터 구독 등 참여 동선을 따로 모아두면 실제 전환율이 올라갑니다.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["정기후원 신청", "후원 안내", "뉴스레터 구독", "예배/집회 안내"].map((item) => (
                <a key={item} href="#" className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6 transition hover:bg-white/15">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg">{item}</span>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

