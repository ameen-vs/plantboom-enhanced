// React Components for PlantBoom Website

const {
  useState,
  useEffect,
  useRef
} = React;

// ========== Testimonials Component ==========
const TestimonialCard = ({
  testimonial,
  onHoverChange,
  isVisible,
  delay
}) => {
  const [visibleStars, setVisibleStars] = useState(0);
  useEffect(() => {
    if (!isVisible) {
      setVisibleStars(0);
      return;
    }
    let current = 0;
    setVisibleStars(0);
    const timer = setInterval(() => {
      current += 1;
      if (current > testimonial.rating) {
        clearInterval(timer);
        return;
      }
      setVisibleStars(current);
    }, 140);
    return () => clearInterval(timer);
  }, [testimonial.rating, isVisible]);
  return /*#__PURE__*/React.createElement("div", {
    className: `testimonial-card ${isVisible ? 'visible' : ''}`,
    onMouseEnter: () => onHoverChange(true),
    onMouseLeave: () => onHoverChange(false),
    style: {
      transitionDelay: isVisible ? `${delay}ms` : '0ms'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "testimonial-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "testimonial-avatar"
  }, testimonial.avatar), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, testimonial.name), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, testimonial.role))), /*#__PURE__*/React.createElement("div", {
    className: "testimonial-rating mb-2"
  }, [...Array(5)].map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    className: `fas fa-star star-icon ${i < visibleStars ? 'filled' : ''}`
  }))), /*#__PURE__*/React.createElement("p", {
    className: "testimonial-text"
  }, "\"", testimonial.text, "\""), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center text-muted"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-map-marker-alt ms-2"
  }), /*#__PURE__*/React.createElement("small", null, testimonial.location)));
};
const TestimonialsSection = () => {
  const testimonials = [{
    id: 1,
    name: "أحمد المنصوري",
    role: "مزارع",
    avatar: "أ",
    rating: 5,
    text: "منتج رائع جداً! استخدمته في حديقتي المنزلية وشاهدت نتائج مذهلة خلال أسبوعين فقط. النباتات أصبحت أكثر خضرة وحيوية.",
    location: "الرباط، المغرب"
  }, {
    id: 2,
    name: "فاطمة الزهراء",
    role: "صاحبة مشتل",
    avatar: "ف",
    rating: 5,
    text: "كمتخصصة في النباتات، أنصح به بشدة. جودة ممتازة وسعر مناسب. عملائي سعداء جداً بالنتائج.",
    location: "الدار البيضاء، المغرب"
  }, {
    id: 3,
    name: "كريم بنعلي",
    role: "مهندس زراعي",
    avatar: "ك",
    rating: 5,
    text: "منتج طبيعي 100% وفعال جداً. استخدمته في مشروعي الزراعي وحققت زيادة في الإنتاجية بنسبة 180%.",
    location: "مراكش، المغرب"
  }, {
    id: 4,
    name: "سلمى القاسمي",
    role: "هاوية زراعة",
    avatar: "س",
    rating: 5,
    text: "أفضل منتج جربته لنباتاتي المنزلية. سهل الاستخدام ونتائجه واضحة من أول استعمال. شكراً PlantBoom!",
    location: "فاس، المغرب"
  }, {
    id: 5,
    name: "يوسف الإدريسي",
    role: "مالك مزرعة",
    avatar: "ي",
    rating: 5,
    text: "استثمار رائع! وفرت الكثير من المال والوقت. محصولي أصبح أكثر جودة وكمية. أنصح به كل المزارعين.",
    location: "طنجة، المغرب"
  }, {
    id: 6,
    name: "نادية بنخليفة",
    role: "مصممة حدائق",
    avatar: "ن",
    rating: 5,
    text: "استخدمه في جميع مشاريعي. النتائج دائماً مبهرة والعملاء راضون. منتج يستحق الثقة.",
    location: "أكادير، المغرب"
  }];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef(null);
  const slidesCount = Math.ceil(testimonials.length / 3);
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setHasEntered(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.3
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (isPaused || !hasEntered) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= slidesCount) {
          return 0;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slidesCount, hasEntered]);
  const start = currentIndex * 3;
  const visibleTestimonials = testimonials.slice(start, start + 3);
  return /*#__PURE__*/React.createElement("div", {
    className: "testimonials-carousel",
    ref: containerRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-4 justify-content-center"
  }, visibleTestimonials.map((testimonial, index) => /*#__PURE__*/React.createElement("div", {
    key: testimonial.id,
    className: "col-lg-4 col-md-6"
  }, /*#__PURE__*/React.createElement(TestimonialCard, {
    testimonial: testimonial,
    onHoverChange: setIsPaused,
    isVisible: hasEntered,
    delay: index * 120
  })))), /*#__PURE__*/React.createElement("div", {
    className: "carousel-dots"
  }, Array.from({
    length: slidesCount
  }).map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: `dot ${currentIndex === i ? 'active' : ''}`,
    onClick: () => setCurrentIndex(i),
    "aria-label": `عرض الشهادات ${i + 1}`,
    "aria-pressed": currentIndex === i
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot-label"
  }, i + 1)))));
};

