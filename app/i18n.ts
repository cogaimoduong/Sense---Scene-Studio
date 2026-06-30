export const localeOptions = [
  { code: "en", short: "EN", label: "English" },
  { code: "vi", short: "VI", label: "Tiếng Việt" },
  { code: "zh", short: "中文", label: "中文" },
  { code: "ja", short: "日本", label: "日本語" },
  { code: "ko", short: "한국", label: "한국어" },
] as const;

export type Locale = (typeof localeOptions)[number]["code"];

type Translation = {
  a11y: {
    home: string;
    primaryNavigation: string;
    mobileNavigation: string;
    openMenu: string;
    closeMenu: string;
    selectLanguage: string;
  };
  nav: {
    services: string;
    projects: string;
    studio: string;
    contact: string;
    startProject: string;
  };
  hero: {
    studioType: string;
    location: string;
    independent: string;
    disciplines: string;
    promise: string;
    selectedWork: string;
  };
  ticker: [string, string, string];
  statement: {
    label: string;
    lines: [string, string, string];
    body: string;
  };
  services: {
    label: string;
    heading: [string, string];
    intro: string;
    discuss: string;
    items: Array<{ title: string; description: string; tags: [string, string, string] }>;
  };
  projects: {
    label: string;
    heading: [string, string];
    intro: string;
    items: Array<{ title: string; type: string }>;
  };
  bridge: [string, string, string];
  about: {
    label: string;
    body: string;
    facts: [string, string, string];
    labLabel: string;
    openPractice: string;
    labKeywords: string;
    labHeading: [string, string];
    labBody: string;
    labCta: string;
  };
  footer: {
    prompt: string;
    heading: [string, string];
    social: string;
    studio: string;
    availability: string;
    booking: string;
    copyright: string;
  };
};

