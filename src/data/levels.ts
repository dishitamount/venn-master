export interface LevelItem {
  id: string;
  text: string;
  correctZone: 'A' | 'B' | 'AB' | 'outside';
}

export interface Level {
  id: number;
  title: string;
  description: string;
  circleLabels: {
    A: string;
    B: string;
  };
  items: LevelItem[];
  points: number;
}

export const levels: Level[] = [
  {
    id: 1,
    title: "Fruits & Vegetables",
    description: "Classify items by color!",
    circleLabels: {
      A: "Red",
      B: "Green",
    },
    items: [
      { id: "1", text: "🍎 Apple", correctZone: "A" },
      { id: "2", text: "🥬 Lettuce", correctZone: "B" },
      { id: "3", text: "🍅 Tomato", correctZone: "A" },
      { id: "4", text: "🍊 Orange", correctZone: "outside" },
      { id: "5", text: "🥒 Cucumber", correctZone: "B" },
      { id: "6", text: "🍌 Banana", correctZone: "outside" },
    ],
    points: 100,
  },
  {
    id: 2,
    title: "Number Properties",
    description: "Classify numbers correctly!",
    circleLabels: {
      A: "Even",
      B: "Prime",
    },
    items: [
      { id: "1", text: "2", correctZone: "AB" },
      { id: "2", text: "3", correctZone: "B" },
      { id: "3", text: "6", correctZone: "A" },
      { id: "4", text: "7", correctZone: "B" },
      { id: "5", text: "9", correctZone: "outside" },
      { id: "6", text: "4", correctZone: "A" },
      { id: "7", text: "1", correctZone: "outside" },
    ],
    points: 150,
  },
  {
    id: 3,
    title: "Animals",
    description: "Sort animals by their traits!",
    circleLabels: {
      A: "Can Fly",
      B: "Has Fur",
    },
    items: [
      { id: "1", text: "🦅 Eagle", correctZone: "A" },
      { id: "2", text: "🐕 Dog", correctZone: "B" },
      { id: "3", text: "🐟 Fish", correctZone: "outside" },
      { id: "4", text: "🦇 Bat", correctZone: "AB" },
      { id: "5", text: "🦊 Fox", correctZone: "B" },
      { id: "6", text: "🐍 Snake", correctZone: "outside" },
      { id: "7", text: "🦉 Owl", correctZone: "A" },
    ],
    points: 200,
  },
  {
    id: 4,
    title: "Sports Equipment",
    description: "Categorize sports gear!",
    circleLabels: {
      A: "Uses Ball",
      B: "Indoor Sport",
    },
    items: [
      { id: "1", text: "⚽ Soccer Ball", correctZone: "A" },
      { id: "2", text: "🏸 Badminton", correctZone: "B" },
      { id: "3", text: "🏀 Basketball", correctZone: "AB" },
      { id: "4", text: "🎿 Skis", correctZone: "outside" },
      { id: "5", text: "🏓 Ping Pong", correctZone: "AB" },
      { id: "6", text: "🎳 Bowling", correctZone: "AB" },
      { id: "7", text: "🏈 Football", correctZone: "A" },
    ],
    points: 250,
  },
  {
    id: 5,
    title: "Music & Instruments",
    description: "Classify musical instruments!",
    circleLabels: {
      A: "String Instrument",
      B: "Uses Electricity",
    },
    items: [
      { id: "1", text: "🎸 Electric Guitar", correctZone: "AB" },
      { id: "2", text: "🎹 Keyboard", correctZone: "B" },
      { id: "3", text: "🥁 Drums", correctZone: "outside" },
      { id: "4", text: "🎻 Violin", correctZone: "A" },
      { id: "5", text: "🎤 Microphone", correctZone: "B" },
      { id: "6", text: "🪕 Banjo", correctZone: "A" },
      { id: "7", text: "🎺 Trumpet", correctZone: "outside" },
    ],
    points: 300,
  },
];
