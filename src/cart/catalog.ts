export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "كشري",
    price: 80,
    image: "/koshery.png",
    description: "كشري مصري بطعم الأكل وسنينه الأصيل",
  },
  {
    id: "2",
    name: "ملوخية",
    price: 60,
    image: "/molkia.png",
    description: "ملوخية مصرية طازجة",
  },
  {
    id: "3",
    name: "محشي",
    price: 120,
    image: "/mashy.png",
    description: "محشي مشكل على الطريقة المصرية",
  },
];