export const translations: Record<Locale, Translation> = {
  en: {
    a11y: {
      home: "Sense and Scene Studio home",
      primaryNavigation: "Primary navigation",
      mobileNavigation: "Mobile navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      selectLanguage: "Select language",
    },
    nav: { services: "Services", projects: "Projects", studio: "Studio", contact: "Contact", startProject: "Start a project" },
    hero: {
      studioType: "Visual technology studio",
      location: "Saigon / Vietnam",
      independent: "Independent / 2026",
      disciplines: "CGI · Motion · Spatial · New Media",
      promise: "We turn ambitious ideas into images people remember.",
      selectedWork: "Selected work",
    },
    ticker: ["IMAGE IS MATERIAL", "MOTION IS LANGUAGE", "TECHNOLOGY IS EMOTION"],
    statement: {
      label: "Our point of view",
      lines: ["BESPOKE VISUAL", "WORLDS BUILT FOR", "YOUR STORY."],
      body: "No templates. No generic frames. Every visual system begins with the identity, space and emotion unique to your project.",
    },
    services: {
      label: "Capabilities",
      heading: ["From first thought", "to final frame."],
      intro: "One senior-led team across concept, CGI, motion and creative technology.",
      discuss: "Discuss a capability",
      items: [
        { title: "Creative Direction", description: "A clear visual world, built from the idea out.", tags: ["Concept & treatment", "Campaign systems", "Visual language"] },
        { title: "CGI & Motion", description: "High-fidelity images and films that make the impossible tangible.", tags: ["3D animation", "Product films", "Motion identity"] },
        { title: "Spatial Visuals", description: "Content designed for architecture, screens and shared spaces.", tags: ["Projection mapping", "Immersive content", "Digital installation"] },
        { title: "R&D / New Media", description: "Prototypes that turn emerging tools into meaningful experiences.", tags: ["Real-time graphics", "Generative systems", "Creative technology"] },
      ],
    },
    projects: {
      label: "Selected work",
      heading: ["Scenes with", "staying power."],
      intro: "Selected commissions, experiments and moving worlds from 2025—2026.",
      items: [
        { title: "Virtual360 Showreel", type: "Film / Virtual360" },
        { title: "Hospitality Panorama", type: "Hospitality / Panorama" },
        { title: "Workspace 360", type: "Coworking / Virtual Tour" },
        { title: "Real Estate Immersion", type: "Real Estate / Virtual360" },
      ],
    },
    bridge: ["SCENES", "BETWEEN", "SENSES"],
    about: {
      label: "The studio",
      body: "We are a visual technology studio where image, space and feeling become one. Through CGI, motion and creative R&D, we build scenes that stay with people.",
      facts: ["Core disciplines", "Senior-led team", "Ways to imagine"],
      labLabel: "Lab",
      openPractice: "Open practice",
      labKeywords: "Research / Prototype / Test",
      labHeading: ["Technology is our material.", "Emotion is our measure."],
      labBody: "We prototype with real-time tools, procedural systems and spatial media—then translate the useful discoveries into work that earns attention.",
      labCta: "Build something new",
    },
    footer: {
      prompt: "Start a conversation",
      heading: ["Have a scene", "in mind?"],
      social: "Social",
      studio: "Studio",
      availability: "Availability",
      booking: "Booking Q3 / 2026",
      copyright: "© 2026 Sense & Scene",
    },
  },
  vi: {
    a11y: {
      home: "Trang chủ Sense & Scene Studio",
      primaryNavigation: "Điều hướng chính",
      mobileNavigation: "Điều hướng di động",
      openMenu: "Mở menu",
      closeMenu: "Đóng menu",
      selectLanguage: "Chọn ngôn ngữ",
    },
    nav: { services: "Dịch vụ", projects: "Dự án", studio: "Studio", contact: "Liên hệ", startProject: "Bắt đầu dự án" },
    hero: {
      studioType: "Studio công nghệ hình ảnh",
      location: "Sài Gòn / Việt Nam",
      independent: "Độc lập / 2026",
      disciplines: "CGI · Chuyển động · Không gian · Truyền thông mới",
      promise: "Chúng tôi biến những ý tưởng tham vọng thành hình ảnh khiến người xem ghi nhớ.",
      selectedWork: "Dự án chọn lọc",
    },
    ticker: ["HÌNH ẢNH LÀ CHẤT LIỆU", "CHUYỂN ĐỘNG LÀ NGÔN NGỮ", "CÔNG NGHỆ CŨNG CÓ CẢM XÚC"],
    statement: {
      label: "Quan điểm của chúng tôi",
      lines: ["THẾ GIỚI HÌNH ẢNH", "ĐỘC BẢN DÀNH CHO", "CÂU CHUYỆN CỦA BẠN."],
      body: "Không khuôn mẫu. Không khung hình đại trà. Mỗi hệ thống hình ảnh đều bắt đầu từ bản sắc, không gian và cảm xúc riêng của dự án.",
    },
    services: {
      label: "Năng lực",
      heading: ["Từ ý tưởng đầu tiên", "đến khung hình cuối."],
      intro: "Một đội ngũ giàu kinh nghiệm xuyên suốt ý tưởng, CGI, chuyển động và công nghệ sáng tạo.",
      discuss: "Trao đổi về dịch vụ",
      items: [
        { title: "Định hướng sáng tạo", description: "Xây dựng một thế giới hình ảnh rõ ràng từ chính cốt lõi ý tưởng.", tags: ["Ý tưởng & đề xuất", "Hệ thống chiến dịch", "Ngôn ngữ hình ảnh"] },
        { title: "CGI & Chuyển động", description: "Hình ảnh và phim chất lượng cao, biến điều không thể thành trải nghiệm hữu hình.", tags: ["Hoạt hình 3D", "Phim sản phẩm", "Nhận diện chuyển động"] },
        { title: "Hình ảnh không gian", description: "Nội dung được thiết kế riêng cho kiến trúc, màn hình và không gian cộng đồng.", tags: ["Trình chiếu ánh xạ", "Nội dung nhập vai", "Sắp đặt kỹ thuật số"] },
        { title: "R&D / Truyền thông mới", description: "Biến công cụ mới thành những nguyên mẫu trải nghiệm có giá trị thực tiễn.", tags: ["Đồ họa thời gian thực", "Hệ thống tạo sinh", "Công nghệ sáng tạo"] },
      ],
    },
    projects: {
      label: "Dự án chọn lọc",
      heading: ["Những khung cảnh", "đọng lại dài lâu."],
      intro: "Tuyển chọn dự án thương mại, thử nghiệm và thế giới chuyển động giai đoạn 2025—2026.",
      items: [
        { title: "Trình diễn Virtual360", type: "Phim / Virtual360" },
        { title: "Toàn cảnh lưu trú", type: "Khách sạn / Panorama" },
        { title: "Không gian làm việc 360", type: "Coworking / Tham quan ảo" },
        { title: "Bất động sản nhập vai", type: "Bất động sản / Virtual360" },
      ],
    },
    bridge: ["KHUNG CẢNH", "GIỮA NHỮNG", "GIÁC QUAN"],
    about: {
      label: "Về studio",
      body: "Chúng tôi là studio công nghệ hình ảnh, nơi hình ảnh, không gian và cảm xúc hòa làm một. Qua CGI, chuyển động và R&D sáng tạo, chúng tôi tạo nên những khung cảnh còn đọng lại trong tâm trí.",
      facts: ["Lĩnh vực cốt lõi", "Đội ngũ giàu kinh nghiệm", "Khả năng tưởng tượng"],
      labLabel: "Phòng lab",
      openPractice: "Thực hành mở",
      labKeywords: "Nghiên cứu / Nguyên mẫu / Thử nghiệm",
      labHeading: ["Công nghệ là chất liệu.", "Cảm xúc là thước đo."],
      labBody: "Chúng tôi thử nghiệm công cụ thời gian thực, hệ thống thủ tục và truyền thông không gian, rồi chuyển những khám phá hữu ích thành tác phẩm đủ sức thu hút.",
      labCta: "Cùng tạo điều mới",
    },
    footer: {
      prompt: "Bắt đầu cuộc trò chuyện",
      heading: ["Bạn đang hình dung", "một khung cảnh?"],
      social: "Mạng xã hội",
      studio: "Studio",
      availability: "Lịch nhận dự án",
      booking: "Nhận dự án Quý 3 / 2026",
      copyright: "© 2026 Sense & Scene",
    },
  },
  zh: {
    a11y: {
      home: "Sense & Scene Studio 首页",
      primaryNavigation: "主导航",
      mobileNavigation: "移动端导航",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
      selectLanguage: "选择语言",
    },
    nav: { services: "服务", projects: "项目", studio: "工作室", contact: "联系", startProject: "启动项目" },
    hero: {
      studioType: "视觉科技工作室",
      location: "西贡 / 越南",
      independent: "独立工作室 / 2026",
      disciplines: "CGI · 动态影像 · 空间视觉 · 新媒体",
      promise: "我们把大胆构想转化为令人久久难忘的影像。",
      selectedWork: "精选项目",
    },
    ticker: ["图像即材料", "动态即语言", "科技亦有情感"],
    statement: {
      label: "我们的观点",
      lines: ["为每个故事", "打造独一无二的", "视觉世界。"],
      body: "拒绝模板，也拒绝千篇一律。每套视觉系统都从项目独有的身份、空间与情感出发。",
    },
    services: {
      label: "专业能力",
      heading: ["从最初构想", "到最终画面。"],
      intro: "由资深团队贯穿概念、CGI、动态影像与创意科技的每个环节。",
      discuss: "沟通合作方向",
      items: [
        { title: "创意指导", description: "从核心概念出发，建立清晰统一的视觉世界。", tags: ["概念与创意提案", "品牌传播系统", "视觉语言"] },
        { title: "CGI 与动态影像", description: "以高精度影像和影片，让不可能变得真实可感。", tags: ["三维动画", "产品影片", "动态视觉识别"] },
        { title: "空间视觉", description: "为建筑、屏幕与共享空间量身设计内容。", tags: ["投影映射", "沉浸式内容", "数字装置"] },
        { title: "研发 / 新媒体", description: "把前沿工具转化为有意义且可落地的体验原型。", tags: ["实时图形", "生成式系统", "创意科技"] },
      ],
    },
    projects: {
      label: "精选项目",
      heading: ["让画面", "被长久记住。"],
      intro: "精选 2025—2026 年的委托项目、实验作品与动态世界。",
      items: [
        { title: "Virtual360 影像集", type: "影片 / Virtual360" },
        { title: "旅宿全景", type: "酒店 / 全景影像" },
        { title: "360° 办公空间", type: "共享办公 / 虚拟导览" },
        { title: "沉浸式房产", type: "房地产 / Virtual360" },
      ],
    },
    bridge: ["场景", "游走于", "感知之间"],
    about: {
      label: "关于工作室",
      body: "我们是一家视觉科技工作室，让图像、空间与感受融为一体。通过 CGI、动态影像与创意研发，我们创造能够留在人们记忆中的场景。",
      facts: ["核心领域", "资深团队主导", "无限想象"],
      labLabel: "实验室",
      openPractice: "开放式实践",
      labKeywords: "研究 / 原型 / 测试",
      labHeading: ["科技是我们的材料。", "情感是我们的尺度。"],
      labBody: "我们运用实时工具、程序化系统与空间媒体进行原型实验，再把真正有价值的发现转化为值得关注的作品。",
      labCta: "共同创造新事物",
    },
    footer: {
      prompt: "开始对话",
      heading: ["心中已有", "一个场景？"],
      social: "社交平台",
      studio: "工作室",
      availability: "项目档期",
      booking: "开放预约：2026 年第三季度",
      copyright: "© 2026 Sense & Scene",
    },
  },
  ja: {
    a11y: {
      home: "Sense & Scene Studio ホーム",
      primaryNavigation: "メインナビゲーション",
      mobileNavigation: "モバイルナビゲーション",
      openMenu: "メニューを開く",
      closeMenu: "メニューを閉じる",
      selectLanguage: "言語を選択",
    },
    nav: { services: "サービス", projects: "プロジェクト", studio: "スタジオ", contact: "お問い合わせ", startProject: "プロジェクト相談" },
    hero: {
      studioType: "ビジュアルテクノロジースタジオ",
      location: "サイゴン / ベトナム",
      independent: "インディペンデント / 2026",
      disciplines: "CGI・モーション・空間演出・ニューメディア",
      promise: "意欲的なアイデアを、記憶に残るビジュアルへ。",
      selectedWork: "主なプロジェクト",
    },
    ticker: ["イメージは素材", "モーションは言語", "テクノロジーにも感情を"],
    statement: {
      label: "私たちの視点",
      lines: ["物語のためだけの", "唯一無二のビジュアル世界を", "設計します。"],
      body: "テンプレートも、ありきたりな表現も使いません。すべてのビジュアルシステムは、プロジェクト固有の個性、空間、感情から始まります。",
    },
    services: {
      label: "ケイパビリティ",
      heading: ["最初の発想から", "最後の一コマまで。"],
      intro: "経験豊富なチームが、企画、CGI、モーション、クリエイティブテクノロジーを一貫して担当します。",
      discuss: "サービスについて相談する",
      items: [
        { title: "クリエイティブディレクション", description: "アイデアの核から、明確なビジュアル世界を組み立てます。", tags: ["コンセプト設計", "キャンペーンシステム", "ビジュアル言語"] },
        { title: "CGI & モーション", description: "高精細な映像で、不可能なものに確かな存在感を与えます。", tags: ["3D アニメーション", "プロダクトフィルム", "モーションアイデンティティ"] },
        { title: "空間ビジュアル", description: "建築、スクリーン、共有空間のために最適化されたコンテンツ。", tags: ["プロジェクションマッピング", "没入型コンテンツ", "デジタルインスタレーション"] },
        { title: "R&D / ニューメディア", description: "新しい技術を、意味のある体験のプロトタイプへ変換します。", tags: ["リアルタイムグラフィックス", "生成システム", "クリエイティブテクノロジー"] },
      ],
    },
    projects: {
      label: "主なプロジェクト",
      heading: ["いつまでも心に残る", "シーンを。"],
      intro: "2025—2026 年のコミッションワーク、実験、動く世界から厳選。",
      items: [
        { title: "Virtual360 ショーリール", type: "映像 / Virtual360" },
        { title: "宿泊施設パノラマ", type: "ホスピタリティ / パノラマ" },
        { title: "ワークスペース 360", type: "コワーキング / バーチャルツアー" },
        { title: "不動産イマーシブ", type: "不動産 / Virtual360" },
      ],
    },
    bridge: ["シーン", "感覚の", "あいだに"],
    about: {
      label: "スタジオについて",
      body: "私たちは、イメージ、空間、感覚をひとつにするビジュアルテクノロジースタジオです。CGI、モーション、クリエイティブ R&D を通して、人の記憶に残るシーンを生み出します。",
      facts: ["コア領域", "シニア主導のチーム", "無限の想像力"],
      labLabel: "ラボ",
      openPractice: "オープンプラクティス",
      labKeywords: "リサーチ / プロトタイプ / テスト",
      labHeading: ["テクノロジーは素材。", "感情は判断基準。"],
      labBody: "リアルタイムツール、プロシージャルシステム、空間メディアで試作し、有効な発見を人の目を引く仕事へと磨き上げます。",
      labCta: "新しいものを一緒につくる",
    },
    footer: {
      prompt: "対話を始める",
      heading: ["思い描いている", "シーンはありますか？"],
      social: "ソーシャル",
      studio: "スタジオ",
      availability: "制作スケジュール",
      booking: "2026年 第3四半期 受付中",
      copyright: "© 2026 Sense & Scene",
    },
  },
  ko: {
    a11y: {
      home: "Sense & Scene Studio 홈",
      primaryNavigation: "주요 탐색",
      mobileNavigation: "모바일 탐색",
      openMenu: "메뉴 열기",
      closeMenu: "메뉴 닫기",
      selectLanguage: "언어 선택",
    },
    nav: { services: "서비스", projects: "프로젝트", studio: "스튜디오", contact: "문의", startProject: "프로젝트 시작" },
    hero: {
      studioType: "비주얼 테크놀로지 스튜디오",
      location: "사이공 / 베트남",
      independent: "인디펜던트 / 2026",
      disciplines: "CGI · 모션 · 공간 비주얼 · 뉴미디어",
      promise: "대담한 아이디어를 오래 기억되는 이미지로 만듭니다.",
      selectedWork: "주요 프로젝트",
    },
    ticker: ["이미지는 재료입니다", "모션은 언어입니다", "기술에도 감정이 있습니다"],
    statement: {
      label: "우리의 관점",
      lines: ["당신의 이야기를 위한", "단 하나의 비주얼 세계를", "설계합니다."],
      body: "템플릿도, 익숙한 프레임도 사용하지 않습니다. 모든 비주얼 시스템은 프로젝트만의 정체성, 공간, 감정에서 출발합니다.",
    },
    services: {
      label: "전문 역량",
      heading: ["첫 아이디어부터", "마지막 프레임까지."],
      intro: "경험 많은 팀이 콘셉트, CGI, 모션, 크리에이티브 테크놀로지를 하나의 흐름으로 이끕니다.",
      discuss: "서비스 상담하기",
      items: [
        { title: "크리에이티브 디렉션", description: "아이디어의 중심에서 명확한 비주얼 세계를 구축합니다.", tags: ["콘셉트 & 트리트먼트", "캠페인 시스템", "비주얼 언어"] },
        { title: "CGI & 모션", description: "고품질 이미지와 영상으로 불가능한 것에 실재감을 부여합니다.", tags: ["3D 애니메이션", "제품 필름", "모션 아이덴티티"] },
        { title: "공간 비주얼", description: "건축, 스크린, 공유 공간에 맞춘 콘텐츠를 설계합니다.", tags: ["프로젝션 매핑", "몰입형 콘텐츠", "디지털 인스톨레이션"] },
        { title: "R&D / 뉴미디어", description: "새로운 도구를 의미 있는 경험의 프로토타입으로 전환합니다.", tags: ["리얼타임 그래픽", "제너레이티브 시스템", "크리에이티브 테크놀로지"] },
      ],
    },
    projects: {
      label: "주요 프로젝트",
      heading: ["오래도록 기억되는", "장면을 만듭니다."],
      intro: "2025—2026년의 커미션, 실험, 움직이는 세계를 선별했습니다.",
      items: [
        { title: "Virtual360 쇼릴", type: "필름 / Virtual360" },
        { title: "호스피탈리티 파노라마", type: "숙박 / 파노라마" },
        { title: "워크스페이스 360", type: "코워킹 / 버추얼 투어" },
        { title: "부동산 몰입형 투어", type: "부동산 / Virtual360" },
      ],
    },
    bridge: ["장면", "감각과", "감각 사이"],
    about: {
      label: "스튜디오 소개",
      body: "우리는 이미지, 공간, 감각이 하나가 되는 비주얼 테크놀로지 스튜디오입니다. CGI, 모션, 크리에이티브 R&D를 통해 사람들의 기억에 남는 장면을 만듭니다.",
      facts: ["핵심 분야", "시니어 주도 팀", "무한한 상상"],
      labLabel: "랩",
      openPractice: "오픈 프랙티스",
      labKeywords: "리서치 / 프로토타입 / 테스트",
      labHeading: ["기술은 우리의 재료입니다.", "감정은 우리의 기준입니다."],
      labBody: "리얼타임 도구, 프로시저럴 시스템, 공간 미디어로 실험하고 유효한 발견을 주목받는 결과물로 발전시킵니다.",
      labCta: "새로운 것을 함께 만들기",
    },
    footer: {
      prompt: "대화 시작하기",
      heading: ["마음속에 떠오르는", "장면이 있나요?"],
      social: "소셜",
      studio: "스튜디오",
      availability: "프로젝트 일정",
      booking: "2026년 3분기 예약 가능",
      copyright: "© 2026 Sense & Scene",
    },
  },
};
