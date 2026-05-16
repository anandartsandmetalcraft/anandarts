export interface Product {
    id: string | number;
    name: string;
    material: string;
    category: string;
    size: string;
    price: number;
    img: string;
    tag: string;
    stock?: number;
    description?: string;
    thumbnails?: string[];
    compareAt?: number | null;
    slug?: string;
    couponCode?: string | null;
  }
  
  export const ALL_PRODUCTS: Product[] = [
    { 
      id: 1, 
      name: "Antique Brass Nataraja", 
      material: "Brass", 
      category: "Brass", 
      size: "12-18\"", 
      price: 36000, 
      img: "https://images.unsplash.com/photo-1614725916035-717a61d15be8?auto=format&fit=crop&w=800&q=80", 
      tag: "Best Seller",
      description: "A masterful representation of the cosmic dancer, Lord Shiva, cast in high-grade temple brass. This piece captures the divine balance between destruction and creation.",
      thumbnails: [
        "https://images.unsplash.com/photo-1614725916035-717a61d15be8?w=400&q=80",
        "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400&q=80",
        "https://images.unsplash.com/photo-1600096956795-f9a888c30dd4?w=400&q=80"
      ]
    },
    { 
      id: 2, 
      name: "Bronze Ganesha Murthi", 
      material: "Bronze", 
      category: "Divine Gods", 
      size: "6-12\"", 
      price: 71200, 
      img: "/idol.png", 
      tag: "Limited",
      description: "The Lord of Beginnings, exquisitely detailed in heavy bronze with an antique finish. Perfectly sized for sanctifying your home altar.",
      thumbnails: [
        "/idol.png",
        "https://images.unsplash.com/photo-1621360841013-c7683c659ec6?w=400&q=80"
      ]
    },
    { 
      id: 3, 
      name: "Pure Silver Radha Krishna", 
      material: "Silver", 
      category: "Divine Gods", 
      size: "18-24\"", 
      price: 100000, 
      img: "/hero_bg.png", 
      tag: "New Arrival",
      description: "A symbol of eternal love, cast in 925 sterling silver with intricate detailing on the ornaments and floral back-arch.",
      thumbnails: [
        "/hero_bg.png",
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80"
      ]
    },
    { 
      id: 4, 
      name: "Copper Vedic Deepam", 
      material: "Copper", 
      category: "Copper", 
      size: "6-12\"", 
      price: 9600, 
      img: "https://images.unsplash.com/photo-1614725965646-95fc13c32fd2?auto=format&fit=crop&w=800&q=80", 
      tag: "",
      description: "Traditional Five-layered Deepam handcrafted in pure copper. Engineered for longevity and a steady sacred flame.",
      thumbnails: ["https://images.unsplash.com/photo-1614725965646-95fc13c32fd2?w=400&q=80"]
    },
    { 
      id: 5, 
      name: "Tanjore Gold Leaf Board", 
      material: "Wood & Gold", 
      category: "Vintage", 
      size: "18-24\"", 
      price: 27200, 
      img: "https://images.unsplash.com/photo-1574880998982-1e9a3b2b800e?auto=format&fit=crop&w=800&q=80", 
      tag: "",
      description: "Classical South Indian Tanjore painting featuring primary deities embellished with 22K gold leaf and semi-precious stones.",
      thumbnails: ["https://images.unsplash.com/photo-1574880998982-1e9a3b2b800e?w=400&q=80"]
    },
    { 
      id: 6, 
      name: "Stone Meditating Buddha", 
      material: "Stone", 
      category: "Vintage", 
      size: "Life Size", 
      price: 448000, 
      img: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80", 
      tag: "Masterpiece",
      description: "A monumental serene Buddha carved from a single block of volcanic stone. Designed for outdoor meditation gardens or spacious halls.",
      thumbnails: ["https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=400&q=80"]
    },
    { 
      id: 7, 
      name: "Sacred Brass Gomatha", 
      material: "Brass", 
      category: "Brass", 
      size: "12-18\"", 
      price: 23200, 
      img: "https://images.unsplash.com/photo-1614725916035-717a61d15be8?auto=format&fit=crop&w=800&q=80", 
      tag: "",
      description: "The Kamadhenu or Gomatha, representing prosperity and nourishment, cast in high-quality brass with a fine mirror finish.",
      thumbnails: ["https://images.unsplash.com/photo-1614725916035-717a61d15be8?w=400&q=80"]
    },
    { 
      id: 8, 
      name: "Silver Plated Thali Set", 
      material: "Silver", 
      category: "Brass", 
      size: "6-12\"", 
      price: 32800, 
      img: "/idol.png", 
      tag: "",
      description: "A complete set of ritual pooja items, from the plate to the lamps, heavily silver-plated on a durable copper base.",
      thumbnails: ["/idol.png"]
    }
  ];