// ========== FAQ Component ==========
const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqs = [{
    question: "ما هو جرين بوستر وكيف يعمل؟",
    answer: "جرين بوستر هو سماد عضوي طبيعي 100% يحتوي على مزيج فريد من العناصر الغذائية والمعادن الأساسية التي تحتاجها النباتات. يعمل على تحسين امتصاص العناصر الغذائية، تقوية الجذور، وتسريع عملية التمثيل الضوئي."
  }, {
    question: "هل المنتج آمن لجميع أنواع النباتات؟",
    answer: "نعم، جرين بوستر آمن تماماً على جميع أنواع النباتات بما في ذلك الخضروات، الفواكه، الزهور، والنباتات المنزلية. تركيبته الطبيعية لا تحتوي على أي مواد كيميائية ضارة."
  }, {
    question: "متى أرى النتائج بعد الاستخدام؟",
    answer: "معظم المستخدمين يلاحظون تحسناً واضحاً خلال 7-10 أيام من أول استخدام. النتائج تشمل أوراق أكثر خضرة، نمو أسرع، وزيادة في الحيوية العامة للنبات."
  }, {
    question: "كيف أستخدم جرين بوستر؟",
    answer: "الاستخدام سهل جداً: امزج 50 جرام من جرين بوستر مع 10 لتر من الماء، ثم استخدم المحلول لري النباتات مرة كل أسبوعين. للنباتات الكبيرة، يمكن زيادة الكمية بنسبة طردية."
  }, {
    question: "هل يوجد ضمان على المنتج؟",
    answer: "نعم، نوفر ضمان استرداد الأموال خلال 30 يوم. إذا لم تكن راضياً بنسبة 100% عن النتائج، يمكنك إرجاع المنتج واسترداد كامل المبلغ بدون أسئلة."
  }, {
    question: "كم تدوم العبوة الواحدة؟",
    answer: "عبوة 10 كجم تكفي لحوالي 200 لتر من المحلول، وهو ما يكفي لري حديقة متوسطة الحجم لمدة 3-4 أشهر تقريباً حسب كثافة الاستخدام."
  }, {
    question: "هل يمكن استخدامه مع أسمدة أخرى؟",
    answer: "نعم، جرين بوستر متوافق مع معظم الأسمدة الأخرى. ومع ذلك، ننصح باستخدامه بمفرده أولاً لرؤية النتائج الكاملة، ثم يمكن دمجه مع منتجات أخرى حسب الحاجة."
  }, {
    question: "هل التوصيل متوفر في جميع مدن المغرب؟",
    answer: "نعم، نوفر خدمة توصيل سريعة لجميع مدن المغرب. التوصيل مجاني للطلبات التي تتجاوز 500 درهم، وعادة ما يستغرق 2-4 أيام عمل."
  }];
  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "faq-container",
    style: {
      maxWidth: '900px',
      margin: '0 auto'
    }
  }, faqs.map((faq, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "faq-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: `faq-question ${activeIndex === index ? 'active' : ''}`,
    onClick: () => toggleFAQ(index)
  }, /*#__PURE__*/React.createElement("span", null, faq.question), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chevron-down text-success"
  })), /*#__PURE__*/React.createElement("div", {
    className: `faq-answer ${activeIndex === index ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-0"
  }, faq.answer)))));
};

// ========== Render Components ==========
const testimonialsRootEl = document.getElementById('testimonials-root');
if (testimonialsRootEl) {
  const testimonialsRoot = ReactDOM.createRoot(testimonialsRootEl);
  testimonialsRoot.render(/*#__PURE__*/React.createElement(TestimonialsSection, null));
}
const faqRootEl = document.getElementById('faq-root');
if (faqRootEl) {
  const faqRoot = ReactDOM.createRoot(faqRootEl);
  faqRoot.render(/*#__PURE__*/React.createElement(FAQSection, null));
}
