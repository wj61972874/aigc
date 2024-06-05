export const RECEVIER = "刘岩";
export const LETTERS_MAXLENGTH = 200;

export const FANS_LETTER_PROMPTS = `请帮我写一封给音乐剧演员${RECEVIER}的信，字数在${LETTERS_MAXLENGTH}字左右`;

export const FANS_LETTER_QUESTIONS = [
  {
    id: 1,
    question: "你想在信中表达的主题是？",
    require: true,
    prePrompt: "表达",
    promptSort: 9,
    componentType: "select",
    answers: [
      {
        option: "A",
        answer: "对演员的表演或歌声的赞美",
      },
      {
        option: "B",
        answer: "对演员的努力和付出的认可",
      },
      {
        option: "C",
        answer: "对演员的祝福和支持",
      },
    ],
  },
  {
    id: 2,
    require: true,
    question: "你最喜欢刘岩的音乐剧是？",
    prePrompt: "尽量可以引用刘岩的音乐剧",
    sufPrompt: "一句台词",
    promptSort: 7,
    componentType: "select",
    answers: [
      {
        option: "A",
        answer: "《粉丝来信》",
      },
      {
        option: "B",
        answer: "《道林格雷的画像》",
      },
      {
        option: "C",
        answer: "《唐人街探案》",
      },
      {
        option: "D",
        answer: "《女神在看》",
      },

      {
        option: "E",
        answer: "《世界的尽头》",
      },
      {
        option: "F",
        answer: "《嫌疑人X的献身》",
      },
    ],
  },
  {
    id: 3,
    require: true,
    question: "你希望信件的语气是？",
    prePrompt: "希望用",
    sufPrompt: "的语气",
    promptSort: 10,
    componentType: "select",
    answers: [
      {
        option: "A",
        answer: "正式而庄重",
      },
      {
        option: "B",
        answer: "轻松而幽默",
      },
      {
        option: "C",
        answer: "温暖而真诚",
      },
    ],
  },
  {
    id: 4,
    require: true,
    question: "你希望信件配图的风格是？",
    prePrompt: "希望信件的语气是",
    componentType: "select",
    answers: [
      {
        option: "A",
        answer: "温馨浪漫，充满温暖的色彩和图案",
      },
      {
        option: "B",
        answer: "活泼可爱，添加一些有趣的插画或者贴纸",
      },
      {
        option: "C",
        answer: "典雅简约，以简洁清晰的排版和设计为主",
      },
    ],
  },
  {
    id: 5,
    require: true,
    question: "你希望信件的结尾是？",
    prePrompt: "希望信件的结尾",
    promptSort: 8,
    componentType: "select",
    answers: [
      {
        option: "A",
        answer: "真诚地表达我的祝福和支持",
      },
      {
        option: "B",
        answer: "期待能够与演员有更多的交流和互动",
      },
      {
        option: "C",
        answer: "表达我对演员未来的期待和祝愿",
      },
    ],
  },
  {
    id: 6,
    require: false,
    question: "你对刘岩有没有什么特别的话要说？",
    prePrompt: "请在信件内容最后原原本本插入下面这句话-我想对你说：",
    promptSort: 6,
    componentType: "textarea",
    maxLength: 30,
    answers: [],
  },
  {
    id: 7,
    require: true,
    question: "观看刘岩的年份",
    componentType: "options",
    answers: [
      {
        label: "2024",
        value: "2024",
      },
      {
        label: "2023",
        value: "2023",
      },
      {
        label: "2022",
        value: "2022",
      },
      {
        label: "2021",
        value: "2021",
      },
    ],
  },
  {
    id: 8,
    require: false,
    question: "落款的人名",
    componentType: "input",
    maxLength: 10,
    answers: [],
  },
];
